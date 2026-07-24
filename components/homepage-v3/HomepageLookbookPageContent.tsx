"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { TwoDoorsForkBand } from "@/components/TwoDoorsForkBand";
import {
  HG_ABOUT_BLURB,
  HG_EXPERIENCE_INTRO,
  HG_EXPERIENCE_VALUES,
  HG_FAVORITE_TREATMENTS,
  HG_WAY_STEPS,
} from "@/lib/homepage-experience";
import { MEDICAL_TRUST_PROVIDERS } from "@/lib/medical-trust";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { REVIEW_TRUST_HEADLINE, reviewTrustBody } from "@/lib/review-trust-copy";
import {
  SERVICES_HUB_MORE,
  SERVICES_HUB_PATH,
  SERVICES_LOOKBOOK,
  type ServicesLookbookItem,
} from "@/lib/services-hub-marketing";
import { HOME_TESTIMONIALS, SITE } from "@/lib/seo";

const PINK = "#E6007E";
const HOT = "#FF2D8E";

function LookbookTile({ item, priority }: { item: ServicesLookbookItem; priority?: boolean }) {
  return (
    <Link
      href={item.href}
      className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E6007E]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f3eef1]">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          priority={priority}
          className="object-cover object-center transition duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div>
          <p
            className="text-lg font-semibold tracking-tight text-black sm:text-xl"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            {item.label}
          </p>
          {item.note ? <p className="mt-0.5 text-sm text-black/55">{item.note}</p> : null}
        </div>
        <span className="shrink-0 text-sm font-medium text-[#E6007E] transition group-hover:translate-x-0.5">
          View →
        </span>
      </div>
    </Link>
  );
}

