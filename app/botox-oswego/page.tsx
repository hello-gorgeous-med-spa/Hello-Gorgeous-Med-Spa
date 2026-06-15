import type { Metadata } from "next";

import { ServiceMenuPageLayout } from "@/components/services/ServiceMenuPageLayout";
import { BOTOX_OSWEGO_MENU } from "@/lib/botox-oswego-menu";
import { getServicePageOswego } from "@/lib/service-pages-oswego";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${BOTOX_OSWEGO_MENU.path}`;
const pageData = getServicePageOswego("botox-oswego")!;

export const metadata: Metadata = pageMetadata({
  title: BOTOX_OSWEGO_MENU.metaTitle,
  description: BOTOX_OSWEGO_MENU.metaDescription,
  path: BOTOX_OSWEGO_MENU.path,
});

function medicalProcedureJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: `${pageData.serviceName} in Oswego, IL`,
    procedureType: pageData.procedureType,
    ...(pageData.bodyLocation ? { bodyLocation: pageData.bodyLocation } : {}),
    performer: { "@id": `${SITE.url}/#organization` },
  };
}

export default async function BotoxOswegoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalProcedureJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Services", url: `${SITE.url}/services` },
              { name: "Botox Oswego", url: PAGE_URL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(BOTOX_OSWEGO_MENU.faqs, PAGE_URL)) }}
      />
      <ServiceMenuPageLayout config={BOTOX_OSWEGO_MENU} />
    </>
  );
}
