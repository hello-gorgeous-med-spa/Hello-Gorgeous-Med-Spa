import type { MetadataRoute } from "next";

import { SITE, SERVICES } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now },
    { url: `${SITE.url}/about`, lastModified: now },
    { url: `${SITE.url}/meet-the-team`, lastModified: now },
    { url: `${SITE.url}/oswego-il`, lastModified: now },
    { url: `${SITE.url}/services`, lastModified: now },
    { url: `${SITE.url}/contact`, lastModified: now },
    { url: `${SITE.url}/book`, lastModified: now },
    { url: `${SITE.url}/privacy`, lastModified: now },
    { url: `${SITE.url}/terms`, lastModified: now },
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

  return [...staticRoutes, ...serviceRoutes, ...oswegoTopRoutes];
}

