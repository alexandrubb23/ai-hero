The way the LLMs work is they have been trained on a dataset. This dataset is usually composed of public knowledge like Wikipedia.

```
+-------------+     +----------------+
|   Training  | --> |     LLM        |
|   Data      |     |     Model      |
+-------------+     +----------------+
```

These datasets are absolutely enormous and they contain most of humanity's knowledge.

But often that's not enough.

## The Private Data Problem

Let's say that you're working in a big company and you're building a question and answer feature. People will be able to ask questions about the company's internal processes, and the LLM will have to answer them.

The problem is that the LLM has never seen the company's internal documents. They're not part of its dataset. So how can it possibly answer questions about them?

One way is through prompt engineering. If we turned the company's internal documents into text, we could feed it into the prompt. That way the LLM would have some context about what the company does and what its processes are.

```
+-----------------+     +----------+     +---------+
|    Company      |     |   LLM    |     |         |
|    Docs +       | --> | + Prompt | --> | Answer  |
|   Question      |     |          |     |         |
+-----------------+     +----------+     +---------+
```

But imagine these documents could be hundreds of thousands of lines long. It would be pretty wasteful to load everything into the prompt. You'd end up spending lots of tokens and you'd quickly blow past your context window.

## RAG

So what if we could look at the question, load the relevant parts of the company's docs into the prompt, and then ask the LLM?

In other words, what if we retrieve specific information relevant to what we're generating before we generate it?

```
+-------------+     +-----------------+     +------------+     +---------+
|  Question   | --> |    Document     | --> |  Relevant  | --> |   LLM   |
|             |     |    Search       |     |  Sections  |     |         |
+-------------+     +-----------------+     +------------+     +---------+
```

This is retrieval augmented generation, or RAG. We can think of it like a cousin to prompt engineering.

We're trying to provide the LLM with enough context to answer questions posed to it by jamming extra information into its prompt.

This is particularly useful when we need access to non-public information, or when we're asking about really specialist questions which aren't very prevalent in the dataset.

It's also extremely useful for grounding the LLM in actual facts. By encouraging the LLM to only focus on the retrieved data, not its training data, you can make hallucinations less likely.

There are tons of challenges with RAG.

- How do you store your data in a way that makes it easy to retrieve?
- How do you only fetch the relevant data?
- How do you match the correct data with the questions?

We're going to be addressing these challenges in this series.
