An example of using Vercel's AI SDK to create a LLM-as-a-judge for checking factuality, for instance in an eval.

Start with [./llm-as-a-judge.ts](./llm-as-a-judge.ts).

## Description

LLM-as-a-judge is a really common way to evaluate your AI-powered apps.

You basically ask your system a question and then get another LLM to evaluate its response.

I'm going to be building tons of other resources on this site about LLM-as-a-judge that are linked below. But for now, I just want to show you an implementation using Vercel's AI SDK.

### What We're Building

Our function is going to be called score for factuality. It's going to use an LLM to judge whether a statement is factual.

To do this we're going to pass in three things to this function.

First is the question that we're evaluating. Let's imagine we're asking who invented the telephone.

Second is the statement that comes back from our system that we're evaluating so our system might say Thomas Edison invented the telephone.

Third is the most important the ground truth. We don't want to rely on the lms pre training data to assess whether our statement is correct. We want to give it some ground truth for it to work against.

In this case, the ground truth is that Alexander Graham Bell invented the first working practical telephone.
