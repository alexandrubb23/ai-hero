import {
  experimental_wrapLanguageModel,
  type LanguageModelV1StreamPart,
  type CoreMessage,
  type CoreTool,
  type LanguageModel,
  type StreamTextResult,
} from "ai";
import * as p from "@clack/prompts";

/**
 * WIP - instead of returning the result from cliChat,
 * it makes sense to wrap it in some middleware that logs
 * the messages to the CLI.
 *
 * I just need to figure out a way to turn the stream chunks
 * back into a readable result so I can extract their usage
 * and the final messages.
 */
export const wrapModelForCliChat = (
  model: LanguageModel,
) => {
  return experimental_wrapLanguageModel({
    model,
    middleware: {
      wrapStream: async ({ doStream }) => {
        const { stream, ...rest } = await doStream();

        const fullResponse: LanguageModelV1StreamPart[] =
          [];

        const transformStream = new TransformStream<
          LanguageModelV1StreamPart,
          LanguageModelV1StreamPart
        >({
          start() {
            p.log.message("");
          },
          transform(chunk, controller) {
            fullResponse.push(chunk);
            if (chunk.type === "text-delta") {
              process.stdout.write(chunk.textDelta);
            }
            controller.enqueue(chunk);
          },
          flush() {
            p.log.message("");
          },
        });

        return {
          stream: stream.pipeThrough(transformStream),
          ...rest,
        };
      },
    },
  });
};

export const cliChat = async <
  T extends Record<string, CoreTool<any, any>>,
  U,
>(opts: {
  intro?: string;
  outro?: string;
  /**
   * The price per million tokens, used to calculate usage
   */
  dollarsPerMillionTokens?: number;
  answerQuestion: (
    messages: CoreMessage[],
  ) => Promise<StreamTextResult<T, U>>;
  processQuestionResults?: (opts: {
    messages: CoreMessage[];
    result: StreamTextResult<T, U>;
  }) => Promise<void>;
}) => {
  const costPerToken = opts.dollarsPerMillionTokens
    ? opts.dollarsPerMillionTokens / 1_000_000
    : undefined;
  console.clear();

  p.intro(opts.intro ?? "Welcome to the chat!");

  const messages: CoreMessage[] = [];

  while (true) {
    const question = await p.text({
      message: "Ask a question:",
    });

    exitProcessIfCancel(question);

    messages.push({
      role: "user",
      content: question,
    });

    const result = await opts.answerQuestion(messages);

    await p.stream.step(result.textStream);

    const finalMessages = (await result.response)
      .messages;

    messages.push(...finalMessages);

    if (opts.processQuestionResults) {
      await opts.processQuestionResults({
        messages,
        result,
      });
    }

    const usage = await result.usage;

    if (typeof costPerToken === "number") {
      p.log.message(
        `Cost: $${
          usage.completionTokens * costPerToken
        }`,
      );
    }
  }
};

export function exitProcessIfCancel<T>(
  input: T | symbol,
): asserts input is T {
  if (p.isCancel(input)) {
    p.outro();
    process.exit(0);
  }
}

export const wrapWithSpinner =
  <TFunc extends (...args: any[]) => Promise<any>>(
    opts: {
      startMessage: string;
      stopMessage: string;
    },
    func: TFunc,
  ) =>
  async (
    ...args: Parameters<TFunc>
  ): Promise<Awaited<ReturnType<TFunc>>> => {
    const spin = p.spinner();
    spin.start(opts.startMessage);

    try {
      const result = await func(...args);
      spin.stop(opts.stopMessage);
      return result;
    } catch (err) {
      spin.stop("❌ Error occurred");
      throw err;
    }
  };
