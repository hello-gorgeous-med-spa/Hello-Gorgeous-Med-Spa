"use client";

import { useState } from "react";
import Link from "next/link";

import { BOOKING_URL, GLP1_INTAKE_PATH } from "@/lib/flows";
import { SITE } from "@/lib/seo";

type TabId =
  | "products"
  | "results"
  | "numbers"
  | "expect"
  | "support"
  | "testimonials"
  | "policy"
  | "providers";

const TABS: { id: TabId; label: string }[] = [
  { id: "products", label: "Our program" },
  { id: "results", label: "Real results" },
  { id: "numbers", label: "The numbers" },
  { id: "expect", label: "What to expect" },
  { id: "support", label: "Your support team" },
  { id: "testimonials", label: "Testimonials" },
  { id: "policy", label: "Our guarantee" },
  { id: "providers", label: "Our providers" },
];

function CtaBar({ text }: { text: string }) {
  return (
    <div className="mt-6 pt-5 border-t border-[#E6007E]/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <span className="text-sm text-black/60">{text}</span>
      <div className="flex flex-wrap gap-2">
        <Link
          href={GLP1_INTAKE_PATH}
          className="inline-flex items-center justify-center bg-[#E6007E] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition-colors"
        >
          Start secure intake
        </Link>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center border-2 border-black text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-black hover:text-white transition-colors"
        >
          Book on Fresha
        </a>
      </div>
    </div>
  );
}

