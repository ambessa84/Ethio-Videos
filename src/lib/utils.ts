export function formatNumber(value?: number | null) {
  if (value == null) return null;
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

export function formatDate(value?: string | Date | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function siteUrl(path = "") {
  const base = import.meta.env.PUBLIC_SITE_URL || "http://localhost:5173";
  return `${base}${path}`;
}
