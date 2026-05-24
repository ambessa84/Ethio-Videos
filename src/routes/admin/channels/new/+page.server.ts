import { fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { createSlug } from "$lib/server/slug";
import { fetchYoutubeChannel } from "$lib/server/youtube";

export const load = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return { categories };
};

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();

    const youtubeChannelId = String(
      formData.get("youtubeChannelId") ?? "",
    ).trim();
    const defaultCategoryId = String(formData.get("defaultCategoryId") ?? "");
    const defaultLanguage = String(formData.get("defaultLanguage") ?? "");
    const defaultStatus = String(formData.get("defaultStatus") ?? "DRAFT");
    const autoImportEnabled = formData.get("autoImportEnabled") === "on";

    if (!youtubeChannelId) {
      return fail(400, {
        message: "YouTube channel ID is required.",
      });
    }

    let youtubeChannel;

    try {
      youtubeChannel = await fetchYoutubeChannel(youtubeChannelId);
    } catch (error) {
      return fail(400, {
        message:
          error instanceof Error
            ? error.message
            : "Unable to fetch YouTube channel.",
      });
    }

    const channelSlug = `${createSlug(youtubeChannel.title)}-${youtubeChannel.youtubeChannelId}`;

    await prisma.channel.upsert({
      where: {
        youtubeChannelId: youtubeChannel.youtubeChannelId,
      },
      update: {
        slug: channelSlug,
        title: youtubeChannel.title,
        description: youtubeChannel.description,
        thumbnailUrl: youtubeChannel.thumbnailUrl,
        subscriberCount: youtubeChannel.subscriberCount,
        videoCount: youtubeChannel.videoCount,
        uploadsPlaylistId: youtubeChannel.uploadsPlaylistId,
        defaultCategoryId: defaultCategoryId || null,
        defaultLanguage: defaultLanguage || null,
        defaultStatus: defaultStatus === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        autoImportEnabled,
      },
      create: {
        youtubeChannelId: youtubeChannel.youtubeChannelId,
        slug: channelSlug,
        title: youtubeChannel.title,
        description: youtubeChannel.description,
        thumbnailUrl: youtubeChannel.thumbnailUrl,
        subscriberCount: youtubeChannel.subscriberCount,
        videoCount: youtubeChannel.videoCount,
        uploadsPlaylistId: youtubeChannel.uploadsPlaylistId,
        defaultCategoryId: defaultCategoryId || null,
        defaultLanguage: defaultLanguage || null,
        defaultStatus: defaultStatus === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        autoImportEnabled,
      },
    });

    throw redirect(303, "/admin/channels");
  },
};
