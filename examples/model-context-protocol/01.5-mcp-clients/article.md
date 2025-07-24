MCP clients are coming thick and fast. MCP support is being added to existing apps, and new apps are emerging with MCP support built in.

Here are a few MCP clients that I know of:

- **[Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)** - a CLI-based tool that lets you chat with your codebase. Supports MCP tools.
- **[Cursor](https://cursor.com/)**, **[Windsurf](https://codeium.com/windsurf) and [Zed](https://zed.dev/)** are IDE's that support MCP. They let you edit your code using a text editor, as well as chat to an IDE to improve it.
- **[Claude Desktop](https://claude.ai/download)** is the first non-coding tool in our list. It lets you run MCP servers to power up Claude.

Any that I've missed? Tell us in [Discord](/discord) which ones you're using.

## Your Own Client

The final client worth mentioning is **your own**. You can build your own MCP client using the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk?tab=readme-ov-file#writing-mcp-clients). Covering this is outside the scope of this tutorial, but it's worth playing around with.

This means that, in theory, any application could be a MCP host. You'd need to use the SDK to connect to the server and call tools.
