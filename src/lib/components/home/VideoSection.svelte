<script lang="ts">
  import HomeIcon from "./HomeIcon.svelte";
  import VideoTile from "./VideoTile.svelte";

  let {
    title = "Tendances",
    videos = [
      {
        title: "Yared Negu - New Ethiopian Music Video 2026",
        channel: "Ethio Sound",
        views: "36K",
        date: "8 mars 2026",
        category: "Musique",
        duration: "04:15",
        imageUrl:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
        href: "/fr/videos/yared-negu-new-ethiopian-music-video-2026",
      },
      {
        title: "Andualem & Mekdes - Best Comedy Skit 2026",
        channel: "Abel Entertainment",
        views: "28K",
        date: "9 mars 2026",
        category: "Comedy",
        duration: "06:48",
        imageUrl:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=80",
        href: "/fr/videos/andualem-mekdes-best-comedy-skit-2026",
      },
      {
        title: "Timket : Celebrations de la foi et de la tradition",
        channel: "Ethio Culture",
        views: "19K",
        date: "7 mars 2026",
        category: "Culture",
        duration: "05:22",
        imageUrl:
          "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=700&q=80",
        href: "/fr/videos/timket-celebrations-foi-tradition",
      },
      {
        title: "Actualites d'Ethiopie - Resume du 10 mars 2026",
        channel: "Ethio News",
        views: "42K",
        date: "10 mars 2026",
        category: "News",
        duration: "03:57",
        imageUrl:
          "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=80",
        href: "/fr/videos/actualites-ethiopie-10-mars-2026",
      },
      {
        title: "Sew Le Sew - Episode 15 (Saison 2)",
        channel: "Kana Drama",
        views: "61K",
        date: "6 mars 2026",
        category: "Drama",
        duration: "12:31",
        imageUrl:
          "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&q=80",
        href: "/fr/videos/sew-le-sew-episode-15-saison-2",
      },
    ],
  } = $props();
</script>

<section class="video-section">
  <div class="section-heading">
    <h2>{title}</h2>
    <a href="/fr/tendances">
      Voir tout
      <HomeIcon name="chevron" size={15} />
    </a>
  </div>

  <div class="grid">
    {#each videos as video}
      <VideoTile {...video} />
    {/each}
  </div>
</section>

<style>
  .video-section {
    font-family: var(--ev-font);
    margin-top: 1.1rem;
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

  .grid {
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 1.15rem;
    box-shadow: 0 14px 36px rgba(21, 30, 44, 0.06);
    display: grid;
    gap: 1.1rem;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    padding: 0.75rem;
  }

  @media (max-width: 1080px) {
    .grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 720px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
