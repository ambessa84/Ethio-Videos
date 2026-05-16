import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;

  event.locals.isAdmin = event.cookies.get('admin_session') === 'true';

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!event.locals.isAdmin) {
      throw redirect(303, '/admin/login');
    }
  }

  return resolve(event);
};
