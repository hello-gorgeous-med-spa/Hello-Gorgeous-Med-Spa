import { InModeTreatmentLanding } from "@/components/services/InModeTreatmentLanding";
import { BOTOX_TREATMENT_LANDING } from "@/lib/botox-treatment-landing";
import { breadcrumbJsonLd, faqJsonLd, SITE } from "@/lib/seo";

/** Server wrapper for the LaserAway-style Botox educational landing. */
export function BotoxTreatmentPage() {
  const content = BOTOX_TREATMENT_LANDING;
  const pageUrl = `${SITE.url}${content.path}`;

  const medicalProcedure = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: "Botox Cosmetic in Oswego, IL",
    procedureType: "Injection",
    bodyLocation: "Face, neck",
    description: content.metaDescription,
    performer: { "@id": `${SITE.url}/#organization` },
  };

  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: content.breadcrumbName, url: pageUrl },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalProcedure) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(content.faqs, pageUrl)) }}
      />
      <InModeTreatmentLanding content={content} />
    </>
  );
}
