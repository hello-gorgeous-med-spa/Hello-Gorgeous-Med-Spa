import type { MetadataRoute } from "next";

import { GBP_SERVICE_SLUGS, MED_SPA_LOCATION_SLUGS } from "@/lib/gbp-urls";
import { SITE, SERVICES } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    // High Priority Pages
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE.url}/free-vitamin`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE.url}/subscribe`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE.url}/referral`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/iv-therapy`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE.url}/telehealth`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/quiz`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/botox-party`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/reviews`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/vip`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/book`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/get-app`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    
    // About Pages
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/providers`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/providers/danielle`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/providers/ryan`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/fix-what-bothers-me`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/explore-care`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/your-journey`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/understand-your-body`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/care-and-support`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/clinical-partners`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    
    // Location Pages (Critical for Local SEO)
    { url: `${SITE.url}/locations`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/community`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/oswego-il`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/naperville-il`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/aurora-il`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/plainfield-il`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    
    // Services Atlas category routes (SEO-safe clusters)
    { url: `${SITE.url}/services/aesthetics-injectables`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/services/weight-loss-metabolic-care`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/services/hormones-wellness`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/services/skin-regeneration`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/services/iv-therapy-recovery`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/services/hair-restoration`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/services/pain-recovery`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/services/lashes-brows-beauty`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/services/medical-visits-consultations`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    
    // Legal
    { url: `${SITE.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${SITE.url}/services/${s.slug}`,
    lastModified: now,
  }));

  const oswegoTopRoutes: MetadataRoute.Sitemap = [
    "botox-dysport-jeuveau",
    "dermal-fillers",
    "weight-loss-therapy",
    "rf-microneedling",
    "biote-hormone-therapy",
    "iv-therapy",
  ].map((slug) => ({
    url: `${SITE.url}/oswego-il/${slug}`,
    lastModified: now,
  }));

  const napervilleTopRoutes: MetadataRoute.Sitemap = [
    "botox-dysport-jeuveau",
    "dermal-fillers",
    "weight-loss-therapy",
    "rf-microneedling",
    "biote-hormone-therapy",
    "iv-therapy",
  ].map((slug) => ({
    url: `${SITE.url}/naperville-il/${slug}`,
    lastModified: now,
  }));

  const auroraTopRoutes: MetadataRoute.Sitemap = [
    "botox-dysport-jeuveau",
    "dermal-fillers",
    "weight-loss-therapy",
    "rf-microneedling",
    "biote-hormone-therapy",
    "iv-therapy",
  ].map((slug) => ({
    url: `${SITE.url}/aurora-il/${slug}`,
    lastModified: now,
  }));

  const plainfieldTopRoutes: MetadataRoute.Sitemap = [
    "botox-dysport-jeuveau",
    "dermal-fillers",
    "weight-loss-therapy",
    "rf-microneedling",
    "biote-hormone-therapy",
    "iv-therapy",
  ].map((slug) => ({
    url: `${SITE.url}/plainfield-il/${slug}`,
    lastModified: now,
  }));

  // GBP-style local landing pages (/botox-oswego-il/, /med-spa-oswego-il/, etc.)
  const gbpRoutes: MetadataRoute.Sitemap = [...GBP_SERVICE_SLUGS, ...MED_SPA_LOCATION_SLUGS].map(
    (slug) => ({
      url: `${SITE.url}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })
  );

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...gbpRoutes,
    ...oswegoTopRoutes,
    ...napervilleTopRoutes,
    ...auroraTopRoutes,
    ...plainfieldTopRoutes,
  ];
}

