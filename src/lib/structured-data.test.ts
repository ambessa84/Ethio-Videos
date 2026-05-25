import { describe, expect, it } from "vitest";
import {
  buildJsonLdScriptTag,
  buildVideoStructuredDataJson,
} from "./structured-data";

describe("buildVideoStructuredDataJson", () => {
  it("returns valid JSON-LD for a video", () => {
    const json = buildVideoStructuredDataJson({
      title: "Localized title",
      description: "Localized description",
      thumbnailUrl: "https://img.youtube.com/vi/video-id/hqdefault.jpg",
      publishedAt: "2026-01-01T00:00:00.000Z",
      youtubeVideoId: "video-id",
    });

    const parsed = JSON.parse(json);

    expect(parsed).toEqual({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: "Localized title",
      description: "Localized description",
      thumbnailUrl: ["https://img.youtube.com/vi/video-id/hqdefault.jpg"],
      uploadDate: "2026-01-01T00:00:00.000Z",
      embedUrl: "https://www.youtube.com/embed/video-id",
    });
  });

  it("does not emit invalid thumbnail data when the video has no thumbnail", () => {
    const json = buildVideoStructuredDataJson({
      title: "Title",
      description: "Description",
      thumbnailUrl: null,
      publishedAt: null,
      youtubeVideoId: "video-id",
    });

    const parsed = JSON.parse(json);

    expect(parsed.thumbnailUrl).toBeUndefined();
    expect(parsed.embedUrl).toBe("https://www.youtube.com/embed/video-id");
  });

  it("escapes content so it can be injected as raw JSON in a JSON-LD script", () => {
    const json = buildVideoStructuredDataJson({
      title: 'Title with "quotes"',
      description: "Description with newline\nand slash /",
      youtubeVideoId: "video-id",
    });

    expect(() => JSON.parse(json)).not.toThrow();
    expect(json).toContain('\\"quotes\\"');
  });

  it("builds a complete JSON-LD script tag without Svelte directives", () => {
    const json = buildVideoStructuredDataJson({
      title: "Title",
      description: "Description",
      youtubeVideoId: "video-id",
    });
    const scriptTag = buildJsonLdScriptTag(json);

    expect(scriptTag).toContain('<script type="application/ld+json">');
    expect(scriptTag).toContain("</script>");
    expect(scriptTag).not.toContain("{@html");
    expect(scriptTag).not.toContain("{JSON.stringify");
    expect(JSON.parse(scriptTag.match(/>(.*)<\/script>/)?.[1] ?? "")).toEqual(
      JSON.parse(json),
    );
  });

  it("escapes closing script tags in JSON-LD content", () => {
    const json = buildVideoStructuredDataJson({
      title: "</script><script>alert(1)</script>",
      description: "Description",
      youtubeVideoId: "video-id",
    });
    const scriptTag = buildJsonLdScriptTag(json);

    expect(scriptTag).not.toContain("</script><script>");
    expect(scriptTag).toContain("\\u003c/script>");
  });
});
