<script lang="ts">
  import AppHeader from "./AppHeader.svelte";
  import CategoryRail from "./CategoryRail.svelte";
  import FeaturedVideo from "./FeaturedVideo.svelte";
  import HomeHero from "./HomeHero.svelte";
  import VideoSection from "./VideoSection.svelte";
</script>

<main class="showcase">
  <AppHeader />
  <HomeHero />
  <CategoryRail />
  <FeaturedVideo />
  <VideoSection />
</main>

<style>
  .showcase {
    background: linear-gradient(180deg, var(--ev-white), var(--ev-cream));
    color: var(--ev-ink);
    font-family: var(--ev-font);
    margin: 0 auto;
    max-width: 1280px;
    min-height: 100vh;
    padding: 0 2.2rem 2.5rem;
  }

  @media (max-width: 720px) {
    .showcase {
      padding: 0 1rem 1.5rem;
    }
  }
</style>
