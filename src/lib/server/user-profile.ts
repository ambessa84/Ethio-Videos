import { z } from "zod";
import { avatarOptions } from "$lib/user-profile";

export const userProfileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(80),
  lastName: z.string().trim().min(1, "Last name is required.").max(80),
  birthDate: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || null)
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
      message: "Birth date is invalid.",
    }),
  email: z.string().trim().email("A valid email is required.").max(160),
  address: z.string().trim().max(240).optional().default(""),
  username: z
    .string()
    .trim()
    .min(3, "Username must contain at least 3 characters.")
    .max(40)
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can contain letters, numbers, _ and -."),
  image: z
    .string()
    .trim()
    .url("Profile photo must be a valid URL.")
    .optional()
    .or(z.literal(""))
    .default(""),
  avatar: z.enum(avatarOptions).default("classic"),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;

export function fullName(profile: Pick<UserProfileInput, "firstName" | "lastName">) {
  return `${profile.firstName} ${profile.lastName}`.trim();
}
