import type { Metadata } from "next";

import { ViPeelPageContent } from "@/components/vi-peel/ViPeelPageContent";
import { VI_PEEL_FAQS, VI_PEEL_MARKETING, VI_PEEL_PATH, VI_PEEL_SEO } from "@/lib/vi-peel-marketing";
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
  title: VI_PEEL_SEO.title,
  description: VI_PEEL_SEO.description,
  path: VI_PEEL_PATH,
  keywords: [...VI_PEEL_SEO.keywords],
});

export const metadata: Metadata = {
  ...baseMeta,
  alternates: { canonical: `${SITE.url}${VI_PEEL_PATH}` },
  openGraph: {
    ...baseMeta.openGraph,
    images: [
      {
        url: `${SITE.url}${VI_PEEL_MARKETING.image}`,
        width: 1200,
        height: 630,
        alt: VI_PEEL_SEO.ogAlt,
      },
    ],
  },
  twitter: { ...baseMeta.twitter, images: [`${SITE.url}${VI_PEEL_MARKETING.image}`] },
};

export default function ViPeelServicePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "VI Peel", url: `${SITE.url}${VI_PEEL_PATH}` },
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
              title: VI_PEEL_SEO.title,
              description: VI_PEEL_SEO.description,
              path: VI_PEEL_PATH,
              image: VI_PEEL_MARKETING.image,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(
              VI_PEEL_FAQS.map((faq) => ({ question: faq.q, answer: faq.a })),
              `${SITE.url}${VI_PEEL_PATH}`,
            ),
          ),
        }}
      />
      <ViPeelPageContent />
    </>
  );
}
