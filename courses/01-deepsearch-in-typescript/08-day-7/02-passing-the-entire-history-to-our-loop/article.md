---
id: lesson-e5et2
---

Currently, we are only passing the latest message to the loop. This means that if we ask a follow-up question, we lose all context on what came before it.

<Video resourceId="messagehistorynotworking-fm8kmSydi.mp4" />

Instead of just passing a single question to the LLM, we need to pass the entire message history. That way, the LLM has all the context it needs to answer the followup question.

To do that we'll redesign our system context to take in the right inputs, and pass it to the LLM calls inside the loop.

## Steps To Complete

- Find the place where the agent loop is implemented
- Instead of taking in an initial question, take in a `messages` array from the `ai` package:

```ts
import type { Message } from "ai";

const imaginaryFunction = async (
  messages: Message[],
) => {
  // ...
};
```

- Find the central place where we're storing context for the system.
- Instead of taking in a question, take in a `messages` array. Store it in the context.
- Add a method to the system context that nicely formats the entire message history into a string. Use XML tags as the delimiters.
- Find anywhere we're calling the LLM inside the loop, and pass the message history to the LLM instead of just the last question. This will give the LLM the context it needs to answer the followup question.
- Run the app to see if the initial bug is fixed.
