import type { Metadata } from "next";

import { MonthlyMembershipsShowcase } from "@/components/memberships/MonthlyMembershipsShowcase";
import {
  MONTHLY_MEMBERSHIPS_FAQS,
  MONTHLY_MEMBERSHIPS_OG_IMAGE,
  MONTHLY_MEMBERSHIPS_PATH,
  MONTHLY_MEMBERSHIPS_URL,
  membershipsItemListJsonLd,
} from "@/lib/monthly-memberships-marketing";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const baseMeta = pageMetadata({
  title: "Monthly Memberships Oswego IL — Vitamin Bar, HydraFacial & Lash Plans",
  description:
    "Hello Gorgeous Med Spa monthly memberships in Oswego, IL: Glow Pass $49, Energy Unlimited $89, VIP Wellness $149, Glow Facial $99, Lash Fill $150, plus The Gentlemen's Club from $99/mo for men. Member pricing, drive-thru Vitamin Bar, HydraFacial, Brotox & hormones. Naperville, Aurora & Plainfield.",
  path: MONTHLY_MEMBERSHIPS_PATH,
  keywords: [
    "med spa membership Oswego IL",
    "Vitamin Bar membership Naperville",
    "HydraFacial membership Oswego",
    "lash fill membership Illinois",
    "Hello Gorgeous membership",
    "gentlemens club med spa oswego",
    "mens wellness membership naperville",
    "monthly wellness plan med spa",
    "B12 membership Oswego",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: MONTHLY_MEMBERSHIPS_URL,
    images: [
      {
        url: `${SITE.url}${MONTHLY_MEMBERSHIPS_OG_IMAGE}`,
        width: 1200,
        height: 1600,
        alt: "Energy Unlimited membership — Hello Gorgeous Med Spa Oswego IL",
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [`${SITE.url}${MONTHLY_MEMBERSHIPS_OG_IMAGE}`],
  },
};

export default function MonthlyMembershipsPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Monthly Memberships", url: MONTHLY_MEMBERSHIPS_URL },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(MONTHLY_MEMBERSHIPS_FAQS, MONTHLY_MEMBERSHIPS_URL)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(membershipsItemListJsonLd(MONTHLY_MEMBERSHIPS_URL)) }}
      />

      <MonthlyMembershipsShowcase />
    </>
  );
}
