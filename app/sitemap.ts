import { MetadataRoute } from 'next';
import { SERVICES, SITE } from '@/lib/seo';
import { getAllSlugs } from '@/data/blog-posts';
import { GBP_SERVICE_SLUGS, MED_SPA_LOCATION_SLUGS } from '@/lib/gbp-urls';
import { TREATMENT_HUB_SLUGS } from '@/lib/treatment-hubs';
import { CONCERN_PAGES } from '@/lib/concern-pages';
import { FUNNEL_DEFINITIONS } from '@/lib/funnels';
import { AREA_PAGES, FAQ_CLUSTER_PAGES, RECOVERY_PAGES } from '@/lib/topical-expansion';
import { SERVICE_PAGE_OSWEGO_SLUGS } from '@/lib/service-pages-oswego';

// ============================================================
// SITEMAP - Auto-generates for Google indexing
// Excluded from middleware matcher so Googlebot can fetch reliably.
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
      url: `${baseUrl}/procedures`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/patient-documents`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/injectables`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // /providers intentionally excluded — it 307-redirects to /about. Sitemaps must list canonical destinations.
    {
      url: `${baseUrl}/providers/ryan`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.92,
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
      url: `${baseUrl}/the-book`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/specials`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.92,
    },
    {
      url: `${baseUrl}/regenerative-medicine-oswego-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.93,
    },
    {
      url: `${baseUrl}/services/nad-plus-injections-oswego-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.91,
    },
    {
      url: `${baseUrl}/events/quantum-rf-clinical-model`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.88,
    },
    {
      url: `${baseUrl}/events/quantum-rf-model-days`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.88,
    },
    {
      url: `${baseUrl}/why-choose-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/best-med-spa-oswego-il`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/nurse-practitioner-med-spa-oswego`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/free-vitamin`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/spring-special-laser-hair`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/newsletter/hello-gorgeous-april.html`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/glp1-intake`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.88,
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
      url: `${baseUrl}/products-we-offer`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.88,
    },
    {
      url: `${baseUrl}/financing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/care/laser-acne-protocol`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.82,
    },
  ];

  // Service pages from SERVICES array
  const servicePages: MetadataRoute.Sitemap = SERVICES
    // These legacy service paths 308 to other destinations; keep sitemap canonical-only.
    .filter((service) => service.slug !== 'sermorelin-growth-peptide')
    .map((service) => ({
      url: `${baseUrl}${service.publicPath ?? `/services/${service.slug}`}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: service.publicPath ? 0.9 : 0.8,
    }));

  // Solaria CO2 special pages (aftercare content lives on /solaria)
  const solariaPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/solaria-co2-laser-oswego-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/co2-laser-oswego-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/co2-laser-naperville-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/co2-laser-aurora-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
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
    {
      url: `${baseUrl}/trigger-point-injections-oswego-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.88,
    },
    {
      url: `${baseUrl}/cellulite-treatment-oswego-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.88,
    },
  ];

  // Premium SEO landing pages (FaqPageContent template — botox, microneedling-rf, weight-loss-therapy)
  const premiumLandingPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/services/botox`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/microneedling-rf`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.92,
    },
    {
      url: `${baseUrl}/services/weight-loss`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.92,
    },
  ];

  const comparisonPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/compare`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/morpheus8-vs-rf-microneedling`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    {
      url: `${baseUrl}/compare/quantum-rf-vs-facelift`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    {
      url: `${baseUrl}/compare/solaria-co2-vs-traditional-co2`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    {
      url: `${baseUrl}/compare/glp1-vs-traditional-weight-loss`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.82,
    },
  ];

  const caseStudyPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/case-studies/template`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const treatmentHubPages: MetadataRoute.Sitemap = TREATMENT_HUB_SLUGS.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.88,
  }));

  const concernPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/concerns`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...CONCERN_PAGES.map((concern) => ({
      url: `${baseUrl}/concerns/${concern.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.84,
    })),
  ];

  const intelligencePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.82,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.82,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/funnels`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.83,
    },
    ...FUNNEL_DEFINITIONS.map((funnel) => ({
      url: `${baseUrl}/funnels/${funnel.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.82,
    })),
  ];

  const topicalExpansionPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/areas`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...AREA_PAGES.map((entry) => ({
      url: `${baseUrl}/areas/${entry.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.79,
    })),
    {
      url: `${baseUrl}/recovery`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...RECOVERY_PAGES.map((entry) => ({
      url: `${baseUrl}/recovery/${entry.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.79,
    })),
    ...FAQ_CLUSTER_PAGES.map((entry) => ({
      url: `${baseUrl}/faq/${entry.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.78,
    })),
  ];

  // Morpheus8 & Quantum RF pages - high priority new services
  const morpheus8Pages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/morpheus8-burst-oswego-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/services/morpheus8`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/quantum-rf-oswego-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/services/quantum-rf`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
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

  // Aftercare / Patient Resources (solaria content on /solaria; no separate aftercare URL)
  const aftercarePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/microblading-brow-pmu-oswego-il`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pre-post-care/microblading`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    {
      url: `${baseUrl}/education/your-brow-journey`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/forms/brow-intake`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.78,
    },
  ];

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

  // Blog articles — featured posts get higher crawl priority
  const featuredBlogSlugs = new Set([
    'best-med-spa-near-aurora-il-botox-weight-loss-morpheus8',
    'brow-mapping-shapes-techniques-nano-powder-combo-ombre-oswego-il',
    'nano-brows-vs-powder-brows-vs-hand-stroke-microblading-oswego-il',
    'which-peptide-is-right-for-you-oswego-il',
    'founder-letter-morpheus8-solaria-oswego-il',
    'what-makes-hello-gorgeous-different-oswego-il',
    'salmon-dna-sculptra-ipl-oswego-il-med-spa-guide',
    'we-arent-just-a-botox-clinic-hello-gorgeous-oswego-il',
    'male-female-practitioners-med-spa-advantage-oswego-il',
    'botox-vs-dysport-vs-jeuveau-faq-oswego',
    'aesthetic-injectables-anteage-pearl-oswego-il',
    'the-story-behind-hello-gorgeous-oswego-il',
  ]);

  const priorityTreatmentPages: MetadataRoute.Sitemap = [
    '/services/sculptra-biostimulator',
    '/services/salmon-dna-glass-facial',
    '/services/ipl-photofacial',
    '/sculptra-oswego-il',
    '/salmon-dna-oswego-il',
    '/ipl-photofacial-oswego-il',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.92,
  }));
  const blogPages: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: featuredBlogSlugs.has(slug) ? ('weekly' as const) : ('monthly' as const),
    priority: featuredBlogSlugs.has(slug) ? 0.9 : 0.8,
  }));

  // Laser hair removal — location pages (Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery)
  const laserHairRemovalPages: MetadataRoute.Sitemap = [
    'oswego-il', 'naperville-il', 'aurora-il', 'plainfield-il', 'yorkville-il', 'montgomery-il',
  ].map((city) => ({
    url: `${baseUrl}/laser-hair-removal-${city}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  // Laser hair memberships — location pages for SEO domination
  const laserHairMembershipPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/laser-hair-memberships`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...['oswego-il', 'naperville-il', 'aurora-il', 'plainfield-il', 'yorkville-il', 'montgomery-il'].map((city) => ({
      url: `${baseUrl}/laser-hair-memberships/${city}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
  ];

  // Semaglutide Spring Break Special — $299/month promo
  const springBreakPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/semaglutide-spring-break-special`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    ...['oswego-il', 'naperville-il', 'aurora-il', 'plainfield-il', 'montgomery-il', 'yorkville-il'].map((city) => ({
      url: `${baseUrl}/semaglutide-spring-break/${city}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ];

  // HG_DEV_011 — individual Oswego service SEO URLs
  const serviceOswegoPages: MetadataRoute.Sitemap = SERVICE_PAGE_OSWEGO_SLUGS.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // City hub pages (/{city}-il) + their service sub-pages (/{city}-il/{service}) and the
  // /locations index — these are dedicated app routes, previously only reachable via footer.
  const CITY_HUB_SLUGS = [
    'oswego-il', 'naperville-il', 'aurora-il', 'montgomery-il', 'plainfield-il', 'yorkville-il',
  ];
  const CITY_HUB_SERVICE_SLUGS = [
    'botox-dysport-jeuveau', 'dermal-fillers', 'weight-loss-therapy',
    'rf-microneedling', 'biote-hormone-therapy', 'iv-therapy',
  ];
  const cityHubPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/locations`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.7 },
    ...CITY_HUB_SLUGS.map((city) => ({
      url: `${baseUrl}/${city}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...CITY_HUB_SLUGS.flatMap((city) =>
      CITY_HUB_SERVICE_SLUGS.map((service) => ({
        url: `${baseUrl}/${city}/${service}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    ),
  ];

  return [
    ...corePages,
    ...servicePages,
    ...serviceOswegoPages,
    ...premiumLandingPages,
    ...comparisonPages,
    ...caseStudyPages,
    ...treatmentHubPages,
    ...concernPages,
    ...intelligencePages,
    ...topicalExpansionPages,
    ...solariaPages,
    ...morpheus8Pages,
    ...priorityTreatmentPages,
    ...blogPages,
    ...aftercarePages,
    ...locationServicePages,
    ...cityPages,
    ...cityHubPages,
    ...laserHairRemovalPages,
    ...laserHairMembershipPages,
    ...springBreakPages,
  ];
}
