import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import { z } from "zod";
import { signIn } from "../../auth";
import { createEmailOtp } from "$lib/server/email-otp";
import { prisma } from "$lib/server/prisma";
import {
  profileRedirectPath,
  safeRedirectPath,
} from "$lib/server/redirect";
import { getLocalizedStaticPath, normalizeSiteLanguage } from "$lib/i18n";

const emailSchema = z.object({
  email: z.string().trim().email("A valid email is required.").max(160),
});

function socialProviders() {
  return [
    env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
      ? { id: "google", label: "Google" }
      : null,
    env.AUTH_FACEBOOK_ID && env.AUTH_FACEBOOK_SECRET
      ? { id: "facebook", label: "Facebook" }
      : null,
    env.AUTH_TIKTOK_ID && env.AUTH_TIKTOK_SECRET
      ? { id: "tiktok", label: "TikTok" }
      : null,
    env.AUTH_LINKEDIN_ID && env.AUTH_LINKEDIN_SECRET
      ? { id: "linkedin", label: "LinkedIn" }
      : null,
    env.AUTH_MICROSOFT_ENTRA_ID_ID && env.AUTH_MICROSOFT_ENTRA_ID_SECRET
      ? { id: "microsoft-entra-id", label: "Hotmail / Microsoft" }
      : null,
  ].filter((provider) => provider !== null);
}

function loginContext(params?: { lang?: string }) {
  const language = params?.lang ? normalizeSiteLanguage(params.lang) : null;

  return {
    defaultRedirectTo: language ? `/${language}` : "/",
    profilePath: language
      ? getLocalizedStaticPath(language, "profile")
      : "/profile",
  };
}

export const load = async ({ params, url }) => {
  const context = loginContext(params);
  const redirectTo = safeRedirectPath(
    url.searchParams.get("redirectTo"),
    context.defaultRedirectTo,
  );

  return {
    redirectTo,
    profileRedirectTo: profileRedirectPath(redirectTo, context.profilePath),
    socialProviders: socialProviders(),
  };
};

export const actions = {
  requestOtp: async ({ params, request }) => {
    const context = loginContext(params);
    const formData = await request.formData();
    const result = emailSchema.safeParse(Object.fromEntries(formData));
    const redirectTo = safeRedirectPath(
      formData.get("redirectTo"),
      context.defaultRedirectTo,
    );

    if (!result.success) {
      return fail(400, {
        message: result.error.issues[0]?.message ?? "Invalid email.",
        values: Object.fromEntries(formData),
      });
    }

    const email = result.data.email.toLowerCase();

    await prisma.user.upsert({
      where: {
        email,
      },
      update: {},
      create: {
        email,
      },
    });

    const otp = await createEmailOtp(email);

    return {
      success: true,
      message: "Saisissez le code envoye a votre email.",
      email,
      redirectTo,
      profileRedirectTo: profileRedirectPath(redirectTo, context.profilePath),
      expiresAt: otp.expiresAt,
      debugCode: otp.debugCode,
    };
  },
  verify: signIn,
  social: signIn,
};
