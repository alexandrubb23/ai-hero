import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export const POST = async (
  req: Request,
): Promise<Response> => {
  const body = await req.json();
  const { messages } = body;

  const result = streamText({
    model: anthropic("claude-3-5-haiku-latest"),
    messages,
    onFinish: (message) => {
      console.log(message.usage);
    },
  });

  return result.toDataStreamResponse({
    sendUsage: true,
  });
};
