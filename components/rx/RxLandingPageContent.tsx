"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { CTA } from "@/components/CTA";
import { RxContactForm, RxCTASection } from "@/components/RxContactForm";
import { FadeUp, Section } from "@/components/Section";
import { MedicalTrustBand } from "@/components/MedicalTrustBand";
import { TwoDoorsForkBand } from "@/components/TwoDoorsForkBand";
import {
  RX_LANDING_HERO,
  RX_LANDING_JOURNEY,
  RX_LANDING_NAV,
  RX_LANDING_PARTNERS,
  RX_LANDING_PATIENT_HUB,
  RX_LANDING_PROGRAMS,
  RX_LANDING_TRUST,
  type RxLandingProgram,
} from "@/lib/rx-landing-page";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

function IconTagBadge({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="hidden shrink-0 flex-col items-center justify-center gap-2 border-l border-black/8 bg-[#FFFBFC] px-4 py-4 text-center sm:flex md:px-5">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF0F7] text-xl shadow-inner ring-2 ring-[#E6007E]/15">
        {emoji}
      </span>
      <span className="max-w-[80px] text-[10px] font-bold uppercase leading-tight tracking-wide text-[#E6007E]">
        {label}
      </span>
    </div>
  );
}

function ProgramRow({ program }: { program: RxLandingProgram }) {
  const isMembership = program.id === "membership";

  const body = (
    <div
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border transition sm:flex-row sm:items-stretch ${
        isMembership
          ? "border-[#E6007E] bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] text-white shadow-[0_16px_48px_rgba(230,0,126,0.25)] hover:shadow-[0_20px_56px_rgba(230,0,126,0.35)]"
          : "border-black/10 bg-white shadow-sm hover:border-[#E6007E]/35 hover:shadow-[0_16px_48px_rgba(230,0,126,0.14)]"
      }`}
    >
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#FFF0F7] sm:w-36 md:w-40 lg:w-44">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={program.image}
          alt={program.imageAlt}
          className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.04]"
          loading="lazy"
          width={480}
          height={480}
        />
        {program.badge && !isMembership ? (
          <span className="absolute left-2 top-2 rounded-full bg-[#E6007E] px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow">
            {program.badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {program.badge && isMembership ? (
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              {program.badge}
            </span>
          ) : null}
          {program.priceHint ? (
            <span
              className={`text-xs font-semibold ${isMembership ? "text-white/90" : "text-[#E6007E]"}`}
            >
              {program.priceHint}
            </span>
          ) : null}
        </div>
        <h3
          className={`mt-1 text-lg font-bold ${isMembership ? "text-white" : "text-black group-hover:text-[#E6007E]"}`}
        >
          {program.title}
        </h3>
        <p
          className={`mt-1.5 text-sm leading-relaxed ${isMembership ? "text-white/85" : "text-black/65"}`}
        >
          {program.description}
        </p>
        <span
          className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${isMembership ? "text-white" : "text-[#E6007E]"}`}
        >
          {program.cta}
          <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
            →
          </span>
        </span>
      </div>
      <IconTagBadge emoji={program.iconTag.emoji} label={program.iconTag.label} />
    </div>
  );

  return (
    <Link href={program.href} className="block h-full scroll-mt-28" id={program.id}>
      {body}
    </Link>
  );
}

