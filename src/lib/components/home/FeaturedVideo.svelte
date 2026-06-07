<script lang="ts">
  import HomeIcon from "./HomeIcon.svelte";
  import VideoTile from "./VideoTile.svelte";

  type FeaturedVideo = {
    title: string;
    channel: string;
    views: string;
    date: string;
    category: string;
    duration: string;
    imageUrl: string;
    href?: string;
  };

  let {
    video = {
      title:
        "Reprise Haftom Amare - Shegewa : Nouvelle chanson tigrigna de 2026",
      channel: "Hope Music Ethiopia",
      views: "51K",
      date: "10 mars 2026",
      category: "Musique",
      duration: "04:32",
      imageUrl:
        "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=900&q=80",
      href: "/fr/videos/reprise-haftom-amare-shegewa",
    },
  }: { video?: FeaturedVideo } = $props();
</script>

<section class="featured">
  <div class="section-heading">
    <h2>A la une</h2>
    <a href="/fr/tendances">
      Voir tout
      <HomeIcon name="chevron" size={15} />
    </a>
  </div>
  <div class="feature-card">
    <VideoTile variant="feature" {...video} />
    <a
      href={video.href ?? "/fr/videos/reprise-haftom-amare-shegewa"}
      class="play"
      aria-label="Lire la video"
    >
      <HomeIcon name="play" size={22} />
    </a>
  </div>
</section>

<style>
  .featured {
    font-family: var(--ev-font);
    margin-top: 1.45rem;
  }

  .section-heading {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.65rem;
  }

  h2 {
    color: var(--ev-ink);
    font-size: 1.25rem;
    font-weight: 800;
    margin: 0;
  }

  .section-heading a {
    align-items: center;
    color: var(--ev-green);
    display: inline-flex;
    font-size: 0.78rem;
    font-weight: 700;
    gap: 0.35rem;
    text-decoration: none;
  }

  .feature-card {
    align-items: center;
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 1.15rem;
    box-shadow: 0 14px 36px rgba(21, 30, 44, 0.06);
    display: grid;
    gap: 1.25rem;
    grid-template-columns: minmax(0, 1fr) auto;
    padding: 0.75rem;
  }

  .play {
    align-items: center;
    aspect-ratio: 1;
    background: var(--ev-mint);
    border-radius: 999px;
    color: var(--ev-green);
    display: inline-flex;
    justify-content: center;
    margin-right: 0.9rem;
    text-decoration: none;
    width: 4rem;
  }

  @media (max-width: 760px) {
    .feature-card {
      grid-template-columns: 1fr;
    }

    .play {
      margin: 0;
      width: 3.2rem;
    }
  }
</style>
