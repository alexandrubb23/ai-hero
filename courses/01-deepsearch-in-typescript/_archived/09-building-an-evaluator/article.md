TODO: Find questions that our system can't answer.

We've improved our system. But i still feel like it's a little bit eager to answer the user's question. There is no explicit evaluation step built in to our implementation.

We rely on the `getNextAction` LLM call to figure out if we have enough information to answer the user's question. This means that if we want to improve the way our system evaluates its own responses we need to target that system prompt.

This feels like putting too many eggs in one basket. Instead, we should build an evaluation step That explicitly evaluates the quality of the response when we answer.

This will form part of our 'answer' action. We'll get the LLM to produce an answer. Then we'll get it to evaluate whether the answer is good enough.

The pseudocode for this looks like this:

```ts
const ctx = {};

while (ctx.step < 10) {
  const nextAction = await getNextAction(ctx);

  // ...other actions...
  if (nextAction === "give-final-answer") {
    const answer = answerQuestion(ctx);
    // Evaluate the answer
    const evaluation = evaluateAnswer(ctx, answer);

    if (evaluation.isGoodEnough) {
      return answer;
    }

    // If the answer is not good enough, we need to try again.
    ctx.badAnswers.push(answer);
  }
}
```

## Designing the `evaluateAnswer` function

Our `evaluateAnswer` function needs to be carefully designed. We need to match it to the success criteria for our answers. For now, we'll focus on two criteria:

- Definitiveness - fully answers the question
- Recency - up to date

There are two possible designs for this. We could run two different LLM calls in parallel, one for each of the criteria.

```ts
// Option 1
const results = await Promise.all([
  evaluateDefinitiveness(answer),
  evaluateRecency(answer),
]);
```

Or, we could run a single LLM call that evaluates both criteria at once.

```ts
// Option 2
const results = await evaluateAnswer(answer);
```

We're gonna stick with Option 2 for now. It's simpler to implement, and we should always try to do the simpler thing first.

Option 1 also may end up testing our system on metrics which don't matter to the actual question. For example, not all questions need up-to-date information: "who founded the company that makes the iPhone?". Option 2 will be able to handle the evaluation AND assess whether the evaluation is relevant to the question in a single pass.

However, we should keep option 1 on our radar. Option 2 may end up being too reliant on a single system prompt.

## Implementing the `evaluateAnswer` function

We'll need to use structured outputs to make sure that we get output from the LLM that we can use. We'll need to use this schema, with descriptions for each field:

```ts
import { z } from "zod";
import { generateObject } from "ai";

export const evaluateAnswer = (opts: {
  answer: string;
  question: string;
}) =>
  generateObject({
    model,
    schema: z.object({
      metrics: z.object({
        definitiveness: z.object({
          state: z
            .enum(["pass", "fail"])
            .describe(
              "Whether the answer is definitively correct. Reply with 'pass' if it is, 'fail' if it is not.",
            ),
          reasoning: z
            .string()
            .describe(
              "The reason for the pass or fail",
            ),
        }),
        recency: z.object({
          state: z
            .enum(["pass", "fail", "irrelevant"])
            .describe(
              "Whether the answer needs to be checked for recency. Reply with 'pass' if it does, 'fail' if it does not, or 'irrelevant' if the question does not require a recency check.",
            ),
          reasoning: z
            .string()
            .describe(
              "The reason for the pass or fail",
            ),
        }),
      }),
    }),
    prompt: `
  You are an expert evaluator. You are given an answer to a question. You need to evaluate the answer based on the following criteria:

  - Definitiveness
  - Recency

  Definitiveness:
  - Whether the answer is definitively correct. Reply with 'pass' if it is, 'fail' if it is not.
  - The reason for the pass or fail

  Recency:
  - Whether the answer is up to date. Reply with 'pass' if it is, 'fail' if it is not, or 'irrelevant' if the question does not require a recency check.
  - The reason for the pass or fail

  Answer:
  ${opts.answer}

  Question:
  ${opts.question}
  `,
  });
```

Note that we are always going to check the answer for definitiveness - I can't yet think of a situation where we would want an answer that does not definitively answer the question.

## Saving Failed Attempts

We'll also need to redesign our `SystemContext` class in order to save failed attempts.

## Steps To Complete

- Create a new `evaluateAnswer` function.
