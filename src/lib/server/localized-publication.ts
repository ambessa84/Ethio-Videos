type PublishableMetadata = {
  slug: string | null;
  shortSummary: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
} | null;

export function getMissingLocalizedPublicationFields(
  metadata: PublishableMetadata,
) {
  if (!metadata) {
    return ["AI metadata"];
  }

  return [
    [metadata.slug, "localized slug"],
    [metadata.shortSummary, "short summary"],
    [metadata.seoTitle, "SEO title"],
    [metadata.seoDescription, "SEO description"],
  ]
    .filter(([value]) => !value)
    .map(([, label]) => label);
}
