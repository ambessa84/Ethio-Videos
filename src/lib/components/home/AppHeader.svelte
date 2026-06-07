<script lang="ts">
  import HomeIcon from "./HomeIcon.svelte";

  type NavItem = {
    label: string;
    href: string;
  };

  let {
    activeLanguage = "FR",
    navItems = [
      { label: "Tendances", href: "/fr/tendances" },
      { label: "Dernieres videos", href: "/fr/dernieres-videos" },
      { label: "Musique", href: "/fr/categories/musique" },
      { label: "Actualites", href: "/fr/categories/actualites" },
      { label: "Proposer", href: "/fr/proposer-video" },
    ],
  }: {
    activeLanguage?: "FR" | "EN" | "AM";
    navItems?: NavItem[];
  } = $props();

  const languages = ["FR", "EN", "AM"] as const;
</script>

<header class="app-header">
  <a href="/" class="brand" aria-label="EthioVideos home">
    <span>Ethio</span><strong>Videos</strong>
  </a>

  <nav class="nav" aria-label="Navigation principale">
    {#each navItems as item}
      <a href={item.href}>{item.label}</a>
    {/each}
  </nav>

  <div class="actions">
    <div class="language-switcher" aria-label="Choix de langue">
      {#each languages as language}
        <button class:active={language === activeLanguage} type="button"
          >{language}</button
        >
      {/each}
    </div>

    <form class="search" action="/fr/recherche">
      <HomeIcon name="search" size={18} />
      <input
        aria-label="Rechercher des videos"
        placeholder="Rechercher des videos..."
      />
      <button type="submit">Rechercher</button>
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

  .language-switcher {
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 999px;
    box-shadow: 0 8px 24px rgba(21, 30, 44, 0.06);
    display: flex;
    padding: 0.25rem;
  }

  .language-switcher button {
    aspect-ratio: 1;
    background: transparent;
    border: 0;
    border-radius: 999px;
    color: var(--ev-ink);
    font-family: var(--ev-font);
    font-size: 0.78rem;
    font-weight: 700;
    min-width: 2.7rem;
    padding: 0;
  }

  .language-switcher button.active {
    background: var(--ev-green);
    color: var(--ev-white);
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
