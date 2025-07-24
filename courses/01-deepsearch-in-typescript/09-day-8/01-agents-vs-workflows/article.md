---
id: lesson-paz5s
---

We have succeeded in an important goal - we have modularized our system.

Instead of having all of the parts of our application depending on a single system prompt, we've split discreet functions into separate LLM calls. This makes our system more predictable and testable.

But there's another axis I would like to talk about - the amount of power we give to the LLM to choose our control flow.

And this bumps up against a hot topic in AI engineering circles - agents vs workflows.

## Agents

Our current application hands a lot of power to the LLM to choose our next action.

Every time we go through our loop, the LLM gets to choose from three possible actions:

- Search the web
- Scrape a URL
- Generate an answer

The agent has complete control over many different parameters of our system:

- How many searches it does
- How many URLs it scrapes, and which ones
- Whether or not it searches the web - it can choose to simply answer based on its training data
- Whether or not it scrapes a URL, or whether it relies on the snippets from the web search
- When it decides to generate an answer

These are all control-flow decisions - decisions about what to do next, how long to do it for, and so on.

To use the term popularized by [Anthropic](https://www.aihero.dev/building-effective-agents), the more control-flow decisions you hand over to the LLM, the more 'agentic' your application becomes.

## Workflows

Right now, our application is very agentic. In my opinion, too agentic.

The more control-flow decisions handled by the LLM, the more likely you are to get wildly diverse outcomes. Running the same query 100 times would likely produce some edge cases:

- Some runs would search the web, but not scrape
- Some runs would not scrape enough URLs
- Some runs would answer based on training data, and not search at all

The way to solve this is to bring more of the control flow back into our control. Take it out of the LLM's sweaty, probabilistic hands, and into the iron grip of deterministic code.

The opposite of an 'agent' is a 'workflow'. The less 'agentic' your application is, the more predictable it becomes. Entirely deterministic applications do the same thing every time - even if they contain some probabilistic components.

## Turning the 'agentic' dial

Agentic systems aren't all bad - letting the LLM handle the control flow means your application becomes very flexible.

But in a system like DeepSearch, we may want to experiment with adding more determinism to our system.

That means reducing the number of decisions the LLM makes - turning the dial away from 'agentic', and towards 'determinism'. This can take many forms:

- Reducing the decision space for the LLM
- Taking multiple tool calls (or actions) and combining them into workflows
- Barring the LLM from making any decisions, and only allowing it to follow a predetermined path

## What's next

In our next few exercises, we're going to experiment with turning the dial back towards determinism.
