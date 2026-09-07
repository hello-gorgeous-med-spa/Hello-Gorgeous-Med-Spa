"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { RegenPublicNav } from "@/components/regen/RegenPublicNav";
import { RegenAffiliateSubnav } from "@/components/regen/RegenAffiliateSubnav";
import {
  AFFILIATE_TYPES,
  AFFILIATE_TIERS,
  affiliateTierForActivePatients,
  affiliateTierRangeLabel,
} from "@/lib/regen-affiliates";
import { AFFILIATE_MARKETING_PATH, AFFILIATE_PLAYBOOK_PATH } from "@/lib/regen/affiliate-marketing";

const BRAND = {
  teal: "#1FB8A6",
  pink: "#EF1A6E",
  dark: "#0f1414",
  cream: "#f4ead9",
  ink: "#101615",
};

const STEPS = [
  { n: "1", title: "Apply", body: "Tell us about your business or audience." },
  { n: "2", title: "Sign the Code of Conduct", body: "Read and sign our partner agreement — about two minutes." },
  { n: "3", title: "Get your link & code", body: "Your dashboard tracks every click, referral, and payout." },
  { n: "4", title: "Get paid monthly", body: "Commissions clear a short holding period, then pay out on the 15th." },
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
    a: "You can promote REGEN RX broadly, but you may not bid on our brand name or trademarks, or build lookalike sites or handles. Full rules are in the partner agreement.",
  },
];

function EarningsEstimator() {
  const [referrals, setReferrals] = useState(5);
  const [avgValue, setAvgValue] = useState(220);
  const [months, setMonths] = useState(4);

  const math = useMemo(() => {
    const tier = affiliateTierForActivePatients(referrals);
    const rate = tier.percent / 100;
    const newOrderCommission = Math.round(referrals * avgValue * rate);
    const recurringCommission = Math.round(referrals * Math.max(0, months - 1) * avgValue * rate);
    const monthlyTotal = newOrderCommission + recurringCommission;
    return {
      tier,
      newOrderCommission,
      recurringCommission,
      monthlyTotal,
      annualTotal: monthlyTotal * 12,
    };
  }, [referrals, avgValue, months]);

  return (
    <div className="mx-auto max-w-[900px] overflow-hidden rounded-[20px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      <div className="px-6 pb-6 pt-8 md:px-9">
        <p className="mb-6 text-center font-serif text-2xl font-black" style={{ color: BRAND.ink }}>
          What could you earn?
        </p>
        <div className="mb-2 grid gap-6 md:grid-cols-3">
          <SliderField
            label="Active patients"
            value={referrals}
            display={String(referrals)}
            min={1}
            max={30}
            step={1}
            onChange={setReferrals}
          />
          <SliderField
            label="Avg. monthly value"
            value={avgValue}
            display={`$${avgValue}`}
            min={80}
            max={500}
            step={10}
            onChange={setAvgValue}
          />
          <SliderField
            label="Months they stay active"
            value={months}
            display={String(months)}
            min={1}
            max={12}
            step={1}
            onChange={setMonths}
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2">
        <div className="px-6 py-8 md:px-9" style={{ background: BRAND.dark }}>
          <p className="text-[13px]" style={{ color: "rgba(244,234,217,0.6)" }}>
            Estimated earnings at your tier ({math.tier.label} · {math.tier.percent}%)
          </p>
          <p className="mt-1 font-serif text-4xl font-black md:text-5xl" style={{ color: BRAND.cream }}>
            ${math.monthlyTotal.toLocaleString()}
            <span className="text-lg font-bold" style={{ color: "rgba(244,234,217,0.5)" }}>
              /mo
            </span>
          </p>
          <p className="mt-1.5 text-[13px]" style={{ color: "rgba(244,234,217,0.5)" }}>
            ${math.annualTotal.toLocaleString()} / year
          </p>
        </div>
        <div className="px-6 py-8 md:px-9">
          <p className="font-serif text-[22px] font-black" style={{ color: BRAND.ink }}>
            ${math.newOrderCommission.toLocaleString()}
          </p>
          <p className="text-[13px] text-black/55">This month&apos;s new-patient commission</p>
          <p className="mt-4 font-serif text-[22px] font-black" style={{ color: BRAND.ink }}>
            + ${math.recurringCommission.toLocaleString()}
          </p>
          <p className="text-[13px] text-black/55">Recurring, from patients still active</p>
        </div>
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-[13px] font-bold text-black/60">
        <span>{label}</span>
        <span style={{ color: BRAND.pink }}>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#EF1A6E]"
      />
    </div>
  );
}

