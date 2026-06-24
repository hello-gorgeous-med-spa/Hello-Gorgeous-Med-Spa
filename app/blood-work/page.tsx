import type { Metadata } from "next";

import { BloodWorkPageContent } from "@/components/blood-work/BloodWorkPageContent";
import { BLOOD_WORK_FAQS, BLOOD_WORK_PATH } from "@/lib/blood-work";
import {
  SITE,
  SITE_OG_IMAGE,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteJsonLd,
} from "@/lib/seo";

const PAGE_URL = `${SITE.url}${BLOOD_WORK_PATH}`;

const baseMeta = pageMetadata({
  title: "Blood Work Explained — Comprehensive Lab Panels | Hello Gorgeous Oswego",
  description:
    "Understand 60+ biomarkers across 10 domains — heart, metabolism, hormones, thyroid, and more. Hello Gorgeous orders labs via FullScript, Quest, and LabCorp. Ryan Kent, FNP-BC. Oswego, Naperville, Aurora.",
  path: BLOOD_WORK_PATH,
  keywords: [
    "comprehensive blood panel Oswego IL",
    "hormone lab testing Naperville",
    "FullScript labs med spa",
    "Quest LabCorp requisition Illinois",
    "TRT baseline labs Fox Valley",
    "BioTE lab panel Oswego",
    "wellness blood work explained",
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
        alt: "Hello Gorgeous Med Spa — Blood Work Explained",
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [SITE_OG_IMAGE],
  },
};

export default function BloodWorkPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Medical", url: `${SITE.url}/medical` },
    { name: "Blood Work Explained", url: PAGE_URL },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(BLOOD_WORK_FAQS)) }}
      />
      <BloodWorkPageContent />
    </>
  );
}
