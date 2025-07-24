---
id: lesson-bh5a2
---

Our collapsed search and crawl tool is pretty brutal in terms of context window usage.

It takes the entire contents of the page even stuff that's irrelevant to ourqueryand pulls it into the lm context window.

We have a few options here:

### Option 1

We can move to an LM with a large larger context window. This will mean we'll be able to go longer before wehit the context window limits.

However this feels more like deferring the problemthan solving it.

We need to be mindful of our context window usagebecause every token that we send to the lm increases costs.

### Option 2

We could use an approach that's typicalin retrieval augmented generation systems, often known as RAG.

This is where you take the material that you've gathered, Chunk it intosmaller pieces, And then use an algorithm to retrieve the right pieces for the query.

However I would say that this is going too complex too soon. We may end up wanting to use a chunking approach, but we should try the simpler approach first to see if it works.

### Option 3

We can use a cheapermodel with a larger context window to summarise the content of the pages before passing it to our more expensive smarter lm.

Essentially this is performing the same operation asoption two. But instead of bringing the complexity into our system (via chunking, chunk storage, and retrieval) we are outsourcing it to an LLM.

This approach may end up being more costly - but it is simpler, and worth trying.

### Summary

We're going to go with option 3. This will be relatively cheap to test and will give us a good baseline to improve upon.

## Choosing A Summarizer LLM

The best choice for a summarizer modelwill depend ontwo features:

- The size of the context window
- The cost of the model

You may plug in any type of model that you want. Personally, I recommend using one of [Google's flash models](https://ai.google.dev/gemini-api/docs/models). `gemini-1.5-flash` has a 1m token context window and is very cheap to use.

We'll be using that in this prompt - but feel free to plug in any model that you want.

## Steps To Complete

- If not already installed, install `@ai-sdk/google`.
- Check that there is a `GOOGLE_GENERATIVE_AI_API_KEY` environment variable, both in the environment variables and the config.
- Inside our models file, add a `summarizer` model.

```ts
import { google } from "@ai-sdk/google";

export const summarizerModel = google(
  "gemini-1.5-flash",
);
```

## Not Required Yet

- Do not implement the summarizer yet. We are only declaring the model for now.
