import { describe, expect, it } from "vitest";
import { getMissingLocalizedPublicationFields } from "./localized-publication";

describe("getMissingLocalizedPublicationFields", () => {
  it("requires metadata before localized publication", () => {
    expect(getMissingLocalizedPublicationFields(null)).toEqual(["AI metadata"]);
  });

  it("returns missing SEO fields needed for the public localized page", () => {
    expect(
      getMissingLocalizedPublicationFields({
        slug: "video-fr",
        shortSummary: "",
        seoTitle: "Titre FR",
        seoDescription: null,
      }),
    ).toEqual(["short summary", "SEO description"]);
  });

  it("allows publication when required localized fields are present", () => {
    expect(
      getMissingLocalizedPublicationFields({
        slug: "video-fr",
        shortSummary: "Resume court",
        seoTitle: "Titre FR",
        seoDescription: "Description FR",
      }),
    ).toEqual([]);
  });
});
