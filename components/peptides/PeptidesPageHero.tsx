import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { HELLO_GORGEOUS_RX_START_PATH, PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import { FEATURED_CLINIC_PEPTIDES, getPeptideThumbnail } from "@/lib/peptide-featured";

export function PeptidesPageHero() {
  return (
    <Section className="relative overflow-hidden border-b-4 border-black !py-14 md:!py-20">
      {/* Soft brand wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF0F7] via-white to-fuchsia-50/40" />

      {/* Science-backed thumbnail mosaic — decorative background */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute inset-y-0 right-0 w-full md:w-[62%] lg:w-[58%]">
          <div className="grid h-full min-h-[280px] grid-cols-3 grid-rows-2">
            {FEATURED_CLINIC_PEPTIDES.map((peptide) => {
              const thumbnail = getPeptideThumbnail(peptide.slug);
              if (!thumbnail) return null;
              return (
              <div key={peptide.slug} className="relative min-h-[140px]">
                <Image
                  src={thumbnail.src}
                  alt=""
                  fill
                  className="object-cover scale-105"
                  sizes="(max-width: 768px) 33vw, 20vw"
                  priority
                />
              </div>
              );
            })}
          </div>
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to right, #FFF0F7 0%, rgba(255,240,247,0.97) 38%, rgba(255,255,255,0.88) 58%, rgba(255,255,255,0.72) 100%),
              linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,240,247,0.55) 100%)
            `,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(230,0,126,0.08)_0%,transparent_55%)]" />
      </div>

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_min(420px,38%)] lg:items-center lg:gap-12">
        <FadeUp>
          <Link
            href="/services/hormones-wellness"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-[#FF2D8E]/25 mb-6 hover:bg-[#FF2D8E]/10 transition-colors shadow-sm"
          >
            <span className="text-xl">🧬</span>
            <span className="text-[#FF2D8E] text-sm font-medium">Hormones & Wellness</span>
            <svg className="w-4 h-4 text-[#FF2D8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <p className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#E6007E] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white mb-4">
            Science-backed · NP-led · Hello Gorgeous RX™
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
            <span className="text-[#FF2D8E]">Peptide Therapy</span>
          </h1>
          <p className="mt-2 text-lg text-black/70 font-medium">
            Education &amp; treatment in Oswego, IL · Same-day peptide consults often available
          </p>
          <p className="mt-6 text-xl md:text-2xl text-black/85 max-w-3xl leading-relaxed font-medium">
            Support weight loss, hair and skin, mental clarity, and body composition with clinician-guided peptide
            therapy. BPC-157, GHK-Cu, NAD+, CJC-1295/Ipamorelin, Sermorelin, Tesamorelin, Semaglutide, Tirzepatide,
            and more — personalized for Naperville, Aurora, Plainfield, and the western suburbs.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-4">
            <CTA href={HELLO_GORGEOUS_RX_START_PATH} variant="gradient" className="text-lg px-8 py-4 shadow-xl shadow-[#FF2D8E]/20">
              Start Here — pick your peptide
            </CTA>
            <CTA href={PEPTIDE_REQUEST_PATH} variant="outline" className="text-lg px-8 py-4 border-[#E6007E] text-[#E6007E] bg-white/80 backdrop-blur">
              Request or refill
            </CTA>
            <CTA
              href="/peptide-therapy-oswego"
              variant="outline"
              className="text-lg px-8 py-4 border-[#E6007E] text-[#E6007E] bg-white/80 backdrop-blur"
            >
              Peptide therapy Oswego
            </CTA>
            <CTA
              href="/injection-menu"
              variant="outline"
              className="text-lg px-8 py-4 border-[#E6007E] text-[#E6007E] bg-white/80 backdrop-blur"
            >
              Injection Menu
            </CTA>
            <CTA href="#peptide-topics" variant="outline" className="text-lg px-8 py-4 bg-white/80 backdrop-blur">
              Browse topics
            </CTA>
            <CTA
              href="#peptide-education-gallery"
              variant="outline"
              className="text-lg px-8 py-4 border-[#E6007E] text-[#E6007E] bg-white/80 backdrop-blur"
            >
              All 22 education sheets
            </CTA>
            <CTA
              href="#patient-handouts"
              variant="outline"
              className="text-lg px-8 py-4 border-black/20 bg-white/80 backdrop-blur"
            >
              View handouts
            </CTA>
            <CTA href="#peppi" variant="outline" className="text-lg px-8 py-4 border-black/20 bg-white/80 backdrop-blur">
              Ask Peppi
            </CTA>
          </div>
        </FadeUp>

        {/* Crisp thumbnail stack — desktop accent */}
        <FadeUp delayMs={80} className="hidden lg:block">
          <div className="rounded-3xl border-4 border-black bg-white p-3 shadow-[10px_10px_0_0_rgba(230,0,126,0.35)]">
            <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">
              Our most-requested peptides
            </p>
            <div className="grid grid-cols-2 gap-2">
              {FEATURED_CLINIC_PEPTIDES.map((peptide) => {
                const thumbnail = getPeptideThumbnail(peptide.slug);
                if (!thumbnail) return null;
                return (
                <div
                  key={peptide.slug}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border-2 border-black"
                >
                  <Image
                    src={thumbnail.src}
                    alt={thumbnail.alt}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-2 pt-6">
                    <p className="text-[11px] font-bold text-white">{peptide.name}</p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}
