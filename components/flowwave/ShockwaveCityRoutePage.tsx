import { ShockwaveCitySeoPage } from "@/components/flowwave/ShockwaveCitySeoPage";
import { FLOWWAVE_MARKETING, FLOWWAVE_PATH } from "@/lib/flowwave-marketing";
import type { PrimaryCitySlug } from "@/lib/city-seo-tier";
import { getShockwaveCitySeo } from "@/lib/shockwave-city-seo";
import {
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  mainLocalBusinessJsonLd,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export function ShockwaveCityRoutePage({ slug }: { slug: PrimaryCitySlug }) {
  const content = getShockwaveCitySeo(slug);
  const pageUrl = `${SITE.url}${content.path}`;

  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "FlowWave Shockwave Therapy", url: `${SITE.url}${FLOWWAVE_PATH}` },
    { name: `Shockwave Therapy ${content.cityLabel} IL`, url: pageUrl },
  ];

  const procedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${pageUrl}#procedure`,
    name: `FlowWave FOCUS Shockwave Therapy near ${content.cityLabel}, IL`,
    alternateName: [
      `Shockwave Therapy ${content.cityLabel}`,
      "FlowWave FOCUS Illinois",
      "Focused Shockwave Therapy",
    ],
    description: content.metaDescription,
    procedureType: "NoninvasiveProcedure",
    howPerformed:
      "Focused acoustic waves delivered to target tissue by a nurse practitioner using the FlowWave FOCUS device.",
    status: "Available",
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: SITE.serviceAreas.map((area) => ({ "@type": "Place", name: area })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainLocalBusinessJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title: content.metaTitle,
              description: content.metaDescription,
              path: content.path,
              image: FLOWWAVE_MARKETING.images.recoveryBanner,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(content.faqs, pageUrl)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureJsonLd) }}
      />
      <ShockwaveCitySeoPage content={content} />
    </>
  );
}
