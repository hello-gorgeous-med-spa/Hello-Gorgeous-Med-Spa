import type { Metadata } from "next";

import { IvTherapyPageContent } from "@/components/iv-therapy/IvTherapyPageContent";
import {
  IV_FAQS,
  IV_THERAPY_MARKETING,
  IV_THERAPY_PATH,
  IV_THERAPY_SEO,
} from "@/lib/iv-therapy-marketing";
import {
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const revalidate = 3600;

const PAGE_URL = `${SITE.url}${IV_THERAPY_PATH}`;

const baseMeta = pageMetadata({
  title: IV_THERAPY_SEO.title,
  description: IV_THERAPY_SEO.description,
  path: IV_THERAPY_PATH,
  keywords: [
    "IV therapy Oswego IL",
    "vitamin drip Naperville",
    "Myers Cocktail Aurora",
    "NAD IV Oswego",
    "vitamin shots Hello Gorgeous",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    ...baseMeta.openGraph,
    images: [
      {
        url: `${SITE.url}${IV_THERAPY_MARKETING.images.hero}`,
        width: 1200,
        height: 630,
        alt: IV_THERAPY_SEO.ogAlt,
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    images: [`${SITE.url}${IV_THERAPY_MARKETING.images.hero}`],
  },
};

export default function IvTherapyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Services", url: `${SITE.url}/services` },
              { name: "IV Therapy", url: PAGE_URL },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title: IV_THERAPY_SEO.title,
              description: IV_THERAPY_SEO.description,
              path: IV_THERAPY_PATH,
              image: IV_THERAPY_MARKETING.images.hero,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd([...IV_FAQS].map((f) => ({ question: f.q, answer: f.a })), PAGE_URL)),
        }}
      />
      <IvTherapyPageContent />
    </>
  );
}
