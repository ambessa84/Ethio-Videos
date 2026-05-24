import { error, fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { createSlug } from "$lib/server/slug";
import { generateVideoAiSummary } from "$lib/server/ai-summary";

export const load = async ({ params }) => {
  const [video, categories] = await Promise.all([
    prisma.video.findUnique({
      where: { id: params.id },
      include: { channel: true, category: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!video) {
    throw error(404, "Video not found");
  }

  return { video, categories };
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

    return { success: true };
  },

  generateAiSummary: async ({ request, params }) => {
    const formData = await request.formData();
    const outputLanguage = String(formData.get("outputLanguage") ?? "").trim();

    try {
      await generateVideoAiSummary(params.id, {
        outputLanguage: outputLanguage || undefined,
      });

      return {
        success: true,
        message: "AI summary generated.",
      };
    } catch (error) {
      return fail(400, {
        message:
          error instanceof Error
            ? error.message
            : "Unable to generate AI summary.",
      });
    }
  },

  saveAiSummary: async ({ request, params }) => {
    const formData = await request.formData();
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

    await prisma.video.update({
      where: { id: params.id },
      data: {
        aiShortSummary: aiShortSummary || null,
        aiLongSummary: aiLongSummary || null,
        aiKeyPoints: JSON.stringify(aiKeyPoints),
        aiTags: JSON.stringify(aiTags),
        aiSeoTitle: aiSeoTitle || null,
        aiSeoDescription: aiSeoDescription || null,
        aiLanguage: aiLanguage || null,
        aiCategorySuggestion: aiCategorySuggestion || null,
        aiConfidence,
        aiNeedsHumanReview,
        aiStatus:
          aiShortSummary || aiLongSummary ? "GENERATED" : "NOT_GENERATED",
        aiError: null,
      },
    });

    return {
      success: true,
      message: "AI metadata saved.",
    };
  },

  applyAiSummary: async ({ params }) => {
    const video = await prisma.video.findUnique({
      where: { id: params.id },
    });

    if (!video) {
      return fail(404, { message: "Video not found." });
    }

    if (!video.aiShortSummary) {
      return fail(400, {
        message: "No AI short summary available.",
      });
    }

    await prisma.video.update({
      where: { id: params.id },
      data: {
        summary: video.aiShortSummary,
      },
    });

    return {
      success: true,
      message: "AI short summary copied to public summary.",
    };
  },

  delete: async ({ params }) => {
    await prisma.video.delete({
      where: { id: params.id },
    });

    throw redirect(303, "/admin/videos");
  },
};
