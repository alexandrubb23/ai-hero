## Planning

Tell cursor to write a markdown document with the plan.

Give me N suggestions - really powerful.

1. Architecture
2. Implementation Plan (for next chat), including checkboxes.
3. Manually check the implementation plan
4. Open a new chat, and say "implement stage 1"
5. While stage 1 happens, scan the rest of the implementation plan
6. Feedback mechanisms kick in (tsc, ESLint rules)

3.7 models, o3, R1 will just go until they're done - because they're RL trained.

Understanding how chunky to make your stages is really key.

Give the AI some clear instructions on executing the code. Don't just write the code, test the code. YOU MUST ALWAYS INCREASE THE TESTS.

Say "don't delete tests".

Iterate on the 'plan' prompt over time

Context Window -> Riding a bicycle, trying to stay in the context sweet spot

Delegate to sub-agents to save context window

Use Gemini as a feedback loop

Handling messy merges with AI

Be gung-ho about starting over, especially with existing code.

Be more careful to decouple parts of the apps

## MISC

Handoff to

Chat programming

## Questions

How do you scope the tasks you do? Isn't smaller always better?

- Most folks are too conservative with steering the AI
- Smaller tasks don't give the AI enough context to do a good job

How do you maximise parallelism?

How much care do you give to the code itself?

- Pay more attention early on, build the abstractions

How do you handle committing?

Do you get the AI to do refactors?

Do you integrate feedback loops in your plan?

-

How do you handle external docs?
