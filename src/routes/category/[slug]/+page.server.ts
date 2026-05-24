import { error } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

export const load = async ({ params }) => {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    throw error(404, "Category not found");
  }

  const videos = await prisma.video.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: category.id,
    },
    include: {
      channel: true,
      category: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 72,
  });

  return { category, videos };
};
