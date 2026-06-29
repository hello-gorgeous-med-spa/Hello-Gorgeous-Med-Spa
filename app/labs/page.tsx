import type { Metadata } from "next";

import { LabsHubPageContent } from "@/components/labs/LabsHubPageContent";
import { LABS_HUB_PATH } from "@/lib/flows";
import { LAB_HUB_HERO } from "@/lib/lab-panel-catalog";
import { SITE, breadcrumbJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${LABS_HUB_PATH}`;

export const metadata: Metadata = pageMetadata({
  title: "Labs | Cash-Pay Panels & In-House Draws | Hello Gorgeous Oswego",
  description:
    "Hello Gorgeous Labs — hormone, metabolic, and wellness panels from $199. Pay online, draw in-house at our Oswego med spa, or at Quest/LabCorp. NP-reviewed results.",
  path: LABS_HUB_PATH,
  keywords: [
    "lab testing Oswego IL",
    "in-house blood draw med spa",
    "cash pay lab panels Naperville",
    "hormone labs Fox Valley",
    "Quest LabCorp requisition Illinois",
  ],
});

export default async function LabsHubPage({
  searchParams,
}: {
  searchParams: Promise<{ panel?: string }>;
}) {
  const params = await searchParams;
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Hello Gorgeous Labs", url: PAGE_URL },
  ];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalTest",
    name: LAB_HUB_HERO.eyebrow,
    description: LAB_HUB_HERO.subtitle,
    url: PAGE_URL,
    provider: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.streetAddress,
        addressLocality: SITE.address.addressLocality,
        addressRegion: SITE.address.addressRegion,
        postalCode: SITE.address.postalCode,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <LabsHubPageContent highlightPanelId={params.panel?.trim()} />
    </>
  );
}
