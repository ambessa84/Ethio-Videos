import { prisma } from '$lib/server/prisma';

export const load = async () => {
  const channels = await prisma.channel.findMany({
    orderBy: { title: 'asc' },
    include: {
      _count: {
        select: { videos: true }
      }
    }
  });

  return { channels };
};
