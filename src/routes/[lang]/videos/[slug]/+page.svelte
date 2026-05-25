<script lang="ts">
  import { page } from "$app/stores";
  import VideoCard from "$lib/components/VideoCard.svelte";
  import {
    getLocalizedCategoryPath,
    getLocalizedChannelPath,
    getLocalizedTagPath,
    localizedLabels,
  } from "$lib/i18n";
  import { formatNumber, formatDate } from "$lib/utils";

  let { data } = $props();

  let video = $derived(data.video);
  let labels = $derived(localizedLabels[data.lang]);
  let shareUrl = $derived($page.url.href);
</script>

<svelte:head>
  <title>{video.localizedTitle || video.title} | EthioVideos</title>
  <meta name="description" content={video.localizedDescription} />
  <meta property="og:title" content={video.localizedTitle || video.title} />
  <meta property="og:description" content={video.localizedDescription} />
  <meta property="og:image" content={video.thumbnailUrl || ""} />
  <link rel="canonical" href={shareUrl} />
  {#each Object.entries(data.languageAlternates) as [language, path]}
    <link rel="alternate" hreflang={language} href={`${$page.url.origin}${path}`} />
  {/each}

  <script type="application/ld+json">
    {JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: video.localizedTitle || video.title,
      description: video.localizedDescription,
      thumbnailUrl: video.thumbnailUrl ? [video.thumbnailUrl] : undefined,
      uploadDate: video.publishedAt,
      embedUrl: `https://www.youtube.com/embed/${video.youtubeVideoId}`
    })}
  </script>
</svelte:head>

<article class="two-col">
  <div>
    <div class="video-player">
      <iframe
        src={`https://www.youtube.com/embed/${video.youtubeVideoId}`}
        title={video.localizedTitle || video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>

    <h1>{video.localizedTitle || video.title}</h1>

    <p class="muted">
      {#if video.channel}
        <a href={getLocalizedChannelPath(data.lang, video.channel.slug)}>
          {video.channel.title}
        </a>
      {/if}

      {#if video.category}
        · <a href={getLocalizedCategoryPath(data.lang, video.category.slug)}>
          {video.category.name}
        </a>
      {/if}

      {#if video.viewCount}
        · {formatNumber(video.viewCount)} views
      {/if}

      {#if video.publishedAt}
        · {formatDate(video.publishedAt)}
      {/if}
    </p>

    {#if video.tags.length}
      <div class="pills section">
        {#each video.tags as videoTag}
          <a class="pill" href={getLocalizedTagPath(data.lang, videoTag.tag.slug)}>
            {videoTag.tag.name}
          </a>
        {/each}
      </div>
    {/if}

    {#if video.localizedSummary || video.localizedLongSummary}
      <section class="panel section">
        <h2>{labels.summary}</h2>
        <p style="white-space: pre-line">
          {video.localizedLongSummary || video.localizedSummary}
        </p>
      </section>
    {/if}

    <section class="section">
      <div class="pills">
        <a
          class="pill"
          href={`https://www.youtube.com/watch?v=${video.youtubeVideoId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {labels.viewOnYoutube}
        </a>

        <a
          class="pill"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>

        <a
          class="pill"
          href={`https://wa.me/?text=${encodeURIComponent(`${video.localizedTitle || video.title} ${shareUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </div>
    </section>
  </div>

  <aside>
    <h2>{labels.relatedVideos}</h2>

    <div class="grid">
      {#each data.relatedVideos as related}
        <VideoCard video={related} lang={data.lang} />
      {/each}
    </div>
  </aside>
</article>
