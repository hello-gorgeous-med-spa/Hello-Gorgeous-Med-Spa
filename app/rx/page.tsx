import type { Metadata } from "next";

import { RegenLandingPageContent } from "@/components/regen/RegenLandingPageContent";
import { REGEN_BRAND, REGEN_LOGO } from "@/lib/regen-brand";
import { pageMetadata, SITE } from "@/lib/seo";

const PAGE_PATH = "/rx";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

const baseMeta = pageMetadata({
  title: `${REGEN_BRAND.fullName} | Medical Wellness · Oswego, IL`,
  description:
    "REGEN by Hello Gorgeous Med Spa — medical weight loss, labs, hormones, peptides, and wellness with NP supervision. Online intake, telehealth when needed, discreet shipping across Illinois.",
  path: PAGE_PATH,
  keywords: [
    "REGEN Hello Gorgeous",
    "medical weight loss Oswego",
    "GLP-1 Illinois",
    "hormone therapy Naperville",
    "peptide therapy",
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
        url: `${SITE.url}${REGEN_LOGO.primary}`,
        width: REGEN_LOGO.width,
        height: REGEN_LOGO.height,
        alt: REGEN_LOGO.alt,
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [`${SITE.url}${REGEN_LOGO.primary}`],
  },
};

export default function RxPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: REGEN_BRAND.fullName,
    description:
      "REGEN — prescription medical wellness including weight loss, hormone therapy, peptides, labs, and sexual health with NP oversight in Oswego, IL.",
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
    medicalSpecialty: ["Hormone Therapy", "Medical Weight Loss", "Peptide Therapy"],
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
      <RegenLandingPageContent />
    </>
  );
}
