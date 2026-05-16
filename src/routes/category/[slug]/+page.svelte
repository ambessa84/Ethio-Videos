<script lang="ts">
  import VideoCard from '$lib/components/VideoCard.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.category.name} Videos | EthioVideos</title>
  <meta name="description" content={data.category.description || `${data.category.name} videos`} />
</svelte:head>

<h1>{data.category.name}</h1>

{#if data.category.description}
  <p class="muted">{data.category.description}</p>
{/if}

<div class="grid video-grid section">
  {#each data.videos as video}
    <VideoCard {video} />
  {/each}
</div>
