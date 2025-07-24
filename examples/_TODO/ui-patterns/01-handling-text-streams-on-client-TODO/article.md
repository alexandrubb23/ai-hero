Working with AI has a special set of constraints for frontend developers.

Most frontend developers don't work with streams all that often. Usually just fetch the data you want in a single JSON block, return it, and render it into a UI.

But because requests to the AI take a long time we need to be able to stream them back.

We can't have our users just waiting for a long AI response to complete.

In this video I'm going to show you how to hook up a simple frontend to a backend using `streamText` from the AI SDK.

For now we're not going to use the AI SDK Core package - we're going to implement a small part of it ourselves.

## The Backend

We're going to start by creating a [`Hono`](https://hono.dev/docs/) app. This is going to be our backend server where our actual call to the LLM is going to live.

<Scrollycoding>

# !!steps

We create a new `Hono` app by importing and initializing it:

```ts ! example.ts
import { Hono } from "hono";

export const honoApp = new Hono();
```

# !!steps

We can add CORS and a logger:

```ts ! example.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

export const honoApp = new Hono();

honoApp.use(cors());
honoApp.use(logger());
```

# !!steps

And we'll add a method called `api/generate`.

This is all the code we need to create an API server that can handle a POST request:

```ts ! example.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

export const honoApp = new Hono();

honoApp.use(cors());
honoApp.use(logger());

honoApp.post("/api/generate", async (ctx) => {
  // Fill in later
});
```

</Scrollycoding>

### Our API Call

<Scrollycoding>

# !!steps

Our API generate call is going to receive a JSON object containing a `prompt` property.

We can grab that using `ctx.req.json()`.

```ts ! example.ts
honoApp.post("/api/generate", async (ctx) => {
  const { prompt } = await ctx.req.json();
});
```

# !!steps

Next, we can pass the `prompt` to the `streamText` function, along with a model of our choice.

```ts ! example.ts
import { streamText } from "ai";

honoApp.post("/api/generate", async (ctx) => {
  const { prompt } = await ctx.req.json();

  const result = streamText({
    model,
    prompt,
  });
});
```

# !!steps

We can also pass in an experimental transform of `smoothStream`.

This streams in the text word by word, which ends up being really pretty for the user.

```ts ! example.ts
import { streamText, smoothStream } from "ai";

honoApp.post("/api/generate", async (ctx) => {
  const { prompt } = await ctx.req.json();

  const result = streamText({
    model,
    prompt,
    experimental_transform: smoothStream(),
  });
});
```

# !!steps

Finally we can turn the result into a text stream that we can return, using `result.toTextStreamResponse()`.

The output of this function is simply a response object, which we can return from our API call directly.

```ts ! example.ts
import { streamText, smoothStream } from "ai";

honoApp.post("/api/generate", async (ctx) => {
  const { prompt } = await ctx.req.json();

  const result = streamText({
    model,
    prompt,
    experimental_transform: smoothStream(),
  });

  return result.toTextStreamResponse();
});
```

</Scrollycoding>

And just like that our backend is complete.

## The Frontend

Now we can move on to the frontend. This is going to be a React application, running on Vite. But don't worry - the main concepts here are the same no matter what frontend framework you're using.

We've got a very simple UI that has an input field for the prompt and a space below to display the response.

Our input field is part of a form which we submit to get the new response.

This isn't a chat app, by the way. There's no message history here. We're only submitting a prompt to the backend.

So let's look at the `onSubmit` function.

<Scrollycoding>

# !!steps

Inside the function, we first grab the form data from the field.

```ts ! example.ts
const onSubmit = async (e) => {
  const formData = new FormData(e.currentTarget);

  const prompt = formData.get("prompt");
};
```

# !!steps

Next we make a fetch call to the backend, passing it our prompt.

```ts ! example.ts
const onSubmit = async (e) => {
  const formData = new FormData(e.currentTarget);

  const prompt = formData.get("prompt");

  const response = await fetch(
    "http://localhost:4317/api/generate",
    {
      method: "POST",
      body: JSON.stringify({
        prompt,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
```

# !!steps

The `response.body` of this fetch call is a readable stream.

This readable stream returns raw binary data, a stream of `Uint8Array`s.

We can turn it into text by piping it through a `TextDecoderStream`.

```ts ! example.ts
const onSubmit = async (e) => {
  const formData = new FormData(e.currentTarget);
  const prompt = formData.get("prompt");

  const response = await fetch(); // ...

  const stream = response.body!.pipeThrough(
    new TextDecoderStream(),
  );
};
```

# !!steps

Finally we can iterate over the stream, saving each chunk into `useState`.

I'm assuming you can do the conversion to your framework of choice in your head.

```ts ! example.ts
import { useState } from "react";

const [text, setText] = useState("");

const onSubmit = async (e) => {
  const formData = new FormData(e.currentTarget);
  const prompt = formData.get("prompt");

  const response = await fetch(); // ...

  const stream = response.body!.pipeThrough(
    new TextDecoderStream(),
  );

  for await (const chunk of stream) {
    setText((text) => text + chunk);
  }
};
```

</Scrollycoding>

In the real example, I have some extra cancellation logic too - but I'm omitting that here for brevity.

## Conclusion

So that's it! We've successfully hooked up a frontend to a backend streaming a result from `streamText`.

This example will actually work for very simple cases - where you only need text from the backend.

But anything involving structured outputs, tool calls or files will not work with this approach.

For that you'll need to dive into the AI SDK's `useChat` function.
