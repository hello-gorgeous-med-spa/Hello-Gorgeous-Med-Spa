import type { Metadata } from "next";

import { MonthlyMembershipsShowcase } from "@/components/memberships/MonthlyMembershipsShowcase";
import {
  MONTHLY_MEMBERSHIPS_FAQS,
  MONTHLY_MEMBERSHIPS_OG_IMAGE,
  MONTHLY_MEMBERSHIPS_PATH,
  MONTHLY_MEMBERSHIPS_URL,
  membershipsItemListJsonLd,
} from "@/lib/monthly-memberships-marketing";
import { GLP1_PROGRAM } from "@/lib/glp1-program-pricing";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const baseMeta = pageMetadata({
  title: "Wellness Memberships Oswego IL — Peptides, Hormones, Vitamin Bar",
  description:
    `Hello Gorgeous monthly wellness memberships in Oswego, IL: Vitamin Bar from $49/mo, peptide & hormone plans, Precision Hormone $199/mo, Metabolic Reset GLP-1 from $${GLP1_PROGRAM.injectable.tirzepatideStarterUsd}/mo, Gentlemen's Club from $99/mo. Ryan Kent, FNP-BC. Naperville, Aurora & Plainfield.`,
  path: MONTHLY_MEMBERSHIPS_PATH,
  keywords: [
    "med spa membership Oswego IL",
    "Vitamin Bar membership Naperville",
    "HydraFacial membership Oswego",
    "peptide membership oswego",
    "hormone membership med spa illinois",
    "vitamin bar membership naperville",
    "TRT membership oswego",
    "monthly wellness plan med spa",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: MONTHLY_MEMBERSHIPS_URL,
    images: [
      {
        url: `${SITE.url}${MONTHLY_MEMBERSHIPS_OG_IMAGE}`,
        width: 1200,
        height: 1600,
        alt: "Energy Unlimited membership — Hello Gorgeous Med Spa Oswego IL",
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [`${SITE.url}${MONTHLY_MEMBERSHIPS_OG_IMAGE}`],
  },
};

export default function MonthlyMembershipsPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Monthly Memberships", url: MONTHLY_MEMBERSHIPS_URL },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(MONTHLY_MEMBERSHIPS_FAQS, MONTHLY_MEMBERSHIPS_URL)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(membershipsItemListJsonLd(MONTHLY_MEMBERSHIPS_URL)) }}
      />

      <MonthlyMembershipsShowcase />
    </>
  );
}
