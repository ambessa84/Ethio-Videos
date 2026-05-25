<script lang="ts">
  import VideoCard from "$lib/components/VideoCard.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.tag.name} Videos | EthioVideos</title>
  <meta name="description" content={`${data.tag.name} videos`} />
</svelte:head>

<h1>{data.tag.name}</h1>

<div class="grid video-grid section">
  {#each data.videos as video}
    <VideoCard {video} />
  {/each}
</div>
