One way to think about plans is they are essentially just plans to call different tools. Each step is simply a tool call. So at the start of your model's planning session, it's simply going to map out the tool calls that it needs in order to achieve the end result.

However, this couples the name of your tool calls to the plan. Another way to think about it is to plan in more natural language. This makes your plan generator more robust to changes in tool APIs.

You then need a model to translate each natural language action into executable commands. However, this is a much less resource-intensive task than generating the plan in the first place. So it can be done by a weaker model.

---

A question I have is whether you use a planner that has access to only hypothetical tools.

It would generate a natural language output which could then be evaluated on its own merits.

Then you could pass that into a translation module which would run the actual tool calls and execute the plan.

I wonder whether this would circumvent some of the issues that folks report when passing LLMs a too-large tool inventory.
