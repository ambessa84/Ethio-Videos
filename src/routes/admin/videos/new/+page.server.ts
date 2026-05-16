import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { createSlug } from '$lib/server/slug';
import { extractYoutubeVideoId, fetchYoutubeVideo } from '$lib/server/youtube';

export const load = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return { categories };
};

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();

    const youtubeUrl = String(formData.get('youtubeUrl') ?? '').trim();
    const categoryId = String(formData.get('categoryId') ?? '');
    const language = String(formData.get('language') ?? '');
    const summary = String(formData.get('summary') ?? '');
    const status = String(formData.get('status') ?? 'DRAFT');
    const isFeatured = formData.get('isFeatured') === 'on';

    const youtubeVideoId = extractYoutubeVideoId(youtubeUrl);

    if (!youtubeVideoId) {
      return fail(400, {
        message: 'Invalid YouTube URL.'
      });
    }

    const existing = await prisma.video.findUnique({
      where: { youtubeVideoId }
    });

    if (existing) {
      return fail(400, {
        message: 'This video already exists.'
      });
    }

    let youtubeVideo;

    try {
      youtubeVideo = await fetchYoutubeVideo(youtubeVideoId);
    } catch (error) {
      return fail(400, {
        message: error instanceof Error ? error.message : 'Unable to fetch YouTube video.'
      });
    }

    const channelBaseSlug = createSlug(youtubeVideo.channelTitle);
    const channelSlug = `${channelBaseSlug}-${youtubeVideo.youtubeChannelId}`;

    const channel = await prisma.channel.upsert({
      where: {
        youtubeChannelId: youtubeVideo.youtubeChannelId
      },
      update: {
        title: youtubeVideo.channelTitle,
        slug: channelSlug
      },
      create: {
        youtubeChannelId: youtubeVideo.youtubeChannelId,
        title: youtubeVideo.channelTitle,
        slug: channelSlug
      }
    });

    const baseSlug = createSlug(youtubeVideo.title);

    const video = await prisma.video.create({
      data: {
        youtubeVideoId: youtubeVideo.youtubeVideoId,
        slug: `${baseSlug}-${youtubeVideo.youtubeVideoId}`,
        title: youtubeVideo.title,
        description: youtubeVideo.description,
        thumbnailUrl: youtubeVideo.thumbnailUrl,
        publishedAt: youtubeVideo.publishedAt,
        duration: youtubeVideo.duration,
        viewCount: youtubeVideo.viewCount,
        likeCount: youtubeVideo.likeCount,
        commentCount: youtubeVideo.commentCount,
        summary: summary || null,
        language: language || null,
        status: status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
        isFeatured,
        channelId: channel.id,
        categoryId: categoryId || null
      }
    });

    throw redirect(303, `/admin/videos/${video.id}/edit`);
  }
};
