<script lang="ts">
  import { localizedLabels } from "$lib/i18n";

  let { data } = $props();
  let labels = $derived(localizedLabels[data.lang]);

  function getSourceInitials(sourceName: string) {
    return sourceName
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function formatRelativeTime(value: string | Date | null) {
    if (!value) return "";

    const date = new Date(value);
    const elapsedMs = date.getTime() - Date.now();
    const elapsedMinutes = Math.round(elapsedMs / 60_000);
    const elapsedHours = Math.round(elapsedMinutes / 60);
    const elapsedDays = Math.round(elapsedHours / 24);
    const formatter = new Intl.RelativeTimeFormat(data.lang, {
      numeric: "always",
    });

    if (Math.abs(elapsedMinutes) < 60) {
      return formatter.format(elapsedMinutes || -1, "minute");
    }

    if (Math.abs(elapsedHours) < 24) {
      return formatter.format(elapsedHours, "hour");
    }

    return formatter.format(elapsedDays, "day");
  }
</script>

<svelte:head>
  <title>{labels.news} | EthioVideos</title>
  <meta name="description" content={labels.newsIntro} />
</svelte:head>

<section class="news-page">
  <div class="news-heading">
    <h1>{labels.news}</h1>
    <p class="muted">{labels.newsIntro}</p>
  </div>

  {#if data.articles.length}
    <div class="news-list">
      {#each data.articles as article}
        <article class="news-card">
          <div class="news-source-row">
            <span class="source-mark" aria-hidden="true">
              {getSourceInitials(article.sourceName)}
            </span>
            <span class="source-name">{article.sourceName}</span>
          </div>

          <h2>
            <a href={article.sourceUrl} target="_blank" rel="noreferrer">
              {article.title}
            </a>
          </h2>

          <div class="news-meta">
            <p>
              {formatRelativeTime(article.publishedAt ?? article.importedAt)}
            </p>
            {#if article.topic}
              <p>{article.topic}</p>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  {:else}
    <div class="empty-news">
      <p class="muted">
        Les premiers articles apparaitront ici apres le prochain import RSS.
      </p>
    </div>
  {/if}
</section>

<style>
  .news-page {
    display: grid;
    gap: 1.65rem;
    padding-block: 2rem;
  }

  .news-heading {
    display: grid;
    gap: 0.75rem;
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

  .news-list {
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 8px;
    display: grid;
  }

  .news-card {
    display: grid;
    gap: 1.05rem;
    padding: clamp(1.35rem, 3vw, 2rem);
  }

  .news-card + .news-card {
    border-top: 1px solid var(--ev-border);
  }

  .news-source-row {
    align-items: center;
    display: flex;
    gap: 0.65rem;
  }

  .source-mark {
    align-items: center;
    aspect-ratio: 1;
    background: var(--ev-ink);
    border-radius: 6px;
    color: var(--ev-white);
    display: inline-flex;
    font-size: 0.72rem;
    font-weight: 800;
    justify-content: center;
    line-height: 1;
    width: 2rem;
  }

  .source-name {
    color: var(--ev-ink);
    font-family: var(--ev-font);
    font-size: 1.05rem;
    font-weight: 600;
  }

  h2 {
    color: var(--ev-ink);
    font-family: var(--ev-font);
    font-size: clamp(1.55rem, 3vw, 2.35rem);
    font-weight: 500;
    letter-spacing: 0;
    line-height: 1.35;
    margin: 0;
    max-width: 54rem;
  }

  h2 a {
    color: inherit;
    text-decoration: none;
  }

  h2 a:hover {
    color: var(--ev-green);
  }

  .news-meta {
    color: var(--ev-ink);
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 0.9rem;
  }

  .news-meta p {
    color: inherit;
    font-size: 1.2rem;
    max-width: none;
  }

  .news-meta p + p::before {
    content: "/";
    padding-right: 0.9rem;
  }

  .empty-news {
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 8px;
    padding: 1rem;
  }

  @media (max-width: 640px) {
    .news-card {
      gap: 0.85rem;
      padding: 1rem;
    }

    h2 {
      font-size: 1.35rem;
    }

    .news-meta p {
      font-size: 1rem;
    }
  }
</style>
