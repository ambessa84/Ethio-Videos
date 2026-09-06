import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { defaultLanguage, isSupportedLanguage } from "$lib/i18n";
import { handle as authenticationHandle } from "./auth";

const authorizationHandle: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;

  const session = await event.locals.auth();
  const sessionUser = session?.user as { role?: string } | undefined;
  event.locals.isAuthenticated = Boolean(sessionUser);
  event.locals.isAdmin = sessionUser?.role === "ADMIN";

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!event.locals.isAdmin) {
      throw redirect(303, "/admin/login");
    }
  }

  const submitRouteSegments = new Set([
    "proposer-video",
    "submit-video",
    "video-lak",
  ]);
  const routeSegments = pathname.split("/").filter(Boolean);

  if (
    routeSegments.some((segment) => submitRouteSegments.has(segment)) &&
    !event.locals.isAdmin
  ) {
    throw redirect(303, "/admin/login");
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
