import { anthropic } from "@ai-sdk/anthropic";
import { log } from "@clack/prompts";
import {
  cosineSimilarity,
  embed,
  smoothStream,
  streamText,
  tool,
} from "ai";
import dedent from "dedent";
import {
  execSync,
  type ExecException,
} from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { mkdtemp } from "node:fs/promises";
import path from "node:path";
import { inspect } from "node:util";
import { z } from "zod";
import vectorDatabase from "../../../../secret-datasets/datasets/total-typescript-content/chunks/embeddings.json" with { type: "json" };
import { cliChat } from "../../_shared/cli-chat.ts";
import { lmstudio } from "../../_shared/models.ts";

const SIMILARITY_THRESHOLD = 0.6;

const embeddingModel = lmstudio.textEmbeddingModel("");

mkdirSync(
  path.join(import.meta.dirname, "tsplayground.local"),
  { recursive: true },
);

const takeFirstUnique =
  (num: number) => (arr: { content: string }[]) => {
    const contentSet = new Set<string>();

    for (const entry of arr) {
      if (contentSet.size === num) {
        break;
      }

      contentSet.add(entry.content);
    }

    return Array.from(contentSet);
  };

cliChat({
  intro: "Welcome to MattGPT!",
  answerQuestion: async (messages) => {
    const userMessages = messages
      .filter((message) => message.role === "user")
      .map((message) => message.content)
      .filter(
        (content) => typeof content === "string",
      );

    const embeddedQuestion = await embed({
      value: userMessages.join("\n"),
      model: embeddingModel,
    });

    const dbEntries = vectorDatabase
      .map((entry) => ({
        content: entry.content,
        similarity: cosineSimilarity(
          entry.vector,
          embeddedQuestion.embedding,
        ),
      }))
      .filter(
        (entry) =>
          entry.similarity > SIMILARITY_THRESHOLD,
      )
      .sort((a, b) => b.similarity - a.similarity);

    const contentToInclude =
      takeFirstUnique(20)(dbEntries);

    const message = messages.pop();

    messages.push({
      role: "user",
      content: dedent`
        <dataset>
          ${contentToInclude.join("\n\n")}
        </dataset>
    
        <question>
          ${message?.content}
        </question>
      `,
    });

    const result = streamText({
      model: anthropic("claude-3-5-haiku-latest"),
      toolCallStreaming: true,
      messages: messages,
      experimental_transform: smoothStream({
        chunking: "word",
      }),
      system: dedent`
        You are Matt Pocock, a helpful TypeScript expert
        from Oxford, UK.
        Answer only using the information in
        the <dataset> tags.
        Act as if you are the author of the dataset.
        The dataset is composed of articles from totaltypescript.com.
        Answer only the question asked. Do not elaborate.
        Use code samples.
        Answer the question in the <question> tags.
        If the information cannot be directly found in your context,
        respond with "I don't know. That's not in my dataset yet.".
        Return only the answer.
        Speak in short sentences. Use newlines often.
        Use the testTypeScriptCode tool to test TypeScript code.
        Use it to confirm your hypotheses about how TypeScript works.
      `,
      maxSteps: 10,
      onStepFinish(event) {
        event.toolResults.forEach((result) => {
          log.info("// " + result.args.filename);
          log.info(result.args.code);
          log.info(
            inspect(result.result, {
              depth: null,
              colors: true,
            }),
          );
        });
      },
      tools: {
        testTypeScriptCode: tool({
          description: dedent`
            Use this tool to test TypeScript code.
            The TS code will be run in TypeScript 5.8.
            You will get back the result of running tsc
            on the code.
          `,
          parameters: z.object({
            code: z
              .string()
              .describe("The TypeScript code to test"),
            filename: z
              .string()
              .describe(
                "The filename of the code, such as example.ts or example.tsx.",
              ),
            tsconfig: z.string().describe(dedent`
              The tsconfig.json file to use for the TypeScript code.
              `),
          }),
          execute: async ({
            code,
            filename,
            tsconfig,
          }) => {
            const dir = await mkdtemp(
              path.join(
                import.meta.dirname,
                "tsplayground.local/ts-",
              ),
            );

            const filePath = path.join(dir, filename);

            writeFileSync(filePath, code);

            const tsconfigPath = path.join(
              dir,
              "tsconfig.json",
            );

            writeFileSync(tsconfigPath, tsconfig);

            try {
              execSync(`tsc`, {
                cwd: dir,
                encoding: "utf-8",
              }).toString();

              // await rm(dir, {
              //   recursive: true,
              //   force: true,
              // });

              return {
                success: true,
                result: `No TypeScript error was detected in the code.`,
              };
            } catch (e) {
              // await rm(dir, {
              //   recursive: true,
              //   force: true,
              // });
              return {
                success: false,
                error: (e as ExecException).stdout,
              };
            }
          },
        }),
      },
    });

    return result;
  },
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
