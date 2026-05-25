import { prisma } from "$lib/server/prisma";
import { env } from "$env/dynamic/private";

export const GET = async () => {
  const siteUrl = env.PUBLIC_SITE_URL || "http://localhost:5173";

  const [videos, categories, channels, tags] = await Promise.all([
    prisma.video.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
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
    { loc: siteUrl, lastmod: new Date() },
    { loc: `${siteUrl}/latest`, lastmod: new Date() },
    { loc: `${siteUrl}/trending`, lastmod: new Date() },
    ...videos.map((video) => ({
      loc: `${siteUrl}/video/${video.slug}`,
      lastmod: video.updatedAt,
    })),
    ...categories.map((category) => ({
      loc: `${siteUrl}/category/${category.slug}`,
      lastmod: category.updatedAt,
    })),
    ...channels.map((channel) => ({
      loc: `${siteUrl}/channel/${channel.slug}`,
      lastmod: channel.updatedAt,
    })),
    ...tags.map((tag) => ({
      loc: `${siteUrl}/tag/${tag.slug}`,
      lastmod: tag.updatedAt,
    })),
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
