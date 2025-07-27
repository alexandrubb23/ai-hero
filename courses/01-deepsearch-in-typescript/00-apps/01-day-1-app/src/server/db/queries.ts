import type { Message } from "ai";
import { and, eq } from "drizzle-orm";
import { db } from ".";
import { chats, messages, streams } from "./schema";

export const upsertChat = async (opts: {
  userId: string;
  chatId: string;
  title: string;
  messages: Message[];
}) => {
  const { userId, chatId, title, messages: newMessages } = opts;

  // First, check if the chat exists and belongs to the user
  const existingChat = await db.query.chats.findFirst({
    where: eq(chats.id, chatId),
  });

  if (existingChat) {
    // If chat exists but belongs to a different user, throw error
    if (existingChat.userId !== userId) {
      throw new Error("Chat ID already exists under a different user");
    }
    // Delete all existing messages
    await db.delete(messages).where(eq(messages.chatId, chatId));
  } else {
    // Create new chat
    await db.insert(chats).values({
      id: chatId,
      userId,
      title,
    });
  }

  // Insert all messages
  await db.insert(messages).values(
    newMessages.map((message, index) => ({
      chatId,
      role: message.role,
      parts: message.parts,
      order: index,
    })),
  );

  return { id: chatId };
};

export const getChat = async (opts: { userId: string; chatId: string }) => {
  const { userId, chatId } = opts;

  const chat = await db.query.chats.findFirst({
    where: and(eq(chats.id, chatId), eq(chats.userId, userId)),
    with: {
      messages: {
        orderBy: (messages, { asc }) => [asc(messages.order)],
      },
    },
  });

  if (!chat) {
    return null;
  }

  return {
    ...chat,
    messages: chat.messages.map((message) => ({
      id: message.id.toString(), // Convert serial ID to string for AI SDK
      role: message.role,
      content: "", // AI SDK requires content field, but we primarily use parts
      parts: message.parts,
    })),
  };
};

export const getChats = async (opts: { userId: string }) => {
  const { userId } = opts;

  return await db.query.chats.findMany({
    where: eq(chats.userId, userId),
    orderBy: (chats, { desc }) => [desc(chats.updatedAt)],
  });
};

export const createStream = async (opts: { chatId: string }) => {
  const { chatId } = opts;

  const streamId = crypto.randomUUID();

  await db.insert(streams).values({
    id: streamId,
    chatId,
  });

  return streamId;
};

export const getStreamsByChatId = async (opts: {
  chatId: string;
  userId: string;
}) => {
  const { chatId, userId } = opts;

  // First verify that the user owns the chat
  const chat = await db.query.chats.findFirst({
    where: and(eq(chats.id, chatId), eq(chats.userId, userId)),
  });

  if (!chat) {
    throw new Error("Chat not found or access denied");
  }

  // Return all streams for this chat
  return await db.query.streams.findMany({
    where: eq(streams.chatId, chatId),
    orderBy: (streams, { asc }) => [asc(streams.createdAt)],
  });
};
