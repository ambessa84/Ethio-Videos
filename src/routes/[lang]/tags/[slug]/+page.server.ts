import { error } from "@sveltejs/kit";
import { normalizeSiteLanguage } from "$lib/i18n";
import { includeAiMetadata, localizeVideo } from "$lib/server/localized-videos";
import { prisma } from "$lib/server/prisma";

export const load = async ({ params }) => {
  const lang = normalizeSiteLanguage(params.lang);
  const tag = await prisma.tag.findUnique({
    where: { slug: params.slug },
  });

  if (!tag) {
    throw error(404, "Tag not found");
  }

  const taggedVideos = await prisma.videoTag.findMany({
    where: {
      tagId: tag.id,
      video: {
        status: "PUBLISHED",
      },
    },
    include: {
      video: {
        include: {
          channel: true,
          category: true,
          aiMetadata: includeAiMetadata(lang),
        },
      },
    },
    orderBy: {
      video: {
        publishedAt: "desc",
      },
    },
    take: 72,
  });

  return {
    lang,
    tag,
    videos: taggedVideos.map((videoTag) => localizeVideo(videoTag.video, lang)),
  };
};
