import { fail, isRedirect, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import {
  editableUserProfileSchema,
  fullName,
  missingProfileFields,
} from "$lib/server/user-profile";
import { safeRedirectPath } from "$lib/server/redirect";
import { getLocalizedStaticPath, normalizeSiteLanguage } from "$lib/i18n";

function profileContext(params?: { lang?: string }) {
  const language = params?.lang ? normalizeSiteLanguage(params.lang) : null;

  return {
    defaultRedirectTo: language ? `/${language}` : "/",
    loginPath: language ? getLocalizedStaticPath(language, "login") : "/login",
  };
}

export const load = async ({ locals, params, url }) => {
  const context = profileContext(params);
  const session = await locals.auth();
  const sessionUser = session?.user as
    | { id?: string; email?: string | null }
    | undefined;
  const userId = sessionUser?.id;
  const email = sessionUser?.email;

  if (!userId && !email) {
    throw redirect(
      303,
      `${context.loginPath}?redirectTo=${encodeURIComponent(url.pathname + url.search)}`,
    );
  }

  const user = userId
    ? await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          email: true,
          emailVerified: true,
          firstName: true,
          lastName: true,
          name: true,
          birthDate: true,
          address: true,
          username: true,
          image: true,
          avatar: true,
          role: true,
        },
      })
    : await prisma.user.findUnique({
        where: {
          email: email!.toLowerCase(),
        },
        select: {
          email: true,
          emailVerified: true,
          firstName: true,
          lastName: true,
          name: true,
          birthDate: true,
          address: true,
          username: true,
          image: true,
          avatar: true,
          role: true,
        },
      });

  if (!user) {
    throw redirect(303, context.loginPath);
  }

  return {
    missingFields: missingProfileFields(user),
    redirectTo: safeRedirectPath(
      url.searchParams.get("redirectTo"),
      context.defaultRedirectTo,
    ),
    user,
  };
};

export const actions = {
  default: async ({ locals, params, request }) => {
    const context = profileContext(params);
    const session = await locals.auth();
    const sessionUser = session?.user as { id?: string } | undefined;

    if (!sessionUser?.id) {
      throw redirect(303, context.loginPath);
    }

    const formData = await request.formData();
    const redirectTo = safeRedirectPath(
      formData.get("redirectTo"),
      context.defaultRedirectTo,
    );
    const intent = String(formData.get("intent") ?? "save");
    const result = editableUserProfileSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!result.success) {
      return fail(400, {
        message: result.error.issues[0]?.message ?? "Invalid profile.",
        redirectTo,
        values: Object.fromEntries(formData),
      });
    }

    const profile = result.data;
    const firstName = profile.firstName || null;
    const lastName = profile.lastName || null;
    const name =
      firstName || lastName
        ? fullName({
            firstName: firstName ?? "",
            lastName: lastName ?? "",
          })
        : null;

    try {
      const user = await prisma.user.update({
        where: {
          id: sessionUser.id,
        },
        data: {
          firstName,
          lastName,
          name,
          birthDate: profile.birthDate ? new Date(profile.birthDate) : null,
          address: profile.address || null,
          username: profile.username || null,
          image: profile.image || null,
          avatar: profile.avatar,
        },
        select: {
          email: true,
          emailVerified: true,
          firstName: true,
          lastName: true,
          name: true,
          birthDate: true,
          address: true,
          username: true,
          image: true,
          avatar: true,
          role: true,
        },
      });

      if (intent === "continue") {
        throw redirect(303, redirectTo);
      }

      return {
        success: true,
        missingFields: missingProfileFields(user),
        message: "Profil mis a jour.",
        redirectTo,
        user,
      };
    } catch (error) {
      if (isRedirect(error)) throw error;

      return fail(409, {
        message: "This username is already used.",
        redirectTo,
        values: Object.fromEntries(formData),
      });
    }
  },
};
