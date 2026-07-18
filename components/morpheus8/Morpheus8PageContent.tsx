"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { JourneyFitImage } from "@/components/marketing/JourneyFitImage";
import { JourneyResultsCinema } from "@/components/marketing/JourneyResultsCinema";
import { JourneySoundVideo } from "@/components/marketing/JourneySoundVideo";
import {
  MORPHEUS8_BODY_BENEFITS,
  MORPHEUS8_CONTACT,
  MORPHEUS8_FACE_TREATS,
  MORPHEUS8_FAQS,
  MORPHEUS8_FOUNDER_NOTE,
  MORPHEUS8_INMODE_STORY,
  MORPHEUS8_INTRO_SPECIAL,
  MORPHEUS8_MARKETING,
  MORPHEUS8_NAV,
  MORPHEUS8_PACKAGES,
  MORPHEUS8_RESULTS,
  MORPHEUS8_STEPS,
  MORPHEUS8_TREATMENT_AREAS,
  MORPHEUS8_WHAT_IT_DOES,
} from "@/lib/morpheus8-marketing";
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
  const isExternal = href.startsWith("tel:") || href.startsWith("sms:");
  const cls = `inline-flex items-center justify-center gap-2 rounded-full border border-white/45 px-7 py-3.5 text-base font-bold text-white transition hover:-translate-y-0.5 hover:border-[#FF2D8E] hover:text-[#FF2D8E] ${className}`;
  if (isExternal) {
    return (
      <a href={href} className={cls}>
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

export function Morpheus8PageContent() {
  const [navOpen, setNavOpen] = useState(false);
  const { bookHref, phoneTel, phoneDisplay, textTel, textDisplay } = MORPHEUS8_CONTACT;
  const { images } = MORPHEUS8_MARKETING;

  return (
    <div className="min-h-[100dvh] bg-black font-sans text-white">
      {/* Sticky journey nav — mirrors Brow Journey */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/82 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5 font-bold">
            <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-[13px] font-extrabold text-white">
              HG
            </span>
            <span className="hidden text-base sm:inline">Morpheus8 · InMode</span>
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
          <div className="hidden items-center gap-7 text-[15px] lg:flex">
            {MORPHEUS8_NAV.map((item) => (
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
              {MORPHEUS8_NAV.map((item) => (
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

      {/* Hero */}
      <header className="relative overflow-hidden bg-[radial-gradient(90%_70%_at_78%_25%,#2a0820_0%,#12030c_55%,#000_100%)]">
        <div
          className="pointer-events-none absolute -right-28 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,45,142,0.28),transparent_62%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-24">
          <div>
            <Eyebrow>{MORPHEUS8_MARKETING.eyebrow}</Eyebrow>
            <h1 className="mt-4 font-serif text-[44px] font-bold leading-[1.02] text-white lg:text-[66px]">
              Your Morpheus8 <span className="text-[#FF2D8E]">Journey</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80 lg:text-xl">
              {MORPHEUS8_MARKETING.subhead} {SITE.tagline}
            </p>
            <p className="mt-3 text-sm text-white/55">{MORPHEUS8_MARKETING.trustLine}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <PinkBtn href={bookHref}>Book a Free Consult</PinkBtn>
              <GhostBtn href={textTel}>Text {textDisplay}</GhostBtn>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["InMode verified", "Up to 8mm depth", "Face + body", "From $799"].map((chip) => (
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
            <JourneySoundVideo
              src={MORPHEUS8_MARKETING.heroVideo}
              poster={images.hero}
              label="Morpheus8 Burst RF microneedling at Hello Gorgeous Med Spa — InMode verified provider"
              preload="auto"
            />
          </div>
        </div>
      </header>

      {/* Trust bar */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 bg-[#FF2D8E] px-6 py-4 text-center text-[15px] font-extrabold tracking-wide text-black">
        <span>★★★★★ 5.0 on Fresha · 1,931 reviews</span>
        <span className="hidden sm:inline">·</span>
        <span>Verified InMode Provider</span>
        <span className="hidden sm:inline">·</span>
        <span>Full-authority NP on site</span>
      </div>

      {/* Intro special */}
      <section id="why" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-14 lg:py-20">
        <div className="mx-auto max-w-4xl rounded-[20px] border border-[#FF2D8E]/35 bg-[#0a0206] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-[#FF2D8E] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-black">
                {MORPHEUS8_INTRO_SPECIAL.badge}
              </span>
              <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">{MORPHEUS8_INTRO_SPECIAL.title}</h2>
              <p className="mt-2 max-w-xl text-white/75">{MORPHEUS8_INTRO_SPECIAL.description}</p>
            </div>
            <div className="text-right">
              <p className="font-serif text-4xl font-bold text-[#FF2D8E]">{MORPHEUS8_INTRO_SPECIAL.priceLabel}</p>
              <p className="text-sm text-white/55">{MORPHEUS8_INTRO_SPECIAL.priceNote}</p>
            </div>
          </div>
          <div className="mt-6">
            <PinkBtn href={bookHref}>{MORPHEUS8_INTRO_SPECIAL.ctaLabel}</PinkBtn>
          </div>
        </div>
      </section>

      {/* InMode story — peer to Brow "Meet Your Artist" */}
      <section id="inmode" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
            <JourneySoundVideo
              src={MORPHEUS8_MARKETING.workstationVideo}
              poster={MORPHEUS8_MARKETING.workstationPoster}
              label="Official InMode Morpheus8 workstation animation"
            />
          </div>
          <div>
            <Eyebrow>{MORPHEUS8_INMODE_STORY.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-serif text-[34px] font-bold leading-tight text-white lg:text-[48px]">
              {MORPHEUS8_INMODE_STORY.title}{" "}
              <span className="text-[#FF2D8E]">{MORPHEUS8_INMODE_STORY.titleAccent}</span>
            </h2>
            <div className="mt-5 flex max-w-xl flex-col gap-4 text-[17px] leading-relaxed text-white/85">
              {MORPHEUS8_INMODE_STORY.body.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {MORPHEUS8_INMODE_STORY.chips.map((chip) => (
                <span key={chip} className="rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-semibold">
                  {chip}
                </span>
              ))}
            </div>
            <blockquote className="mt-7 max-w-xl border-l-[3px] border-[#FF2D8E] pl-5 font-serif text-xl italic leading-snug text-white">
              &ldquo;{MORPHEUS8_INMODE_STORY.quote}&rdquo;
            </blockquote>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <PinkBtn href={bookHref}>Book Morpheus8 consult</PinkBtn>
              <GhostBtn href={MORPHEUS8_MARKETING.trifectaHref}>See InMode Trifecta</GhostBtn>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-4xl">
          <JourneyFitImage
            src={images.verified}
            alt="Hello Gorgeous Med Spa — Morpheus8 Burst verified InMode provider"
            aspectClassName="aspect-[21/9] sm:aspect-[2.4/1]"
            objectClassName="object-cover object-center"
            padded={false}
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>
      </section>

      {/* Founders */}
      <section className="bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:gap-12">
          <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-[#FF2D8E]/35 shadow-[0_16px_40px_rgba(255,45,142,0.18)] lg:max-w-[300px]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={images.founder}
                alt="Danielle Alcala-Glazier and Ryan Kent, FNP-BC — Founders, Hello Gorgeous Med Spa"
                fill
                className="object-cover object-[center_22%]"
                sizes="300px"
              />
            </div>
          </div>
          <div>
            <Eyebrow>{MORPHEUS8_FOUNDER_NOTE.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight text-white lg:text-[44px]">
              {MORPHEUS8_FOUNDER_NOTE.title}
            </h2>
            <div className="mt-6 flex max-w-xl flex-col gap-4 text-[17px] leading-relaxed text-white/85">
              {MORPHEUS8_FOUNDER_NOTE.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-baseline gap-3.5">
              <span className="font-serif text-[28px] font-bold text-[#FF2D8E]">{MORPHEUS8_FOUNDER_NOTE.signOff}</span>
              <span className="text-[13px] font-bold uppercase tracking-[0.16em] text-white/60">
                {MORPHEUS8_FOUNDER_NOTE.role}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why stats */}
      <section className="px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead eyebrow="Why Morpheus8 Burst" title="The deepest" titleAccent="RF microneedling" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MORPHEUS8_WHAT_IT_DOES.map((item) => (
              <article key={item.id} className="flex h-full flex-col rounded-[20px] border border-white/14 bg-[#0a0206] p-5">
                <p className="font-serif text-3xl font-bold text-[#FF2D8E]">{item.stat}</p>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-white/45">{item.statLabel}</p>
                <h3 className="mt-3 font-serif text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{item.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 overflow-hidden rounded-3xl border border-[#FF2D8E]/35">
            <JourneySoundVideo
              src={MORPHEUS8_MARKETING.scienceVideo}
              label="Morpheus8 RF microneedling science animation"
            />
          </div>
        </div>
      </section>

      {/* Official InMode treat graphics */}
      <section id="treats" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="What Morpheus8 treats"
            title="Face concerns ·"
            titleAccent="body goals"
            description="Official InMode education — the same platform technology we run in Oswego."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {[...MORPHEUS8_FACE_TREATS, ...MORPHEUS8_BODY_BENEFITS].map((t) => (
              <span key={t} className="rounded-full border border-white/25 px-3 py-1 text-xs font-semibold text-white/85">
                {t}
              </span>
            ))}
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 sm:gap-4">
            <JourneyFitImage
              src={images.faceTreats}
              alt="Morpheus8 treats dull texture, fine lines, acne scars, and collagen loss"
              aspectClassName="aspect-square"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <JourneyFitImage
              src={images.bodyBenefits}
              alt="Morpheus8 Body — improve skin, remodel fat, treat irregularities, build collagen"
              aspectClassName="aspect-square"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="Real results"
            title="Before & after —"
            titleAccent="cinematic gallery"
            description="HD slideshow of Hello Gorgeous clinic cases and curated InMode clinical photography. Individual results vary."
          />
          <div className="mt-10">
            <JourneyResultsCinema productName="Morpheus8" slides={MORPHEUS8_RESULTS} showAreaFilter />
          </div>
        </div>
      </section>

      {/* Areas */}
      <section id="areas" className="scroll-mt-24 px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead eyebrow="Treatment areas" title="Face + body —" titleAccent="one InMode platform" />
          <div className="mt-8 flex flex-wrap gap-3">
            {MORPHEUS8_TREATMENT_AREAS.map((area) => (
              <span key={area} className="rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-semibold">
                {area}
              </span>
            ))}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Link
              href={MORPHEUS8_MARKETING.burstHref}
              className="rounded-[20px] border border-[#FF2D8E]/40 bg-[#0a0206] p-6 transition hover:border-[#FF2D8E]"
            >
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#FF2D8E]">Face & neck</p>
              <h3 className="mt-2 font-serif text-2xl font-bold">Morpheus8 Burst</h3>
              <p className="mt-2 text-sm text-white/70">Laxity, jowls, texture & scars — from $799</p>
              <span className="mt-4 inline-block text-sm font-bold text-[#FF2D8E]">Explore Burst →</span>
            </Link>
            <Link
              href={MORPHEUS8_MARKETING.bodyHref}
              className="rounded-[20px] border border-white/14 bg-[#0a0206] p-6 transition hover:border-[#FF2D8E]"
            >
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#FF2D8E]">Body</p>
              <h3 className="mt-2 font-serif text-2xl font-bold">Morpheus8 Body</h3>
              <p className="mt-2 text-sm text-white/70">Abdomen, arms, thighs & stretch marks</p>
              <span className="mt-4 inline-block text-sm font-bold text-[#FF2D8E]">Explore Body →</span>
            </Link>
          </div>
          <div className="mt-10 overflow-hidden rounded-3xl border border-[#FF2D8E]/35">
            <JourneySoundVideo
              src={MORPHEUS8_MARKETING.body3dVideo}
              poster={MORPHEUS8_MARKETING.body3dPoster}
              label="Official InMode Morpheus8 Body 3D animation"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead eyebrow="How it works" title="Consult to" titleAccent="collagen rebuild" />
            <ol className="mt-8 space-y-4">
              {MORPHEUS8_STEPS.map((step) => (
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
              href={MORPHEUS8_MARKETING.careHref}
              className="mt-6 inline-flex text-sm font-bold text-[#FF2D8E] underline underline-offset-4"
            >
              Pre & post care guide →
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
            <JourneySoundVideo
              src={MORPHEUS8_MARKETING.introVideo}
              poster={images.verified}
              label="Morpheus8 Burst clinical treatment highlight — Hello Gorgeous Med Spa"
              objectClassName="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-24 px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead eyebrow="Pricing" title="Honest packages ·" titleAccent="free consult first" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MORPHEUS8_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className={`flex h-full flex-col rounded-[20px] border bg-[#0a0206] p-5 ${
                  pkg.highlight ? "border-[#FF2D8E]/60 ring-1 ring-[#FF2D8E]/30" : "border-white/14"
                }`}
              >
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

      {/* Trifecta */}
      <section className="bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl rounded-[20px] border border-[#FF2D8E]/35 bg-[#0a0206] p-8 text-center">
          <Eyebrow>InMode Trifecta</Eyebrow>
          <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">
            Surface + depth + contour = complete transformation
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Morpheus8 remodels beneath the skin. Solaria resurfaces. Quantum contours. Together — VIP Trifecta.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <GhostBtn href={MORPHEUS8_MARKETING.compareSolariaHref}>Explore Solaria CO₂</GhostBtn>
            <GhostBtn href={MORPHEUS8_MARKETING.quantumHref}>Explore Quantum RF</GhostBtn>
            <PinkBtn href={MORPHEUS8_MARKETING.trifectaHref}>VIP Trifecta packages</PinkBtn>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[900px]">
          <SectionHead eyebrow="FAQ" title="Morpheus8" titleAccent="questions" />
          <div className="mt-10 space-y-3">
            {MORPHEUS8_FAQS.map((faq, idx) => (
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

      {/* Closing CTA */}
      <section className="bg-[#FF2D8E] px-6 py-16 text-black lg:py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="font-serif text-[34px] font-bold leading-tight lg:text-[46px]">
            Ready for tighter, smoother skin?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-black/80">
            Free consult · InMode certified · Oswego IL
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
