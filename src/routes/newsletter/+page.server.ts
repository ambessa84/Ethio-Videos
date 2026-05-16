import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  language: z.string().optional()
});

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const parsed = schema.safeParse({
      email: String(formData.get('email') ?? ''),
      language: String(formData.get('language') ?? '')
    });

    if (!parsed.success) {
      return fail(400, {
        message: 'Please provide a valid email.'
      });
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: { language: parsed.data.language || null },
      create: {
        email: parsed.data.email,
        language: parsed.data.language || null
      }
    });

    return { success: true };
  }
};
