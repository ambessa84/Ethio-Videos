import { env } from "$env/dynamic/private";

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

export const load = async () => ({
  socialProviders: socialProviders(),
});
