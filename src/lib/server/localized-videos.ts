import type { SiteLanguage } from "$lib/i18n";

type AiMetadata = {
  language: string;
  slug: string | null;
  shortSummary: string | null;
  longSummary: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  localizedStatus?: string;
  publishedAt?: Date | string | null;
};

type LocalizableVideo = {
  slug: string;
  title: string;
  summary?: string | null;
  description?: string | null;
  aiMetadata?: AiMetadata[];
};

export function getVideoMetadataForLanguage(
  video: LocalizableVideo,
  language: SiteLanguage,
) {
  return video.aiMetadata?.find(
    (metadata) =>
      metadata.language === language &&
      metadata.localizedStatus === "PUBLISHED",
  );
}

export function localizeVideo<T extends LocalizableVideo>(
  video: T,
  language: SiteLanguage,
) {
  const metadata = getVideoMetadataForLanguage(video, language);

  return {
    ...video,
    localizedSlug: metadata?.slug || video.slug,
    localizedTitle: metadata?.seoTitle || video.title,
    localizedSummary: metadata?.shortSummary || null,
    localizedDescription:
      metadata?.seoDescription ||
      metadata?.shortSummary ||
      video.description ||
      video.title,
    localizedLongSummary: metadata?.longSummary || null,
  };
}

export function includeAiMetadata(language: SiteLanguage) {
  return {
    where: { language, localizedStatus: "PUBLISHED" as const },
    select: {
      language: true,
      slug: true,
      shortSummary: true,
      longSummary: true,
      seoTitle: true,
      seoDescription: true,
      localizedStatus: true,
      publishedAt: true,
    },
  };
}

export function hasPublishedMetadata(language: SiteLanguage) {
  return {
    some: {
      language,
      localizedStatus: "PUBLISHED" as const,
    },
  };
}
