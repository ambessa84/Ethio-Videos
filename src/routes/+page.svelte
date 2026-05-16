<script lang="ts">
  import VideoCard from '$lib/components/VideoCard.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>EthioVideos - Best Ethiopian Videos</title>
  <meta
    name="description"
    content="Discover Ethiopian videos from YouTube: news, music, drama, comedy, religion, diaspora and business."
  />
</svelte:head>

<section class="hero">
  <h1>Best Ethiopian videos, curated.</h1>
  <p>
    Discover Ethiopian news, music, drama, comedy, culture and diaspora videos
    from YouTube, organized in one simple place.
  </p>

  <div class="pills">
    {#each data.categories as category}
      <a class="pill" href={`/category/${category.slug}`}>{category.name}</a>
    {/each}
  </div>
</section>

{#if data.featuredVideos.length}
  <section class="section">
    <h2 class="section-title">Featured</h2>
    <div class="grid video-grid">
      {#each data.featuredVideos as video}
        <VideoCard {video} />
      {/each}
    </div>
  </section>
{/if}

<section class="section">
  <h2 class="section-title">Latest videos</h2>

  {#if data.latestVideos.length}
    <div class="grid video-grid">
      {#each data.latestVideos as video}
        <VideoCard {video} />
      {/each}
    </div>
  {:else}
    <div class="panel">
      <p>No videos yet. Add your first video from the admin.</p>
      <p><a href="/admin/videos/new">Add a video</a></p>
    </div>
  {/if}
</section>
