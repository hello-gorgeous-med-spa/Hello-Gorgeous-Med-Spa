import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FadeUp, Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { PeppiHeroSection } from "@/components/PeppiHeroSection";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Peptide Therapy | Bioidentical Peptides for Healing, Energy & Longevity",
  description:
    "Explore peptide therapy at Hello Gorgeous Med Spa—BPC-157, GHK-Cu, NAD+, Tesamorelin, CJC-1295, Semaglutide, Tirzepatide, and more. Tissue repair, fat loss, skin rejuvenation, and recovery support. Oswego, IL.",
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
        <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-100 via-pink-50 to-white" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-200/30 via-transparent to-transparent" />
        <div className="relative z-10">
          <FadeUp>
            <Link
              href="/services/hormones-wellness"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D8E]/10 border border-[#FF2D8E]/20 mb-6 hover:bg-[#FF2D8E]/20 transition-colors"
            >
              <span className="text-xl">🧬</span>
              <span className="text-[#FF2D8E] text-sm font-medium">Hormones & Wellness</span>
              <svg className="w-4 h-4 text-[#FF2D8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-[#FF2D8E]">
                Peptide Therapy
              </span>
            </h1>
            <p className="mt-2 text-lg text-black/70">Education & Treatment in Oswego, IL</p>
            <p className="mt-6 text-xl md:text-2xl text-black/80 max-w-3xl leading-relaxed">
              Support healing, energy, fat loss, skin rejuvenation, and recovery with clinician-guided peptide therapy. 
              We offer BPC-157, GHK-Cu, NAD+, CJC-1295, Ipamorelin, Tesamorelin, Semaglutide, Tirzepatide, and more—all personalized to your goals.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL} variant="gradient" className="text-lg px-8 py-4 shadow-xl shadow-[#FF2D8E]/20">
                Book Peptide Consultation
              </CTA>
              <CTA href="#peppi" variant="outline" className="text-lg px-8 py-4">
                Ask Peppi About Peptides
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Peppi AI Expert Section */}
      <Section id="peppi" className="bg-gradient-to-b from-white via-fuchsia-50/30 to-white">
        <FadeUp>
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D8E]/10 border border-[#FF2D8E]/30 mb-4">
              <span className="text-lg">🤖</span>
              <span className="text-[#FF2D8E] text-sm font-semibold uppercase tracking-wider">AI Peptide Expert</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#FF2D8E]">
              Your Complete Peptide Education Center
            </h2>
            <p className="mt-3 text-lg text-black/70 max-w-2xl mx-auto">
              Learn about BPC-157, Semaglutide, Sermorelin, Tirzepatide, and more from our Olympia-trained AI
            </p>
          </div>
        </FadeUp>
        <FadeUp delayMs={100}>
          <div className="max-w-5xl mx-auto">
            <PeppiHeroSection />
          </div>
        </FadeUp>
      </Section>

      {/* Clinical Info Section */}
      <Section className="bg-gradient-to-b from-fuchsia-50/50 via-white to-fuchsia-50/50">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D8E]/10 border border-[#FF2D8E]/20 mb-4">
              <span className="text-[#FF2D8E] text-sm font-semibold uppercase tracking-wider">Clinical Info</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#FF2D8E]">
              Peptide Therapies at Hello Gorgeous
            </h2>
            <p className="mt-4 text-black/80 max-w-2xl mx-auto">
              All peptides sourced from Olympia Pharmacy—an FDA-registered 503A/503B compounding facility
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FadeUp delayMs={60}>
            <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-fuchsia-50 to-white h-full">
              <h3 className="text-lg font-bold text-[#FF2D8E] mb-3 flex items-center gap-2">
                <span>🩹</span> Healing & Recovery
              </h3>
              <ul className="text-black/80 text-sm space-y-2">
                <li><strong className="text-black">BPC-157:</strong> Gut healing, tissue repair, injury recovery</li>
                <li><strong className="text-black">TB-500:</strong> Muscle repair, inflammation reduction</li>
              </ul>
              <p className="text-black/60 text-xs mt-3">
                Often combined for synergistic healing benefits.
              </p>
            </div>
          </FadeUp>
          <FadeUp delayMs={80}>
            <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-fuchsia-50 to-white h-full">
              <h3 className="text-lg font-bold text-[#FF2D8E] mb-3 flex items-center gap-2">
                <span>⚡</span> Growth & Anti-Aging
              </h3>
              <ul className="text-black/80 text-sm space-y-2">
                <li><strong className="text-black">Sermorelin:</strong> Natural GH optimization, sleep, recovery</li>
                <li><strong className="text-black">Ipamorelin:</strong> Selective GH release, minimal side effects</li>
                <li><strong className="text-black">CJC-1295:</strong> Enhanced GH/IGF-1, body composition</li>
                <li><strong className="text-black">Tesamorelin:</strong> Targets visceral (belly) fat</li>
              </ul>
            </div>
          </FadeUp>
          <FadeUp delayMs={100}>
            <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-fuchsia-50 to-white h-full">
              <h3 className="text-lg font-bold text-[#FF2D8E] mb-3 flex items-center gap-2">
                <span>🔥</span> Weight & Metabolism
              </h3>
              <ul className="text-black/80 text-sm space-y-2">
                <li><strong className="text-black">Semaglutide:</strong> GLP-1, appetite control, 15-20% weight loss</li>
                <li><strong className="text-black">Tirzepatide:</strong> Dual GIP/GLP-1, may exceed semaglutide</li>
                <li><strong className="text-black">AOD-9604:</strong> Targeted fat metabolism</li>
                <li><strong className="text-black">MOTS-c:</strong> Mitochondrial peptide, metabolic health</li>
              </ul>
            </div>
          </FadeUp>
          <FadeUp delayMs={120}>
            <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-fuchsia-50 to-white h-full">
              <h3 className="text-lg font-bold text-[#FF2D8E] mb-3 flex items-center gap-2">
                <span>🛡️</span> Immune & Longevity
              </h3>
              <ul className="text-black/80 text-sm space-y-2">
                <li><strong className="text-black">Thymosin Alpha-1:</strong> Immune modulation, T-cell support</li>
                <li><strong className="text-black">Epithalon:</strong> Telomere support, cellular aging</li>
              </ul>
              <p className="text-black/60 text-xs mt-3">
                For immune challenges and longevity optimization.
              </p>
            </div>
          </FadeUp>
          <FadeUp delayMs={140}>
            <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-fuchsia-50 to-white h-full">
              <h3 className="text-lg font-bold text-[#FF2D8E] mb-3 flex items-center gap-2">
                <span>💫</span> Sexual Wellness
              </h3>
              <ul className="text-black/80 text-sm space-y-2">
                <li><strong className="text-black">PT-141:</strong> Libido support for men and women</li>
              </ul>
              <p className="text-black/60 text-xs mt-3">
                Works on brain receptors (not vascular like Viagra). FDA-approved as Vyleesi.
              </p>
            </div>
          </FadeUp>
          <FadeUp delayMs={160}>
            <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-fuchsia-50 to-white h-full">
              <h3 className="text-lg font-bold text-[#FF2D8E] mb-3 flex items-center gap-2">
                <span>⚠️</span> Safety & Requirements
              </h3>
              <ul className="text-black/80 text-sm space-y-1 list-disc list-inside">
                <li>Medical consultation required</li>
                <li>Not for pregnancy/breastfeeding</li>
                <li>Some require lab monitoring</li>
                <li>Injections taught at consultation</li>
              </ul>
              <p className="text-black/60 text-xs mt-3">
                We screen thoroughly and create personalized protocols.
              </p>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Peptide Infographic Gallery */}
      <Section className="bg-white">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D8E]/10 border border-[#FF2D8E]/20 mb-4">
              <span className="text-[#FF2D8E] text-sm font-semibold uppercase tracking-wider">Peptide Education</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#FF2D8E]">
              Your Peptide Guide
            </h2>
            <p className="mt-4 text-black/70 max-w-2xl mx-auto">
              Explore what each peptide supports—healing, metabolism, skin, sleep, and beyond. 
              All treatment decisions require a medical consultation.
            </p>
          </div>
        </FadeUp>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {PEPTIDE_IMAGES.map((img, idx) => (
            <FadeUp key={img.src} delayMs={60 * idx}>
              <div className="rounded-2xl overflow-hidden border-2 border-black bg-white hover:border-[#FF2D8E]/50 hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-[4/3] md:aspect-[3/2] w-full bg-gradient-to-br from-fuchsia-50 to-white">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={idx < 2}
                  />
                </div>
                <div className="p-4 border-t-2 border-black bg-fuchsia-50/50">
                  <p className="text-sm font-bold text-black">{img.title}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delayMs={200}>
          <p className="mt-8 text-center text-sm text-black/50 max-w-2xl mx-auto">
            * These statements have not been evaluated by the FDA. Peptide therapy requires medical evaluation and prescription. 
            Individual results vary. Consult with a provider to determine if peptides are right for you.
          </p>
        </FadeUp>
      </Section>

      {/* Olympia Pharmacy Partner */}
      <Section className="bg-gradient-to-b from-white via-violet-50/30 to-white">
        <FadeUp>
          <div className="max-w-3xl mx-auto rounded-2xl border-2 border-black bg-gradient-to-br from-violet-50 to-white p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-violet-600 mb-2">💊 Our Compounding Partner</h3>
                <p className="text-black/80 text-sm leading-relaxed">
                  We source peptide formulations from <strong className="text-black">Olympia Pharmacy</strong>—a licensed 503A/503B facility. 
                  Browse their full medication directory for peptides, hormones, weight loss, IV therapy, and more.
                </p>
              </div>
              <a
                href="https://www.olympiapharmacy.com/medication-directory/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-700 font-semibold hover:bg-violet-500/30 transition"
              >
                Browse Olympia Directory
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <Link href="/pharmacy-partner" className="mt-4 inline-block text-sm text-violet-600/80 hover:text-violet-600">
              Learn more about our pharmacy partner →
            </Link>
          </div>
        </FadeUp>
      </Section>

      {/* CTA */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-100 via-pink-100 to-fuchsia-100" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-[#FF2D8E] mb-6">
              Ready to Explore Peptide Therapy?
            </h2>
            <p className="text-xl text-black/80 mb-8">
              Book a consultation with our clinical team to discuss your goals and whether peptides are right for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="gradient" className="text-lg px-10 py-4 shadow-xl shadow-[#FF2D8E]/25">
                Book Consultation
              </CTA>
              <a
                href="tel:630-636-6193"
                className="inline-flex items-center justify-center px-10 py-4 border-2 border-black text-black font-medium rounded-full hover:bg-black hover:text-white transition"
              >
                📞 Call 630-636-6193
              </a>
            </div>
            <p className="mt-6 text-sm text-black/50">
              📍 Serving Oswego, Naperville, Aurora & Plainfield
            </p>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
