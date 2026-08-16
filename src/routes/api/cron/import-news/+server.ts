import { env } from "$env/dynamic/private";
import { importNewsFeeds } from "$lib/server/import-news";
import { json } from "@sveltejs/kit";

export const GET = async ({ request }) => {
  const authorization = request.headers.get("authorization");
  const expectedAuthorization = `Bearer ${env.CRON_SECRET}`;

  if (!env.CRON_SECRET || authorization !== expectedAuthorization) {
    return json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const results = await importNewsFeeds();

  return json({
    ok: true,
    results,
  });
};
