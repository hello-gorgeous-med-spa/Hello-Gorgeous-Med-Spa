"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { ClubFlyerGallery } from "@/components/club/ClubFlyerGallery";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  CLUB_VITAMIN_FLYERS,
  GENTLEMENS_CLUB_GLP1_FLYERS,
  clubPeptideFlyers,
} from "@/lib/club-flyer-images";
import { RYAN_FULL_NAME } from "@/lib/founder-credentials";
import {
  appForHimUrl,
  FOR_HIM_SERVICES,
  GENTLEMENS_CLUB_FAQS,
  GENTLEMENS_CLUB_GIFT_BROTOX_IMAGE,
  GENTLEMENS_CLUB_GLP1_STACK,
  GENTLEMENS_CLUB_HERO_IMAGE,
  GENTLEMENS_CLUB_HERO_IMAGES,
  GENTLEMENS_CLUB_HERO_RX_IMAGE,
  GENTLEMENS_CLUB_HORMONE_ADD_ONS,
  GENTLEMENS_CLUB_HORMONE_ADD_ONS_DISCLAIMER,
  GENTLEMENS_CLUB_ANTEAGE_HAIR_IMAGE,
  GENTLEMENS_CLUB_ANTEAGE_HAIR_RESULTS,
  GENTLEMENS_CLUB_ANTEAGE_HAIR_RESULTS_DISCLAIMER,
  GENTLEMENS_CLUB_HAIR_DISCLAIMER,
  GENTLEMENS_CLUB_HAIR_OPTIONS,
  GENTLEMENS_CLUB_HAIR_TRT_CALLOUT,
  GENTLEMENS_CLUB_JUMP_LINKS,
  GENTLEMENS_CLUB_LOW_T_SYMPTOMS,
  GENTLEMENS_CLUB_PILLARS,
  GENTLEMENS_CLUB_PILLS,
  GENTLEMENS_CLUB_PT141_FLYER,
  GENTLEMENS_CLUB_SCREENERS,
  GENTLEMENS_CLUB_SERVICES,
  GENTLEMENS_CLUB_TIERS,
  GENTLEMENS_CLUB_TRT_APPROACH_1,
  GENTLEMENS_CLUB_TRT_APPROACH_2,
  GENTLEMENS_CLUB_TRT_INCLUDED,
  GENTLEMENS_CLUB_TRT_QUICK_FACTS,
} from "@/lib/gentlemens-club";
import { LADIES_CLUB_PATH } from "@/lib/ladies-club";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { SITE } from "@/lib/seo";

