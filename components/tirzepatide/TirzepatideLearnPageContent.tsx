"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  JOURNEY_HERO_BG,
  JourneyCheckItem,
  JourneyChip,
  JourneyDarkCard,
  JourneyEyebrow,
  JourneyGhostBtn,
  JourneyPinkBtn,
  JourneySectionHead,
  JourneyTrustBar,
  JourneyVideoFrame,
} from "@/components/marketing/JourneyPageUi";
import { CHERRY_PAY_URL } from "@/lib/flows";
import { GLP1_PROGRAM, GLP1_PROGRAM_DISCLAIMER } from "@/lib/glp1-program-pricing";
import { MEDICAL_DIRECTOR, PRESCRIBING_NP } from "@/lib/medical-authority";
import { PEPTIDE_SCIENCE_VIDEOS } from "@/lib/peptide-topic-media";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { RX_CARE_TEXT_DISPLAY, RX_CARE_TEXT_SMS } from "@/lib/rx-contact";
import { SITE } from "@/lib/seo";
import {
  TIRZEPATIDE_CITIES,
  TIRZEPATIDE_COMPARE,
  TIRZEPATIDE_DOSE_TIERS,
  TIRZEPATIDE_FACTS,
  TIRZEPATIDE_FOR,
  TIRZEPATIDE_INCLUDES,
  TIRZEPATIDE_LEARN,
  TIRZEPATIDE_LEARN_FAQS,
  TIRZEPATIDE_NAV,
  TIRZEPATIDE_NOT_FOR,
  TIRZEPATIDE_PROGRAM_STEPS,
  TIRZEPATIDE_RESEARCH,
  TIRZEPATIDE_SCIENCE,
  TIRZEPATIDE_SIDES,
} from "@/lib/tirzepatide-learn";

const BOOK = PRIMARY_BOOKING_CTA.href;
const CALL = `tel:${SITE.phone.replace(/\D/g, "")}`;
const SEMA_HREF = "/rx/protocols/semaglutide";
const GLP1_LEARN = "/rx/learn/what-is-glp-1";
const PROGRAM_OFFER = "/tirzepatide-program";

/**
 * Flagship /tirzepatide Learn More — same cinematic system as Peptide Therapy
 * and Your Brow Journey. Educational depth, consult-first CTAs, no cart.
 */
