import type { Metadata } from "next";

import { MedicalOptimizationPageContent } from "@/components/medical/MedicalOptimizationPageContent";
import {
  MEDICAL_OPTIMIZATION_FAQS,
  MEDICAL_OPTIMIZATION_PATH,
  MEDICAL_TEAM_IMAGE,
} from "@/lib/medical-optimization";
import { GLP1_RETAIL_PROGRAM, PEPTIDE_RETAIL_FROM_MONTHLY_USD } from "@/lib/peptide-retail-pricing";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import {
  SITE,
  pageMetadata,
  siteJsonLd,
  mainLocalBusinessJsonLd,
  breadcrumbJsonLd,
  webPageJsonLd,
  faqJsonLd,
} from "@/lib/seo";

const PAGE_URL = `${SITE.url}${MEDICAL_OPTIMIZATION_PATH}`;
const PAGE_DESCRIPTION = `Medical optimization in Oswego, IL — hormone therapy, GLP-1 weight loss from $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo, peptides from $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo, IV & NAD+. NP-supervised by Ryan Kent, FNP-BC. Naperville, Aurora, Plainfield.`;

export const metadata: Metadata = pageMetadata({
  title: "Medical Optimization Oswego IL | Hormones, GLP-1, Peptides & IV | Hello Gorgeous",
  description: PAGE_DESCRIPTION,
  path: MEDICAL_OPTIMIZATION_PATH,
});

export default function MedicalOptimizationPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Medical Optimization", url: PAGE_URL },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
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
              title: "Medical Optimization Services | Hello Gorgeous Med Spa Oswego",
              description: PAGE_DESCRIPTION,
              path: MEDICAL_OPTIMIZATION_PATH,
              image: MEDICAL_TEAM_IMAGE,
              dateModified: new Date().toISOString().split("T")[0],
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(MEDICAL_OPTIMIZATION_FAQS, PAGE_URL)),
        }}
      />

      <MedicalOptimizationPageContent />
    </>
  );
}
