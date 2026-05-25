<script lang="ts">
  import { page } from "$app/stores";
  import VideoCard from "$lib/components/VideoCard.svelte";
  import { formatNumber, formatDate } from "$lib/utils";

  let { data } = $props();

  let video = $derived(data.video);
  let shareUrl = $derived($page.url.href);
</script>

<svelte:head>
  <title>{video.title} | EthioVideos</title>
  <meta
    name="description"
    content={video.summary || video.description || video.title}
  />
  <meta property="og:title" content={video.title} />
  <meta property="og:description" content={video.summary || video.title} />
  <meta property="og:image" content={video.thumbnailUrl || ""} />

  <script type="application/ld+json">
    {JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: video.title,
      description: video.summary || video.description || video.title,
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
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>

    <h1>{video.title}</h1>

    <p class="muted">
      {#if video.channel}
        <a href={`/channel/${video.channel.slug}`}>{video.channel.title}</a>
      {/if}

      {#if video.category}
        · <a href={`/category/${video.category.slug}`}>{video.category.name}</a>
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
          <a class="pill" href={`/tag/${videoTag.tag.slug}`}>
            {videoTag.tag.name}
          </a>
        {/each}
      </div>
    {/if}

    {#if video.summary}
      <section class="panel section">
        <h2>Résumé</h2>
        <p style="white-space: pre-line">{video.summary}</p>
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
          Voir sur YouTube
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
          href={`https://wa.me/?text=${encodeURIComponent(`${video.title} ${shareUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </div>
    </section>
  </div>

  <aside>
    <h2>Related videos</h2>

    <div class="grid">
      {#each data.relatedVideos as related}
        <VideoCard video={related} />
      {/each}
    </div>
  </aside>
</article>
