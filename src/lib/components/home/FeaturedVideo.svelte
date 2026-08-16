<script lang="ts">
  import HomeIcon from "./HomeIcon.svelte";

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
    title = "À la une",
    viewAllLabel = "Voir tout",
    viewAllHref = "/fr/tendances",
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
  }: {
    title?: string;
    viewAllLabel?: string;
    viewAllHref?: string;
    video?: FeaturedVideo;
  } = $props();
</script>

<section class="featured">
  <div class="section-heading">
    <h2>{title}</h2>
    <a href={viewAllHref}>
      {viewAllLabel}
      <HomeIcon name="chevron" size={15} />
    </a>
  </div>
  <div class="feature-card">
    <a
      href={video.href ?? "/fr/videos/reprise-haftom-amare-shegewa"}
      class="media"
      aria-label="Lire la vidéo"
    >
      <img src={video.imageUrl} alt={video.title} />
      <span class="badge">{video.category}</span>
      <span class="duration">{video.duration}</span>
      <span class="play">
        <HomeIcon name="play" size={44} />
      </span>
    </a>
    <div class="body">
      <h3>
        <a href={video.href ?? "/fr/videos/reprise-haftom-amare-shegewa"}>
          {video.title}
        </a>
      </h3>
      <p class="channel">{video.channel}</p>
      <p class="meta">{video.views} vues <span></span> {video.date}</p>
    </div>
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
    align-items: start;
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 1.15rem;
    box-shadow: 0 14px 36px rgba(21, 30, 44, 0.06);
    display: grid;
    gap: 1.25rem;
    grid-template-columns: minmax(18rem, 0.9fr) minmax(0, 1fr);
    padding: 0.75rem;
  }

  .media {
    aspect-ratio: 16 / 9;
    border-radius: 0.8rem;
    display: block;
    overflow: hidden;
    position: relative;
    text-decoration: none;
  }

  .media img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .badge,
  .duration {
    border-radius: 0.4rem;
    color: var(--ev-white);
    font-size: 0.62rem;
    font-weight: 800;
    line-height: 1;
    padding: 0.4rem 0.5rem;
    position: absolute;
    text-transform: uppercase;
  }

  .badge {
    background: var(--ev-green);
    left: 0.55rem;
    top: 0.55rem;
  }

  .duration {
    background: rgba(21, 30, 44, 0.88);
    bottom: 0.45rem;
    right: 0.45rem;
  }

  .play {
    align-items: center;
    aspect-ratio: 1;
    background: var(--ev-mint);
    border: 1px solid rgba(3, 104, 84, 0.28);
    border-radius: 999px;
    box-shadow: 0 8px 22px rgba(3, 104, 84, 0.18);
    color: var(--ev-green);
    display: inline-flex;
    justify-content: center;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 4rem;
  }

  h3 {
    color: var(--ev-ink);
    font-size: clamp(1.2rem, 2.5vw, 1.55rem);
    font-weight: 700;
    line-height: 1.3;
    margin: 0;
    max-width: 34rem;
  }

  h3 a {
    color: inherit;
    text-decoration: none;
  }

  .channel,
  .meta {
    color: var(--ev-muted);
    font-size: 0.82rem;
    font-weight: 500;
    margin: 0.32rem 0 0;
  }

  .meta span::before {
    content: "/";
    padding: 0 0.35rem;
  }

  @media (max-width: 760px) {
    .feature-card {
      grid-template-columns: 1fr;
    }

    .play {
      width: 3.2rem;
    }
  }
</style>
