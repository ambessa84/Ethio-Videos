import { env } from '$env/dynamic/private';

export const GET = async () => {
  const siteUrl = env.PUBLIC_SITE_URL || 'http://localhost:5173';

  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`,
    {
      headers: {
        'content-type': 'text/plain'
      }
    }
  );
};
