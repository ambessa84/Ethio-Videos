import { randomUUID } from "node:crypto";
import type { ParsedNewsItem } from "./news-rss";
import { parseRssFeed } from "./news-rss";
import {
  parseWordPressPosts,
  wordpressPostsEndpoint,
  type WordPressPost,
} from "./news-wordpress";
import { prisma } from "./prisma";

export type ImportNewsFeedResult = {
  source: string;
  imported: number;
  skipped: number;
  error?: string;
};

export type NewsSourceImportTarget = {
  id: string;
  name: string;
  feedUrl: string;
  language: string | null;
  defaultTopic: string | null;
};

const rssRequestHeaders = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,application/rss+xml;q=0.8,text/xml;q=0.8,*/*;q=0.7",
  "accept-language": "en-US,en;q=0.9,fr;q=0.8",
  "cache-control": "no-cache",
  pragma: "no-cache",
  "upgrade-insecure-requests": "1",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
};

async function fetchWordPressPosts(feedUrl: string): Promise<ParsedNewsItem[]> {
  const endpoint = wordpressPostsEndpoint(feedUrl);
  const response = await fetch(endpoint, {
    headers: {
      ...rssRequestHeaders,
      accept: "application/json,text/plain,*/*",
    },
  });

  if (response.status === 403) {
    throw new Error(
      `Cloudflare blocked both the RSS feed and WordPress posts endpoint for ${new URL(feedUrl).origin}. Use a publisher-approved feed, an allowlisted endpoint, or disable this source.`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `WordPress posts endpoint ${endpoint} returned HTTP ${response.status}`,
    );
  }

  const posts = (await response.json()) as WordPressPost[];

  return parseWordPressPosts(posts);
}

async function fetchNewsItems(feedUrl: string): Promise<ParsedNewsItem[]> {
  const response = await fetch(feedUrl, {
    headers: rssRequestHeaders,
  });

  if (response.status === 403) {
    return fetchWordPressPosts(feedUrl);
  }

  if (!response.ok) {
    throw new Error(`News feed ${feedUrl} returned HTTP ${response.status}`);
  }

  return parseRssFeed(await response.text());
}

export async function importNewsItemsForSource(
  source: NewsSourceImportTarget,
  items: ParsedNewsItem[],
): Promise<ImportNewsFeedResult> {
  let imported = 0;
  let skipped = 0;

  for (const item of items) {
    const existingArticle = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "NewsArticle"
      WHERE "sourceUrl" = ${item.sourceUrl}
      LIMIT 1
    `;

    if (existingArticle.length) {
      skipped += 1;
      continue;
    }

    await prisma.$executeRaw`
      INSERT INTO "NewsArticle" (
        id,
        "sourceId",
        "sourceUrl",
        slug,
        title,
        excerpt,
        "imageUrl",
        author,
        topic,
        language,
        "publishedAt",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${randomUUID()},
        ${source.id},
        ${item.sourceUrl},
        ${item.slug},
        ${item.title},
        ${item.excerpt ?? null},
        ${item.imageUrl ?? null},
        ${item.author ?? null},
        ${source.defaultTopic},
        ${source.language},
        ${item.publishedAt ?? null},
        NOW(),
        NOW()
      )
    `;
    imported += 1;
  }

  return {
    source: source.name,
    imported,
    skipped,
  };
}

async function importNewsSource(
  source: NewsSourceImportTarget,
): Promise<ImportNewsFeedResult> {
  try {
    const items = await fetchNewsItems(source.feedUrl);
    const result = await importNewsItemsForSource(source, items);

    await prisma.$executeRaw`
      UPDATE "NewsSource"
      SET "lastFetchedAt" = NOW(), "lastError" = NULL, "updatedAt" = NOW()
      WHERE id = ${source.id}
    `;

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    await prisma.$executeRaw`
      UPDATE "NewsSource"
      SET "lastFetchedAt" = NOW(), "lastError" = ${message}, "updatedAt" = NOW()
      WHERE id = ${source.id}
    `;

    return {
      source: source.name,
      imported: 0,
      skipped: 0,
      error: message,
    };
  }
}

export async function importNewsFeeds() {
  const sources = await prisma.$queryRaw<
    Array<{
      id: string;
      name: string;
      feedUrl: string;
      language: string | null;
      defaultTopic: string | null;
    }>
  >`
    SELECT id, name, "feedUrl", language, "defaultTopic"
    FROM "NewsSource"
    WHERE "isActive" = true
    ORDER BY name ASC
  `;

  return Promise.all(sources.map(importNewsSource));
}
