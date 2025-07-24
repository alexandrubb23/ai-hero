import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import dedent from "dedent";
import { z } from "zod";

export const main = async () => {
  const result = await streamText({
    model: anthropic("claude-3-7-sonnet-20250219"),
    tools: {
      think: {
        description: dedent`
          Use the tool to think about something.
          It will not obtain new information or change the
          database, but just append the thought to the log.
          Use it when complex reasoning or some cache memory
          is needed.`,
        parameters: z.object({
          thought: z
            .string()
            .describe("A thought to think about."),
        }),
        execute: async (args) => {
          return {
            thought: args.thought,
          };
        },
      },
    },
    maxSteps: 10,
  });

  return result;
};
