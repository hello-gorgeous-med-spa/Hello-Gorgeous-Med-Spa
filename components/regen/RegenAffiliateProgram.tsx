"use client";

import Link from "next/link";
import { RegenPublicNav } from "@/components/regen/RegenPublicNav";
import {
  AFFILIATE_COOKIE_DAYS,
  AFFILIATE_INTAKE_BONUS_USD,
  AFFILIATE_RECURRING_MONTHS,
  AFFILIATE_RECURRING_PERCENT,
  AFFILIATE_TYPES,
} from "@/lib/regen-affiliates";

const BRAND = {
  teal: "#0D9488",
  pink: "#E91E8C",
  dark: "#0A0A0A",
  cream: "#FAF9F6",
  gray: "#9CA3AF",
};

const STEPS = [
  { n: "1", title: "Apply", body: "Tell us about your business or audience." },
  { n: "2", title: "Sign the Code of Conduct", body: "Read and sign — about two minutes." },
  { n: "3", title: "Get your link & code", body: "Your dashboard tracks clicks, referrals, and payouts." },
  { n: "4", title: "Get paid monthly", body: "Commissions clear a short hold, then pay out on the 15th." },
];

const FAQS = [
  {
    q: "Do I need a medical license to be a partner?",
    a: "No. Partners refer — they never prescribe, dose, or diagnose. Every patient completes their own licensed clinical evaluation with a REGEN RX provider.",
  },
  {
    q: "Can I see who I referred and their health info?",
    a: "You'll see click, signup, and commission data only — never a referral's health information. That stays between the patient and their provider.",
  },
  {
    q: "Does REGEN RX treat patients outside Illinois?",
    a: "Not yet — REGEN RX is Illinois-only today. Partners should make that clear to anyone outside Illinois.",
  },
  {
    q: "Can I run paid ads for REGEN RX?",
    a: "You can promote REGEN RX broadly, but you may not bid on our brand name or trademarks, or build lookalike sites. Full rules are in the partner agreement.",
  },
];

export function RegenAffiliateProgram() {
  return (
    <div className="min-h-screen" style={{ background: BRAND.dark, color: BRAND.cream }}>
      <RegenPublicNav />

      <section className="px-6 py-20 text-center" style={{ background: "linear-gradient(155deg,#0c3d3a,#0A0A0A 65%)" }}>
        <p className="text-xs font-extrabold uppercase tracking-[0.2em]" style={{ color: BRAND.teal }}>
          REGEN RX Partner Program
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-black leading-tight md:text-6xl">
          Refer patients. Earn commission. Stay compliant.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg" style={{ color: "rgba(250,249,246,0.72)" }}>
          Med spas, day spas, and wellness creators can refer Illinois adults to NP-directed peptide, hormone, and vitamin telehealth — and earn on every one who becomes a patient.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/affiliates/apply" className="rounded-full px-8 py-3 text-sm font-extrabold text-white" style={{ background: BRAND.pink }}>
            Apply to partner
          </Link>
          <Link href="/affiliates/login" className="rounded-full border-2 px-8 py-3 text-sm font-extrabold" style={{ borderColor: BRAND.teal, color: BRAND.teal }}>
            Partner login
          </Link>
        </div>
      </section>

      <section className="bg-white px-6 py-20 text-black">
        <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em]" style={{ color: BRAND.pink }}>
          Built for three kinds of partners
        </p>
        <h2 className="mt-2 text-center font-serif text-3xl font-black">Who this program is for</h2>
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
          {AFFILIATE_TYPES.map((type) => (
            <div key={type.id} className="rounded-3xl border-4 border-black p-8">
              <h3 className="font-serif text-2xl font-black">{type.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-black/70">{type.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20" style={{ background: "#111" }}>
        <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em]" style={{ color: BRAND.teal }}>
          Commission structure
        </p>
        <h2 className="mt-2 text-center font-serif text-3xl font-black">Simple, recurring, transparent</h2>
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-8 text-center">
            <p className="font-serif text-5xl font-black" style={{ color: BRAND.teal }}>{AFFILIATE_RECURRING_PERCENT}%</p>
            <p className="mt-3 text-sm text-white/60">recurring on a referred patient&apos;s first {AFFILIATE_RECURRING_MONTHS} months of paid medication</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-8 text-center">
            <p className="font-serif text-5xl font-black" style={{ color: BRAND.pink }}>${AFFILIATE_INTAKE_BONUS_USD}</p>
            <p className="mt-3 text-sm text-white/60">flat bonus per completed clinical intake for med spa and clinic partners</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-8 text-center">
            <p className="font-serif text-5xl font-black" style={{ color: BRAND.teal }}>{AFFILIATE_COOKIE_DAYS} day</p>
            <p className="mt-3 text-sm text-white/60">cookie window on every trackable link</p>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-white/40">
          Rates are confirmed on approval and can vary by partner type and volume. Commissions are a marketing/referral fee only — never tied to a specific prescription or clinical decision. Shipping is not commissioned.
        </p>
      </section>

      <section className="bg-white px-6 py-20 text-black">
        <h2 className="text-center font-serif text-3xl font-black">From application to first payout</h2>
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.n} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-black text-white" style={{ background: BRAND.pink }}>
                {step.n}
              </div>
              <h3 className="mt-4 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-black/60">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl bg-white px-6 pb-20 text-black">
        <h2 className="mb-8 text-center font-serif text-3xl font-black">Good to know</h2>
        {FAQS.map((faq) => (
          <details key={faq.q} className="border-b border-black/10 py-4">
            <summary className="cursor-pointer font-bold">{faq.q}</summary>
            <p className="mt-2 text-sm leading-relaxed text-black/70">{faq.a}</p>
          </details>
        ))}
      </section>

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#0c3d3a,#0A0A0A)" }}>
        <h2 className="font-serif text-3xl font-black">Ready to become a REGEN RX partner?</h2>
        <p className="mx-auto mt-3 max-w-lg text-white/70">Sign the Code of Conduct to get your dashboard, tracking link, and referral code.</p>
        <Link href="/affiliates/apply" className="mt-6 inline-block rounded-full px-8 py-3 text-sm font-extrabold text-white" style={{ background: BRAND.pink }}>
          Apply to partner
        </Link>
      </section>
    </div>
  );
}
