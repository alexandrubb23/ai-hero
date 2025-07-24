import { statSync } from "fs";
import { readdir, rename } from "fs/promises";
import path from "path";

const parsePath = (relativePath: string) => {
  const parsedPath = path.parse(relativePath);

  const pathName = parsedPath.base;

  const isDir = statSync(relativePath).isDirectory();

  // is true if path starts with any numbers, optionally
  // followed by decimal point and more numbers, followed
  // by a dash
  const isExample = /^\d+(?:\.\d+)?-/.test(pathName);

  const exampleNumber = pathName.split("-")[0]!;
  return {
    isExample,
    isDir,
    num: exampleNumber,
  };
};

type ChangeInstruction = {
  from: string;
  to: string;
  prevNum: string;
  newNum: string;
};

export const getPathsToChange = (
  inputPaths: string[],
): {
  changes: ChangeInstruction[];
} => {
  /**
   * {
   *   "01": {
   *     paths: ["examples/01-example/example.ts"]
   *   }
   * }
   */
  const exampleMap: Record<
    string,
    {
      paths: string[];
    }
  > = {};

  inputPaths.forEach((p) => {
    const { isExample, isDir, num } = parsePath(p);

    if (!isExample) {
      return;
    }

    if (!isDir) return;

    exampleMap[num] ??= { paths: [] };

    exampleMap[num].paths.push(p);
  });

  const changes: ChangeInstruction[] = [];

  Object.entries(exampleMap)
    .sort(([aNum], [bNum]) => {
      return aNum.localeCompare(bNum);
    })
    .forEach(([, { paths }], index) => {
      paths.forEach((p) => {
        const { isExample, num: prevNum } =
          parsePath(p);

        if (!isExample) {
          return;
        }

        const newNum = String(index + 1).padStart(
          2,
          "0",
        );

        const newPath = p.replace(
          `${prevNum}-`,
          `${newNum}-`,
        );

        if (prevNum !== newNum) {
          changes.push({
            from: p,
            to: newPath,
            prevNum,
            newNum,
          });
        }
      });
    });

  return { changes };
};

const exampleDirs = (
  await readdir("./examples")
).filter((dir) => !dir.endsWith(".md"));

for (const exampleDir of exampleDirs) {
  if (
    exampleDir.startsWith("_") ||
    exampleDir === "node_modules" ||
    exampleDir === "tsconfig.json"
  ) {
    continue;
  }

  const examples = await readdir(
    path.join("./examples", exampleDir),
  );

  const { changes } = getPathsToChange(
    examples.map((e) =>
      path.join("./examples", exampleDir, e),
    ),
  );

  for (const change of changes) {
    await rename(change.from, change.to);
  }
}
