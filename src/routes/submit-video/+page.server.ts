import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { z } from 'zod';

const schema = z.object({
  youtubeUrl: z.string().url(),
  category: z.string().optional(),
  language: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().max(1000).optional()
});

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();

    const parsed = schema.safeParse({
      youtubeUrl: String(formData.get('youtubeUrl') ?? ''),
      category: String(formData.get('category') ?? ''),
      language: String(formData.get('language') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? '')
    });

    if (!parsed.success) {
      return fail(400, {
        message: 'Please provide a valid YouTube URL.'
      });
    }

    await prisma.videoSuggestion.create({
      data: {
        youtubeUrl: parsed.data.youtubeUrl,
        category: parsed.data.category || null,
        language: parsed.data.language || null,
        email: parsed.data.email || null,
        message: parsed.data.message || null
      }
    });

    return { success: true };
  }
};
