"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { BeforeAfterSlider } from "@/components/providers/BeforeAfterSlider";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import {
  SEE_YOUR_RESULTS_CASES,
  SEE_YOUR_RESULTS_CLOSING,
  SEE_YOUR_RESULTS_FAQS,
  SEE_YOUR_RESULTS_FEATURES,
  SEE_YOUR_RESULTS_HERO,
  SEE_YOUR_RESULTS_NAV,
  SEE_YOUR_RESULTS_PROVIDERS,
  SEE_YOUR_RESULTS_STEPS,
  type ResultsShowcaseCase,
} from "@/lib/see-your-results-lp";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  soft: "#FFB8DC",
  dark: "#0a0a0a",
};

const TABS = ["Aesthetics", "Body", "Skin"] as const;

function StickyNav() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-black/10 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="font-black tracking-tight text-black"
          style={{ fontFamily: "var(--font-display, inherit)" }}
        >
          Hello <span className="text-[#E6007E]">Gorgeous</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {SEE_YOUR_RESULTS_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/60 transition hover:text-[#E6007E]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <CTA href={SEE_YOUR_RESULTS_HERO.primaryCta.href} variant="gradient" className="!w-auto !px-5 !py-2.5 !text-xs">
          {SEE_YOUR_RESULTS_HERO.primaryCta.label}
        </CTA>
      </div>
    </header>
  );
}

