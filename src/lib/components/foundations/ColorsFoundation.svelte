<script lang="ts">
  import FoundationShell from "./FoundationShell.svelte";

  const colors = [
    { name: "Ink", token: "--ev-ink", value: "#151e2c", text: "#ffffff" },
    { name: "Green", token: "--ev-green", value: "#036854", text: "#ffffff" },
    { name: "Gold", token: "--ev-gold", value: "#dea328", text: "#151e2c" },
    { name: "Orange", token: "--ev-orange", value: "#e25d2f", text: "#ffffff" },
    { name: "Cream", token: "--ev-cream", value: "#faf6eb", text: "#151e2c" },
    { name: "Mint", token: "--ev-mint", value: "#eef3ee", text: "#151e2c" },
  ];
</script>

<FoundationShell
  title="Colors"
  description="Palette principale EthioVideos, exposee sous forme de variables CSS reutilisables."
>
  <div class="grid">
    {#each colors as color}
      <article
        class="swatch"
        style={`--swatch: ${color.value}; --swatch-text: ${color.text}`}
      >
        <div class="preview">
          <span>{color.name}</span>
        </div>
        <div class="meta">
          <strong>{color.value}</strong>
          <code>{color.token}</code>
        </div>
      </article>
    {/each}
  </div>
</FoundationShell>

<style>
  .grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin: 0 auto;
    max-width: 1120px;
  }

  .swatch {
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 0.85rem;
    box-shadow: 0 12px 36px rgba(21, 30, 44, 0.08);
    overflow: hidden;
  }

  .preview {
    align-items: flex-end;
    background: var(--swatch);
    color: var(--swatch-text);
    display: flex;
    min-height: 9.5rem;
    padding: 1rem;
  }

  .preview span {
    font-size: 1.35rem;
    font-weight: 800;
  }

  .meta {
    display: grid;
    gap: 0.25rem;
    padding: 1rem;
  }

  strong {
    color: var(--ev-ink);
    font-size: 0.95rem;
  }

  code {
    color: var(--ev-muted);
    font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
    font-size: 0.82rem;
  }

  @media (max-width: 860px) {
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 560px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
