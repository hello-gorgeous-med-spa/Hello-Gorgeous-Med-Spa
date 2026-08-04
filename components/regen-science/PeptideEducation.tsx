"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CTA } from "@/components/CTA";
import { Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";
import {
  EDUCATION_MODULES,
  LEARNING_STAGES,
  EVIDENCE_TIERS,
  TIER_COLORS,
  HYPE_CLAIMS,
  PEPTIDE_CATEGORIES,
  SAFETY_TOPICS,
  PEPTIDE_CHAIN,
  CHAIN_COPY,
  PEPTIDE_EDUCATION_FAQS,
} from "@/lib/regen/peptide-education-data";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  pinkSoft: "#FFF5F9",
  pinkMid: "#FCE7F3",
  pinkDeep: "#C90A68",
};

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l7 3.5v5c0 4.2-2.9 7.6-7 9.5-4.1-1.9-7-5.3-7-9.5v-5L12 3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4h1" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.23 1 .5 1.4.9.4.4.7.8.9 1.4.17.4.37 1 .42 2.2.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.23.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.17-1 .37-2.2.42-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42-.6-.23-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.23-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 3.4a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8zm0 2.2a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4zm6.7-2.6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 22v-8h2.8l.4-3.2h-3.2V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3V14h2.8v8h3.4z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 2h-3v13.1a2.6 2.6 0 1 1-2.1-2.5V9.5a5.7 5.7 0 1 0 5.1 5.6V8.5a6.4 6.4 0 0 0 3.6 1.1V6.5a3.6 3.6 0 0 1-3.6-3.6V2z" />
    </svg>
  );
}