function ResultsShowcase() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Aesthetics");
  const filtered = useMemo(
    () => SEE_YOUR_RESULTS_CASES.filter((c) => c.tab === tab),
    [tab],
  );
  const [index, setIndex] = useState(0);
  const active: ResultsShowcaseCase = filtered[Math.min(index, filtered.length - 1)] ?? SEE_YOUR_RESULTS_CASES[0];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t);
                setIndex(0);
              }}
              aria-pressed={tab === t}
              className={`rounded-full border-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${
                tab === t
                  ? "border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white"
                  : "border-black/15 bg-white text-black/70 hover:border-[#E6007E] hover:text-[#E6007E]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous case"
            onClick={() => setIndex((i) => (i - 1 + filtered.length) % filtered.length)}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white font-bold hover:bg-[#FFF0F7]"
          >
            ←
          </button>
          <span className="min-w-[4.5rem] text-center text-xs font-semibold uppercase tracking-widest text-black/50">
            {String(Math.min(index, filtered.length - 1) + 1).padStart(2, "0")} /{" "}
            {String(filtered.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            aria-label="Next case"
            onClick={() => setIndex((i) => (i + 1) % filtered.length)}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white font-bold hover:bg-[#FFF0F7]"
          >
            →
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
        <BeforeAfterSlider
          beforeUrl={active.before}
          afterUrl={active.after}
          alt={`${active.label} before and after`}
          aspectRatio="video"
          className="w-full"
        />
        <div className="border-t-4 border-black px-5 py-4 md:px-8">
          <p className="font-bold text-[#E6007E]">{active.label}</p>
          <p className="mt-1 text-sm font-medium text-black/70">{active.note}</p>
        </div>
      </div>
    </div>
  );
}

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y-2 divide-black/10 rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
      {SEE_YOUR_RESULTS_FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left md:px-7"
              aria-expanded={isOpen}
            >
              <span className="font-bold text-[#E6007E]">▸ {item.q}</span>
              <span className="mt-0.5 text-lg font-black text-black/40" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen ? (
              <p className="px-5 pb-5 text-sm font-medium leading-relaxed text-black/80 md:px-7 md:pl-10">
                {item.a}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function SeeYourResultsLpContent() {
  return (
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${BRAND.pinkHot}22 0%, transparent 50%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 40%, #fafafa 100%)
          `,
        }}
      />

      <StickyNav />

      <main>
        {/* Hero */}
        <Section className="relative border-b-4 border-black !px-0 py-16 lg:py-24">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 20% 30%, ${BRAND.pink} 0%, transparent 45%),
                radial-gradient(circle at 85% 20%, ${BRAND.pinkHot} 0%, transparent 40%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.55)_100%)]" />

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#E6007E]" aria-hidden />
              {SEE_YOUR_RESULTS_HERO.brand} · Face Blueprint™
            </div>
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#FFB8DC] md:text-sm">
              {SEE_YOUR_RESULTS_HERO.locality}
            </p>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl">
              {SEE_YOUR_RESULTS_HERO.headlineLead}{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                {SEE_YOUR_RESULTS_HERO.headlineAccent}
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/85 md:text-lg">
              {SEE_YOUR_RESULTS_HERO.subhead}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CTA href={SEE_YOUR_RESULTS_HERO.primaryCta.href} variant="gradient">
                {SEE_YOUR_RESULTS_HERO.primaryCta.label}
              </CTA>
              <CTA href={SEE_YOUR_RESULTS_HERO.secondaryCta.href} variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-black">
                {SEE_YOUR_RESULTS_HERO.secondaryCta.label}
              </CTA>
            </div>
            <p className="mt-6 text-sm font-medium text-[#FFB8DC]/90">{SEE_YOUR_RESULTS_HERO.proof}</p>
          </div>
        </Section>

        {/* Results */}
        <section id="results" className="scroll-mt-24 border-b-4 border-black bg-white py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <div className="mb-10 max-w-3xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">Real clinic results</p>
                <h2 className="text-3xl font-black tracking-tight text-black md:text-5xl">
                  Natural results you can feel excited about.
                </h2>
                <p className="mt-4 text-base font-medium text-black/70 md:text-lg">
                  Drag to compare. Then try Face Blueprint™ on <em>your</em> face — simulations are educational; your consult makes it real.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={80}>
              <ResultsShowcase />
            </FadeUp>
            <div className="mt-10 text-center">
              <CTA href={SEE_YOUR_RESULTS_HERO.primaryCta.href} variant="gradient">
                Preview on my face →
              </CTA>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-16 md:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <h2 className="text-3xl font-black tracking-tight text-black md:text-5xl">How it works</h2>
                <p className="max-w-md text-sm font-medium text-black/70 md:text-right">
                  Convert curiosity into a clear plan — visualization, blueprint, then booking.
                </p>
              </div>
            </FadeUp>
            <div className="grid gap-6 md:grid-cols-3">
              {SEE_YOUR_RESULTS_STEPS.map((step, i) => (
                <FadeUp key={step.n} delayMs={i * 60}>
                  <article className="h-full rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                    <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-black text-white">
                      {step.n}
                    </span>
                    <h3 className="mt-4 text-2xl font-black text-black">{step.title}</h3>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-black/75">{step.body}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
            <div className="mt-10 text-center">
              <CTA href={SEE_YOUR_RESULTS_HERO.primaryCta.href} variant="gradient">
                Start Face Blueprint™
              </CTA>
            </div>
          </div>
        </section>

        {/* Features — Ageless-style horizontal rows */}
        <section id="features" className="scroll-mt-24 border-b-4 border-black bg-white py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <div className="mb-10 flex flex-col gap-4 border-b-2 border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
                <h2 className="text-3xl font-black tracking-tight text-black md:text-5xl">
                  What Face Blueprint™ does
                </h2>
                <p className="max-w-md text-sm font-medium text-black/70 md:text-right">
                  Interactive visualization paired with a clear path to consult — built for Hello Gorgeous patients.
                </p>
              </div>
            </FadeUp>
            <ul className="divide-y-2 divide-black/10">
              {SEE_YOUR_RESULTS_FEATURES.map((f, i) => (
                <li key={f.title} className="grid gap-3 py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-10">
                  <FadeUp delayMs={i * 40}>
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br from-[#FF2D8E] to-[#E6007E]"
                        aria-hidden
                      />
                      <h3 className="text-xl font-black text-black md:text-2xl">{f.title}</h3>
                    </div>
                  </FadeUp>
                  <FadeUp delayMs={i * 40 + 20}>
                    <p className="text-sm font-medium leading-relaxed text-black/75 md:text-base">{f.body}</p>
                  </FadeUp>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Medical trust */}
        <section className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-white to-[#FFF0F7] py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <h2 className="mb-3 text-3xl font-black tracking-tight text-black md:text-5xl">
                NP-directed care you can trust
              </h2>
              <p className="mb-10 max-w-2xl text-base font-medium text-black/70">
                Simulations help you decide. Clinical judgment decides your plan — at Hello Gorgeous Med Spa, {SITE.address.addressLocality}, {SITE.address.addressRegion}.
              </p>
            </FadeUp>
            <div className="grid gap-6 md:grid-cols-2">
              {SEE_YOUR_RESULTS_PROVIDERS.map((p, i) => (
                <FadeUp key={p.name} delayMs={i * 60}>
                  <article className="flex gap-4 rounded-3xl border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] md:p-6">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-black">
                      <Image src={p.image} alt={p.imageAlt} fill className="object-cover" sizes="96px" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-black">{p.name}</h3>
                      <p className="mt-1 text-sm font-bold text-[#E6007E]">{p.role}</p>
                      <p className="mt-2 text-sm font-medium text-black/70">{p.detail}</p>
                    </div>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 border-b-4 border-black bg-white py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <h2 className="mb-3 text-center text-3xl font-black tracking-tight text-black md:text-5xl">
                Frequently asked questions
              </h2>
              <p className="mx-auto mb-10 max-w-xl text-center text-sm font-medium text-black/70">
                Straight answers on simulations, privacy, and what happens at consult.
              </p>
            </FadeUp>
            <FaqAccordion />
          </div>
        </section>

        {/* Closing CTA */}
        <section
          className="relative overflow-hidden border-b-4 border-black py-20 md:py-28"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center md:px-6">
            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              {SEE_YOUR_RESULTS_CLOSING.headline}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base font-medium text-white/90">
              {SEE_YOUR_RESULTS_CLOSING.body}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CTA href={SEE_YOUR_RESULTS_CLOSING.primaryCta.href} variant="white">
                {SEE_YOUR_RESULTS_CLOSING.primaryCta.label}
              </CTA>
              <CTA
                href={SEE_YOUR_RESULTS_CLOSING.secondaryCta.href}
                variant="outline"
                className="!border-white !text-white hover:!bg-white hover:!text-[#E6007E]"
              >
                {SEE_YOUR_RESULTS_CLOSING.secondaryCta.label}
              </CTA>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
