"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CartButton } from "@/components/regen/RegenCartDrawer";

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */

const PHONE = "(630) 636-6193";
const PHONE_HREF = "tel:+16306366193";

const NAV_CATS = [
  { title: "Weight Loss", href: "/rx/weight-loss" },
  { title: "Daily Wellness", href: "/rx/wellness" },
  { title: "Sexual Health", href: "/rx/sexual-health" },
  { title: "Hormones", href: "/rx/hormones" },
  { title: "Labs", href: "/labs" },
];

const TRUST_ITEMS = [
  { id: "pharmacy", icon: "💊", text: "US-based licensed pharmacies" },
  { id: "pricing", icon: "🛡️", text: "Transparent pricing, no hidden fees" },
  { id: "providers", icon: "👤", text: "Board-certified providers" },
];

const SOCIAL_PROOF = [
  { id: "google", value: "4.4★", label: "117 Google reviews" },
  { id: "fresha", value: "5.0★", label: "1,931 Fresha reviews" },
  { id: "best", value: "#1", label: "Best Med Spa in Oswego" },
  { id: "np", value: "NP", label: "Nurse-practitioner directed" },
];

const CATEGORY_TILES = [
  { id: "weight", title: "Weight Loss", tag: "GLP-1 & metabolic", icon: "⚖️", href: "/rx/weight-loss", tint: "#FFF8F0" },
  { id: "labs", title: "Labs", tag: "Advanced lab testing", icon: "🧪", href: "/labs", tint: "#F0F8FF" },
  { id: "wellness", title: "Daily Wellness", tag: "Longevity, NAD+ & peptides", icon: "✦", href: "/rx/wellness", tint: "#F8FFF0" },
  { id: "vitamins", title: "Vitamin Injections", tag: "At-home wellness shots", icon: "💉", href: "/rx/vitamins", tint: "#FFF0F8" },
  { id: "sexual", title: "Sexual Health", tag: "ED, libido & intimacy", icon: "❤️", href: "/rx/sexual-health", tint: "#FFF0F0" },
  { id: "hormones", title: "Hormones", tag: "TRT, HCG & bioidentical HRT", icon: "⚕️", href: "/rx/hormones", tint: "#F0FFF8" },
  { id: "hair", title: "Hair + Skin", tag: "Regrowth & Rx dermatology", icon: "✨", href: "/rx/hair-skin", tint: "#FFF8FF" },
];

const STEPS = [
  { num: 1, title: "Complete a free consult", body: "Share your history and goals in minutes. We screen you like a medical practice — because we are one." },
  { num: 2, title: "A provider reviews", body: "Our nurse-practitioner-directed team reviews your intake and, if appropriate, prescribes a personalized plan." },
  { num: 3, title: "Delivered to your door", body: "Your compounded medication ships discreetly from a licensed pharmacy. Flat $30 shipping on every order." },
];

const WHY_BULLETS = [
  { title: "NP-directed care", desc: "Licensed clinicians review every order" },
  { title: "US-based compounding pharmacies", desc: "503A/503B partners, shipped nationwide" },
  { title: "Transparent pricing", desc: "No hidden fees — flat $30 shipping" },
];

const FAQ_ITEMS = [
  { q: "Is this legitimate medical care?", a: "Yes. RE GEN is the prescription arm of Hello Gorgeous Med Spa, a nurse-practitioner-directed medical practice. A licensed provider reviews your intake before anything is prescribed." },
  { q: "What does shipping cost?", a: "A flat $30 ships your order discreetly to your door, anywhere we serve. Pricing for each medication is shown on its treatment page." },
  { q: "Are compounded medications FDA-approved?", a: "Compounded medications are prepared by a licensed pharmacy for an individual patient and are not FDA-approved products. Your provider will review whether a compounded option is appropriate for you." },
  { q: "Do I need to come in to the clinic?", a: "Most treatments can be started 100% online. Some therapies may require labs or an in-person visit in Oswego, IL — your provider will let you know." },
];

/* ─────────────────────────────────────────────────────────────
   UTILITY BAR (Black top bar)
───────────────────────────────────────────────────────────── */

