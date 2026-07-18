import type { Metadata } from "next";

import { SeeYourResultsLpContent } from "@/components/lp/SeeYourResultsLpContent";
import {
  SEE_YOUR_RESULTS_FAQS,
  SEE_YOUR_RESULTS_META,
  SEE_YOUR_RESULTS_PATH,
} from "@/lib/see-your-results-lp";
import {
  SITE,
  SITE_OG_IMAGE,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteJsonLd,
} from "@/lib/seo";

const PAGE_URL = `${SITE.url}${SEE_YOUR_RESULTS_PATH}`;

const baseMeta = pageMetadata({
  title: SEE_YOUR_RESULTS_META.title,
  description: SEE_YOUR_RESULTS_META.description,
  path: SEE_YOUR_RESULTS_META.path,
  keywords: [
    "see results before booking med spa",
    "Face Blueprint Hello Gorgeous",
    "AI aesthetic simulation Oswego",
    "Botox visualization Naperville",
    "med spa before after Oswego IL",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "See your results before you book — Hello Gorgeous Face Blueprint",
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [SITE_OG_IMAGE],
  },
};

export default function SeeYourResultsPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "See Your Results", url: PAGE_URL },
  ];

  const faqs = SEE_YOUR_RESULTS_FAQS.map((f) => ({
    question: f.q,
    answer: f.a,
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs, PAGE_URL)) }}
      />
      <SeeYourResultsLpContent />
    </>
  );
}
