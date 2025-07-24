import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import dedent from "dedent";
import { glob, readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { createInterface } from "node:readline/promises";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const [seriesName, articlesGlob] =
  process.argv.slice(2);

if (!seriesName) {
  console.error("No series name provided.");
  process.exit(1);
}

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

const articles: {
  dirname: string;
  filename: string;
  contents: string;
}[] = [];

for (const articlePath of articlePaths) {
  const article = await readFile(articlePath, "utf-8");

  const parsedPath = path.parse(articlePath);

  articles.push({
    dirname: parsedPath.dir,
    filename: parsedPath.base,
    contents: article,
  });
}

class SystemPrompt {
  lesson = 1;
  unansweredQuestions: Set<string> = new Set();
  answeredQuestions: Map<string, string> = new Map();

  unansweredQuestionsSection() {
    if (this.unansweredQuestions.size === 0) {
      return `You currently have no unanswered questions.`;
    }
    return dedent`
      You still have these unanswered questions:
      ${Array.from(this.unansweredQuestions)
        .map((q) => ` - ${q}`)
        .join("\n")}
    `;
  }

  answeredQuestionsSection() {
    if (this.answeredQuestions.size === 0) {
      return `You have currently learned nothing from the course.`;
    }
    return dedent`
      The material you have learned so far has answered these questions:
      ${Array.from(this.answeredQuestions.entries())
        .map(
          ([question, answer]) =>
            ` - ${question} | ${answer}`,
        )
        .join("\n")}
    `;
  }

  render() {
    return dedent`
      You are a learner studying the "${seriesName}" course.
      ${this.unansweredQuestionsSection()}
      ${this.answeredQuestionsSection()}
      Read the lesson, then figure out what unanswered questions you have.
      If an outstanding question has been answered, remove it from the list.
      Please think of additional questions you have about the lesson.
      You are currently on lesson ${this.lesson}.`;
  }
}

const systemPrompt = new SystemPrompt();

const initialQuestionsResult = await generateObject({
  model: anthropic("claude-3-5-sonnet-latest"),
  system: dedent`
    You are a learner studying the "${seriesName}" course.
  `,
  schema: z.object({
    reasoning: z
      .string()
      .describe(
        "The reasoning behind your decisions.",
      ),
    unansweredQuestions: z
      .array(z.string())
      .describe("The questions you have."),
  }),
  prompt: dedent`
    What questions do you have before starting the course?
  `,
});

initialQuestionsResult.object.unansweredQuestions.forEach(
  (question) => {
    systemPrompt.unansweredQuestions.add(question);
  },
);

console.dir(
  initialQuestionsResult.object.unansweredQuestions,
  { depth: null },
);
console.log(initialQuestionsResult.object.reasoning);

for (const article of articles) {
  console.log(article.dirname, article.filename);
  const result = await generateObject({
    model: anthropic("claude-3-5-sonnet-latest"),
    system: systemPrompt.render(),
    schema: z.object({
      reasoning: z
        .string()
        .describe(
          "The reasoning behind your decisions.",
        ),
      unansweredQuestions: z
        .array(z.string())
        .describe(
          "The questions you have after reading the lesson.",
        ),
      answeredQuestions: z
        .array(
          z.object({
            question: z.string(),
            answer: z.string(),
          }),
        )
        .describe(
          "The questions you had going into the lesson and the answers you found in the lesson.",
        ),
    }),
    prompt:
      dedent`The lesson is in the directory "${article.dirname}" and is named "${article.filename}".
      The lesson text is:
    ` + article.contents,
  });

  result.object.answeredQuestions.forEach(
    ({ question, answer }) => {
      systemPrompt.answeredQuestions.set(
        question,
        answer,
      );
      systemPrompt.unansweredQuestions.delete(
        question,
      );
    },
  );

  result.object.unansweredQuestions.forEach(
    (question) => {
      systemPrompt.unansweredQuestions.add(question);
    },
  );

  systemPrompt.lesson += 1;

  console.dir(
    {
      answeredQuestions:
        result.object.answeredQuestions,
      unansweredQuestions:
        result.object.unansweredQuestions,
    },
    { depth: null },
  );
  console.log(result.object.reasoning);

  await rl.question("Press enter to continue.");
}

rl.close();
