import { error } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

export const load = async ({ params }) => {
  const video = await prisma.video.findUnique({
    where: { slug: params.slug },
    include: {
      channel: true,
      category: true,
      tags: {
        include: { tag: true },
        orderBy: { tag: { name: "asc" } },
      },
    },
  });

  if (!video || video.status !== "PUBLISHED") {
    throw error(404, "Video not found");
  }

  const relatedVideos = await prisma.video.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: video.id },
      ...(video.categoryId ? { categoryId: video.categoryId } : {}),
    },
    include: {
      channel: true,
      category: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 8,
  });

  return { video, relatedVideos };
};
