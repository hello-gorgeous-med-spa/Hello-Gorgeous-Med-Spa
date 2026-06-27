import type { Metadata } from "next";

import { RxLandingPageContent } from "@/components/rx/RxLandingPageContent";
import { pageMetadata, SITE } from "@/lib/seo";

const PAGE_PATH = "/rx";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

const baseMeta = pageMetadata({
  title: "Hello Gorgeous RX™ | Same-Day Rx Care | Oswego, Naperville, Aurora IL",
  description:
    "Prescription hormone, metabolic, dermatology, and peptide care with NP oversight in Oswego, IL. Same-day appointments often available — in-office or telehealth. Serving Naperville, Aurora, Plainfield, and the western suburbs.",
  path: PAGE_PATH,
  keywords: [
    "Hello Gorgeous RX",
    "medical weight loss Oswego",
    "hormone therapy Illinois",
    "peptide therapy Naperville",
    "Ryan Kent FNP",
    "GLP-1 prescription Illinois",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: `${SITE.url}/images/homepage-buyer-paths/hello-gorgeous-rx.png`,
        width: 1200,
        height: 900,
        alt: "Hello Gorgeous RX — medical optimization programs",
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [`${SITE.url}/images/homepage-buyer-paths/hello-gorgeous-rx.png`],
  },
};

export default function RxPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: "Hello Gorgeous RX™",
    description:
      "Hello Gorgeous RX™ — hormone, metabolic, dermatology, and peptide prescriptions with NP oversight. Same-day and next-day appointments often available in Oswego, IL; telehealth and in-office. Serves Naperville, Aurora, Plainfield, and surrounding areas.",
    url: PAGE_URL,
    address: {
      "@type": "PostalAddress",
      streetAddress: "74 W. Washington Street",
      addressLocality: "Oswego",
      addressRegion: "IL",
      postalCode: "60543",
      addressCountry: "US",
    },
    telephone: "(630) 636-6193",
    medicalSpecialty: ["Hormone Therapy", "Medical Weight Loss", "Dermatology"],
    availableService: [
      {
        "@type": "TelehealthService",
        name: "Virtual Medical Evaluation",
        description:
          "Telehealth consultations for hormone therapy, weight loss, and prescription dermatology. Same-day scheduling when available.",
      },
      {
        "@type": "MedicalProcedure",
        name: "In-office Rx consultation",
        description:
          "Same-day and next-day prescription care appointments in Oswego when the schedule allows — hormones, metabolic, dermatology, peptides.",
      },
    ],
    physician: {
      "@type": "Physician",
      name: "Ryan Kent, FNP-BC",
      medicalSpecialty: "Family Nurse Practitioner",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RxLandingPageContent />
    </>
  );
}
