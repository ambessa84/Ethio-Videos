import { prisma } from "$lib/server/prisma";

export const load = async () => {
  const videos = await prisma.video.findMany({
    where: { status: "PUBLISHED" },
    include: { channel: true, category: true },
    orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
    take: 72,
  });

  return { videos };
};
