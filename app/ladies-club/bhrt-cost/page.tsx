import type { Metadata } from "next";

import { BhrtCostPageContent } from "@/components/ladies-club/BhrtCostPageContent";
import {
  BHRT_COST_FAQS,
  BHRT_COST_HERO,
  LADIES_CLUB_BHRT_COST_PATH,
} from "@/lib/ladies-club-bhrt-cost";
import { LADIES_CLUB_PATH } from "@/lib/ladies-club";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  SITE,
  siteJsonLd,
} from "@/lib/seo";

const PAGE_URL = `${SITE.url}${LADIES_CLUB_BHRT_COST_PATH}`;

const baseMeta = pageMetadata({
  title: "BHRT Cost for Women — BioTE Pricing Guide | Hello Gorgeous Oswego",
  description:
    "What women pay for BioTE hormone therapy at Hello Gorgeous Med Spa — pellet insertion $400–650, baseline labs, membership perks, insurance, HSA/FSA, and cost comparison. Ryan Kent, FNP-BC. Oswego, IL.",
  path: LADIES_CLUB_BHRT_COST_PATH,
  keywords: [
    "BHRT cost Oswego IL",
    "BioTE pellet cost women Naperville",
    "bioidentical hormone therapy price Illinois",
    "women's hormone therapy cost Fox Valley",
    "perimenopause hormone therapy pricing",
    "BioTE certified provider Oswego",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: `${SITE.url}${BHRT_COST_HERO.heroImage}`,
        width: 1024,
        height: 640,
        alt: BHRT_COST_HERO.heroImageAlt,
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [`${SITE.url}${BHRT_COST_HERO.heroImage}`],
  },
};

export default function LadiesClubBhrtCostPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "The Ladies' Club", url: `${SITE.url}${LADIES_CLUB_PATH}` },
    { name: "BHRT Cost Guide", url: PAGE_URL },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(BHRT_COST_FAQS)) }}
      />
      <BhrtCostPageContent />
    </>
  );
}
