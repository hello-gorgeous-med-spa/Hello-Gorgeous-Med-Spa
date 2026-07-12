import type { Metadata } from "next";

import { OswegoSpecialsPageContent } from "@/components/marketing/OswegoSpecialsPageContent";
import {
  LASER_59_VALID_UNTIL_ISO,
  LASH_89_STARTS,
  MARISSA_FLYER_IMAGE,
  OSWEGO_SPECIALS_FAQS,
  OSWEGO_SPECIALS_PATH,
  OSWEGO_SPECIALS_SEO,
  OSWEGO_SPECIALS_VALID_THROUGH,
} from "@/lib/oswego-specials";
import {
  SITE,
  siteJsonLd,
  localBusinessJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: OSWEGO_SPECIALS_SEO.title,
  description: OSWEGO_SPECIALS_SEO.description,
  keywords: [...OSWEGO_SPECIALS_SEO.keywords],
  alternates: { canonical: `${SITE.url}${OSWEGO_SPECIALS_PATH}` },
  openGraph: {
    type: "website",
    url: `${SITE.url}${OSWEGO_SPECIALS_PATH}`,
    title: "Marissa’s New Services | Hello Gorgeous Med Spa Oswego",
    description: OSWEGO_SPECIALS_SEO.description,
    siteName: SITE.name,
    images: [{ url: `${SITE.url}${MARISSA_FLYER_IMAGE}` }],
  },
  robots: { index: true, follow: true },
};

export default function OswegoSpecialsPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Specials", url: `${SITE.url}/specials` },
    { name: "Oswego Specials", url: `${SITE.url}${OSWEGO_SPECIALS_PATH}` },
  ];

  const offersSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Marissa’s new services at Hello Gorgeous Med Spa Oswego — laser through ${OSWEGO_SPECIALS_VALID_THROUGH}`,
    itemListElement: [
      {
        "@type": "Offer",
        position: 1,
        name: "HydraFacial + Dermaplaning with Marissa",
        price: "129",
        priceCurrency: "USD",
        description: "HydraFacial, dermaplaning, oxygen spray, and 2 premium add-ons",
        url: `${SITE.url}/hydrafacial-oswego-il`,
        availability: "https://schema.org/InStock",
        priceValidUntil: "2026-12-31",
      },
      {
        "@type": "Offer",
        position: 2,
        name: "Full Set Eyelash Extensions",
        price: "89",
        priceCurrency: "USD",
        description: `Full set with Marissa Murray — beginning ${LASH_89_STARTS}`,
        url: `${SITE.url}${OSWEGO_SPECIALS_PATH}#lashes`,
        availability: "https://schema.org/PreOrder",
        priceValidUntil: "2026-12-31",
      },
      {
        "@type": "Offer",
        position: 3,
        name: "Laser Hair Removal — Any Listed Area",
        price: "59",
        priceCurrency: "USD",
        description:
          "Face, neck/chin, underarm, upper legs, lower legs, back, bikini, Brazilian — $59 per session",
        url: `${SITE.url}${OSWEGO_SPECIALS_PATH}#laser`,
        availability: "https://schema.org/InStock",
        priceValidUntil: LASER_59_VALID_UNTIL_ISO,
      },
      {
        "@type": "Offer",
        position: 4,
        name: "IPL Photofacial — Zemits DuoCratus",
        price: "79",
        priceCurrency: "USD",
        description: "IPL photorejuvenation with DuoCratus filter protocol reference",
        url: `${SITE.url}${OSWEGO_SPECIALS_PATH}#ipl`,
        availability: "https://schema.org/InStock",
        priceValidUntil: LASER_59_VALID_UNTIL_ISO,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd("Oswego")) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(OSWEGO_SPECIALS_FAQS)) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }} />
      <OswegoSpecialsPageContent />
    </>
  );
}
