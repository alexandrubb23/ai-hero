Interleaving reasoning and action has become a common pattern for agents. This was first proposed in the ReAct paper.

https://arxiv.org/abs/2210.03629

Here's a really good example of ReAct: Reasoning and action working together.

The key format is to have three different outputs of each step:

1. Thought: The reasoning behind the action
2. Act: The action itself
3. Observation: The result of the action

![A ReAct agent in action](image-1.png)
