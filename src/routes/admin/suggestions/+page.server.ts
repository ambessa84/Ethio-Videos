import { prisma } from "$lib/server/prisma";

export const load = async () => {
  const suggestions = await prisma.videoSuggestion.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return { suggestions };
};
