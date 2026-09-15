import type { Metadata } from "next";

import { FormulationPeptidesPageContent } from "@/components/regen/FormulationPeptidesPageContent";
import { FORMULATION_PEPTIDE_REVIEWED } from "@/lib/regen/formulation-peptide-formulary";

const TITLE = "Compounded peptides with a legal basis";
const DESCRIPTION =
  "RE GEN RX compounded peptides in Oswego, Illinois. See which peptides have a lawful 503A pathway — and which do not — then start a visit with a licensed Illinois clinician.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://tryregenrx.com/peptides" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://tryregenrx.com/peptides",
    siteName: "REGEN RX",
    type: "website",
  },
};

export default function RegenPeptidesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: TITLE,
    description: DESCRIPTION,
    url: "https://tryregenrx.com/peptides",
    dateModified: "2026-09-14",
    about: {
      "@type": "MedicalTherapy",
      name: "Compounded peptide therapy",
    },
    publisher: {
      "@type": "MedicalBusiness",
      name: "RE GEN RX · Hello Gorgeous Med Spa",
      address: {
        "@type": "PostalAddress",
        streetAddress: "74 W. Washington Street",
        addressLocality: "Oswego",
        addressRegion: "IL",
        postalCode: "60543",
      },
    },
    lastReviewed: FORMULATION_PEPTIDE_REVIEWED,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FormulationPeptidesPageContent />
    </>
  );
}
