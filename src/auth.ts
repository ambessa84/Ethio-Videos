import { env } from "$env/dynamic/private";
import { SvelteKitAuth } from "@auth/sveltekit";
import Credentials from "@auth/sveltekit/providers/credentials";
import { verifyEmailOtp } from "$lib/server/email-otp";

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
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "USER";
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { role?: string }).role =
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
