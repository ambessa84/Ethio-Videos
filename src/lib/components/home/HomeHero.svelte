<script lang="ts">
  import HomeIcon from "./HomeIcon.svelte";

  let {
    eyebrow = "Musique, actualites, culture, humour et diaspora.",
    title = "Decouvrez les meilleures videos ethiopiennes",
    highlightedWord = "ethiopiennes",
    imageUrl = "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80",
  } = $props<{
    eyebrow?: string;
    title?: string;
    highlightedWord?: string;
    imageUrl?: string;
  }>();

  const titleBeforeHighlight = $derived(
    title.replace(highlightedWord, "").trim(),
  );
</script>

<section class="hero">
  <div class="content">
    <h1>
      {titleBeforeHighlight}
      <span>{highlightedWord}</span>
    </h1>
    <p>{eyebrow} Tout l'Ethiopie en video, selectionne pour vous.</p>
    <div class="cta-row">
      <a href="/fr/dernieres-videos" class="primary">
        <HomeIcon name="play" size={16} />
        Regarder maintenant
      </a>
      <a href="/fr/categories/music" class="secondary">
        Explorer les categories
        <HomeIcon name="chevron" size={16} />
      </a>
    </div>
  </div>
  <div class="visual" aria-hidden="true">
    <img src={imageUrl} alt="" />
  </div>
</section>

<style>
  .hero {
    background:
      linear-gradient(
        90deg,
        rgba(250, 246, 235, 0.98) 0%,
        rgba(250, 246, 235, 0.86) 44%,
        rgba(3, 104, 84, 0.12) 100%
      ),
      var(--ev-cream);
    border-radius: 1.35rem;
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(20rem, 0.98fr);
    min-height: 21rem;
    overflow: hidden;
    position: relative;
  }

  .content {
    align-self: center;
    font-family: var(--ev-font);
    padding: clamp(2rem, 5vw, 4.2rem);
    position: relative;
    z-index: 2;
  }

  h1 {
    color: var(--ev-ink);
    font-size: clamp(2.8rem, 6vw, 5.25rem);
    font-weight: 800;
    letter-spacing: 0;
    line-height: 0.95;
    margin: 0;
    max-width: 12ch;
  }

  h1 span {
    color: var(--ev-gold);
    display: block;
  }

  p {
    color: var(--ev-muted);
    font-size: 0.98rem;
    font-weight: 500;
    line-height: 1.55;
    margin: 1.15rem 0 0;
    max-width: 31rem;
  }

  .cta-row {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1.7rem;
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
    min-height: 100%;
    position: relative;
  }

  .visual::before {
    background: linear-gradient(
      90deg,
      rgba(250, 246, 235, 0.85),
      rgba(250, 246, 235, 0)
    );
    content: "";
    inset: 0;
    position: absolute;
    z-index: 1;
  }

  .visual img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  @media (max-width: 760px) {
    .hero {
      grid-template-columns: 1fr;
    }

    .visual {
      min-height: 14rem;
      order: -1;
    }

    .visual::before {
      background: linear-gradient(
        0deg,
        var(--ev-cream),
        rgba(250, 246, 235, 0)
      );
    }
  }
</style>
