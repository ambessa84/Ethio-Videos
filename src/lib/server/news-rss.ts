import { createSlug } from "$lib/server/slug";

export type ParsedNewsItem = {
  title: string;
  sourceUrl: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: Date;
};

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .trim();
}

function stripHtml(value: string) {
  return decodeXml(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTagValue(xml: string, tagName: string) {
  const match = xml.match(
    new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, "i"),
  );

  return match ? decodeXml(match[1]) : undefined;
}

function getAttributeValue(xml: string, tagName: string, attribute: string) {
  const match = xml.match(
    new RegExp(
      `<${tagName}\\b[^>]*\\s${attribute}=["']([^"']+)["'][^>]*>`,
      "i",
    ),
  );

  return match ? decodeXml(match[1]) : undefined;
}

function canonicalizeUrl(value: string) {
  const url = new URL(value);

  for (const key of [...url.searchParams.keys()]) {
    if (
      key.startsWith("utm_") ||
      ["fbclid", "gclid", "mc_cid", "mc_eid"].includes(key)
    ) {
      url.searchParams.delete(key);
    }
  }

  url.hash = "";
  return url.toString();
}

function parseDate(value?: string) {
  if (!value) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function createArticleSlug(title: string, sourceUrl: string) {
  const titleSlug = createSlug(title) || "article";
  const url = new URL(sourceUrl);
  const urlToken = createSlug(
    url.pathname.split("/").filter(Boolean).at(-1) || url.hostname,
  );

  return `${titleSlug}-${urlToken}`.slice(0, 180);
}

export function parseRssFeed(xml: string): ParsedNewsItem[] {
  const itemMatches = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];

  return itemMatches
    .map((itemXml): ParsedNewsItem | null => {
      const title = getTagValue(itemXml, "title");
      const link = getTagValue(itemXml, "link") || getTagValue(itemXml, "guid");

      if (!title || !link) {
        return null;
      }

      const sourceUrl = canonicalizeUrl(link);
      const excerpt = stripHtml(
        getTagValue(itemXml, "description") ||
          getTagValue(itemXml, "content:encoded") ||
          "",
      );
      const imageUrl =
        getAttributeValue(itemXml, "media:content", "url") ||
        getAttributeValue(itemXml, "media:thumbnail", "url") ||
        getAttributeValue(itemXml, "enclosure", "url");

      return {
        title,
        sourceUrl,
        slug: createArticleSlug(title, sourceUrl),
        excerpt: excerpt || undefined,
        imageUrl,
        author:
          getTagValue(itemXml, "dc:creator") || getTagValue(itemXml, "author"),
        publishedAt: parseDate(getTagValue(itemXml, "pubDate")),
      };
    })
    .filter((item): item is ParsedNewsItem => item !== null);
}
