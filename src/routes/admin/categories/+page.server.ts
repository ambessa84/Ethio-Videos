import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { createSlug } from '$lib/server/slug';

export const load = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { videos: true }
      }
    }
  });

  return { categories };
};

export const actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    const name = String(formData.get('name') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();

    if (!name) {
      return fail(400, { message: 'Name is required.' });
    }

    await prisma.category.create({
      data: {
        name,
        slug: createSlug(name),
        description: description || null
      }
    });

    return { success: true };
  }
};
