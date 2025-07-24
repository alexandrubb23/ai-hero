import { existsSync, readFileSync } from "fs";
import path from "path";

const shortlinks: Record<string, string> = JSON.parse(
  readFileSync(
    path.join(
      import.meta.dirname,
      "./shortlinks.json",
    ),
    "utf-8",
  ).trim(),
);

Object.entries(shortlinks).forEach(
  ([shortlink, target]) => {
    // Expect it to exist on the file system
    const exists = existsSync(
      path.join(process.cwd(), target),
    );

    if (!exists) {
      console.error(
        `Shortlink target does not exist: ${shortlink} -> ${target}`,
      );
      process.exitCode = 1;
    }
  },
);
