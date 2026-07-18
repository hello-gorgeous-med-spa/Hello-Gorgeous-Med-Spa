import type { Metadata } from "next";

import { QuantumRFPageContent } from "@/components/quantum-rf/QuantumRFPageContent";
import {
  QUANTUM_RF_FAQS,
  QUANTUM_RF_MARKETING,
  QUANTUM_RF_PATH,
  QUANTUM_RF_SEO,
} from "@/lib/quantum-rf-marketing";
import {
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  localBusinessJsonLd,
  pageMetadata,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const revalidate = 3600;

const baseMeta = pageMetadata({
  title: QUANTUM_RF_SEO.title,
  description: QUANTUM_RF_SEO.description,
  path: QUANTUM_RF_PATH,
  keywords: [
    "Quantum RF Oswego IL",
    "QuantumRF InMode",
    "non surgical body contouring Naperville",
    "neck fat reduction Aurora IL",
    "Luxora InMode",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  alternates: { canonical: `${SITE.url}${QUANTUM_RF_PATH}` },
  openGraph: {
    ...baseMeta.openGraph,
    images: [{ url: `${SITE.url}${QUANTUM_RF_MARKETING.images.hero}`, width: 1200, height: 630, alt: QUANTUM_RF_SEO.ogAlt }],
  },
  twitter: { ...baseMeta.twitter, images: [`${SITE.url}${QUANTUM_RF_MARKETING.images.hero}`] },
};

export default function QuantumRfServicePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "Quantum RF", url: `${SITE.url}${QUANTUM_RF_PATH}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd("Oswego")) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title: QUANTUM_RF_SEO.title,
              description: QUANTUM_RF_SEO.description,
              path: QUANTUM_RF_PATH,
              image: QUANTUM_RF_MARKETING.images.hero,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(
              QUANTUM_RF_FAQS.map((f) => ({ question: f.q, answer: f.a })),
              `${SITE.url}${QUANTUM_RF_PATH}`,
            ),
          ),
        }}
      />
      <QuantumRFPageContent />
    </>
  );
}
