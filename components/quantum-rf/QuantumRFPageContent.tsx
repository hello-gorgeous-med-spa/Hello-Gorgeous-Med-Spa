"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  QUANTUM_RF_AREAS_10,
  QUANTUM_RF_CONTACT,
  QUANTUM_RF_FAQS,
  QUANTUM_RF_FOUNDER_NOTE,
  QUANTUM_RF_INMODE_STORY,
  QUANTUM_RF_INTRO_SPECIAL,
  QUANTUM_RF_MARKETING,
  QUANTUM_RF_NAV,
  QUANTUM_RF_PACKAGES,
  QUANTUM_RF_RESULTS,
  QUANTUM_RF_STEPS,
  QUANTUM_RF_TREATS,
  QUANTUM_RF_WHAT_IT_DOES,
} from "@/lib/quantum-rf-marketing";
import { SITE } from "@/lib/seo";

type ResultsFilter = "all" | "face" | "body";

function PinkBtn({
  href,
  children,
  className = "",
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const cls = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#FF2D8E] px-7 py-3.5 text-base font-extrabold text-black transition hover:-translate-y-0.5 hover:bg-white ${className}`;
  if (external || href.startsWith("tel:") || href.startsWith("sms:")) {
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

function GhostBtn({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const isExternal = href.startsWith("tel:") || href.startsWith("sms:") || href.startsWith("http");
  const cls = `inline-flex items-center justify-center gap-2 rounded-full border border-white/45 px-7 py-3.5 text-base font-bold text-white transition hover:-translate-y-0.5 hover:border-[#FF2D8E] hover:text-[#FF2D8E] ${className}`;
  if (isExternal) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-extrabold uppercase tracking-[0.3em] text-[#FF2D8E]">{children}</p>;
}

function SectionHead({
  eyebrow,
  title,
  titleAccent,
  description,
  center,
}: {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-[720px] ${center ? "mx-auto text-center" : ""}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-serif text-[34px] font-bold leading-[1.05] text-white lg:text-[46px]">
        {title}
        {titleAccent ? (
          <>
            {" "}
            <span className="text-[#FF2D8E]">{titleAccent}</span>
          </>
        ) : null}
      </h2>
      {description ? <p className="mt-4 text-lg leading-relaxed text-white/70">{description}</p> : null}
    </div>
  );
}

export function QuantumRFPageContent() {
  const [navOpen, setNavOpen] = useState(false);
  const [resultsFilter, setResultsFilter] = useState<ResultsFilter>("all");
  const { bookHref, phoneTel, phoneDisplay, textTel, textDisplay, financingHref } = QUANTUM_RF_CONTACT;
  const { images } = QUANTUM_RF_MARKETING;
  const filteredResults =
    resultsFilter === "all"
      ? QUANTUM_RF_RESULTS
      : QUANTUM_RF_RESULTS.filter((r) => r.area === resultsFilter);

  return (
    <div className="min-h-[100dvh] bg-black font-sans text-white">
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/82 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5 font-bold">
            <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-[13px] font-extrabold text-white">
              HG
            </span>
            <span className="hidden text-base sm:inline">Quantum RF · Luxora</span>
          </div>
          <button
            type="button"
            className="rounded-lg border border-white/20 px-3 py-1.5 text-sm font-bold lg:hidden"
            onClick={() => setNavOpen((o) => !o)}
            aria-expanded={navOpen}
            aria-label="Toggle menu"
          >
            Menu
          </button>
          <div className="hidden items-center gap-6 text-[15px] lg:flex">
            {QUANTUM_RF_NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-white/75 transition hover:text-white">
                {item.label}
              </a>
            ))}
            <PinkBtn href={bookHref} className="!px-5 !py-2.5 !text-[15px]">
              Book Now
            </PinkBtn>
          </div>
        </div>
        {navOpen ? (
          <div className="border-t border-white/10 px-6 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {QUANTUM_RF_NAV.map((item) => (
                <a key={item.href} href={item.href} className="text-white/85" onClick={() => setNavOpen(false)}>
                  {item.label}
                </a>
              ))}
              <PinkBtn href={bookHref} className="mt-2 w-full">
                Book Now
              </PinkBtn>
            </div>
          </div>
        ) : null}
      </nav>

      <header className="relative overflow-hidden bg-[radial-gradient(90%_70%_at_78%_25%,#2a0820_0%,#12030c_55%,#000_100%)]">
        <div
          className="pointer-events-none absolute -right-28 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,45,142,0.28),transparent_62%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-24">
          <div>
            <Eyebrow>{QUANTUM_RF_MARKETING.eyebrow}</Eyebrow>
            <h1 className="mt-4 font-serif text-[44px] font-bold leading-[1.02] text-white lg:text-[66px]">
              Your Quantum RF <span className="text-[#FF2D8E]">Journey</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80 lg:text-xl">
              {QUANTUM_RF_MARKETING.subhead} {SITE.tagline}
            </p>
            <p className="mt-3 text-sm text-white/55">{QUANTUM_RF_MARKETING.trustLine}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <PinkBtn href={bookHref}>Book a Free Consult</PinkBtn>
              <GhostBtn href={textTel}>Text {textDisplay}</GhostBtn>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["InMode Luxora", "No surgery", "1 treatment typical", "From $2,499"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-semibold"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)] lg:max-w-lg">
            <div className="relative aspect-video w-full bg-black">
              <video
                src={QUANTUM_RF_MARKETING.heroVideo}
                poster={images.hero}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-contain"
                aria-label="InMode Luxora Quantum RF platform — Hello Gorgeous Med Spa"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 bg-[#FF2D8E] px-6 py-4 text-center text-[15px] font-extrabold tracking-wide text-black">
        <span>★★★★★ 5.0 on Fresha · 1,931 reviews</span>
        <span className="hidden sm:inline">·</span>
        <span>Only Quantum RF in the western suburbs</span>
        <span className="hidden sm:inline">·</span>
        <span>Full-authority NP on site</span>
      </div>

      <section id="why" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-14 lg:py-20">
        <div className="mx-auto max-w-4xl rounded-[20px] border border-[#FF2D8E]/35 bg-[#0a0206] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-[#FF2D8E] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-black">
                {QUANTUM_RF_INTRO_SPECIAL.badge}
              </span>
              <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">{QUANTUM_RF_INTRO_SPECIAL.title}</h2>
              <p className="mt-2 max-w-xl text-white/75">{QUANTUM_RF_INTRO_SPECIAL.description}</p>
            </div>
            <div className="text-right">
              <p className="font-serif text-4xl font-bold text-[#FF2D8E]">{QUANTUM_RF_INTRO_SPECIAL.priceLabel}</p>
              <p className="max-w-[220px] text-sm text-white/55">{QUANTUM_RF_INTRO_SPECIAL.priceNote}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <PinkBtn href={bookHref}>{QUANTUM_RF_INTRO_SPECIAL.ctaLabel}</PinkBtn>
            <GhostBtn href={financingHref} className="!border-white/30">
              Cherry financing
            </GhostBtn>
          </div>
        </div>
      </section>

      <section id="inmode" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
            <div className="relative aspect-video w-full bg-black">
              <video
                src={QUANTUM_RF_MARKETING.ryanVideo}
                poster={images.ryanPoster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
                aria-label="Ryan Kent performing Quantum RF at Hello Gorgeous Med Spa"
              />
            </div>
          </div>
          <div>
            <Eyebrow>{QUANTUM_RF_INMODE_STORY.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-serif text-[34px] font-bold leading-tight text-white lg:text-[48px]">
              {QUANTUM_RF_INMODE_STORY.title}{" "}
              <span className="text-[#FF2D8E]">{QUANTUM_RF_INMODE_STORY.titleAccent}</span>
            </h2>
            <div className="mt-5 flex max-w-xl flex-col gap-4 text-[17px] leading-relaxed text-white/85">
              {QUANTUM_RF_INMODE_STORY.body.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {QUANTUM_RF_INMODE_STORY.chips.map((chip) => (
                <span key={chip} className="rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-semibold">
                  {chip}
                </span>
              ))}
            </div>
            <blockquote className="mt-7 max-w-xl border-l-[3px] border-[#FF2D8E] pl-5 font-serif text-xl italic leading-snug text-white">
              &ldquo;{QUANTUM_RF_INMODE_STORY.quote}&rdquo;
            </blockquote>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <PinkBtn href={bookHref}>Book Quantum consult</PinkBtn>
              <GhostBtn href={QUANTUM_RF_MARKETING.trifectaHref}>See InMode Trifecta</GhostBtn>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-[1200px] gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-white/14">
            <Image src={images.overview} alt="InMode Quantum RF technology overview" width={1200} height={800} className="h-auto w-full" />
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/14">
            <Image src={images.handpieces} alt="InMode QuantumRF handpieces and before/after education" width={1200} height={800} className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section className="bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
          <div className="overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={images.founder}
                alt="Danielle Alcala-Glazier and Ryan Kent, FNP-BC — Founders, Hello Gorgeous Med Spa"
                fill
                className="object-cover object-[center_22%]"
                sizes="(max-width: 1024px) 100vw, 380px"
              />
            </div>
          </div>
          <div>
            <Eyebrow>{QUANTUM_RF_FOUNDER_NOTE.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight text-white lg:text-[44px]">
              {QUANTUM_RF_FOUNDER_NOTE.title}
            </h2>
            <div className="mt-6 flex max-w-xl flex-col gap-4 text-[17px] leading-relaxed text-white/85">
              {QUANTUM_RF_FOUNDER_NOTE.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-baseline gap-3.5">
              <span className="font-serif text-[28px] font-bold text-[#FF2D8E]">{QUANTUM_RF_FOUNDER_NOTE.signOff}</span>
              <span className="text-[13px] font-bold uppercase tracking-[0.16em] text-white/60">
                {QUANTUM_RF_FOUNDER_NOTE.role}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead eyebrow="Why Quantum RF" title="Fat + tighten" titleAccent="in one pass" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUANTUM_RF_WHAT_IT_DOES.map((item) => (
              <article key={item.id} className="flex h-full flex-col rounded-[20px] border border-white/14 bg-[#0a0206] p-5">
                <p className="font-serif text-3xl font-bold text-[#FF2D8E]">{item.stat}</p>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-white/45">{item.statLabel}</p>
                <h3 className="mt-3 font-serif text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{item.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/40">*Individual results vary. Fat-reduction percentage reflects manufacturer-reported potential, not a guarantee.</p>
        </div>
      </section>

      <section id="treats" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="What Quantum treats"
            title="Face + body"
            titleAccent="contour zones"
            description="QuantumRF 10 for delicate face & small zones — body protocols for larger sculpting."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            {QUANTUM_RF_TREATS.map((t) => (
              <span key={t} className="rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-semibold">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#FF2D8E]">QuantumRF 10 — smaller zones</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {QUANTUM_RF_AREAS_10.map((a) => (
                <span key={a} className="rounded-full border border-[#FF2D8E]/40 px-4 py-1.5 text-[13px] font-semibold text-[#FFB8DC]">
                  {a}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-10 overflow-hidden rounded-3xl border border-[#FF2D8E]/35 bg-white">
            <Image
              src={images.flyer}
              alt="Hello Gorgeous Quantum RF launch packages flyer — neck and abdomen pricing"
              width={1200}
              height={1600}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section id="results" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="Real results"
            title="Before & after —"
            titleAccent="Quantum RF"
            description="Hello Gorgeous clinic cases plus curated InMode QuantumRF 10 clinical results. Individual results vary."
          />
          <div className="mt-6 flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["face", "Face"],
                ["body", "Body"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setResultsFilter(id)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                  resultsFilter === id
                    ? "border-[#FF2D8E] bg-[#FF2D8E] text-black"
                    : "border-white/25 text-white/80 hover:border-[#FF2D8E] hover:text-[#FF2D8E]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResults.map((item) => (
              <figure key={item.src} className="overflow-hidden rounded-[20px] border border-[#FF2D8E]/35 bg-[#0a0206]">
                <Image src={item.src} alt={item.alt} width={700} height={700} className="h-auto w-full" />
                <figcaption className="flex items-center justify-between gap-2 border-t border-white/10 px-4 py-3">
                  <span className="text-sm font-bold text-[#FF2D8E]">{item.label}</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/40">
                    {item.source === "clinic" ? "HG clinic" : "InMode"}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-24 px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead eyebrow="How it works" title="Consult to" titleAccent="contour reveal" />
            <ol className="mt-8 space-y-4">
              {QUANTUM_RF_STEPS.map((step) => (
                <li key={step.step} className="rounded-[20px] border border-white/14 bg-[#0a0206] p-4">
                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF2D8E] text-sm font-extrabold text-black">
                      {step.step}
                    </span>
                    <div>
                      <h3 className="font-bold text-white">{step.title}</h3>
                      <p className="mt-1 text-sm text-white/75">{step.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <Link
              href={QUANTUM_RF_MARKETING.careHref}
              className="mt-6 inline-flex text-sm font-bold text-[#FF2D8E] underline underline-offset-4"
            >
              Pre & post care guide →
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={images.procedure}
                alt="Quantum RF procedure at Hello Gorgeous Med Spa Oswego"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 520px"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead eyebrow="Pricing" title="Launch packages ·" titleAccent="FREE Morpheus8 Burst" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUANTUM_RF_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className={`flex h-full flex-col rounded-[20px] border bg-[#0a0206] p-5 ${
                  pkg.highlight ? "border-[#FF2D8E]/60 ring-1 ring-[#FF2D8E]/30" : "border-white/14"
                }`}
              >
                {"badge" in pkg && pkg.badge ? (
                  <span className="mb-2 inline-flex w-fit rounded-full bg-[#FF2D8E] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-black">
                    {pkg.badge}
                  </span>
                ) : null}
                <h3 className="font-serif text-lg font-bold text-white">{pkg.name}</h3>
                <p className="mt-2 font-serif text-3xl font-bold text-[#FF2D8E]">{pkg.price}</p>
                <p className="text-xs text-white/55">{pkg.detail}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-white/80">
                  {pkg.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-[#FF2D8E]" aria-hidden>
                        ✓
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <PinkBtn
                    href={"href" in pkg && pkg.href ? pkg.href : bookHref}
                    className="w-full !px-4 !py-2.5 !text-sm"
                  >
                    {"href" in pkg && pkg.href ? "View specials" : "Book consult"}
                  </PinkBtn>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl rounded-[20px] border border-[#FF2D8E]/35 bg-[#0a0206] p-8 text-center">
          <Eyebrow>InMode Trifecta</Eyebrow>
          <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">
            Contour + depth + surface = complete transformation
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Quantum contours fat. Morpheus8 remodels beneath. Solaria resurfaces. Together — VIP Trifecta.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <GhostBtn href={QUANTUM_RF_MARKETING.compareMorpheusHref}>Explore Morpheus8</GhostBtn>
            <GhostBtn href={QUANTUM_RF_MARKETING.compareSolariaHref}>Explore Solaria CO₂</GhostBtn>
            <PinkBtn href={QUANTUM_RF_MARKETING.trifectaHref}>VIP Trifecta packages</PinkBtn>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[900px]">
          <SectionHead eyebrow="FAQ" title="Quantum RF" titleAccent="questions" />
          <div className="mt-10 space-y-3">
            {QUANTUM_RF_FAQS.map((faq, idx) => (
              <details
                key={faq.q}
                className="group rounded-[20px] border border-white/14 bg-[#0a0206] open:border-[#FF2D8E]/50"
                {...(idx === 0 ? { open: true } : {})}
              >
                <summary className="cursor-pointer list-none px-5 py-4 font-bold text-white marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-3">
                    <span>{faq.q}</span>
                    <span className="text-[#FF2D8E] transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <div className="border-t border-white/10 px-5 pb-4 pt-3 text-sm leading-relaxed text-white/80">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FF2D8E] px-6 py-16 text-black lg:py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="font-serif text-[34px] font-bold leading-tight lg:text-[46px]">
            Ready for real contour — without surgery?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-black/80">
            Free consult · InMode Luxora · Neck from $2,499 · Oswego IL
          </p>
          <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
            <Link
              href={bookHref}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black bg-black px-8 py-3 text-sm font-extrabold text-white transition hover:bg-white hover:text-black"
            >
              Book free consult
            </Link>
            <a
              href={textTel}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black/60 px-8 py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white"
            >
              Text {textDisplay}
            </a>
            <a
              href={phoneTel}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black/60 px-8 py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white"
            >
              Call {phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
