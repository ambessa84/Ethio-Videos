import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const password = String(formData.get('password') ?? '');

    if (!env.ADMIN_PASSWORD) {
      return fail(500, {
        message: 'ADMIN_PASSWORD is not configured.'
      });
    }

    if (password !== env.ADMIN_PASSWORD) {
      return fail(400, {
        message: 'Incorrect password.'
      });
    }

    cookies.set('admin_session', 'true', {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7
    });

    throw redirect(303, '/admin');
  }
};
