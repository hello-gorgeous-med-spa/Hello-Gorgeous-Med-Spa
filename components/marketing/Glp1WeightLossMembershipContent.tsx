"use client";

import Link from "next/link";
import { useState } from "react";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import {
  GLP1_MEMBERSHIP_BENEFITS,
  GLP1_MEMBERSHIP_CTA,
  GLP1_MEMBERSHIP_DISCLAIMER,
  GLP1_MEMBERSHIP_FAQS,
  GLP1_MEMBERSHIP_HERO,
  GLP1_MEMBERSHIP_MEDICATION_OPTIONS,
  GLP1_MEMBERSHIP_PRICE_USD,
  GLP1_MEMBERSHIP_STEPS,
  GLP1_MEMBERSHIP_TAGLINE,
} from "@/lib/glp1-weight-loss-membership";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
  mint: "#d4f5e4",
  mintText: "#1a5c3a",
};

function RxMark() {
  return (
    <sup className="ml-0.5 align-super text-[9px] font-bold text-[#E6007E]">Rx</sup>
  );
}

export function Glp1WeightLossMembershipContent() {
  const [openFaq, setOpenFaq] = useState<string>("cost");

  return (
    <div className="relative min-h-[100dvh] bg-white text-black">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}22 0%, transparent 55%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 40%, #fafafa 100%)
          `,
        }}
      />

      {/* Hero */}
      <Section className="relative border-b-4 border-black py-16 lg:py-22 !px-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 45%, #2d1020 100%)`,
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">
              {GLP1_MEMBERSHIP_HERO.eyebrow}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-black text-white sm:text-5xl lg:text-6xl">
              {GLP1_MEMBERSHIP_HERO.headline}{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                {GLP1_MEMBERSHIP_HERO.headlineAccent}
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75">{GLP1_MEMBERSHIP_HERO.subhead}</p>
            <div className="mt-6 inline-flex flex-col rounded-2xl border-2 border-white/20 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">Membership</p>
              <p className="font-serif text-4xl font-black text-white">
                ${GLP1_MEMBERSHIP_PRICE_USD}
                <span className="text-xl font-bold text-white/70">/mo</span>
              </p>
              <p className="mt-1 text-xs text-white/55">Medication billed separately · Formulation SKUs when prescribed</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTA href={GLP1_MEMBERSHIP_CTA.primary.href} variant="gradient">
                {GLP1_MEMBERSHIP_CTA.primary.label}
              </CTA>
              <CTA
                href={GLP1_MEMBERSHIP_CTA.secondary.href}
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-black"
              >
                {GLP1_MEMBERSHIP_CTA.secondary.label}
              </CTA>
            </div>
          </FadeUp>
          <FadeUp delayMs={80}>
            <div className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#E6007E]">Rx access</p>
              <h2 className="mt-2 font-serif text-2xl text-black">Membership gives you a choice</h2>
              <p className="mt-2 text-sm text-black/65">
                Access our Formulation GLP-1 catalog when your provider writes the Rx — semaglutide or tirzepatide,
                dose-matched to the right SKU.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {GLP1_MEMBERSHIP_MEDICATION_OPTIONS.map((med) => (
                  <div
                    key={med.id}
                    className="rounded-2xl border-2 border-black/10 bg-[#FFF0F7]/60 p-4"
                  >
                    <p className="font-bold text-black">
                      {med.name}
                      <RxMark />
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#E6007E]">{med.pathway}</p>
                    <p className="mt-2 text-sm text-black/60">from ${med.fromMonthlyUsd}/mo medication</p>
                    <p className="mt-1 text-[10px] text-black/45">{med.formulationNote}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-black/45">{GLP1_MEMBERSHIP_TAGLINE}</p>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* How membership works */}
      <Section id="how-it-works" className="scroll-mt-28 border-b border-black/10 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <FadeUp>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#E6007E]">How membership works</p>
              <h2 className="mt-3 font-serif text-3xl text-black sm:text-4xl">
                Four steps to <span className="text-[#E6007E]">supported</span> weight loss
              </h2>
              <ol className="mt-8 space-y-6">
                {GLP1_MEMBERSHIP_STEPS.map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#1a5c3a]"
                      style={{ backgroundColor: BRAND.mint }}
                    >
                      {item.step}
                    </span>
                    <div>
                      <p className="font-bold text-black">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-black/65">{item.body}</p>
                      {item.note ? (
                        <p className="mt-1 text-xs font-medium text-black/45">{item.note}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                <CTA href={GLP1_MEMBERSHIP_CTA.primary.href} variant="gradient">
                  Start losing weight →
                </CTA>
              </div>
            </FadeUp>
            <FadeUp delayMs={60}>
              <div className="rounded-3xl border border-black/10 bg-[#FAFAFA] p-6 sm:p-8">
                <div className="mx-auto max-w-[280px] rounded-[2rem] border-4 border-black bg-white p-4 shadow-xl">
                  <p className="text-center text-[10px] font-bold uppercase tracking-widest text-black/45">
                    My RX · Illustrative
                  </p>
                  <div className="mt-4 rounded-2xl bg-[#FFF0F7] p-4 text-center">
                    <p className="text-xs font-bold text-[#E6007E]">Compounded GLP-1</p>
                    <p className="mt-1 font-serif text-lg text-black">Ships monthly</p>
                    <p className="mt-2 text-[10px] text-black/50">Adjust with provider</p>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    {["Pause subscription", "Adjust treatment", "Billing & refills", "Message care team"].map(
                      (row) => (
                        <li
                          key={row}
                          className="rounded-xl border border-black/10 bg-white px-3 py-2.5 font-medium text-black/75"
                        >
                          {row}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
                <p className="mt-4 text-center text-[10px] text-black/40">For illustrative purposes only.</p>
              </div>
            </FadeUp>
          </div>
        </div>
      </Section>

      {/* Plan for progress */}
      <Section className="border-b-4 border-black bg-gradient-to-b from-white to-[#FFF0F7] py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <FadeUp className="text-center">
            <span
              className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
              style={{ backgroundColor: BRAND.mint, color: BRAND.mintText }}
            >
              Comprehensive care
            </span>
            <h2 className="mt-4 font-serif text-3xl text-black sm:text-4xl">Plan for progress</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-black/60">
              Your Oswego care team from day one — platform fee covers support; medication stays transparent and
              separate.
            </p>
          </FadeUp>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {GLP1_MEMBERSHIP_BENEFITS.map((item, idx) => (
              <FadeUp key={item.title} delayMs={30 * idx}>
                <li className="flex gap-3 rounded-2xl border-2 border-black/10 bg-white p-5">
                  <span className="text-lg text-[#E6007E]" aria-hidden>
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-black">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-black/65">{item.body}</p>
                  </div>
                </li>
              </FadeUp>
            ))}
          </ul>
          <FadeUp delayMs={120} className="mt-10 flex flex-wrap justify-center gap-3">
            <CTA href={GLP1_MEMBERSHIP_CTA.primary.href} variant="gradient">
              Get my plan
            </CTA>
            <Link
              href={GLP1_MEMBERSHIP_CTA.science.href}
              className="inline-flex items-center justify-center rounded-md border-2 border-black px-8 py-4 text-sm font-semibold uppercase tracking-widest transition hover:bg-black hover:text-white"
            >
              {GLP1_MEMBERSHIP_CTA.science.label}
            </Link>
          </FadeUp>
        </div>
      </Section>

      {/* FAQs */}
      <Section id="faqs" className="scroll-mt-28 py-16 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)]">
          <FadeUp>
            <h2 className="font-serif text-4xl font-black text-black sm:text-5xl">FAQs</h2>
            <Link
              href="#faqs"
              className="mt-6 inline-flex rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E6007E]"
            >
              View all FAQs
            </Link>
          </FadeUp>
          <FadeUp delayMs={40}>
            <div className="divide-y divide-black/10 border-t border-black/10">
              {GLP1_MEMBERSHIP_FAQS.map((faq) => {
                const open = openFaq === faq.id;
                return (
                  <div key={faq.id}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? "" : faq.id)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      aria-expanded={open}
                    >
                      <span className="font-semibold text-black">{faq.question}</span>
                      <span className="shrink-0 text-black/40">{open ? "−" : "+"}</span>
                    </button>
                    {open ? (
                      <p className="pb-5 text-sm leading-relaxed text-black/65">{faq.answer}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <p className="mt-8 text-xs leading-relaxed text-black/45">{GLP1_MEMBERSHIP_DISCLAIMER}</p>
          </FadeUp>
        </div>
      </Section>

      {/* CTA band */}
      <section
        className="border-t-4 border-black py-16"
        style={{
          background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl text-white sm:text-4xl">Join Hello Gorgeous RX™</h2>
          <p className="mt-3 text-white/85">
            ${GLP1_MEMBERSHIP_PRICE_USD}/mo membership · medication when prescribed · Formulation pharmacy SKUs
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CTA href={GLP1_MEMBERSHIP_CTA.primary.href} variant="white">
              Start GLP-1 intake
            </CTA>
            <Link
              href="/monthly-memberships#wellness-programs"
              className="inline-flex items-center justify-center rounded-md border-2 border-white/40 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
            >
              All memberships
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
