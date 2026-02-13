import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FadeUp, Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Peptide Therapy | Bioidentical Peptides for Healing, Energy & Longevity",
  description:
    "Explore peptide therapy at Hello Gorgeous Med Spa—BPC-157, GHK-Cu, NAD+, Tesamorelin, CJC-1295, and more. Tissue repair, fat loss, skin rejuvenation, and recovery support. Oswego, IL.",
  path: "/peptides",
});

const PEPTIDE_IMAGES = [
  {
    src: "/images/peptides/peptide-therapy-overview.png",
    alt: "Peptide Therapy overview: NAD+, GHK-Cu, BPC-157, MOTS-C, IPAMORELIN/CJC-1295 benefits",
    title: "Peptide Therapy Overview",
  },
  {
    src: "/images/peptides/peptide-cheat-sheet-full.png",
    alt: "Full Peptide Cheat Sheet - AOD 9604, BPC-157, CJC, DSIP, GHK-Cu, and more peptide benefits",
    title: "Peptide Cheat Sheet",
  },
  {
    src: "/images/peptides/peptide-cheat-sheet.png",
    alt: "Peptide guide: AOD-9604, BPC-157, TB-500, KPV, VIP, SEMAX, SELANK, CJC-1295, MOTS-C, GHK-Cu, DSIP",
    title: "Peptide Guide",
  },
  {
    src: "/images/peptides/bpc157-benefits.png",
    alt: "Benefits of BPC-157: tissue regeneration, muscle repair, gut healing, neuroprotective effects",
    title: "BPC-157 Benefits",
  },
  {
    src: "/images/peptides/ghkcu-benefits.png",
    alt: "Benefits of GHK-Cu copper peptide: skin repair, hair growth, wound healing, collagen production",
    title: "GHK-Cu Benefits",
  },
  {
    src: "/images/peptides/ghkcu-vial.png",
    alt: "GHK-Cu peptide - rewind your skin's biological clock, wound healing, collagen, hair growth",
    title: "GHK-Cu Copper Peptide",
  },
  {
    src: "/images/peptides/peptide-syringes.png",
    alt: "Peptide and vitamin injections: Restore Peptide BPC157/TB500/KPV, Tesamorelin, Thymosin Alpha 1, Vitamin D, B12",
    title: "Common Peptide & Vitamin Formulations",
  },
];

export default function PeptidesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />

      {/* Hero */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/20 via-black to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent" />
        <div className="relative z-10">
          <FadeUp>
            <Link
              href="/services/hormones-wellness"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6 hover:bg-pink-500/20 transition-colors"
            >
              <span className="text-xl">🧬</span>
              <span className="text-pink-400 text-sm font-medium">Hormones & Wellness</span>
              <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500">
                Peptide Therapy
              </span>
            </h1>
            <p className="mt-2 text-lg text-gray-400">Education & Treatment in Oswego, IL</p>
            <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed">
              Support healing, energy, fat loss, skin rejuvenation, and recovery with clinician-guided peptide therapy. 
              We offer BPC-157, GHK-Cu, NAD+, CJC-1295, Ipamorelin, Tesamorelin, and more—all personalized to your goals.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL} variant="gradient" className="text-lg px-8 py-4 shadow-xl shadow-pink-500/20">
                Book Peptide Consultation
              </CTA>
              <CTA href="/services/sermorelin-growth-peptide" variant="outline" className="text-lg px-8 py-4">
                Learn About Sermorelin
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Peptide Infographic Gallery */}
      <Section>
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-4">
              <span className="text-pink-400 text-sm font-semibold uppercase tracking-wider">Peptide Education</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Your Peptide{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                Guide
              </span>
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Explore what each peptide supports—healing, metabolism, skin, sleep, and beyond. 
              All treatment decisions require a medical consultation.
            </p>
          </div>
        </FadeUp>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {PEPTIDE_IMAGES.map((img, idx) => (
            <FadeUp key={img.src} delayMs={60 * idx}>
              <div className="rounded-2xl overflow-hidden border border-gray-800 bg-black/40 hover:border-pink-500/30 transition-all duration-300">
                <div className="relative aspect-[4/3] md:aspect-[3/2] w-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={idx < 2}
                  />
                </div>
                <div className="p-4 border-t border-gray-800">
                  <p className="text-sm font-medium text-white">{img.title}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delayMs={200}>
          <p className="mt-8 text-center text-sm text-gray-500 max-w-2xl mx-auto">
            * These statements have not been evaluated by the FDA. Peptide therapy requires medical evaluation and prescription. 
            Individual results vary. Consult with a provider to determine if peptides are right for you.
          </p>
        </FadeUp>
      </Section>

      {/* CTA */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/30 via-purple-900/30 to-pink-900/30" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Explore{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                Peptide Therapy
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Book a consultation with our clinical team to discuss your goals and whether peptides are right for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="gradient" className="text-lg px-10 py-4 shadow-xl shadow-pink-500/25">
                Book Consultation
              </CTA>
              <a
                href="tel:630-636-6193"
                className="inline-flex items-center justify-center px-10 py-4 border border-white/20 text-white font-medium rounded-full hover:bg-white/10 transition"
              >
                📞 Call 630-636-6193
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              📍 Serving Oswego, Naperville, Aurora & Plainfield
            </p>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
