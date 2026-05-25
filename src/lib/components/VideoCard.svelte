<script lang="ts">
  import { getLocalizedVideoPath, type SiteLanguage } from "$lib/i18n";
  import { formatNumber } from "$lib/utils";

  type Video = {
    slug: string;
    localizedSlug?: string | null;
    title: string;
    localizedTitle?: string | null;
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

  let { video, lang } = $props<{ video: Video; lang?: SiteLanguage }>();
  let title = $derived(video.localizedTitle || video.title);
  let slug = $derived(video.localizedSlug || video.slug);
  let href = $derived(lang ? getLocalizedVideoPath(lang, slug) : `/video/${slug}`);
</script>

<a href={href} class="card">
  <img
    class="video-thumb"
    src={video.thumbnailUrl || "/placeholder-video.svg"}
    alt={title}
    loading="lazy"
  />

  <h3 class="video-title line-clamp-2">{title}</h3>

  <p class="video-meta">
    {#if video.channel}
      {video.channel.title}
    {/if}

    {#if video.viewCount}
      · {formatNumber(video.viewCount)} views
    {/if}
  </p>
</a>
