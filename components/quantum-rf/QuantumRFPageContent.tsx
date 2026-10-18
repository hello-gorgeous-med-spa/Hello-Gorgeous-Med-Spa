"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { JourneyFitImage } from "@/components/marketing/JourneyFitImage";
import { JourneyResultsCinema } from "@/components/marketing/JourneyResultsCinema";
import { JourneySoundVideo } from "@/components/marketing/JourneySoundVideo";
import {
  QUANTUM_RF_AREAS_10,
  QUANTUM_RF_BENEFITS,
  QUANTUM_RF_CANDIDACY,
  QUANTUM_RF_CONTACT,
  QUANTUM_RF_FAQS,
  QUANTUM_RF_FOUNDER_NOTE,
  QUANTUM_RF_INMODE_STORY,
  QUANTUM_RF_INTRO_SPECIAL,
  QUANTUM_RF_MARKETING,
  QUANTUM_RF_NAV,
  QUANTUM_RF_FEATURED_RESULTS,
  QUANTUM_RF_PACKAGES,
  QUANTUM_RF_PHYSICIAN,
  QUANTUM_RF_RECOVERY,
  QUANTUM_RF_RESULTS,
  QUANTUM_RF_STEPS,
  QUANTUM_RF_TREATS,
  QUANTUM_RF_TREATMENT_GALLERY,
  QUANTUM_RF_WHAT_IT_DOES,
  QUANTUM_RF_WHAT_IS,
} from "@/lib/quantum-rf-marketing";
import { SITE } from "@/lib/seo";

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
  const { bookHref, phoneTel, phoneDisplay, textTel, textDisplay, financingHref } = QUANTUM_RF_CONTACT;
  const { images } = QUANTUM_RF_MARKETING;

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
            <h1 className="mt-4 font-serif text-[38px] font-bold leading-[1.08] text-white lg:text-[54px]">
              {QUANTUM_RF_MARKETING.headline} <span className="text-[#FF2D8E]">{QUANTUM_RF_MARKETING.headlineAccent}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80 lg:text-xl">
              {QUANTUM_RF_MARKETING.subhead}
            </p>
            <div className="mt-5 rounded-xl border border-white/20 bg-white/5 px-5 py-4">
              <p className="text-sm font-bold text-white">{QUANTUM_RF_MARKETING.physicianLine}</p>
              <p className="mt-1 text-xs text-white/60">Hello Gorgeous Med Spa</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <PinkBtn href={bookHref}>Book Your Quantum RF Consultation</PinkBtn>
              <GhostBtn href={phoneTel}>Call Our Team</GhostBtn>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)] lg:max-w-lg">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/images/quantum-rf/clinic-results/dr-arora-treating-1.jpg"
                alt="Dr. Mukesh Arora, MD performing Quantum RF treatment at Hello Gorgeous Med Spa in Oswego, Illinois"
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
            <div className="bg-gradient-to-r from-[#0a0206] to-[#1a0510] px-5 py-4">
              <p className="font-bold text-white">Dr. Mukesh Arora, MD</p>
              <p className="text-sm text-white/70">Treating Physician & Medical Director</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 bg-[#FF2D8E] px-6 py-4 text-center text-[15px] font-extrabold tracking-wide text-black">
        <span>★★★★★ 5.0 from 1,931 verified visits</span>
        <span className="hidden sm:inline">·</span>
        <span>Verified InMode Provider</span>
        <span className="hidden sm:inline">·</span>
        <span>Physician-directed</span>
      </div>

      {/* What Is QuantumRF? — Educational section for AI search */}
      <section id="what-is" className="scroll-mt-24 bg-white px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.3em] text-[#E6007E]">
            {QUANTUM_RF_WHAT_IS.eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight text-black lg:text-[42px]">
            {QUANTUM_RF_WHAT_IS.title} <span className="text-[#E6007E]">{QUANTUM_RF_WHAT_IS.titleAccent}</span>
          </h2>
          <div className="mt-6 flex flex-col gap-4 text-lg leading-relaxed text-black/80">
            {QUANTUM_RF_WHAT_IS.body.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <p className="mt-4 text-sm italic text-black/60">{QUANTUM_RF_WHAT_IS.disclaimer}</p>
          <div className="mt-6">
            <a
              href={QUANTUM_RF_WHAT_IS.inmodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#E6007E] underline underline-offset-4 hover:text-black"
            >
              Learn more about QuantumRF on InMode.com →
            </a>
          </div>
        </div>
      </section>

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
        <div className="mx-auto grid max-w-[1200px] items-center gap-10">
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
              <GhostBtn href={QUANTUM_RF_MARKETING.inmodeUrl} className="!border-white/20 !text-white/70">
                InMode Official →
              </GhostBtn>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-[1200px] gap-3 sm:grid-cols-2 sm:gap-4">
          <JourneyFitImage
            src={images.overview}
            alt="InMode Quantum RF technology overview"
            aspectClassName="aspect-[16/10]"
          />
          <JourneyFitImage
            src={images.handpieces}
            alt="InMode QuantumRF handpieces and before/after education"
            aspectClassName="aspect-[16/10]"
          />
        </div>
      </section>

      <section className="bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:gap-12">
          <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-[#FF2D8E]/35 shadow-[0_16px_40px_rgba(255,45,142,0.18)] lg:max-w-[300px]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={images.founder}
                alt="Danielle Alcala-Glazier and a licensed Illinois clinician — Founders, Hello Gorgeous Med Spa"
                fill
                className="object-cover object-[center_22%]"
                sizes="300px"
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
          <p className="mt-4 text-xs text-white/40">*Individual results vary. Results depend on treatment area, patient characteristics, and adherence to aftercare. Consultation required.</p>
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
        </div>
      </section>

      <section id="results" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="Patient Results"
            title="Actual Quantum RF"
            titleAccent="Patient Results"
            description="Patient photographs from a Quantum RF abdominal treatment performed by Dr. Mukesh Arora, MD, at Hello Gorgeous Med Spa in Oswego, Illinois. Individual results vary. Consultation required."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {QUANTUM_RF_FEATURED_RESULTS.map((shot) => (
              <figure
                key={shot.src}
                className="overflow-hidden rounded-3xl border border-white/20 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                <div className="relative aspect-video w-full bg-black">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 560px"
                  />
                </div>
                <figcaption className="border-t border-white/10 bg-gradient-to-r from-[#0a0206] to-[#1a0510] px-5 py-4">
                  <p className="font-bold text-white">{shot.label}</p>
                  <p className="mt-1 text-xs text-white/60">
                    Performed by Dr. Mukesh Arora, MD · Hello Gorgeous Med Spa · Individual results vary
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-12">
            <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#FF2D8E]">
              Full gallery · clinic + InMode clinical
            </p>
            <JourneyResultsCinema
              productName="Quantum RF"
              slides={QUANTUM_RF_RESULTS}
              showAreaFilter
              stageClassName="max-w-5xl"
              frameClassName="h-[min(56vw,560px)] sm:h-[560px]"
            />
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
          <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl border border-[#FF2D8E]/35 shadow-[0_16px_40px_rgba(255,45,142,0.18)] lg:max-w-[400px]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/images/quantum-rf/clinic-results/dr-arora-procedure-grid.jpg"
                alt="Dr. Mukesh Arora performing Quantum RF procedure at Hello Gorgeous Med Spa Oswego"
                fill
                className="object-cover object-top"
                sizes="400px"
              />
            </div>
            <div className="bg-gradient-to-r from-[#0a0206] to-[#1a0510] px-4 py-3">
              <p className="text-sm font-bold text-white">Dr. Mukesh Arora, MD</p>
              <p className="text-xs text-white/60">Medical Director · Performing Quantum RF</p>
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

      {/* Section 4: Why Consider Quantum RF — Benefits Grid */}
      <section className="bg-white px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.3em] text-[#E6007E]">
            Why Consider Quantum RF
          </p>
          <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight text-black lg:text-[42px]">
            Advanced Technology. <span className="text-[#E6007E]">Physician-Performed Care.</span>
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {QUANTUM_RF_BENEFITS.map((benefit) => (
              <article key={benefit.id} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-black">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/70">{benefit.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Meet Your Physician */}
      <section className="bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.45fr_0.55fr] lg:gap-16">
          <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl border border-[#FF2D8E]/35 shadow-[0_16px_40px_rgba(255,45,142,0.18)]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={QUANTUM_RF_PHYSICIAN.image}
                alt="Dr. Mukesh Arora, MD — Treating Physician and Medical Director at Hello Gorgeous Med Spa"
                fill
                className="object-cover object-top"
                sizes="360px"
              />
            </div>
          </div>
          <div>
            <Eyebrow>{QUANTUM_RF_PHYSICIAN.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight text-white lg:text-[44px]">
              {QUANTUM_RF_PHYSICIAN.title}
            </h2>
            <div className="mt-6 flex max-w-xl flex-col gap-4 text-[17px] leading-relaxed text-white/85">
              {QUANTUM_RF_PHYSICIAN.body.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
            <div className="mt-6">
              <PinkBtn href={bookHref}>Book Consultation with Dr. Arora</PinkBtn>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Behind the Treatment — Gallery */}
      <section className="bg-black px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <Eyebrow>{QUANTUM_RF_TREATMENT_GALLERY.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight text-white lg:text-[42px]">
            {QUANTUM_RF_TREATMENT_GALLERY.title}
          </h2>
          <p className="mt-4 max-w-2xl text-white/70">{QUANTUM_RF_TREATMENT_GALLERY.description}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {QUANTUM_RF_TREATMENT_GALLERY.images.map((img) => (
              <figure key={img.src} className="overflow-hidden rounded-2xl border border-white/10">
                <div className="relative aspect-[4/5] w-full">
                  <Image src={img.src} alt={img.alt} fill className="object-cover object-top" sizes="400px" />
                </div>
                <figcaption className="bg-gradient-to-r from-[#0a0206] to-[#1a0510] px-4 py-3">
                  <p className="text-sm font-medium text-white">{img.label}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Who May Be a Candidate? */}
      <section className="bg-white px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.3em] text-[#E6007E]">
            {QUANTUM_RF_CANDIDACY.eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight text-black lg:text-[42px]">
            {QUANTUM_RF_CANDIDACY.title}
          </h2>
          <div className="mt-6 flex flex-col gap-4 text-lg leading-relaxed text-black/80">
            {QUANTUM_RF_CANDIDACY.body.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <div className="mt-8">
            <PinkBtn href={bookHref} className="!bg-[#E6007E] !text-white hover:!bg-black">
              Schedule Your Consultation
            </PinkBtn>
          </div>
        </div>
      </section>

      {/* Section 8: Recovery and Expectations */}
      <section className="bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>{QUANTUM_RF_RECOVERY.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight text-white lg:text-[42px]">
            {QUANTUM_RF_RECOVERY.title}
          </h2>
          <div className="mt-6 flex flex-col gap-4 text-lg leading-relaxed text-white/85">
            {QUANTUM_RF_RECOVERY.body.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <p className="mt-4 text-sm italic text-white/60">{QUANTUM_RF_RECOVERY.disclaimer}</p>
        </div>
      </section>

      {/* InMode Trifecta */}
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
          <p className="mt-4 text-sm text-white/60">
            Learn more at{" "}
            <a
              href={QUANTUM_RF_MARKETING.inmodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#FF2D8E] underline underline-offset-2 hover:text-white"
            >
              InMode&apos;s official QuantumRF page
            </a>
            {" · "}
            <a
              href="/brochures/quantumrf-patient-brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#FF2D8E] underline underline-offset-2 hover:text-white"
            >
              Patient Brochure (PDF)
            </a>
            {" · "}
            <a
              href="/brochures/inmode-celebrities-2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#FF2D8E] underline underline-offset-2 hover:text-white"
            >
              Celebrities Using InMode
            </a>
          </p>
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
            Schedule Your Quantum RF Consultation
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-black/80">
            Free consultation with Dr. Mukesh Arora, MD · Hello Gorgeous Med Spa · Oswego, IL
          </p>
          <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
            <Link
              href={bookHref}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black bg-black px-8 py-3 text-sm font-extrabold text-white transition hover:bg-white hover:text-black"
            >
              Book Your Consultation
            </Link>
            <a
              href={phoneTel}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black/60 px-8 py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white"
            >
              Call {phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* Local SEO — Service Areas */}
      <section className="border-t border-white/10 bg-black px-6 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#FF2D8E]">
            Serving the Western Chicago Suburbs
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Hello Gorgeous Med Spa offers Quantum RF skin tightening and body contouring to patients from{" "}
            {QUANTUM_RF_MARKETING.serviceAreas.map((city, i) => (
              <span key={city}>
                <span className="font-medium text-white">{city}</span>
                {i < QUANTUM_RF_MARKETING.serviceAreas.length - 1 ? ", " : ""}
              </span>
            ))}{" "}
            and surrounding communities. Our clinic is located at 74 W. Washington Street in downtown Oswego, Illinois.
          </p>
          <p className="mt-4 text-xs text-white/50">
            Dr. Mukesh Arora, MD · Treating Physician & Medical Director · Board-certified Internal Medicine
          </p>
        </div>
      </section>
    </div>
  );
}
