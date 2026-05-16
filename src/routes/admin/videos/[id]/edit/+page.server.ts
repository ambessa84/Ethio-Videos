import { error, fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { createSlug } from '$lib/server/slug';

export const load = async ({ params }) => {
  const [video, categories] = await Promise.all([
    prisma.video.findUnique({
      where: { id: params.id },
      include: { channel: true, category: true }
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ]);

  if (!video) {
    throw error(404, 'Video not found');
  }

  return { video, categories };
};

export const actions = {
  save: async ({ request, params }) => {
    const formData = await request.formData();

    const title = String(formData.get('title') ?? '').trim();
    const slug = String(formData.get('slug') ?? '').trim();
    const summary = String(formData.get('summary') ?? '');
    const categoryId = String(formData.get('categoryId') ?? '');
    const language = String(formData.get('language') ?? '');
    const status = String(formData.get('status') ?? 'DRAFT');
    const isFeatured = formData.get('isFeatured') === 'on';

    if (!title) {
      return fail(400, { message: 'Title is required.' });
    }

    await prisma.video.update({
      where: { id: params.id },
      data: {
        title,
        slug: slug || createSlug(title),
        summary: summary || null,
        categoryId: categoryId || null,
        language: language || null,
        status: status === 'PUBLISHED' ? 'PUBLISHED' : status === 'ARCHIVED' ? 'ARCHIVED' : 'DRAFT',
        isFeatured
      }
    });

    return { success: true };
  },

  delete: async ({ params }) => {
    await prisma.video.delete({
      where: { id: params.id }
    });

    throw redirect(303, '/admin/videos');
  }
};
