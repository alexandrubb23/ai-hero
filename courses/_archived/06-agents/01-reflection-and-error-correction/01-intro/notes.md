Reflection will significantly boost the agent's performance. You check whether the plan is good and if it's a bad plan, generate a new one. This is even before receiving any input from the outside world via tool calls.

Reflection and error correction isn't strictly necessary for an agent to operate. But it is necessary for an agent to succeed.

You can use reflection in many different places:

- After receiving a user query to evaluate if the request is feasible.
- After the initial plan generation to evaluate whether the plan makes sense.
- After each execution step to evaluate if it's on the right track.
- And after the whole plan has been executed to determine if the plan has been completed.

---

The downside of both ReAct and Reflexion is that thoughts, observations, and actions can take a lot of tokens to generate.

This increases cost and user-perceived latency.

To get their agents to follow the format, both ReAct and Reflexion authors used plenty of examples in their prompts.
