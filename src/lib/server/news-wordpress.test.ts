import { describe, expect, it } from "vitest";
import { parseWordPressPosts, wordpressPostsEndpoint } from "./news-wordpress";

describe("wordpressPostsEndpoint", () => {
  it("builds a public posts endpoint from a feed URL", () => {
    expect(wordpressPostsEndpoint("https://addisstandard.com/feed/")).toBe(
      "https://addisstandard.com/wp-json/wp/v2/posts?per_page=20&_fields=id%2Clink%2Cdate_gmt%2Ctitle%2Cexcerpt",
    );
  });
});

describe("parseWordPressPosts", () => {
  it("maps rendered WordPress posts to news items", () => {
    const items = parseWordPressPosts([
      {
        id: 123,
        link: "https://addisstandard.com/example-story/",
        date_gmt: "2026-09-06T10:30:00",
        title: {
          rendered: "Example &amp; story",
        },
        excerpt: {
          rendered: "<p>A concise <strong>summary</strong>.</p>",
        },
      },
    ]);

    expect(items).toEqual([
      {
        title: "Example & story",
        sourceUrl: "https://addisstandard.com/example-story/",
        slug: "example-and-story-123",
        excerpt: "A concise summary.",
        publishedAt: new Date("2026-09-06T10:30:00.000Z"),
      },
    ]);
  });
});
