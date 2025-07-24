import {
  streamText,
  tool,
  type CoreMessage,
} from "ai";
import * as fs from "fs/promises";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { join } from "path";
import { z } from "zod";
import {
  flagshipAnthropicModel,
  smallToolCallingModel,
} from "../../../_shared/models.ts";
import dedent from "dedent";

export const honoApp = new Hono();

honoApp.use(cors());

const DB_PATH = join(
  import.meta.dirname,
  "db.local.json",
);

// Database helper functions
const readDb = async (): Promise<
  Record<string, string | number>
> => {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    await fs.writeFile(DB_PATH, JSON.stringify({}));
    return {};
  }
};

const writeDb = async (
  data: Record<string, string | number>,
) => {
  await fs.writeFile(
    DB_PATH,
    JSON.stringify(data, null, 2),
  );
};

honoApp.post("/api/chat", async (ctx) => {
  const { messages }: { messages: CoreMessage[] } =
    await ctx.req.json();

  const mostRecentMessage =
    messages[messages.length - 1]!;

  if (typeof mostRecentMessage.content === "string") {
    mostRecentMessage.content = `<working-memory>${JSON.stringify(await readDb(), null, 2)}<
    /working-memory>\n\n${mostRecentMessage.content}`;
  }

  const result = await streamText({
    model: flagshipAnthropicModel,
    system: dedent`
      You are a helpful assistant.
      Your job is to learn and remember things.
      You can store information that will be placed in your working memory.
      You will receive the current working memory as part of each user message.
      Do not ask to update the working memory, just go ahead and do it.
      Do not talk about the working memory.
      Pretend you do not know the working memory exists.
    `,
    messages,
    tools: {
      updateWorkingMemory: tool({
        description: `Upsert the working memory with a key-value pair.`,
        parameters: z.object({
          key: z
            .string()
            .describe(
              "The key to update in the working memory. ",
            ),
          value: z
            .string()
            .describe(
              "Use when you want to add or update a key.",
            )
            .describe(
              "The value to set for the key in the working memory. " +
                "Use an empty string to delete the key.",
            ),
        }),
        execute: async ({ key, value }) => {
          const db = await readDb();
          if (!value) {
            delete db[key];
          } else {
            db[key] = value;
          }
          await writeDb(db);
          return `Updated successfully.`;
        },
      }),
    },
    maxSteps: 10,
  });

  return result.toDataStreamResponse();
});
