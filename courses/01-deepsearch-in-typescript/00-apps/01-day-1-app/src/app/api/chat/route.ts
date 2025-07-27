import type { Message } from "ai";
import { appendResponseMessages, createDataStream, streamText } from "ai";
import { eq } from "drizzle-orm";
import { Langfuse } from "langfuse";
import { z } from "zod";
import { env } from "~/env";
import { model } from "~/model";
import { searchSerper } from "~/serper";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import {
  createStream,
  getChat,
  getStreamsByChatId,
  upsertChat,
} from "~/server/db/queries";
import { chats } from "~/server/db/schema";
import { getStreamContext } from "~/server/stream-context";

export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Initialize Langfuse client with environment
  const langfuse = new Langfuse({
    environment: env.NODE_ENV,
  });

  const body = (await request.json()) as {
    messages: Array<Message>;
    chatId: string;
    isNewChat: boolean;
  };

  const { messages, chatId, isNewChat } = body;

  if (!messages.length) {
    return new Response("No messages provided", { status: 400 });
  }

  // If this is a new chat, create it with the user's message
  if (isNewChat) {
    await upsertChat({
      userId: session.user.id,
      chatId: chatId,
      title: messages[messages.length - 1]!.content.slice(0, 50) + "...",
      messages: messages, // Only save the user's message initially
    });
  } else {
    // Verify the chat belongs to the user
    const chat = await db.query.chats.findFirst({
      where: eq(chats.id, chatId),
    });
    if (!chat || chat.userId !== session.user.id) {
      return new Response("Chat not found or unauthorized", { status: 404 });
    }
  }

  // Create a stream in the database
  const streamId = await createStream({ chatId });

  const stream = createDataStream({
    execute: async (dataStream) => {
      // If this is a new chat, send the chat ID to the frontend
      if (isNewChat) {
        dataStream.writeData({
          type: "NEW_CHAT_CREATED",
          chatId: chatId,
        });
      }

      // Create Langfuse trace with user and session information
      const trace = langfuse.trace({
        sessionId: chatId,
        name: "chat",
        userId: session.user.id,
        metadata: {
          isNewChat,
          messageCount: messages.length,
        },
      });

      const result = streamText({
        model,
        messages,
        maxSteps: 10,
        experimental_telemetry: {
          isEnabled: true,
          functionId: "agent",
          metadata: {
            langfuseTraceId: trace.id,
            userId: session.user.id,
            chatId: chatId,
            isNewChat,
          },
        },
        system: `You are a helpful AI assistant with access to real-time web search capabilities. When answering questions:

1. Always search the web for up-to-date information when relevant
2. ALWAYS format URLs as markdown links using the format [title](url)
3. Be thorough but concise in your responses
4. If you're unsure about something, search the web to verify
5. When providing information, always include the source where you found it using markdown links
6. Never include raw URLs - always use markdown link format

Remember to use the searchWeb tool whenever you need to find current information.`,
        tools: {
          searchWeb: {
            parameters: z.object({
              query: z.string().describe("The query to search the web for"),
            }),
            execute: async ({ query }, { abortSignal }) => {
              const results = await searchSerper(
                { q: query, num: 10 },
                abortSignal,
              );

              return results.organic.map((result) => ({
                title: result.title,
                link: result.link,
                snippet: result.snippet,
              }));
            },
          },
        },
        onFinish: async ({ response, usage }) => {
          // Merge the existing messages with the response messages
          const updatedMessages = appendResponseMessages({
            messages,
            responseMessages: response.messages,
          });

          const lastMessage = messages[messages.length - 1];
          if (!lastMessage) {
            return;
          }

          // Log to Langfuse
          if (trace) {
            trace.generation({
              name: "chat-completion",
              model: "gemini-2.0-flash-exp",
              input: messages,
              output: response.messages,
              usage: {
                input: usage?.promptTokens,
                output: usage?.completionTokens,
                total: usage?.totalTokens,
              },
              metadata: {
                maxSteps: 10,
                responseMessageCount: response.messages.length,
              },
            });
          }

          // Save the complete chat history
          await upsertChat({
            userId: session.user.id,
            chatId: chatId,
            title: lastMessage.content.slice(0, 50) + "...",
            messages: updatedMessages,
          });

          // Flush the trace to Langfuse
          await langfuse.flushAsync();
        },
      });

      // Consume the stream to prevent it from being cut off
      result.consumeStream();

      result.mergeIntoDataStream(dataStream);
    },
  });

  const streamContext = getStreamContext();

  if (streamContext) {
    return new Response(
      await streamContext.resumableStream(streamId, () => stream),
    );
  } else {
    return new Response(stream);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new Response("Missing chatId", {
      status: 400,
    });
  }

  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  // Initialize Langfuse client with environment
  const langfuse = new Langfuse({
    environment: env.NODE_ENV,
  });

  // Create Langfuse trace for stream resumption
  const trace = langfuse.trace({
    name: "stream-resumption",
    userId: userId,
    sessionId: chatId,
    metadata: {
      chatId,
    },
  });

  // Check that the user is the owner of the chat and get streams
  let streams;
  try {
    streams = await getStreamsByChatId({ chatId, userId });
  } catch (error) {
    trace?.update({
      output: { error: "Chat not found or access denied" },
    });
    return new Response("Chat not found or access denied", { status: 404 });
  }

  const recentStream = streams.at(-1);

  if (!recentStream) {
    return new Response("No stream found", {
      status: 404,
    });
  }

  const streamContext = getStreamContext();

  const emptyDataStream = createDataStream({
    execute: async (dataStream) => {},
  });

  if (streamContext) {
    const resumedStream = await streamContext.resumableStream(
      recentStream.id,
      () => emptyDataStream,
    );

    // If the stream was resumed, return the stream
    if (resumedStream) {
      return new Response(resumedStream, {
        status: 200,
      });
    }
  }

  // Use existing db helpers to get the most recent message
  const chat = await getChat({
    chatId,
    userId,
  });

  if (!chat) {
    return new Response("Chat not found", { status: 404 });
  }

  const mostRecentMessage = chat.messages.at(-1);

  // If there are no messages, return an empty stream
  if (!mostRecentMessage) {
    return new Response(emptyDataStream, {
      status: 200,
    });
  }

  // If the most recent message is not an assistant message,
  // return an empty stream
  if (mostRecentMessage.role !== "assistant") {
    return new Response(emptyDataStream, {
      status: 200,
    });
  }

  // If the stream was not resumed, create a new stream which
  // writes some data to the stream to append the most recent message
  const restoredStream = createDataStream({
    execute: (buffer) => {
      buffer.writeData({
        type: "append-message",
        message: JSON.stringify(mostRecentMessage),
      });
    },
  });

  trace?.update({
    output: {
      action: "restored-stream",
      messageRestored: true,
    },
  });

  // Flush the trace to Langfuse
  await langfuse.flushAsync();

  // Return the stream
  return new Response(restoredStream, { status: 200 });
}
