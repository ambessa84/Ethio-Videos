import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authenticationHandle } from './auth';

const authorizationHandle: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;

  const session = await event.locals.auth();
  event.locals.isAdmin = Boolean(session?.user);

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!event.locals.isAdmin) {
      throw redirect(303, '/admin/login');
    }
  }

  return resolve(event);
};

export const handle: Handle = sequence(authenticationHandle, authorizationHandle);
