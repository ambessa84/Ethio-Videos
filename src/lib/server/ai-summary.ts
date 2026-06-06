import { prisma } from "$lib/server/prisma";
import { createUniqueAiMetadataSlug } from "$lib/server/ai-metadata-slugs";
import {
  buildAiSummaryMessages,
  normalizeAiSummaryLanguage,
  normalizeAiSummary,
  parseJsonObject,
  type GenerateVideoAiSummaryOptions,
} from "$lib/server/ai-summary-core";
import { generateAiSummaryText } from "$lib/server/ai-summary-providers";

export async function generateVideoAiSummary(
  videoId: string,
  options: GenerateVideoAiSummaryOptions = {},
) {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: {
      channel: true,
      category: true,
    },
  });

  if (!video) {
    throw new Error("Video not found");
  }

  const outputLanguage = normalizeAiSummaryLanguage(options.outputLanguage);

  await prisma.videoAiMetadata.upsert({
    where: {
      videoId_language: {
        videoId: video.id,
        language: outputLanguage,
      },
    },
    update: {
      status: "GENERATING",
      error: null,
    },
    create: {
      videoId: video.id,
      language: outputLanguage,
      status: "GENERATING",
      error: null,
    },
  });

  await prisma.video.update({
    where: { id: video.id },
    data: {
      aiStatus: "GENERATING",
      aiError: null,
    },
  });

  try {
    const responseText = await generateAiSummaryText(
      buildAiSummaryMessages(video, outputLanguage),
    );
    const parsed = normalizeAiSummary(parseJsonObject(responseText));

    const generatedAt = new Date();
    const slug = await createUniqueAiMetadataSlug(
      parsed.slug || parsed.seoTitle || parsed.shortSummary || video.title,
      outputLanguage,
      video.id,
    );
    const data = {
      slug,
      shortSummary: parsed.shortSummary || null,
      longSummary: parsed.longSummary || null,
      keyPoints: JSON.stringify(parsed.keyPoints),
      tags: JSON.stringify(parsed.tags),
      seoTitle: parsed.seoTitle || null,
      seoDescription: parsed.seoDescription || null,
      detectedLanguage: parsed.detectedLanguage,
      categorySuggestion: parsed.suggestedCategory,
      confidence: parsed.confidence,
      needsHumanReview: parsed.needsHumanReview,
      generatedAt,
      status: "GENERATED" as const,
      localizedStatus: "DRAFT" as const,
      publishedAt: null,
      error: null,
    };

    const metadata = await prisma.videoAiMetadata.update({
      where: {
        videoId_language: {
          videoId: video.id,
          language: outputLanguage,
        },
      },
      data,
    });

    await prisma.video.update({
      where: { id: video.id },
      data: {
        aiShortSummary: data.shortSummary,
        aiLongSummary: data.longSummary,
        aiKeyPoints: data.keyPoints,
        aiTags: data.tags,
        aiSeoTitle: data.seoTitle,
        aiSeoDescription: data.seoDescription,
        aiLanguage: data.detectedLanguage,
        aiCategorySuggestion: data.categorySuggestion,
        aiConfidence: data.confidence,
        aiNeedsHumanReview: data.needsHumanReview,
        aiGeneratedAt: data.generatedAt,
        aiStatus: data.status,
        aiError: data.error,
      },
    });

    return metadata;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to generate AI summary.";

    await prisma.videoAiMetadata.update({
      where: {
        videoId_language: {
          videoId: video.id,
          language: outputLanguage,
        },
      },
      data: {
        status: "FAILED",
        error: message,
      },
    });

    await prisma.video.update({
      where: { id: video.id },
      data: {
        aiStatus: "FAILED",
        aiError: message,
      },
    });

    throw new Error(message);
  }
}
