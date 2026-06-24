import type { Metadata } from "next";

import { PeptideTherapyPageContent } from "@/components/peptides/PeptideTherapyPageContent";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { PEPTIDE_RETAIL_FROM_MONTHLY_USD } from "@/lib/peptide-retail-pricing";
import { PEPTIDES_HUB_FAQS } from "@/lib/peptide-seo-faqs";
import {
  SITE,
  pageMetadata,
  siteJsonLd,
  mainLocalBusinessJsonLd,
  breadcrumbJsonLd,
  webPageJsonLd,
  faqJsonLd,
} from "@/lib/seo";

const PEPTIDES_PATH = "/peptides";
const PEPTIDES_URL = `${SITE.url}${PEPTIDES_PATH}`;
const PEPTIDES_PAGE_DESCRIPTION = `Peptide therapy in Oswego, IL — $${PEPTIDE_CONSULT_FEE_USD} NP consult, protocols from $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo. BPC-157, Sermorelin, NAD+, GLP-1 & more. NP-supervised Hello Gorgeous RX™. Naperville, Aurora, Plainfield.`;

export const metadata: Metadata = pageMetadata({
  title: `Peptide Therapy Oswego IL | From $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo · $${PEPTIDE_CONSULT_FEE_USD} Consult | Hello Gorgeous`,
  description: PEPTIDES_PAGE_DESCRIPTION,
  path: PEPTIDES_PATH,
});

export default function PeptidesPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Peptide Therapy", url: PEPTIDES_URL },
  ];

  const peptideTherapyJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalTherapy",
    "@id": `${PEPTIDES_URL}#therapy`,
    name: "Peptide Therapy — Hello Gorgeous Med Spa Oswego, IL",
    description: PEPTIDES_PAGE_DESCRIPTION,
    alternateName: [
      "Peptide therapy Naperville IL",
      "Peptide therapy Aurora IL",
      "BPC-157 Oswego",
    ],
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: SITE.serviceAreas.map((area) => ({ "@type": "Place", name: area })),
  };

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
              title: "Peptide Therapy Oswego IL | Hello Gorgeous Med Spa",
              description: PEPTIDES_PAGE_DESCRIPTION,
              path: PEPTIDES_PATH,
              image: "/images/homepage-services/peptide-therapy-active-lifestyle.png",
              dateModified: new Date().toISOString().split("T")[0],
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(peptideTherapyJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(PEPTIDES_HUB_FAQS, PEPTIDES_URL)),
        }}
      />

      <PeptideTherapyPageContent />
    </>
  );
}
