<script lang="ts">
  import VideoCard from "$lib/components/VideoCard.svelte";
  import { localizedLabels } from "$lib/i18n";

  let { data } = $props();
  let labels = $derived(localizedLabels[data.lang]);
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
    {labels.viewOnYoutube}
  </a>
</p>

<div class="grid video-grid section">
  {#each data.videos as video}
    <VideoCard {video} lang={data.lang} />
  {/each}
</div>
