import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { prisma } from "$lib/server/prisma";
import { signIn } from "../../auth";
import { createEmailOtp } from "$lib/server/email-otp";
import { fullName, userProfileSchema } from "$lib/server/user-profile";

export const load = async () => ({
  socialProviders: [
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
  ].filter((provider) => provider !== null),
});

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const result = userProfileSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
      return fail(400, {
        message: result.error.issues[0]?.message ?? "Invalid profile.",
        values: Object.fromEntries(formData),
      });
    }

    const profile = result.data;
    const birthDate = profile.birthDate ? new Date(profile.birthDate) : null;
    const normalizedEmail = profile.email.toLowerCase();

    try {
      await prisma.user.upsert({
        where: {
          email: normalizedEmail,
        },
        update: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          name: fullName(profile),
          birthDate,
          address: profile.address || null,
          username: profile.username,
          image: profile.image || null,
          avatar: profile.avatar,
        },
        create: {
          email: normalizedEmail,
          firstName: profile.firstName,
          lastName: profile.lastName,
          name: fullName(profile),
          birthDate,
          address: profile.address || null,
          username: profile.username,
          image: profile.image || null,
          avatar: profile.avatar,
        },
      });
    } catch {
      return fail(409, {
        message: "This username is already used.",
        values: Object.fromEntries(formData),
      });
    }

    const otp = await createEmailOtp(normalizedEmail);

    return {
      success: true,
      message: "Enter the code sent to your email to validate your account.",
      email: normalizedEmail,
      expiresAt: otp.expiresAt,
      debugCode: otp.debugCode,
    };
  },
  verify: signIn,
  social: signIn,
};
