<script lang="ts">
  import HomeIcon from "./HomeIcon.svelte";

  type Variant = "compact" | "feature";

  let {
    variant = "compact",
    title,
    channel,
    views,
    date,
    category,
    duration,
    imageUrl,
    href = "/fr/videos/demo-video",
  }: {
    variant?: Variant;
    title: string;
    channel: string;
    views: string;
    date: string;
    category: string;
    duration: string;
    imageUrl: string;
    href?: string;
  } = $props();
</script>

<article class:feature={variant === "feature"} class="tile">
  <a {href} class="thumb">
    <img src={imageUrl} alt={title} />
    <span class="badge">{category}</span>
    <span class="duration">{duration}</span>
    <span class="play-overlay">
      <HomeIcon name="play" size={30} />
    </span>
  </a>
  <div class="body">
    <h3><a {href}>{title}</a></h3>
    <p class="channel">{channel}</p>
    <p class="meta">{views} vues <span></span> {date}</p>
  </div>
</article>

<style>
  .tile {
    display: grid;
    font-family: var(--ev-font);
    gap: 0.7rem;
    min-width: 0;
  }

  .thumb {
    aspect-ratio: 16 / 9;
    border-radius: 0.65rem;
    display: block;
    overflow: hidden;
    position: relative;
    text-decoration: none;
  }

  .thumb img {
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

  .play-overlay {
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
    width: 3rem;
  }

  .feature .play-overlay {
    width: 4rem;
  }

  h3 {
    color: var(--ev-ink);
    font-size: 0.9rem;
    font-weight: 700;
    line-height: 1.3;
    margin: 0;
  }

  h3 a {
    color: inherit;
    text-decoration: none;
  }

  .channel,
  .meta {
    color: var(--ev-muted);
    font-size: 0.72rem;
    font-weight: 500;
    margin: 0.32rem 0 0;
  }

  .meta span::before {
    content: "/";
    padding: 0 0.35rem;
  }

  .feature {
    align-items: center;
    grid-template-columns: minmax(18rem, 0.9fr) minmax(0, 1fr);
  }

  .feature .thumb {
    border-radius: 0.8rem;
  }

  .feature h3 {
    font-size: clamp(1.2rem, 2.5vw, 1.55rem);
    max-width: 34rem;
  }

  .feature .channel,
  .feature .meta {
    font-size: 0.82rem;
  }

  @media (max-width: 760px) {
    .feature {
      grid-template-columns: 1fr;
    }
  }
</style>
