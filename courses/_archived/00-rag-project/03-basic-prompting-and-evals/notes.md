- Evalite
- Improving the prompt
- Your First Dataset
- Factuality Eval (LLMs are bad at numeric scales)
- TRY messing about with model choice
- TRY Braintrust instead of Evalite

---

What are we talking about in terms of numbers? How many evals do we need?

---

Evals are the way you express your taste.

How do you express your scope?

Evals are E2E tests.

What's a good amount of evals? What's a good amount of tests?

Evals cost money to run.

Running subsets of a test.

---

Evals - you need to know what users are NOT using it for

---

Evals are private - no risk of contamination

---

The origins of in-context learning are Radford et al. 2019, the GPT-2 paper.

We demonstrate language models can perform downstream tasks in a zero-shot setting without any parameter or architecture modification.

https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf

---

The GPT-3 paper is also a remarkable example of in-context learning. They went from GPT-2, which was less than 2 billion parameters, to GPT-3, which was around 175 billion.

It contained some of the first examples of few-shot prompting.

---

Let's say you're building an evaluator which is evaluating some marketing copy based on metrics. You want to grade the marketing copy for emotional appeal and clarity. One way to do this is to say to the LLM just rank this out of 1 to 10, so a 7 for emotional appeal and a 6 for clarity.

It turns out that LLMs are really bad at this. LLMs can't create effective grades for things because they don't really know what the numbers mean in those contexts. This comes up all the time in evaluations.

The best thing to do is to use a natural language-based scale. So:

- Extremely unclear
- Partially unclear
- Somewhat unclear
- Clear
- Very clear
- Extremely clear

Then you can map those descriptors into numbers.

---

There's no declarative system for creating prompts right now. We're all just "jQuery-ing" our prompts—we are creating imperative prompts which are resistant to change. Eventually, someone will create the React for prompts and a declarative framework for building prompts. This could be dspy.
