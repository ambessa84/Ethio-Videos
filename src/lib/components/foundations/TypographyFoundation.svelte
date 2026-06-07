<script lang="ts">
  import FoundationShell from "./FoundationShell.svelte";

  const specimens = [
    {
      label: "Display",
      className: "display",
      text: "Decouvrez les meilleures videos ethiopiennes",
    },
    { label: "Heading", className: "heading", text: "A la une" },
    { label: "Section", className: "section", text: "Tendances" },
    {
      label: "Body",
      className: "body",
      text: "Musique, actualites, culture, humour et diaspora.",
    },
    { label: "Meta", className: "meta", text: "51K vues / 10 mars 2026" },
  ];
</script>

<FoundationShell
  title="Typography"
  description="La direction typographique utilise Poppins pour l'interface editoriale EthioVideos."
>
  <div class="panel">
    {#each specimens as specimen}
      <article>
        <span>{specimen.label}</span>
        <p class={specimen.className}>{specimen.text}</p>
      </article>
    {/each}
  </div>
</FoundationShell>

<style>
  .panel {
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 0.85rem;
    box-shadow: 0 12px 36px rgba(21, 30, 44, 0.08);
    display: grid;
    gap: 1.25rem;
    margin: 0 auto;
    max-width: 1120px;
    padding: 1.5rem;
  }

  article {
    border-bottom: 1px solid var(--ev-border);
    display: grid;
    gap: 0.45rem;
    padding-bottom: 1.25rem;
  }

  article:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  span {
    color: var(--ev-green);
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  p {
    color: var(--ev-ink);
    letter-spacing: 0;
    margin: 0;
  }

  .display {
    color: var(--ev-ink);
    font-size: clamp(2.5rem, 6vw, 5rem);
    font-weight: 800;
    line-height: 0.95;
    max-width: 12ch;
  }

  .heading {
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.1;
  }

  .section {
    font-size: 1.25rem;
    font-weight: 800;
    line-height: 1.2;
  }

  .body {
    color: var(--ev-muted);
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.6;
  }

  .meta {
    color: var(--ev-muted);
    font-size: 0.8rem;
    font-weight: 500;
  }
</style>
