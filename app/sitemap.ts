import { MetadataRoute } from 'next';
import { SERVICES, SITE } from '@/lib/seo';

// ============================================================
// DYNAMIC SITEMAP - Auto-generates for Google indexing
// This helps Google discover all your pages
// ============================================================

const SERVICE_AREAS = [
  'oswego',
  'naperville',
  'aurora',
  'plainfield',
  'yorkville',
  'montgomery',
];

// Top services with dedicated location pages
const TOP_SERVICE_SLUGS = [
  'botox',
  'dermal-fillers',
  'lip-filler',
  'weight-loss',
  'microneedling',
  'laser-hair-removal',
  'ipl-photofacial',
  'co2-laser',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.url;
  const currentDate = new Date().toISOString();

  // Core pages - highest priority
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
      priority: 0.95,
    },
    {
      url: `${baseUrl}/book`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
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
      priority: 0.85,
    },
    {
      url: `${baseUrl}/providers/ryan`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
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

  // Solaria CO2 special pages
  const solariaPages: MetadataRoute.Sitemap = [
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
      priority: 0.85,
    },
    {
      url: `${baseUrl}/aftercare/solaria-co2`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
  ];

  // Aftercare / Patient Resources pages
  const aftercarePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/aftercare/solaria-co2`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
  ];

  // Location-based service pages (HIGH PRIORITY for "near me" searches)
  const locationServicePages: MetadataRoute.Sitemap = [];
  
  for (const service of TOP_SERVICE_SLUGS) {
    for (const area of SERVICE_AREAS) {
      locationServicePages.push({
        url: `${baseUrl}/${service}-${area}-il`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: service === 'botox' ? 0.95 : 0.9, // Botox pages highest priority
      });
    }
  }

  // Semaglutide/Weight Loss specific pages
  const weightLossPages: MetadataRoute.Sitemap = SERVICE_AREAS.map((area) => ({
    url: `${baseUrl}/semaglutide-${area}-il`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  // Hormone therapy pages
  const hormonePages: MetadataRoute.Sitemap = SERVICE_AREAS.slice(0, 3).map((area) => ({
    url: `${baseUrl}/hormone-therapy-${area}-il`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // PRP pages
  const prpPages: MetadataRoute.Sitemap = SERVICE_AREAS.slice(0, 3).map((area) => ({
    url: `${baseUrl}/prp-${area}-il`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // City "med spa" landing pages
  const cityPages: MetadataRoute.Sitemap = SERVICE_AREAS.map((area) => ({
    url: `${baseUrl}/med-spa-${area}-il`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [
    ...corePages,
    ...servicePages,
    ...solariaPages,
    ...aftercarePages,
    ...locationServicePages,
    ...weightLossPages,
    ...hormonePages,
    ...prpPages,
    ...cityPages,
  ];
}
