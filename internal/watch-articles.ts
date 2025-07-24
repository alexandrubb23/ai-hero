import { watch } from "chokidar";
import frontMatter from "front-matter";
import {
  glob,
  readFile,
  writeFile,
} from "fs/promises";
import path from "path";

if (!process.env.AI_HERO_TOKEN) {
  throw new Error("AI_HERO_TOKEN is required");
}

export const fetchFromAiHero = async (
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

  if (!result.ok) {
    console.error(result.status, result.statusText);
    console.dir(await result.json(), { depth: null });
    throw new Error(result.statusText);
  }

  return await result.json();
};

const fileLocations = [
  path.join(process.cwd(), "examples", "**/*.md"),
  path.join(process.cwd(), "courses", "**/*.md"),
];

const files = await Array.fromAsync(
  glob(fileLocations),
);

const convertSlugToId = async (
  filePath: string,
  slug: string,
) => {
  try {
    const post: {
      id: string;
      fields: { title: string; slug: string };
    } = await fetchFromAiHero(
      `/posts?slugOrId=${slug}`,
      {
        method: "GET",
      },
    );

    const fileContents = await readFile(
      filePath,
      "utf-8",
    );
    const fm = (
      frontMatter as unknown as typeof frontMatter.default
    )(fileContents);

    // Create new frontmatter with ID instead of slug
    const newFrontmatter = Object.fromEntries(
      Object.entries(
        fm.attributes as Record<string, any>,
      ).filter(([key]) => key !== "slug"),
    );
    newFrontmatter.id = post.id;

    // Write the updated content back to the file
    const newContent = `---\n${Object.entries(
      newFrontmatter,
    )
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")}\n---\n\n${fm.body}`;

    await writeFile(filePath, newContent, "utf-8");
    console.log(
      `📝 Updated frontmatter in ${filePath} with ID: ${post.id}`,
    );
  } catch (error) {
    console.error(
      `Failed to fetch post with slug ${slug}:`,
      error,
    );
  }
};

const updateContent = async (
  id: string,
  body: string,
) => {
  if (id.startsWith("post_")) {
    const post = await fetchFromAiHero(
      `/posts?slugOrId=${id}`,
      {
        method: "GET",
      },
    );

    console.log(`📝 ${post.fields.slug} changed`);

    await fetchFromAiHero(`/posts?id=${id}`, {
      method: "PUT",
      body: JSON.stringify({
        id: id,
        fields: {
          slug: post.fields.slug,
          title: post.fields.title,
          body: body.trim(),
        },
      }),
    });

    console.log(
      `📝 Updated post: https://aihero.dev/${post.fields.slug}`,
    );
  } else if (id.startsWith("lesson-")) {
    const lesson: {
      fields: {
        slug: string;
        title: string;
      };
      parentResources: {
        type: string;
        fields: {
          slug: string;
        };
      }[];
    } = await fetchFromAiHero(
      `/lessons?slugOrId=${id}`,
      {
        method: "GET",
      },
    );

    console.log(
      `📚 Lesson ${lesson.fields.slug} changed`,
    );

    await fetchFromAiHero(`/lessons?id=${id}`, {
      method: "PUT",
      body: JSON.stringify({
        id: id,
        fields: {
          slug: lesson.fields.slug,
          title: lesson.fields.title,
          body: body.trim(),
        },
      }),
    });

    const workshopSlug = lesson.parentResources.find(
      (resource) => resource.type === "workshop",
    )?.fields.slug;

    if (workshopSlug) {
      console.log(
        `📚 Updated lesson: https://aihero.dev/workshops/${workshopSlug}/${lesson.fields.slug}`,
      );
    } else {
      console.log(
        `📚 Updated lesson: ${lesson.fields.slug}`,
      );
    }
  } else {
    console.log(`⚠️  Unknown ID format: ${id}`);
  }
};

const watcher = watch(files, {
  ignoreInitial: true,
});

watcher.on("all", async (eventName, filePath) => {
  // Ignore unlink events and directory events
  switch (eventName) {
    case "unlink":
    case "addDir":
    case "error":
    case "unlinkDir":
      return;
    case "add":
      watcher.add(filePath);
      return;
  }

  const fileContents = await readFile(
    filePath,
    "utf-8",
  );
  const fm = (
    frontMatter as unknown as typeof frontMatter.default
  )(fileContents);

  const attributes = fm.attributes as {
    id?: string;
    slug?: string;
    [key: string]: any;
  };
  const id = attributes?.id;
  const slug = attributes?.slug;

  if (!id) {
    if (slug) {
      await convertSlugToId(filePath, slug);
    } else {
      console.log(
        "⚠️  No 'id' or 'slug' found in frontmatter",
      );
    }
    return;
  }

  try {
    await updateContent(id, fm.body);
  } catch (error) {
    console.error(error);
  }
});
