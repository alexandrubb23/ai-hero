import { existsSync } from "fs";
import config from "./examples.json" with { type: "json" };
import { Command } from "commander";
import path from "path";
import { readdir } from "fs/promises";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const program = new Command();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const examplesPath = path.resolve(
  __dirname,
  "../examples",
);

program
  .arguments("<directory> <number>")
  .action(
    async (
      directoryOrAlias: string,
      number: string,
    ) => {
      const possibleDirectories = [
        directoryOrAlias,
        config["path-aliases"][
          directoryOrAlias as keyof (typeof config)["path-aliases"]
        ] || "NOT_FOUND",
      ];

      const directory = possibleDirectories
        .map((alias) =>
          path.resolve(examplesPath, alias),
        )
        .find((path) => existsSync(path));

      if (!directory) {
        console.error(
          `Directory not found: ${directoryOrAlias}`,
        );
        process.exit(1);
      }

      const examples = await readdir(directory);

      const exampleToRun = examples.find((example) => {
        return example.startsWith(number);
      });

      if (!exampleToRun) {
        console.error(
          `Could not find example ${number} in ${directory}. Does it exist?`,
        );
        process.exit(1);
      }

      if (exampleToRun.endsWith("TODO")) {
        console.log(
          `Example ${number} in ${directory} is still in TODO state. Running it may produce unexpected results.`,
        );
      }

      const mainFilePath = path.resolve(
        directory,
        exampleToRun,
        "main.ts",
      );

      if (!existsSync(mainFilePath)) {
        console.error(
          `Could not find main.ts file for example ${number} in ${directory}.`,
        );
        process.exit(1);
      }

      try {
        execSync(
          `pnpm tsx --env-file=.env ${mainFilePath}`,
          {
            stdio: "inherit",
          },
        );
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    },
  );

program.parse(process.argv);
