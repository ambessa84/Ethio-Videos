<script lang="ts">
  import VideoCard from "$lib/components/VideoCard.svelte";
  import { localizedLabels } from "$lib/i18n";

  let { data } = $props();
  let labels = $derived(localizedLabels[data.lang]);
</script>

<svelte:head>
  <title>{labels.trending} | EthioVideos</title>
</svelte:head>

<h1>{labels.trending}</h1>

<div class="grid video-grid section">
  {#each data.videos as video}
    <VideoCard {video} lang={data.lang} />
  {/each}
</div>
