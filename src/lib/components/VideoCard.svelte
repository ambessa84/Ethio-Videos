<script lang="ts">
  import HomeIcon from "$lib/components/home/HomeIcon.svelte";
  import {
    defaultLanguage,
    getLocalizedVideoPath,
    localizedLabels,
    type SiteLanguage,
  } from "$lib/i18n";
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
  let currentLanguage = $derived((lang ?? defaultLanguage) as SiteLanguage);
  let labels = $derived(localizedLabels[currentLanguage]);
  let title = $derived(video.localizedTitle || video.title);
  let slug = $derived(video.localizedSlug || video.slug);
  let href = $derived(
    lang ? getLocalizedVideoPath(lang, slug) : `/video/${slug}`,
  );
</script>

<a {href} class="card">
  <span class="media">
    <img
      class="video-thumb"
      src={video.thumbnailUrl || "/placeholder-video.svg"}
      alt={title}
      loading="lazy"
    />
    <span class="play-overlay">
      <HomeIcon name="play" size={30} />
    </span>
  </span>

  <h3 class="video-title line-clamp-2">{title}</h3>

  <p class="video-meta">
    {#if video.channel}
      {video.channel.title}
    {/if}

    {#if video.viewCount}
      · {formatNumber(video.viewCount)} {labels.views}
    {/if}
  </p>
</a>

<style>
  .media {
    aspect-ratio: 16 / 9;
    border-radius: 1rem;
    display: block;
    overflow: hidden;
    position: relative;
  }

  .media .video-thumb {
    border-radius: 0;
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .play-overlay {
    align-items: center;
    aspect-ratio: 1;
    background: var(--ev-mint);
    border: 1px solid rgba(3, 104, 84, 0.28);
    border-radius: 999px;
    box-shadow: 0 8px 22px rgba(3, 104, 84, 0.18);
    color: var(--ev-green);
    display: inline-flex;
    justify-content: center;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 3rem;
  }
</style>
