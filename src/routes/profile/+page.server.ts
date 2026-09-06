import { redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

export const load = async ({ locals }) => {
  const session = await locals.auth();
  const sessionUser = session?.user as
    | { id?: string; email?: string | null }
    | undefined;
  const userId = sessionUser?.id;
  const email = sessionUser?.email;

  if (!userId && !email) {
    throw redirect(303, "/register");
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
    throw redirect(303, "/register");
  }

  return {
    user,
  };
};
