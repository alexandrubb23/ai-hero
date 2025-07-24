import {
  cosineSimilarity,
  embedMany,
  type EmbedManyResult,
} from "ai";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { lmstudio } from "../../_shared/models.ts";

const SIMILARITY_THRESHOLD = 0.52;

const embeddingsModel =
  lmstudio.textEmbeddingModel("");

const datasetLocation = path.resolve(
  process.cwd(),
  "../secret-datasets/datasets/total-typescript-content/content.json",
);

const splitBodyText = (_input: string): string[] => {
  const input = removeHtmlTags(_input);
  // Split the text into code and non-code segments
  const segments: string[] = [];
  const codeBlockRegex = /```[\s\S]*?```/g;
  let lastIndex = 0;
  let match;

  while (
    (match = codeBlockRegex.exec(input)) !== null
  ) {
    // Add non-code segment
    if (match.index > lastIndex) {
      const textSegment = input.slice(
        lastIndex,
        match.index,
      );
      // Split text by sentences, preserve URLs, and filter empty strings
      const sentences = textSegment.split(
        /(?<=[.!?])\s+(?=\S)/,
      );
      sentences.forEach((sentence) => {
        if (sentence.trim()) {
          segments.push(sentence.trim());
        }
      });
    }
    // Add code block as a whole segment
    segments.push(match[0]);
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < input.length) {
    const textSegment = input.slice(lastIndex);
    const sentences = textSegment.split(
      /(?<=[.!?])\s+(?=\S)/,
    );
    sentences.forEach((sentence) => {
      if (sentence.trim()) {
        segments.push(sentence.trim());
      }
    });
  }

  return segments
    .map((segment) => segment.trim())
    .filter(Boolean);
};

const removeHtmlTags = (markdown: string): string => {
  return markdown.replace(/<[^>]*>/g, "");
};

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

const outputLocation = path.join(
  import.meta.dirname,
  "./output.local.md",
);

const output: { url: string; chunk: string }[] = [];

const BREAK_AFTER = 10;

for (let i = 0; i < content.length; i++) {
  if (i > BREAK_AFTER) {
    break;
  }

  const entry = content[i]!;
  if (!entry.body) {
    continue;
  }

  const chunks = splitBodyText(entry.body);

  let accumulatedChunk = "";

  for (let i = 0; i < chunks.length; i++) {
    if (!accumulatedChunk) {
      accumulatedChunk = chunks[i]!;
      continue;
    }

    const newChunk = chunks[i]!;
    const prevChunk = chunks[i - 1]!;

    const embeddings = await embedMany({
      values: [prevChunk, newChunk],
      model: embeddingsModel,
    });

    const [
      accumulatedChunkEmbedding,
      newChunkEmbedding,
    ] = embeddings.embeddings as [
      EmbedManyResult<string>["embeddings"][number],
      EmbedManyResult<string>["embeddings"][number],
    ];

    const similarity = cosineSimilarity(
      accumulatedChunkEmbedding,
      newChunkEmbedding,
    );

    if (similarity > SIMILARITY_THRESHOLD) {
      accumulatedChunk += "\n\n" + newChunk;
    } else {
      output.push({
        url: `https://www.typescriptlang.org/docs/${entry.slug.current}`,
        chunk: accumulatedChunk.trim(),
      });

      accumulatedChunk = newChunk;
    }
  }
}

writeFileSync(
  outputLocation,
  output
    .map(({ url, chunk }) => `${url}\n\n${chunk}`)
    .join("\n\n---\n\n"),
);
