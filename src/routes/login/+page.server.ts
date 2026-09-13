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

export const load = async ({ url }) => {
  const redirectTo = safeRedirectPath(url.searchParams.get("redirectTo"), "/");

  return {
    redirectTo,
    profileRedirectTo: profileRedirectPath(redirectTo),
    socialProviders: socialProviders(),
  };
};

export const actions = {
  requestOtp: async ({ request }) => {
    const formData = await request.formData();
    const result = emailSchema.safeParse(Object.fromEntries(formData));
    const redirectTo = safeRedirectPath(formData.get("redirectTo"), "/");

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
      profileRedirectTo: profileRedirectPath(redirectTo),
      expiresAt: otp.expiresAt,
      debugCode: otp.debugCode,
    };
  },
  verify: signIn,
  social: signIn,
};
