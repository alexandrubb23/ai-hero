import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import dedent from "dedent";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { z } from "zod";
import { cacheModelInFs } from "../../vercel-ai-sdk/17-caching-TODO/cache-model-in-fs.ts";

const chunkingModel = cacheModelInFs(
  anthropic("claude-3-5-haiku-latest"),
);

const datasetLocation = path.resolve(
  process.cwd(),
  "../secret-datasets/datasets/total-typescript-content/content.json",
);

const outputLocation = path.join(
  process.cwd(),
  "../secret-datasets/datasets/total-typescript-content/chunks",
);

const content: {
  body: string | null;
  title: string | null;
  summary: string | null;
  slug: {
    _type: "slug";
    current: string;
  };
}[] = JSON.parse(
  readFileSync(datasetLocation, "utf-8"),
);

for (let i = 0; i < content.length; i++) {
  const entry = content[i]!;

  if (!entry.body) {
    continue;
  }

  try {
    const { object } = await generateObject({
      model: chunkingModel,
      system: dedent`
        You will be given an article in markdown formatting.
        Your task is to chunk the article into smaller parts.
        Each part should be a standalone piece of text,
        with related information grouped together.
        Do not change the text itself. Only split it into
        smaller chunks.
        Do not remove or modify codeblocks. They should be
        kept together with the text that describes them.
      `,
      prompt: entry.body,
      output: "array",
      schema: z.object({
        chunk: z
          .string()
          .describe("The chunk of text to return"),
        description: z.string().describe(
          dedent`
            Please give a short succinct context to situate
            this chunk within the overall document for the
            purposes of improving search retrieval of the
            chunk. Answer only with the succinct context
            and nothing else.
          `,
        ),
      }),
    });

    const entries = object.map((obj) => ({
      url: entry.slug.current,
      chunk: obj.chunk,
      description: obj.description,
    }));

    entries.forEach((entry, index) => {
      const filename = path.join(
        outputLocation,
        `${entry.url}-${index}.md`,
      );

      writeFileSync(
        filename,
        [entry.description, entry.chunk].join("\n\n"),
      );
    });

    console.log(`Processed ${entry.slug.current}`);
  } catch (e) {
    console.log(
      `Error processing ${entry.slug.current}`,
    );
  }
}