function UtilityBar() {
  return (
    <div className="border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white/80">
        {TRUST_ITEMS.map((item) => (
          <span key={item.id} className="flex items-center gap-2">
            <span className="text-sm">{item.icon}</span>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NAV (Black sticky nav)
───────────────────────────────────────────────────────────── */

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-black text-white">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-3">
        <Link href="/rx">
          <Image
            src="/images/regen/regen-logo-white.png"
            alt="RE GEN by Hello Gorgeous Med Spa"
            width={160}
            height={46}
            className="h-[46px] w-auto"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-2 md:flex">
          {NAV_CATS.map((cat, i) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="relative px-3 py-1.5 text-[15px] font-medium opacity-90 transition hover:text-[#FF2D8E] hover:opacity-100"
            >
              {i > 0 && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#FF2D8E] opacity-85" />
              )}
              {cat.title}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <CartButton />
          <Link
            href="/rx/start"
            className="hidden items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold transition hover:border-[#FF2D8E] hover:text-[#FF2D8E] sm:inline-flex"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Login
          </Link>
          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 md:hidden"
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-black px-6 py-4 md:hidden">
          {NAV_CATS.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="block py-3 text-lg font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              {cat.title}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO (Dark with photo background)
───────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative min-h-[600px] overflow-hidden bg-[#0c0b0c] text-white">
      {/* Background image with Ken Burns */}
      <div
        className="absolute inset-0 left-[40%] animate-[kenburns_24s_ease-in-out_infinite_alternate] bg-cover bg-right bg-no-repeat"
        style={{ backgroundImage: "url('/images/regen/hero-photo.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0b0c] via-[#0c0b0c]/55 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-20 lg:py-24">
        <h1 className="max-w-[13ch] text-[clamp(2.6rem,5.4vw,4.6rem)] font-bold leading-[1.0] tracking-tight">
          We're simplifying your path to wellness
          <span className="inline-block animate-[dotpulse_2.6s_ease-in-out_infinite] text-[#FF2D8E]">.</span>
        </h1>
        <div className="my-7 h-[3px] w-[120px] bg-[#FF2D8E]" />
        <Link
          href="#treatments"
          className="inline-flex items-center gap-2 rounded-full bg-[#FF2D8E] px-7 py-4 text-base font-semibold shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
        >
          Find your treatment
        </Link>

        {/* Floating product card */}
        <div className="mt-9 flex max-w-[440px] gap-4 rounded-2xl bg-white p-4 text-black shadow-2xl">
          <div className="flex h-24 w-24 flex-none items-center justify-center overflow-hidden rounded-xl bg-white p-1.5">
            <Image
              src="/images/regen/prod-tirzepatide.jpg"
              alt="Compounded Tirzepatide"
              width={96}
              height={96}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF8E7] px-2.5 py-1 text-[10px] font-bold text-[#7a5b00]">
              ★ Most Popular
            </span>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-black/50">Weight Loss</p>
            <p className="text-lg font-bold leading-tight">
              Compounded Tirzepatide <span className="text-xs italic text-black/40">Rx</span>
            </p>
            <div className="mt-3 flex gap-2">
              <Link
                href="/rx/weight-loss"
                className="flex-1 rounded-full border border-black/25 py-2.5 text-center text-xs font-semibold transition hover:border-black"
              >
                Learn more
              </Link>
              <Link
                href="/rx/start"
                className="flex-1 rounded-full bg-black py-2.5 text-center text-xs font-semibold text-white transition hover:bg-[#FF2D8E]"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SOCIAL PROOF BAR
───────────────────────────────────────────────────────────── */

function SocialProofBar() {
  return (
    <section className="bg-black text-white">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-7">
        {SOCIAL_PROOF.map((item) => (
          <div key={item.id} className="flex items-center gap-2.5 text-[15px]">
            <span className="font-display text-[22px] font-bold text-[#FF2D8E]">{item.value}</span>
            {item.label}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   CATEGORY TILES
───────────────────────────────────────────────────────────── */

function CategoryGrid() {
  return (
    <section id="treatments" className="bg-white py-16">
      <div className="mx-auto max-w-[1280px] px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">Shop by goal</p>
        <h2 className="mt-3 text-3xl font-bold">
          Prescription treatments for your <span className="text-[#FF2D8E]">health goals</span>
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_TILES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex min-h-[118px] items-center gap-4 rounded-2xl px-6 py-5 transition hover:-translate-y-1 hover:shadow-lg"
              style={{ background: cat.tint }}
            >
              <span className="flex h-[62px] w-[62px] flex-none items-center justify-center rounded-xl bg-white/70 text-2xl">
                {cat.icon}
              </span>
              <div className="flex-1">
                <p className="text-xl font-bold leading-tight">{cat.title}</p>
                <p className="mt-1 text-[13px] text-black/60">{cat.tag}</p>
              </div>
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-black text-white transition group-hover:bg-[#FF2D8E]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────────────────────────── */

function HowItWorks() {
  return (
    <section className="bg-white pb-20 pt-5">
      <div className="mx-auto max-w-[1100px] px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">How it works</p>
        <h2 className="mt-3 text-3xl font-bold">
          Care that's <span className="text-[#FF2D8E]">100% online</span>
        </h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.num} className="text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF2D8E] text-xl font-bold text-white">
                {step.num}
              </div>
              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-black/70">{step.body}</p>
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

function WhyRegen() {
  return (
    <section className="bg-black py-20 text-white">
      <div className="mx-auto grid max-w-[1100px] items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Why RE GEN</p>
          <h2 className="mt-3 text-3xl font-bold">
            Real providers. <span className="text-[#FF2D8E]">Real medicine.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/80">
            RE GEN is the medical-prescription arm of Hello Gorgeous Med Spa — the #1 best med spa in Oswego. 
            Founders Dani & Ryan, a female + male provider team, are on site weekly. Every plan is directed 
            by a full-authority nurse practitioner.
          </p>

          <div className="mt-8 space-y-4">
            {WHY_BULLETS.map((b) => (
              <div key={b.title} className="flex gap-3">
                <span className="text-[#FF2D8E]">✦</span>
                <div>
                  <span className="font-bold">{b.title}</span>
                  <br />
                  <span className="text-[15px] text-white/65">{b.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={PHONE_HREF}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF2D8E] px-7 py-4 text-base font-semibold transition hover:scale-[1.02]"
          >
            Call {PHONE}
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl bg-[#0c0b0c]">
          <Image
            src="/images/regen/banner-wellness.jpg"
            alt="RE GEN — done surviving, ready to thrive"
            width={600}
            height={480}
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FAQ
───────────────────────────────────────────────────────────── */

function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[820px] px-6">
        <div className="mb-9 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">Common questions</p>
          <h2 className="mt-3 text-3xl font-bold">
            Good to <span className="text-[#FF2D8E]">know</span>
          </h2>
        </div>

        <div className="divide-y divide-black/10 border-y border-black/10">
          {FAQ_ITEMS.map((item, i) => (
            <details
              key={i}
              open={openIndex === i}
              onToggle={(e) => {
                if ((e.target as HTMLDetailsElement).open) setOpenIndex(i);
              }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[19px] font-semibold">
                {item.q}
                <span className="text-2xl font-normal text-[#FF2D8E] transition-transform">
                  {openIndex === i ? "×" : "+"}
                </span>
              </summary>
              <p className="max-w-[70ch] pb-5 text-[16px] leading-[1.7] text-black/70">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   CTA BAND
───────────────────────────────────────────────────────────── */

function CtaBand() {
  return (
    <section className="bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] py-20 text-center text-white">
      <div className="mx-auto max-w-[720px] px-6">
        <h2 className="text-3xl font-bold">Ready to start feeling gorgeous?</h2>
        <p className="mt-4 text-lg text-white/90">
          Take the free intake — a provider will review and reach out, often same day.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/rx/start"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#FF2D8E] transition hover:scale-[1.02]"
          >
            Get started
          </Link>
          <Link
            href={PHONE_HREF}
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-base font-semibold transition hover:bg-white/10"
          >
            Call {PHONE}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1280px] px-6 pb-9 pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Image
              src="/images/regen/regen-logo-white.png"
              alt="RE GEN"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
            <p className="mt-4 text-[15px] text-white/70">
              74 W. Washington Street
              <br />
              Oswego, IL 60543
              <br />
              {PHONE}
            </p>
          </div>

          {/* Treatments */}
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-white/60">Treatments</h4>
            <ul className="mt-4 space-y-2.5">
              {NAV_CATS.map((cat) => (
                <li key={cat.title}>
                  <Link href={cat.href} className="text-[15px] text-white/85 hover:text-[#FF2D8E]">
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-white/60">Company</h4>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/rx" className="text-[15px] text-white/85 hover:text-[#FF2D8E]">RX Home</Link></li>
              <li><Link href="/rx/start" className="text-[15px] text-white/85 hover:text-[#FF2D8E]">Get started</Link></li>
              <li><Link href="/" className="text-[15px] text-white/85 hover:text-[#FF2D8E]">Hello Gorgeous Med Spa</Link></li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-white/60">Get started</h4>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/rx/start" className="text-[15px] text-white/85 hover:text-[#FF2D8E]">Free intake</Link></li>
              <li><Link href={PHONE_HREF} className="text-[15px] text-white/85 hover:text-[#FF2D8E]">Call us</Link></li>
              <li><Link href="/book" className="text-[15px] text-white/85 hover:text-[#FF2D8E]">Book on Fresha</Link></li>
            </ul>
          </div>
        </div>

        <p className="mt-10 max-w-[1000px] border-t border-white/12 pt-6 text-xs leading-relaxed text-white/50">
          RE GEN by Hello Gorgeous Med Spa. Information on this site is for general educational purposes and is not 
          medical advice. Prescription products require evaluation by a licensed provider, who determines whether 
          treatment is appropriate. Some products are compounded by a licensed pharmacy and are not FDA-approved. 
          Individual results vary. Patient information is treated as protected health information. © 2026 Hello 
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
    <div className="min-h-[100dvh]">
      <style jsx global>{`
        @keyframes kenburns {
          from { transform: scale(1) translateX(0); }
          to { transform: scale(1.13) translateX(-2%); }
        }
        @keyframes dotpulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.7); opacity: 0.55; }
        }
      `}</style>
      <UtilityBar />
      <Nav />
      <Hero />
      <SocialProofBar />
      <CategoryGrid />
      <HowItWorks />
      <WhyRegen />
      <Faq />
      <CtaBand />
      <Footer />
    </div>
  );
}
