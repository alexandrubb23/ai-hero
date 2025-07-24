I'm going to show you the simplest way you can set up an [MCP server](https://modelcontextprotocol.io/introduction).

We're going to create an MCP server, connect it to [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview), and then use it to run any script we want.

And we're going to do this all with a single TypeScript file and no build step.

Let's go.

## The Server

We're going to start by creating a `main.ts` file.

We're going to initialize an `McpServer`:

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "Weather Service",
  version: "1.0.0",
});
```

We're getting this MCP server from the [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk) package.

<Scrollycoding>

# !!steps

We can then add a tool to this server. We first define the name of the tool, `getWeather`.

```ts ! example.ts
server.tool("getWeather");
```

# !!steps

Then we define what arguments the tool needs to receive in order to run. In this case, we only need the city, which is a string. And we specify this using Zod.

```ts ! example.ts
import { z } from "zod";

server.tool("getWeather", { city: z.string() });
```

# !!steps

Finally, we add a callback function that only runs when the tool is called. We return an array of content objects, where in this case, we're returning text. And we say that the weather in that place is sunny.

This is the function where you'd actually go and call the weather API if we were implementing this for real.

```ts ! example.ts
import { z } from "zod";

server.tool(
  "getWeather",
  { city: z.string() },
  async ({ city }) => {
    return {
      content: [
        {
          type: "text",
          text: `The weather in ${city} is sunny!`,
        },
      ],
    };
  },
);
```

</Scrollycoding>

Our server is actually complete. But we need some way for Claude Code to communicate with our server.

It's going to do this by running this file and communicating with it via stdin.

To get this working, we can use a `StdioServerTransport` from `@modelcontextprotocol/sdk`.

We first define the transport, then connect the server to it.

```ts
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const transport = new StdioServerTransport();
await server.connect(transport);
```

This [stdio transport](https://modelcontextprotocol.io/docs/concepts/transports#standard-input%2Foutput-stdio) enables communication through standard input and output streams, which is ideal for local integrations and command-line tools.

## Connecting to Claude Code

Now in Claude Code, we can run [`claude mcp add`](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/tutorials). This starts an interactive dialogue where you can choose the server you want to connect to.

Right now Claude Code only supports `stdio` transport - which is what we're using.

In the video above, I walk through the interactive steps, but you can run this with a single command:

```sh
claude mcp add "weather-example" npx tsx "/path-to-the-file.ts"
```

This tells Claude that in order to run the file, it should call `npx tsx /path-to-the-file.ts`.

`npx` lets us run any script from `npm`. [`tsx`](https://github.com/privatenumber/tsx) is a fabulous way to run TypeScript files without a build step. And then we pass in the path to our file.

And just like that we should be able to run `claude` and have it communicate with our MCP server. Check out the video above for a demonstration.

## Why Is This Cool?

This is awesome because it allows us to connect arbitrary TypeScript functions to Claude Code without needing to set up a build step or a server.

This is a really powerful way to customize your own Claude Code instance, or other MCP hosts like Cursor and Windsurf.

As more desktop apps start integrating MCPs, this is going to be a really powerful way to extend them with custom capabilities.