function FaqAccordion({ items }: { items: typeof PEPTIDE_EDUCATION_FAQS }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-black/10">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 py-5 text-left"
          >
            <span className="font-bold text-lg">{item.question}</span>
            {openIndex === i ? (
              <ChevronUpIcon className="w-5 h-5 text-black/50 shrink-0" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-black/50 shrink-0" />
            )}
          </button>
          {openIndex === i && (
            <p className="pb-5 text-base leading-relaxed text-black/75 pr-8">
              {item.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function EducationHeader() {
  const navItems = [
    { label: "Services", href: "/services", colorClass: "border-pink-500/35 text-pink-400" },
    { label: "Shop RX", href: "/rx", colorClass: "border-blue-500/35 text-blue-400", badge: "NEW" },
    { label: "Peptide Education", href: "/regen-science/education", colorClass: "bg-gradient-to-r from-pink-500 to-pink-600 text-white", active: true },
    { label: "Regen Science", href: "/regen-science", colorClass: "border-pink-500/35 text-pink-400" },
    { label: "Memberships", href: "/memberships", colorClass: "border-amber-500/35 text-amber-400", emoji: "⭐" },
    { label: "Before & After", href: "/gallery", colorClass: "border-blue-500/35 text-blue-400" },
    { label: "FAQ", href: "#faq", colorClass: "border-pink-500/35 text-pink-400" },
  ];

  return (
    <header className="bg-black border-b border-white/10 sticky top-0 z-50">
      <div className="border-b border-white/10 py-1.5 px-4 text-center text-xs text-white/70">
        <span className="font-semibold bg-gradient-to-r from-pink-500 via-blue-400 to-amber-500 bg-clip-text text-transparent">
          #1 Best Med Spa in Oswego
        </span>
        <span className="mx-2 text-white/30">·</span>
        <span className="text-white/90">We screen you like a medical practice, because we are one.</span>
        <span className="mx-2 text-white/30">·</span>
        <a href={`tel:${SITE.phone.replace(/[^0-9]/g, "")}`} className="text-white hover:text-pink-400">
          {SITE.phone}
        </a>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-3.5">
        <Link href="/regen-science" className="flex items-center gap-3 text-white">
          <Image
            src="/images/rx-care/regen-logo-full.png"
            alt="Hello Gorgeous Med Spa"
            width={160}
            height={40}
            className="h-10 w-auto"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-base font-bold tracking-wide text-white">HELLO GORGEOUS</span>
            <span className="text-[9px] font-bold tracking-[0.22em]" style={{ color: BRAND.pink }}>RX · REGEN SCIENCE</span>
          </span>
        </Link>
        <CTA href={BOOKING_URL} variant="gradient" className="shrink-0 whitespace-nowrap text-sm">
          Book free consult
        </CTA>
      </div>

      <div className="border-t border-white/5 bg-[#09090b]/90">
        <nav className="max-w-[1280px] mx-auto flex justify-center flex-wrap gap-1.5 px-3 py-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors ${
                item.active
                  ? item.colorClass
                  : `bg-white/5 border ${item.colorClass} hover:bg-white/10 hover:text-white`
              }`}
            >
              {item.label}
              {item.emoji && <span>{item.emoji}</span>}
              {item.badge && (
                <span className="bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function EducationFooter() {
  const footerLinks = {
    Education: [
      { label: "Free modules", href: "#modules" },
      { label: "Evidence tiers", href: "#evidence" },
      { label: "Safety & sourcing", href: "#safety" },
      { label: "Peptide look-up", href: "/regen-science" },
    ],
    "Shop RX": [
      { label: "GLP-1 weight loss", href: "/glp1-weight-loss" },
      { label: "Peptide therapy", href: "/peptides" },
      { label: "Hormone therapy", href: "/rx/hormones" },
      { label: "IV & vitamin shots", href: "/iv-drip-bar" },
    ],
    Visit: [
      { label: "Book online", href: BOOKING_URL },
      { label: "Meet the team", href: "/about" },
      { label: "Memberships", href: "/memberships" },
      { label: "FAQ", href: "#faq" },
    ],
  };

  return (
    <footer className="bg-black text-white">
      <div className="border-b border-white/15 bg-[#09090b] py-4 text-center">
        <p className="m-0 text-[13px] font-bold text-[#FFB8DC]">
          Founder-led · Full-authority Nurse Practitioner on site
        </p>
        <p className="m-0 mt-1.5 text-[13px] font-semibold" style={{ color: BRAND.pink }}>
          We screen you like a medical practice, because we are one.
        </p>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          <div>
            <Image
              src="/images/rx-care/regen-logo-full.png"
              alt="Hello Gorgeous Med Spa"
              width={200}
              height={52}
              className="h-13 w-auto mb-5"
            />
            <p className="m-0 mb-2 text-[15px] leading-relaxed text-white/85">
              {SITE.address.street}
              <br />
              {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </p>
            <p className="m-0 mb-4 text-[15px] font-bold" style={{ color: BRAND.pink }}>
              {SITE.phone}
            </p>
            <div className="flex items-center gap-1.5 mb-5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={i < 4 ? "text-amber-400" : "text-amber-400/50"}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className="text-xs text-white/60 ml-1">4.4 · 117 Google reviews</span>
            </div>
            <div className="flex gap-2.5">
              <a href="https://instagram.com/hellogorgeousmedspa" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-black hover:bg-pink-500 hover:text-white transition-colors">
                <InstagramIcon />
              </a>
              <a href="https://facebook.com/hellogorgeousmedspa" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-black hover:bg-pink-500 hover:text-white transition-colors">
                <FacebookIcon />
              </a>
              <a href="https://tiktok.com/@hellogorgeousmedspa" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-black hover:bg-pink-500 hover:text-white transition-colors">
                <TikTokIcon />
              </a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="m-0 mb-4 text-[11px] font-bold tracking-wider uppercase" style={{ color: BRAND.pink }}>
                {title}
              </p>
              <div className="flex flex-col gap-3">
                {links.map((link) => (
                  <Link key={link.label} href={link.href} className="text-[15px] text-white/75 hover:text-pink-400 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 mx-auto text-[13px] leading-relaxed text-white/60 max-w-[900px] text-center">
          Not medical advice. This page is educational. Nothing here replaces a licensed clinician who knows your
          health history, and no content should be used to self-prescribe or self-dose. Prescription products,
          including compounded peptides and GLP-1 medications, are dispensed only after a medical evaluation.
        </p>
      </div>

      <div className="border-t border-white/10 py-5 px-6 text-center text-[13px] text-white/60">
        © 2026 Hello Gorgeous Med Spa · Hello Gorgeous RX. All rights reserved. · HIPAA Notice · Privacy Policy
      </div>
    </footer>
  );
}

function PeptideChainDemo() {
  const [activeKind, setActiveKind] = useState<"aa" | "bond" | "none">("none");
  const copy = CHAIN_COPY[activeKind] || CHAIN_COPY.none;

  return (
    <div
      className="bg-white border-2 border-black rounded-[22px] p-8"
      style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)", animation: "hgFadeUp 0.6s ease-out 0.15s both" }}
    >
      <p className="m-0 mb-6 text-[11px] font-bold tracking-wider uppercase text-black/55">
        Anatomy of a peptide — tap a piece
      </p>
      <div className="flex items-center justify-center gap-1.5 flex-wrap mb-7">
        {PEPTIDE_CHAIN.map((node, i) => {
          const isActive = activeKind === node.kind;
          return (
            <button
              key={i}
              onClick={() => setActiveKind(node.kind)}
              className={`font-bold rounded-full cursor-pointer transition-all ${
                node.kind === "aa"
                  ? `w-[62px] h-[62px] text-sm border-2 ${isActive ? "border-[#E6007E] bg-[#E6007E] text-white" : "border-black bg-white text-black"}`
                  : `w-6 h-6 text-[13px] border-none bg-transparent ${isActive ? "text-[#E6007E]" : "text-black/40"}`
              }`}
            >
              {node.label}
            </button>
          );
        })}
      </div>
      <div className="rounded-xl p-5 min-h-[132px]" style={{ background: BRAND.pinkSoft }}>
        <p className="m-0 mb-1.5 text-[11px] font-bold tracking-wider uppercase" style={{ color: BRAND.pinkDeep }}>
          {copy.title}
        </p>
        <p className="m-0 text-base leading-relaxed text-black/82">{copy.body}</p>
      </div>
      <p className="m-0 mt-5 text-sm leading-relaxed text-black/55">
        Change the order of those amino acids and you get an entirely different signal. That is why sourcing and
        verification matter as much as the name on the vial.
      </p>
    </div>
  );
}

function HypeQuizCard({ claim }: { claim: typeof HYPE_CLAIMS[0] }) {
  const [pick, setPick] = useState<number | null>(null);

  return (
    <div className="flex flex-col bg-white border-2 border-black rounded-[22px] p-7" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
      <p className="m-0 mb-4 text-[11px] font-bold tracking-wider uppercase text-black/45">Claim {claim.n}</p>
      <p className="m-0 mb-6 font-serif text-[22px] leading-snug font-bold" style={{ letterSpacing: "-0.02em" }}>
        &ldquo;{claim.claim}&rdquo;
      </p>
      <p className="m-0 mb-3 text-sm font-semibold text-black/55">
        {pick ? `Your pick: tier ${pick}` : "Tap the tier you'd assign"}
      </p>
      <div className="flex gap-2 mb-5">
        {[1, 2, 3, 4, 5].map((t) => {
          const isChosen = pick === t;
          const isCorrect = pick !== null && t === claim.tier;
          return (
            <button
              key={t}
              onClick={() => setPick(t)}
              className={`flex-1 h-12 rounded-xl text-base font-bold cursor-pointer transition-all ${
                isCorrect
                  ? "border-2 border-[#E6007E] bg-[#E6007E] text-white"
                  : isChosen
                  ? "border-2 border-black bg-black text-white"
                  : "border border-black/20 bg-white text-black"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
      {pick !== null && (
        <div
          className="mt-auto rounded-xl px-5 py-4"
          style={{ background: BRAND.pinkMid, animation: "hgFadeUp 0.4s ease-out both" }}
        >
          <p className="m-0 mb-1.5 text-xs font-bold tracking-wider uppercase" style={{ color: BRAND.pinkDeep }}>
            {claim.verdict}
          </p>
          <p className="m-0 text-[15px] leading-relaxed text-black/82">
            {pick === claim.tier ? "Correct. " : "Not quite. "}
            {claim.answer}
          </p>
        </div>
      )}
    </div>
  );
}

function TierBadge({ tone, children }: { tone: string; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    black: "bg-black text-white",
    pink: "bg-[#E6007E] text-white",
    outline: "bg-white border-2 border-black text-black",
    gold: "bg-amber-100 border border-amber-300 text-amber-700",
    amber: "bg-amber-50 border border-amber-400 text-amber-600",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${styles[tone] || styles.outline}`}>
      {children}
    </span>
  );
}

export function PeptideEducation() {
  return (
    <div className="relative min-h-[100dvh] flex flex-col">
      <style jsx global>{`
        @keyframes hgFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <EducationHeader />

      <main className="min-w-0 flex-1">
        {/* Hero */}
        <Section className="relative pt-20 pb-16 lg:pt-24 lg:pb-20">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 14% 12%, rgba(255,45,142,0.10), transparent 44%),
                radial-gradient(circle at 86% 8%, rgba(255,45,142,0.06), transparent 40%)`,
            }}
          />
          <div
            className="relative max-w-[1280px] mx-auto px-6 grid gap-16 items-center"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(430px, 1fr))" }}
          >
            <div style={{ animation: "hgFadeUp 0.6s ease-out both" }}>
              <p className="m-0 mb-5 text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: BRAND.pink }}>
                Hello Gorgeous RX · Patient education
              </p>
              <h1
                className="m-0 mb-6 font-serif font-bold leading-none"
                style={{ fontSize: "clamp(40px, 4.6vw, 62px)", letterSpacing: "-0.02em" }}
              >
                Understand peptides{" "}
                <span style={{ color: BRAND.pink }}>before anyone prescribes you one.</span>
              </h1>
              <p className="m-0 mb-5 text-lg lg:text-xl leading-relaxed text-black/75 max-w-[620px]">
                A peptide is a <strong>short chain of amino acids</strong> — a signaling molecule, not magic. This is
                the same walkthrough our nurse practitioners give in consult: what these molecules do, how strong the
                evidence really is, and where it is still early.
              </p>
              <p className="m-0 mb-9 text-base leading-relaxed text-black/60 max-w-[600px]">
                Free, no account, no email. Five short modules, then a real conversation with a provider who knows your
                history.
              </p>
              <div className="flex gap-3.5 flex-wrap">
                <CTA href="#modules" variant="gradient">
                  Start with module 1
                </CTA>
                <CTA href="#roadmap" variant="outline">
                  See the roadmap
                </CTA>
              </div>
            </div>

            <PeptideChainDemo />
          </div>
        </Section>

        {/* Disclaimer */}
        <section className="border-t border-b border-black/10" style={{ background: BRAND.pinkSoft }}>
          <div className="max-w-[1280px] mx-auto px-6 py-5 flex items-center gap-5 flex-wrap">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase whitespace-nowrap" style={{ color: BRAND.pinkDeep }}>
              <InfoIcon className="w-4 h-4" />
              Educational use only
            </span>
            <p className="m-0 text-[15px] leading-relaxed text-black/70 flex-1 min-w-[280px]">
              These modules teach the science — they are not a diagnosis, a prescription, or dosing guidance. Candidacy
              is decided in a visit with a licensed provider who has reviewed your labs, history, and medications.
            </p>
          </div>
        </section>

        {/* Roadmap */}
        <Section id="roadmap" className="py-24 lg:py-28 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <p className="m-0 mb-4 text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: BRAND.pink }}>
              The learning path
            </p>
            <h2
              className="m-0 mb-4 font-serif font-bold max-w-[900px]"
              style={{ fontSize: "clamp(34px, 3.6vw, 46px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              From &ldquo;what is a peptide?&rdquo; to{" "}
              <span style={{ color: BRAND.pink }}>reading the research yourself</span>
            </h2>
            <p className="m-0 mb-12 text-lg leading-relaxed text-black/70 max-w-[760px]">
              Five stages, each building on the last. Skip ahead if you like — the deep-dives land harder once the
              foundations are solid.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {LEARNING_STAGES.map((s) => (
                <Link
                  key={s.n}
                  href="#modules"
                  className="flex flex-col gap-3 bg-white border-2 border-black rounded-2xl p-7 text-black transition-all hover:border-[#E6007E] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
                >
                  <span className="font-serif text-4xl font-bold leading-none" style={{ color: BRAND.pink }}>
                    {s.n}
                  </span>
                  <span className="font-serif text-xl font-bold leading-snug" style={{ letterSpacing: "-0.02em" }}>
                    {s.title}
                  </span>
                  <span className="text-[15px] leading-relaxed text-black/70">{s.body}</span>
                  <span className="mt-auto pt-2 text-sm font-bold" style={{ color: BRAND.pink }}>
                    Jump →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Section>

        {/* Modules */}
        <Section id="modules" className="py-24 lg:py-28 bg-black">
          <div className="max-w-[1280px] mx-auto px-6">
            <p className="m-0 mb-4 text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: BRAND.pink }}>
              Free modules
            </p>
            <h2
              className="m-0 mb-4 font-serif font-bold text-white max-w-[900px]"
              style={{ fontSize: "clamp(34px, 3.6vw, 46px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              Foundations to deep-dives, in five short reads
            </h2>
            <p className="m-0 mb-12 text-lg leading-relaxed text-white/70 max-w-[720px]">
              No account, no payment, no email. Read them in order, or jump to what you&apos;re missing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {EDUCATION_MODULES.map((m) => (
                <a
                  key={m.n}
                  href={m.href || "#"}
                  className="flex flex-col gap-3.5 bg-[#09090b] border-2 border-white/15 rounded-2xl p-7 text-white transition-all hover:border-[#E6007E] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,45,142,0.25)]"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: BRAND.pink }}>
                      Module {m.n}
                    </span>
                    <span className="text-xs font-semibold text-white/50">{m.time}</span>
                  </span>
                  <span className="font-serif text-2xl font-bold leading-tight" style={{ letterSpacing: "-0.02em" }}>
                    {m.title}
                  </span>
                  <span className="text-[15px] leading-relaxed text-white/70">{m.body}</span>
                  <span className="mt-auto pt-2.5 text-sm font-bold" style={{ color: BRAND.pink }}>
                    Read module →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Section>

        {/* Evidence Tiers */}
        <Section id="evidence" className="py-24 lg:py-28 bg-white">
          <div
            className="max-w-[1280px] mx-auto px-6 grid gap-16 items-start"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))" }}
          >
            <div>
              <p className="m-0 mb-4 text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: BRAND.pink }}>
                Evidence literacy
              </p>
              <h2
                className="m-0 mb-5 font-serif font-bold"
                style={{ fontSize: "clamp(34px, 3.6vw, 46px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                How we weigh <span style={{ color: BRAND.pink }}>the evidence</span>
              </h2>
              <p className="m-0 mb-5 text-lg leading-relaxed text-black/70">
                Most peptide claims online come from cell cultures or rodent studies, quoted as if they applied to
                people. Our five-tier system labels every claim by the strength of the study behind it — so a large
                randomized human trial doesn&apos;t sit next to a single mouse paper looking equally certain.
              </p>
              <p className="m-0 mb-8 text-lg leading-relaxed text-black/70">
                Tiers appear on every peptide brief, on each benefit and each risk. They are also how we decide when
                to tell you <em>not enough data yet</em> instead of writing a deep-dive — and, often, why a provider
                recommends against something you came in asking for.
              </p>
              <CTA href="/regen-science" variant="outline">
                Look up a peptide
              </CTA>
            </div>
            <div className="flex flex-col gap-3">
              {EVIDENCE_TIERS.map((t) => (
                <div
                  key={t.n}
                  className="flex items-center gap-5 border-2 border-black rounded-2xl px-6 py-5 transition-colors hover:border-[#E6007E]"
                >
                  <span
                    className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-serif text-xl font-bold"
                    style={{
                      background: TIER_COLORS[t.n],
                      color: t.fill >= 4 ? "#fff" : "#000",
                    }}
                  >
                    {t.n}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-serif text-lg font-bold" style={{ letterSpacing: "-0.02em" }}>
                      {t.title}
                    </span>
                    <span className="text-sm text-black/65">{t.body}</span>
                  </span>
                  <span
                    className="ml-auto shrink-0 w-1.5 rounded-full"
                    style={{ height: `${t.fill * 9}px`, background: TIER_COLORS[t.n] }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Hype Quiz */}
        <section className="py-24 lg:py-28 border-t border-b border-black/10" style={{ background: BRAND.pinkSoft }}>
          <div className="max-w-[1280px] mx-auto px-6">
            <p className="m-0 mb-4 text-[11px] font-bold tracking-[0.22em] uppercase text-center" style={{ color: BRAND.pink }}>
              Practice
            </p>
            <h2
              className="m-0 mb-4 font-serif font-bold text-center"
              style={{ fontSize: "clamp(34px, 3.6vw, 46px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              Spot the hype
            </h2>
            <p className="m-0 mx-auto mb-12 text-lg leading-relaxed text-black/70 max-w-[700px] text-center">
              Three claims you will see online this week. Guess the tier each one actually earns, then see how the
              literature grades it. (1 = strongest, 5 = weakest.)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HYPE_CLAIMS.map((c) => (
                <HypeQuizCard key={c.n} claim={c} />
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <Section id="categories" className="py-24 lg:py-28 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <p className="m-0 mb-4 text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: BRAND.pink }}>
              By category
            </p>
            <h2
              className="m-0 mb-4 font-serif font-bold max-w-[900px]"
              style={{ fontSize: "clamp(34px, 3.6vw, 46px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              Metabolic, repair, skin, <span style={{ color: BRAND.pink }}>hormones and beyond</span>
            </h2>
            <p className="m-0 mb-12 text-lg leading-relaxed text-black/70 max-w-[780px]">
              Each brief covers mechanism, trial evidence, benefits, risks, and what our providers screen — with every
              claim tagged by tier. Molecules we do not prescribe are still listed, so you know why.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {PEPTIDE_CATEGORIES.map((cat) => (
                <div key={cat.title}>
                  <h3 className="m-0 mb-1 font-serif text-2xl font-bold" style={{ letterSpacing: "-0.02em" }}>
                    {cat.title}
                  </h3>
                  <p
                    className="m-0 mb-5 text-sm font-semibold tracking-wide uppercase"
                    style={{ color: BRAND.pink }}
                  >
                    {cat.sub}
                  </p>
                  <div className="flex flex-col gap-3">
                    {cat.items.map((it) => (
                      <Link
                        key={it.name}
                        href={it.href || "/regen-science"}
                        className="flex flex-col gap-2 border-2 border-black rounded-2xl p-4 text-black transition-all hover:border-[#E6007E] hover:-translate-y-1"
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-serif text-lg font-bold" style={{ letterSpacing: "-0.01em" }}>
                            {it.name}
                          </span>
                          <TierBadge tone={it.tone}>{it.tier}</TierBadge>
                        </span>
                        <span className="text-sm leading-snug text-black/70">{it.note}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Safety & Sourcing */}
        <Section id="safety" className="py-24 lg:py-28 bg-black">
          <div
            className="max-w-[1280px] mx-auto px-6 grid gap-16 items-start"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))" }}
          >
            <div>
              <p className="m-0 mb-4 text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: BRAND.pink }}>
                Safety & sourcing
              </p>
              <h2
                className="m-0 mb-5 font-serif font-bold text-white"
                style={{ fontSize: "clamp(34px, 3.6vw, 46px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                Most peptide problems <span style={{ color: BRAND.pink }}>aren&apos;t the molecule</span>
              </h2>
              <p className="m-0 mb-5 text-lg leading-relaxed text-white/70">
                They are a mislabeled vial, an unverified batch, or a contraindication nobody flagged. The FDA has
                repeatedly warned about identity and quality issues in compounded peptides — which is exactly why we
                dispense only through licensed pharmacies and only after an intake.
              </p>
              <p className="m-0 mb-8 text-lg leading-relaxed text-white/70">
                Risk education is the part seller pages skip. Ours is the same checklist our NPs work through with you
                in the room.
              </p>
              <div className="flex gap-3.5 flex-wrap">
                <CTA href={BOOKING_URL} variant="gradient">
                  Talk to a provider
                </CTA>
                <CTA href="/regen-science" variant="white">
                  Read the guides
                </CTA>
              </div>
            </div>
            <div className="bg-[#09090b] border-2 border-white/15 rounded-[22px] p-8">
              <p className="m-0 mb-6 text-[11px] font-bold tracking-wider uppercase text-white/50">
                What &ldquo;safety&rdquo; covers here
              </p>
              <div className="flex flex-col gap-5">
                {SAFETY_TOPICS.map((s, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="shrink-0 mt-0.5" style={{ color: BRAND.pink }}>
                      <ShieldCheckIcon className="w-5 h-5" />
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="text-base font-bold text-white">{s.h}</span>
                      <span className="text-[15px] leading-relaxed text-white/65">{s.b}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section id="faq" className="py-24 lg:py-28 bg-white">
          <div className="max-w-[900px] mx-auto px-6">
            <p className="m-0 mb-4 text-[11px] font-bold tracking-[0.22em] uppercase text-center" style={{ color: BRAND.pink }}>
              Questions worth asking
            </p>
            <h2
              className="m-0 mb-11 font-serif font-bold text-center"
              style={{ fontSize: "clamp(32px, 3.4vw, 44px)", letterSpacing: "-0.02em", lineHeight: 1.12 }}
            >
              Ask us these before you start anything
            </h2>
            <FaqAccordion items={PEPTIDE_EDUCATION_FAQS} />
          </div>
        </Section>

        {/* CTA */}
        <Section id="consult" className="relative py-24 text-center overflow-hidden">
          <div className="absolute inset-0" style={{ background: BRAND.pink }} />
          <div className="relative z-10 max-w-[820px] mx-auto px-6">
            <h2
              className="m-0 mb-5 font-serif font-bold text-white"
              style={{ fontSize: "clamp(34px, 3.8vw, 48px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              Start where it makes sense.
            </h2>
            <p className="m-0 mb-10 text-lg lg:text-xl leading-relaxed text-white/90">
              Never thought about a peptide before? Module 1 takes twenty minutes. Already know the chemistry? Bring
              your questions to a free 20-minute consult with a full-authority nurse practitioner — labs and history
              reviewed before anything is prescribed.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <CTA href="#modules" variant="white" className="shadow-xl font-bold">
                Begin module 1
              </CTA>
              <a
                href={BOOKING_URL}
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-[#E6007E] transition shadow-lg"
              >
                Book free consult
              </a>
            </div>
          </div>
        </Section>
      </main>

      <EducationFooter />
    </div>
  );
}
