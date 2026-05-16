import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
  cookies.delete('admin_session', { path: '/' });
  throw redirect(303, '/admin/login');
};
