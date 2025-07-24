In our [previous post](https://www.aihero.dev/stream-llm-responses-to-the-frontend-vercel-ai-sdk), I showed how to handle a simple stream response from our backend to the frontend.

But there were some obvious weaknesses. It could only handle text. It couldn't handle things like structured outputs and tool calls.

It also didn't preserve the message history.

There's a simple fix for all of these problems - `useChat` from the `AI SDK UI`.

## What is `useChat`?

`useChat` is a hook that handles most of the state associated with building a chat bot.

It contains a bunch of state and helper functions to make building a chat bot easier.

```ts
import { useChat } from "ai/react";

const {
  messages, // The chat history
  input, // The current input
  handleInputChange, // Handle input changes
  handleSubmit, // Handle form submission
} = useChat({
  api: "http://localhost:4317/api/chat", // Our API
});
```

Crucially, it also manages the connection to your API. We can point it at an api endpoint, And as long as that api endpoint is compatible with the `AI SDK` we can use it to generate responses.

## Preparing Our Endpoint

<Scrollycoding>

# !!steps

So we'd better prepare our endpoint. Here's how our code currently looks.

```ts ! example.ts
import { streamText, smoothStream } from "ai";

honoApp.post("/api/chat", async (ctx) => {
  const { prompt } = await ctx.req.json();

  const result = streamText({
    model,
    prompt,
    experimental_transform: smoothStream(),
  });

  return result.toTextStreamResponse();
});
```

# !!steps

The first thing need to do to use `useChat` is to change the function we're returning to `result.toDataStreamResponse`.

```ts ! example.ts
import { streamText, smoothStream } from "ai";

honoApp.post("/api/chat", async (ctx) => {
  const { prompt } = await ctx.req.json();

  const result = streamText({
    model,
    prompt,
    experimental_transform: smoothStream(),
  });

  return result.toDataStreamResponse();
});
```

# !!steps

And now instead of receiving just a single `prompt`, we're going to receive the entire message history from the UI as JSON.

We can pass that into `messages`.

```ts ! example.ts
import { streamText, smoothStream } from "ai";

honoApp.post("/api/chat", async (ctx) => {
  const { messages } = await ctx.req.json();

  const result = streamText({
    model,
    messages,
    experimental_transform: smoothStream(),
  });

  return result.toDataStreamResponse();
});
```

</Scrollycoding>

## Using `useChat`

Our React app is going to look pretty simple. I'm using a few shared components in the AI Hero repo. But all the logic is in the properties just returned from `useChat`.

```tsx
const App = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({
    api: "http://localhost:4317/api/chat",
  });

  return (
    <Wrapper>
      {messages.map((message) => (
        <>
          <Message
            key={message.id}
            role={message.role}
            content={message.content}
          />
        </>
      ))}
      <ChatInput
        input={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </Wrapper>
  );
};
```

## Conclusion

And just like that, we've got a functional chat bot. Typing in the chat input and submitting will behave as expected, and we can have actual conversations with the LLM.

We created a simple api, With a single post endpoint. We returned a data stream response from it. We direct use chat to speak to it, and it handles the rest.

Note how much simpler this is than the previous implementation. We don't have to worry about handling the stream at all. Beautiful.
