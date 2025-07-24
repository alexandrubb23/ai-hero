import { readFileSync } from "fs";
import path from "path";

const fetchFromAiHero = async (
  path: string,
  init?: Omit<RequestInit, "headers">,
) => {
  const result = await fetch(
    `https://www.aihero.dev/api${path}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${process.env.AI_HERO_TOKEN}`,
      },
    },
  );

  return await result.json();
};

const shortlinksPath = path.join(
  import.meta.dirname,
  "./shortlinks.json",
);

const shortlinks: Record<string, string> = JSON.parse(
  readFileSync(shortlinksPath, "utf-8").trim(),
);

for (const [shortlink, path] of Object.entries(
  shortlinks,
)) {
  const result = await fetchFromAiHero(`/shortlinks`, {
    method: "POST",
    body: JSON.stringify({
      key: shortlink,
      url: path,
    }),
  });

  console.log(shortlink, result);
}
