import { describe, expect, it } from "vitest";
import { getVideoMetadataForLanguage, localizeVideo } from "./localized-videos";

const baseVideo = {
  slug: "original-video",
  title: "Original video",
  summary: "Legacy public summary",
  description: "Original description",
  aiMetadata: [
    {
      language: "fr",
      localizedStatus: "PUBLISHED",
      publishedAt: new Date("2026-01-01T00:00:00.000Z"),
      slug: "video-fr",
      shortSummary: "Resume FR",
      longSummary: "Resume long FR",
      seoTitle: "Titre FR",
      seoDescription: "Description FR",
    },
    {
      language: "en",
      localizedStatus: "DRAFT",
      publishedAt: null,
      slug: "video-en",
      shortSummary: "English draft summary",
      longSummary: "English draft long summary",
      seoTitle: "English draft title",
      seoDescription: "English draft description",
    },
  ],
};

describe("localized videos", () => {
  it("uses published metadata for the requested language", () => {
    const localized = localizeVideo(baseVideo, "fr");

    expect(localized.localizedSlug).toBe("video-fr");
    expect(localized.localizedTitle).toBe("Titre FR");
    expect(localized.localizedSummary).toBe("Resume FR");
    expect(localized.localizedDescription).toBe("Description FR");
    expect(localized.localizedLongSummary).toBe("Resume long FR");
  });

  it("ignores draft metadata for the requested language", () => {
    expect(getVideoMetadataForLanguage(baseVideo, "en")).toBeUndefined();

    const localized = localizeVideo(baseVideo, "en");

    expect(localized.localizedSlug).toBe("original-video");
    expect(localized.localizedTitle).toBe("Original video");
    expect(localized.localizedSummary).toBeNull();
    expect(localized.localizedDescription).toBe("Original description");
    expect(localized.localizedLongSummary).toBeNull();
  });

  it("does not fallback to the legacy public summary for another language", () => {
    const localized = localizeVideo(
      { ...baseVideo, description: null, aiMetadata: [] },
      "am",
    );

    expect(localized.localizedSummary).toBeNull();
    expect(localized.localizedDescription).toBe("Original video");
  });
});
