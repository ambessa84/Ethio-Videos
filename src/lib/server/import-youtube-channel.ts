import { Prisma } from '@prisma/client';
import { prisma } from '$lib/server/prisma';
import { createSlug } from '$lib/server/slug';
import {
  fetchYoutubePlaylistVideos,
  fetchYoutubeVideosByIds
} from '$lib/server/youtube';

export async function importLatestVideosForChannel(channelId: string) {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId }
  });

  if (!channel) {
    throw new Error('Channel not found.');
  }

  if (!channel.uploadsPlaylistId) {
    throw new Error('This channel has no uploads playlist ID.');
  }

  if (!channel.autoImportEnabled) {
    throw new Error('Automatic import is disabled for this channel.');
  }

  const playlistVideos = await fetchYoutubePlaylistVideos(channel.uploadsPlaylistId, 15);
  const playlistVideoIds = playlistVideos.map((video) => video.youtubeVideoId);

  const existingVideos = await prisma.video.findMany({
    where: {
      youtubeVideoId: {
        in: playlistVideoIds
      }
    },
    select: {
      youtubeVideoId: true
    }
  });

  const existingVideoIds = new Set(
    existingVideos.map((video) => video.youtubeVideoId)
  );
  const newVideoIds = playlistVideoIds.filter(
    (youtubeVideoId) => !existingVideoIds.has(youtubeVideoId)
  );

  const videos = await fetchYoutubeVideosByIds(newVideoIds);
  let imported = 0;
  let skipped = playlistVideoIds.length - newVideoIds.length;

  for (const video of videos) {
    try {
      await prisma.video.create({
        data: {
          youtubeVideoId: video.youtubeVideoId,
          slug: `${createSlug(video.title)}-${video.youtubeVideoId}`,
          title: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnailUrl,
          publishedAt: video.publishedAt,
          duration: video.duration,
          viewCount: video.viewCount,
          likeCount: video.likeCount,
          commentCount: video.commentCount,
          language: channel.defaultLanguage,
          status: channel.defaultStatus,
          channelId: channel.id,
          categoryId: channel.defaultCategoryId
        }
      });

      imported += 1;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        skipped += 1;
        continue;
      }

      throw error;
    }
  }

  await prisma.channel.update({
    where: { id: channel.id },
    data: {
      lastImportedAt: new Date()
    }
  });

  return {
    imported,
    skipped,
    message: `Imported ${imported} video${imported === 1 ? '' : 's'}, skipped ${skipped}.`
  };
}

export async function importLatestVideosForAllChannels() {
  const channels = await prisma.channel.findMany({
    where: {
      status: 'ACTIVE',
      autoImportEnabled: true,
      uploadsPlaylistId: {
        not: null
      }
    },
    select: {
      id: true,
      title: true
    },
    orderBy: {
      title: 'asc'
    }
  });

  const results = [];

  for (const channel of channels) {
    try {
      const result = await importLatestVideosForChannel(channel.id);

      results.push({
        channelId: channel.id,
        title: channel.title,
        ok: true,
        ...result
      });
    } catch (error) {
      results.push({
        channelId: channel.id,
        title: channel.title,
        ok: false,
        imported: 0,
        skipped: 0,
        message: error instanceof Error ? error.message : 'Unable to import channel.'
      });
    }
  }

  return results;
}
