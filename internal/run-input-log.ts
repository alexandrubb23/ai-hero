import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { execSync } from "child_process";
import { watch } from "chokidar";
import dedent from "dedent";
import {
  existsSync,
  readFileSync,
  writeFileSync,
} from "fs";
import path from "path";

const inputLogLocation = path.join(
  import.meta.dirname,
  "./log/input-log.md",
);

const commonTermsLocation = path.join(
  import.meta.dirname,
  "./log/common-terms.md",
);

const outputLogLocation = path.join(
  import.meta.dirname,
  "./log/log.md",
);

if (!existsSync(inputLogLocation)) {
  writeFileSync(inputLogLocation, "");
}

const tidyUpTranscript = async (contents: string) => {
  const { text } = await generateText({
    model: anthropic("claude-3-5-haiku-latest"),
    system: dedent`
      Clean up the transcript inside <transcript> tags.
      Do not edit the words,
      only the formatting and any incorrect transcriptions.
      Turn long-form numbers to short-form:
      One hundred and twenty-three -> 123
      Three hundred thousand, four hundred and twenty two -> 300,422
      Add punctuation where necessary.
      Wrap any references to code in backticks.
      Return the cleaned up text inside <output> tags.
      Include links as-is - do not modify links.
      
      Common terms:
      ${readFileSync(commonTermsLocation, "utf-8")}
    `,
    prompt: `<transcript>${contents}</transcript>`,
  });

  // Return the text inside the <output> tags
  return text
    .match(/<output>([\s\S]+)<\/output>/)![1]!
    .trim();
};

execSync(`code ${inputLogLocation}`);

const run = async () => {
  const watcher = watch(inputLogLocation);

  watcher.on("change", async () => {
    const fileContents = readFileSync(
      inputLogLocation,
      "utf-8",
    );

    if (!fileContents) {
      return;
    }

    console.log("📝 Input log changed");
    writeFileSync(inputLogLocation, "");

    const startTime = Date.now();
    const cleanedContents =
      await tidyUpTranscript(fileContents);
    const duration = Math.ceil(Date.now() - startTime);

    console.log(
      `✨ Transcript cleaned up in ${duration}ms`,
    );

    const outputLogContents = readFileSync(
      outputLogLocation,
      "utf-8",
    );

    let trimmedOutputLog = outputLogContents.trim();

    if (trimmedOutputLog.endsWith("---")) {
      trimmedOutputLog = trimmedOutputLog
        .slice(0, trimmedOutputLog.lastIndexOf("---"))
        .trim();
    }

    const newContents =
      [
        trimmedOutputLog,
        "---",
        cleanedContents?.trim(),
      ].join("\n\n") + "\n";

    writeFileSync(outputLogLocation, newContents);
  });
};

run().catch(console.error);
