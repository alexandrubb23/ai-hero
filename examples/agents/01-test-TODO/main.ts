import { runLocalDevServer } from "../../_shared/dev-server/run-local-dev-server-new.ts";

await runLocalDevServer({
  root: import.meta.dirname,
});
