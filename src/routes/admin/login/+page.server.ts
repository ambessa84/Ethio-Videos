import { AuthError } from '@auth/sveltekit';
import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import { signIn } from '../../../auth';

export const actions = {
  default: async (event) => {
    if (!env.ADMIN_PASSWORD) {
      return fail(500, {
        message: 'ADMIN_PASSWORD is not configured.'
      });
    }

    if (!env.AUTH_SECRET) {
      return fail(500, {
        message: 'AUTH_SECRET is not configured.'
      });
    }

    try {
      await signIn(event);
    } catch (error) {
      if (error instanceof AuthError) {
        return fail(400, {
          message: 'Incorrect password.'
        });
      }

      throw error;
    }

    return fail(500, {
      message: 'Unable to start the admin session.'
    });
  }
};
