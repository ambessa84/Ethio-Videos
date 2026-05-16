<script lang="ts">
  import VideoCard from '$lib/components/VideoCard.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.channel.title} | EthioVideos</title>
</svelte:head>

<h1>{data.channel.title}</h1>

{#if data.channel.description}
  <p class="muted">{data.channel.description}</p>
{/if}

<p class="muted">
  <a
    href={`https://www.youtube.com/channel/${data.channel.youtubeChannelId}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    View channel on YouTube
  </a>
</p>

<div class="grid video-grid section">
  {#each data.videos as video}
    <VideoCard {video} />
  {/each}
</div>
