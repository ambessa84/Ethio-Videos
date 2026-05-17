import { env } from "$env/dynamic/private";

type YoutubeVideoItem = {
  id: string;
  snippet: {
    title: string;
    description?: string;
    publishedAt?: string;
    channelId: string;
    channelTitle: string;
    thumbnails?: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
      standard?: { url: string };
      maxres?: { url: string };
    };
  };
  contentDetails?: {
    duration?: string;
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
};

type YoutubeChannelItem = {
  id: string;
  snippet: {
    title: string;
    description?: string;
    thumbnails?: YoutubeThumbnails;
  };
  contentDetails?: {
    relatedPlaylists?: {
      uploads?: string;
    };
  };
  statistics?: {
    subscriberCount?: string;
    videoCount?: string;
  };
};

type YoutubePlaylistItem = {
  snippet: {
    title: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: YoutubeThumbnails;
    resourceId?: {
      videoId?: string;
    };
  };
  contentDetails?: {
    videoId?: string;
    videoPublishedAt?: string;
  };
};

type YoutubeThumbnails = {
  default?: { url: string };
  medium?: { url: string };
  high?: { url: string };
  standard?: { url: string };
  maxres?: { url: string };
};

function getThumbnailUrl(thumbnails?: YoutubeThumbnails) {
  return (
    thumbnails?.maxres?.url ??
    thumbnails?.standard?.url ??
    thumbnails?.high?.url ??
    thumbnails?.medium?.url ??
    thumbnails?.default?.url ??
    null
  );
}

function parseCount(value?: string) {
  return value ? Number(value) : null;
}

export function extractYoutubeVideoId(input: string): string | null {
  const value = input.trim();

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?&]+)/,
    /(?:youtube\.com\/embed\/)([^?&]+)/,
    /(?:youtube\.com\/shorts\/)([^?&]+)/,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) return match[1];
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return value;
  }

  return null;
}

export function formatYoutubeDuration(duration?: string | null) {
  if (!duration) return null;

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return duration;

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);

  const parts = hours > 0 ? [hours, minutes, seconds] : [minutes, seconds];

  return parts
    .map((part) => String(part).padStart(2, "0"))
    .join(":")
    .replace(/^0/, "");
}

export async function fetchYoutubeVideo(videoId: string) {
  const apiKey = env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing YOUTUBE_API_KEY");
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet,contentDetails,statistics");
  url.searchParams.set("id", videoId);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();

    console.error("YouTube API error:", {
      status: response.status,
      body: errorText,
    });

    throw new Error(
      `Failed to fetch YouTube video: ${response.status} - ${errorText}`,
    );
  }

  const data = await response.json();
  const item = data.items?.[0] as YoutubeVideoItem | undefined;

  if (!item) {
    throw new Error("YouTube video not found");
  }

  const thumbnailUrl = getThumbnailUrl(item.snippet.thumbnails);

  return {
    youtubeVideoId: item.id,
    title: item.snippet.title,
    description: item.snippet.description ?? null,
    thumbnailUrl,
    publishedAt: item.snippet.publishedAt
      ? new Date(item.snippet.publishedAt)
      : null,
    channelTitle: item.snippet.channelTitle,
    youtubeChannelId: item.snippet.channelId,
    duration: item.contentDetails?.duration ?? null,
    viewCount: parseCount(item.statistics?.viewCount),
    likeCount: parseCount(item.statistics?.likeCount),
    commentCount: parseCount(item.statistics?.commentCount),
  };
}

export async function fetchYoutubeChannel(channelId: string) {
  const apiKey = env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing YOUTUBE_API_KEY");
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "snippet,contentDetails,statistics");
  url.searchParams.set("id", channelId);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch YouTube channel: ${response.status} - ${errorText}`,
    );
  }

  const data = await response.json();
  const item = data.items?.[0] as YoutubeChannelItem | undefined;

  if (!item) {
    throw new Error("YouTube channel not found");
  }

  return {
    youtubeChannelId: item.id,
    title: item.snippet.title,
    description: item.snippet.description ?? null,
    thumbnailUrl: getThumbnailUrl(item.snippet.thumbnails),
    uploadsPlaylistId: item.contentDetails?.relatedPlaylists?.uploads ?? null,
    subscriberCount: parseCount(item.statistics?.subscriberCount),
    videoCount: parseCount(item.statistics?.videoCount),
  };
}

export async function fetchYoutubePlaylistVideos(
  playlistId: string,
  maxResults = 15,
) {
  const apiKey = env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing YOUTUBE_API_KEY");
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.set("part", "snippet,contentDetails");
  url.searchParams.set("playlistId", playlistId);
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch YouTube playlist videos: ${response.status} - ${errorText}`,
    );
  }

  const data = await response.json();
  const items = (data.items ?? []) as YoutubePlaylistItem[];

  return items
    .map((item) => {
      const youtubeVideoId =
        item.contentDetails?.videoId ?? item.snippet.resourceId?.videoId ?? null;

      if (!youtubeVideoId) return null;

      return {
        youtubeVideoId,
        title: item.snippet.title,
        description: item.snippet.description ?? null,
        thumbnailUrl: getThumbnailUrl(item.snippet.thumbnails),
        publishedAt: item.contentDetails?.videoPublishedAt
          ? new Date(item.contentDetails.videoPublishedAt)
          : item.snippet.publishedAt
            ? new Date(item.snippet.publishedAt)
            : null,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

export async function fetchYoutubeVideosByIds(videoIds: string[]) {
  if (videoIds.length === 0) return [];

  const apiKey = env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing YOUTUBE_API_KEY");
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet,contentDetails,statistics");
  url.searchParams.set("id", videoIds.join(","));
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch YouTube videos: ${response.status} - ${errorText}`,
    );
  }

  const data = await response.json();
  const items = (data.items ?? []) as YoutubeVideoItem[];

  return items.map((item) => ({
    youtubeVideoId: item.id,
    title: item.snippet.title,
    description: item.snippet.description ?? null,
    thumbnailUrl: getThumbnailUrl(item.snippet.thumbnails),
    publishedAt: item.snippet.publishedAt
      ? new Date(item.snippet.publishedAt)
      : null,
    channelTitle: item.snippet.channelTitle,
    youtubeChannelId: item.snippet.channelId,
    duration: item.contentDetails?.duration ?? null,
    viewCount: parseCount(item.statistics?.viewCount),
    likeCount: parseCount(item.statistics?.likeCount),
    commentCount: parseCount(item.statistics?.commentCount),
  }));
}
