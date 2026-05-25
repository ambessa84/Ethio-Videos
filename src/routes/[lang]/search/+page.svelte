<script lang="ts">
  import VideoCard from "$lib/components/VideoCard.svelte";
  import { getLocalizedStaticPath, localizedLabels } from "$lib/i18n";

  let { data } = $props();
  let labels = $derived(localizedLabels[data.lang]);
</script>

<svelte:head>
  <title>{labels.search} | EthioVideos</title>
</svelte:head>

<h1>{labels.search}</h1>

<form action={getLocalizedStaticPath(data.lang, "search")} method="GET" class="form">
  <input
    class="input"
    name="q"
    value={data.q}
    placeholder={labels.searchPlaceholder}
  />
  <button class="button" type="submit">{labels.search}</button>
</form>

{#if data.q}
  <section class="section">
    <h2>Results for "{data.q}"</h2>

    {#if data.videos.length}
      <div class="grid video-grid">
        {#each data.videos as video}
          <VideoCard {video} lang={data.lang} />
        {/each}
      </div>
    {:else}
      <p class="muted">No result found.</p>
    {/if}
  </section>
{/if}
