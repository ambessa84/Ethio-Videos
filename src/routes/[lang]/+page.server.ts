import { normalizeSiteLanguage } from "$lib/i18n";
import { includeAiMetadata, localizeVideo } from "$lib/server/localized-videos";
import { prisma } from "$lib/server/prisma";

export const load = async ({ params }) => {
  const lang = normalizeSiteLanguage(params.lang);
  const aiMetadata = includeAiMetadata(lang);
  const [latestVideos, featuredVideos, categories] = await Promise.all([
    prisma.video.findMany({
      where: { status: "PUBLISHED" },
      include: { channel: true, category: true, aiMetadata },
      orderBy: { publishedAt: "desc" },
      take: 16,
    }),
    prisma.video.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      include: { channel: true, category: true, aiMetadata },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    lang,
    latestVideos: latestVideos.map((video) => localizeVideo(video, lang)),
    featuredVideos: featuredVideos.map((video) => localizeVideo(video, lang)),
    categories,
  };
};
