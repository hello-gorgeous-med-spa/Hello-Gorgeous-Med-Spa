import type { Metadata } from "next";

import { GentlemensClubTestosteroneContent } from "@/components/gentlemens-club/GentlemensClubTestosteroneContent";
import {
  GC_TRT_DISCLAIMER,
  GC_TRT_FAQS,
  GENTLEMENS_CLUB_TESTOSTERONE_PATH,
} from "@/lib/gentlemens-club-testosterone";
import { GENTLEMENS_CLUB_HORMONES_IMAGE } from "@/lib/gentlemens-club";
import { GENTLEMENS_CLUB_PATH } from "@/lib/gentlemens-club";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE } from "@/lib/seo";

const pageUrl = `${SITE.url}${GENTLEMENS_CLUB_TESTOSTERONE_PATH}`;

export const metadata: Metadata = pageMetadata({
  title: "Testosterone & TRT Oswego IL | The Gentlemen's Club | Hello Gorgeous Med Spa",
  description:
    "Men's TRT from $200/mo — injectable, topical & enclomiphene options. Baseline labs, NP oversight by Ryan Kent FNP-BC in Oswego. Gentlemen's Club pricing, in-person care.",
  path: GENTLEMENS_CLUB_TESTOSTERONE_PATH,
});

export default function GentlemensClubTestosteronePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "The Gentlemen's Club", url: `${SITE.url}${GENTLEMENS_CLUB_PATH}` },
              { name: "Testosterone & TRT", url: pageUrl },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(GC_TRT_FAQS, pageUrl)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: "Men's Testosterone Replacement Therapy",
            description: GC_TRT_DISCLAIMER,
            url: pageUrl,
            image: `${SITE.url}${GENTLEMENS_CLUB_HORMONES_IMAGE}`,
          }),
        }}
      />
      <GentlemensClubTestosteroneContent />
    </>
  );
}
