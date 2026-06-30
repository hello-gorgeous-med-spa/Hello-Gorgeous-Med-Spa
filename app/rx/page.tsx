import type { Metadata } from "next";

import { RegenSiteLanding } from "@/components/regen/RegenSiteLanding";
import { REGEN_SITE } from "@/lib/regen-site";
import { pageMetadata, SITE } from "@/lib/seo";

const PAGE_PATH = "/rx";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

const baseMeta = pageMetadata({
  title: `${REGEN_SITE.fullName} | Medical Prescriptions · Oswego, IL`,
  description:
    "RE GEN — the prescription arm of Hello Gorgeous Med Spa. NP-directed medical weight loss, peptides, hormones, and labs. 100% online. Flat $30 shipping.",
  path: PAGE_PATH,
  keywords: [
    "RE GEN",
    "Hello Gorgeous RX",
    "medical weight loss Oswego",
    "GLP-1 Illinois",
    "tirzepatide prescription",
    "semaglutide",
    "peptide therapy",
    "hormone therapy",
    "Ryan Kent FNP",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: `${SITE.url}/images/regen/brand/regen-logo-primary.png`,
        width: 1024,
        height: 576,
        alt: "RE GEN by Hello Gorgeous Med Spa",
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [`${SITE.url}/images/regen/brand/regen-logo-primary.png`],
  },
};

export default function RxPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: REGEN_SITE.fullName,
    description:
      "RE GEN — the medical-prescription arm of Hello Gorgeous Med Spa. NP-directed weight loss, peptide, hormone, and lab services. 100% online with flat $30 shipping.",
    url: PAGE_URL,
    address: {
      "@type": "PostalAddress",
      streetAddress: REGEN_SITE.address.street,
      addressLocality: REGEN_SITE.address.city,
      addressRegion: REGEN_SITE.address.state,
      postalCode: REGEN_SITE.address.zip,
      addressCountry: "US",
    },
    telephone: REGEN_SITE.phone,
    medicalSpecialty: ["Medical Weight Loss", "Hormone Therapy", "Peptide Therapy"],
    availableService: [
      {
        "@type": "MedicalProcedure",
        name: "GLP-1 Weight Loss Program",
        description: "Compounded tirzepatide and semaglutide for medical weight loss.",
      },
      {
        "@type": "MedicalProcedure",
        name: "Peptide Therapy",
        description: "BPC-157, sermorelin, NAD+ and 22+ peptide protocols.",
      },
      {
        "@type": "MedicalProcedure",
        name: "Hormone Optimization",
        description: "HRT for men and women — testosterone, estrogen, progesterone.",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RegenSiteLanding />
    </>
  );
}
