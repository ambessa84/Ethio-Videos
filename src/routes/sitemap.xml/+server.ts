import { prisma } from "$lib/server/prisma";
import { env } from "$env/dynamic/private";
import {
  getLocalizedCategoryPath,
  getLocalizedChannelPath,
  getLocalizedStaticPath,
  getLocalizedTagPath,
  getLocalizedVideoPath,
  supportedLanguages,
} from "$lib/i18n";

export const GET = async () => {
  const siteUrl = env.PUBLIC_SITE_URL || "http://localhost:5173";

  const [videos, categories, channels, tags] = await Promise.all([
    prisma.video.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        updatedAt: true,
        aiMetadata: {
          select: {
            language: true,
            slug: true,
            updatedAt: true,
          },
        },
      },
    }),
    prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    }),
    prisma.channel.findMany({
      select: { slug: true, updatedAt: true },
    }),
    prisma.tag.findMany({
      where: {
        videos: {
          some: {
            video: {
              status: "PUBLISHED",
            },
          },
        },
      },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const urls = [
    ...supportedLanguages.map((language) => ({
      loc: `${siteUrl}/${language}`,
      lastmod: new Date(),
    })),
    ...supportedLanguages.map((language) => ({
      loc: `${siteUrl}${getLocalizedStaticPath(language, "latest")}`,
      lastmod: new Date(),
    })),
    ...supportedLanguages.map((language) => ({
      loc: `${siteUrl}${getLocalizedStaticPath(language, "trending")}`,
      lastmod: new Date(),
    })),
    ...supportedLanguages.map((language) => ({
      loc: `${siteUrl}${getLocalizedStaticPath(language, "search")}`,
      lastmod: new Date(),
    })),
    ...supportedLanguages.map((language) => ({
      loc: `${siteUrl}${getLocalizedStaticPath(language, "submitVideo")}`,
      lastmod: new Date(),
    })),
    ...supportedLanguages.map((language) => ({
      loc: `${siteUrl}${getLocalizedStaticPath(language, "newsletter")}`,
      lastmod: new Date(),
    })),
    ...videos.flatMap((video) =>
      supportedLanguages.map((language) => {
        const metadata = video.aiMetadata.find(
          (metadata) => metadata.language === language,
        );

        return {
          loc: `${siteUrl}${getLocalizedVideoPath(
            language,
            metadata?.slug || video.slug,
          )}`,
          lastmod: metadata?.updatedAt ?? video.updatedAt,
        };
      }),
    ),
    ...categories.map((category) => ({
      loc: `${siteUrl}/category/${category.slug}`,
      lastmod: category.updatedAt,
    })),
    ...supportedLanguages.flatMap((language) =>
      categories.map((category) => ({
        loc: `${siteUrl}${getLocalizedCategoryPath(language, category.slug)}`,
        lastmod: category.updatedAt,
      })),
    ),
    ...channels.map((channel) => ({
      loc: `${siteUrl}/channel/${channel.slug}`,
      lastmod: channel.updatedAt,
    })),
    ...supportedLanguages.flatMap((language) =>
      channels.map((channel) => ({
        loc: `${siteUrl}${getLocalizedChannelPath(language, channel.slug)}`,
        lastmod: channel.updatedAt,
      })),
    ),
    ...tags.map((tag) => ({
      loc: `${siteUrl}/tag/${tag.slug}`,
      lastmod: tag.updatedAt,
    })),
    ...supportedLanguages.flatMap((language) =>
      tags.map((tag) => ({
        loc: `${siteUrl}${getLocalizedTagPath(language, tag.slug)}`,
        lastmod: tag.updatedAt,
      })),
    ),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `<url>
  <loc>${url.loc}</loc>
  <lastmod>${url.lastmod.toISOString()}</lastmod>
</url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml",
    },
  });
};
