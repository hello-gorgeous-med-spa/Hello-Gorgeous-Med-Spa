import type { Metadata } from "next";

import { ServiceMenuPageLayout } from "@/components/services/ServiceMenuPageLayout";
import { BOTOX_OSWEGO_MENU } from "@/lib/botox-oswego-menu";
import { getServicePageOswego } from "@/lib/service-pages-oswego";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd, SITE } from "@/lib/seo";
import { getLiveAggregateRating } from "@/lib/seo/google-places";

const PAGE_URL = `${SITE.url}${BOTOX_OSWEGO_MENU.path}`;
const pageData = getServicePageOswego("botox-oswego")!;

export const metadata: Metadata = pageMetadata({
  title: BOTOX_OSWEGO_MENU.metaTitle,
  description: BOTOX_OSWEGO_MENU.metaDescription,
  path: BOTOX_OSWEGO_MENU.path,
});

function medicalProcedureJsonLd(aggregateRating: { ratingValue: string; reviewCount: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: `${pageData.serviceName} in Oswego, IL`,
    procedureType: pageData.procedureType,
    ...(pageData.bodyLocation ? { bodyLocation: pageData.bodyLocation } : {}),
    performer: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      url: SITE.url,
      telephone: `+1-${SITE.phone.replace(/\D/g, "")}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.streetAddress,
        addressLocality: SITE.address.addressLocality,
        addressRegion: SITE.address.addressRegion,
        postalCode: SITE.address.postalCode,
        addressCountry: "US",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: "5",
        worstRating: "1",
      },
    },
  };
}

export default async function BotoxOswegoPage() {
  const aggregateRating = await getLiveAggregateRating();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalProcedureJsonLd(aggregateRating)) }}
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
