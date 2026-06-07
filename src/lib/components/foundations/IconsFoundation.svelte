<script lang="ts">
  import FoundationShell from "./FoundationShell.svelte";
  import HomeIcon from "../home/HomeIcon.svelte";

  const icons = [
    "briefcase",
    "smile",
    "book",
    "globe",
    "drama",
    "music",
    "news",
    "religion",
    "sport",
    "play",
    "search",
    "chevron",
  ] as const;
</script>

<FoundationShell
  title="Icons"
  description="Inventaire temporaire des pictogrammes Storybook. Cette couche pourra etre remplacee par tes icones finales."
>
  <div class="grid">
    {#each icons as icon}
      <article>
        <div class="icon-box">
          <HomeIcon name={icon} size={34} />
        </div>
        <strong>{icon}</strong>
      </article>
    {/each}
  </div>
</FoundationShell>

<style>
  .grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    margin: 0 auto;
    max-width: 1120px;
  }

  article {
    align-items: center;
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 0.85rem;
    box-shadow: 0 12px 36px rgba(21, 30, 44, 0.08);
    display: grid;
    gap: 0.8rem;
    justify-items: center;
    min-height: 8rem;
    padding: 1rem;
  }

  .icon-box {
    align-items: center;
    background: var(--ev-mint);
    border-radius: 999px;
    color: var(--ev-green);
    display: flex;
    height: 4rem;
    justify-content: center;
    width: 4rem;
  }

  strong {
    color: var(--ev-ink);
    font-size: 0.78rem;
    font-weight: 700;
  }

  @media (max-width: 920px) {
    .grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  @media (max-width: 560px) {
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
