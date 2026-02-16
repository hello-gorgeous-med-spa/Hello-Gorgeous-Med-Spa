import type { Metadata } from "next";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata, siteJsonLd } from "@/lib/seo";

const OLYMPIA_DIRECTORY_URL = "https://www.olympiapharmacy.com/medication-directory/";

export const metadata: Metadata = pageMetadata({
  title: "Our Pharmacy Partner | Olympia Pharmacy Compounded Medications",
  description:
    "Hello Gorgeous sources compounded medications from Olympia Pharmacy—hormones, weight loss (GLP-1), peptides, IV therapy, vitamins. Licensed 503A/503B. Browse their full medication directory.",
  path: "/pharmacy-partner",
});

const OLYMPIA_CATEGORIES = [
  {
    title: "Hormones",
    description: "Biest, estradiol, progesterone, testosterone, anastrozole—compounded to your provider's specifications.",
    href: OLYMPIA_DIRECTORY_URL,
    icon: "⚖️",
    slug: "biote-hormone-therapy",
  },
  {
    title: "Weight Management",
    description: "Semaglutide, Tirzepatide, and supporting compounds for medically supervised weight loss.",
    href: OLYMPIA_DIRECTORY_URL,
    icon: "⚡",
    slug: "weight-loss-therapy",
  },
  {
    title: "Peptides",
    description: "BPC-157, CJC-1295, Ipamorelin, Tesamorelin, and other peptide formulations.",
    href: OLYMPIA_DIRECTORY_URL,
    icon: "🧬",
    slug: "peptides",
  },
  {
    title: "IV Therapy",
    description: "Myers' Cocktail, NAD+, glutathione, vitamin blends, and custom IV formulations.",
    href: OLYMPIA_DIRECTORY_URL,
    icon: "💧",
    slug: "iv-therapy",
  },
  {
    title: "Vitamin B12 Injections",
    description: "Methylcobalamin and other B12 formulations for energy and wellness.",
    href: OLYMPIA_DIRECTORY_URL,
    icon: "💉",
  },
  {
    title: "Longevity & Wellness",
    description: "Alpha lipoic acid, amino blends, and other longevity-focused compounds.",
    href: OLYMPIA_DIRECTORY_URL,
    icon: "✨",
  },
];

export default function PharmacyPartnerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 via-black to-black" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-[#FF2D8E] text-lg md:text-xl font-medium mb-6 tracking-wide">
              OUR PHARMACY PARTNER
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Olympia Pharmacy{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                Compounded Medications
              </span>
            </h1>
            <p className="mt-6 text-xl text-black max-w-3xl leading-relaxed">
              We source our compounded medications from Olympia Pharmacy—a licensed 503A and 503B facility. 
              Their full medication directory includes hormones, weight loss (GLP-1), peptides, IV therapy, vitamins, and more.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href={OLYMPIA_DIRECTORY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:shadow-lg hover:shadow-[#FF2D8E]/25 transition"
              >
                Browse Olympia Medication Directory
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <CTA href={BOOKING_URL} variant="outline">
                Book a Consultation
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Categories We Use
            </h2>
            <p className="mt-4 text-black max-w-2xl mx-auto">
              Olympia&apos;s directory covers the compounded medications we work with at Hello Gorgeous. 
              Browse by category below—or explore their full directory.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {OLYMPIA_CATEGORIES.map((cat, idx) => (
            <FadeUp key={cat.title} delayMs={60 * idx}>
              <div className="rounded-2xl border border-black bg-gradient-to-b from-black/60 to-black p-6 h-full flex flex-col">
                <span className="text-3xl mb-3 block">{cat.icon}</span>
                <h3 className="text-lg font-bold text-white">{cat.title}</h3>
                <p className="mt-2 text-sm text-black flex-1">{cat.description}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={cat.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#FF2D8E] hover:text-pink-300 underline"
                  >
                    View in directory →
                  </a>
                  {cat.slug && (
                    <Link
                      href={`/services/${cat.slug}`}
                      className="text-sm font-semibold text-black hover:text-white"
                    >
                      Learn about {cat.title.toLowerCase()} at HG
                    </Link>
                  )}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp>
          <div className="mt-12 rounded-2xl border border-[#FF2D8E]/20 bg-black/40 p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3">Why Olympia?</h3>
            <ul className="text-black space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-[#FF2D8E]">•</span>
                Licensed 503A and 503B facilities
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF2D8E]">•</span>
                Pharmaceutical-grade compounding standards
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF2D8E]">•</span>
                Custom formulations based on your provider&apos;s prescription
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF2D8E]">•</span>
                Quality and safety protocols for IV, injectable, topical, and oral medications
              </li>
            </ul>
            <p className="mt-4 text-xs text-black">
              Compounded medications are not FDA-approved. Your provider determines candidacy and dosing based on your consultation and labs.
            </p>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="mt-12 text-center">
            <p className="text-black mb-6">Ready to explore treatments?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href="/explore-care" variant="outline">
                Explore Care
              </CTA>
              <CTA href={BOOKING_URL} variant="gradient">
                Book a Consultation
              </CTA>
              <Link
                href="/clinical-partners"
                className="inline-flex items-center justify-center min-h-[48px] px-8 py-4 rounded-full border border-black text-white font-semibold hover:bg-white transition"
              >
                View All Clinical Partners
              </Link>
            </div>
          </div>
        </FadeUp>
      </Section>
    </>
  );
}
