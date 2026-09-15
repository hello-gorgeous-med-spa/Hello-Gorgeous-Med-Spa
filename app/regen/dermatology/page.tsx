import type { Metadata } from "next";

import { FormulationDermatologyPageContent } from "@/components/regen/FormulationDermatologyPageContent";

const TITLE = "Dermatology compounded to your prescription";
const DESCRIPTION =
  "RE GEN RX patient-specific dermatology in Oswego, Illinois — brightening, acne and rosacea care, hair restoration, procedural anesthesia, and custom bases.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://tryregenrx.com/dermatology" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://tryregenrx.com/dermatology",
    siteName: "REGEN RX",
    type: "website",
  },
};

export default function RegenDermatologyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: TITLE,
    description: DESCRIPTION,
    url: "https://tryregenrx.com/dermatology",
    dateModified: "2026-09-14",
    about: { "@type": "MedicalTherapy", name: "Compounded dermatology" },
    publisher: {
      "@type": "MedicalBusiness",
      name: "RE GEN RX · Hello Gorgeous Med Spa",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FormulationDermatologyPageContent />
    </>
  );
}
