import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dedent from "dedent";
import { z } from "zod";
import { serper } from "../../tools/01-serper-TODO/tools.ts";
import { bulkCrawlWebsites } from "./crawl-site.ts";
import { logger } from "./logger.ts";

const server = new McpServer({
  name: "Search And Crawl",
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

    logger.info(`searchWebResults`, results);

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

const transport = new StdioServerTransport();
await server.connect(transport);
