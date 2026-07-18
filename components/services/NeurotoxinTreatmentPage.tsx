import { InModeTreatmentLanding } from "@/components/services/InModeTreatmentLanding";
import type { InModeTreatmentLandingContent } from "@/lib/inmode-treatment-landing";
import { breadcrumbJsonLd, faqJsonLd, SITE } from "@/lib/seo";

/** Shared server shell for Botox / Dysport / Jeuveau educational landings. */
export function NeurotoxinTreatmentPage({
  content,
  procedureName,
}: {
  content: InModeTreatmentLandingContent;
  procedureName: string;
}) {
  const pageUrl = `${SITE.url}${content.path}`;

  const medicalProcedure = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: `${procedureName} in Oswego, IL`,
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
