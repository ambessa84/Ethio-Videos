import { redirect } from "@sveltejs/kit";
import { normalizeSiteLanguage } from "$lib/i18n";
import { safeRedirectPath } from "$lib/server/redirect";

export const load = ({ params, url }) => {
  const language = normalizeSiteLanguage(params.lang);
  const redirectTo = safeRedirectPath(
    url.searchParams.get("redirectTo"),
    `/${language}`,
  );
  const searchParams = new URLSearchParams({
    redirectTo,
  });

  throw redirect(303, `/login?${searchParams.toString()}`);
};
