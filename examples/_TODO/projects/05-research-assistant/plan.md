# Day 1: Get Set Up

- **Choose your AI provider**

- **Connect to your AI Provider** via Vercel AI SDK

- **Model Selection Basics**: Understand the basics of model selection, like model size and open models vs open weight vs closed source

https://lmarena.ai/ is a great place to look at the leaderboard for various models.

The [Open LLM leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard#/) is a great place to look at the leaderboard for open LLMs. It measures against various benchmarks and is a great place to see how open AI models stack up against each other.

- **Latency vs Accuracy**: Understand the tradeoffs between latency and accuracy, and how large or small models fit into that

- **API Selection Basics**: Understand the difference between model providers and api providers, like Groq

## Optional

- Set up any local models if you want to
- Connect to local models using ollama and the ollama sdk

## Create A POC

Goals:

Should end up with a simple app with:

- Evalite
- Postgres
- Drizzle
- Auth?
- A simple frontend

1. Intro: Make a simple POC with the model retrieving information from its own training data

Every AI app starts out bad

1. Set up required services, either on Docker or Supabase

1. Introduce Evalite

Alternatives like Braintrust are available, but I built Evalite specifically for this course

1. Add a simple eval for testing if the basics are working

1. Add a simple eval to make sure sources are shown

1. Add a simple frontend for showing the results

1. Add Postgres and Drizzle for storing the conversation histories

## Create A Naive Dataset

Goals:

- Add simple evals

1. Create a simple dataset to test the model

Craft the dataset by hand

1. Add an exact match eval to answer simple questions

1. Add a lexical simiarity eval to answer simple questions

1. Add a semantic similarity eval to ensure that the meanings are aligned

1. Add a factuality eval with a LLM

1. Download a local model with Ollama to see how simple we can make the model

## Add External Tools

1. Get The Search Results From Serper, hook up to a tool

Use an eval based on modern events to ensure that the tool is working

1. Get The Web Scraping Results From FireCrawl, feed it directly into the context window

1. Set up simple file-system caching for our third-party API's results so we don't kill our API's

1. Track the tool calls in the frontend and use them to show our sources

TODO: should we also add in OCR for PDF reading?

## Add Proper Evals

1. Create a dataset to use for the evals

TODO: how do we create this dataset? How do I teach folks about dataset management?

TODO: How do we introspect the dataset?

1. Look at various eval platforms

TODO: create a list of the eval platforms

## Avoiding Context Window Issues

1. Intro: We will quickly run into context window issues. RAG is a sensible option, but what can we try first?

2. Writing (and storing) summaries of the previous articles

TODO: what are the downsides to this?

3. Writing (and storing) summaries of the conversation history

TODO: what other strategies are there for mitigating context window issues?

## Add Naive RAG

1. Set up pgvector as a place to store the embeddings

1. Write a simple chunking function

TODO: how do we inspect the chunks?

1. Embed the chunks

TODO: how do we decide which embedding model to use?

1. Use a cosineSimilarity function to fetch the embeddings

1. Decide how many chunks to include

TODO: how do we decide how many chunks to include?

## Improving Our RAG System

1. Try semantic chunking

1. Try LLM chunking

1. Try contextual embeddings (a la Anthropic)

1. Try HyDe

1. Add a query rewriter to write and expand the user's query

TODO: How do we write a query rewriter? What's the goal of a query rewriter?

TODO: What kind of model do you use for a query rewriter?

TODO: how else can you improve a RAG system?

1. Add a LLM re-ranker to improve the chunks

TODO: Why do you need a LLM re-ranker? How many results should you put in? How many should you get out? Does it require structured outputs?

TODO: Would you use a specialised service to do LLM reranking?

## Observability

1. Learn the basics of OTEL

TODO: what are the basics of OTEL?

1. Look at various LLM-tailored observability platforms

TODO: which do we recommend? How do we feed the data back into the evals?

1. Hook up a up or downvote button

1. Remove PII from the observability data

TODO: How do we do this?

1. Scoring different feedbacks based on the quality of the feedback, length of user engagement, etc.

We may even want to score it higher based on whether the user is associated with an enterprise customer

## Add Reasoning & Planning

TODO: What is multi-hop reasoning? What kind of question would be challenging for our current system to answer?

1. Create a planning system (in a separate chain) to answer complex questions.

1. Allow users to confirm the plan before continuing

1. Feed in whether the plan was confirmed into the o11y system

1. Add a reasoning system (using ReAct) after the planning system to go through and execute the tools.

1. Consider using Reflexion

1. Consider using tree-of-thought
