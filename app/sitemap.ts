import { MetadataRoute } from 'next';
import { SERVICES, SITE } from '@/lib/seo';
import { GBP_SERVICE_SLUGS, MED_SPA_LOCATION_SLUGS } from '@/lib/gbp-urls';

// ============================================================
// DYNAMIC SITEMAP - Auto-generates for Google indexing
// Only includes URLs that have corresponding pages (no 404s).
// ============================================================

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
      url: `${baseUrl}/specials`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/fullscript`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/financing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
  ];

  // Service pages from SERVICES array
  const servicePages: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Solaria CO2 special pages (aftercare content lives on /solaria)
  const solariaPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/solaria`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
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
      url: `${baseUrl}/stretch-mark-treatment-oswego-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  // Morpheus8 & Quantum RF pages - high priority new services
  const morpheus8Pages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/services/morpheus8`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/services/quantum-rf`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/morpheus8-oswego-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/morpheus8-naperville-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/morpheus8-aurora-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/morpheus8-plainfield-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  // Trifecta VIP landing (Google / paid)
  const trifectaVIPPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/trifecta-vip`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // VIP Skin Tightening launch waitlist
  const vipSkinTighteningPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/vip-skin-tightening`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Aftercare / Patient Resources (solaria content on /solaria; no separate aftercare URL)
  const aftercarePages: MetadataRoute.Sitemap = [];

  // Location-based service pages (only slugs that exist via [localSlug] / gbp-urls)
  const locationServicePages: MetadataRoute.Sitemap = GBP_SERVICE_SLUGS.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: slug.startsWith('botox-') ? 0.95 : 0.9,
  }));

  // City "med spa" landing pages (only slugs that exist via [localSlug] / gbp-urls)
  const cityPages: MetadataRoute.Sitemap = MED_SPA_LOCATION_SLUGS.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [
    ...corePages,
    ...servicePages,
    ...solariaPages,
    ...morpheus8Pages,
    ...trifectaVIPPages,
    ...vipSkinTighteningPages,
    ...aftercarePages,
    ...locationServicePages,
    ...cityPages,
  ];
}
