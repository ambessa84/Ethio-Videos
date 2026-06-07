<script lang="ts">
  import FoundationShell from "./FoundationShell.svelte";

  const spaces = [
    { name: "2xs", value: "0.25rem", px: "4px" },
    { name: "xs", value: "0.5rem", px: "8px" },
    { name: "sm", value: "0.75rem", px: "12px" },
    { name: "md", value: "1rem", px: "16px" },
    { name: "lg", value: "1.5rem", px: "24px" },
    { name: "xl", value: "2rem", px: "32px" },
    { name: "2xl", value: "3rem", px: "48px" },
    { name: "3xl", value: "4rem", px: "64px" },
  ];
</script>

<FoundationShell
  title="Spacing"
  description="Echelle de rythme visuel pour espacer sections, cartes, controles et grilles."
>
  <div class="panel">
    {#each spaces as space}
      <div class="row">
        <div class="label">
          <strong>{space.name}</strong>
          <span>{space.value} / {space.px}</span>
        </div>
        <div class="track">
          <span style={`width: ${space.value}`}></span>
        </div>
      </div>
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
    gap: 1rem;
    margin: 0 auto;
    max-width: 1120px;
    padding: 1.25rem;
  }

  .row {
    align-items: center;
    display: grid;
    gap: 1rem;
    grid-template-columns: 9rem minmax(0, 1fr);
  }

  .label {
    display: grid;
    gap: 0.15rem;
  }

  strong {
    color: var(--ev-ink);
    font-size: 0.95rem;
  }

  span {
    color: var(--ev-muted);
    font-size: 0.8rem;
  }

  .track {
    background: var(--ev-mint);
    border-radius: 999px;
    height: 1.25rem;
    overflow: hidden;
  }

  .track span {
    background: var(--ev-green);
    border-radius: inherit;
    display: block;
    height: 100%;
    min-width: 0.25rem;
  }

  @media (max-width: 620px) {
    .row {
      grid-template-columns: 1fr;
    }
  }
</style>
