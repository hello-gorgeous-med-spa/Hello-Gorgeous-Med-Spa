import type { Metadata } from "next";

import { GentlemensClubPageContent } from "@/components/gentlemens-club/GentlemensClubPageContent";
import {
  GENTLEMENS_CLUB_FAQS,
  GENTLEMENS_CLUB_HERO_IMAGE,
  GENTLEMENS_CLUB_URL,
} from "@/lib/gentlemens-club";
import { breadcrumbJsonLd, faqJsonLd, localBusinessJsonLd, SITE, siteJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "The Gentlemen's Club | Men's Wellness, TRT & Brotox | Hello Gorgeous Med Spa Oswego IL",
  description:
    "The Gentlemen's Club — Hello Gorgeous's men's wellness hub. Brotox, TRT, hormone add-ons, peptides, GLP-1 & membership from $99/mo. NP-supervised in Oswego, IL.",
  keywords: [
    "mens wellness membership oswego il",
    "gentlemens club med spa",
    "brotox membership",
    "mens hormone therapy membership",
    "peptide therapy membership oswego",
    "gift brotox fathers day",
  ],
  alternates: { canonical: GENTLEMENS_CLUB_URL },
  openGraph: {
    type: "website",
    url: GENTLEMENS_CLUB_URL,
    title: "The Gentlemen's Club | Men's Wellness Membership | Hello Gorgeous Med Spa Oswego IL",
    description:
      "Exclusive wellness, aesthetics & performance support for men. Brotox, hormones, peptide therapy & recovery. $99/mo. Oswego IL.",
    siteName: SITE.name,
    images: [
      {
        url: `${SITE.url}${GENTLEMENS_CLUB_HERO_IMAGE}`,
        width: 1536,
        height: 1024,
        alt: "The Gentlemen's Club — Hello Gorgeous Med Spa Oswego IL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Gentlemen's Club | Hello Gorgeous Med Spa",
    description: "Men's wellness membership — Brotox, hormones, peptides & recovery. From $99/mo.",
    images: [`${SITE.url}${GENTLEMENS_CLUB_HERO_IMAGE}`],
  },
  robots: { index: true, follow: true },
};

export default function GentlemensClubPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "The Gentlemen's Club", url: GENTLEMENS_CLUB_URL },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd("Oswego")) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(GENTLEMENS_CLUB_FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />

      <GentlemensClubPageContent />
    </>
  );
}
