import type { Metadata } from "next";

import { MensWellnessPageContent } from "@/components/mens-wellness/MensWellnessPageContent";
import {
  MENS_WELLNESS_FAQS,
  MENS_WELLNESS_MEMBERSHIP,
  MENS_WELLNESS_PATH,
} from "@/lib/mens-wellness";
import { GENTLEMENS_CLUB_HERO_IMAGE } from "@/lib/gentlemens-club";
import { GLP1_RETAIL_PROGRAM } from "@/lib/peptide-retail-pricing";
import {
  SITE,
  pageMetadata,
  siteJsonLd,
  mainLocalBusinessJsonLd,
  breadcrumbJsonLd,
  webPageJsonLd,
  faqJsonLd,
} from "@/lib/seo";

const PAGE_URL = `${SITE.url}${MENS_WELLNESS_PATH}`;
const PAGE_DESCRIPTION = `Men's wellness in Oswego, IL — Brotox, TRT & hormone optimization, peptides, GLP-1 from $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo, and The Gentlemen's Club from $${MENS_WELLNESS_MEMBERSHIP.fromPrice}/mo. NP-supervised by Ryan Kent, FNP-BC.`;

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Men's Wellness Oswego IL | Brotox, TRT, Peptides & GLP-1 | Hello Gorgeous",
  description: PAGE_DESCRIPTION,
  path: MENS_WELLNESS_PATH,
  keywords: [
    "brotox oswego il",
    "mens botox near me",
    "mens hormone therapy oswego",
    "TRT oswego il",
    "peptide therapy men",
    "mens med spa near me",
    "mens wellness chicago suburbs",
    "gentlemens club med spa",
  ],
});

export default function MensWellnessPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Men's Wellness", url: PAGE_URL },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainLocalBusinessJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title: "Men's Wellness | Hello Gorgeous Med Spa Oswego",
              description: PAGE_DESCRIPTION,
              path: MENS_WELLNESS_PATH,
              image: GENTLEMENS_CLUB_HERO_IMAGE,
              dateModified: new Date().toISOString().split("T")[0],
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(MENS_WELLNESS_FAQS, PAGE_URL)),
        }}
      />

      <MensWellnessPageContent />
    </>
  );
}
