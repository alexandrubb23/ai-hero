import {
  createDataStreamResponse,
  streamText,
  type Message,
} from "ai";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { flagshipAnthropicModel } from "../../../_shared/models.ts";

export const honoApp = new Hono();

honoApp.use(cors());

honoApp.post("/api/chat", async (ctx) => {
  const { messages }: { messages: Message[] } =
    await ctx.req.json();

  return createDataStreamResponse({
    execute: async (dataStream) => {
      const interval = setInterval(() => {
        dataStream.writeMessageAnnotation({
          hello: "world",
        });
      }, 100);
      const result = streamText({
        model: flagshipAnthropicModel,
        messages,
        onFinish: () => {
          clearInterval(interval);
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
  });
});
