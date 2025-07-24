In September 2024, a group of folks at Google published a [whitepaper on agents](https://www.kaggle.com/whitepaper-agents).

There's nothing particularly controversial or new in this paper.

But it's a really good set of definitions for some terminology around agents.

It defines what an agent is, what a tool is, and has a couple of extra interesting definitions which we'll get into.

I think it's a great introduction to the field and that's why we're covering it.

## Definition Of 'Agent'

So let's start with the juicy stuff - the definition:

An agent is "an application that attempts to achieve a goal by observing the world and acting upon it using the tools that it has at its disposal."

This sounds about right, but of course a thermostat would also be an agent under this definition.

Helpfully the paper also draws a line between agents versus models.

There's a nice table here for us:

- Models are limited to what is available in their training data, whereas agents have access to external systems.
- Agents have access to chat history, which lets them add additional information to their context over time.

In other words, a model by itself cannot be an agent. An agent is a system containing memory, reasoning, planning, and tool calling.

But they also shy away from defining agents strictly. There's a funny turn of phrase in the introduction where they say this combination of factors "invokes the concept of an agent."

Basically if it smells `agentic` it's probably an agent.

## Orchestration Layer

The paper also talks about orchestration layers as being important for agents.

The orchestration layer governs how the agent "takes in information, performs some internal reasoning, and uses that reasoning to inform its next decision or action."

In other words it's the feedback loop that I've covered elsewhere in my [Vercel AI SDK tutorial](https://www.aihero.dev/agents-with-vercel-ai-sdk?list=vercel-ai-sdk-tutorial).

## Definition Of 'Tools'

Pretty much everyone agrees though that for a system to be `agentic` it needs access to tools.

The whitepaper defines tools as "bridging the gap between the agent's internal capabilities and the external world."

But it goes further than most tool definitions. It actually defines different types of tools: extensions and functions.

### Extensions

Extensions are ways to extend the capability of the agent. They show the example of calling APIs, for instance to fetch the weather or fetch directions between two places.

You can think of extensions as things the agent can do without asking.

These are like typical tool definitions. We tell it how to use each tool using examples and tell the agent what arguments are needed to successfully call the tool.

### Functions

Functions are different to extensions. You teach the LLM how to use them in exactly the same way. But instead of the agent having control over calling the tool, instead the user has control.

Let's take the example of deleting a post in a database. The system the agent is deployed on may not actually have the rights to delete that post. And for various reasons you may not want to give it access to that.

So instead of deleting the post itself, the agent tells the user "delete this post."

This is what it defines as functions: "the logic and execution of calling the actual API endpoint is offloaded away from the agent and back to the client-side application."

There are several reasons you might do this:

- As we described before, you don't want to give the agent permission to perform those actions
- You want to do some human-in-the-loop review
- Or you want to build the agent while reusing existing API endpoints

So to sum up: with extensions the agent handles the tool execution; with functions the client handles the tool execution.

### My Thoughts

This definition is a bit funky. I always have a bit of an issue with hanging concepts on such commonly used words. If you're a developer you already know what a function is. And the definition of function versus extension is kind of unclear.

The whitepaper goes on to mention Google's Vertex AI platform. So it's possible that functions versus extensions is a key concept there.

I do like it as a teaching device but I'm not sure if I'm going to be using that definition myself.

## Conclusion

Overall Google's whitepaper is a pretty nice introduction to the field, and adds a couple of interesting definitions to the discussion.

There's more stuff in there like examples using LangChain and Python, so it's worth checking out yourself.

But I hope you enjoyed that summary and I will see you for the next one.