export function GLP1EducationTabs() {
  const [active, setActive] = useState<TabId>("products");

  return (
    <section className="py-16 md:py-20 px-4 bg-white border-y border-black/10" aria-label="GLP-1 education">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E] mb-2">Learn more</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-black leading-tight mb-8">
          Everything you need
          <br />
          <em className="text-[#E6007E] not-italic">to know.</em>
        </h2>

        <div className="flex flex-col rounded-xl border-2 border-black/10 overflow-hidden mb-5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`flex items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium border-b border-black/10 last:border-b-0 transition-colors ${
                active === tab.id
                  ? "bg-[#E6007E] text-white"
                  : "bg-white text-black hover:bg-pink-50/80"
              }`}
            >
              {tab.label}
              <span
                className={`text-lg transition-transform shrink-0 ${active === tab.id ? "text-white/80 rotate-90" : "text-black/40"}`}
                aria-hidden
              >
                ›
              </span>
            </button>
          ))}
        </div>

        <div
          key={active}
          className="rounded-xl border-2 border-black/10 bg-gradient-to-br from-pink-50/90 to-white p-6 md:p-8"
        >
          {active === "products" && (
            <>
              <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#E6007E] font-semibold mb-1">GLP-1 program</p>
              <h3 className="font-serif text-2xl md:text-3xl font-normal text-black mb-3">
                Real medication.
                <br />
                <em className="text-[#E6007E] not-italic">Real support.</em>
              </h3>
              <p className="text-sm text-black/65 leading-relaxed mb-4">
                Our program uses semaglutide and tirzepatide — the same medication class as Ozempic®, Wegovy®, Mounjaro®, and Zepbound® — prescribed and monitored by our clinical team in Oswego. No insurance runaround. In-person relationship-based care from people who know your name.
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {[
                  "Semaglutide injections",
                  "Tirzepatide injections",
                  "Weekly dosing",
                  "In-person Oswego care",
                  "No insurance required",
                  "HSA / FSA accepted",
                ].map((p) => (
                  <span key={p} className="bg-white border border-[#E6007E]/25 rounded-full px-3 py-1 text-xs text-black/70">
                    {p}
                  </span>
                ))}
              </div>
              <CtaBar text="Consultations available — start with secure intake or book directly." />
            </>
          )}

          {active === "results" && (
            <>
              <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#E6007E] font-semibold mb-1">Real results</p>
              <h3 className="font-serif text-2xl md:text-3xl font-normal text-black mb-3">
                What patients
                <br />
                <em className="text-[#E6007E] not-italic">can achieve.</em>
              </h3>
              <p className="text-sm text-black/65 leading-relaxed mb-4">
                GLP-1 medications have shown substantial average weight loss over many months in clinical trials. We pair medication with coaching and monitoring. Individual results vary — your provider sets expectations at consultation.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 my-4">
                <div className="bg-white border border-black/10 rounded-lg p-4 text-center">
                  <span className="font-serif text-2xl text-[#E6007E] block leading-none">~15%</span>
                  <span className="text-xs text-black/55 mt-2 block leading-snug">Mean weight change in key semaglutide trials (e.g. ~68 weeks)</span>
                </div>
                <div className="bg-white border border-black/10 rounded-lg p-4 text-center">
                  <span className="font-serif text-2xl text-[#E6007E] block leading-none">4–8</span>
                  <span className="text-xs text-black/55 mt-2 block leading-snug">Weeks when many people first notice changes</span>
                </div>
                <div className="bg-white border border-black/10 rounded-lg p-4 text-center">
                  <span className="font-serif text-2xl text-[#E6007E] block leading-none">Provider-led</span>
                  <span className="text-xs text-black/55 mt-2 block leading-snug">Dosing and titration guided in-office — not DIY</span>
                </div>
              </div>
              <p className="text-xs text-black/50">Educational only; not a promise of results.</p>
              <CtaBar text="See what’s realistic for you at a consult." />
            </>
          )}

          {active === "numbers" && (
            <>
              <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#E6007E] font-semibold mb-1">By the numbers</p>
              <h3 className="font-serif text-2xl md:text-3xl font-normal text-black mb-3">
                The science
                <br />
                <em className="text-[#E6007E] not-italic">in context.</em>
              </h3>
              <p className="text-sm text-black/65 leading-relaxed mb-4">
                GLP-1 drugs were developed for Type 2 diabetes; weight effects led to dedicated obesity indications. They mimic incretin hormones to reduce appetite and slow gastric emptying for many patients.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 my-4">
                <div className="bg-white border border-black/10 rounded-lg p-4 text-center">
                  <span className="font-serif text-2xl text-[#E6007E] block leading-none">Up to ~20%</span>
                  <span className="text-xs text-black/55 mt-2 block leading-snug">Body-weight reduction reported in some tirzepatide trials</span>
                </div>
                <div className="bg-white border border-black/10 rounded-lg p-4 text-center">
                  <span className="font-serif text-2xl text-[#E6007E] block leading-none">Widely used</span>
                  <span className="text-xs text-black/55 mt-2 block leading-snug">Millions of U.S. patients have used GLP-1 class meds (diabetes &amp; weight)</span>
                </div>
                <div className="bg-white border border-black/10 rounded-lg p-4 text-center">
                  <span className="font-serif text-2xl text-[#E6007E] block leading-none">Early on</span>
                  <span className="text-xs text-black/55 mt-2 block leading-snug">Trials often show appetite changes in the first weeks for many</span>
                </div>
              </div>
              <p className="text-sm text-black/65 leading-relaxed">
                Your biology and adherence still matter. We screen and monitor so therapy stays as safe and effective as possible for you.
              </p>
            </>
          )}

          {active === "expect" && (
            <>
              <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#E6007E] font-semibold mb-1">Your journey</p>
              <h3 className="font-serif text-2xl md:text-3xl font-normal text-black mb-3">
                What to expect
                <br />
                <em className="text-[#E6007E] not-italic">step by step.</em>
              </h3>
              <ul className="space-y-4 mt-4">
                {[
                  { n: "1", w: "Week 1 — Consultation", d: "Review history, goals, and eligibility. Your personalized plan is outlined." },
                  { n: "2", w: "Week 1–2 — Start low", d: "Begin at a starter dose to limit side effects. Appetite may shift within the first couple of weeks." },
                  { n: "3", w: "Month 1–2 — Titration", d: "Dose increases gradually based on tolerance and response, with provider check-ins." },
                  { n: "4", w: "Month 2–6 — Active phase", d: "Many patients see meaningful progress with consistent follow-up and lifestyle support." },
                  { n: "5", w: "Month 6+ — Maintenance", d: "You and your provider decide on continuation, taper, or maintenance — individualized." },
                ].map((step) => (
                  <li key={step.n} className="flex gap-4">
                    <div
                      className="shrink-0 w-8 h-8 rounded-full border-2 border-[#E6007E] bg-pink-100 text-[#E6007E] font-serif text-sm flex items-center justify-center"
                      aria-hidden
                    >
                      {step.n}
                    </div>
                    <div>
                      <p className="text-[0.72rem] uppercase tracking-[0.08em] text-[#E6007E] font-semibold">{step.w}</p>
                      <p className="text-sm text-black/65 leading-relaxed mt-0.5">{step.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <CtaBar text="Your journey starts with one appointment." />
            </>
          )}

          {active === "support" && (
            <>
              <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#E6007E] font-semibold mb-1">Your team</p>
              <h3 className="font-serif text-2xl md:text-3xl font-normal text-black mb-3">
                You&apos;re never
                <br />
                <em className="text-[#E6007E] not-italic">alone.</em>
              </h3>
              <p className="text-sm text-black/65 leading-relaxed mb-4">
                Unlike telehealth-only apps, we see you in person in Oswego — real people who know your history.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { t: "In-office visits", d: "Scheduled visits with your provider — not just a portal." },
                  { t: "Phone access", d: `Questions? Call ${SITE.phone} during business hours.` },
                  { t: "Dose management", d: "Titration and adjustments guided by your clinical team." },
                  { t: "Lifestyle coaching", d: "Nutrition and habit support built into your program." },
                ].map((c) => (
                  <div key={c.t} className="bg-white border border-black/10 rounded-lg p-4">
                    <p className="text-sm font-semibold text-black">{c.t}</p>
                    <p className="text-xs text-black/60 mt-1 leading-relaxed">{c.d}</p>
                  </div>
                ))}
              </div>
              <CtaBar text={`${SITE.address.streetAddress}, ${SITE.address.addressLocality} IL`} />
            </>
          )}

          {active === "testimonials" && (
            <>
              <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#E6007E] font-semibold mb-1">Testimonials</p>
              <h3 className="font-serif text-2xl md:text-3xl font-normal text-black mb-3">
                Hear it from
                <br />
                <em className="text-[#E6007E] not-italic">our patients.</em>
              </h3>
              <p className="text-xs text-black/50 mb-4">Individual results vary. Quotes reflect patient experiences.</p>
              {[
                {
                  q: "I've tried everything over the years. This program finally gave me something that actually worked — and the team here made me feel supported every step of the way.",
                  a: "Verified patient · Fox Valley IL",
                },
                {
                  q: "No judgment, no pressure. Just real help from people who actually care. I'm down 22 lbs and I actually feel like myself again.",
                  a: "Verified patient · Fox Valley IL",
                },
                {
                  q: "I love that it's in-person. I see the same team every time — they're invested in my progress.",
                  a: "Verified patient · Fox Valley IL",
                },
              ].map((t) => (
                <blockquote key={t.q.slice(0, 40)} className="mb-5">
                  <p className="font-serif text-base italic text-black/80 leading-relaxed">&ldquo;{t.q}&rdquo;</p>
                  <footer className="text-[0.75rem] text-black/50 uppercase tracking-wider mt-1">— {t.a}</footer>
                </blockquote>
              ))}
              <CtaBar text="Join patients who took the first step." />
            </>
          )}

          {active === "policy" && (
            <>
              <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#E6007E] font-semibold mb-1">Our commitment</p>
              <h3 className="font-serif text-2xl md:text-3xl font-normal text-black mb-3">
                What you can
                <br />
                <em className="text-[#E6007E] not-italic">count on.</em>
              </h3>
              <p className="text-sm text-black/65 leading-relaxed mb-4">
                We believe in this program — and in honest expectations.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  "Transparent pricing conversation",
                  "No pressure to commit same-day",
                  "Clear expectations from your provider",
                  "Plan adjustments when needed",
                  "You drive your goals — we support the clinical path",
                ].map((p) => (
                  <span key={p} className="bg-white border border-[#E6007E]/25 rounded-full px-3 py-1 text-xs text-black/70">
                    {p}
                  </span>
                ))}
              </div>
              <p className="text-sm text-black/65 leading-relaxed">
                Questions about pricing or what&apos;s included? Ask at your consultation or call {SITE.phone}.
              </p>
              <CtaBar text="No pressure — start with intake or a booked consult." />
            </>
          )}

          {active === "providers" && (
            <>
              <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#E6007E] font-semibold mb-1">Our providers</p>
              <h3 className="font-serif text-2xl md:text-3xl font-normal text-black mb-3">
                Experienced.
                <br />
                <em className="text-[#E6007E] not-italic">Local. Yours.</em>
              </h3>
              <p className="text-sm text-black/65 leading-relaxed mb-4">
                GLP-1 care at Hello Gorgeous is overseen by our licensed clinical team in Oswego. You work with real providers — not an algorithm.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-white border border-black/10 rounded-lg p-4">
                  <p className="text-sm font-semibold text-black">Danielle Alcala-Glazier</p>
                  <p className="text-xs text-black/60 mt-1 leading-relaxed">
                    Founder &amp; lead injector — personalized care and confidence-first aesthetics.
                  </p>
                  <Link href="/providers/danielle" className="text-xs text-[#E6007E] font-semibold mt-2 inline-block hover:underline">
                    View profile →
                  </Link>
                </div>
                <div className="bg-white border border-black/10 rounded-lg p-4">
                  <p className="text-sm font-semibold text-black">Ryan Kent, FNP-BC</p>
                  <p className="text-xs text-black/60 mt-1 leading-relaxed">
                    Medical Director — clinical oversight, weight management &amp; wellness.
                  </p>
                  <Link href="/providers/ryan" className="text-xs text-[#E6007E] font-semibold mt-2 inline-block hover:underline">
                    View profile →
                  </Link>
                </div>
              </div>
              <p className="text-sm text-black/65 leading-relaxed">
                Prescriptions are issued only after appropriate evaluation by a licensed prescriber. You&apos;ll always know who is responsible for your care.
              </p>
              <CtaBar text="Meet the team in person." />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
