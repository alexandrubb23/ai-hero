import { createInterface } from "node:readline/promises";
import {
  readdir,
  mkdir,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getNextFolderNumber(): Promise<string> {
  const entries = await readdir(".", {
    withFileTypes: true,
  });
  const folders = entries.filter((entry) =>
    entry.isDirectory(),
  );
  const numberedFolders = folders.filter((folder) =>
    /^\d{2}-/.test(folder.name),
  );
  const numbers = numberedFolders.map((folder) =>
    parseInt(folder.name.split("-")[0]!),
  );
  const maxNumber = Math.max(0, ...numbers);
  return String(maxNumber + 1).padStart(2, "0");
}

function extractSlugAndId(
  url: string,
): { slug: string; id: string } | null {
  try {
    const urlObj = new URL(url);

    // Check if it's an aihero.dev URL
    if (urlObj.hostname !== "www.aihero.dev")
      return null;

    // Split the path into segments
    const segments = urlObj.pathname
      .split("/")
      .filter(Boolean);

    // Check if it's a workshop URL and has enough segments
    if (
      segments[0] !== "workshops" ||
      segments.length < 2
    )
      return null;

    // Get the last segment which contains the lesson
    const lessonSegment =
      segments[segments.length - 1];
    if (!lessonSegment) return null;

    // Split by the last dash to get slug and id
    const lastDashIndex =
      lessonSegment.lastIndexOf("-");
    if (lastDashIndex === -1) return null;

    const slug = lessonSegment.slice(0, lastDashIndex);
    const id = lessonSegment.slice(lastDashIndex + 1);

    if (!slug || !id) return null;

    return { slug, id };
  } catch {
    return null;
  }
}

async function createLessonFile(
  slug: string,
  id: string,
): Promise<void> {
  const folderNumber = await getNextFolderNumber();
  const folderName = `${folderNumber}-${slug}`;

  // Create the directory
  await mkdir(folderName, { recursive: true });

  // Create the article.md file with frontmatter
  const content = `---
id: lesson-${id}
---`;

  await writeFile(
    join(folderName, "article.md"),
    content,
  );
  console.log(`Created ${folderName}/article.md`);
}

async function processUrl(url: string): Promise<void> {
  const result = extractSlugAndId(url);
  if (!result) {
    console.error("Invalid URL format");
    return;
  }

  await createLessonFile(result.slug, result.id);
}

async function main() {
  while (true) {
    try {
      const url = await rl.question(
        "Enter URL (or press Ctrl+C to exit): ",
      );
      await processUrl(url);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
    }
  }
}

main().catch(console.error);

process.on("beforeExit", () => {
  rl.close();
});
