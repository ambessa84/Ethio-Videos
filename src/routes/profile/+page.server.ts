import { fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import {
  editableUserProfileSchema,
  fullName,
} from "$lib/server/user-profile";

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

export const actions = {
  default: async ({ locals, request }) => {
    const session = await locals.auth();
    const sessionUser = session?.user as { id?: string } | undefined;

    if (!sessionUser?.id) {
      throw redirect(303, "/login");
    }

    const formData = await request.formData();
    const result = editableUserProfileSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!result.success) {
      return fail(400, {
        message: result.error.issues[0]?.message ?? "Invalid profile.",
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

      return {
        success: true,
        message: "Profil mis a jour.",
        user,
      };
    } catch {
      return fail(409, {
        message: "This username is already used.",
        values: Object.fromEntries(formData),
      });
    }
  },
};
