import type { Message } from "ai";
import { z } from "zod";
import { streamText, createDataStreamResponse } from "ai";
import { NextResponse } from "next/server";
import { model } from "~/model";
import { searchSerper } from "~/serper";
import { auth } from "~/server/auth";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = (await request.json()) as {
    messages: Array<Message>;
  };

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return createDataStreamResponse({
    execute: async (dataStream) => {
      const { messages } = body;

      const result = streamText({
        model,
        messages,
        maxSteps: 10,
        system: `You are a helpful AI assistant that can search the web to provide accurate, up-to-date information. 

Always use the search web tool to find current information before answering questions. 

IMPORTANT: When providing information from search results, you MUST cite your sources using proper markdown link formatting: [descriptive title](full_url). Never show raw URLs - always format them as clickable markdown links.

Examples of proper citation format:
- [OpenAI Announces GPT-4](https://openai.com/blog/gpt-4)
- [Latest Climate Change Report](https://example.com/climate-report)

Be comprehensive in your responses and include multiple sources when relevant. Format ALL URLs as markdown links throughout your entire response.`,
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
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: (e) => {
      console.error(e);
      return "Oops, an error occured!";
    },
  });
}
