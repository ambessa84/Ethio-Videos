<script lang="ts">
  import HomeIcon from "./HomeIcon.svelte";

  let {
    eyebrow = "Musique, actualités, culture, humour et diaspora.",
    title = "Découvrez les meilleures vidéos éthiopiennes",
    highlightedWord = "éthiopiennes",
    imageUrl = "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80",
    primaryHref = "/fr/dernieres-videos",
    secondaryHref = "/fr/categories/music",
    primaryLabel = "Regarder maintenant",
    secondaryLabel = "Explorer les catégories",
  } = $props<{
    eyebrow?: string;
    title?: string;
    highlightedWord?: string;
    imageUrl?: string;
    primaryHref?: string;
    secondaryHref?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
  }>();

  const titleBeforeHighlight = $derived(
    highlightedWord ? title.replace(highlightedWord, "").trim() : title,
  );
</script>

<section class="hero">
  <div class="content">
    <h1>
      {titleBeforeHighlight}
      {#if highlightedWord}
        <span>{highlightedWord}</span>
      {/if}
    </h1>
    <div class="bottom-row">
      <div class="cta-row">
        <a href={primaryHref} class="primary">
          <HomeIcon name="play" size={44} />
          {primaryLabel}
        </a>
        <a href={secondaryHref} class="secondary">
          {secondaryLabel}
          <HomeIcon name="chevron" size={16} />
        </a>
      </div>
      <p>{eyebrow} Toute l'Éthiopie en vidéo, sélectionnée pour vous.</p>
    </div>
  </div>
  <div class="visual" aria-hidden="true">
    <img src={imageUrl} alt="" />
  </div>
</section>

<style>
  .hero {
    background: var(--ev-cream);
    border-radius: 1.35rem;
    display: grid;
    grid-template-rows: clamp(12rem, 24vw, 19rem) auto;
    overflow: hidden;
    position: relative;
  }

  .content {
    display: grid;
    font-family: var(--ev-font);
    gap: clamp(0.85rem, 2vw, 1.35rem);
    min-width: 0;
    padding: clamp(1rem, 2.4vw, 1.65rem) 0 clamp(1.25rem, 3vw, 2rem);
    position: relative;
    z-index: 2;
  }

  h1 {
    color: var(--ev-ink);
    font-size: clamp(2.1rem, 3.65vw, 3.65rem);
    font-weight: 800;
    letter-spacing: 0;
    line-height: 0.98;
    margin: 0;
    max-width: none;
    overflow-wrap: break-word;
    white-space: nowrap;
  }

  h1 span {
    color: var(--ev-gold);
    display: block;
    white-space: nowrap;
  }

  p {
    color: var(--ev-muted);
    font-size: 0.98rem;
    font-weight: 500;
    line-height: 1.55;
    margin: 0;
    max-width: 28rem;
  }

  .bottom-row {
    align-items: end;
    display: grid;
    gap: clamp(1rem, 3vw, 2rem);
    grid-template-columns: minmax(18rem, 0.48fr) minmax(18rem, 0.52fr);
  }

  .cta-row {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 0;
  }

  .primary,
  .secondary {
    align-items: center;
    border-radius: 0.65rem;
    display: inline-flex;
    font-size: 0.85rem;
    font-weight: 700;
    gap: 0.55rem;
    min-height: 2.8rem;
    text-decoration: none;
  }

  .primary {
    background: var(--ev-green);
    color: var(--ev-white);
    padding: 0 1.2rem;
  }

  .secondary {
    color: var(--ev-green);
    padding: 0 0.3rem;
  }

  .visual {
    min-height: 0;
    order: -1;
    position: relative;
  }

  .visual img {
    height: 100%;
    object-fit: cover;
    object-position: center 72%;
    width: 100%;
  }

  @media (max-width: 1120px) {
    .bottom-row {
      grid-template-columns: 1fr;
    }

    h1 {
      font-size: clamp(2.25rem, 7vw, 4rem);
      white-space: normal;
    }

    h1 span {
      white-space: normal;
    }
  }

  @media (max-width: 760px) {
    .hero {
      grid-template-rows: clamp(10rem, 44vw, 14rem) auto;
    }

    .content {
      max-width: none;
      padding: 1rem 0 1.35rem;
    }

    .bottom-row {
      gap: 0.85rem;
    }

    h1 {
      font-size: clamp(2rem, 10vw, 3.25rem);
    }
  }
</style>
