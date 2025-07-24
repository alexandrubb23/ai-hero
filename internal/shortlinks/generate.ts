import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import dedent from "dedent";
import {
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import path from "path";

const shortlinks: Record<string, string> = JSON.parse(
  readFileSync(
    path.join(
      import.meta.dirname,
      "./shortlinks.json",
    ),
    "utf-8",
  ).trim(),
);

const shortlinkValuesSet = new Set(
  Object.values(shortlinks),
);

const examplesOnDiskWithoutShortlinks = readdirSync(
  path.join(process.cwd(), "examples"),
  {
    recursive: true,
  },
)
  .filter(
    (p): p is string =>
      typeof p === "string" &&
      !p.includes("TODO") &&
      p.endsWith("main.ts"),
  )
  .map((p) => path.join("examples", p))
  .filter((shortlink) => {
    return !shortlinkValuesSet.has(shortlink);
  });

const newShortlinks = shortlinks;

for (const filePath of examplesOnDiskWithoutShortlinks) {
  const prompt = dedent`
    Given the filePath provided, return a shortlink.
    Use the examples as inspiration.
    Return only the shortlink.

    <examples>
      ${Object.entries(shortlinks)
        .map(([shortlink, filePath]) => {
          return `
          <example>
            <file-path>${filePath}</file-path>
            <shortlink>${shortlink}</shortlink>
          </example>
        `;
        })
        .join("\n")}
    </examples>

    <file-path>${filePath}</file-path>
  `;

  const { text } = await generateText({
    model: anthropic("claude-3-5-haiku-latest"),
    prompt,
  });

  const shortlink = text.trim();

  if (newShortlinks[shortlink]) {
    console.error(
      `Shortlink already exists: ${shortlink} -> ${filePath}`,
    );
    process.exitCode = 1;
  } else {
    console.log(
      `Adding shortlink: ${shortlink} -> ${filePath}`,
    );
    newShortlinks[shortlink] = filePath;
  }
}

writeFileSync(
  path.join(import.meta.dirname, "./shortlinks.json"),
  JSON.stringify(newShortlinks, null, 2) + "\n",
);
