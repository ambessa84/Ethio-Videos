<script lang="ts">
  import HomeIcon from "./HomeIcon.svelte";

  type NavItem = {
    label: string;
    href: string;
  };

  let {
    brandHref = "/fr",
    searchAction = "/fr/recherche",
    searchLabel = "Rechercher",
    searchPlaceholder = "Rechercher des vidéos...",
    navItems = [
      { label: "Tendances", href: "/fr/tendances" },
      { label: "Dernières vidéos", href: "/fr/dernieres-videos" },
      { label: "Musique", href: "/fr/categories/musique" },
      { label: "Proposer", href: "/fr/proposer-video" },
    ],
  }: {
    brandHref?: string;
    searchAction?: string;
    searchLabel?: string;
    searchPlaceholder?: string;
    navItems?: NavItem[];
  } = $props();
</script>

<header class="app-header">
  <a href={brandHref} class="brand" aria-label="EthioVideos home">
    <span>Ethio</span><strong>Videos</strong>
  </a>

  <nav class="nav" aria-label="Navigation principale">
    {#each navItems as item}
      <a href={item.href}>{item.label}</a>
    {/each}
  </nav>

  <div class="actions">
    <form class="search" action={searchAction} method="GET">
      <HomeIcon name="search" size={18} />
      <input
        aria-label="Rechercher des vidéos"
        name="q"
        type="search"
        placeholder={searchPlaceholder}
      />
      <button type="submit">{searchLabel}</button>
    </form>
  </div>
</header>

<style>
  .app-header {
    align-items: center;
    display: grid;
    gap: 1rem;
    grid-template-columns: auto minmax(0, 1fr) auto;
    padding: 1rem 0;
  }

  .brand {
    color: var(--ev-green);
    font-family: var(--ev-font);
    font-size: clamp(1.4rem, 2vw, 1.75rem);
    font-weight: 800;
    letter-spacing: 0;
    text-decoration: none;
    white-space: nowrap;
  }

  .brand strong {
    color: var(--ev-gold);
    font-weight: 800;
  }

  .nav {
    align-items: center;
    display: flex;
    gap: clamp(0.8rem, 2vw, 1.6rem);
    justify-content: center;
  }

  .nav a {
    color: var(--ev-ink);
    font-family: var(--ev-font);
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
  }

  .actions {
    align-items: center;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .search {
    align-items: center;
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 0.85rem;
    color: var(--ev-muted);
    display: grid;
    gap: 0.65rem;
    grid-template-columns: auto minmax(11rem, 1fr) auto;
    padding: 0.25rem 0.25rem 0.25rem 0.85rem;
  }

  .search input {
    border: 0;
    color: var(--ev-ink);
    font-family: var(--ev-font);
    font-size: 0.85rem;
    min-width: 0;
    outline: 0;
  }

  .search button {
    background: var(--ev-green);
    border: 0;
    border-radius: 0.65rem;
    color: var(--ev-white);
    font-family: var(--ev-font);
    font-size: 0.82rem;
    font-weight: 700;
    padding: 0.85rem 1.25rem;
  }

  @media (max-width: 1060px) {
    .app-header {
      grid-template-columns: 1fr;
    }

    .nav,
    .actions {
      justify-content: flex-start;
    }

    .actions {
      align-items: stretch;
      flex-wrap: wrap;
    }
  }

  @media (max-width: 680px) {
    .nav {
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }

    .search {
      grid-template-columns: auto minmax(0, 1fr);
      width: 100%;
    }

    .search button {
      grid-column: 1 / -1;
    }
  }
</style>
