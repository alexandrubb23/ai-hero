- Questions which require comparative thinking are currently hard for our system to answer.
- Write evals to cover those challenging cases
- Allow the agent to call the API's as tools
- Discuss differences between reasoning models and
  non-reasoning models
- TRY creating a planning system via a prompt chain
- TRY allowing users to confirm the plan before continuing?
- TRY allowing <thinking> tags to integrate the chain into a single prompt
- TRY integrating ReAct
- TRY using a reasoning model like o1/o3-mini, discuss trade-offs and latency
- TRY API for sending message updates for telling the user what the LLM is doing
- TRY getting the agent to ask the user for more information - dynamic preconditions?

---

The famous "let's think step by step" prompt is not necessarily even the best version of the chain of thought prompt. In echo prompt, instructing the model to rephrase queries for improved in-context learning, they showed there is a wide variation depending on how you frame the chain of thought prompt.

In other words, you can ask "let's repeat the question and also think step by step" or "let's reiterate the question and also think step by step," and this will have a wide variation in outcomes.

https://arxiv.org/abs/2309.10687

---

Agentic RAG

https://arxiv.org/pdf/2501.09136

---

Tree of Thoughts papers:

https://arxiv.org/abs/2305.10601

https://arxiv.org/abs/2305.08291

---

Aider is an awesome example of Reflexion

https://github.com/Aider-AI/aider

---

Collapsing Multi-Step Calls into a Single Prompt. There's a really good exercise here where we create an entire chain with potentially smaller models which adds a lot of latency. But what about if we just instead use different XML tags in Claude, let's say, to put this all into one output? You essentially run the entire sequential chain through a single prompt.

---

There's a really great UI idea here where you get the application to create some plans, allow the user to edit those plans, and then take actions based on that. You could even allow it to generate concise thoughts which it feeds to the user. The user can then edit those thoughts, feed them back into the process. You can get some extremely good data off this because you not only have the initial prompt, but also how the user goes and edits that. The user could potentially cancel that as well. The "Human in the loop" stuff is absolutely fascinating.

---

I should introduce the `<thinking>` tag when talking about Anthropic's models, especially since Anthropic's models are optimized for handling XML tags. The `<thinking>` tag allows you to pass reasoning tokens to the user, just like o1 and R1 do, allowing the user to potentially edit those reasoning tags. Also sounds pretty cool.

---

In the Agentic RAG paper, it says traditional RAG systems are constrained by static workflows and lack the adaptability required for multistep reasoning and complex task management.

Agentic RAG transcends these limitations by embedding autonomous AI systems into the RAG pipeline.

---

Agentic RAG leverages agentic design patterns, reflection planning tools, and multi-agent collaboration. This can adapt to workflows to meet complex task requirements. This means Agentic RAG systems are extremely flexible, scalable, and useful across diverse applications.

---

So non-Agentic RAG is essentially RAG without a feedback loop. With a feedback loop, an agent can reason about the information it's received.

---

I should do a paper breakdown on Agentic RAG.

Very useful as a survey of the current iteration of Agentic RAG programmes.

https://arxiv.org/pdf/2501.09136

---

The Agentic RAG paper delineates a difference between naive RAG, modular RAG, and graph RAG.

---

Agentic RAG incorporates iterative refinement. It builds in feedback loops to improve the retrieval accuracy and response relevance. It also orchestrates tasks, meaning it's quite efficient for real-time applications.

https://arxiv.org/pdf/2501.09136
