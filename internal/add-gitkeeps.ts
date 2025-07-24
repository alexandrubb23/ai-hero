import * as fs from "fs";
import * as path from "path";

const addGitKeeps = (dir: string) => {
  const items = fs.readdirSync(dir);

  // If directory is empty, add .gitkeep
  if (items.length === 0) {
    fs.writeFileSync(path.join(dir, ".gitkeep"), "");
    console.log(`Added .gitkeep to ${dir}`);
    return;
  }

  // Recursively check subdirectories
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      addGitKeeps(fullPath);
    }
  }
};

const baseDir = import.meta.dirname;
const directories = [
  path.join(baseDir, "../courses"),
  path.join(baseDir, "../examples"),
];

try {
  for (const dir of directories) {
    addGitKeeps(dir);
  }
  console.log(
    "Finished adding .gitkeep files to empty directories",
  );
} catch (error) {
  console.error("Error:", error);
}
