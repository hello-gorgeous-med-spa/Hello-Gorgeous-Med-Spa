"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import {
  GC_TRT_BIOTE_NOTE,
  GC_TRT_CTA,
  GC_TRT_DISCLAIMER,
  GC_TRT_EDGE_BENEFITS,
  GC_TRT_EXPERT_CARE,
  GC_TRT_FAQS,
  GC_TRT_HERO,
  GC_TRT_JOURNEY_STEPS,
  GC_TRT_RESULTS_PHASES,
  GC_TRT_SYMPTOM_TRANSFORMS,
  GC_TRT_TREATMENT_OPTIONS,
  GC_TRT_TRUST_PILLS,
  GENTLEMENS_CLUB_HORMONE_ADD_ONS,
  GENTLEMENS_CLUB_TRT_INCLUDED,
} from "@/lib/gentlemens-club-testosterone";
import {
  GENTLEMENS_CLUB_TRT_APPROACH_1,
  GENTLEMENS_CLUB_TRT_APPROACH_2,
} from "@/lib/gentlemens-club";
import { RYAN_FULL_NAME } from "@/lib/founder-credentials";

function TreatmentCard({ option }: { option: (typeof GC_TRT_TREATMENT_OPTIONS)[number] }) {
  const price =
    option.fromMonthlyUsd != null
      ? `$${option.fromMonthlyUsd}`
      : option.priceLabel ?? "Quoted at consult";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#151922] transition hover:border-[#FF2D8E]/40 hover:shadow-[0_0_32px_rgba(255,45,142,0.12)]">
      <div className="relative aspect-[16/10] border-b border-white/10 bg-black">
        <Image
          src={option.image}
          alt={option.imageAlt}
          fill
          className="object-cover object-center"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        {option.badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#FF2D8E] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {option.badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="font-serif text-2xl text-white">{option.name}</h3>
        <ul className="mt-4 flex-1 space-y-2">
          {option.bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm text-gray-400">
              <span className="text-[#FF2D8E]">✓</span>
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs font-bold uppercase tracking-widest text-gray-500">From</p>
        <p className="font-serif text-4xl font-black text-white">
          {price}
          {option.fromMonthlyUsd != null ? (
            <span className="text-lg font-semibold text-gray-500">/mo</span>
          ) : null}
        </p>
        <p className="mt-2 text-xs text-gray-500">{option.priceNote}</p>
        {option.learnHref ? (
          <Link href={option.learnHref} className="mt-3 text-sm font-semibold text-[#FFB8DC] hover:underline">
            Learn more →
          </Link>
        ) : null}
        <a
          href={GC_TRT_CTA.consult.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block rounded-xl bg-white py-3 text-center text-sm font-bold text-black transition hover:bg-[#FF2D8E] hover:text-white"
        >
          Get started
        </a>
      </div>
    </article>
  );
}

export function GentlemensClubTestosteroneContent() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 85% 20%, rgba(255,45,142,0.2) 0%, transparent 55%), linear-gradient(135deg, #0a0a0a 0%, #151922 50%, #0a0a0a 100%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <FadeUp className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">{GC_TRT_HERO.eyebrow}</p>
            <h1 className="mt-4 font-serif text-5xl font-black leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl">
              {GC_TRT_HERO.headline}
              <br />
              {GC_TRT_HERO.headlineMid}
              <br />
              <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                {GC_TRT_HERO.headlineAccent}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">{GC_TRT_HERO.subhead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTA href={GC_TRT_CTA.screener.href} variant="gradient">
                {GC_TRT_CTA.screener.label}
              </CTA>
              <CTA
                href={GC_TRT_CTA.consult.href}
                variant="outline"
                className="!border-white/30 !text-white hover:!bg-white hover:!text-black"
              >
                {GC_TRT_CTA.consult.label}
              </CTA>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Symptom transform — Fridays-style dual column */}
      <Section id="symptoms" className="scroll-mt-24 border-b border-white/10 bg-white !py-16 md:!py-24">
        <div className="mx-auto max-w-5xl px-4">
          <FadeUp className="text-center">
            <h2 className="font-serif text-4xl font-black text-black sm:text-5xl">
              Is low T holding
              <br />
              you back?
            </h2>
            <Link
              href={GC_TRT_CTA.screener.href}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#E6007E] hover:underline"
            >
              Find out where your levels stand →
            </Link>
          </FadeUp>

          <FadeUp delayMs={80} className="mt-12">
            <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-black/45">
              Turn it back on
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2 rounded-2xl bg-neutral-100 p-4 md:p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Before</p>
                {GC_TRT_SYMPTOM_TRANSFORMS.map((row) => (
                  <p
                    key={row.before}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-500 line-through decoration-neutral-300"
                  >
                    {row.before}
                  </p>
                ))}
              </div>
              <div className="space-y-2 rounded-2xl bg-[#FFF0F7] p-4 md:p-5 ring-2 ring-[#E6007E]/20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">After optimization</p>
                {GC_TRT_SYMPTOM_TRANSFORMS.map((row) => (
                  <p
                    key={row.after}
                    className="rounded-xl border-2 border-[#E6007E]/30 bg-white px-4 py-3 text-sm font-bold text-black shadow-[3px_3px_0_0_rgba(230,0,126,0.2)]"
                  >
                    {row.after}
                  </p>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delayMs={120} className="mt-10 max-w-3xl mx-auto text-center">
            <p className="text-sm leading-relaxed text-black/65">{GENTLEMENS_CLUB_TRT_APPROACH_1}</p>
            <p className="mt-3 text-sm leading-relaxed text-black/65">{GENTLEMENS_CLUB_TRT_APPROACH_2}</p>
          </FadeUp>
        </div>
      </Section>

      {/* Trust + treatment cards */}
      <Section className="border-b border-white/10 bg-[#0a0a0a] !py-16 md:!py-20">
        <div className="mx-auto max-w-6xl px-4">
          <FadeUp className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-400">
            {GC_TRT_TRUST_PILLS.map((pill) => (
              <span key={pill} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF2D8E]" />
                {pill}
              </span>
            ))}
          </FadeUp>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {GC_TRT_TREATMENT_OPTIONS.map((option, i) => (
              <FadeUp key={option.id} delayMs={i * 50}>
                <TreatmentCard option={option} />
              </FadeUp>
            ))}
          </div>
          <FadeUp delayMs={160} className="mt-8 text-center text-sm text-gray-500">
            {GC_TRT_BIOTE_NOTE}
          </FadeUp>
        </div>
      </Section>

      {/* Journey timeline */}
      <Section className="border-b border-white/10 bg-[#030712] !py-16 md:!py-20">
        <div className="mx-auto max-w-4xl px-4">
          <FadeUp className="text-center">
            <h2 className="font-serif text-3xl font-black text-white sm:text-4xl">We make it easy</h2>
            <p className="mt-3 text-gray-400">Oswego in-person care — not a faceless app.</p>
          </FadeUp>
          <ol className="mt-12 space-y-0">
            {GC_TRT_JOURNEY_STEPS.map((step, i) => (
              <FadeUp key={step.title} delayMs={i * 40}>
                <li className="relative flex gap-6 border-l-2 border-[#FF2D8E]/40 pb-10 pl-8 last:pb-0">
                  <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-[#FF2D8E]" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#FFB8DC]">{step.when}</p>
                    <h3 className="mt-1 text-lg font-bold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">{step.body}</p>
                  </div>
                </li>
              </FadeUp>
            ))}
          </ol>
        </div>
      </Section>

      {/* Expert care + included */}
      <Section className="border-b border-white/10 !py-16 md:!py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
          <FadeUp>
            <span className="rounded-full border border-[#7dd3fc]/40 bg-[#7dd3fc]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7dd3fc]">
              Comprehensive care
            </span>
            <h2 className="mt-4 font-serif text-3xl font-black text-white sm:text-4xl">Expert care, built around you</h2>
            <p className="mt-4 text-gray-400">
              {RYAN_FULL_NAME} on site in Oswego — lab-guided TRT with the monitoring Gentlemen&apos;s Club is known
              for.
            </p>
            <ul className="mt-6 space-y-3">
              {GC_TRT_EXPERT_CARE.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-gray-300">
                  <span className="text-[#FF2D8E]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delayMs={60}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[GENTLEMENS_CLUB_TRT_INCLUDED.oversight, GENTLEMENS_CLUB_TRT_INCLUDED.program].map((col) => (
                <div key={col.title} className="rounded-2xl border border-white/10 bg-[#151922] p-5">
                  <h3 className="font-bold text-[#FFB8DC]">{col.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {col.bullets.map((b) => (
                      <li key={b} className="text-xs leading-relaxed text-gray-400">
                        • {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              Gentlemen&apos;s Club membership from ${GC_TRT_CTA.membershipFrom}/mo adds member pricing &amp; priority
              booking.
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* Results timeline */}
      <Section className="border-b border-white/10 bg-white !py-16 md:!py-20">
        <div className="mx-auto max-w-5xl px-4">
          <FadeUp className="text-center">
            <h2 className="font-serif text-3xl font-black text-black sm:text-4xl">When to expect results</h2>
            <p className="mt-3 text-black/55">TRT is a process — individual timelines vary.</p>
          </FadeUp>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {GC_TRT_RESULTS_PHASES.map((phase, i) => (
              <FadeUp key={phase.when} delayMs={i * 40}>
                <article className="h-full rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">{phase.when}</p>
                  <h3 className="mt-2 text-lg font-bold text-black">{phase.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/65">{phase.body}</p>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Edge benefits */}
      <Section className="border-b border-white/10 !py-16 md:!py-20">
        <div className="mx-auto max-w-5xl px-4">
          <FadeUp className="text-center">
            <h2 className="font-serif text-3xl font-black text-white sm:text-4xl">Regain your edge</h2>
          </FadeUp>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {GC_TRT_EDGE_BENEFITS.map((b, i) => (
              <FadeUp key={b.title} delayMs={i * 40}>
                <div className="rounded-2xl border border-white/10 bg-[#151922] p-6 text-center">
                  <h3 className="text-lg font-bold text-[#FF2D8E]">{b.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{b.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Add-ons */}
      <Section className="border-b border-white/10 bg-[#030712] !py-14 md:!py-16">
        <div className="mx-auto max-w-6xl px-4">
          <FadeUp>
            <h2 className="text-center text-xl font-black uppercase tracking-tight text-white">TRT add-ons</h2>
            <p className="mt-2 text-center text-sm text-gray-500">Prescribed separately when clinically appropriate</p>
          </FadeUp>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {GENTLEMENS_CLUB_HORMONE_ADD_ONS.map((addon, i) => (
              <FadeUp key={addon.id} delayMs={i * 30}>
                <div className="rounded-2xl border border-white/10 bg-[#151922] p-5">
                  <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-black">
                    <Image src={addon.image} alt={addon.imageAlt} fill className="object-cover" sizes="200px" />
                  </div>
                  <h3 className="font-bold text-white">{addon.name}</h3>
                  <p className="mt-1 text-2xl font-black text-[#7dd3fc]">
                    ${addon.priceMonthlyUsd}
                    <span className="text-sm text-gray-500">/mo</span>
                  </p>
                  <p className="mt-2 text-xs text-gray-500">{addon.tagline}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQs */}
      <Section id="faq" className="scroll-mt-24 bg-white !py-16 md:!py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)]">
          <FadeUp>
            <h2 className="font-serif text-4xl font-black text-black sm:text-5xl">FAQs</h2>
            <Link
              href={GC_TRT_CTA.club.href}
              className="mt-6 inline-flex rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#E6007E]"
            >
              Full Gentlemen&apos;s Club
            </Link>
          </FadeUp>
          <FadeUp delayMs={40}>
            <div className="divide-y divide-black/10">
              {GC_TRT_FAQS.map((faq, idx) => {
                const open = openFaq === idx;
                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : idx)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      aria-expanded={open}
                    >
                      <span className="font-semibold text-black">{faq.question}</span>
                      <span className="text-black/40">{open ? "−" : "+"}</span>
                    </button>
                    {open ? <p className="pb-5 text-sm leading-relaxed text-black/65">{faq.answer}</p> : null}
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-xs text-black/45">{GC_TRT_DISCLAIMER}</p>
          </FadeUp>
        </div>
      </Section>

      {/* Closing CTA */}
      <section className="border-t-4 border-[#FF2D8E] bg-black py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl font-black text-white sm:text-4xl">Your edge awaits.</h2>
          <p className="mt-3 text-gray-400">Start with the screener or book in Oswego — {RYAN_FULL_NAME}.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CTA href={GC_TRT_CTA.screener.href} variant="gradient">
              Take TRT screener
            </CTA>
            <CTA href={GC_TRT_CTA.consult.href} variant="outline" className="!border-white/30 !text-white">
              {GC_TRT_CTA.consult.label}
            </CTA>
          </div>
        </div>
      </section>
    </main>
  );
}
