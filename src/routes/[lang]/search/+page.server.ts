import { normalizeSiteLanguage } from "$lib/i18n";
import {
  hasPublishedMetadata,
  includeAiMetadata,
  localizeVideo,
} from "$lib/server/localized-videos";
import { prisma } from "$lib/server/prisma";

export const load = async ({ params, url }) => {
  const lang = normalizeSiteLanguage(params.lang);
  const q = url.searchParams.get("q")?.trim() ?? "";

  const videos = q
    ? await prisma.video.findMany({
        where: {
          status: "PUBLISHED",
          aiMetadata: hasPublishedMetadata(lang),
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            {
              aiMetadata: {
                some: {
                  language: lang,
                  localizedStatus: "PUBLISHED",
                  OR: [
                    { seoTitle: { contains: q, mode: "insensitive" } },
                    { seoDescription: { contains: q, mode: "insensitive" } },
                    { shortSummary: { contains: q, mode: "insensitive" } },
                    { longSummary: { contains: q, mode: "insensitive" } },
                  ],
                },
              },
            },
            {
              channel: {
                title: { contains: q, mode: "insensitive" },
              },
            },
          ],
        },
        include: {
          channel: true,
          category: true,
          aiMetadata: includeAiMetadata(lang),
        },
        orderBy: {
          publishedAt: "desc",
        },
        take: 60,
      })
    : [];

  return {
    lang,
    q,
    videos: videos.map((video) => localizeVideo(video, lang)),
  };
};
