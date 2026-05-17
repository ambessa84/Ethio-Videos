import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import { importLatestVideosForAllChannels } from '$lib/server/import-youtube-channel';

export const GET = async ({ request }) => {
  const authorization = request.headers.get('authorization');
  const expectedAuthorization = `Bearer ${env.CRON_SECRET}`;

  if (!env.CRON_SECRET || authorization !== expectedAuthorization) {
    return json({ ok: false, message: 'Unauthorized.' }, { status: 401 });
  }

  const results = await importLatestVideosForAllChannels();

  return json({
    ok: true,
    results
  });
};