export function RxLandingPageContent() {
  const [activeNav, setActiveNav] = useState<(typeof RX_LANDING_NAV)[number]["id"]>("programs");
  const [journeyStep, setJourneyStep] = useState(0);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const selectNav = useCallback(
    (id: (typeof RX_LANDING_NAV)[number]["id"]) => {
      setActiveNav(id);
      scrollTo(id);
    },
    [scrollTo],
  );

  const activeJourney = RX_LANDING_JOURNEY[journeyStep];

  return (
    <div className="relative min-h-[100dvh]">
      {/* Ambient wash */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${BRAND.pinkHot}22 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 0% 70%, ${BRAND.pink}18 0%, transparent 45%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 35%, #fafafa 100%)
          `,
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b-4 border-black">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, ${BRAND.pinkHot}55 0%, transparent 45%),
              radial-gradient(circle at 80% 60%, ${BRAND.pink}44 0%, transparent 40%)
            `,
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-12 md:py-20 lg:px-6">
          <FadeUp>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC] backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#E6007E]" aria-hidden />
              {RX_LANDING_HERO.eyebrow}
            </p>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
              {RX_LANDING_HERO.title}{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                {RX_LANDING_HERO.titleAccent}
              </span>
            </h1>
            <p className="mt-3 text-xl font-semibold text-[#FFB8DC] md:text-2xl">
              {RX_LANDING_HERO.subtitle}
            </p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
              {RX_LANDING_HERO.body}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <CTA href={RX_LANDING_HERO.primaryCta.href} variant="gradient" className="px-8 py-3.5">
                {RX_LANDING_HERO.primaryCta.label}
              </CTA>
              <CTA href="/rx/request" variant="outline" className="border-white/80 px-8 py-3.5 text-white hover:bg-white hover:text-black">
                Browse RX catalog
              </CTA>
              <CTA
                href={RX_LANDING_HERO.secondaryCta.href}
                variant="outline"
                className="border-white/80 px-8 py-3.5 text-white hover:bg-white hover:text-black"
              >
                {RX_LANDING_HERO.secondaryCta.label}
              </CTA>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {RX_LANDING_TRUST.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80 backdrop-blur"
                >
                  {item}
                </span>
              ))}
            </div>
          </FadeUp>

          <FadeUp delayMs={80}>
            <div className="relative mx-auto w-full max-w-md md:max-w-none">
              <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[12px_12px_0_0_rgba(230,0,126,0.45)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={RX_LANDING_HERO.heroImage}
                  alt={RX_LANDING_HERO.heroImageAlt}
                  className="aspect-[4/5] w-full object-cover object-[center_20%] sm:aspect-[3/4]"
                  width={900}
                  height={1125}
                  fetchPriority="high"
                />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="border-b-4 border-black bg-[#FFF0F7] px-4 py-10 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <TwoDoorsForkBand activeDoor="hello-gorgeous-rx" surface="light" />
        </div>
      </div>

      <MedicalTrustBand surface="rose" />

      {/* Sticky nav */}
      <div className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 lg:px-6">
          {RX_LANDING_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectNav(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeNav === item.id
                  ? "bg-[#E6007E] text-white shadow-md"
                  : "bg-[#FFF0F7] text-black/70 hover:bg-[#FFE0F0] hover:text-[#E6007E]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Programs */}
      <Section id="programs" className="scroll-mt-24 border-b border-black/10 bg-white !py-14">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E6007E]">
              Medical optimization
            </p>
            <h2 className="mt-2 text-3xl font-black text-black md:text-4xl">
              Five pillars.{" "}
              <span className="text-[#E6007E]">One medical home.</span>
            </h2>
            <p className="mt-3 max-w-2xl text-black/65">
              Tap a program — each path starts with an NP evaluation for qualified Illinois patients.
            </p>
          </FadeUp>
          <div className="mt-8 flex flex-col gap-4">
            {RX_LANDING_PROGRAMS.map((program, idx) => (
              <FadeUp key={program.id} delayMs={40 * idx}>
                <ProgramRow program={program} />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Patient hub */}
      <Section
        id="patient-hub"
        className="scroll-mt-24 border-b-4 border-black bg-gradient-to-r from-[#FFF0F7] via-white to-[#FFF0F7] !py-14"
      >
        <FadeUp>
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <div className="flex flex-col lg:flex-row lg:items-stretch">
              <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#FFF0F7] lg:aspect-auto lg:w-80 xl:w-96">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={RX_LANDING_PATIENT_HUB.image}
                  alt="GLP-1 refill patient hub"
                  className="h-full min-h-[200px] w-full object-cover object-center lg:min-h-full"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-6 md:p-8 lg:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E6007E]">
                  {RX_LANDING_PATIENT_HUB.eyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-black text-black md:text-3xl">
                  {RX_LANDING_PATIENT_HUB.title}
                </h2>
                <p className="mt-3 text-black/70 leading-relaxed">
                  {RX_LANDING_PATIENT_HUB.description}
                </p>
                <ul className="mt-4 space-y-1.5 text-sm text-black/65">
                  {RX_LANDING_PATIENT_HUB.bullets.map((b) => (
                    <li key={b}>▸ {b}</li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <CTA
                    href={RX_LANDING_PATIENT_HUB.primaryHref}
                    variant="gradient"
                    className="px-8 py-3.5 text-center"
                  >
                    {RX_LANDING_PATIENT_HUB.primaryLabel}
                  </CTA>
                  <CTA
                    href={RX_LANDING_PATIENT_HUB.secondaryHref}
                    variant="outline"
                    className="border-black/20 px-8 py-3.5 text-center text-black hover:border-[#E6007E]"
                  >
                    {RX_LANDING_PATIENT_HUB.secondaryLabel}
                  </CTA>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Compliance */}
      <Section className="border-b-2 border-[#E6007E] bg-white !py-8">
        <div className="mx-auto grid max-w-5xl gap-4 px-4 md:grid-cols-2 lg:px-6">
          {[
            "All prescription therapies are prescribed by Ryan Kent, FNP-BC following a comprehensive medical evaluation.",
            "Services are available to Illinois residents only.",
            "Medications are fulfilled through licensed U.S. compounding and pharmaceutical partners.",
            "A valid medical consultation is required prior to approval.",
          ].map((text) => (
            <div key={text} className="flex items-start gap-3 text-sm text-black/70">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E6007E] text-xs text-white">
                ✓
              </span>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Journey */}
      <Section id="journey" className="scroll-mt-24 border-b border-black/10 bg-[#FFFBFC] !py-14">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-2xl font-black text-black md:text-3xl">
              How Hello Gorgeous <span className="text-[#E6007E]">RX™</span> works
            </h2>
            <p className="mt-2 max-w-xl text-black/60">
              From first inquiry to monthly refills — supervised by Ryan Kent, FNP-BC.
            </p>
          </FadeUp>

          <div className="mt-8 hidden md:grid md:grid-cols-4">
            {RX_LANDING_JOURNEY.map((step, idx) => {
              const active = journeyStep === idx;
              const done = journeyStep > idx;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setJourneyStep(idx)}
                  className="group relative flex flex-col items-start px-2 text-left"
                >
                  {idx < RX_LANDING_JOURNEY.length - 1 ? (
                    <span
                      className={`absolute left-8 top-4 h-0.5 w-[calc(100%-2rem)] ${done ? "bg-[#E6007E]" : "bg-black/10"}`}
                      aria-hidden
                    />
                  ) : null}
                  <span
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                      active
                        ? "bg-[#E6007E] text-white ring-4 ring-[#E6007E]/20"
                        : done
                          ? "bg-[#E6007E] text-white"
                          : "bg-[#FFF0F7] text-black/50 group-hover:bg-[#FFE0F0]"
                    }`}
                  >
                    {step.step}
                  </span>
                  <p className={`mt-3 text-sm font-bold ${active ? "text-[#E6007E]" : "text-black"}`}>
                    {step.title}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)] md:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">
              Step {activeJourney.step} of {RX_LANDING_JOURNEY.length}
            </p>
            <h3 className="mt-2 text-xl font-black text-black md:text-2xl">{activeJourney.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/65 md:text-base">
              {activeJourney.detail}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {"external" in activeJourney && activeJourney.external ? (
                <a
                  href={activeJourney.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-[#E6007E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#C90A68]"
                >
                  {activeJourney.cta}
                </a>
              ) : activeJourney.href.startsWith("#") ? (
                <button
                  type="button"
                  onClick={() => scrollTo(activeJourney.href.slice(1))}
                  className="inline-flex rounded-full bg-[#E6007E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#C90A68]"
                >
                  {activeJourney.cta}
                </button>
              ) : (
                <Link
                  href={activeJourney.href}
                  className="inline-flex rounded-full bg-[#E6007E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#C90A68]"
                >
                  {activeJourney.cta}
                </Link>
              )}
              {journeyStep < RX_LANDING_JOURNEY.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setJourneyStep((s) => s + 1)}
                  className="rounded-full border border-black/15 px-6 py-2.5 text-sm font-semibold text-black/70 hover:border-[#E6007E]/40"
                >
                  Next step
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-2 md:hidden">
            {RX_LANDING_JOURNEY.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Step ${idx + 1}`}
                onClick={() => setJourneyStep(idx)}
                className={`h-2 rounded-full transition-all ${journeyStep === idx ? "w-8 bg-[#E6007E]" : "w-2 bg-black/15"}`}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Partners */}
      <Section className="border-b border-black/10 bg-white !py-12">
        <FadeUp>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">
              Trusted partners
            </p>
            <h2 className="mt-2 text-2xl font-black text-black">Clinical &amp; diagnostic partners</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {RX_LANDING_PARTNERS.map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl border-2 border-black/10 bg-[#FFFBFC] px-8 py-5 transition hover:border-[#E6007E]/30 hover:shadow-md"
                >
                  <p className="text-lg font-black text-black">{p.name}</p>
                  <p className="text-sm text-black/55">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Book */}
      <Section id="book" className="scroll-mt-24 border-b border-black/10 bg-[#FFF0F7]/40 !py-14">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-black md:text-4xl">
                Begin your <span className="text-[#E6007E]">medical evaluation</span>
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-black/65">
                Telehealth, in-office, or call — all paths require a consultation with our medical team.
              </p>
            </div>
            <RxCTASection />
          </FadeUp>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" className="scroll-mt-24 bg-white !py-14">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
              <div>
                <h2 className="text-3xl font-black text-black">
                  Have <span className="text-[#E6007E]">questions?</span>
                </h2>
                <p className="mt-3 text-black/70">
                  Submit an inquiry — our medical team reviews and responds within 24–48 hours.
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    ["No commitment required", "Just an inquiry to learn about your options"],
                    ["Confidential & HIPAA compliant", "Your information is protected"],
                    ["Illinois residents only", "We serve patients in Illinois"],
                  ].map(([title, sub]) => (
                    <div key={title} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E6007E]/10">
                        <span className="text-[#E6007E]">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold text-black">{title}</p>
                        <p className="text-sm text-black/60">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 rounded-2xl border-4 border-black bg-black p-5 text-white shadow-[6px_6px_0_0_rgba(230,0,126,0.35)]">
                  <p className="font-semibold">Prefer to call?</p>
                  <a
                    href={`tel:${SITE.phone.replace(/-/g, "")}`}
                    className="mt-1 block text-2xl font-black text-[#FFB8DC] hover:underline"
                  >
                    {SITE.phone}
                  </a>
                </div>
              </div>
              <div className="rounded-3xl border-4 border-black bg-[#FFFBFC] p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.25)] md:p-8">
                <h3 className="text-xl font-black text-black">Submit an inquiry</h3>
                <div className="mt-4">
                  <RxContactForm />
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Legal */}
      <Section className="border-t-4 border-black bg-black !py-10">
        <div className="mx-auto max-w-4xl space-y-2 px-4 text-center text-xs text-white/55">
          <p>Prescription products are available only to qualified patients following medical evaluation.</p>
          <p>Individual results vary. Not all patients are candidates. Illinois residents only.</p>
          <p>This information does not replace primary medical care.</p>
          <div className="flex justify-center gap-6 pt-4">
            <Link href="/privacy" className="hover:text-[#FFB8DC]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#FFB8DC]">
              Terms of Service
            </Link>
            <Link href="/hipaa" className="hover:text-[#FFB8DC]">
              HIPAA Notice
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
