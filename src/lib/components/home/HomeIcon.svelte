<script lang="ts">
  type IconName =
    | "briefcase"
    | "smile"
    | "book"
    | "globe"
    | "drama"
    | "music"
    | "news"
    | "religion"
    | "sport"
    | "play"
    | "search"
    | "chevron";

  let { name, size = 24 }: { name: IconName; size?: number } = $props();
</script>

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
  {#if name === "briefcase"}
    <rect x="4" y="7" width="16" height="12" rx="2" />
    <path d="M9 7V5h6v2M4 12h16" />
  {:else if name === "smile"}
    <circle cx="12" cy="12" r="8" />
    <path d="M9 10h.01M15 10h.01M8.8 14.5c1.8 1.6 4.6 1.6 6.4 0" />
  {:else if name === "book"}
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H20v17H8.5A3.5 3.5 0 0 0 5 22z" />
    <path d="M5 5.5V22M9 6h7M9 10h7" />
  {:else if name === "globe"}
    <circle cx="12" cy="12" r="8" />
    <path d="M4 12h16M12 4a12 12 0 0 1 0 16M12 4a12 12 0 0 0 0 16" />
  {:else if name === "drama"}
    <path d="M7 6c3-1.4 7-1.4 10 0v5c0 4-2.4 6.5-5 7.5C9.4 17.5 7 15 7 11z" />
    <path d="M10 10h.01M14 10h.01M9.5 14c1.6-1 3.4-1 5 0" />
  {:else if name === "music"}
    <path d="M9 18V5l10-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="16" cy="16" r="3" />
  {:else if name === "news"}
    <path d="M5 4h12a2 2 0 0 1 2 2v13H7a2 2 0 0 1-2-2z" />
    <path d="M8 8h7M8 12h7M8 16h4" />
  {:else if name === "religion"}
    <path d="M12 3v5M9.5 5.5h5M5 21h14M7 21V11l5-3 5 3v10" />
    <path d="M10 21v-5h4v5" />
  {:else if name === "sport"}
    <circle cx="12" cy="12" r="8" />
    <path d="M8 5.5c4 2 6.5 6.5 5.5 14M19 10c-4.5.3-8.4 2.6-11 6" />
  {:else if name === "play"}
    <path d="m9 7 8 5-8 5z" fill="currentColor" stroke="none" />
  {:else if name === "search"}
    <circle cx="11" cy="11" r="6" />
    <path d="m16 16 4 4" />
  {:else if name === "chevron"}
    <path d="m9 6 6 6-6 6" />
  {/if}
</svg>

<style>
  .icon {
    display: block;
  }
</style>
