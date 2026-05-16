import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const load = async ({ params }) => {
  const channel = await prisma.channel.findUnique({
    where: { slug: params.slug }
  });

  if (!channel) {
    throw error(404, 'Channel not found');
  }

  const videos = await prisma.video.findMany({
    where: {
      status: 'PUBLISHED',
      channelId: channel.id
    },
    include: {
      channel: true,
      category: true
    },
    orderBy: {
      publishedAt: 'desc'
    },
    take: 72
  });

  return { channel, videos };
};
