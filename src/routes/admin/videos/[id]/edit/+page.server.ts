import { error, fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { createSlug } from "$lib/server/slug";
import { generateVideoAiSummary } from "$lib/server/ai-summary";
import { normalizeAiSummaryLanguage } from "$lib/server/ai-summary-core";
import { parseStoredAiTags, replaceVideoTags } from "$lib/server/tags";

export const load = async ({ params, url }) => {
  const aiMetadataLanguage = normalizeAiSummaryLanguage(
    url.searchParams.get("aiLanguage") ?? undefined,
  );
  const [video, categories] = await Promise.all([
    prisma.video.findUnique({
      where: { id: params.id },
      include: {
        channel: true,
        category: true,
        tags: {
          include: { tag: true },
          orderBy: { tag: { name: "asc" } },
        },
        aiMetadata: {
          orderBy: { language: "asc" },
        },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!video) {
    throw error(404, "Video not found");
  }

  return {
    video,
    categories,
    aiMetadataLanguage,
    aiMetadata:
      video.aiMetadata.find(
        (metadata) => metadata.language === aiMetadataLanguage,
      ) ?? null,
  };
};

export const actions = {
  save: async ({ request, params }) => {
    const formData = await request.formData();

    const title = String(formData.get("title") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const summary = String(formData.get("summary") ?? "");
    const categoryId = String(formData.get("categoryId") ?? "");
    const language = String(formData.get("language") ?? "");
    const status = String(formData.get("status") ?? "DRAFT");
    const isFeatured = formData.get("isFeatured") === "on";
    const tags = String(formData.get("tags") ?? "");

    if (!title) {
      return fail(400, { message: "Title is required." });
    }

    await prisma.video.update({
      where: { id: params.id },
      data: {
        title,
        slug: slug || createSlug(title),
        summary: summary || null,
        categoryId: categoryId || null,
        language: language || null,
        status:
          status === "PUBLISHED"
            ? "PUBLISHED"
            : status === "ARCHIVED"
              ? "ARCHIVED"
              : "DRAFT",
        isFeatured,
      },
    });

    await replaceVideoTags(params.id, tags);

    return { success: true };
  },

  generateAiSummary: async ({ request, params }) => {
    const formData = await request.formData();
    const outputLanguage = normalizeAiSummaryLanguage(
      String(formData.get("outputLanguage") ?? ""),
    );

    try {
      await generateVideoAiSummary(params.id, {
        outputLanguage,
      });
    } catch (error) {
      return fail(400, {
        message:
          error instanceof Error
            ? error.message
            : "Unable to generate AI summary.",
      });
    }

    throw redirect(303, `?aiLanguage=${outputLanguage}`);
  },

  saveAiSummary: async ({ request, params }) => {
    const formData = await request.formData();
    const language = normalizeAiSummaryLanguage(
      String(formData.get("aiMetadataLanguage") ?? ""),
    );
    const aiShortSummary = String(formData.get("aiShortSummary") ?? "").trim();
    const aiLongSummary = String(formData.get("aiLongSummary") ?? "").trim();
    const aiKeyPoints = String(formData.get("aiKeyPoints") ?? "")
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean);
    const aiTags = String(formData.get("aiTags") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const aiSeoTitle = String(formData.get("aiSeoTitle") ?? "").trim();
    const aiSeoDescription = String(
      formData.get("aiSeoDescription") ?? "",
    ).trim();
    const aiLanguage = String(formData.get("aiLanguage") ?? "").trim();
    const aiCategorySuggestion = String(
      formData.get("aiCategorySuggestion") ?? "",
    ).trim();
    const aiConfidenceRaw = String(formData.get("aiConfidence") ?? "").trim();
    const aiConfidence = aiConfidenceRaw ? Number(aiConfidenceRaw) : null;
    const aiNeedsHumanReview = formData.get("aiNeedsHumanReview") === "on";

    if (
      aiConfidence !== null &&
      (!Number.isFinite(aiConfidence) || aiConfidence < 0 || aiConfidence > 1)
    ) {
      return fail(400, {
        message: "AI confidence must be a number between 0 and 1.",
      });
    }

    const status =
      aiShortSummary || aiLongSummary
        ? ("GENERATED" as const)
        : ("NOT_GENERATED" as const);
    const savedMetadata = {
      shortSummary: aiShortSummary || null,
      longSummary: aiLongSummary || null,
      keyPoints: JSON.stringify(aiKeyPoints),
      tags: JSON.stringify(aiTags),
      seoTitle: aiSeoTitle || null,
      seoDescription: aiSeoDescription || null,
      detectedLanguage: aiLanguage || null,
      categorySuggestion: aiCategorySuggestion || null,
      confidence: aiConfidence,
      needsHumanReview: aiNeedsHumanReview,
      status,
      error: null,
    };

    await prisma.videoAiMetadata.upsert({
      where: {
        videoId_language: {
          videoId: params.id,
          language,
        },
      },
      update: savedMetadata,
      create: {
        videoId: params.id,
        language,
        ...savedMetadata,
      },
    });

    await prisma.video.update({
      where: { id: params.id },
      data: {
        aiShortSummary: savedMetadata.shortSummary,
        aiLongSummary: savedMetadata.longSummary,
        aiKeyPoints: savedMetadata.keyPoints,
        aiTags: savedMetadata.tags,
        aiSeoTitle: savedMetadata.seoTitle,
        aiSeoDescription: savedMetadata.seoDescription,
        aiLanguage: savedMetadata.detectedLanguage,
        aiCategorySuggestion: savedMetadata.categorySuggestion,
        aiConfidence: savedMetadata.confidence,
        aiNeedsHumanReview: savedMetadata.needsHumanReview,
        aiStatus: savedMetadata.status,
        aiError: savedMetadata.error,
      },
    });

    return {
      success: true,
      message: "AI metadata saved.",
    };
  },

  applyAiSummary: async ({ request, params }) => {
    const formData = await request.formData();
    const language = normalizeAiSummaryLanguage(
      String(formData.get("aiMetadataLanguage") ?? ""),
    );
    const metadata = await prisma.videoAiMetadata.findUnique({
      where: {
        videoId_language: {
          videoId: params.id,
          language,
        },
      },
    });

    if (!metadata) {
      return fail(404, { message: "AI metadata not found." });
    }

    if (!metadata.shortSummary) {
      return fail(400, {
        message: "No AI short summary available.",
      });
    }

    await prisma.video.update({
      where: { id: params.id },
      data: {
        summary: metadata.shortSummary,
      },
    });

    return {
      success: true,
      message: "AI short summary copied to public summary.",
    };
  },

  applyAiTags: async ({ request, params }) => {
    const formData = await request.formData();
    const language = normalizeAiSummaryLanguage(
      String(formData.get("aiMetadataLanguage") ?? ""),
    );
    const metadata = await prisma.videoAiMetadata.findUnique({
      where: {
        videoId_language: {
          videoId: params.id,
          language,
        },
      },
    });

    if (!metadata) {
      return fail(404, { message: "AI metadata not found." });
    }

    const aiTags = parseStoredAiTags(metadata.tags);

    if (!aiTags.length) {
      return fail(400, {
        message: "No AI tags available.",
      });
    }

    await replaceVideoTags(params.id, aiTags.join(", "));

    return {
      success: true,
      message: "AI tags copied to public tags.",
    };
  },

  delete: async ({ params }) => {
    await prisma.video.delete({
      where: { id: params.id },
    });

    throw redirect(303, "/admin/videos");
  },
};
