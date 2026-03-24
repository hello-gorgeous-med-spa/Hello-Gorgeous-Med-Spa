import type { Metadata } from "next";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { ProductsWeOfferShowcaseGate } from "@/components/ProductsWeOfferShowcaseGate";
import { PRODUCT_OFFER_CATEGORIES } from "@/lib/products-we-offer-cards";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { PRODUCTS_OFFER_FOOTNOTE, PRODUCTS_OFFER_INTRO } from "@/lib/products-we-offer-catalog";
import {
  PRODUCTS_OFFER_PAGE_PATH,
  productsOfferItemListJsonLd,
  productsOfferMetaKeywords,
  productsOfferPageFaqs,
} from "@/lib/products-we-offer-seo";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteJsonLd,
  SITE,
  webPageJsonLd,
} from "@/lib/seo";

const OLYMPIA_DIRECTORY_URL = "https://www.olympiapharmacy.com/medication-directory/";

const PRODUCTS_OFFER_ABSOLUTE_TITLE =
  "Hello Gorgeous RX™ | Compounded Rx — Semaglutide, Tirzepatide, Peptides, Hormones | Oswego, IL";

const PRODUCTS_OFFER_DESCRIPTION =
  "Hello Gorgeous RX™ in Oswego, IL: compounded prescriptions we may offer after consultation — GLP-1 weight loss (semaglutide, tirzepatide, retatrutide), peptides (sermorelin, tesamorelin, PT-141), bioidentical hormones, NAD+, hair loss, sexual wellness, and vitamin injections. Prescription-only catalog; book a consult.";

const productsOfferCanonical = new URL(PRODUCTS_OFFER_PAGE_PATH, SITE.url).toString();

export const metadata: Metadata = {
  ...pageMetadata({
    title: PRODUCTS_OFFER_ABSOLUTE_TITLE,
    description: PRODUCTS_OFFER_DESCRIPTION,
    path: PRODUCTS_OFFER_PAGE_PATH,
  }),
  title: { absolute: PRODUCTS_OFFER_ABSOLUTE_TITLE },
  description: PRODUCTS_OFFER_DESCRIPTION,
  keywords: [...productsOfferMetaKeywords()],
  openGraph: {
    type: "website",
    url: productsOfferCanonical,
    title: PRODUCTS_OFFER_ABSOLUTE_TITLE,
    description: PRODUCTS_OFFER_DESCRIPTION,
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: PRODUCTS_OFFER_ABSOLUTE_TITLE,
    description: PRODUCTS_OFFER_DESCRIPTION,
  },
};

export default async function ProductsWeOfferPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const initialCategoryId =
    cat && PRODUCT_OFFER_CATEGORIES.some((c) => c.id === cat) ? cat : undefined;

  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Hello Gorgeous RX — Products we offer", url: productsOfferCanonical },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title: PRODUCTS_OFFER_ABSOLUTE_TITLE,
              description: PRODUCTS_OFFER_DESCRIPTION,
              path: PRODUCTS_OFFER_PAGE_PATH,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productsOfferItemListJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(productsOfferPageFaqs())) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />

      <Section className="relative bg-white py-14 md:py-20">
        <div className="max-w-[1060px] mx-auto w-full">
          <FadeUp>
            <p className="text-[0.72rem] tracking-[0.12em] uppercase text-[#E6007E] font-medium font-sans mb-2">
              Rx &amp; compounding
            </p>
            <p className="font-sans text-base md:text-lg text-black/85 leading-relaxed max-w-3xl">
              <span className="font-medium text-[#E6007E]">Hello Gorgeous RX™</span> is our clinician-managed compounded
              prescription program (Oswego, IL). {PRODUCTS_OFFER_INTRO.sub}
            </p>
            <ul className="mt-6 space-y-2 text-black/80 text-sm md:text-base max-w-3xl list-disc pl-5 marker:text-[#E6007E] font-sans font-light">
              {PRODUCTS_OFFER_INTRO.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL}>Book a consultation</CTA>
              <a
                href={OLYMPIA_DIRECTORY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[48px] px-8 py-4 rounded-full border-2 border-[#E6007E]/50 text-black font-semibold hover:bg-[#E6007E]/10 hover:border-[#E6007E] transition font-sans text-sm uppercase tracking-wide"
              >
                Olympia medication directory
              </a>
            </div>
          </FadeUp>

          <div className="mt-14 md:mt-16 pt-12 md:pt-14 border-t border-[#E6007E]/20">
            <ProductsWeOfferShowcaseGate initialCategoryId={initialCategoryId} />
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-pink-50 to-white border-t border-[#E6007E]/15">
        <FadeUp>
          <p className="text-black/80 text-sm md:text-base leading-relaxed max-w-3xl font-sans font-light">
            {PRODUCTS_OFFER_FOOTNOTE}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href={OLYMPIA_DIRECTORY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-4 rounded-full bg-gradient-to-r from-[#E6007E] to-[#FF2D8E] text-white font-semibold hover:shadow-lg hover:shadow-[#FF2D8E]/25 transition font-sans text-sm"
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
