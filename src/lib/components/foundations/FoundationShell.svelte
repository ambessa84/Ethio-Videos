<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title,
    description,
    children,
  }: { title: string; description: string; children: Snippet } = $props();
</script>

<section class="foundation-shell">
  <div class="intro">
    <p>Foundations</p>
    <h1>{title}</h1>
    <span>{description}</span>
  </div>
  {@render children()}
</section>

<style>
  .foundation-shell {
    background: var(--ev-cream);
    color: var(--ev-ink);
    font-family: var(--ev-font);
    min-height: 100vh;
    padding: 3rem;
  }

  .intro {
    margin: 0 auto 2rem;
    max-width: 1120px;
  }

  .intro p {
    color: var(--ev-green);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin: 0 0 0.45rem;
    text-transform: uppercase;
  }

  .intro h1 {
    color: var(--ev-ink);
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 800;
    letter-spacing: 0;
    line-height: 1;
    margin: 0;
  }

  .intro span {
    color: var(--ev-muted);
    display: block;
    font-size: 1rem;
    line-height: 1.6;
    margin-top: 0.75rem;
    max-width: 46rem;
  }

  @media (max-width: 720px) {
    .foundation-shell {
      padding: 1.5rem;
    }
  }
</style>
