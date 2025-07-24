import { anthropic } from "@ai-sdk/anthropic";
import {
  cosineSimilarity,
  embed,
  streamText,
} from "ai";
import vectorDatabase from "../../../../secret-datasets/datasets/total-typescript-content/chunks/embeddings.json" with { type: "json" };
import { cliChat } from "../../_shared/cli-chat.ts";
import { lmstudio } from "../../_shared/models.ts";
import dedent from "dedent";

const SIMILARITY_THRESHOLD = 0.6;

const embeddingModel = lmstudio.textEmbeddingModel("");

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
      messages: messages,
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
      `,
    });

    return result;
  },
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
