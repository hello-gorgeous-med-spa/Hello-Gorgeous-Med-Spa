"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";
import type { ModuleContent } from "@/lib/regen/education-module-content";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  pinkSoft: "#FFF5F9",
  pinkMid: "#FCE7F3",
  pinkDeep: "#C90A68",
};

function ArrowLeftIcon({ className }: { className?: string }) {
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
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
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
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function CheckCircleIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
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
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
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

function ModuleHeader() {
  const navItems = [
    { label: "Services", href: "/services", colorClass: "border-pink-500/35 text-pink-400" },
    { label: "Shop RX", href: "/rx", colorClass: "border-blue-500/35 text-blue-400", badge: "NEW" },
    { label: "Peptide Education", href: "/regen-science/education", colorClass: "bg-gradient-to-r from-pink-500 to-pink-600 text-white", active: true },
    { label: "Regen Science", href: "/regen-science", colorClass: "border-pink-500/35 text-pink-400" },
    { label: "Memberships", href: "/memberships", colorClass: "border-amber-500/35 text-amber-400", emoji: "⭐" },
    { label: "Before & After", href: "/gallery", colorClass: "border-blue-500/35 text-blue-400" },
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

function ModuleFooter() {
  const footerLinks = {
    Education: [
      { label: "All modules", href: "/regen-science/education" },
      { label: "Evidence tiers", href: "/regen-science/education#evidence" },
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
      { label: "FAQ", href: "/faq" },
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
              {SITE.address.streetAddress}
              <br />
              {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}
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

interface EducationModulePageProps {
  module: ModuleContent;
}

export function EducationModulePage({ module }: EducationModulePageProps) {
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

      <ModuleHeader />

      <main className="min-w-0 flex-1">
        {/* Hero */}
        <Section className="relative pt-16 pb-12 lg:pt-20 lg:pb-16">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 14% 12%, rgba(255,45,142,0.10), transparent 44%),
                radial-gradient(circle at 86% 8%, rgba(255,45,142,0.06), transparent 40%)`,
            }}
          />
          <div className="relative max-w-[900px] mx-auto px-6" style={{ animation: "hgFadeUp 0.6s ease-out both" }}>
            <Link
              href="/regen-science/education"
              className="inline-flex items-center gap-2 text-sm font-semibold mb-6 transition-colors hover:text-[#E6007E]"
              style={{ color: BRAND.pink }}
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to all modules
            </Link>

            <div className="flex items-center gap-4 mb-5 flex-wrap">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-black text-white"
              >
                <BookOpenIcon className="w-4 h-4" />
                Module {module.moduleNumber}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-black/60">
                <ClockIcon className="w-4 h-4" />
                {module.readTime} read
              </span>
            </div>

            <h1
              className="m-0 mb-5 font-serif font-bold leading-tight"
              style={{ fontSize: "clamp(36px, 4vw, 52px)", letterSpacing: "-0.02em" }}
            >
              {module.title}
            </h1>
            <p className="m-0 mb-6 text-xl lg:text-2xl leading-relaxed text-black/75" style={{ color: BRAND.pinkDeep }}>
              {module.subtitle}
            </p>
            <p className="m-0 text-lg leading-relaxed text-black/70 max-w-[800px]">
              {module.heroDescription}
            </p>
          </div>
        </Section>

        {/* Learning Objectives */}
        <section className="border-t border-b border-black/10" style={{ background: BRAND.pinkSoft }}>
          <div className="max-w-[900px] mx-auto px-6 py-8">
            <p className="m-0 mb-4 text-[11px] font-bold tracking-wider uppercase" style={{ color: BRAND.pinkDeep }}>
              Learning objectives
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {module.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: BRAND.pink }} />
                  <span className="text-[15px] leading-relaxed text-black/80">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <Section className="py-16 lg:py-20 bg-white">
          <div className="max-w-[800px] mx-auto px-6">
            {module.sections.map((section, sectionIdx) => (
              <div
                key={sectionIdx}
                className={sectionIdx > 0 ? "mt-14 pt-14 border-t border-black/10" : ""}
              >
                <h2
                  className="m-0 mb-6 font-serif font-bold"
                  style={{ fontSize: "clamp(26px, 2.8vw, 32px)", letterSpacing: "-0.02em", lineHeight: 1.2 }}
                >
                  {section.heading}
                </h2>
                <div className="space-y-5">
                  {section.content.map((paragraph, pIdx) => (
                    <p
                      key={pIdx}
                      className="m-0 text-[17px] leading-[1.75] text-black/80"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Key Takeaways */}
        <Section className="py-16 lg:py-20 bg-black">
          <div className="max-w-[800px] mx-auto px-6">
            <p className="m-0 mb-4 text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: BRAND.pink }}>
              Key takeaways
            </p>
            <h2
              className="m-0 mb-8 font-serif font-bold text-white"
              style={{ fontSize: "clamp(28px, 3vw, 38px)", letterSpacing: "-0.02em", lineHeight: 1.15 }}
            >
              What to remember from this module
            </h2>
            <div className="space-y-4">
              {module.keyTakeaways.map((takeaway, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-[#09090b] border border-white/10 rounded-xl p-5"
                >
                  <span
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ background: BRAND.pink, color: "#fff" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[15px] leading-relaxed text-white/85">{takeaway}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Navigation */}
        <Section className="py-12 lg:py-16 bg-white border-t border-black/10">
          <div className="max-w-[900px] mx-auto px-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              {module.prevModuleSlug ? (
                <Link
                  href={`/regen-science/education/${module.prevModuleSlug}`}
                  className="flex items-center gap-3 px-6 py-4 rounded-xl border-2 border-black bg-white text-black font-semibold transition-all hover:border-[#E6007E] hover:-translate-y-1 hover:shadow-lg"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span className="flex flex-col items-start">
                    <span className="text-xs text-black/50 uppercase tracking-wider">Previous</span>
                    <span>Module {String(parseInt(module.moduleNumber) - 1).padStart(2, "0")}</span>
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {module.nextModuleSlug ? (
                <Link
                  href={`/regen-science/education/${module.nextModuleSlug}`}
                  className="flex items-center gap-3 px-6 py-4 rounded-xl border-2 border-black bg-black text-white font-semibold transition-all hover:bg-[#E6007E] hover:border-[#E6007E] hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="flex flex-col items-end">
                    <span className="text-xs text-white/50 uppercase tracking-wider">Next</span>
                    <span>Module {String(parseInt(module.moduleNumber) + 1).padStart(2, "0")}</span>
                  </span>
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  href={BOOKING_URL}
                  className="flex items-center gap-3 px-6 py-4 rounded-xl font-semibold text-white transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${BRAND.pinkHot}, ${BRAND.pink})` }}
                >
                  <span className="flex flex-col items-end">
                    <span className="text-xs text-white/70 uppercase tracking-wider">Ready?</span>
                    <span>Book your consult</span>
                  </span>
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </Section>

        {/* CTA */}
        <Section className="relative py-20 text-center overflow-hidden">
          <div className="absolute inset-0" style={{ background: BRAND.pink }} />
          <div className="relative z-10 max-w-[700px] mx-auto px-6">
            <h2
              className="m-0 mb-5 font-serif font-bold text-white"
              style={{ fontSize: "clamp(30px, 3.4vw, 42px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              Questions about what you just read?
            </h2>
            <p className="m-0 mb-8 text-lg leading-relaxed text-white/90">
              Our nurse practitioners review labs and history before any peptide is prescribed. Bring your questions to a free 20-minute consult.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <CTA href="/regen-science/education" variant="white" className="shadow-xl font-bold">
                See all modules
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

      <ModuleFooter />
    </div>
  );
}
