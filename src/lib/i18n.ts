export const supportedLanguages = ["fr", "en", "am"] as const;
export type SiteLanguage = (typeof supportedLanguages)[number];

export const defaultLanguage: SiteLanguage = "en";

export const languageLabels: Record<SiteLanguage, string> = {
  fr: "FR",
  en: "EN",
  am: "AM",
};

export const localizedLabels = {
  fr: {
    trending: "Tendances",
    latest: "Dernières vidéos",
    music: "Musique",
    news: "Actualités",
    newsIntro:
      "Les actualités agrégées depuis des sources fiables seront bientôt disponibles ici.",
    submit: "Proposer",
    submitVideoCopy: "Proposez une vidéo YouTube à ajouter au site.",
    submitVideoSuccess: "Merci, votre suggestion a bien été reçue.",
    submitVideoInvalidUrl: "Veuillez renseigner une URL YouTube valide.",
    youtubeUrl: "URL YouTube",
    category: "Catégorie",
    categoryPlaceholder: "Musique, actualités, drama...",
    language: "Langue",
    notSure: "Je ne sais pas",
    oromo: "Oromo",
    tigrinya: "Tigrigna",
    optionalEmail: "Email facultatif",
    optionalMessage: "Message facultatif",
    search: "Rechercher",
    searchResultsFor: "Résultats pour",
    noSearchResults: "Aucun résultat trouvé.",
    searchPlaceholder: "Rechercher des vidéos...",
    newsletter: "Newsletter",
    newsletterCopy: "Recevez les meilleures vidéos éthiopiennes par email.",
    newsletterSubscribed: "Votre inscription est confirmée.",
    newsletterInvalidEmail: "Veuillez renseigner une adresse email valide.",
    preferredLanguage: "Langue préférée",
    noLanguagePreference: "Aucune préférence",
    english: "Anglais",
    french: "Français",
    amharic: "Amharique",
    subscribe: "S'inscrire",
    admin: "Admin",
    submitVideo: "Proposer une vidéo",
    heroTitle: "Les meilleures vidéos éthiopiennes, sélectionnées.",
    heroCopy:
      "Découvrez des vidéos éthiopiennes d'actualité, musique, drama, comédie, culture et diaspora depuis YouTube.",
    featured: "À la une",
    noVideos: "Aucune vidéo pour le moment.",
    addVideo: "Ajouter une vidéo",
    relatedVideos: "Vidéos similaires",
    summary: "Résumé",
    viewOnYoutube: "Voir sur YouTube",
    videosEmbedded: "Les vidéos sont intégrées depuis YouTube.",
    views: "vues",
  },
  en: {
    trending: "Trending",
    latest: "Latest videos",
    music: "Music",
    news: "News",
    newsIntro:
      "Aggregated news from trusted sources will be available here soon.",
    submit: "Submit",
    submitVideoCopy: "Suggest a YouTube video to add to the site.",
    submitVideoSuccess: "Thanks! Your suggestion has been received.",
    submitVideoInvalidUrl: "Please provide a valid YouTube URL.",
    youtubeUrl: "YouTube URL",
    category: "Category",
    categoryPlaceholder: "Music, News, Drama...",
    language: "Language",
    notSure: "Not sure",
    oromo: "Oromo",
    tigrinya: "Tigrinya",
    optionalEmail: "Email optional",
    optionalMessage: "Message optional",
    search: "Search",
    searchResultsFor: "Results for",
    noSearchResults: "No result found.",
    searchPlaceholder: "Search videos...",
    newsletter: "Newsletter",
    newsletterCopy: "Receive the best Ethiopian videos by email.",
    newsletterSubscribed: "You are subscribed.",
    newsletterInvalidEmail: "Please provide a valid email.",
    preferredLanguage: "Preferred language",
    noLanguagePreference: "No preference",
    english: "English",
    french: "French",
    amharic: "Amharic",
    subscribe: "Subscribe",
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
    views: "views",
  },
  am: {
    trending: "ተወዳጅ",
    latest: "አዳዲስ ቪዲዮዎች",
    music: "ሙዚቃ",
    news: "ዜና",
    newsIntro: "ከታማኝ ምንጮች የሚሰበሰቡ ዜናዎች በቅርቡ እዚህ ይገኛሉ።",
    submit: "ላክ",
    submitVideoCopy: "ወደ ጣቢያው ለመጨመር የYouTube ቪዲዮ ይጠቁሙ።",
    submitVideoSuccess: "እናመሰግናለን፣ ጥቆማዎ ተቀብሏል።",
    submitVideoInvalidUrl: "እባክዎ ትክክለኛ የYouTube URL ያስገቡ።",
    youtubeUrl: "የYouTube URL",
    category: "ምድብ",
    categoryPlaceholder: "ሙዚቃ፣ ዜና፣ ድራማ...",
    language: "ቋንቋ",
    notSure: "እርግጠኛ አይደለሁም",
    oromo: "ኦሮሞ",
    tigrinya: "ትግርኛ",
    optionalEmail: "ኢሜይል አማራጭ",
    optionalMessage: "መልዕክት አማራጭ",
    search: "ፈልግ",
    searchResultsFor: "የፍለጋ ውጤቶች",
    noSearchResults: "ምንም ውጤት አልተገኘም።",
    searchPlaceholder: "ቪዲዮዎችን ፈልግ...",
    newsletter: "Newsletter",
    newsletterCopy: "ከኢትዮጵያ ምርጥ ቪዲዮዎችን በኢሜይል ይቀበሉ።",
    newsletterSubscribed: "ተመዝግበዋል።",
    newsletterInvalidEmail: "እባክዎ ትክክለኛ ኢሜይል ያስገቡ።",
    preferredLanguage: "የሚመርጡት ቋንቋ",
    noLanguagePreference: "ምንም ምርጫ የለም",
    english: "እንግሊዝኛ",
    french: "ፈረንሳይኛ",
    amharic: "አማርኛ",
    subscribe: "ይመዝገቡ",
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
    views: "እይታዎች",
  },
} as const;

