<script lang="ts">
  import { localizedLabels } from "$lib/i18n";

  let { data } = $props();
  let labels = $derived(localizedLabels[data.lang]);
</script>

<svelte:head>
  <title>{labels.news} | EthioVideos</title>
  <meta name="description" content={labels.newsIntro} />
</svelte:head>

<section class="news-page">
  <h1>{labels.news}</h1>
  <p class="muted">{labels.newsIntro}</p>
</section>

<style>
  .news-page {
    display: grid;
    gap: 0.75rem;
    padding-block: 1.5rem;
  }

  h1 {
    color: var(--ev-ink);
    font-family: var(--ev-font);
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 800;
    letter-spacing: 0;
    line-height: 1;
    margin: 0;
  }

  p {
    font-family: var(--ev-font);
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
    max-width: 44rem;
  }

</style>
