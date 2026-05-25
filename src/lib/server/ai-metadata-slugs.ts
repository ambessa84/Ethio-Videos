import { prisma } from "$lib/server/prisma";
import { createSlug } from "$lib/server/slug";

export async function createUniqueAiMetadataSlug(
  input: string,
  language: string,
  videoId: string,
) {
  const baseSlug = createSlug(input) || videoId;
  const existing = await prisma.videoAiMetadata.findFirst({
    where: {
      language,
      slug: baseSlug,
      videoId: { not: videoId },
    },
    select: { id: true },
  });

  if (!existing) return baseSlug;

  return `${baseSlug}-${videoId.slice(0, 8)}`;
}
