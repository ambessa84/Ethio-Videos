import { prisma } from '$lib/server/prisma';

export const load = async ({ url }) => {
  const q = url.searchParams.get('q')?.trim() ?? '';

  const videos = q
    ? await prisma.video.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { summary: { contains: q, mode: 'insensitive' } },
            {
              channel: {
                title: { contains: q, mode: 'insensitive' }
              }
            }
          ]
        },
        include: {
          channel: true,
          category: true
        },
        orderBy: {
          publishedAt: 'desc'
        },
        take: 60
      })
    : [];

  return { q, videos };
};
