We've discussed so far how to add tools to your MCP server.

But something I haven't seen discussed a lot online is the fact you can use an MCP server as a prompt directory.

You can provide your MCP clients with prompt templates that they can use to drive the behavior of their LLM.

I'm going to show you one of my favorite prompt templates that I used in the creation of this article.

## The Code

Let's start with our boilerplate code: the server and the transport:

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "Prompt Directory",
  version: "1.0.0",
});

// ...more code in here

const transport = new StdioServerTransport();
await server.connect(transport);
```

This server is going to house a `cleanTranscription` prompt. I record most of my articles via dictation, and this prompt helps me clean up mistakes in the transcription.

<Scrollycoding>

# !!steps

Let's start by adding a `prompt` to the server. This has a very similar syntax to `tool`. But instead of `server.tool`, we'll call `server.prompt`:

```ts ! example.ts
server.prompt("cleanTranscription");
```

# !!steps

Next we'll add a description to describe what the tool actually does.

```ts ! example.ts
server.prompt(
  "cleanTranscription",
  `Clean up a transcript file`,
);
```

# !!steps

This tool is going to take in the path to the file to clean up. So let's specify that using zod:

```ts ! example.ts
import { z } from "zod";

server.prompt(
  `cleanTranscription`,
  `Clean up a transcript file`,
  { path: z.string() },
);
```

# !!steps

Finally, we'll add a callback to return the value of the prompt. This comes back in a messages array, with a role of `user` and some text content.

```ts ! example.ts
import { z } from "zod";

server.prompt(
  `cleanTranscription`,
  `Clean up a transcript file`,
  { path: z.string() },
  async ({ path }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: getPrompt(path),
          },
        },
      ],
    };
  },
);
```

</Scrollycoding>

This means we've added a prompt template called clean transcription to our MCP server.

## The Prompt

For those interested, here is the prompt I use:

```ts
const getPrompt = (path: string) =>
  `
Clean up the transcript in the file at ${path}
Do not edit the words,
only the formatting and any incorrect transcriptions.
Turn long-form numbers to short-form:
123 -> 123
300,422 -> 300,422
Add punctuation where necessary.
Wrap any references to code in backticks.
Include links as-is - do not modify links.

Common terms:
LLM-as-a-judge
ReAct
Reflexion
RAG
Vercel
`;
```

There are around 200 common terms, so I've left them off for brevity.

## The Demo

We can connect to this server from Claude Code using the same technique as [we saw before](https://www.aihero.dev/mcp-server-from-a-single-typescript-file).

When we do, the prompt template is sourced as a command we can run from within Claude. We can access it by typing `/cleanTranscription` within the Claude Code interface. It shows the prompt via autocomplete:

![`/cleanTranscription` visible from Claude Code](http://res.cloudinary.com/total-typescript/image/upload/v1741618645/posts/post_k3ou7/ewbqn3782ztrpafxlmdf.png)

When we run it, we are prompted to add the `path` argument:

![Claude Code asking for the `path` variable](http://res.cloudinary.com/total-typescript/image/upload/v1741618644/posts/post_k3ou7/johh2yqdfn6jndtvrk0b.png)

And it runs the prompt on the file.

I use this prompt a lot so having it at my fingertips is extremely useful.

## Conclusion

This is a simple example of how you can use an MCP server as a prompt directory. You can provide your users with a set of prompts that they can use to drive the behavior of their LLM.

This is pretty powerful as a personal productivity tool, and also as a way to provide commands for your MCP clients for often-used workflows.
