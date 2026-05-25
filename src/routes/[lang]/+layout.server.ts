import { error } from "@sveltejs/kit";
import { isSupportedLanguage, normalizeSiteLanguage } from "$lib/i18n";

export const load = async ({ params }) => {
  if (!isSupportedLanguage(params.lang)) {
    throw error(404, "Language not found");
  }

  return {
    lang: normalizeSiteLanguage(params.lang),
  };
};