export function TirzepatideLearnPageContent() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-black font-sans text-white">
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/82 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5">
          <Link href="/rx" className="flex items-center gap-2.5 font-bold">
            <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-[13px] font-extrabold text-white">
              HG
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-base">Hello Gorgeous</span>
              <span className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FF2D8E]">
                Tirzepatide
              </span>
            </span>
          </Link>
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
            {TIRZEPATIDE_NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-white/75 transition hover:text-white">
                {item.label}
              </a>
            ))}
            <JourneyPinkBtn href={TIRZEPATIDE_LEARN.intakeHref} className="!px-5 !py-2.5 !text-[15px]">
              Start intake
            </JourneyPinkBtn>
          </div>
        </div>
        {navOpen ? (
          <div className="border-t border-white/10 px-6 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {TIRZEPATIDE_NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-white/85"
                  onClick={() => setNavOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <JourneyPinkBtn href={TIRZEPATIDE_LEARN.intakeHref} className="mt-2 w-full">
                Start intake
              </JourneyPinkBtn>
            </div>
          </div>
        ) : null}
      </nav>

      <header className={JOURNEY_HERO_BG}>
        <div
          className="pointer-events-none absolute -right-28 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,45,142,0.28),transparent_62%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-24">
          <div>
            <JourneyEyebrow>{TIRZEPATIDE_LEARN.eyebrow}</JourneyEyebrow>
            <h1 className="mt-4 font-serif text-[44px] font-bold leading-[1.02] text-white lg:text-[66px]">
              {TIRZEPATIDE_LEARN.h1}{" "}
              <span className="text-[#FF2D8E]">{TIRZEPATIDE_LEARN.h1Accent}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80 lg:text-xl">
              {TIRZEPATIDE_LEARN.lede}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <JourneyPinkBtn href={TIRZEPATIDE_LEARN.intakeHref}>Start intake</JourneyPinkBtn>
              <JourneyGhostBtn href={BOOK}>{PRIMARY_BOOKING_CTA.label}</JourneyGhostBtn>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                `From $${TIRZEPATIDE_LEARN.fromUsd}/mo`,
                `$${TIRZEPATIDE_LEARN.consultUsd} NP consult`,
                PRESCRIBING_NP.displayName,
                `Pickup or $${TIRZEPATIDE_LEARN.shippingUsd} IL ship`,
              ].map((chip) => (
                <JourneyChip key={chip}>{chip}</JourneyChip>
              ))}
            </div>
          </div>
          <JourneyVideoFrame
            src={PEPTIDE_SCIENCE_VIDEOS.rxEducation}
            label="Tirzepatide science animation — Hello Gorgeous RX"
            poster={TIRZEPATIDE_LEARN.image}
            className="lg:max-w-lg"
          />
        </div>
      </header>

      <JourneyTrustBar />

      <section
        id="what"
        className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto grid max-w-[1200px] items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <JourneySectionHead
              eyebrow="What Is Tirzepatide?"
              title="A dual-hormone"
              titleAccent="weekly protocol"
              description="Tirzepatide activates two gut-hormone receptors — GIP and GLP-1 — at once. At Hello Gorgeous RX it is a once-weekly injection. Your nurse practitioner decides if it belongs in your plan after labs and history, not a cart."
            />
            <dl className="mt-10 divide-y divide-white/10 overflow-hidden rounded-[20px] border border-white/14 bg-gradient-to-b from-[#140109] to-[#0a0206]">
              {TIRZEPATIDE_FACTS.map((row) => (
                <div key={row.label} className="grid gap-1 px-6 py-4 sm:grid-cols-[200px_1fr] sm:items-baseline sm:gap-6">
                  <dt className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#FFB8DC]">{row.label}</dt>
                  <dd className="text-[16px] font-medium text-white/90">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="overflow-hidden rounded-3xl border border-[#FF2D8E]/35 bg-black shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={TIRZEPATIDE_LEARN.image}
                alt={TIRZEPATIDE_LEARN.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="science"
        className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow="The Science"
            title="How tirzepatide"
            titleAccent="works"
            description="Four pieces of the mechanism — written for a consult, not a sales script. Individual response varies."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {TIRZEPATIDE_SCIENCE.map((step) => (
              <JourneyDarkCard key={step.n} className="transition hover:-translate-y-1 hover:border-[#FF2D8E]">
                <p className="text-[13px] font-extrabold tracking-[0.2em] text-[#FF2D8E]">{step.n}</p>
                <h3 className="mt-3 font-serif text-[26px] font-bold leading-tight">{step.title}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-white/75">{step.body}</p>
              </JourneyDarkCard>
            ))}
          </div>
        </div>
      </section>

      <section
        id="research"
        className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow="Clinical Research"
            title="What published trials"
            titleAccent="actually show"
            description="These are averages from peer-reviewed studies — education, not a guarantee. Your result depends on dose, duration, tolerance, and the plan Ryan writes for you."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {TIRZEPATIDE_RESEARCH.map((card) => (
              <JourneyDarkCard key={card.id}>
                <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#FF2D8E]">
                  {card.title}
                </p>
                <p className="mt-4 text-[16px] leading-relaxed text-white/80">{card.body}</p>
              </JourneyDarkCard>
            ))}
          </div>
        </div>
      </section>

      <section
        id="compare"
        className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow="Side-by-Side"
            title="Tirzepatide vs"
            titleAccent="semaglutide"
            description="Both are weekly injections. The difference is mechanism — and which one fits you is a medical decision, not a ranking."
          />
          <div className="mt-10 overflow-hidden rounded-[20px] border border-white/14">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-[#FF2D8E] px-4 py-3 text-[13px] font-extrabold uppercase tracking-[0.08em] text-black sm:px-6">
              <span> </span>
              <span>Tirzepatide</span>
              <span>Semaglutide</span>
            </div>
            {TIRZEPATIDE_COMPARE.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-[1.1fr_1fr_1fr] gap-2 px-4 py-4 text-[14px] sm:px-6 sm:text-[16px] ${
                  i % 2 === 0 ? "bg-[#0a0206]" : "bg-[#140109]"
                }`}
              >
                <span className="font-bold text-[#FFB8DC]">{row.label}</span>
                <span className="text-white/90">{row.tirz}</span>
                <span className="text-white/80">{row.sema}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-white/55">
            Trial averages are published research, not a forecast. {PRESCRIBING_NP.displayName} chooses
            the molecule after your history and labs.{" "}
            <Link href={SEMA_HREF} className="font-bold text-[#FF2D8E] underline-offset-4 hover:underline">
              Learn about semaglutide →
            </Link>
          </p>
        </div>
      </section>

      <section
        id="provider"
        className="bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <div className="overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
            <div className="relative aspect-square w-full">
              <Image
                src={PRESCRIBING_NP.image}
                alt={PRESCRIBING_NP.imageAlt}
                fill
                className="object-cover object-[center_22%]"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
            </div>
          </div>
          <div>
            <JourneyEyebrow>Meet Your Provider</JourneyEyebrow>
            <h2 className="mt-3 font-serif text-[38px] font-bold leading-tight text-white lg:text-[52px]">
              Ryan <span className="text-[#FF2D8E]">Kent, FNP-BC</span>
            </h2>
            <p className="mt-2 text-[15px] font-bold uppercase tracking-[0.16em] text-white/60">
              {PRESCRIBING_NP.roleLine}
            </p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
              Every tirzepatide protocol is prescribed and managed by {PRESCRIBING_NP.displayName} — a
              board-certified family nurse practitioner with full Illinois prescriptive authority, on
              site six days a week in Oswego.
            </p>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-white/70">
              Medical oversight: {MEDICAL_DIRECTOR.displayName}. Nothing ships until Ryan reviews your
              history, sets your dose, and approves the plan.
            </p>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <JourneyPinkBtn href={TIRZEPATIDE_LEARN.intakeHref}>Start intake</JourneyPinkBtn>
              <JourneyGhostBtn href={RX_CARE_TEXT_SMS}>Text {RX_CARE_TEXT_DISPLAY}</JourneyGhostBtn>
            </div>
          </div>
        </div>
      </section>

      <section
        id="program"
        className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow="Our Program"
            title="How it works"
            titleAccent="at Hello Gorgeous"
            description="Consult-first. No client cart. Intake is free to submit. Medication is invoiced only after your NP approves the protocol."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {TIRZEPATIDE_PROGRAM_STEPS.map((step) => (
              <JourneyDarkCard key={step.n} className="transition hover:-translate-y-1 hover:border-[#FF2D8E]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-extrabold tracking-[0.2em] text-[#FF2D8E]">{step.n}</p>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#FFB8DC]">
                    {step.tag}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-[26px] font-bold leading-tight">{step.title}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-white/75">{step.body}</p>
              </JourneyDarkCard>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow="Pricing"
            title={`From $${TIRZEPATIDE_LEARN.fromUsd}`}
            titleAccent="/month"
            description={`${GLP1_PROGRAM.consultCredit} Pickup on Washington Street or flat $${TIRZEPATIDE_LEARN.shippingUsd} Illinois shipping.`}
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <JourneyDarkCard>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#FF2D8E]">
                Weekly dose · medication included
              </p>
              <ul className="mt-5 divide-y divide-white/10">
                {TIRZEPATIDE_DOSE_TIERS.map((tier) => (
                  <li key={tier.id} className="flex items-baseline justify-between gap-4 py-3">
                    <span className="font-medium text-white/85">{tier.doseLabel}</span>
                    <span className="font-serif text-[22px] font-bold text-white">${tier.priceUsd}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[13px] leading-relaxed text-white/50">{GLP1_PROGRAM_DISCLAIMER}</p>
            </JourneyDarkCard>
            <div className="flex flex-col gap-6">
              <JourneyDarkCard>
                <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#FF2D8E]">
                  Program includes
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {TIRZEPATIDE_INCLUDES.map((item) => (
                    <JourneyCheckItem key={item}>{item}</JourneyCheckItem>
                  ))}
                </ul>
              </JourneyDarkCard>
              <JourneyDarkCard>
                <p className="font-serif text-[22px] font-bold">Looking for a structured start?</p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/70">
                  Our 10-week tirzepatide program is a separate, all-in offer for clients who want a
                  defined first stretch.
                </p>
                <Link
                  href={PROGRAM_OFFER}
                  className="mt-4 inline-block text-sm font-bold text-[#FF2D8E] hover:text-white"
                >
                  See the 10-week program →
                </Link>
              </JourneyDarkCard>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <JourneyPinkBtn href={TIRZEPATIDE_LEARN.intakeHref}>Start intake</JourneyPinkBtn>
            <JourneyGhostBtn href={CHERRY_PAY_URL} external>
              Ask about Cherry
            </JourneyGhostBtn>
          </div>
        </div>
      </section>

      <section
        id="who"
        className="bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-2">
          <JourneyDarkCard>
            <JourneyEyebrow>Good Candidates</JourneyEyebrow>
            <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight">
              Who tirzepatide <span className="text-[#FF2D8E]">is for</span>
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {TIRZEPATIDE_FOR.map((item) => (
                <JourneyCheckItem key={item}>{item}</JourneyCheckItem>
              ))}
            </ul>
          </JourneyDarkCard>
          <JourneyDarkCard>
            <JourneyEyebrow>Contraindications</JourneyEyebrow>
            <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight">
              Who it is <span className="text-[#FF2D8E]">not for</span>
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {TIRZEPATIDE_NOT_FOR.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-snug text-white/85">
                  <span className="shrink-0 font-black text-[#FF2D8E]">−</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-relaxed text-white/55">
              Tirzepatide carries a boxed warning about thyroid C-cell tumors. Tell your NP about any
              personal or family history of medullary thyroid cancer or MEN 2. This list is not
              exhaustive — your full history is reviewed before anything is prescribed.
            </p>
          </JourneyDarkCard>
        </div>
        {TIRZEPATIDE_SIDES.length > 0 ? (
          <div className="mx-auto mt-6 max-w-[1200px]">
            <JourneyDarkCard>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#FF2D8E]">
                Common side effects
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {TIRZEPATIDE_SIDES.map((item) => (
                  <li key={item} className="text-[15px] text-white/80">
                    · {item}
                  </li>
                ))}
              </ul>
            </JourneyDarkCard>
          </div>
        ) : null}
      </section>

      <section
        id="faq"
        className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[800px]">
          <JourneySectionHead
            eyebrow="FAQ"
            title="Tirzepatide"
            titleAccent="questions"
            description="Plain-language answers for Oswego and the Fox Valley. Your NP still reviews your chart before any plan is written."
            center
          />
          <div className="mt-10 flex flex-col gap-3">
            {TIRZEPATIDE_LEARN_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[16px] border border-white/14 bg-gradient-to-b from-[#140109] to-[#0a0206] px-5 py-4"
              >
                <summary className="cursor-pointer list-none font-serif text-[20px] font-bold leading-snug text-white marker:content-none">
                  <span className="text-[#FF2D8E]">▸ </span>
                  {faq.question}
                </summary>
                <p className="mt-3 text-[15.5px] leading-relaxed text-white/75">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow="Fox Valley"
            title="Tirzepatide in"
            titleAccent="Oswego, IL"
            description={`${SITE.address.streetAddress}, ${SITE.address.addressLocality} — a short drive from Naperville, Aurora, Plainfield, Yorkville, and Montgomery. Pickup here, or we ship across Illinois.`}
          />
          <div className="mt-8 flex flex-wrap gap-2.5">
            {TIRZEPATIDE_CITIES.map((city) => (
              <JourneyChip key={city}>{city}</JourneyChip>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/70">
            Same NP. Same labs-first standard. Same published dose tiers. You are a patient on
            Washington Street — not a subscription ID.{" "}
            <Link href={GLP1_LEARN} className="font-bold text-[#FF2D8E] underline-offset-4 hover:underline">
              Read what GLP-1 therapy is →
            </Link>
          </p>
        </div>
      </section>

      <section className="bg-[radial-gradient(80%_120%_at_50%_0%,#2a0820,#000_70%)] px-6 py-20 text-center lg:py-24">
        <JourneyEyebrow>Start Your Protocol</JourneyEyebrow>
        <h2 className="mt-3 font-serif text-[36px] font-bold leading-tight lg:text-[52px]">
          Ready for a plan <span className="text-[#FF2D8E]">written for you?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/80">
          Intake is free. {PRESCRIBING_NP.displayName} sets your dose. Nothing ships until he approves
          it — serving {TIRZEPATIDE_CITIES.join(", ")}, IL.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <JourneyPinkBtn href={TIRZEPATIDE_LEARN.intakeHref}>Start intake</JourneyPinkBtn>
          <JourneyGhostBtn href={RX_CARE_TEXT_SMS}>Text {RX_CARE_TEXT_DISPLAY}</JourneyGhostBtn>
          <JourneyGhostBtn href={CALL}>Call {SITE.phone}</JourneyGhostBtn>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-12">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 lg:flex-row lg:justify-between">
          <div>
            <p className="font-serif text-[22px] font-bold">Hello Gorgeous RX</p>
            <p className="mt-2 text-[15px] leading-relaxed text-white/70">
              {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion}{" "}
              {SITE.address.postalCode}
              <br />
              {SITE.phone} · hellogorgeousmedspa.com
            </p>
            <p className="mt-2 font-serif italic text-white/80">&ldquo;{SITE.tagline}&rdquo;</p>
          </div>
          <p className="max-w-xl text-[13px] leading-relaxed text-white/45">
            This page is educational and is not medical advice, a diagnosis, or a guarantee of
            results. Tirzepatide is prescription-only. NP-directed by {PRESCRIBING_NP.displayName}{" "}
            under Medical Director {MEDICAL_DIRECTOR.displayName}. {GLP1_PROGRAM_DISCLAIMER} Prices
            shown are starting points. Individual plans vary.
          </p>
        </div>
      </footer>
    </div>
  );
}
