import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dedent from "dedent";
import { z } from "zod";
import { viewAIHeroPosts } from "../../projects/03-personal-agent/main.ts";
import { serper } from "../../tools/01-serper-TODO/tools.ts";
import { bulkCrawlWebsites } from "./crawl-site.ts";

const server = new McpServer({
  name: "General Service",
  version: "1.0.0",
});

server.tool(
  "searchWeb",
  `Search the web using Google. Returns snippets.`,
  {
    query: z.string(),
  },
  async ({ query }) => {
    const results =
      await serper.implementations.search({
        q: query,
        num: 10,
      });

    return {
      content: [
        ...(results.knowledgeGraph
          ? [
              {
                type: "text" as const,
                text: dedent`
            Knowledge graph for query: "${query}"
            ${results.knowledgeGraph}
          `,
              },
            ]
          : []),
        ...results.organic.map((result) => ({
          type: "text" as const,
          text: `${result.title} (${result.link}) - ${result.snippet}`,
        })),
      ],
    };
  },
);

server.tool(
  "searchAIHeroPosts",
  dedent`
    Search Posts on AI Hero - the personal blogging platform of the user.
    Use this tool when searching for relevant links for cross-posting.
  `,
  {},
  async () => {
    const posts = await viewAIHeroPosts();

    return {
      content: posts.map((post) => ({
        type: "text" as const,
        text: dedent`
        Title: ${post.title}
        URL: ${post.url}
        State: ${post.state}
        Summary: ${post.summary}
      `,
      })),
    };
  },
);

server.tool(
  "readWebsites",
  `Read websites and return the text as markdown`,
  {
    urls: z.array(z.string()),
  },
  async ({ urls }) => {
    const results = await bulkCrawlWebsites({
      urls,
    });

    return {
      content: results.results.map((result) => {
        if (result.result.success) {
          return {
            type: "text" as const,
            text: `URL: ${result.url}\n${result.result.data}`,
          };
        } else {
          return {
            type: "text" as const,
            text: `URL: ${result.url}\n${result.result.error}`,
          };
        }
      }),
    };
  },
);

server.prompt(
  `checkLinks`,
  `Checks if the links in the specified article are valid`,
  {
    path: z
      .string()
      .describe(
        "The absolute path to the article file, in Linux syntax.",
      ),
  },
  async ({ path }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Check the article links in ${path} to see if they are valid. Use the crawler.`,
          },
        },
      ],
    };
  },
);

server.prompt(
  `addRelevantLinks`,
  `Add relevant links to the article`,
  {
    path: z.string(),
  },
  async ({ path }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: dedent`
              Add relevant links to the article at ${path}.
              Use the searchWeb tool to find relevant links.
              Use the crawler to read the websites and get
              the text, and ensure the links are relevant.
              Do not make big changes to the article - only
              add links to the existing text.
            `,
          },
        },
      ],
    };
  },
);

server.prompt(
  `critiqueArticle`,
  `Suggest improvements that could be made to a markdown article.`,
  { path: z.string() },
  async ({ path }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: dedent`
              Critique the article at ${path} and suggest improvements.
              Use the searchWeb tool to find relevant links.
              Use the crawler to read the websites and get the text,
              and ensure the links are relevant.
              Search the web and the crawler to find supporting information.
              Produce a report that suggests improvements to the article.
            `,
          },
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
