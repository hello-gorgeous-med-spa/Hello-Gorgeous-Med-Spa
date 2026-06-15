import type { Metadata } from "next";
import Link from "next/link";

import { FaqPageContent } from "@/components/faq/FaqPageContent";
import { flattenFaqPageItems, MED_SPA_FAQ_SECTIONS } from "@/lib/med-spa-faq-data";
import {
  SITE,
  SITE_OG_IMAGE,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteJsonLd,
} from "@/lib/seo";

const FAQ_PATH = "/faq";
const PAGE_URL = `${SITE.url}${FAQ_PATH}`;

const FLAT_FAQ = flattenFaqPageItems(MED_SPA_FAQ_SECTIONS);

const baseMeta = pageMetadata({
  title: "Med Spa FAQ Oswego IL — Botox, Morpheus8, Weight Loss, Hormones & More",
  description:
    "Answers about Hello Gorgeous Med Spa in Oswego, IL: Morpheus8 Burst, Quantum RF, Solaria CO₂, Botox & fillers, GLP-1 weight loss, BHRT, CareCredit/Cherry, booking, safety, and what makes us Best of Oswego. Serving Naperville, Aurora, Plainfield & Kendall County.",
  path: FAQ_PATH,
  keywords: [
    "med spa FAQ Oswego IL",
    "Hello Gorgeous FAQ",
    "Botox Oswego questions",
    "Morpheus8 Oswego",
    "medical spa Naperville Aurora",
    "GLP-1 weight loss Oswego",
    "laser resurfacing FAQ Illinois",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: "Hello Gorgeous Med Spa — FAQ" }],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [SITE_OG_IMAGE],
  },
};

export default function MedSpaFaqPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "FAQ", url: PAGE_URL },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FLAT_FAQ, PAGE_URL)) }}
      />

      <FaqPageContent
        seoIntro={
          <section className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 py-8 text-center border-b-4 border-black bg-white/80">
            <p className="text-black/80 font-medium leading-relaxed">
              40+ answers about Botox, dermal fillers, Morpheus8 Burst, Quantum RF, Solaria CO₂, GLP-1 weight loss,
              hormone therapy, Cherry &amp; CareCredit financing, and booking at Hello Gorgeous Med Spa in Oswego —
              serving Naperville, Aurora, Plainfield, Yorkville, and Montgomery.
            </p>
            <p className="mt-4 text-sm font-semibold text-black/70 flex flex-wrap justify-center gap-x-4 gap-y-2">
              <Link href="/about" className="text-[#E6007E] hover:underline">
                Meet Dani &amp; Ryan
              </Link>
              <Link href="/services/injectables" className="text-[#E6007E] hover:underline">
                Injectables menu
              </Link>
              <Link href="/book" className="text-[#E6007E] hover:underline">
                Book online
              </Link>
            </p>
          </section>
        }
      />
    </>
  );
}
