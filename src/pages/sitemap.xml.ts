import type { APIRoute } from 'astro';
import { pageMeta } from '@/data/pages';
import { locales, withLocale } from '@/lib/i18n';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site ? site.origin : 'https://metaforge.app';
  const lastmod = new Date().toISOString().split('T')[0];

  const basePaths = Object.keys(pageMeta);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  for (const path of basePaths) {
    for (const localeConfig of locales) {
      const localePath = withLocale(localeConfig.code, path);
      const fullUrl = `${baseUrl}${localePath}`;

      xml += `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${path === '/' ? '1.0' : path === '/studio' ? '0.9' : '0.8'}</priority>
`;

      // Add hreflang alternates
      for (const alt of locales) {
        const altPath = withLocale(alt.code, path);
        xml += `    <xhtml:link rel="alternate" hreflang="${alt.code}" href="${baseUrl}${altPath}"/>\n`;
      }
      const xDefaultPath = withLocale('en', path);
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${xDefaultPath}"/>\n`;

      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
