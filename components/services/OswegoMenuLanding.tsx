import { ServiceMenuPageLayout } from "@/components/services/ServiceMenuPageLayout";
import { getServicePageOswego } from "@/lib/service-pages-oswego";
import type { ServiceMenuConfig } from "@/lib/service-menu-types";
import { breadcrumbJsonLd, faqJsonLd, SITE } from "@/lib/seo";

/** Server component shared by the dark-menu Oswego injectable landings (Botox pattern). */
export async function OswegoMenuLanding({
  slug,
  config,
  breadcrumbName,
}: {
  slug: string;
  config: ServiceMenuConfig;
  breadcrumbName: string;
}) {
  const pageData = getServicePageOswego(slug)!;
  const pageUrl = `${SITE.url}${config.path}`;

  const medicalProcedure = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: `${pageData.serviceName} in Oswego, IL`,
    procedureType: pageData.procedureType,
    ...(pageData.bodyLocation ? { bodyLocation: pageData.bodyLocation } : {}),
    performer: { "@id": `${SITE.url}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalProcedure) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Services", url: `${SITE.url}/services` },
              { name: breadcrumbName, url: pageUrl },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(config.faqs, pageUrl)) }}
      />
      <ServiceMenuPageLayout config={config} />
    </>
  );
}
