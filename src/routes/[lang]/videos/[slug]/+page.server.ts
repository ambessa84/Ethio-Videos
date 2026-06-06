import { error } from "@sveltejs/kit";
import {
  getLocalizedVideoPath,
  normalizeSiteLanguage,
  supportedLanguages,
} from "$lib/i18n";
import {
  getVideoMetadataForLanguage,
  includeAiMetadata,
  localizeVideo,
} from "$lib/server/localized-videos";
import { prisma } from "$lib/server/prisma";

export const load = async ({ params }) => {
  const lang = normalizeSiteLanguage(params.lang);
  const video = await prisma.video.findFirst({
    where: {
      status: "PUBLISHED",
      aiMetadata: {
        some: {
          language: lang,
          localizedStatus: "PUBLISHED",
          slug: params.slug,
        },
      },
    },
    include: {
      channel: true,
      category: true,
      tags: {
        include: { tag: true },
        orderBy: { tag: { name: "asc" } },
      },
      aiMetadata: true,
    },
  });

  if (!video) {
    throw error(404, "Video not found");
  }

  const localizedVideo = localizeVideo(video, lang);
  const relatedVideos = await prisma.video.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: video.id },
      ...(video.categoryId ? { categoryId: video.categoryId } : {}),
      aiMetadata: {
        some: {
          language: lang,
          localizedStatus: "PUBLISHED",
        },
      },
    },
    include: {
      channel: true,
      category: true,
      aiMetadata: includeAiMetadata(lang),
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 8,
  });

  const languageAlternates = Object.fromEntries(
    supportedLanguages.flatMap((language) => {
      const metadata = getVideoMetadataForLanguage(video, language);
      return metadata?.slug
        ? [[language, getLocalizedVideoPath(language, metadata.slug)]]
        : [];
    }),
  );

  return {
    lang,
    video: localizedVideo,
    relatedVideos: relatedVideos.map((related) => localizeVideo(related, lang)),
    languageAlternates,
  };
};
