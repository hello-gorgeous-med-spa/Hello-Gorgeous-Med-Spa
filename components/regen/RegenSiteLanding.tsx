"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { LabsBanner } from "@/components/regen/RegenLabsSection";
import { RegenLogo } from "@/components/regen/RegenLogo";
import {
  REGEN_CTA,
  REGEN_FAQ,
  REGEN_GOALS,
  REGEN_HERO,
  REGEN_HOW_IT_WORKS,
  REGEN_SITE,
  REGEN_SOCIAL_PROOF,
  REGEN_TRUST_BAR,
  REGEN_WHY,
  type RegenGoal,
} from "@/lib/regen-site";

/* ─────────────────────────────────────────────────────────────
   TRUST BAR
───────────────────────────────────────────────────────────── */

function TrustBar() {
  return (
    <div className="bg-neutral-900 py-2.5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 text-[11px] font-medium tracking-wide text-white/90">
        {REGEN_TRUST_BAR.map((item) => (
          <span key={item.id} className="flex items-center gap-1.5">
            <span className="text-[#E6007E]">✦</span>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SOCIAL PROOF BADGES
───────────────────────────────────────────────────────────── */

function SocialProofBadges() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {REGEN_SOCIAL_PROOF.map((item) => (
        <span
          key={item.id}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm"
        >
          {"rating" in item ? (
            <>
              <span className="text-amber-500">★</span>
              {item.rating}
              <span className="text-neutral-400">·</span>
              {item.count} {item.source}
            </>
          ) : (
            <>
              {item.id === "best" && <span className="text-amber-500">🏆</span>}
              {item.id === "np" && <span className="text-[#E6007E]">NP</span>}
              {item.text}
            </>
          )}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────── */

function HeroSection() {
  const { featuredProduct } = REGEN_HERO;

  return (
    <section className="bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left */}
          <div>
            <RegenLogo width={200} priority />

            <h1 className="mt-8 text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-[3.25rem]">
              {REGEN_HERO.headline}
            </h1>

            <Link
              href={REGEN_HERO.ctaHref}
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#E6007E] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#E6007E]/25 transition hover:bg-[#FF2D8E]"
            >
              {REGEN_HERO.cta}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <div className="mt-10">
              <SocialProofBadges />
            </div>
          </div>

          {/* Right — Featured product card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
              <div className="relative bg-gradient-to-br from-neutral-50 to-neutral-100 p-8">
                <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  <span className="text-amber-500">★</span>
                  {featuredProduct.badge}
                </span>
                <Image
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  width={180}
                  height={220}
                  className="mx-auto h-auto w-full max-w-[160px] object-contain"
                  priority
                />
              </div>
              <div className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#E6007E]">
                  {featuredProduct.category}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-neutral-900">
                  {featuredProduct.name}
                  {featuredProduct.rx && (
                    <sup className="ml-1 text-xs font-medium text-neutral-400">Rx</sup>
                  )}
                </h3>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={featuredProduct.learnHref}
                    className="flex-1 rounded-lg border border-neutral-300 py-2.5 text-center text-xs font-semibold text-neutral-700 transition hover:border-neutral-400"
                  >
                    Learn more
                  </Link>
                  <Link
                    href={featuredProduct.startHref}
                    className="flex-1 rounded-lg bg-[#E6007E] py-2.5 text-center text-xs font-semibold text-white transition hover:bg-[#FF2D8E]"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   GOAL CARD
───────────────────────────────────────────────────────────── */

function GoalIcon({ icon }: { icon: string }) {
  const cls = "h-6 w-6";
  switch (icon) {
    case "scale":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      );
    case "sun":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case "heart":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "dna":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    case "sparkle":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    case "beaker":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    default:
      return null;
  }
}

function GoalCard({ goal }: { goal: RegenGoal }) {
  return (
    <Link
      href={goal.href}
      className="group flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-[#E6007E]/30 hover:shadow-md"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 transition group-hover:bg-[#FFF0F7] group-hover:text-[#E6007E]">
        <GoalIcon icon={goal.icon} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-900">{goal.title}</span>
          {goal.tag && (
            <span className="rounded bg-[#E6007E]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#E6007E]">
              {goal.tag}
            </span>
          )}
        </div>
      </div>
      <svg
        className="h-5 w-5 text-neutral-300 transition group-hover:text-[#E6007E]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
   SHOP BY GOAL SECTION
───────────────────────────────────────────────────────────── */

function ShopByGoalSection() {
  return (
    <section className="border-y border-neutral-100 bg-neutral-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Shop by goal
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
          Prescription treatments for your health goals
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REGEN_GOALS.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────────────────────────── */

function HowItWorksSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          How it works
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
          {REGEN_HOW_IT_WORKS.headline}
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {REGEN_HOW_IT_WORKS.steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6007E] text-lg font-bold text-white">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   WHY RE GEN
───────────────────────────────────────────────────────────── */

function WhyRegenSection() {
  return (
    <section className="border-y border-neutral-100 bg-neutral-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Why RE GEN
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
              {REGEN_WHY.headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">{REGEN_WHY.intro}</p>

            <ul className="mt-8 space-y-4">
              {REGEN_WHY.bullets.map((bullet) => (
                <li key={bullet.id} className="flex gap-3">
                  <span className="text-[#E6007E]">✦</span>
                  <div>
                    <span className="font-semibold text-neutral-900">{bullet.title}</span>
                    <br />
                    <span className="text-sm text-neutral-600">{bullet.description}</span>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href={`tel:+16306366193`}
              className="mt-8 inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
            >
              Call {REGEN_SITE.phone}
            </Link>
          </div>

          <div className="flex justify-center">
            <div className="relative rounded-2xl bg-gradient-to-br from-[#0a0a1a] to-[#1a1a2e] p-8 text-white">
              <RegenLogo width={160} className="brightness-0 invert" />
              <p className="mt-4 text-lg font-light italic">— done surviving, ready to thrive</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FAQ SECTION
───────────────────────────────────────────────────────────── */

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Common questions
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
          {REGEN_FAQ.headline}
        </h2>

        <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
          {REGEN_FAQ.items.map((item, index) => (
            <div key={index}>
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-semibold text-neutral-900">{item.q}</span>
                <svg
                  className={`h-5 w-5 shrink-0 text-neutral-400 transition ${openIndex === index ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <p className="pb-5 text-sm leading-relaxed text-neutral-600">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   CTA SECTION
───────────────────────────────────────────────────────────── */

function CtaSection() {
  return (
    <section className="bg-gradient-to-br from-[#E6007E] to-[#9b0a4d] py-16 text-white">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">{REGEN_CTA.headline}</h2>
        <p className="mt-4 text-white/80">{REGEN_CTA.sub}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={REGEN_CTA.primaryHref}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#E6007E] shadow-lg transition hover:bg-neutral-100"
          >
            {REGEN_CTA.primaryCta}
          </Link>
          <Link
            href={REGEN_CTA.secondaryHref}
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {REGEN_CTA.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────── */

function RegenFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <RegenLogo width={140} />
            <p className="mt-4 text-sm text-neutral-600">
              {REGEN_SITE.address.street}
              <br />
              {REGEN_SITE.address.city}, {REGEN_SITE.address.state} {REGEN_SITE.address.zip}
              <br />
              {REGEN_SITE.phone}
            </p>
          </div>

          {/* Treatments */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Treatments
            </h4>
            <ul className="mt-4 space-y-2">
              {REGEN_GOALS.map((g) => (
                <li key={g.id}>
                  <Link href={g.href} className="text-sm text-neutral-600 hover:text-neutral-900">
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Company
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/rx" className="text-sm text-neutral-600 hover:text-neutral-900">
                  RX Home
                </Link>
              </li>
              <li>
                <Link href="/rx/start" className="text-sm text-neutral-600 hover:text-neutral-900">
                  Get started
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
                  Hello Gorgeous Med Spa
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Get started
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/rx/start" className="text-sm text-neutral-600 hover:text-neutral-900">
                  Free intake
                </Link>
              </li>
              <li>
                <Link
                  href="tel:+16306366193"
                  className="text-sm text-neutral-600 hover:text-neutral-900"
                >
                  Call us
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-sm text-neutral-600 hover:text-neutral-900">
                  Book on Fresha
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-10 border-t border-neutral-200 pt-8 text-xs leading-relaxed text-neutral-500">
          RE GEN by Hello Gorgeous Med Spa. Information on this site is for general educational
          purposes and is not medical advice. Prescription products require evaluation by a licensed
          provider, who determines whether treatment is appropriate. Some products are compounded by
          a licensed pharmacy and are not FDA-approved. Individual results vary. © 2026 Hello
          Gorgeous Med Spa.
        </p>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────── */

export function RegenSiteLanding() {
  return (
    <div className="min-h-[100dvh] bg-white">
      <TrustBar />
      <HeroSection />
      <ShopByGoalSection />
      <HowItWorksSection />
      <LabsBanner />
      <WhyRegenSection />
      <FaqSection />
      <CtaSection />
      <RegenFooter />
    </div>
  );
}
