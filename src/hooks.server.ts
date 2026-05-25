import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { defaultLanguage, isSupportedLanguage } from "$lib/i18n";
import { handle as authenticationHandle } from "./auth";

const authorizationHandle: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;

  const session = await event.locals.auth();
  event.locals.isAdmin = Boolean(session?.user);

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!event.locals.isAdmin) {
      throw redirect(303, "/admin/login");
    }
  }

  const language = pathname.split("/").filter(Boolean)[0];

  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace(
        '<html lang="en">',
        `<html lang="${isSupportedLanguage(language) ? language : defaultLanguage}">`,
      ),
  });
};

export const handle: Handle = sequence(
  authenticationHandle,
  authorizationHandle,
);
