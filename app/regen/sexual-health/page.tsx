import type { Metadata } from "next";

import { FormulationSexualHealthPageContent } from "@/components/regen/FormulationSexualHealthPageContent";

const TITLE = "Intimate health, individualized";
const DESCRIPTION =
  "RE GEN RX partners with Formulation Compounding Center for men’s and women’s sexual-health compounds — custom strengths, combinations, and routes when a licensed Illinois clinician decides it is appropriate.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://tryregenrx.com/sexual-health" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://tryregenrx.com/sexual-health",
    siteName: "REGEN RX",
    type: "website",
  },
};

export default function RegenSexualHealthPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: TITLE,
    description: DESCRIPTION,
    url: "https://tryregenrx.com/sexual-health",
    dateModified: "2026-09-14",
    about: { "@type": "MedicalTherapy", name: "Compounded sexual health therapy" },
    publisher: {
      "@type": "MedicalBusiness",
      name: "RE GEN RX · Hello Gorgeous Med Spa",
    },
    mention: {
      "@type": "Organization",
      name: "Formulation Compounding Center",
      url: "https://formulationrx.com/sexual-health/",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FormulationSexualHealthPageContent />
    </>
  );
}
