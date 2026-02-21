import { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';

// ============================================================
// ROBOTS.TXT - Tells search engines what to crawl
// This is CRITICAL for Google to find your pages
// ============================================================

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/portal/',
          '/api/',
          '/pos/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/portal/',
          '/api/',
          '/pos/',
        ],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
