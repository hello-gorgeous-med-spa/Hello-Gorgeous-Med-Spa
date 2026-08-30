import type { Metadata } from "next";

import { FallMakeoverPageContent } from "@/components/marketing/FallMakeoverPageContent";
import {
  FALL_MAKEOVER_CAMPAIGN,
  FALL_MAKEOVER_FAQS,
  FALL_MAKEOVER_PATH,
} from "@/lib/campaigns/fall-makeover-2026";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${FALL_MAKEOVER_PATH}`;
const OG_IMAGE = `${SITE.url}${FALL_MAKEOVER_CAMPAIGN.ogImagePath}`;

const DESCRIPTION =
  "Fall Makeover in Oswego — Repair $100 off + gift card, Prevent $200 off, Lose $150 off. Inside + out packages. NP consult first. Individual results vary.";

const baseMeta = pageMetadata({
  title: "Fall Makeover — Repair, Prevent, Lose | Oswego",
  description: DESCRIPTION,
  path: FALL_MAKEOVER_PATH,
  keywords: [
    "Fall Makeover Oswego",
    "IPL photofacial package Oswego",
    "Solaria CO2 fall special",
    "GLP-1 and Morpheus8 Oswego",
    "anti-aging package Naperville",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 900,
        alt: "Fall Makeover at Hello Gorgeous Med Spa — inside and out",
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    images: [OG_IMAGE],
  },
};

export default function FallMakeoverPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Specials", url: `${SITE.url}/specials` },
    { name: "Fall Makeover", url: PAGE_URL },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FALL_MAKEOVER_FAQS, PAGE_URL)) }}
      />
      <FallMakeoverPageContent />
    </>
  );
}
