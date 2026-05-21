"use client";

import Link from "next/link";
import { useState } from "react";

/** Local SVG/PNG must use native img — next/image optimizer returns 400 for SVG and rejects invalid PNGs. */
function StaticImg({
  src,
  alt,
  className,
  width,
  height,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import {
  NAD_PLUS_ADDONS,
  NAD_PLUS_BOOKING_URL,
  NAD_PLUS_DISCLAIMER,
  NAD_PLUS_FAQS,
  NAD_PLUS_INJECTIONS_PATH,
  NAD_PLUS_PRICING,
  NAD_PLUS_SCIENCE_ATTRIBUTION,
} from "@/lib/nad-plus-injections";
import { REGENERATIVE_MEDICINE_PATH } from "@/lib/regenerative-medicine-nav";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  gold: "#FFD700",
  dark: "#0a0a0a",
};

const BENEFIT_CARDS = [
  {
    title: "Cellular Energy Support",
    body: "NAD+ is involved in the cellular pathways that help convert nutrients into usable energy.",
  },
  {
    title: "Mitochondrial Function",
    body: "Mitochondria help produce ATP — the cell’s main short-term energy carrier. NAD+ plays a role in those pathways.",
  },
  {
    title: "Focus & Mental Clarity",
    body: "Some clients seek NAD+ wellness injections during periods of fatigue, stress, or brain fog. Results vary.",
  },
  {
    title: "Recovery Support",
    body: "NAD+ participates in metabolism and stress-response pathways that may support general wellness and recovery.",
  },
  {
    title: "Healthy Aging Pathways",
    body: "NAD+ is studied for its connection to sirtuins, PARPs, mitochondrial function, and aging biology.",
  },
  {
    title: "Wellness Optimization",
    body: "Ideal as part of a broader plan — hydration, sleep, protein, hormones, and aesthetic wellness.",
  },
] as const;

const WHO_FOR = [
  "Busy professionals who want a quick in-office wellness visit",
  "Midlife clients optimizing energy and focus",
  "Athletes and active lifestyles seeking recovery support",
  "Clients building a structured injection series",
  "Anyone curious about cellular wellness before committing to IV NAD+",
] as const;

const VISIT_STEPS = [
  { step: "1", title: "Screening", body: "Medical history, medications, and goals with our clinical team." },
  { step: "2", title: "Injection", body: "Quick NAD+ injection in a comfortable treatment room." },
  { step: "3", title: "Monitor", body: "Brief observation; we discuss how you feel before you leave." },
  { step: "4", title: "Plan", body: "Series or stack recommendations (B12, glutathione, etc.) if appropriate." },
] as const;

export function NadPlusInjectionsLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen">
      {/* Hero */}
      <section className="relative border-b-4 border-black overflow-hidden">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 80% 20%, ${BRAND.pinkHot}44 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 10% 80%, ${BRAND.pink}33 0%, transparent 50%), linear-gradient(135deg, #0a0a0a 0%, #1a0a12 50%, #0a0a0a 100%)`,
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <p className="text-[#FFB8DC] text-xs font-bold uppercase tracking-[0.25em] mb-4">
              Oswego, IL · Clinical wellness injections
            </p>
            <h1 className="font-serif text-4xl md:text-5xl xl:text-6xl font-normal leading-tight">
              NAD+ Injection Therapy in{" "}
              <span className="text-[#FF2D8E] not-italic">Oswego, IL</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 font-light max-w-xl leading-relaxed">
              Support cellular energy, focus, and recovery with a quick wellness injection designed for busy women,
              professionals, athletes, and midlife patients who want to feel more optimized from the inside out.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <CTA href={NAD_PLUS_BOOKING_URL} variant="gradient" className="text-base px-8 py-4">
                Book NAD+ Injection
              </CTA>
              <a
                href="#science"
                className="inline-flex items-center justify-center border-2 border-white/30 text-white px-8 py-4 font-semibold rounded-xl hover:border-[#FF2D8E] hover:text-[#FFB8DC] transition-colors"
              >
                Learn the Science
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/65">
              {["Family-owned med spa", "Oswego, IL", "NP-directed wellness", "10+ years in the community"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E6007E]" />
                    {t}
                  </li>
                )
              )}
            </ul>
          </FadeUp>
          <FadeUp delayMs={80} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border-2 border-[#FF2D8E]/40 bg-black/40 overflow-hidden col-span-2">
                <StaticImg
                  src="/images/nad-plus/peptide-science-hero.png"
                  alt="Peptide and molecular science illustration for cellular wellness at Hello Gorgeous Med Spa"
                  width={1024}
                  height={682}
                  className="w-full h-auto object-cover max-h-[280px]"
                  priority
                />
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-3 overflow-hidden">
                <StaticImg
                  src="/images/marketing/nad-plus-vial-hello-gorgeous.svg"
                  alt="NAD+ wellness injection vial at Hello Gorgeous Med Spa"
                  width={200}
                  height={200}
                  className="w-full h-auto mx-auto max-h-[140px] object-contain"
                />
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-3 overflow-hidden">
                <StaticImg
                  src="/images/nad-plus/nad-molecule-structure.svg"
                  alt="NAD+ molecular structure diagram"
                  width={200}
                  height={140}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Quick facts */}
      <div className="border-b border-white/10 bg-[#111] py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm text-white/70">
          {["~15 min visit", "Injection — not IV", "Screening required", "Stacks with B12 & glutathione"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <span className="text-[#FFD700]">✦</span> {t}
            </span>
          ))}
        </div>
      </div>

      {/* What is NAD+ */}
      <Section id="science" className="scroll-mt-24 py-16 md:py-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4">
          <FadeUp>
            <h2 className="font-serif text-3xl md:text-4xl text-[#FFB8DC] mb-4">The molecule behind cellular energy</h2>
            <div className="rounded-3xl border-4 border-black bg-gradient-to-br from-[#1a0a12] to-black p-8 md:p-10 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <p className="text-white/85 text-lg leading-relaxed font-medium">
                <strong className="text-white">NAD+</strong> (nicotinamide adenine dinucleotide) is a coenzyme involved in
                many cellular reactions, especially energy metabolism. It helps the body convert nutrients into usable
                cellular energy and is involved in pathways related to mitochondrial function, enzymes linked to DNA repair
                signaling, and aging biology. NAD+ levels and NAD+-dependent signaling are widely studied in metabolic and
                longevity research.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Cellular Energy", "Mitochondrial Function", "Healthy Aging Pathways"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-[#FF2D8E]/50 bg-[#FF2D8E]/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#FFB8DC]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Science strip */}
      <Section className="py-14 md:py-18 border-b border-white/10 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto px-4">
          <FadeUp>
            <h2 className="text-center font-serif text-3xl md:text-4xl mb-3">The Science, Made Beautiful</h2>
            <p className="text-center text-white/60 max-w-2xl mx-auto mb-10 font-medium">
              Harvard longevity science meets Hello Gorgeous glam — educational visuals with conservative wellness framing.
            </p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "NAD+ Molecule",
                src: "/images/nad-plus/nad-molecule-structure.svg",
                alt: "NAD+ molecular structure diagram",
                caption: NAD_PLUS_SCIENCE_ATTRIBUTION[0].source,
              },
              {
                title: "Mitochondria",
                src: "/images/nad-plus/mitochondria-energy.svg",
                alt: "Illustration of mitochondria involved in ATP energy production",
                caption: NAD_PLUS_SCIENCE_ATTRIBUTION[2].source,
              },
              {
                title: "Cellular Respiration",
                src: "/images/nad-plus/cellular-energy-pathway.svg",
                alt: "Diagram showing nutrients, NAD+, mitochondria, and ATP cellular energy",
                caption: NAD_PLUS_SCIENCE_ATTRIBUTION[1].source,
              },
            ].map((card, i) => (
              <FadeUp key={card.title} delayMs={i * 40}>
                <div className="rounded-3xl border-2 border-white/15 bg-white/5 backdrop-blur overflow-hidden h-full flex flex-col">
                  <div className="p-4 bg-black/40">
                    <StaticImg src={card.src} alt={card.alt} width={400} height={220} className="w-full h-auto rounded-xl" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-[#FF2D8E] text-lg">{card.title}</h3>
                    <p className="mt-2 text-xs text-white/45 flex-1">{card.caption}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Why levels matter */}
      <Section className="py-14 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeUp>
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Why NAD+ levels matter</h2>
            <p className="text-white/80 text-lg leading-relaxed font-medium">
              Research suggests NAD+ biology is connected to aging pathways, stress, and how cells respond to metabolic
              demand. Wellness injections are one way clients explore support for energy and focus — always with screening,
              realistic expectations, and results that vary person to person.
            </p>
            <p className="mt-6 text-sm text-white/50">
              Prefer a longer visit? Compare with{" "}
              <Link href="/nad-iv-oswego" className="text-[#FFB8DC] underline hover:text-[#FF2D8E]">
                NAD+ IV therapy in Oswego
              </Link>
              .
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* Benefits */}
      <Section className="py-16 border-b border-white/10 bg-gradient-to-b from-[#1a0a12] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4">
          <FadeUp>
            <h2 className="text-center font-serif text-3xl md:text-4xl mb-12">Wellness goals we hear most often</h2>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFIT_CARDS.map((card, i) => (
              <FadeUp key={card.title} delayMs={i * 30}>
                <div className="h-full rounded-2xl border border-[#FF2D8E]/30 bg-white/5 p-6 hover:border-[#FF2D8E] transition-colors">
                  <h3 className="font-bold text-[#FFB8DC] text-lg">{card.title}</h3>
                  <p className="mt-3 text-sm text-white/75 leading-relaxed">{card.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Who + visit */}
      <Section className="py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
          <FadeUp>
            <h2 className="font-serif text-3xl text-[#FF2D8E] mb-6">Who it&apos;s for</h2>
            <ul className="space-y-3">
              {WHO_FOR.map((item) => (
                <li key={item} className="flex gap-3 text-white/80">
                  <span className="text-[#E6007E] font-bold">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delayMs={40}>
            <h2 className="font-serif text-3xl text-[#FF2D8E] mb-6">Your visit</h2>
            <div className="space-y-4">
              {VISIT_STEPS.map((s) => (
                <div key={s.step} className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6007E] font-black text-sm">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-bold text-white">{s.title}</p>
                    <p className="text-sm text-white/65 mt-1">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Pricing */}
      <Section className="py-16 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4">
          <FadeUp>
            <h2 className="text-center font-serif text-3xl md:text-4xl mb-4">Pricing</h2>
            <p className="text-center text-white/55 text-sm mb-10 max-w-lg mx-auto">
              Pricing shown for transparency — your provider confirms the right plan at consult.
            </p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {NAD_PLUS_PRICING.map((tier, i) => (
              <FadeUp key={tier.id} delayMs={i * 35}>
                <div
                  className={`h-full rounded-3xl border-4 p-6 flex flex-col ${
                    "highlight" in tier && tier.highlight
                      ? "border-[#FF2D8E] bg-gradient-to-br from-[#2d1020] to-black shadow-[6px_6px_0_0_rgba(255,45,142,0.4)]"
                      : "border-black bg-[#141414]"
                  }`}
                >
                  <h3 className="font-bold text-lg text-white">{tier.name}</h3>
                  <p className="mt-4 text-4xl font-black text-[#FF2D8E]">{tier.price}</p>
                  <p className="mt-4 text-sm text-white/70 flex-1">{tier.description}</p>
                  <CTA href={NAD_PLUS_BOOKING_URL} variant="gradient" className="mt-6 w-full justify-center text-sm py-3">
                    Book
                  </CTA>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delayMs={120}>
            <div className="mt-10 rounded-2xl border border-white/15 bg-white/5 p-6">
              <h3 className="font-bold text-[#FFD700] mb-3">Optional add-ons</h3>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-white/75">
                {NAD_PLUS_ADDONS.map((a) => (
                  <li key={a.name}>
                    <strong className="text-white">{a.name}</strong> — {a.note}
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Stacking + internal links */}
      <Section className="py-14 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <FadeUp>
            <h2 className="font-serif text-3xl mb-6 text-center">Stack &amp; explore</h2>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {[
                { label: "Vitamin injections", href: "/services/vitamin-injections" },
                { label: "Hormone therapy", href: "/rx/hormones" },
                { label: "Weight loss", href: "/services/weight-loss" },
                { label: "IV therapy", href: "/services/iv-therapy" },
                { label: "Regenerative medicine", href: REGENERATIVE_MEDICINE_PATH },
                { label: "Book online", href: "/book" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full border border-[#FF2D8E]/40 px-4 py-2 text-[#FFB8DC] hover:bg-[#FF2D8E]/20 transition-colors"
                >
                  {l.label} →
                </Link>
              ))}
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Safety */}
      <Section className="py-16 border-b border-white/10 bg-[#111]">
        <div className="max-w-4xl mx-auto px-4">
          <FadeUp>
            <h2 className="font-serif text-3xl text-[#FF2D8E] mb-4">Is NAD+ right for everyone?</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              NAD+ wellness injections are not appropriate for every client. Hello Gorgeous screens for medical history,
              current medications, pregnancy or breastfeeding status, active cancer history, and other clinical
              considerations before treatment. Clients with significant medical conditions should consult their physician
              before starting any new wellness injection protocol.
            </p>
            <p className="text-white/70 text-sm">
              Possible side effects: temporary warmth, flushing, nausea, injection-site tenderness, lightheadedness, or
              pressure sensation may occur. These effects are usually brief — notify your provider immediately if you feel
              uncomfortable.
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-16 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4">
          <FadeUp>
            <h2 className="font-serif text-3xl text-center mb-10">Frequently asked questions</h2>
          </FadeUp>
          <div className="space-y-3">
            {NAD_PLUS_FAQS.map((faq, i) => (
              <FadeUp key={faq.question} delayMs={i * 25}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left rounded-2xl border-2 border-white/15 bg-white/5 px-5 py-4 hover:border-[#FF2D8E]/50 transition-colors"
                >
                  <div className="flex justify-between gap-4 items-start">
                    <span className="font-bold text-white">{faq.question}</span>
                    <span className="text-[#FF2D8E] text-xl shrink-0">{openFaq === i ? "−" : "+"}</span>
                  </div>
                  {openFaq === i ? <p className="mt-3 text-sm text-white/75 leading-relaxed">{faq.answer}</p> : null}
                </button>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <FadeUp>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Ready for your NAD+ visit?</h2>
            <p className="text-white/75 mb-8">
              {SITE.address.streetAddress}, {SITE.address.addressLocality}, IL · {SITE.phone}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={NAD_PLUS_BOOKING_URL} variant="gradient" className="px-10 py-4">
                Book NAD+ Injection
              </CTA>
              <CTA href={`tel:${SITE.phone.replace(/\D/g, "")}`} variant="outline" className="px-10 py-4 border-white text-white hover:bg-white hover:text-black">
                Call {SITE.phone}
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <footer className="border-t border-white/10 py-8 px-4">
        <p className="max-w-3xl mx-auto text-xs text-white/45 leading-relaxed text-center">{NAD_PLUS_DISCLAIMER}</p>
        <p className="mt-4 text-center text-xs text-white/35">
          <Link href={NAD_PLUS_INJECTIONS_PATH} className="hover:text-[#FFB8DC]">
            Canonical: NAD+ injections Oswego IL
          </Link>
        </p>
      </footer>
    </main>
  );
}
