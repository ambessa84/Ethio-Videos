type VideoStructuredDataInput = {
  title: string;
  description: string;
  thumbnailUrl?: string | null;
  publishedAt?: Date | string | null;
  youtubeVideoId: string;
};

export function buildVideoStructuredDataJson(video: VideoStructuredDataInput) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl ? [video.thumbnailUrl] : undefined,
    uploadDate: video.publishedAt,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeVideoId}`,
  });
}

export function buildJsonLdScriptTag(json: string) {
  return `<script type="application/ld+json">${escapeScriptJson(json)}</script>`;
}

function escapeScriptJson(json: string) {
  return json.replace(/</g, "\\u003c");
}
