import { env } from "$env/dynamic/private";
import { SvelteKitAuth } from "@auth/sveltekit";
import Credentials from "@auth/sveltekit/providers/credentials";
import Facebook from "@auth/sveltekit/providers/facebook";
import Google from "@auth/sveltekit/providers/google";
import LinkedIn from "@auth/sveltekit/providers/linkedin";
import MicrosoftEntraID from "@auth/sveltekit/providers/microsoft-entra-id";
import TikTok from "@auth/sveltekit/providers/tiktok";
import { verifyEmailOtp } from "$lib/server/email-otp";
import { prisma } from "$lib/server/prisma";

function configuredOAuthProviders() {
  const providers = [];

  if (env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET) {
    providers.push(
      Google({
        clientId: env.AUTH_GOOGLE_ID,
        clientSecret: env.AUTH_GOOGLE_SECRET,
      }),
    );
  }

  if (env.AUTH_FACEBOOK_ID && env.AUTH_FACEBOOK_SECRET) {
    providers.push(
      Facebook({
        clientId: env.AUTH_FACEBOOK_ID,
        clientSecret: env.AUTH_FACEBOOK_SECRET,
      }),
    );
  }

  if (env.AUTH_TIKTOK_ID && env.AUTH_TIKTOK_SECRET) {
    providers.push(
      TikTok({
        clientId: env.AUTH_TIKTOK_ID,
        clientSecret: env.AUTH_TIKTOK_SECRET,
      }),
    );
  }

  if (env.AUTH_LINKEDIN_ID && env.AUTH_LINKEDIN_SECRET) {
    providers.push(
      LinkedIn({
        clientId: env.AUTH_LINKEDIN_ID,
        clientSecret: env.AUTH_LINKEDIN_SECRET,
      }),
    );
  }

  if (env.AUTH_MICROSOFT_ENTRA_ID_ID && env.AUTH_MICROSOFT_ENTRA_ID_SECRET) {
    providers.push(
      MicrosoftEntraID({
        clientId: env.AUTH_MICROSOFT_ENTRA_ID_ID,
        clientSecret: env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      }),
    );
  }

  return providers;
}

async function availableSocialUsername(seed: string) {
  const [prefix] = seed.toLowerCase().split("@");
  const base = prefix.replace(/[^a-z0-9_-]/g, "").slice(0, 32) || "user";
  let candidate = base;
  let suffix = 1;

  while (
    await prisma.user.findUnique({
      where: {
        username: candidate,
      },
      select: {
        id: true,
      },
    })
  ) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function splitDisplayName(name: string | null | undefined) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  return {
    firstName: parts[0] ?? null,
    lastName: parts.slice(1).join(" ") || null,
  };
}

async function syncOAuthUser({
  provider,
  providerAccountId,
  email,
  image,
  name,
}: {
  provider: string;
  providerAccountId: string;
  email?: string | null;
  image?: string | null;
  name?: string | null;
}) {
  const normalizedEmail = email?.toLowerCase() ?? null;
  const profileName = splitDisplayName(name);
  const existingUser =
    (normalizedEmail
      ? await prisma.user.findUnique({
          where: {
            email: normalizedEmail,
          },
        })
      : null) ??
    (await prisma.user.findFirst({
      where: {
        socialProvider: provider,
        socialAccountId: providerAccountId,
      },
    }));

  if (existingUser) {
    return prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        email: normalizedEmail ?? existingUser.email,
        emailVerified: existingUser.emailVerified ?? new Date(),
        image: image ?? existingUser.image,
        name: name ?? existingUser.name,
        socialProvider: provider,
        socialAccountId: providerAccountId,
      },
    });
  }

  return prisma.user.create({
    data: {
      email: normalizedEmail,
      emailVerified: normalizedEmail ? new Date() : null,
      firstName: profileName.firstName,
      lastName: profileName.lastName,
      image,
      name,
      socialProvider: provider,
      socialAccountId: providerAccountId,
      username: await availableSocialUsername(
        normalizedEmail ?? `${provider}-${providerAccountId}`,
      ),
    },
  });
}

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [
    Credentials({
      credentials: {
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        const password = String(credentials.password ?? "");

        if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) {
          return null;
        }

        return {
          id: "admin",
          name: "Admin",
          role: "ADMIN",
        };
      },
    }),
    Credentials({
      id: "email-otp",
      name: "Email code",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        const email = String(credentials.email ?? "");
        const code = String(credentials.code ?? "");
        const user = await verifyEmailOtp(email, code);

        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
    ...configuredOAuthProviders(),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "USER";
      }

      if (user && account && account.type !== "credentials") {
        const syncedUser = await syncOAuthUser({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          email: user.email,
          image: user.image,
          name: user.name,
        });

        token.sub = syncedUser.id;
        token.email = syncedUser.email;
        token.name = syncedUser.name;
        token.picture = syncedUser.image;
        token.role = syncedUser.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & {
          id?: string;
          role?: string;
        };
        if (token.sub) {
          sessionUser.id = token.sub;
        }
        sessionUser.role =
          typeof token.role === "string" ? token.role : "USER";
      }

      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  secret: env.AUTH_SECRET,
  trustHost: true,
});
