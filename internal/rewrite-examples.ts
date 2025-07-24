import * as fs from "fs/promises";
import * as path from "path";

async function processReadmeFile(readmePath: string) {
  try {
    const readmeContent = await fs.readFile(
      readmePath,
      "utf-8",
    );
    const [, articleContent] = readmeContent.split(
      "## Description",
    );

    if (articleContent) {
      const articlePath = path.join(
        path.dirname(readmePath),
        "article.md",
      );
      await fs.writeFile(
        articlePath,
        articleContent.trim(),
      );
      console.log(`Processed ${readmePath}`);
    } else {
      console.log(
        `No description found in ${readmePath}`,
      );
    }
  } catch (err) {
    console.error(
      `Error processing ${readmePath}:`,
      err,
    );
  }
}

async function processDirectory(dirPath: string) {
  try {
    const entries = await fs.readdir(dirPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (
        entry.isFile() &&
        /^readme\.md$/i.test(entry.name)
      ) {
        await processReadmeFile(fullPath);
      }
    }
  } catch (err) {
    console.error(
      `Error processing directory ${dirPath}:`,
      err,
    );
  }
}

const examplesDir = path.join(
  process.cwd(),
  "examples",
);
processDirectory(examplesDir);
