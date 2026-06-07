<script lang="ts">
  import HomeIcon from "./HomeIcon.svelte";

  type Category = {
    label: string;
    href: string;
    icon:
      | "briefcase"
      | "smile"
      | "book"
      | "globe"
      | "drama"
      | "music"
      | "news"
      | "religion"
      | "sport";
  };

  let {
    categories = [
      { label: "Business", href: "/fr/categories/business", icon: "briefcase" },
      { label: "Comedy", href: "/fr/categories/comedy", icon: "smile" },
      { label: "Culture", href: "/fr/categories/culture", icon: "book" },
      { label: "Diaspora", href: "/fr/categories/diaspora", icon: "globe" },
      { label: "Drama", href: "/fr/categories/drama", icon: "drama" },
      { label: "Music", href: "/fr/categories/music", icon: "music" },
      { label: "News", href: "/fr/categories/news", icon: "news" },
      { label: "Religion", href: "/fr/categories/religion", icon: "religion" },
      { label: "Sport", href: "/fr/categories/sport", icon: "sport" },
    ],
  }: { categories?: Category[] } = $props();
</script>

<nav class="category-rail" aria-label="Categories video">
  {#each categories as category}
    <a href={category.href} class="category">
      <HomeIcon name={category.icon} size={31} />
      <span>{category.label}</span>
    </a>
  {/each}
</nav>

<style>
  .category-rail {
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 1.15rem;
    box-shadow: var(--ev-shadow);
    display: grid;
    grid-template-columns: repeat(9, minmax(0, 1fr));
    margin-top: 1rem;
    overflow: hidden;
  }

  .category {
    align-items: center;
    color: var(--ev-ink);
    display: grid;
    font-family: var(--ev-font);
    font-size: 0.78rem;
    font-weight: 600;
    gap: 0.55rem;
    justify-items: center;
    min-height: 5.45rem;
    padding: 0.85rem 0.5rem;
    text-decoration: none;
  }

  .category + .category {
    border-left: 1px solid var(--ev-border);
  }

  .category:hover {
    background: var(--ev-mint);
    color: var(--ev-green);
  }

  @media (max-width: 980px) {
    .category-rail {
      grid-auto-columns: minmax(7.3rem, 1fr);
      grid-auto-flow: column;
      grid-template-columns: none;
      overflow-x: auto;
    }
  }
</style>
