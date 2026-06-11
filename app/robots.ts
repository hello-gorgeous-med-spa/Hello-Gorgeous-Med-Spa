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
        allow: [
          '/',
          '/_next/static/',
          '/_next/image/',
          '/api/public/ai-profile',
          '/api/public/testimonials',
          '/api/public/search',
          '/api/public/content',
          '/api/public/nurture',
          '/api/public/personalization/context',
          '/api/public/funnels/submit',
        ],
        disallow: [
          '/admin/',
          '/portal/',
          '/api/',
          '/pos/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/_next/static/',
          '/_next/image/',
          '/api/public/ai-profile',
          '/api/public/testimonials',
          '/api/public/search',
          '/api/public/content',
          '/api/public/nurture',
          '/api/public/personalization/context',
          '/api/public/funnels/submit',
        ],
        disallow: [
          '/admin/',
          '/portal/',
          '/api/',
          '/pos/',
        ],
      },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'Applebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'Meta-ExternalAgent', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
    ],
    sitemap: [`${SITE.url}/sitemap.xml`, `${SITE.url}/image-sitemap.xml`],
    host: SITE.url,
  };
}
