import { error } from "@sveltejs/kit";
import { normalizeSiteLanguage } from "$lib/i18n";
import {
  hasPublishedMetadata,
  includeAiMetadata,
  localizeVideo,
} from "$lib/server/localized-videos";
import { prisma } from "$lib/server/prisma";

export const load = async ({ params }) => {
  const lang = normalizeSiteLanguage(params.lang);
  const channel = await prisma.channel.findUnique({
    where: { slug: params.slug },
  });

  if (!channel) {
    throw error(404, "Channel not found");
  }

  const videos = await prisma.video.findMany({
    where: {
      status: "PUBLISHED",
      channelId: channel.id,
      aiMetadata: hasPublishedMetadata(lang),
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
    channel,
    videos: videos.map((video) => localizeVideo(video, lang)),
  };
};
