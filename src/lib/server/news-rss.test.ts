import { describe, expect, it } from "vitest";
import { parseRssFeed } from "./news-rss";

describe("parseRssFeed", () => {
  it("extracts WordPress RSS items", () => {
    const items = parseRssFeed(`
      <rss><channel>
        <item>
          <title><![CDATA[News: Ethiopia update]]></title>
          <link>https://addisstandard.com/news-ethiopia-update/?utm_source=rss&amp;utm_medium=rss</link>
          <description><![CDATA[<p>A short summary &amp; context.</p>]]></description>
          <dc:creator><![CDATA[Addis Standard Staff]]></dc:creator>
          <pubDate>Fri, 06 Feb 2026 10:00:00 +0000</pubDate>
          <media:content url="https://addisstandard.com/image.jpg" />
        </item>
      </channel></rss>
    `);

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      title: "News: Ethiopia update",
      sourceUrl: "https://addisstandard.com/news-ethiopia-update/",
      excerpt: "A short summary & context.",
      imageUrl: "https://addisstandard.com/image.jpg",
      author: "Addis Standard Staff",
    });
    expect(items[0].publishedAt?.toISOString()).toBe(
      "2026-02-06T10:00:00.000Z",
    );
  });

  it("skips incomplete items", () => {
    const items = parseRssFeed(`
      <rss><channel>
        <item><title>No link</title></item>
        <item><link>https://addisstandard.com/no-title/</link></item>
      </channel></rss>
    `);

    expect(items).toEqual([]);
  });
});
