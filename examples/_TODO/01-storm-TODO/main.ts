import { generateObject } from "ai";
import { z } from "zod";

const topic = `TypeScript`;

const { object: urls } = await generateObject({
  model,
  prompt: `
    I'm writing a Wikipedia page on the topic of ${topic}.
    Please identify some Wikipedia pages that are similar
    to this topic.
  `,
  output: "array",
  schema: z.object({
    url: z
      .string()
      .url()
      .describe(`The URL of the Wikipedia page.`),
  }),
});
