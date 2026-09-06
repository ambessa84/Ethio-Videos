import { randomUUID } from "node:crypto";
import { parseRssFeed } from "./news-rss";
import { prisma } from "./prisma";

export type ImportNewsFeedResult = {
  source: string;
  imported: number;
  skipped: number;
  error?: string;
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

async function importNewsSource(source: {
  id: string;
  name: string;
  feedUrl: string;
  language: string | null;
  defaultTopic: string | null;
}): Promise<ImportNewsFeedResult> {
  try {
    const response = await fetch(source.feedUrl, {
      headers: rssRequestHeaders,
    });

    if (!response.ok) {
      throw new Error(
        `News feed ${source.feedUrl} returned HTTP ${response.status}`,
      );
    }

    const xml = await response.text();
    const items = parseRssFeed(xml);
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

    await prisma.$executeRaw`
      UPDATE "NewsSource"
      SET "lastFetchedAt" = NOW(), "lastError" = NULL, "updatedAt" = NOW()
      WHERE id = ${source.id}
    `;

    return {
      source: source.name,
      imported,
      skipped,
    };
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