function MenuCard({
  title,
  accentLine,
  description,
  badge,
  image,
  imageAlt,
}: {
  title: string;
  accentLine: string;
  description: string;
  badge?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#151922] transition-all duration-300 hover:border-[#FF2D8E]/50 hover:shadow-[0_0_24px_rgba(255,45,142,0.12)]">
      {image ? (
        <div className="relative aspect-[16/10] w-full border-b border-white/10 bg-black">
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, 25vw"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="font-serif text-2xl text-white tracking-tight">{title}</h3>
          {badge ? (
            <span className="rounded-full border border-[#FF2D8E]/40 bg-[#FF2D8E]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#FFB8DC]">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="text-sm font-medium leading-relaxed text-[#7dd3fc]">{accentLine}</p>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-400">{description}</p>
      </div>
    </article>
  );
}

function TierCard({ tier }: { tier: (typeof GENTLEMENS_CLUB_TIERS)[number] }) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border p-6 md:p-8 transition-all duration-300 ${
        tier.highlight
          ? "border-[#FF2D8E]/40 bg-[#151922] shadow-[0_0_32px_rgba(255,45,142,0.08)]"
          : "border-white/10 bg-[#151922] hover:border-[#7dd3fc]/40"
      }`}
    >
      {tier.highlight ? (
        <span className="absolute -top-3 left-6 rounded-full bg-[#FF2D8E] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          Most popular
        </span>
      ) : null}
      <h3 className="mt-1 font-serif text-2xl text-white tracking-tight">{tier.name}</h3>
      <p className={`mt-3 text-4xl font-black tabular-nums ${tier.highlight ? "text-white" : "text-[#7dd3fc]"}`}>
        ${tier.pricePerMonth}
        <span className="text-lg font-semibold text-gray-500">/mo</span>
      </p>
      <p className="mt-3 text-sm font-medium leading-relaxed text-[#7dd3fc]">
        {tier.perks.slice(0, 3).join(" • ")}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-gray-400">{tier.summary}</p>
      <ul className="mt-5 flex-1 space-y-2">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex gap-2 text-sm text-gray-300">
            <span className={tier.highlight ? "text-[#FF2D8E]" : "text-[#7dd3fc]"} aria-hidden>
              {tier.highlight ? "♥" : "★"}
            </span>
            {perk}
          </li>
        ))}
      </ul>
      {tier.footnote ? <p className="mt-4 text-xs text-gray-500">{tier.footnote}</p> : null}
      <a
        href={tier.squarePayUrl ?? BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-6 block rounded-xl px-6 py-3 text-center text-sm font-bold transition-all ${
          tier.highlight
            ? "bg-[#FF2D8E] text-white hover:bg-[#e0267d]"
            : "border-2 border-[#7dd3fc]/50 text-[#7dd3fc] hover:bg-[#7dd3fc]/10"
        }`}
      >
        Join {tier.name}
      </a>
    </article>
  );
}

function HeroFlyer({ src, alt, index }: { src: string; alt: string; index: number }) {
  return (
    <div
      className="group overflow-hidden rounded-2xl border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(255,45,142,0.35)] transition-all duration-500 hover:scale-[1.01] animate-gentlemens-hero-pop"
      style={{ animationDelay: `${index * 0.15}s`, ["--hero-breathe-delay" as string]: `${index * 1.8}s` }}
    >
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.02] animate-gentlemens-hero-breathe"
          sizes="(max-width: 640px) 100vw, 50vw"
          priority={index === 0}
        />
      </div>
    </div>
  );
}

function ServiceDetailCard({
  icon,
  eyebrow,
  title,
  description,
  bullets,
  href,
  cta,
  external,
  badge,
  anchor,
  image,
  imageAlt,
  imageContain,
}: (typeof GENTLEMENS_CLUB_SERVICES)[number]) {
  const linkClass = "mt-5 text-sm font-bold text-[#FF2D8E] hover:underline";
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#151922] transition-all duration-300 hover:border-[#FF2D8E]/40 hover:shadow-[0_0_24px_rgba(255,45,142,0.1)]">
      <div className={`relative aspect-[16/10] w-full border-b border-white/10 ${imageContain ? "bg-black" : "bg-[#0a0a0a]"}`}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          className={`${imageContain ? "object-contain p-3" : "object-cover object-center"} transition-transform duration-500 group-hover:scale-[1.02]`}
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        {badge ? (
          <span className="absolute right-3 top-3 rounded-full border border-[#FF2D8E]/40 bg-[#FF2D8E]/90 px-2 py-0.5 text-[9px] font-bold uppercase text-white backdrop-blur-sm">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start gap-2">
          <span className="text-2xl" aria-hidden>{icon}</span>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF2D8E]">{eyebrow}</p>
        </div>
        <h3 className="mt-2 text-xl font-black text-white">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">{description}</p>
        <ul className="mt-4 flex-1 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm text-gray-300">
              <span className="shrink-0 text-[#FF2D8E]">▸</span>
              {b}
            </li>
          ))}
        </ul>
        {anchor ? (
          <a href={href} className={linkClass}>{cta}</a>
        ) : external ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>{cta}</a>
        ) : (
          <Link href={href} className={linkClass}>{cta}</Link>
        )}
      </div>
    </article>
  );
}

