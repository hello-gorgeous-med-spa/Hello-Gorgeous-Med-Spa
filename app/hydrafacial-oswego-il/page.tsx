import type { Metadata } from "next";

import { HydraFacialOswegoPageContent } from "@/components/hydrafacial/HydraFacialOswegoPageContent";
import { HYDRAFACIAL_FAQS } from "@/lib/hydrafacial-marketing";
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "HydraFacial in Oswego, IL | Rejuva Fresh + $129 Marissa Special | Hello Gorgeous",
  description:
    "Rejuva Fresh HydraFacial in Oswego with Marissa — $129 includes dermaplaning, oxygen spray, and 2 premium add-ons. Cleanse, extract, hydrate, glow. Zero downtime.",
  keywords: [
    "hydrafacial oswego il",
    "hydrafacial near me oswego",
    "rejuva fresh hydrafacial oswego",
    "dermaplaning oswego il",
    "hydrafacial with dermaplaning oswego",
    "best facial oswego il",
    "glow facial oswego",
    "hydrafacial membership oswego",
    "hydrafacial marissa oswego",
    "medical grade facial oswego il",
  ],
  alternates: { canonical: `${SITE.url}/hydrafacial-oswego-il` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/hydrafacial-oswego-il`,
    title: "HydraFacial in Oswego — $129 with Marissa | Hello Gorgeous",
    description:
      "Rejuva Fresh HydraFacial + dermaplaning + oxygen spray + 2 premium add-ons for $129 with Marissa.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/images/hydrafacial/rejuva-fresh-treatment-chair.jpg` }],
  },
  robots: { index: true, follow: true },
};

export default function HydrafacialOswegoPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "HydraFacial Oswego IL", url: `${SITE.url}/hydrafacial-oswego-il` },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: "HydraFacial with Dermaplaning in Oswego IL",
    description: "Medical-grade HydraFacial with dermaplaning at Hello Gorgeous Med Spa in Oswego, IL.",
    procedureType: "Cosmetic",
    bodyLocation: "Face",
    provider: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phone,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(HYDRAFACIAL_FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd("Oswego")) }} />
      <HydraFacialOswegoPageContent />
    </>
  );
}
