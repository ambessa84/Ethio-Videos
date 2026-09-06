import { fail } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { fullName, userProfileSchema } from "$lib/server/user-profile";

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

    try {
      await prisma.user.create({
        data: {
          email: profile.email.toLowerCase(),
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
        message: "An account already exists with this email or username.",
        values: Object.fromEntries(formData),
      });
    }

    return {
      success: true,
      message: "Your profile has been created.",
    };
  },
};
