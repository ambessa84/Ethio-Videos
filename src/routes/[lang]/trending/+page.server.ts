import { normalizeSiteLanguage } from "$lib/i18n";
import {
  hasPublishedMetadata,
  includeAiMetadata,
  localizeVideo,
} from "$lib/server/localized-videos";
import { prisma } from "$lib/server/prisma";

export const load = async ({ params }) => {
  const lang = normalizeSiteLanguage(params.lang);
  const videos = await prisma.video.findMany({
    where: {
      status: "PUBLISHED",
      aiMetadata: hasPublishedMetadata(lang),
    },
    include: {
      channel: true,
      category: true,
      aiMetadata: includeAiMetadata(lang),
    },
    orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
    take: 72,
  });

  return { lang, videos: videos.map((video) => localizeVideo(video, lang)) };
};
