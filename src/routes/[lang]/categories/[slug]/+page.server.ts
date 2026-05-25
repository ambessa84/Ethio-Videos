import { error } from "@sveltejs/kit";
import { normalizeSiteLanguage } from "$lib/i18n";
import { includeAiMetadata, localizeVideo } from "$lib/server/localized-videos";
import { prisma } from "$lib/server/prisma";

export const load = async ({ params }) => {
  const lang = normalizeSiteLanguage(params.lang);
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    throw error(404, "Category not found");
  }

  const videos = await prisma.video.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: category.id,
    },
    include: {
      channel: true,
      category: true,
      aiMetadata: includeAiMetadata(lang),
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 72,
  });

  return {
    lang,
    category,
    videos: videos.map((video) => localizeVideo(video, lang)),
  };
};
