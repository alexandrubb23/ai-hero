import { embedMany } from "ai";
import { readFileSync, writeFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { lmstudio } from "../examples/_shared/models.ts";

const embeddingModel = lmstudio.textEmbeddingModel("");

const embedContent = async (contentDir: string) => {
  const contentFiles = (await readdir(contentDir))
    .filter((relativePath) =>
      relativePath.endsWith(".md"),
    )
    .map((filePath) => path.join(contentDir, filePath))
    .map((absoluteFilePath) => {
      const rawContent = readFileSync(
        absoluteFilePath,
        "utf-8",
      );

      return rawContent;
    });

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: contentFiles,
  });

  const vectorDatabase = contentFiles.map(
    (content, index) => ({
      content,
      vector: embeddings[index]!,
    }),
  );

  return vectorDatabase;
};

const datasetBase = path.join(
  process.cwd(),
  "../secret-datasets/datasets/total-typescript-content/chunks",
);

const vectorDatabase = await embedContent(
  path.join(datasetBase),
);

writeFileSync(
  path.join(datasetBase, `embeddings.json`),
  JSON.stringify(vectorDatabase, null, 2),
);