function AddOnCard({
  name,
  tagline,
  description,
  benefits,
  priceMonthlyUsd,
  learnMoreHref,
  image,
  imageAlt,
}: (typeof GENTLEMENS_CLUB_HORMONE_ADD_ONS)[number]) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border-4 border-black bg-[#151922] shadow-[6px_6px_0_0_rgba(255,45,142,0.25)] transition hover:border-[#FF2D8E]/40">
      <div className="relative aspect-[16/10] w-full border-b-4 border-black bg-black">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="text-xl font-black uppercase tracking-tight text-white">{name}</h3>
        <p className="mt-2 text-sm font-medium text-[#7dd3fc]">{tagline}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">{description}</p>
        <ul className="mt-4 space-y-2">
          {benefits.map((b) => (
            <li key={b} className="flex gap-2 text-xs font-semibold text-white/80">
              <span className="text-[#FF2D8E]">✓</span>
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-2xl font-black text-white">
          ${priceMonthlyUsd}
          <span className="text-base font-semibold text-gray-500">/month</span>
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <CTA href={BOOKING_URL} variant="gradient" className="!px-5 !py-2.5 !text-xs">
            Book consult
          </CTA>
          {learnMoreHref ? (
            <Link
              href={learnMoreHref}
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-2.5 text-xs font-semibold text-[#FFB8DC] hover:border-[#FF2D8E]/50 hover:bg-white/5"
            >
              Learn more →
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function HairOptionCard({
  name,
  description,
  priceLabel,
  priceSub,
  learnMoreHref,
  badge,
}: (typeof GENTLEMENS_CLUB_HAIR_OPTIONS)[number]) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#151922] p-6 md:p-8">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-black uppercase tracking-tight text-white">{name}</h3>
        {badge ? (
          <span className="shrink-0 rounded-full border border-[#FF2D8E]/40 bg-[#FF2D8E]/15 px-2 py-0.5 text-[9px] font-bold uppercase text-[#FFB8DC]">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-400">{description}</p>
      <p className="mt-6 text-2xl font-black text-white">{priceLabel}</p>
      {priceSub ? <p className="mt-1 text-sm text-gray-500">{priceSub}</p> : null}
      {learnMoreHref ? (
        <Link href={learnMoreHref} className="mt-4 text-sm font-semibold text-[#FFB8DC] hover:underline">
          Learn more →
        </Link>
      ) : null}
    </article>
  );
}

export function GentlemensClubPageContent() {
  const appUrl = appForHimUrl();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 50% -5%, rgba(59,130,246,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 100% 40%, rgba(255,45,142,0.12) 0%, transparent 50%),
            #0a0a0a
          `,
        }}
      />

      <style jsx global>{`
        @keyframes gentlemens-hero-pop {
          0% { opacity: 0; transform: translateY(16px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes gentlemens-hero-breathe {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.88; filter: brightness(1.08); }
        }
        .animate-gentlemens-hero-pop {
          animation: gentlemens-hero-pop 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .animate-gentlemens-hero-breathe {
          animation: gentlemens-hero-breathe 4.5s ease-in-out infinite;
          animation-delay: var(--hero-breathe-delay, 0s);
        }
      `}</style>

      {/* Hero */}
      <Section className="relative border-b-4 border-black py-10 md:py-14 !px-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h1 className="sr-only">
              The Gentlemen&apos;s Club — Men&apos;s Wellness, TRT, Brotox &amp; Peptides | Hello Gorgeous Oswego IL
            </h1>
            <div className="mx-auto max-w-4xl">
              <HeroFlyer
                src={GENTLEMENS_CLUB_HERO_IMAGE}
                alt={GENTLEMENS_CLUB_HERO_IMAGES[0].alt}
                index={0}
              />
            </div>
            <div className="mt-8 text-center md:text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFB8DC]">
                👑 Men&apos;s Health &amp; Wellness · Oswego, IL
              </p>
              <p className="mt-3 text-2xl font-black text-white md:text-3xl">The Gentlemen&apos;s Club</p>
              <p className="mt-2 max-w-2xl text-white/70">
                Brotox · TRT · peptides · GLP-1 — one private, NP-led home for everything men&apos;s wellness at Hello Gorgeous.
              </p>
              <p className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                {GENTLEMENS_CLUB_PILLS.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/70"
                  >
                    {pill}
                  </span>
                ))}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3 justify-center md:justify-start">
                <CTA href={BOOKING_URL} variant="gradient" className="!px-8 !py-4">
                  Book Your Consult
                </CTA>
                <CTA href="#pricing" variant="outline" className="!border-[#FF2D8E] !text-[#FFB8DC] hover:!bg-[#FF2D8E] hover:!text-white !px-8 !py-4">
                  View Membership
                </CTA>
                <CTA href="/quiz/trt-readiness" variant="outline" className="!border-[#7dd3fc]/50 !text-[#7dd3fc] hover:!bg-[#7dd3fc]/10 !px-8 !py-4">
                  TRT Screener
                </CTA>
                <CTA href={LADIES_CLUB_PATH} variant="outline" className="!border-white/30 !text-white hover:!bg-white hover:!text-black !px-8 !py-4">
                  Ladies&apos; Club →
                </CTA>
              </div>
              <p className="mt-4 text-sm text-white/50">Medically reviewed by {RYAN_FULL_NAME}</p>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Jump nav */}
      <nav aria-label="On this page" className="sticky top-[var(--header-offset,0px)] z-20 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3">
          {GENTLEMENS_CLUB_JUMP_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-[#FF2D8E] hover:text-[#FFB8DC]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Full services grid */}
      <Section id="services" className="scroll-mt-24 bg-[#0a0a0a] !py-12 md:!py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">Men&apos;s services</p>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl text-white">Built for how men show up</h2>
          </FadeUp>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GENTLEMENS_CLUB_SERVICES.map((svc, i) => (
              <FadeUp key={svc.id} delayMs={40 * (i % 3)}>
                <ServiceDetailCard {...svc} />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Why us */}
      <Section className="border-t border-white/10 bg-[#030712] !py-12 md:!py-16">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <FadeUp>
            <h2 className="font-serif text-2xl md:text-3xl text-white">Why men choose Hello Gorgeous</h2>
          </FadeUp>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {GENTLEMENS_CLUB_PILLARS.map((pillar, i) => (
              <FadeUp key={pillar.title} delayMs={i * 40}>
                <MenuCard title={pillar.title} accentLine="Our promise" description={pillar.description} />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Hormones / TRT */}
      <Section id="hormones" className="scroll-mt-24 border-t border-white/10 bg-[#0a0a0a] !py-14 md:!py-20">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">Medical Services</p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl text-white">Men&apos;s Hormone Optimization</h2>
            <p className="mt-4 max-w-3xl text-gray-400">
              Testosterone optimization done right — comprehensive testing, personalized protocols, and ongoing monitoring.
            </p>
          </FadeUp>

          <FadeUp delayMs={40}>
            <h3 className="mt-12 text-xl font-black uppercase tracking-tight text-white">Signs of low testosterone</h3>
            <p className="mt-3 text-gray-400">Often blamed on aging or stress — but addressable with the right labs and protocol.</p>
          </FadeUp>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GENTLEMENS_CLUB_LOW_T_SYMPTOMS.map((symptom, i) => (
              <FadeUp key={symptom.title} delayMs={i * 25}>
                <div className="h-full rounded-2xl border border-white/10 bg-[#151922] p-5">
                  <span className="text-2xl" aria-hidden>{symptom.icon}</span>
                  <h4 className="mt-3 font-bold text-white">{symptom.title}</h4>
                  <p className="mt-2 text-sm text-gray-400">{symptom.description}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delayMs={200}>
            <div className="mt-8 rounded-2xl border border-[#FF2D8E]/30 bg-[#FF2D8E]/10 p-6 text-center">
              <p className="font-semibold text-white">Not sure if your symptoms are hormone-related?</p>
              <Link href="/quiz/trt-readiness" className="mt-2 inline-block font-bold text-[#FFB8DC] hover:underline">
                Take the 2-minute TRT Readiness Screener →
              </Link>
            </div>
          </FadeUp>

          <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
            <FadeUp>
              <h3 className="text-2xl font-black text-white">Our approach</h3>
              <p className="mt-4 text-gray-400 leading-relaxed">{GENTLEMENS_CLUB_TRT_APPROACH_1}</p>
              <p className="mt-4 text-gray-400 leading-relaxed">{GENTLEMENS_CLUB_TRT_APPROACH_2}</p>
              <Link href="/testosterone-replacement-oswego" className="mt-6 inline-block font-semibold text-[#FF2D8E] hover:underline">
                Full TRT pricing &amp; delivery comparison →
              </Link>
            </FadeUp>
            <FadeUp delayMs={60}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                <Image src={GENTLEMENS_CLUB_HERO_RX_IMAGE} alt="TRT at Hello Gorgeous Oswego" fill className="object-cover" sizes="480px" />
              </div>
            </FadeUp>
          </div>

          <FadeUp delayMs={80}>
            <h3 className="mt-16 text-center text-xl font-black uppercase tracking-tight text-white">TRT program quick facts</h3>
          </FadeUp>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GENTLEMENS_CLUB_TRT_QUICK_FACTS.map((fact, i) => (
              <FadeUp key={fact.label} delayMs={i * 30}>
                <div className="rounded-2xl border border-white/10 bg-[#151922] p-6 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{fact.label}</p>
                  <p className="mt-2 text-3xl font-black text-[#FF2D8E]">{fact.value}</p>
                  <p className="mt-2 text-sm text-gray-400">{fact.note}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delayMs={100}>
            <h3 className="mt-16 text-2xl font-black text-white">What&apos;s included</h3>
          </FadeUp>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[GENTLEMENS_CLUB_TRT_INCLUDED.oversight, GENTLEMENS_CLUB_TRT_INCLUDED.program].map((col, i) => (
              <FadeUp key={col.title} delayMs={i * 40}>
                <div className="rounded-2xl border border-white/10 bg-[#151922] p-6 md:p-8">
                  <h4 className="text-lg font-bold text-white">{col.title}</h4>
                  <ul className="mt-5 space-y-3">
                    {col.bullets.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-gray-300">
                        <span className="text-[#FF2D8E]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delayMs={120}>
            <p className="mt-8 max-w-3xl text-sm text-gray-500">
              Many patients add{" "}
              <Link href="/peptides" className="text-[#FF2D8E] hover:underline">peptide therapy</Link>{" "}
              — Sermorelin, PT-141, or BPC-157 — as add-ons to any hormone protocol.
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* Add-on medications */}
      <Section id="add-ons" className="scroll-mt-24 border-t border-white/10 bg-[#1a1d24] !py-14 md:!py-20">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <FadeUp>
            <h2 className="text-center text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              Add-on medications
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-gray-400">
              Additional medications that can support hormone therapy protocols.
            </p>
          </FadeUp>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {GENTLEMENS_CLUB_HORMONE_ADD_ONS.map((addOn, i) => (
              <FadeUp key={addOn.id} delayMs={i * 40}>
                <AddOnCard {...addOn} />
              </FadeUp>
            ))}
          </div>
          <FadeUp delayMs={160}>
            <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-gray-500">
              {GENTLEMENS_CLUB_HORMONE_ADD_ONS_DISCLAIMER}
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* Men's hair restoration */}
      <Section id="hair" className="scroll-mt-24 border-t border-white/10 bg-[#0a0a0a] !py-14 md:!py-20">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">Hair loss</p>
            <h2 className="mt-2 text-center text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              Men&apos;s hair restoration
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-gray-400">
              AnteAGE MDX biosomes &amp; exosomes, Rx DHT blockers, peptide topicals, and in-office PRF — NP-guided
              protocols, not mail-order guesswork.
            </p>
          </FadeUp>

          <FadeUp delayMs={40}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-[#FF2D8E]/30 bg-[#151922]">
              <div className="grid lg:grid-cols-2 lg:items-center">
                <div className="relative aspect-[4/3] min-h-[220px] bg-black lg:aspect-auto lg:min-h-[280px]">
                  <Image
                    src={GENTLEMENS_CLUB_ANTEAGE_HAIR_IMAGE}
                    alt="AnteAGE MDX hair biosomes and exosomes — regenerative scalp protocol at Hello Gorgeous Med Spa Oswego"
                    fill
                    className="object-contain object-center p-6"
                    sizes="(max-width: 1024px) 100vw, 480px"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <span className="rounded-full border border-[#FF2D8E]/40 bg-[#FF2D8E]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#FFB8DC]">
                    AnteAGE partner clinic
                  </span>
                  <h3 className="mt-4 text-2xl font-black text-white">MDX Hair Biosomes &amp; Exosomes</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    Professional scalp micro-injections with AnteAGE MDX® — biosomes for advanced follicle signaling,
                    or 10 billion exosomes reconstituted with HA diluent when your provider recommends maximum
                    regenerative support. WNT pathway activation, caffeine + azelaic acid for DHT-aware plans.
                    Aftercare kit included.
                  </p>
                  <p className="mt-4 text-2xl font-black text-[#FF2D8E]">
                    From $499<span className="text-base font-semibold text-gray-500">/session</span>
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <CTA href="/services/hair-restoration-exosomes" variant="gradient" className="text-sm">
                      AnteAGE hair menu →
                    </CTA>
                    <CTA href="/quiz/hair-readiness" variant="outline" className="!border-white/30 !text-white text-sm">
                      Hair screener (2 min)
                    </CTA>
                    <CTA href={BOOKING_URL} variant="outline" className="!border-white/30 !text-white text-sm">
                      Book consult
                    </CTA>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp delayMs={80}>
            <div className="mt-12">
              <h3 className="text-center text-xl font-black uppercase tracking-tight text-white md:text-2xl">
                AnteAGE MDX® results
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-500">
                Partner before/after photography — density builds over weeks to months, not days.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {GENTLEMENS_CLUB_ANTEAGE_HAIR_RESULTS.map((result) => (
                  <figure
                    key={result.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-[#151922]"
                  >
                    <div className="relative aspect-square w-full bg-[#e8e8e8]">
                      <Image
                        src={result.src}
                        alt={result.alt}
                        fill
                        className="object-contain object-center p-2"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <figcaption className="border-t border-white/10 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#FFB8DC]">
                      {result.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-gray-500">
                {GENTLEMENS_CLUB_ANTEAGE_HAIR_RESULTS_DISCLAIMER}
              </p>
            </div>
          </FadeUp>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GENTLEMENS_CLUB_HAIR_OPTIONS.map((option, i) => (
              <FadeUp key={option.id} delayMs={i * 35}>
                <HairOptionCard {...option} />
              </FadeUp>
            ))}
          </div>
          <FadeUp delayMs={200}>
            <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[#7dd3fc]/20 bg-[#151922] p-6 text-center">
              <p className="text-sm leading-relaxed text-[#7dd3fc]">{GENTLEMENS_CLUB_HAIR_TRT_CALLOUT}</p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
                <CTA href={BOOKING_URL} variant="gradient" className="text-sm">
                  Book hair + hormone consult
                </CTA>
                <CTA href="/regenerative-medicine-oswego-il" variant="outline" className="!border-white/30 !text-white text-sm">
                  Regenerative hub →
                </CTA>
                <CTA href="/products-we-offer" variant="outline" className="!border-white/30 !text-white text-sm">
                  Rx catalog →
                </CTA>
              </div>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-gray-500">
              {GENTLEMENS_CLUB_HAIR_DISCLAIMER}
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* PT-141 / peptides */}
      <Section id="peptides" className="scroll-mt-24 border-t border-white/10 bg-[#1a1d24] !py-14 md:!py-20">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">Hello Gorgeous RX™</p>
            <h2 className="mt-2 text-center text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              {GENTLEMENS_CLUB_PT141_FLYER.name} — {GENTLEMENS_CLUB_PT141_FLYER.tagline}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-gray-400">
              {GENTLEMENS_CLUB_PT141_FLYER.description}
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
            <FadeUp delayMs={40}>
              <div className="overflow-hidden rounded-2xl border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(255,45,142,0.35)]">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={GENTLEMENS_CLUB_PT141_FLYER.image}
                    alt={GENTLEMENS_CLUB_PT141_FLYER.imageAlt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 560px"
                  />
                </div>
              </div>
            </FadeUp>
            <FadeUp delayMs={80}>
              <ul className="space-y-3">
                {GENTLEMENS_CLUB_PT141_FLYER.bullets.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-semibold text-white/90">
                    <span className="text-[#FF2D8E]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-2xl font-black text-white">
                From ${GENTLEMENS_CLUB_PT141_FLYER.fromMonthlyUsd}
                <span className="text-base font-semibold text-gray-500">/mo</span>
              </p>
              <p className="mt-2 text-sm text-gray-500">
                ${PEPTIDE_CONSULT_FEE_USD} NP consult · medication billed separately
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CTA href={BOOKING_URL} variant="gradient">Book consult</CTA>
                <CTA href={GENTLEMENS_CLUB_PT141_FLYER.learnMoreHref} variant="outline" className="!border-white/30 !text-white">
                  PT-141 guide →
                </CTA>
                <CTA href="/peptides" variant="outline" className="!border-white/30 !text-white">
                  Full peptide menu →
                </CTA>
              </div>
            </FadeUp>
          </div>

          <FadeUp delayMs={120}>
            <h3 className="mt-16 text-center text-xl font-black uppercase tracking-tight text-white md:text-2xl">
              Peptide protocols for men
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-500">
              BPC-157, TB-500, sermorelin, tesamorelin, NAD+, CJC/Ipamorelin &amp; more — NP-prescribed only.
            </p>
          </FadeUp>
          <ClubFlyerGallery flyers={clubPeptideFlyers("gentlemens")} columns={3} />
        </div>
      </Section>

      {/* Vitamin Bar */}
      <Section id="vitamin-bar" className="scroll-mt-24 border-t border-white/10 bg-[#0a0a0a] !py-14 md:!py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">The Vitamin Bar</p>
            <h2 className="mt-2 text-3xl font-black text-white">Wellness shots &amp; NAD+</h2>
            <p className="mt-4 max-w-2xl text-gray-400">
              B12, lipo shots, glutathione, tri-immune &amp; NAD+ — included in Gentlemen&apos;s Club membership or à la carte.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <CTA href="/iv-shots" variant="gradient">IV &amp; shots menu</CTA>
              <CTA href="/vitamin-bar" variant="outline" className="!border-white/30 !text-white">Vitamin Bar app</CTA>
            </div>
          </FadeUp>
          <ClubFlyerGallery flyers={CLUB_VITAMIN_FLYERS} columns={3} />
        </div>
      </Section>

      {/* TRT pricing + GLP-1 stack */}
      <Section className="border-t border-white/10 bg-[#0a0a0a] !py-12 md:!py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">TRT programs</p>
            <p className="mt-3 text-4xl font-black text-white">
              Starting at <span className="text-[#FF2D8E]">$200/mo</span>
            </p>
            <p className="mt-3 text-gray-400">
              Injections · BioTE pellets $750–1,200 · creams from $150/mo · member pricing from ${GENTLEMENS_CLUB_TIERS[0]?.pricePerMonth}/mo
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <CTA href={BOOKING_URL} variant="gradient">Book free consult</CTA>
              <CTA href="#pricing" variant="outline" className="!border-white/30 !text-white">View membership</CTA>
            </div>
          </FadeUp>
        </div>
        <div className="max-w-7xl mx-auto mt-12 px-4">
          <FadeUp delayMs={60}>
            <p className="text-xs font-bold uppercase tracking-wider text-[#FF2D8E] mb-6 text-center">GLP-1 weight loss</p>
            <ClubFlyerGallery flyers={GENTLEMENS_CLUB_GLP1_FLYERS} />
            <div className="mt-8 rounded-2xl border border-white/10 bg-[#151922] p-8 text-center md:p-10">
              <p className="text-xs font-bold uppercase tracking-wider text-[#FF2D8E]">Combine &amp; optimize</p>
              <h3 className="mt-3 text-2xl font-black text-white">On a GLP-1 too? We map the full picture.</h3>
              <p className="mt-4 text-gray-400">
                Stack TRT with NP-supervised GLP-1 — semaglutide from ${GENTLEMENS_CLUB_GLP1_STACK.semaglutideFrom}/mo,
                tirzepatide from ${GENTLEMENS_CLUB_GLP1_STACK.tirzepatideFrom}/mo — one team coordinating both.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <CTA href="/glp-1-weight-loss-oswego" variant="gradient">See GLP-1 program</CTA>
                <CTA href={BOOKING_URL} variant="outline" className="!border-white/30 !text-white">Book combined consult</CTA>
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Screeners */}
      <Section id="screeners" className="scroll-mt-24 border-t border-white/10 bg-[#030712] !py-12 md:!py-16">
        <div className="max-w-4xl mx-auto px-4 w-full">
          <FadeUp>
            <h2 className="font-serif text-2xl text-white">Not sure where to start?</h2>
            <p className="mt-2 text-gray-400">2-minute educational screeners — not a diagnosis.</p>
          </FadeUp>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {GENTLEMENS_CLUB_SCREENERS.map((screener, i) => (
              <FadeUp key={screener.id} delayMs={i * 40}>
                <Link
                  href={screener.href}
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#151922] p-6 transition hover:border-[#FF2D8E]/40"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white group-hover:text-[#FFB8DC]">{screener.title}</h3>
                      {screener.badge ? (
                        <span className="rounded-full bg-[#FF2D8E] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                          {screener.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-gray-400">{screener.sub}</p>
                  </div>
                  <span className="text-xl text-[#FF2D8E]">→</span>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Membership tiers */}
      <Section id="pricing" className="scroll-mt-24 border-y-4 border-black bg-[#0a0a0a] !py-14 md:!py-20">
        <div className="max-w-5xl mx-auto px-4 w-full">
          <FadeUp>
            <div className="mb-10 text-center">
              <h2 className="font-serif text-3xl md:text-4xl text-white">Choose Your Tier</h2>
              <p className="mt-2 text-gray-400">No contracts. Cancel anytime.</p>
            </div>
          </FadeUp>
          <div className="grid gap-6 md:grid-cols-2">
            {GENTLEMENS_CLUB_TIERS.map((tier, i) => (
              <FadeUp key={tier.id} delayMs={60 * i}>
                <TierCard tier={tier} />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Quick service cards (legacy 4-col) */}
      <Section className="bg-[#0a0a0a] !py-12 md:!py-16">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FOR_HIM_SERVICES.map((svc, i) => (
              <FadeUp key={svc.id} delayMs={40 * (i % 4)}>
                <Link
                  href={svc.href}
                  target={"external" in svc && svc.external ? "_blank" : undefined}
                  className="block h-full"
                >
                  <MenuCard
                    title={svc.label}
                    badge={svc.badge}
                    accentLine={svc.cta}
                    description={svc.blurb}
                    image={svc.image}
                    imageAlt={svc.imageAlt}
                  />
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Gift Brotox — year-round */}
      <Section id="gift-brotox" className="scroll-mt-24 border-t border-white/10 bg-[#030712] !py-12 md:!py-16">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <FadeUp>
              <div className="overflow-hidden rounded-2xl border-4 border-black bg-black shadow-[6px_6px_0_0_rgba(255,45,142,0.3)]">
                <div className="relative aspect-[16/9] w-full">
                  <Image src={GENTLEMENS_CLUB_GIFT_BROTOX_IMAGE} alt="Gift Brotox eGift card — Hello Gorgeous Med Spa Oswego IL" fill className="object-contain" sizes="50vw" />
                </div>
              </div>
            </FadeUp>
            <FadeUp delayMs={80}>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">Gift Brotox</p>
              <h2 className="mt-2 font-serif text-2xl md:text-3xl text-white">
                Skip the tie. <span className="text-gray-500">Gift the confidence.</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                Birthdays, anniversaries, holidays, or just because — digital eGift cards deliver instantly
                through Square. Redeem for Brotox, TRT consults, or any Gentlemen&apos;s Club service.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <CTA href={FOR_HIM_SERVICES[3].href} variant="gradient">Buy eGift Card</CTA>
                <CTA href={BOOKING_URL} variant="outline" className="!border-white/30 !text-white hover:!bg-white hover:!text-black">
                  Book Brotox
                </CTA>
              </div>
            </FadeUp>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="scroll-mt-24 bg-[#0a0a0a] !py-14 md:!py-20">
        <div className="max-w-3xl mx-auto px-4 w-full">
          <FadeUp>
            <h2 className="font-serif text-2xl md:text-3xl text-white mb-8 text-center">Questions</h2>
            <div className="space-y-4">
              {GENTLEMENS_CLUB_FAQS.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-white/10 bg-[#151922] open:border-[#FF2D8E]/40">
                  <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-white hover:text-[#FFB8DC] flex items-center justify-between gap-3">
                    {faq.question}
                    <span className="text-[#FF2D8E] group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="px-5 pb-4 text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Closing CTA */}
      <section
        className="border-t-4 border-black py-16 md:py-20"
        style={{ background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-3xl mb-2" aria-hidden>👑</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to join?</h2>
          <p className="text-white/90 text-lg mb-8">
            Book your complimentary consult — {RYAN_FULL_NAME} on site 7 days a week.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <CTA href={BOOKING_URL} variant="white">Book Your Consult</CTA>
            <CTA href={appUrl} variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-[#E6007E]">
              Open App — For Him
            </CTA>
          </div>
          <p className="mt-6 text-sm text-white/75">
            📍 {SITE.address.streetAddress}, {SITE.address.addressLocality} · 📞 {SITE.phone}
          </p>
        </div>
      </section>
    </div>
  );
}
