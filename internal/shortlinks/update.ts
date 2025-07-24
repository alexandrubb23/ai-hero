import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(
  fileURLToPath(import.meta.url),
);

const shortlinksPath = path.join(
  dirname,
  "./shortlinks.json",
);

const shortlinks: Record<string, string> = JSON.parse(
  readFileSync(shortlinksPath, "utf-8").trim(),
);

const getRenamedFiles = (): Map<string, string> => {
  // rename examples/rag/{01-what-is-rag-TODO => 01-what-is-rag}/.gitkeep (100%)
  // rename examples/rag/{01-what-is-rag-TODO => 01-what-is-rag}/article.md (97%)
  // rename examples/vercel-ai-sdk/{20-deepseek-reasoning-tokens => 20-deepseek-reasoning-tokens-TODO}/article.md (100%)
  // create mode 100644 examples/vercel-ai-sdk/20-deepseek-reasoning-tokens-TODO/main.ts
  // delete mode 100644 examples/vercel-ai-sdk/20-deepseek-reasoning-tokens/main.ts
  // create mode 100644 internal/shortlinks.json
  // create mode 100644 internal/shortlinks:update.ts
  const diff = execSync(
    `git diff --summary --cached`,
  ).toString();

  const paths = diff
    .trim()
    .split("\n")
    .filter(Boolean)
    .filter((line) => line.includes("rename"))
    .map((line) => {
      // Remove the percentage at the end of the line
      line = line.replace(/\s*\(\d+%\)$/, "");

      const match = line.match(
        /rename (.*?){(.+?) => (.+?)}(.*)/,
      );
      if (!match) return null;
      const [
        ,
        prefix,
        oldSegment,
        newSegment,
        suffix,
      ] = match;
      const oldPath = prefix! + oldSegment + suffix;
      const newPath = prefix! + newSegment + suffix;

      return { oldPath, newPath };
    })
    .filter((m) => m !== null);

  return new Map(
    paths.map((m) => [m.oldPath, m.newPath]),
  );
};

const renamedFiles = getRenamedFiles();

const newShortlinks: Record<string, string> = {};

for (const [shortlink, target] of Object.entries(
  shortlinks,
)) {
  if (renamedFiles.has(target)) {
    newShortlinks[shortlink] =
      renamedFiles.get(target)!;
  } else {
    newShortlinks[shortlink] = target;
  }
}

writeFileSync(
  shortlinksPath,
  JSON.stringify(newShortlinks, null, 2) + "\n",
);

execSync(`git add ${shortlinksPath}`);
