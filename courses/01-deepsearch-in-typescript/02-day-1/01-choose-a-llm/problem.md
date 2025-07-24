---
id: lesson-6y7pw
---

The first thing we need to do in any LLM-powered app is choose our LLM.

If you don't already have an LLM of choice, I recommend checking out my [previous post](https://www.aihero.dev/how-to-choose-an-llm) on it. It explains the various metrics you need to understand in order to choose an LLM effectively.

I also recommend checking the Vercel AI SDK's supported providers listed below. We'll be using the AI SDK, so sticking to their supported providers will give you a better experience.

We'll also need our LLM to perform tool calling, so make sure that your LLM supports it.
And if you don't want the stress of choosing an LLM, let me make a recommendation. Any of Google's recent models are extremely cheap, have relatively generous rate limits and extremely large context windows. Getting a Google API key is also pretty simple. The code to implement this will look like this:

```ts
import { google } from "@ai-sdk/google";

export const model = google("gemini-2.0-flash-001");
```

## Steps To Complete

- Choose a LLM.
- Download the correct AI SDK package to your repo.

  Here are a commonly-used list of models, and their providers:

  | Provider             | SDK Package              |
  | -------------------- | ------------------------ |
  | xAI Grok             | `@ai-sdk/xai`            |
  | OpenAI               | `@ai-sdk/openai`         |
  | Azure OpenAI         | `@ai-sdk/azure`          |
  | Anthropic            | `@ai-sdk/anthropic`      |
  | Amazon Bedrock       | `@ai-sdk/amazon-bedrock` |
  | Google Generative AI | `@ai-sdk/google`         |
  | Google Vertex        | `@ai-sdk/google-vertex`  |
  | Mistral              | `@ai-sdk/mistral`        |
  | Together.ai          | `@ai-sdk/togetherai`     |
  | Cohere               | `@ai-sdk/cohere`         |
  | Fireworks            | `@ai-sdk/fireworks`      |
  | DeepInfra            | `@ai-sdk/deepinfra`      |
  | DeepSeek             | `@ai-sdk/deepseek`       |
  | Cerebras             | `@ai-sdk/cerebras`       |
  | Groq                 | `@ai-sdk/groq`           |
  | Perplexity           | `@ai-sdk/perplexity`     |

- Declare the model in the codebase. For Google, this will be:

```ts
import { google } from "@ai-sdk/google";

export const model = google("gemini-2.0-flash-001");
```

- Ensure that the correct API key is in `.env`. For Google, this will be `GENERATIVE_AI_API_KEY`.
- Ensure that the environment variables are configured in the `env.js` file.
- Test the app to make sure that there are no errors in the dev server.
- Try messing about with the strings passed to the model function to see what different models are available.
