import { prisma } from "$lib/server/prisma";

export type NewsArticleListItem = {
  id: string;
  sourceUrl: string;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  author: string | null;
  topic: string | null;
  language: string | null;
  publishedAt: Date | null;
  importedAt: Date;
  sourceName: string;
  sourceSiteUrl: string | null;
};

export const load = async () => {
  const articles = await prisma.$queryRaw<NewsArticleListItem[]>`
    SELECT
      article.id,
      article."sourceUrl",
      article.title,
      article.excerpt,
      article."imageUrl",
      article.author,
      article.topic,
      article.language,
      article."publishedAt",
      article."importedAt",
      source.name AS "sourceName",
      source."siteUrl" AS "sourceSiteUrl"
    FROM "NewsArticle" article
    INNER JOIN "NewsSource" source ON source.id = article."sourceId"
    ORDER BY article."publishedAt" DESC NULLS LAST, article."importedAt" DESC
    LIMIT 30
  `;

  return {
    articles,
  };
};
