import { generateText } from "ai";
import { smallModel } from "../../_shared/models.ts";

const model = smallModel;

export const someFunc = async (input: string) => {
  const { text } = await generateText({
    model,
    prompt: input,
  });

  return text;
};