function ExperienceAccordion() {
  const [open, setOpen] = useState(HG_EXPERIENCE_VALUES[0]?.id ?? "time");
  return (
    <div className="divide-y divide-black/10 border-y border-black/10">
      {HG_EXPERIENCE_VALUES.map((v) => {
        const isOpen = open === v.id;
        return (
          <div key={v.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? "" : v.id)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span
                className="text-lg font-semibold text-black sm:text-xl"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                {v.title}
              </span>
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: isOpen ? HOT : "#111" }}
                aria-hidden
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen ? (
              <p className="pb-5 pr-12 text-base leading-relaxed text-black/70">{v.body}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function HomepageLookbookPageContent() {
  return (
    <div className="relative bg-white text-black">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 40% at 50% 0%, #FF2D8E14 0%, transparent 55%),
            linear-gradient(180deg, #FFF5F9 0%, #ffffff 28%, #ffffff 70%, #FFF0F7 100%)
          `,
        }}
      />

      {/* 1 — Recommend / philosophy */}
      <section className="border-b border-black/8">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:px-8 md:py-24">
          <FadeUp>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: PINK }}>
              {HG_EXPERIENCE_INTRO.eyebrow}
            </p>
            <h2
              className="mt-3 text-4xl font-bold tracking-tight text-black sm:text-5xl"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              {HG_EXPERIENCE_INTRO.headline}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-black/70 sm:text-lg">
              {HG_EXPERIENCE_INTRO.body}
            </p>
          </FadeUp>
          <FadeUp delayMs={80}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#111] sm:aspect-[5/4] md:rounded-none">
              <Image
                src="/images/website-hero/room-solaria.jpg"
                alt="Hello Gorgeous treatment suite in Oswego, IL"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%)",
                }}
              />
              <p
                className="absolute bottom-5 left-5 right-5 text-2xl font-semibold italic text-white sm:text-3xl"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                Quiet luxury.{" "}
                <span style={{ color: HOT }}>Real medicine.</span>
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 2 — Favorite treatments */}
      <section className="border-b border-black/8 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:px-8 md:py-20">
          <FadeUp>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: PINK }}>
              Our favorites
            </p>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Treatments patients ask for most
            </h2>
            <p className="mt-3 max-w-2xl text-base text-black/65">
              InMode technology, injectables, and clinical facials — chosen for natural-looking
              results under NP oversight.
            </p>
          </FadeUp>

          <div className="mt-10 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-5 md:gap-5 md:overflow-visible md:pb-0">
            {HG_FAVORITE_TREATMENTS.map((t, i) => (
              <FadeUp key={t.id} delayMs={40 * i} className="min-w-[72%] snap-start sm:min-w-[45%] md:min-w-0">
                <Link href={t.href} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#f3eef1]">
                    <Image
                      src={t.image}
                      alt={t.label}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 70vw, 20vw"
                    />
                  </div>
                  <p
                    className="mt-3 text-lg font-semibold text-black"
                    style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                  >
                    {t.label}
                  </p>
                  <p className="mt-0.5 text-sm text-black/55">{t.note}</p>
                </Link>
              </FadeUp>
            ))}
          </div>

          <FadeUp delayMs={100}>
            <div className="mt-10">
              <CTA href={SERVICES_HUB_PATH} variant="gradient">
                Explore all services →
              </CTA>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 3 — Experience accordion */}
      <section className="border-b border-black/8 bg-[#FFF5F9]">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.1fr] md:px-8 md:py-24">
          <FadeUp>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: PINK }}>
              The Hello Gorgeous experience
            </p>
            <h2
              className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Care with intention
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/65">
              The same standards whether you’re here for Solaria, Quantum RF, or a quick
              injectable touch-up.
            </p>
          </FadeUp>
          <FadeUp delayMs={60}>
            <ExperienceAccordion />
          </FadeUp>
        </div>
      </section>

      {/* 4 — Plan next step */}
      <section className="border-b border-black/8 bg-[#0a0a0a] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-end md:justify-between md:px-8 md:py-20">
          <FadeUp>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: HOT }}>
              Next step
            </p>
            <h2
              className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Plan your visit with confidence
            </h2>
            <p className="mt-4 max-w-lg text-base text-white/70">
              Begin with a free consult — or explore care paths if you’re still deciding what fits.
            </p>
          </FadeUp>
          <FadeUp delayMs={80}>
            <div className="flex flex-wrap gap-3">
              <Link
                href={PRIMARY_BOOKING_CTA.href}
                className="inline-flex items-center rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white"
                style={{ background: HOT }}
              >
                {PRIMARY_BOOKING_CTA.label}
              </Link>
              <Link
                href="/explore-care"
                className="inline-flex items-center rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white hover:bg-white/10"
              >
                Explore care
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 5 — About + providers */}
      <section className="border-b border-black/8">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <FadeUp>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: PINK }}>
                {HG_ABOUT_BLURB.eyebrow}
              </p>
              <h2
                className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                {HG_ABOUT_BLURB.headline}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-black/70">{HG_ABOUT_BLURB.body}</p>
              <Link
                href={HG_ABOUT_BLURB.ctaHref}
                className="mt-6 inline-flex text-sm font-bold uppercase tracking-[0.14em] text-[#E6007E] underline decoration-[#E6007E]/35 underline-offset-4"
              >
                {HG_ABOUT_BLURB.ctaLabel} →
              </Link>
            </FadeUp>
            <FadeUp delayMs={80}>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: PINK }}>
                Meet your providers
              </p>
              <h3
                className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                The people behind your care
              </h3>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {MEDICAL_TRUST_PROVIDERS.map((p) => (
                  <div key={p.name}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#f3eef1]">
                      <Image
                        src={p.image}
                        alt={p.imageAlt}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 50vw, 240px"
                      />
                    </div>
                    <p
                      className="mt-3 text-lg font-semibold text-black"
                      style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                    >
                      {p.name}
                    </p>
                    <p className="text-sm font-medium" style={{ color: PINK }}>
                      {p.role}
                    </p>
                    <p className="mt-1 text-sm text-black/55">{p.detail}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 6 — The HG Way */}
      <section className="border-b border-black/8 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:px-8 md:py-20">
          <FadeUp>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: PINK }}>
              The Hello Gorgeous way
            </p>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              How we take care of you
            </h2>
          </FadeUp>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HG_WAY_STEPS.map((s, i) => (
              <FadeUp key={s.step} delayMs={50 * i}>
                <p className="text-sm font-bold tracking-[0.2em]" style={{ color: HOT }}>
                  {s.step}
                </p>
                <h3
                  className="mt-2 text-xl font-semibold text-black"
                  style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                >
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-black/65">{s.body}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — Slim lookbook */}
      <section className="border-b border-black/8">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:px-8 md:py-20">
          <FadeUp>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: PINK }}>
              Lookbook
            </p>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <h2
                className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                Browse by treatment
              </h2>
              <CTA href={SERVICES_HUB_PATH} variant="gradient">
                Full services atlas →
              </CTA>
            </div>
          </FadeUp>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {SERVICES_LOOKBOOK.slice(0, 6).map((item, i) => (
              <FadeUp key={item.id} delayMs={30 * i}>
                <LookbookTile item={item} priority={i < 2} />
              </FadeUp>
            ))}
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {SERVICES_HUB_MORE.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-lg text-black underline decoration-black/20 underline-offset-4 transition hover:text-[#E6007E] hover:decoration-[#E6007E]"
                  style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section className="!py-10">
        <div className="mx-auto max-w-6xl">
          <TwoDoorsForkBand activeDoor="med-spa" surface="light" />
        </div>
      </Section>

      {/* Reviews */}
      <section id="reviews" className="border-y border-black/8 bg-[#FFF5F9] py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <FadeUp>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: PINK }}>
              What patients love most
            </p>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Real voices from Oswego & beyond
            </h2>
            <p className="mt-3 max-w-2xl text-base text-black/65">{reviewTrustBody()}</p>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em]" style={{ color: PINK }}>
              {REVIEW_TRUST_HEADLINE}
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {HOME_TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name + t.service} delayMs={40 * (i % 4)}>
                <figure className="flex h-full flex-col border border-black/10 bg-white p-6 md:p-8">
                  <p className="text-[#E6007E]" aria-hidden>
                    {"★".repeat(Math.min(5, Math.round(t.rating)))}
                  </p>
                  <blockquote className="mt-3 flex-1 text-base leading-relaxed text-black/85 md:text-lg">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-black/10 pt-4">
                    <cite className="not-italic font-semibold text-black">{t.name}</cite>
                    <span className="mt-0.5 block text-sm text-black/55">{t.location}</span>
                    <span className="text-sm font-medium text-[#E6007E]">{t.service}</span>
                  </figcaption>
                </figure>
              </FadeUp>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link
              href="/reviews"
              className="text-sm font-bold text-[#E6007E] underline decoration-[#E6007E]/35 underline-offset-4"
            >
              Read more reviews →
            </Link>
          </p>
        </div>
      </section>

      <section
        className="px-6 py-20 text-center md:px-10"
        style={{
          background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 50%, #9b0a4d 100%)",
        }}
      >
        <h2
          className="text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
        >
          Ready when you are
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/90">
          Free consult with our NP-led team — call{" "}
          <a href={`tel:${SITE.phone}`} className="font-semibold underline">
            (630) 636-6193
          </a>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CTA
            href={PRIMARY_BOOKING_CTA.href}
            variant="outline"
            className="!border-white !bg-white !text-[#E6007E]"
          >
            {PRIMARY_BOOKING_CTA.label}
          </CTA>
          <CTA
            href={SERVICES_HUB_PATH}
            variant="outline"
            className="!border-white !text-white hover:!bg-white/10"
          >
            Browse services
          </CTA>
        </div>
      </section>
    </div>
  );
}