export function RegenAffiliateProgram() {
  return (
    <div className="min-h-screen bg-white" style={{ color: BRAND.ink }}>
      <RegenPublicNav />
      <RegenAffiliateSubnav />

      <section
        className="px-6 pb-14 pt-16 text-center"
        style={{ background: "linear-gradient(155deg,#0c3d3a,#0f1414 65%)" }}
      >
        <p className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: BRAND.teal }}>
          REGEN RX Partner Program
        </p>
        <h1
          className="mx-auto mt-3.5 max-w-[820px] font-serif text-4xl font-black leading-tight md:text-5xl"
          style={{ color: BRAND.cream }}
        >
          Refer patients. Earn commission. Stay compliant.
        </h1>
        <p className="mx-auto mt-4 max-w-[640px] text-lg leading-relaxed" style={{ color: "rgba(244,234,217,0.75)" }}>
          Med spas, day spas, and wellness creators can refer Illinois adults to NP-directed peptide, hormone,
          aesthetic, and vitamin telehealth — and earn on every one who becomes a patient.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/affiliates/apply"
            className="inline-block rounded-full px-9 py-4 text-base font-bold text-white"
            style={{ background: BRAND.pink }}
          >
            Apply to Partner
          </Link>
          <Link
            href="/affiliates/login"
            className="inline-block rounded-full border-2 px-9 py-4 text-base font-bold"
            style={{ borderColor: BRAND.teal, color: BRAND.teal }}
          >
            Partner login
          </Link>
          <Link
            href={AFFILIATE_MARKETING_PATH}
            className="inline-block rounded-full border-2 px-9 py-4 text-base font-bold text-white"
            style={{ borderColor: "rgba(244,234,217,0.35)" }}
          >
            Marketing kit
          </Link>
          <Link
            href={AFFILIATE_PLAYBOOK_PATH}
            className="inline-block rounded-full border-2 px-9 py-4 text-base font-bold text-white"
            style={{ borderColor: "rgba(244,234,217,0.35)" }}
          >
            Playbook
          </Link>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <p className="text-center text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: BRAND.pink }}>
          Built for Three Kinds of Partners
        </p>
        <h2 className="mt-2.5 text-center font-serif text-3xl font-black">Who this program is for</h2>
        <div className="mx-auto mt-12 grid max-w-6xl gap-7 md:grid-cols-3">
          {AFFILIATE_TYPES.map((type, i) => (
            <div key={type.id} className="rounded-[20px] border-2 p-8" style={{ borderColor: BRAND.ink }}>
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-black"
                style={{
                  background: i === 1 ? "rgba(239,26,110,0.1)" : "rgba(31,184,166,0.12)",
                  color: i === 1 ? BRAND.pink : BRAND.teal,
                }}
              >
                {i + 1}
              </div>
              <h3 className="font-serif text-[22px] font-black">{type.label}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-black/65">{type.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20" style={{ background: BRAND.dark }}>
        <p className="text-center text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: BRAND.teal }}>
          Commission Structure
        </p>
        <h2 className="mt-2.5 text-center font-serif text-3xl font-black" style={{ color: BRAND.cream }}>
          The more active patients you bring, the more you earn
        </h2>
        <p className="mx-auto mt-5 max-w-[600px] text-center text-base leading-relaxed" style={{ color: "rgba(244,234,217,0.7)" }}>
          Your rate is based on how many referred patients are actively in treatment at once — it applies to every
          dollar REGEN RX actually collects, for as long as they stay active. Paid monthly, after refunds and
          chargebacks clear. No flat bonus is ever paid before that revenue exists.
        </p>

        <div className="mx-auto mt-11 grid max-w-[1100px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AFFILIATE_TIERS.map((tier) => {
            const elite = tier.id === "elite";
            return (
              <div
                key={tier.id}
                className="rounded-2xl px-5 py-7 text-center"
                style={
                  elite
                    ? { background: "rgba(239,26,110,0.1)", border: `1px solid ${BRAND.pink}` }
                    : { background: "rgba(255,255,255,0.04)" }
                }
              >
                <p
                  className="mb-2.5 text-xs font-bold uppercase tracking-[0.06em]"
                  style={{ color: elite ? BRAND.pink : "rgba(244,234,217,0.5)" }}
                >
                  {tier.label}
                </p>
                <p className="font-serif text-4xl font-black" style={{ color: elite ? BRAND.pink : BRAND.teal }}>
                  {tier.percent}%
                </p>
                <p className="mt-2 text-[13px]" style={{ color: "rgba(244,234,217,0.55)" }}>
                  {affiliateTierRangeLabel(tier)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <EarningsEstimator />
        </div>
        <p className="mx-auto mt-6 max-w-[640px] text-center text-[13px] leading-relaxed" style={{ color: "rgba(244,234,217,0.45)" }}>
          Illustrative estimate, not a guarantee. Tier is based on concurrent active patients and can move up or down
          monthly. Commission is a marketing/referral fee only — never tied to a specific prescription or clinical
          decision. Shipping is not commissioned.
        </p>
      </section>

      <section className="bg-white px-6 py-20">
        <p className="text-center text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: BRAND.pink }}>
          How It Works
        </p>
        <h2 className="mt-2.5 text-center font-serif text-3xl font-black">From application to first payout</h2>
        <div className="mx-auto mt-12 grid max-w-6xl gap-7 md:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.n} className="text-center">
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-black text-white"
                style={{ background: BRAND.pink }}
              >
                {step.n}
              </div>
              <h3 className="mt-4 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-black/60">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[820px] bg-white px-6 pb-20">
        <h2 className="mb-10 text-center font-serif text-3xl font-black">Good to know</h2>
        {FAQS.map((faq, i) => (
          <details key={faq.q} className="border-b border-black/10 py-[18px]" open={i === 0}>
            <summary className="cursor-pointer text-[17px] font-bold">{faq.q}</summary>
            <p className="mt-3 text-[15px] leading-relaxed text-black/70">{faq.a}</p>
          </details>
        ))}
      </section>

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#0c3d3a,#0f1414)" }}>
        <h2 className="font-serif text-3xl font-black" style={{ color: BRAND.cream }}>
          Ready to become a REGEN RX partner?
        </h2>
        <p className="mx-auto mt-3.5 max-w-[520px] text-base" style={{ color: "rgba(244,234,217,0.75)" }}>
          Sign the Code of Conduct to get your dashboard, tracking link, and referral code.
        </p>
        <Link
          href="/affiliates/apply"
          className="mt-6 inline-block rounded-full px-8 py-3.5 text-[15px] font-bold text-white"
          style={{ background: BRAND.pink }}
        >
          Apply to Partner
        </Link>
      </section>

      <footer className="px-6 py-12 text-center" style={{ background: BRAND.dark }}>
        <p className="text-[15px] font-extrabold tracking-[0.08em]" style={{ color: BRAND.cream }}>
          REGEN<span style={{ color: BRAND.pink }}>RX</span>
        </p>
        <p className="mt-2.5 text-[13px] uppercase tracking-[0.1em]" style={{ color: "rgba(244,234,217,0.5)" }}>
          Renew. Rebalance. Regenerate.
        </p>
        <p className="mt-4 text-[13px]" style={{ color: "rgba(244,234,217,0.45)" }}>
          tryregenrx.com · 74 W. Washington St, Oswego, IL 60543 · (630) 636-6193
        </p>
        <p className="mt-1 text-xs" style={{ color: "rgba(244,234,217,0.35)" }}>
          A Hello Gorgeous Med Spa company · NP-directed care, compounded by licensed US pharmacies.
        </p>
      </footer>
    </div>
  );
}
