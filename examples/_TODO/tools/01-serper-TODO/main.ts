import { streamText } from "ai";
import { flagshipAnthropicModel } from "../../_shared/models.ts";
import { serper } from "./tools.ts";
import dedent from "dedent";
import { cliChat } from "../../_shared/cli-chat.ts";

await cliChat({
  intro: `Welcome to the Serper tool!`,
  answerQuestion: async (messages) => {
    const result = streamText({
      model: flagshipAnthropicModel,
      tools: {
        ...serper.tools,
      },
      system: dedent`
        You are a research agent. You can search the web to
        find out information.
    
        For every fact you return, reference the URL you used
        to find out the information.
      `,
      messages,
      maxSteps: 5,
    });

    return result;
  },
  dollarsPerMillionTokens: 3,
});
