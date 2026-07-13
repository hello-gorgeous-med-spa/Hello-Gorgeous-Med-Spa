import { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';

// ============================================================
// ROBOTS.TXT — search + AI live-retrieval crawlers (SEO-002)
// Owner decision: allow live-retrieval bots (required to be cited).
// Training bots (GPTBot, Google-Extended, CCBot, etc.) also allowed —
// revisit if you later want opt-out of model training only.
// ============================================================

const PUBLIC_API_ALLOW = [
  '/api/public/ai-profile',
  '/api/public/testimonials',
  '/api/public/search',
  '/api/public/content',
  '/api/public/nurture',
  '/api/public/personalization/context',
  '/api/public/funnels/submit',
] as const;

const DEFAULT_ALLOW = ['/', '/_next/static/', '/_next/image/', ...PUBLIC_API_ALLOW] as const;

const DEFAULT_DISALLOW = ['/admin/', '/portal/', '/api/', '/pos/', '/private/'] as const;

/** Assistant / answer-engine crawlers — keep allowlist explicit. */
const AI_LIVE_RETRIEVAL_AGENTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'Applebot',
  'Bingbot',
  'Meta-ExternalAgent',
  'cohere-ai',
] as const;

/** Optional training crawlers — currently allowed (owner can disallow later). */
const AI_TRAINING_AGENTS = ['GPTBot', 'CCBot'] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [...DEFAULT_ALLOW],
        disallow: [...DEFAULT_DISALLOW],
      },
      {
        userAgent: 'Googlebot',
        allow: [...DEFAULT_ALLOW],
        disallow: ['/admin/', '/portal/', '/api/', '/pos/'],
      },
      ...AI_LIVE_RETRIEVAL_AGENTS.map((userAgent) => ({
        userAgent,
        allow: '/' as const,
      })),
      ...AI_TRAINING_AGENTS.map((userAgent) => ({
        userAgent,
        allow: '/' as const,
      })),
    ],
    sitemap: [`${SITE.url}/sitemap.xml`, `${SITE.url}/image-sitemap.xml`],
    host: SITE.url,
  };
}
