import type { Metadata } from "next";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { MED_SPA_FAQ_SECTIONS, flattenFaqPageItems } from "@/lib/med-spa-faq-data";
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

      <main className="bg-white">
        <Section className="relative bg-black text-white py-16 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95" />
          <div className="relative max-w-4xl mx-auto text-center px-4">
            <FadeUp>
              <p className="text-sm uppercase tracking-widest text-[#E6007E] font-semibold mb-4">
                Oswego · Naperville · Aurora · Plainfield
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Med Spa <span className="text-[#E6007E]">FAQ</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
                Straight answers about treatments, safety, booking, financing, and what makes Hello Gorgeous the{" "}
                <Link href="/best-med-spa-oswego-il" className="text-white underline hover:text-[#E6007E]">
                  #1 Best Med Spa in Oswego
                </Link>
                . Browse by topic or call{" "}
                <a href={`tel:${SITE.phone}`} className="text-white font-semibold hover:text-[#E6007E]">
                  {SITE.phone}
                </a>
                .
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={BOOKING_URL} variant="gradient">
                  Book a free consultation
                </CTA>
                <CTA href="/services" variant="outline">
                  View services
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Jump links — crawlable internal anchors */}
        <Section className="bg-gray-50 border-b border-black/10">
          <nav aria-label="FAQ topics" className="max-w-5xl mx-auto px-4">
            <p className="text-sm font-semibold text-black mb-4">Jump to a topic</p>
            <ul className="flex flex-wrap gap-2">
              {MED_SPA_FAQ_SECTIONS.map((sec) => (
                <li key={sec.slug}>
                  <a
                    href={`#${sec.slug}`}
                    className="inline-block text-sm px-3 py-1.5 rounded-full border border-black/15 bg-white text-black hover:border-[#E6007E] hover:text-[#E6007E] transition-colors"
                  >
                    {sec.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Section>

        {MED_SPA_FAQ_SECTIONS.map((sec) => (
          <Section key={sec.slug} id={sec.slug} className="scroll-mt-24 even:bg-gray-50/50">
            <div className="max-w-3xl mx-auto px-4">
              <FadeUp>
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">{sec.title}</h2>
                {sec.summary && <p className="text-black/70 mb-8 leading-relaxed">{sec.summary}</p>}
              </FadeUp>
              <dl className="space-y-0 border-t border-black/10">
                {sec.items.map((item) => (
                  <div key={item.question} className="border-b border-black/10">
                    <dt className="pt-6 pb-2">
                      <span className="text-lg font-semibold text-black">{item.question}</span>
                    </dt>
                    <dd className="pb-6 text-black/80 leading-relaxed">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Section>
        ))}

        <Section className="bg-[#E6007E]">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Still have questions?</h2>
            <p className="text-white/90 mb-8">
              We’re happy to walk you through options in person or by phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="white">
                Book online
              </CTA>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#E6007E] transition"
              >
                Contact us
              </Link>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
