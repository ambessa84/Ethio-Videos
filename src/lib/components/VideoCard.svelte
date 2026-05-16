<script lang="ts">
  import { formatNumber } from '$lib/utils';

  type Video = {
    slug: string;
    title: string;
    thumbnailUrl?: string | null;
    viewCount?: number | null;
    channel?: {
      title: string;
      slug: string;
    } | null;
    category?: {
      name: string;
      slug: string;
    } | null;
  };

  let { video } = $props<{ video: Video }>();
</script>

<a href={`/video/${video.slug}`} class="card">
  <img
    class="video-thumb"
    src={video.thumbnailUrl || '/placeholder-video.svg'}
    alt={video.title}
    loading="lazy"
  />

  <h3 class="video-title line-clamp-2">{video.title}</h3>

  <p class="video-meta">
    {#if video.channel}
      {video.channel.title}
    {/if}

    {#if video.viewCount}
      · {formatNumber(video.viewCount)} views
    {/if}
  </p>
</a>
