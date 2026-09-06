import { readFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import {
  importNewsItemsForSource,
  type NewsSourceImportTarget,
} from "../src/lib/server/import-news";
import { parseRssFeed, type ParsedNewsItem } from "../src/lib/server/news-rss";
import {
  parseWordPressPosts,
  type WordPressPost,
} from "../src/lib/server/news-wordpress";
import { prisma } from "../src/lib/server/prisma";

try {
  loadEnvFile();
} catch {
  // Hosts can provide DATABASE_URL and other values without a local .env file.
}

function argumentValue(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function parseItems(content: string): ParsedNewsItem[] {
  const trimmed = content.trim();

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    const parsed = JSON.parse(trimmed) as WordPressPost[] | { posts?: WordPressPost[] };
    const posts = Array.isArray(parsed) ? parsed : parsed.posts;

    if (!posts) {
      throw new Error("JSON file must contain a WordPress posts array.");
    }

    return parseWordPressPosts(posts);
  }

  return parseRssFeed(content);
}

async function findSource(slug: string) {
  const sources = await prisma.$queryRaw<NewsSourceImportTarget[]>`
    SELECT id, name, "feedUrl", language, "defaultTopic"
    FROM "NewsSource"
    WHERE slug = ${slug}
    LIMIT 1
  `;

  return sources[0];
}

async function main() {
  const sourceSlug = argumentValue("--source");
  const filePath = argumentValue("--file");

  if (!sourceSlug || !filePath) {
    throw new Error(
      "Usage: pnpm news:import:file -- --source addis-standard --file ./addis-standard.xml",
    );
  }

  const source = await findSource(sourceSlug);

  if (!source) {
    throw new Error(
      `News source "${sourceSlug}" was not found. Run pnpm db:seed first.`,
    );
  }

  const items = parseItems(await readFile(filePath, "utf8"));
  const result = await importNewsItemsForSource(source, items);

  console.log(
    `ok ${result.source}: imported=${result.imported} skipped=${result.skipped}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
