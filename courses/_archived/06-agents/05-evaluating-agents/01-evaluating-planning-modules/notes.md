To evaluate an agent for planning failures, you can create a planning data set where each example is a tuple of task and tool inventory.

You can then compute the following metrics:

- Checking how many of the generated plans are valid
- How many plans did the agent have to generate to get a valid plan
- Out of the tool calls generated, how many of them are valid
- How often are invalid tools called with invalid parameters

You can then analyze the agent's outputs for patterns. What tools did the model frequently make mistakes with? Some tools might be harder for an agent to use.
