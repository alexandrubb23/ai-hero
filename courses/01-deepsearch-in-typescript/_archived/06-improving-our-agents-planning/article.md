---
id: lesson-t2c4t
---

Our agent is not planning well, it doesn't handle comparative queries well.

It should be able to make detailed plans for how to solve the user's query.

We'll need to encourage the LLM to think step by step, and to come up with a detailed plan for how to solve the user's query.

To do that, we can add some general chain-of-thought prompting to the system prompt, and add some examples for the LLM to follow.

## Steps to complete

- Find the system prompt

- Add some chain-of-thought prompting to the system prompt, saying "think step by step".

- Tell the LLM to come up with a detailed plan for how to solve the user's query.

- Add 3 examples for the LLM to follow:

  - A comparative query: "Compare the managerial records of Jurgen Klopp and Pep Guardiola"
  - A question about a specific fact: "How long was Bukayo Saka been injured during the 2024/2025 season?"
  - A question that requires multiple steps of reasoning: "What is the combined population of Exeter, Plymouth and Barnstaple? Is this more than the population of Luxembourg?"
