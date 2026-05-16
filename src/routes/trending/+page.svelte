<script lang="ts">
  import VideoCard from '$lib/components/VideoCard.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Trending Ethiopian Videos | EthioVideos</title>
</svelte:head>

<h1>Trending videos</h1>
<p class="muted">Videos ranked by public YouTube view count.</p>

<div class="grid video-grid section">
  {#each data.videos as video}
    <VideoCard {video} />
  {/each}
</div>
