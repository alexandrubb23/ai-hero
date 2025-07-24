import { serve } from "@hono/node-server";
import tailwindcss from "@tailwindcss/vite";
import { watch } from "chokidar";
import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { once } from "node:events";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";

type SimpleAPIRoute = (
  req: Request,
) => Promise<Response> | Response;

const indexHtmlTemplate = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/root.tsx"></script>
  </body>
</html>
`;

const simpleAPIRouteToHonoRoute =
  (route: SimpleAPIRoute) => async (c: Context) => {
    const res = await route(c.req.raw);
    c.res = res;
  };

const runHonoApp = async (opts: { root: string }) => {
  const app = new Hono();

  app.use("/*", cors());

  const routes = await getRoutes({ root: opts.root });

  for (const route of routes) {
    app.get(
      route.path,
      simpleAPIRouteToHonoRoute(route.get),
    );
    app.post(
      route.path,
      simpleAPIRouteToHonoRoute(route.post),
    );
    app.put(
      route.path,
      simpleAPIRouteToHonoRoute(route.put),
    );
    app.delete(
      route.path,
      simpleAPIRouteToHonoRoute(route.delete),
    );
  }

  const honoServer = serve({
    fetch: app.fetch,
    port: 3001,
  });

  await once(honoServer, "listening");

  return honoServer;
};

const notImplemented = () =>
  new Response("Not implemented", { status: 501 });

const getRoutes = async (opts: { root: string }) => {
  const filesInApiDir = await readdir(
    path.join(opts.root, "api"),
  );

  const tsFiles = filesInApiDir.filter((file) =>
    file.endsWith(".ts"),
  );

  const routes = await Promise.all(
    tsFiles.map(async (file) => {
      const mod = await import(
        path.join(
          opts.root,
          "api",
          file + "?hash=" + Date.now(),
        )
      );

      const getRoute: SimpleAPIRoute =
        mod.GET ?? notImplemented;
      const postRoute: SimpleAPIRoute =
        mod.POST ?? notImplemented;
      const putRoute: SimpleAPIRoute =
        mod.PUT ?? notImplemented;
      const deleteRoute: SimpleAPIRoute =
        mod.DELETE ?? notImplemented;

      return {
        path: `/api/${file.replace(".ts", "")}`,
        get: getRoute,
        post: postRoute,
        put: putRoute,
        delete: deleteRoute,
      };
    }),
  );

  return routes;
};

/**
 * Runs a local dev server for a given root directory and routes.
 *
 * Client code is assumed to be at `./client` of the root directory.
 * Server code is assumed to be at `./api` of the root directory.
 */
export const runLocalDevServer = async (opts: {
  root: string;
}) => {
  let [honoServer, viteServer] = await Promise.all([
    runHonoApp(opts),
    createServer({
      configFile: false,
      server: {
        port: 3000,
        open: true,
        proxy: {
          "/api": "http://localhost:3001",
        },
      },
      plugins: [
        tailwindcss(),
        {
          name: "virtual-index-html",
          configureServer(server) {
            server.middlewares.use(
              "/",
              (req, res, next) => {
                if (
                  req.url === "/" ||
                  req.url === "/index.html"
                ) {
                  res.setHeader(
                    "Content-Type",
                    "text/html",
                  );
                  res.end(indexHtmlTemplate);
                  return;
                }
                next();
              },
            );
          },
        },
      ],
      root: path.join(opts.root, "client"),
    }).then((server) => server.listen()),
  ]);

  viteServer.printUrls();

  watch(path.join(opts.root, "api"), {
    ignoreInitial: true,
  }).on("change", async () => {
    honoServer.close();
    console.log("Reloading server...");
    honoServer = await runHonoApp(opts);
  });

  return {
    close: () => {
      viteServer.close();
      honoServer?.close();
    },
  };
};
