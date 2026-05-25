export const supportedLanguages = ["fr", "en", "am"] as const;
export type SiteLanguage = (typeof supportedLanguages)[number];

export const defaultLanguage: SiteLanguage = "fr";

export const languageLabels: Record<SiteLanguage, string> = {
  fr: "FR",
  en: "EN",
  am: "AM",
};

export const localizedLabels = {
  fr: {
    trending: "Tendances",
    latest: "Dernieres videos",
    music: "Musique",
    news: "Actualites",
    submit: "Proposer",
    search: "Rechercher",
    searchPlaceholder: "Rechercher des videos...",
    newsletter: "Newsletter",
    admin: "Admin",
    submitVideo: "Proposer une video",
    heroTitle: "Les meilleures videos ethiopiennes, selectionnees.",
    heroCopy:
      "Decouvrez des videos ethiopiennes d'actualite, musique, drama, comedie, culture et diaspora depuis YouTube.",
    featured: "A la une",
    noVideos: "Aucune video pour le moment.",
    addVideo: "Ajouter une video",
    relatedVideos: "Videos similaires",
    summary: "Resume",
    viewOnYoutube: "Voir sur YouTube",
    videosEmbedded: "Les videos sont integrees depuis YouTube.",
  },
  en: {
    trending: "Trending",
    latest: "Latest videos",
    music: "Music",
    news: "News",
    submit: "Submit",
    search: "Search",
    searchPlaceholder: "Search videos...",
    newsletter: "Newsletter",
    admin: "Admin",
    submitVideo: "Submit a video",
    heroTitle: "Best Ethiopian videos, curated.",
    heroCopy:
      "Discover Ethiopian news, music, drama, comedy, culture and diaspora videos from YouTube.",
    featured: "Featured",
    noVideos: "No videos yet.",
    addVideo: "Add a video",
    relatedVideos: "Related videos",
    summary: "Summary",
    viewOnYoutube: "View on YouTube",
    videosEmbedded: "Videos are embedded from YouTube.",
  },
  am: {
    trending: "ተወዳጅ",
    latest: "አዳዲስ ቪዲዮዎች",
    music: "ሙዚቃ",
    news: "ዜና",
    submit: "ላክ",
    search: "ፈልግ",
    searchPlaceholder: "ቪዲዮዎችን ፈልግ...",
    newsletter: "Newsletter",
    admin: "Admin",
    submitVideo: "ቪዲዮ ላክ",
    heroTitle: "ምርጥ የኢትዮጵያ ቪዲዮዎች።",
    heroCopy: "ዜና፣ ሙዚቃ፣ ድራማ፣ ኮሜዲ፣ ባህል እና የዲያስፖራ ቪዲዮዎችን ከYouTube ያግኙ።",
    featured: "ተመራጭ",
    noVideos: "እስካሁን ቪዲዮ የለም።",
    addVideo: "ቪዲዮ ጨምር",
    relatedVideos: "ተዛማጅ ቪዲዮዎች",
    summary: "ማጠቃለያ",
    viewOnYoutube: "በYouTube ይመልከቱ",
    videosEmbedded: "ቪዲዮዎች ከYouTube ተካተዋል።",
  },
} as const;

export const routeSegments = {
  fr: {
    latest: "dernieres-videos",
    trending: "tendances",
    videos: "videos",
    categories: "categories",
    tags: "etiquettes",
    channels: "chaines",
    search: "recherche",
    submitVideo: "proposer-video",
    newsletter: "lettre-info",
  },
  en: {
    latest: "latest",
    trending: "trending",
    videos: "videos",
    categories: "categories",
    tags: "tags",
    channels: "channels",
    search: "search",
    submitVideo: "submit-video",
    newsletter: "newsletter",
  },
  am: {
    latest: "addis-videos",
    trending: "tewedaj",
    videos: "videos",
    categories: "kifloch",
    tags: "miliktoch",
    channels: "channeloch",
    search: "felgi",
    submitVideo: "video-lak",
    newsletter: "newsletter",
  },
} as const;

export function normalizeSiteLanguage(value: string | undefined | null) {
  const language = value?.trim().toLowerCase();

  return supportedLanguages.includes(language as SiteLanguage)
    ? (language as SiteLanguage)
    : defaultLanguage;
}

export function isSupportedLanguage(value: string | undefined | null) {
  return supportedLanguages.includes(value as SiteLanguage);
}

export function getLocalizedVideoPath(language: SiteLanguage, slug: string) {
  return `/${language}/${routeSegments[language].videos}/${slug}`;
}

export function getLocalizedCategoryPath(language: SiteLanguage, slug: string) {
  return `/${language}/${routeSegments[language].categories}/${slug}`;
}

export function getLocalizedTagPath(language: SiteLanguage, slug: string) {
  return `/${language}/${routeSegments[language].tags}/${slug}`;
}

export function getLocalizedChannelPath(language: SiteLanguage, slug: string) {
  return `/${language}/${routeSegments[language].channels}/${slug}`;
}

export function getLocalizedStaticPath(
  language: SiteLanguage,
  route: "latest" | "trending" | "search" | "submitVideo" | "newsletter",
) {
  return `/${language}/${routeSegments[language][route]}`;
}

export function getLocalizedPath(language: SiteLanguage, path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const segments = normalizedPath.split("/").filter(Boolean);

  if (segments.length && isSupportedLanguage(segments[0])) {
    const currentSegment = segments[1];
    segments[0] = language;
    if (currentSegment) {
      const routeKey = findRouteSegmentKey(currentSegment);
      if (routeKey) {
        segments[1] = routeSegments[language][routeKey];
      }
    }
    return `/${segments.join("/")}`;
  }

  return `/${language}${normalizedPath === "/" ? "" : normalizedPath}`;
}

function findRouteSegmentKey(segment: string) {
  for (const language of supportedLanguages) {
    const match = Object.entries(routeSegments[language]).find(
      ([, value]) => value === segment,
    );

    if (match) return match[0] as keyof (typeof routeSegments)[SiteLanguage];
  }
}
