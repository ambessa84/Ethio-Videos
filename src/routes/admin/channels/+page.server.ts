import { prisma } from "$lib/server/prisma";
import { importLatestVideosForChannel } from "$lib/server/import-youtube-channel";
import { fail } from "@sveltejs/kit";

export const load = async () => {
  const channels = await prisma.channel.findMany({
    orderBy: { title: "asc" },
    include: {
      defaultCategory: true,
      _count: {
        select: { videos: true },
      },
    },
  });

  return { channels };
};

export const actions = {
  import: async ({ request }) => {
    const formData = await request.formData();
    const channelId = String(formData.get("channelId") ?? "");

    if (!channelId) {
      return fail(400, {
        message: "Channel ID is required.",
      });
    }

    try {
      return await importLatestVideosForChannel(channelId);
    } catch (error) {
      return fail(400, {
        message:
          error instanceof Error
            ? error.message
            : "Unable to import latest videos.",
      });
    }
  },
};
