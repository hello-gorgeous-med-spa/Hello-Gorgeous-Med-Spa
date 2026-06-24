import type { Metadata } from "next";

import { LadiesClubPageContent } from "@/components/ladies-club/LadiesClubPageContent";
import {
  LADIES_CLUB_FAQS,
  LADIES_CLUB_HERO_IMAGE,
  LADIES_CLUB_HERO_IMAGE_ALT,
  LADIES_CLUB_URL,
} from "@/lib/ladies-club";
import { breadcrumbJsonLd, faqJsonLd, localBusinessJsonLd, SITE, siteJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "The Ladies' Club | Women's Hormones, GLP-1 & Wellness | Hello Gorgeous Med Spa Oswego IL",
  description:
    "The Ladies' Club — Hello Gorgeous's women's wellness hub. BioTE hormone therapy, GLP-1 weight loss, peptides, IV therapy & memberships. Ryan Kent, FNP-BC. Oswego, IL.",
  keywords: [
    "womens hormone therapy oswego il",
    "biote pellets women naperville",
    "glp-1 weight loss women oswego",
    "perimenopause med spa illinois",
    "ladies club med spa",
    "womens wellness membership oswego",
  ],
  alternates: { canonical: LADIES_CLUB_URL },
  openGraph: {
    type: "website",
    url: LADIES_CLUB_URL,
    title: "The Ladies' Club | Women's Wellness | Hello Gorgeous Med Spa",
    description:
      "BioTE, GLP-1, peptides & IV — one NP-led home for women's wellness in Oswego IL.",
    siteName: SITE.name,
    images: [
      {
        url: `${SITE.url}${LADIES_CLUB_HERO_IMAGE}`,
        width: 1024,
        height: 567,
        alt: LADIES_CLUB_HERO_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Ladies' Club | Hello Gorgeous Med Spa",
    description: "Women's wellness hub — hormones, GLP-1, peptides & more.",
    images: [`${SITE.url}${LADIES_CLUB_HERO_IMAGE}`],
  },
  robots: { index: true, follow: true },
};

export default function LadiesClubPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "The Ladies' Club", url: LADIES_CLUB_URL },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd("Oswego")) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(LADIES_CLUB_FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />

      <LadiesClubPageContent />
    </>
  );
}
