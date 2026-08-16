<script lang="ts">
  type IconName =
    | "briefcase"
    | "smile"
    | "book"
    | "globe"
    | "drama"
    | "music"
    | "religion"
    | "sport"
    | "play"
    | "search"
    | "chevron";

  let { name, size = 24 }: { name: IconName; size?: number } = $props();

  const categoryIcons: Partial<Record<IconName, string>> = {
    briefcase: "/icons/categories/business.svg",
    smile: "/icons/categories/comedy.svg",
    book: "/icons/categories/culture.svg",
    globe: "/icons/categories/diaspora.svg",
    drama: "/icons/categories/drama.svg",
    music: "/icons/categories/music.svg",
    religion: "/icons/categories/religion.svg",
    sport: "/icons/categories/sport.svg",
  };

  const iconSrc = $derived(categoryIcons[name]);
</script>

{#if iconSrc}
  <img
    aria-hidden="true"
    class="icon image-icon"
    src={iconSrc}
    alt=""
    width={size}
    height={size}
  />
{:else}
  <svg
    aria-hidden="true"
    class="icon"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    {#if name === "play"}
      <path d="m9 7 8 5-8 5z" fill="currentColor" stroke="none" />
    {:else if name === "search"}
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    {:else if name === "chevron"}
      <path d="m9 6 6 6-6 6" />
    {/if}
  </svg>
{/if}

<style>
  .icon {
    display: block;
  }

  .image-icon {
    object-fit: contain;
  }
</style>
