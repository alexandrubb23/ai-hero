---
id: lesson-0jcrk
---

This is how a `think` tool could be declared.

```ts
import { streamText } from "ai";
import { z } from "zod";

const description = `
Use the tool to think about something.
It will not obtain new information or change the
database, but just append the thought to the log.
Use it when complex reasoning or some cache memory
is needed.`;

streamText({
  // ...other properties
  tools: {
    think: {
      description,
      parameters: z.object({
        thought: z
          .string()
          .describe("A thought to think about."),
      }),
      execute: async () => {
        return "Thought logged.";
      },
    },
  },
});
```

Steps to complete:

- Add a `think` tool to the toolset passed to the LLM
- Using the `system` prompt, encourage the LLM to use the `think` tool to react to search results it receives. Tell the LLM to use the `think` tool to cache information.
