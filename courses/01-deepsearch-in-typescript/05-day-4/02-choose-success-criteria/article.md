---
id: lesson-rludz
---

We've now got two very important things set up for our LLM-powered app. We have observability through Langfuse, which gives us production data. And we have Evalite set up to run evals. But a crucial question remains: what does a good app look like? What metrics can we use to assess the quality of our application?

## Defining Success Criteria

Many of these metrics will be familiar from other applications:

- Conversion rates from free to paid users
- Error rates in user sessions
- Query response times
- Total LLM costs (tracked through Langfuse)

But our app is different. It has a probabilistic element at its core that we need to carefully monitor. The key question is: how do we assess the quality of our answers? And more importantly, how do we turn that assessment into trackable metrics that we can measure over time?

## Core Metrics for DeepSearch

For our DeepSearch application, we need to nail down several key metrics:

- **Factual**: The answer must be correct
- **Relevant**: The app should stay focused on the user's question
- **Sourced**: Answers should include and cite their sources
- **Up to date**: The app should use the most recent information
- **Fast (ish)**: Response times should be reasonable (with some built-in latency expectations)

These metrics will form the foundation of our evals, ensuring they closely match our production application's quality.

## Business and Error Metrics

Beyond our core evals, we need to track business-critical metrics:

- Cost per query
- Cost per user
- Conversion rates

While these can't be evaluated directly in our evals, they're crucial for overall success criteria.

## Setting Goals vs. Tracking Progress

There's an important distinction between choosing metrics and setting goals for those metrics. In many contexts, you won't need to set specific goals at all.

For example:

- **Startups**: Focus on proving improvement over time, using metrics to drive development and secure funding
- **Agencies**: Need concrete success criteria and goals for contract bidding

### Establishing Baselines

When you do need specific numbers, establishing a baseline is crucial. For a DeepSearch app, you might:

- Test similar implementations
- Compare against human performance
- Track historical performance

Instead of promising specific numbers, "beating the baseline" is often a more useful framing. This lets you promise improvement and track progress over time.

## Impact on System Design

Your success criteria will directly impact your system design. I've described this elsewhere as the [staircase of complexity](https://www.aihero.dev/how-to-improve-your-llm-powered-app).

The staircase ranges from:

- Simple techniques at the top (zero-shot prompting, temperature adjustments)
- Complex, costly techniques at the bottom (fine-tuning)

Your success criteria determine how far down this staircase you need to go. For instance:

- High factuality requirements → deeper down the staircase
- Simple tasks (tweets, summaries) → simpler approaches suffice

## Creating a Culture of Improvement

For these criteria to be useful, they need to be actionable and extremely visible in the organization. A prominent AI startup implements this by:

- Rolling up metrics every few hours
- Sending updates to Slack
- Treating metric degradations as incidents
- Using success criteria as a driving force for development

For our purposes, we'll use these criteria to design our evals, ensuring we can track and improve our application's performance over time.
