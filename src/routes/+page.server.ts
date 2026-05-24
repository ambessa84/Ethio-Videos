import { prisma } from "$lib/server/prisma";

export const load = async () => {
  const [latestVideos, featuredVideos, categories] = await Promise.all([
    prisma.video.findMany({
      where: { status: "PUBLISHED" },
      include: { channel: true, category: true },
      orderBy: { publishedAt: "desc" },
      take: 16,
    }),
    prisma.video.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      include: { channel: true, category: true },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    latestVideos,
    featuredVideos,
    categories,
  };
};
