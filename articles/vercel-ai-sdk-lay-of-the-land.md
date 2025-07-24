## What is the Vercel AI SDK?

There's a pretty common problem when you're building AI-powered apps.

Let's say you're using OpenAI as your LLM provider.

You build all of this code to talk to OpenAI's API.

But then one day you think, "Oh, why don't we try Anthropic instead?"

But there's a problem: Anthropic's API is a little bit different.

This is especially true for things like streaming, structured outputs, and tool calling.

So you need to build all of this extra glue code just to try out a new model.

The AI SDK lets you handle that.

It's a library that you can call, which handles the interaction between you and the LLM.

So now you can call the AI SDK instead, which is just a library, and it will seamlessly handle talking to different providers.

Not only that, but it has some really nice helpers for common use cases.

It helps you stream text, work with structured outputs, do tool calling, and even handle agents seamlessly.

## Do You Need To Deploy The AI SDK To Vercel?

The AI SDK is maintained by Vercel. But you don't need to use Vercel in order to use the AI SDK.

You don't need to pay Vercel any money - it's free, open-source software.

## What Are The Different Parts Of The AI SDK?

There are three different parts of the AI SDK.

You have the AI SDK Core which is used for backend, so Node, Deno, Bun, whatever.

You also have the AI SDK UI which is a set of front-end hooks and components for linking up to an AI SDK backend.

There's also an AI SDK RSC framework, for building with React Server Components.

## What Does This Tutorial Cover?

This tutorial is only going to cover the core part of the AI SDK.

This is going to fill you in on the basics and give you the grounding that you need to build virtually anything.

## How Do You Install It?

It has probably the best NPM package of all time - `ai`:

```bash
pnpm add ai
```

All the core stuff is under the `ai` package:

```ts
import {
  generateText,
  streamText,
  generateObject,
  streamObject,
} from "ai";
```

You can integrate with different providers by installing their specific package.

For instance, OpenAI:

```bash
pnpm add @ai-sdk/openai
```

And then you can use it like this:

```ts
import { openai } from "@ai-sdk/openai";

const model = openai("gpt-4");
```

## Conclusion

So that's the lay of the land.

You get a unified API where you can drop models in and out.

You can stream text, generate text, work with structured outputs, call tools, and build agentic loops.

Let's start with the absolute basics: generate text. See you in the next one!
