import { prisma } from "$lib/server/prisma";
import { createSlug } from "$lib/server/slug";

export function parseTagsInput(value: string) {
  const seen = new Set<string>();

  return value
    .split(/[,\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((name) => ({
      name,
      slug: createSlug(name),
    }))
    .filter((tag) => {
      if (!tag.slug || seen.has(tag.slug)) return false;
      seen.add(tag.slug);
      return true;
    });
}

export async function replaceVideoTags(videoId: string, input: string) {
  const tags = parseTagsInput(input);

  await prisma.$transaction(async (tx) => {
    await tx.videoTag.deleteMany({
      where: { videoId },
    });

    for (const tag of tags) {
      const savedTag = await tx.tag.upsert({
        where: { slug: tag.slug },
        update: { name: tag.name },
        create: tag,
      });

      await tx.videoTag.create({
        data: {
          videoId,
          tagId: savedTag.id,
        },
      });
    }
  });

  return tags;
}

export function parseStoredAiTags(value: string | null | undefined) {
  try {
    const parsed = JSON.parse(value ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((tag): tag is string => typeof tag === "string")
      : [];
  } catch {
    return [];
  }
}
