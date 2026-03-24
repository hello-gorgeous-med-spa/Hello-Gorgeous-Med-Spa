import type { Metadata } from "next";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  PRODUCT_CATEGORIES,
  PRODUCTS_OFFER_FOOTNOTE,
  PRODUCTS_OFFER_INTRO,
} from "@/lib/products-we-offer-catalog";
import { pageMetadata, siteJsonLd } from "@/lib/seo";

const OLYMPIA_DIRECTORY_URL = "https://www.olympiapharmacy.com/medication-directory/";

export const metadata: Metadata = pageMetadata({
  title: "Products We Offer | Compounded Rx (No Pricing)",
  description:
    "See compounded medication families Hello Gorgeous may prescribe—organized as take-home vs in-clinic. Prescription only; no prices on this page. Oswego, IL.",
  path: "/products-we-offer",
});

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-neutral-500 italic">Not emphasized on this view — ask your provider.</p>;
  }
  return (
    <ul className="space-y-2.5 text-sm text-neutral-800 leading-relaxed list-disc pl-4 marker:text-[#FF2D8E]">
      {items.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}

export default function ProductsWeOfferPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />

      <Section className="relative bg-gradient-to-br from-pink-50 via-white to-rose-100">
        <div className="relative z-10">
          <FadeUp>
            <p className="text-[#E6007E] text-lg md:text-xl font-medium mb-6 tracking-wide">RX & COMPOUNDING</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-black">
              {PRODUCTS_OFFER_INTRO.headline}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-neutral-700 max-w-3xl leading-relaxed">
              {PRODUCTS_OFFER_INTRO.sub}
            </p>
            <ul className="mt-8 space-y-2 text-neutral-700 text-sm md:text-base max-w-3xl list-disc pl-5 marker:text-[#FF2D8E]">
              {PRODUCTS_OFFER_INTRO.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL}>Book a consultation</CTA>
              <Link
                href="/pharmacy-partner"
                className="inline-flex items-center justify-center min-h-[48px] px-8 py-4 rounded-full border-2 border-[#E6007E]/50 text-black font-semibold hover:bg-[#E6007E]/10 hover:border-[#E6007E] transition"
              >
                Our pharmacy partner
              </Link>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-rose-100/90 via-pink-50 to-pink-100/80 border-t border-pink-200/60">
        <div className="space-y-16 md:space-y-20">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">By category</h2>
            <p className="text-neutral-600 max-w-2xl text-sm md:text-base">
              <span className="font-semibold text-black">Take-home</span> usually means capsules, creams, troches,
              nasal sprays, or home injections after you are trained.{" "}
              <span className="font-semibold text-black">In-clinic</span> usually means IV/IM programs, draws,
              first doses, or workflows our team handles on site. Many products can be either depending on your plan —
              use this as a guide, not a guarantee.
            </p>
          </FadeUp>

          {PRODUCT_CATEGORIES.map((cat) => (
            <FadeUp key={cat.id}>
              <article>
                <h3 className="text-xl md:text-2xl font-bold text-black">{cat.title}</h3>
                {cat.blurb ? <p className="mt-2 text-sm text-neutral-600 max-w-3xl">{cat.blurb}</p> : null}
                <div className="mt-6 grid gap-4 md:gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-pink-200/90 bg-white p-5 md:p-6 shadow-md shadow-pink-900/5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#E6007E] mb-3">
                      Take-home (typical)
                    </p>
                    <BulletList items={cat.takeHome} />
                  </div>
                  <div className="rounded-2xl border border-pink-200/90 bg-white p-5 md:p-6 shadow-md shadow-pink-900/5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-rose-700 mb-3">
                      In-clinic / provider-led (typical)
                    </p>
                    <BulletList items={cat.inClinic} />
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-pink-100 to-white border-t border-pink-200/60">
        <FadeUp>
          <p className="text-neutral-700 text-sm md:text-base leading-relaxed max-w-3xl">{PRODUCTS_OFFER_FOOTNOTE}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href={OLYMPIA_DIRECTORY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:shadow-lg hover:shadow-[#FF2D8E]/25 transition"
            >
              Olympia medication directory
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <CTA href="/rx" variant="outline">
              Hello Gorgeous RX™
            </CTA>
          </div>
        </FadeUp>
      </Section>
    </>
  );
}
