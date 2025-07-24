To understand how to evaluate an agent, you need to understand its failure modes. The more complex a task that the agent performs, the more failure modes there are.

Agents have unique failures caused by planning, tool execution, and efficiency.

Agents may fail to plan properly. They might generate a plan with several errors. There might be invalid tool use: they might call a valid tool, but call invalid parameters. It might call valid parameters, but pass incorrect values to those parameters.

Agents might simply fail to achieve their goal. Imagine you ask an agent to plan a holiday. It might:

- Forget to book you a hotel
- Forget to organize flights
- Organize flights from the wrong location

An agent may also fail to follow constraints properly. If the trip should:

- Cost no more than $5,000, it might book a trip that costs $10,000
- Last no more than a week, it might book a trip that lasts two weeks
