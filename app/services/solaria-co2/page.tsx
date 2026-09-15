import type { Metadata } from "next";

import { SOLARIA_FALL_599_CAMPAIGN } from "@/lib/campaigns/solaria-fall-599-2026";
import { SolariaCo2PageContent } from "@/components/solaria/SolariaCo2PageContent";
import {
  SOLARIA_CO2_PATH,
  SOLARIA_FAQS,
  SOLARIA_MARKETING,
  SOLARIA_SEO,
  solariaSeptemberOfferJsonLd,
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
    "Solaria fall special Oswego",
    "CO2 laser $599 Oswego",
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
    images: [{ url: `${SITE.url}${SOLARIA_FALL_599_CAMPAIGN.imagePath}`, width: 1024, height: 1536, alt: SOLARIA_SEO.ogAlt }],
  },
  twitter: { ...baseMeta.twitter, images: [`${SITE.url}${SOLARIA_FALL_599_CAMPAIGN.imagePath}`] },
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
            webPageJsonLd({ title: SOLARIA_SEO.title, description: SOLARIA_SEO.description, path: SOLARIA_CO2_PATH, image: SOLARIA_MARKETING.images.hero }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(SOLARIA_FAQS.map((f) => ({ question: f.q, answer: f.a })), `${SITE.url}${SOLARIA_CO2_PATH}`)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(solariaSeptemberOfferJsonLd(SOLARIA_CO2_PATH)) }}
      />
      <SolariaCo2PageContent />
    </>
  );
}
