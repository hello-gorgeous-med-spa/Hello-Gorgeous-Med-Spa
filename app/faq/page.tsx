import type { Metadata } from "next";

import { FaqPageContent } from "@/components/faq/FaqPageContent";
import { flattenFaqPageItems, MED_SPA_FAQ_SECTIONS } from "@/lib/med-spa-faq-data";
import {
  SITE,
  SITE_OG_IMAGE,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteJsonLd,
} from "@/lib/seo";

const FAQ_PATH = "/faq";
const PAGE_URL = `${SITE.url}${FAQ_PATH}`;

const FLAT_FAQ = flattenFaqPageItems(MED_SPA_FAQ_SECTIONS);

const baseMeta = pageMetadata({
  title: "Med Spa FAQ Oswego IL — Botox, Morpheus8, Weight Loss, Hormones & More",
  description:
    "Answers about Hello Gorgeous Med Spa in Oswego, IL: Morpheus8 Burst, Quantum RF, Solaria CO₂, Botox & fillers, GLP-1 weight loss, BHRT, CareCredit/Cherry, booking, safety, and what makes us Best of Oswego. Serving Naperville, Aurora, Plainfield & Kendall County.",
  path: FAQ_PATH,
  keywords: [
    "med spa FAQ Oswego IL",
    "Hello Gorgeous FAQ",
    "Botox Oswego questions",
    "Morpheus8 Oswego",
    "medical spa Naperville Aurora",
    "GLP-1 weight loss Oswego",
    "laser resurfacing FAQ Illinois",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: "Hello Gorgeous Med Spa — FAQ" }],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [SITE_OG_IMAGE],
  },
};

export default function MedSpaFaqPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "FAQ", url: PAGE_URL },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FLAT_FAQ, PAGE_URL)) }}
      />

      <FaqPageContent />
    </>
  );
}
