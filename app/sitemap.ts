import { MetadataRoute } from 'next';
import { SERVICES, SITE } from '@/lib/seo';

// ============================================================
// DYNAMIC SITEMAP - Auto-generates for Google indexing
// This helps Google discover all your pages
// ============================================================

const SERVICE_AREAS = [
  { city: 'naperville', state: 'IL' },
  { city: 'aurora', state: 'IL' },
  { city: 'plainfield', state: 'IL' },
  { city: 'yorkville', state: 'IL' },
  { city: 'oswego', state: 'IL' },
  { city: 'montgomery', state: 'IL' },
  { city: 'sugar-grove', state: 'IL' },
];

const TREATMENT_KEYWORDS = [
  'botox',
  'lip-filler',
  'dermal-fillers',
  'weight-loss',
  'semaglutide',
  'tirzepatide',
  'hormone-therapy',
  'prp',
  'microneedling',
  'laser-hair-removal',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.url;
  const currentDate = new Date().toISOString();

  // Core pages
  const corePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/providers`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/providers/danielle`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/providers/ryan`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/book`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/specials`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Service pages from SERVICES array
  const servicePages: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Special service landing pages (high-value keywords)
  const specialServicePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/services/solaria-co2`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solaria-co2-vip`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/botox-oswego-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/lip-filler-oswego-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/weight-loss-oswego-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Location-based landing pages (critical for "near me" searches)
  const locationPages: MetadataRoute.Sitemap = SERVICE_AREAS.flatMap((area) =>
    TREATMENT_KEYWORDS.map((treatment) => ({
      url: `${baseUrl}/${treatment}-${area.city}-il`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    }))
  );

  // City landing pages
  const cityPages: MetadataRoute.Sitemap = SERVICE_AREAS.map((area) => ({
    url: `${baseUrl}/med-spa-${area.city}-il`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...corePages,
    ...servicePages,
    ...specialServicePages,
    ...locationPages,
    ...cityPages,
  ];
}
