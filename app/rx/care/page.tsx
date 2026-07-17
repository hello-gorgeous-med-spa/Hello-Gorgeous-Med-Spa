import type { Metadata } from "next";
import Link from "next/link";

import { RxPatientCareHubContent } from "@/components/rx/RxPatientCareHubContent";
import {
  RX_PATIENT_CARE_PATH,
  RX_PATIENT_CARE_SECTIONS,
} from "@/lib/rx-patient-care-hub";
import {
  breadcrumbJsonLd,
  pageMetadata,
  SITE,
  siteJsonLd,
} from "@/lib/seo";

const PAGE_URL = `${SITE.url}${RX_PATIENT_CARE_PATH}`;

const baseMeta = pageMetadata({
  title: "RX Patient Care Hub | Refills, Add-ons & Guides | Hello Gorgeous Oswego IL",
  description:
    "Refill GLP-1, renew peptides, stack monthly add-ons, pay your invoice, and download patient guides — supervised by Ryan Kent, FNP-BC.",
  path: RX_PATIENT_CARE_PATH,
  keywords: [
    "GLP-1 refill Oswego IL",
    "tirzepatide refill Illinois",
    "semaglutide refill online",
    "peptide refill Hello Gorgeous",
    "NAD Sermorelin add-on",
    "Hello Gorgeous RX patient portal",
    "medical weight loss refill Naperville",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: `${SITE.url}/images/marketing/semaglutide-regen-vial.jpg`,
        width: 1024,
        height: 682,
        alt: "Hello Gorgeous RX Patient Care Hub",
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [`${SITE.url}/images/marketing/semaglutide-regen-vial.jpg`],
  },
};

export default function RxPatientCarePage() {
  const refillActions = RX_PATIENT_CARE_SECTIONS.flatMap((s) => s.cards);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      siteJsonLd(),
      breadcrumbJsonLd([
        { name: "Home", url: SITE.url },
        { name: "Hello Gorgeous RX", url: `${SITE.url}/rx` },
        { name: "Patient Care Hub", url: PAGE_URL },
      ]),
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: "Hello Gorgeous RX Patient Care Hub",
        description: baseMeta.description,
        isPartOf: { "@id": `${SITE.url}/#website` },
        about: {
          "@type": "MedicalBusiness",
          name: "Hello Gorgeous Med Spa",
          medicalSpecialty: ["Medical Weight Loss", "Peptide Therapy", "Hormone Therapy"],
        },
        mainEntity: {
          "@type": "ItemList",
          name: "Patient refill and care actions",
          itemListElement: refillActions.map((card, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: card.title,
            url: card.external ? card.href : `${SITE.url}${card.href}`,
            description: card.description,
          })),
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="border-b-2 border-black bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/rx" className="font-serif text-lg font-semibold text-black hover:text-[#E6007E]">
            <span className="text-[#E6007E]">Hello Gorgeous</span>
            <span className="ml-2 font-sans text-sm font-medium text-black/70">RX™ Patient Care</span>
          </Link>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link href="/glp1-refill" className="font-medium text-[#E6007E] hover:underline">
              GLP-1 refill
            </Link>
            <span className="text-black/30">|</span>
            <Link href="/peptide-request" className="text-black/70 hover:text-[#E6007E]">
              Peptide refill
            </Link>
            <span className="text-black/30">|</span>
            <Link href="/rx" className="text-black/70 hover:text-[#E6007E]">
              RX programs
            </Link>
          </div>
        </div>
      </div>

      <RxPatientCareHubContent />
    </>
  );
}
