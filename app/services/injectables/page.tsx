import type { Metadata } from "next";

import { InjectablesPageContent } from "@/components/injectables/InjectablesPageContent";
import {
  INJECTABLES_FAQS,
  INJECTABLES_MARKETING,
  INJECTABLES_PATH,
  INJECTABLES_SEO,
} from "@/lib/injectables-marketing";
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
  title: INJECTABLES_SEO.title,
  description: INJECTABLES_SEO.description,
  path: INJECTABLES_PATH,
  keywords: [
    "Botox Oswego IL",
    "lip filler Naperville",
    "dermal fillers Aurora IL",
    "neurotoxin Fox Valley",
    "Hello Gorgeous injectables",
    "Daxxify Oswego",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  alternates: { canonical: `${SITE.url}${INJECTABLES_PATH}` },
  openGraph: {
    ...baseMeta.openGraph,
    images: [{ url: `${SITE.url}${INJECTABLES_MARKETING.images.hero}`, width: 1200, height: 630, alt: INJECTABLES_SEO.ogAlt }],
  },
  twitter: { ...baseMeta.twitter, images: [`${SITE.url}${INJECTABLES_MARKETING.images.hero}`] },
};

export default function InjectablesServicePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "Botox & Fillers", url: `${SITE.url}${INJECTABLES_PATH}` },
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
              title: INJECTABLES_SEO.title,
              description: INJECTABLES_SEO.description,
              path: INJECTABLES_PATH,
              image: INJECTABLES_MARKETING.images.hero,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(INJECTABLES_FAQS.map((f) => ({ question: f.q, answer: f.a })), `${SITE.url}${INJECTABLES_PATH}`),
          ),
        }}
      />
      <InjectablesPageContent />
    </>
  );
}
