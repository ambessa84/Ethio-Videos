import { prisma } from '$lib/server/prisma';

export const load = async () => {
  const [videos, publishedVideos, draftVideos, suggestions, subscribers] = await Promise.all([
    prisma.video.count(),
    prisma.video.count({ where: { status: 'PUBLISHED' } }),
    prisma.video.count({ where: { status: 'DRAFT' } }),
    prisma.videoSuggestion.count({ where: { status: 'PENDING' } }),
    prisma.newsletterSubscriber.count()
  ]);

  return {
    videos,
    publishedVideos,
    draftVideos,
    suggestions,
    subscribers
  };
};
