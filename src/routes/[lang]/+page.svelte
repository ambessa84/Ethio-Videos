<script lang="ts">
  import VideoCard from "$lib/components/VideoCard.svelte";
  import { getLocalizedCategoryPath, localizedLabels } from "$lib/i18n";

  let { data } = $props();
  let labels = $derived(localizedLabels[data.lang]);
</script>

<svelte:head>
  <title>EthioVideos - {labels.heroTitle}</title>
  <meta name="description" content={labels.heroCopy} />
</svelte:head>

<section class="hero">
  <h1>{labels.heroTitle}</h1>
  <p>{labels.heroCopy}</p>

  <div class="pills">
    {#each data.categories as category}
      <a class="pill" href={getLocalizedCategoryPath(data.lang, category.slug)}>
        {category.name}
      </a>
    {/each}
  </div>
</section>

{#if data.featuredVideos.length}
  <section class="section">
    <h2 class="section-title">{labels.featured}</h2>
    <div class="grid video-grid">
      {#each data.featuredVideos as video}
        <VideoCard {video} lang={data.lang} />
      {/each}
    </div>
  </section>
{/if}

<section class="section">
  <h2 class="section-title">{labels.latest}</h2>

  {#if data.latestVideos.length}
    <div class="grid video-grid">
      {#each data.latestVideos as video}
        <VideoCard {video} lang={data.lang} />
      {/each}
    </div>
  {:else}
    <div class="panel">
      <p>{labels.noVideos}</p>
      <p><a href="/admin/videos/new">{labels.addVideo}</a></p>
    </div>
  {/if}
</section>
