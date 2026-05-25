import { describe, expect, it } from "vitest";
import {
  defaultLanguage,
  getLocalizedCategoryPath,
  getLocalizedStaticPath,
  getLocalizedPath,
  getLocalizedVideoPath,
  normalizeSiteLanguage,
} from "./i18n";

describe("normalizeSiteLanguage", () => {
  it("keeps supported languages", () => {
    expect(normalizeSiteLanguage("fr")).toBe("fr");
    expect(normalizeSiteLanguage("EN")).toBe("en");
    expect(normalizeSiteLanguage("am")).toBe("am");
  });

  it("falls back to the default language", () => {
    expect(normalizeSiteLanguage(undefined)).toBe(defaultLanguage);
    expect(normalizeSiteLanguage("de")).toBe(defaultLanguage);
  });
});

describe("localized paths", () => {
  it("builds localized video paths with SEO slugs", () => {
    expect(getLocalizedVideoPath("en", "ethiopian-music-cover")).toBe(
      "/en/videos/ethiopian-music-cover",
    );
  });

  it("builds translated static paths", () => {
    expect(getLocalizedStaticPath("fr", "trending")).toBe("/fr/tendances");
    expect(getLocalizedStaticPath("fr", "latest")).toBe("/fr/dernieres-videos");
    expect(getLocalizedStaticPath("am", "search")).toBe("/am/felgi");
  });

  it("builds translated taxonomy paths", () => {
    expect(getLocalizedCategoryPath("fr", "music")).toBe(
      "/fr/categories/music",
    );
    expect(getLocalizedCategoryPath("am", "music")).toBe("/am/kifloch/music");
  });

  it("replaces an existing language prefix", () => {
    expect(getLocalizedPath("fr", "/en/latest")).toBe("/fr/dernieres-videos");
  });

  it("translates known route segments when switching language", () => {
    expect(getLocalizedPath("en", "/fr/tendances")).toBe("/en/trending");
    expect(getLocalizedPath("fr", "/en/channels/channel-name")).toBe(
      "/fr/chaines/channel-name",
    );
    expect(getLocalizedPath("am", "/fr/etiquettes/music")).toBe(
      "/am/miliktoch/music",
    );
  });

  it("adds a language prefix to legacy paths", () => {
    expect(getLocalizedPath("am", "/video/example")).toBe("/am/video/example");
  });
});
