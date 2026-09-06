import { createSlug } from "./slug";

export type WordPressPost = {
  id: number;
  link?: string;
  date_gmt?: string;
  title?: {
    rendered?: string;
  };
  excerpt?: {
    rendered?: string;
  };
};

export function stripRenderedHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();
}

export function wordpressPostsEndpoint(feedUrl: string) {
  const url = new URL(feedUrl);
  url.pathname = "/wp-json/wp/v2/posts";
  url.search = new URLSearchParams({
    per_page: "20",
    _fields: "id,link,date_gmt,title,excerpt",
  }).toString();
  url.hash = "";

  return url.toString();
}

export function parseWordPressPosts(posts: WordPressPost[]) {
  return posts
    .map((post) => {
      const title = stripRenderedHtml(post.title?.rendered ?? "");
      const sourceUrl = post.link;

      if (!title || !sourceUrl) return null;

      return {
        title,
        sourceUrl,
        slug: `${createSlug(title) || "article"}-${post.id}`.slice(0, 180),
        excerpt: stripRenderedHtml(post.excerpt?.rendered ?? "") || undefined,
        publishedAt: post.date_gmt ? new Date(`${post.date_gmt}Z`) : undefined,
      };
    })
    .filter((post) => post !== null);
}