export const localizedCategoryNames: Record<
  SiteLanguage,
  Record<string, string>
> = {
  fr: {
    business: "Business",
    comedy: "Comédie",
    culture: "Culture",
    diaspora: "Diaspora",
    drama: "Drama",
    music: "Musique",
    religion: "Religion",
    sport: "Sport",
  },
  en: {
    business: "Business",
    comedy: "Comedy",
    culture: "Culture",
    diaspora: "Diaspora",
    drama: "Drama",
    music: "Music",
    religion: "Religion",
    sport: "Sport",
  },
  am: {
    business: "ቢዝነስ",
    comedy: "ኮሜዲ",
    culture: "ባህል",
    diaspora: "ዲያስፖራ",
    drama: "ድራማ",
    music: "ሙዚቃ",
    religion: "ሃይማኖት",
    sport: "ስፖርት",
  },
};

export const localizedCategoryDescriptions: Record<
  SiteLanguage,
  Record<string, string>
> = {
  fr: {
    business: "Vidéos business, économie et entrepreneuriat éthiopien.",
    comedy: "Sketchs, humour et créations comiques éthiopiennes.",
    culture: "Culture, traditions et histoires éthiopiennes en vidéo.",
    diaspora: "Vidéos de la diaspora éthiopienne et de ses communautés.",
    drama: "Séries, films courts et scènes dramatiques éthiopiennes.",
    music: "Clips, reprises et performances musicales éthiopiennes.",
    religion: "Vidéos religieuses, célébrations et contenus spirituels.",
    sport: "Actualités sportives, compétitions et moments forts.",
  },
  en: {
    business: "Ethiopian business, economy and entrepreneurship videos.",
    comedy: "Ethiopian comedy sketches, humor and creative videos.",
    culture: "Ethiopian culture, traditions and stories in video.",
    diaspora: "Videos from the Ethiopian diaspora and its communities.",
    drama: "Ethiopian drama series, short films and scenes.",
    music: "Ethiopian music videos, covers and performances.",
    religion: "Religious videos, celebrations and spiritual content.",
    sport: "Sports news, competitions and highlights.",
  },
  am: {
    business: "የኢትዮጵያ ቢዝነስ፣ ኢኮኖሚ እና ስራ ፈጠራ ቪዲዮዎች።",
    comedy: "የኢትዮጵያ ኮሜዲ፣ ቀልድ እና ፈጠራ ቪዲዮዎች።",
    culture: "የኢትዮጵያ ባህል፣ ወግ እና ታሪኮች በቪዲዮ።",
    diaspora: "የኢትዮጵያ ዲያስፖራ እና ማህበረሰብ ቪዲዮዎች።",
    drama: "የኢትዮጵያ ድራማ፣ አጫጭር ፊልሞች እና ትዕይንቶች።",
    music: "የኢትዮጵያ የሙዚቃ ክሊፖች፣ ሪፕራይዞች እና ትርዒቶች።",
    religion: "የሃይማኖት ቪዲዮዎች፣ በዓላት እና መንፈሳዊ ይዘቶች።",
    sport: "የስፖርት ዜና፣ ውድድሮች እና ዋና ዋና ክስተቶች።",
  },
};

export function getLocalizedCategoryName(
  language: SiteLanguage,
  slug: string,
  fallback: string,
) {
  return localizedCategoryNames[language][slug] ?? fallback;
}

export function getLocalizedCategoryDescription(
  language: SiteLanguage,
  slug: string,
  fallback?: string | null,
) {
  return localizedCategoryDescriptions[language][slug] ?? fallback ?? "";
}

export const routeSegments = {
  fr: {
    latest: "dernieres-videos",
    trending: "tendances",
    videos: "videos",
    categories: "categories",
    tags: "etiquettes",
    channels: "chaines",
    search: "recherche",
    news: "actualites",
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
    news: "news",
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
    news: "zena",
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
  route:
    | "latest"
    | "trending"
    | "search"
    | "news"
    | "submitVideo"
    | "newsletter",
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
