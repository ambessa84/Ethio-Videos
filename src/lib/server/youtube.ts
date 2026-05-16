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

  const thumbnailUrl =
    item.snippet.thumbnails?.maxres?.url ??
    item.snippet.thumbnails?.standard?.url ??
    item.snippet.thumbnails?.high?.url ??
    item.snippet.thumbnails?.medium?.url ??
    item.snippet.thumbnails?.default?.url ??
    null;

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
    viewCount: item.statistics?.viewCount
      ? Number(item.statistics.viewCount)
      : null,
    likeCount: item.statistics?.likeCount
      ? Number(item.statistics.likeCount)
      : null,
    commentCount: item.statistics?.commentCount
      ? Number(item.statistics.commentCount)
      : null,
  };
}
