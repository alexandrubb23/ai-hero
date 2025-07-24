import { glob, readFile } from "node:fs/promises";

const [articlesGlob] = process.argv.slice(2);

if (!articlesGlob) {
  console.error("No articles glob provided.");
  process.exit(1);
}

const inputPathsAsyncIterator =
  await glob(articlesGlob);

const articlePaths = [];

for await (const path of inputPathsAsyncIterator) {
  articlePaths.push(path);
}

articlePaths.sort();

const articles = [];

for (const articlePath of articlePaths) {
  const article = await readFile(articlePath, "utf-8");
  articles.push(article);
}

console.log(articles.join("\n\n---\n\n"));
