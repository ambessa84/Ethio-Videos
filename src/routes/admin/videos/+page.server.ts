import { prisma } from '$lib/server/prisma';

export const load = async () => {
  const videos = await prisma.video.findMany({
    include: {
      channel: true,
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 100
  });

  return { videos };
};
