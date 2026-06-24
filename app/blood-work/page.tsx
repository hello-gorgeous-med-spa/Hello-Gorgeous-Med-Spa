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
  title: "Comprehensive Blood Panels & Lab Testing | Hello Gorgeous Oswego",
  description:
    "60+ biomarker blood panels for hormone optimization, GLP-1, and wellness — metabolic, cardiovascular, thyroid, and nutrient testing. $250–450 typical. FullScript, Quest, LabCorp. Ryan Kent, FNP-BC.",
  path: BLOOD_WORK_PATH,
  keywords: [
    "comprehensive blood panel Oswego IL",
    "blood panels Naperville",
    "hormone lab testing Fox Valley",
    "FullScript labs med spa",
    "Quest LabCorp requisition Illinois",
    "BioTE baseline labs Oswego",
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
    { name: "Comprehensive Blood Panels", url: PAGE_URL },
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
