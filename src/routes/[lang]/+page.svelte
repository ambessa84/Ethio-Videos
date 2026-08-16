<script lang="ts">
  import { env } from "$env/dynamic/public";
  import AdSlot from "$lib/components/ads/AdSlot.svelte";
  import CategoryRail from "$lib/components/home/CategoryRail.svelte";
  import FeaturedVideo from "$lib/components/home/FeaturedVideo.svelte";
  import HomeHero from "$lib/components/home/HomeHero.svelte";
  import VideoSection from "$lib/components/home/VideoSection.svelte";
  import {
    getLocalizedCategoryPath,
    getLocalizedCategoryName,
    getLocalizedStaticPath,
    getLocalizedVideoPath,
    localizedLabels,
  } from "$lib/i18n";
  import { formatNumber } from "$lib/utils";

  let { data } = $props();
  let labels = $derived(localizedLabels[data.lang]);

  type CategoryIcon =
    | "briefcase"
    | "smile"
    | "book"
    | "globe"
    | "drama"
    | "music"
    | "religion"
    | "sport";

  const categoryIconBySlug: Record<string, CategoryIcon> = {
    business: "briefcase",
    comedy: "smile",
    culture: "book",
    diaspora: "globe",
    drama: "drama",
    music: "music",
    religion: "religion",
    sport: "sport",
  };

  function getCategoryIcon(slug: string): CategoryIcon {
    return categoryIconBySlug[slug] ?? "globe";
  }

  function formatDuration(duration?: string | null) {
    if (!duration) return "--:--";

    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;

    const hours = Number(match[1] ?? 0);
    const minutes = Number(match[2] ?? 0);
    const seconds = Number(match[3] ?? 0);
    const parts = hours
      ? [hours, minutes.toString().padStart(2, "0")]
      : [minutes || 0];

    return [...parts, seconds.toString().padStart(2, "0")].join(":");
  }

  function formatPublishedDate(value?: string | Date | null) {
    if (!value) return "";

    return new Intl.DateTimeFormat(data.lang, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }

  function toVideoTile(video: (typeof data.latestVideos)[number]) {
    return {
      title: video.localizedTitle || video.title,
      channel: video.channel?.title ?? "EthioVideos",
      views: formatNumber(video.viewCount) ?? "0",
      date: formatPublishedDate(video.publishedAt),
      category: video.category
        ? getLocalizedCategoryName(
            data.lang,
            video.category.slug,
            video.category.name,
          )
        : labels.featured,
      duration: formatDuration(video.duration),
      imageUrl: video.thumbnailUrl ?? "/placeholder-video.svg",
      href: getLocalizedVideoPath(data.lang, video.localizedSlug ?? video.slug),
    };
  }

  let categoryItems = $derived(
    data.categories.map((category) => ({
      label: getLocalizedCategoryName(data.lang, category.slug, category.name),
      href: getLocalizedCategoryPath(data.lang, category.slug),
      icon: getCategoryIcon(category.slug),
    })),
  );
  let featuredVideo = $derived(
    data.featuredVideos[0]
      ? toVideoTile(data.featuredVideos[0])
      : data.latestVideos[0]
        ? toVideoTile(data.latestVideos[0])
        : null,
  );
  let latestVideos = $derived(data.latestVideos.slice(0, 10).map(toVideoTile));
</script>

<svelte:head>
  <title>EthioVideos - {labels.heroTitle}</title>
  <meta name="description" content={labels.heroCopy} />
</svelte:head>

<div class="home-page">
  <HomeHero
    title={labels.heroTitle}
    eyebrow={labels.heroCopy}
    highlightedWord={data.lang === "en"
      ? "curated."
      : data.lang === "fr"
        ? "sélectionnées."
        : ""}
    primaryHref={getLocalizedStaticPath(data.lang, "latest")}
    secondaryHref={getLocalizedCategoryPath(data.lang, "music")}
    primaryLabel={labels.latest}
    secondaryLabel={labels.music}
  />

  <CategoryRail categories={categoryItems} />

  <AdSlot
    slot={env.PUBLIC_GOOGLE_ADSENSE_SLOT_HOME}
    label={labels.advertisement}
    minHeight="100px"
  />

  {#if featuredVideo}
    <FeaturedVideo
      title={labels.featured}
      viewAllLabel={labels.trending}
      viewAllHref={getLocalizedStaticPath(data.lang, "trending")}
      video={featuredVideo}
    />
  {/if}

  <VideoSection
    title={labels.latest}
    viewAllLabel={labels.trending}
    viewAllHref={getLocalizedStaticPath(data.lang, "trending")}
    videos={latestVideos}
  />

  {#if !data.latestVideos.length}
    <div class="empty-state">
      <p>{labels.noVideos}</p>
      <a href="/admin/videos/new">{labels.addVideo}</a>
    </div>
  {/if}
</div>

<style>
  .home-page {
    padding-bottom: 1rem;
  }

  .empty-state {
    background: var(--ev-white);
    border: 1px solid var(--ev-border);
    border-radius: 0.85rem;
    color: var(--ev-muted);
    display: grid;
    font-family: var(--ev-font);
    gap: 0.75rem;
    margin-top: 1.25rem;
    padding: 1.25rem;
  }

  .empty-state p {
    margin: 0;
  }

  .empty-state a {
    color: var(--ev-green);
    font-weight: 700;
  }
</style>
