import type { Metadata } from "next";

import { SolariaCo2PageContent } from "@/components/solaria/SolariaCo2PageContent";
import {
  SOLARIA_CO2_PATH,
  SOLARIA_FAQS,
  SOLARIA_MARKETING,
  SOLARIA_SEO,
} from "@/lib/solaria-marketing";
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
  title: SOLARIA_SEO.title,
  description: SOLARIA_SEO.description,
  path: SOLARIA_CO2_PATH,
  keywords: [
    "Solaria CO2 Oswego IL",
    "CO2 laser resurfacing Naperville",
    "fractional laser Aurora IL",
    "acne scar laser Oswego",
    "InMode Solaria",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  alternates: { canonical: `${SITE.url}${SOLARIA_CO2_PATH}` },
  openGraph: {
    ...baseMeta.openGraph,
    images: [{ url: `${SITE.url}${SOLARIA_MARKETING.images.device}`, width: 1200, height: 630, alt: SOLARIA_SEO.ogAlt }],
  },
  twitter: { ...baseMeta.twitter, images: [`${SITE.url}${SOLARIA_MARKETING.images.device}`] },
};

export default function SolariaCo2ServicePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "Solaria CO₂ Laser", url: `${SITE.url}${SOLARIA_CO2_PATH}` },
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
            webPageJsonLd({ title: SOLARIA_SEO.title, description: SOLARIA_SEO.description, path: SOLARIA_CO2_PATH, image: SOLARIA_MARKETING.images.device }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(SOLARIA_FAQS.map((f) => ({ question: f.q, answer: f.a })), `${SITE.url}${SOLARIA_CO2_PATH}`)),
        }}
      />
      <SolariaCo2PageContent />
    </>
  );
}
