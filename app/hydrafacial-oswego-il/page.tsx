import type { Metadata } from "next";

import { HydraFacialOswegoPageContent } from "@/components/hydrafacial/HydraFacialOswegoPageContent";
import { HYDRAFACIAL_FAQS } from "@/lib/hydrafacial-marketing";
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "HydraFacial in Oswego, IL | Deep Cleanse & Glow | Hello Gorgeous Med Spa",
  description:
    "HydraFacial with dermaplaning in Oswego, IL at Hello Gorgeous Med Spa. Cleanse, extract, hydrate, and glow in one treatment. Glow Facial Membership $99/mo. Free consultations.",
  keywords: [
    "hydrafacial oswego il",
    "hydrafacial near me oswego",
    "hydrafacial oswego illinois",
    "dermaplaning oswego il",
    "facial near me oswego",
    "hydrafacial with dermaplaning oswego",
    "best facial oswego il",
    "glow facial oswego",
    "hydrafacial membership oswego",
    "hydrafacial near naperville",
    "deep cleansing facial oswego",
    "medical grade facial oswego il",
  ],
  alternates: { canonical: `${SITE.url}/hydrafacial-oswego-il` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/hydrafacial-oswego-il`,
    title: "HydraFacial in Oswego, IL | Hello Gorgeous Med Spa",
    description:
      "Medical-grade HydraFacial with dermaplaning in Oswego. Glow Facial Membership $99/mo. Free consultations.",
    siteName: SITE.name,
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
