<script lang="ts">
  import VideoCard from '$lib/components/VideoCard.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Search | EthioVideos</title>
</svelte:head>

<h1>Search</h1>

<form action="/search" method="GET" class="form">
  <input class="input" name="q" value={data.q} placeholder="Search videos..." />
  <button class="button" type="submit">Search</button>
</form>

{#if data.q}
  <section class="section">
    <h2>Results for “{data.q}”</h2>

    {#if data.videos.length}
      <div class="grid video-grid">
        {#each data.videos as video}
          <VideoCard {video} />
        {/each}
      </div>
    {:else}
      <p class="muted">No result found.</p>
    {/if}
  </section>
{/if}
