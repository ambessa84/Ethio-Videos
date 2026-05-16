<script lang="ts">
  import VideoCard from '$lib/components/VideoCard.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Latest Ethiopian Videos | EthioVideos</title>
</svelte:head>

<h1>Latest videos</h1>

<div class="grid video-grid section">
  {#each data.videos as video}
    <VideoCard {video} />
  {/each}
</div>
