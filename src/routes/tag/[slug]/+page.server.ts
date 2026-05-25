import { error } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

export const load = async ({ params }) => {
  const tag = await prisma.tag.findUnique({
    where: { slug: params.slug },
  });

  if (!tag) {
    throw error(404, "Tag not found");
  }

  const taggedVideos = await prisma.videoTag.findMany({
    where: {
      tagId: tag.id,
      video: {
        status: "PUBLISHED",
      },
    },
    include: {
      video: {
        include: {
          channel: true,
          category: true,
        },
      },
    },
    orderBy: {
      video: {
        publishedAt: "desc",
      },
    },
    take: 72,
  });

  return {
    tag,
    videos: taggedVideos.map((videoTag) => videoTag.video),
  };
};
