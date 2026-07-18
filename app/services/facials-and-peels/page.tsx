import type { Metadata } from "next";

import { FacialsPeelsPageContent } from "@/components/facials-peels/FacialsPeelsPageContent";
import {
  FACIALS_FAQS,
  FACIALS_PEELS_MARKETING,
  FACIALS_PEELS_PATH,
  FACIALS_PEELS_SEO,
} from "@/lib/facials-peels-marketing";
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
  title: FACIALS_PEELS_SEO.title,
  description: FACIALS_PEELS_SEO.description,
  path: FACIALS_PEELS_PATH,
  keywords: [
    "facials Oswego IL",
    "HydraFacial Oswego",
    "chemical peel Naperville",
    "dermaplaning Aurora IL",
    "signature facial Hello Gorgeous",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  alternates: { canonical: `${SITE.url}${FACIALS_PEELS_PATH}` },
  openGraph: {
    ...baseMeta.openGraph,
    images: [
      {
        url: `${SITE.url}${FACIALS_PEELS_MARKETING.images.hero}`,
        width: 1200,
        height: 630,
        alt: FACIALS_PEELS_SEO.ogAlt,
      },
    ],
  },
  twitter: { ...baseMeta.twitter, images: [`${SITE.url}${FACIALS_PEELS_MARKETING.images.hero}`] },
};

export default function FacialsPeelsJourneyPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "Facials & Peels", url: `${SITE.url}${FACIALS_PEELS_PATH}` },
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
              title: FACIALS_PEELS_SEO.title,
              description: FACIALS_PEELS_SEO.description,
              path: FACIALS_PEELS_PATH,
              image: FACIALS_PEELS_MARKETING.images.hero,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(
              FACIALS_FAQS.map((f) => ({ question: f.q, answer: f.a })),
              `${SITE.url}${FACIALS_PEELS_PATH}`,
            ),
          ),
        }}
      />
      <FacialsPeelsPageContent />
    </>
  );
}
