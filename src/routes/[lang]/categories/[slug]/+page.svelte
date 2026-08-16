<script lang="ts">
  import VideoCard from "$lib/components/VideoCard.svelte";
  import { localizedLabels } from "$lib/i18n";

  let { data } = $props();
  let labels = $derived(localizedLabels[data.lang]);
</script>

<svelte:head>
  <title>{data.category.name} | EthioVideos</title>
  <meta
    name="description"
    content={data.category.description || `${data.category.name} - EthioVideos`}
  />
</svelte:head>

<h1>{data.category.name}</h1>

{#if data.category.description}
  <p class="muted">{data.category.description}</p>
{/if}

<div class="grid video-grid section">
  {#each data.videos as video}
    <VideoCard {video} lang={data.lang} />
  {/each}
</div>

{#if !data.videos.length}
  <p class="muted">{labels.noVideos}</p>
{/if}
