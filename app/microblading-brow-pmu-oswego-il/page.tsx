import type { Metadata } from "next";

import { BrowJourneyPageContent } from "@/components/brow-journey/BrowJourneyPageContent";
import {
  BROW_JOURNEY_FAQS,
  BROW_JOURNEY_IMAGES,
  BROW_JOURNEY_PATH,
  BROW_JOURNEY_SEO,
  BROW_PMU_SEO_KEYWORDS,
} from "@/lib/brow-journey-marketing";
import {
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  localBusinessJsonLd,
  pageMetadata,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

const baseMeta = pageMetadata({
  title: BROW_JOURNEY_SEO.title,
  description: BROW_JOURNEY_SEO.description,
  path: BROW_JOURNEY_PATH,
  keywords: [...BROW_PMU_SEO_KEYWORDS, "Jen Vokoun", "Your Brow Journey", "Tina Davies pigments"],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    images: [
      {
        url: `${SITE.url}${BROW_JOURNEY_IMAGES.artistJen}`,
        width: 1200,
        height: 1500,
        alt: BROW_JOURNEY_SEO.ogAlt,
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    images: [`${SITE.url}${BROW_JOURNEY_IMAGES.artistJen}`],
  },
};

const browProcedureSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  name: "Eyebrow Permanent Makeup (Brow PMU)",
  alternateName: [
    "Microblading Oswego",
    "Powder Brows Oswego",
    "Combo Brows",
    "Nano Brows",
    "Your Brow Journey",
  ],
  description: BROW_JOURNEY_SEO.description,
  procedureType: "Cosmetic",
  bodyLocation: "Eyebrow",
  performer: {
    "@type": "Person",
    name: "Jen Vokoun",
    worksFor: { "@type": "MedicalBusiness", name: SITE.name, url: SITE.url },
  },
  provider: {
    "@type": "MedicalBusiness",
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.addressCountry,
    },
  },
};

export default function MicrobladingBrowPmuOswegoPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "Your Brow Journey", url: `${SITE.url}${BROW_JOURNEY_PATH}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd("Oswego")) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(
              BROW_JOURNEY_FAQS.map((f) => ({ question: f.q, answer: f.a })),
              `${SITE.url}${BROW_JOURNEY_PATH}`,
            ),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(browProcedureSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title: BROW_JOURNEY_SEO.title,
              description: BROW_JOURNEY_SEO.description,
              path: BROW_JOURNEY_PATH,
              image: BROW_JOURNEY_IMAGES.artistJen,
            }),
          ),
        }}
      />

      <BrowJourneyPageContent />
    </>
  );
}
