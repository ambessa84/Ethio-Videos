import { prisma } from "$lib/server/prisma";
import {
  buildAiSummaryMessages,
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

  await prisma.video.update({
    where: { id: video.id },
    data: {
      aiStatus: "GENERATING",
      aiError: null,
    },
  });

  try {
    const outputLanguage = options.outputLanguage?.trim() || "fr";
    const responseText = await generateAiSummaryText(
      buildAiSummaryMessages(video, outputLanguage),
    );
    const parsed = normalizeAiSummary(parseJsonObject(responseText));

    return await prisma.video.update({
      where: { id: video.id },
      data: {
        aiShortSummary: parsed.shortSummary || null,
        aiLongSummary: parsed.longSummary || null,
        aiKeyPoints: JSON.stringify(parsed.keyPoints),
        aiTags: JSON.stringify(parsed.tags),
        aiSeoTitle: parsed.seoTitle || null,
        aiSeoDescription: parsed.seoDescription || null,
        aiLanguage: parsed.detectedLanguage,
        aiCategorySuggestion: parsed.suggestedCategory,
        aiConfidence: parsed.confidence,
        aiNeedsHumanReview: parsed.needsHumanReview,
        aiGeneratedAt: new Date(),
        aiStatus: "GENERATED",
        aiError: null,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to generate AI summary.";

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
