"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { RxLegalDisclaimer } from "@/components/rx/RxLegalDisclaimer";
import {
  JOURNEY_HERO_BG,
  JourneyCheckItem,
  JourneyChip,
  JourneyEyebrow,
  JourneyGhostBtn,
  JourneyPinkBtn,
  JourneySectionHead,
  JourneyTrustBar,
  JourneyVideoFrame,
} from "@/components/marketing/JourneyPageUi";
import { CHERRY_PAY_URL } from "@/lib/flows";
import { MEDICAL_DIRECTOR, PRESCRIBING_NP } from "@/lib/medical-authority";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import {
  GLP1_RETAIL_PROGRAM,
} from "@/lib/peptide-retail-pricing";
import { PEPTIDES_HUB_FAQS } from "@/lib/peptide-seo-faqs";
import { PEPTIDE_SCIENCE_VIDEOS } from "@/lib/peptide-topic-media";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import {
  RX_CONSULT_FEE_NOTE,
  RX_GLP1_COMPOUNDED_NOTICE,
  RX_PUBLIC_SERVICES,
  RX_SERVICE_NAV,
} from "@/lib/rx-public-marketing";
import { REGEN_MARKETING } from "@/lib/regen-brand";
import { REGEN_SHOP_SHIPPING_USD } from "@/lib/regen/shop-surface";
import {
  HOW_REGEN_WORKS_ARTICLE,
  WHAT_ARE_PEPTIDES_ARTICLE,
  WHAT_IS_GLP1_ARTICLE,
} from "@/lib/regen-learn-articles";
import { RX_CARE_TEXT_DISPLAY, RX_CARE_TEXT_SMS } from "@/lib/rx-contact";
import { SITE } from "@/lib/seo";
import { VITAMIN_SHOTS } from "@/lib/vitamin-bar";

const LEARN_HREF = "/rx/learn/what-are-peptides";
const CONSULT_HREF = "/rx/request";
const BOOK = PRIMARY_BOOKING_CTA.href;
const CALL = `tel:${SITE.phone.replace(/\D/g, "")}`;

const NAV = RX_SERVICE_NAV;

const LEARN_GUIDES = [WHAT_IS_GLP1_ARTICLE, WHAT_ARE_PEPTIDES_ARTICLE, HOW_REGEN_WORKS_ARTICLE] as const;

const PROGRAM_STEPS = [
  {
    n: "01",
    title: "Medical screening & labs",
    body: "A full intake and bloodwork review before any protocol is recommended.",
    tag: "Intake",
  },
  {
    n: "02",
    title: "Provider consult",
    body: `${MEDICAL_DIRECTOR.displayName} provides medical oversight; ${PRESCRIBING_NP.displayName} prescribes and manages your plan.`,
    tag: "Your NP",
  },
  {
    n: "03",
    title: "Personalized protocol",
    body: "If a prescription is appropriate, it is matched to your evaluation — not picked from a public menu.",
    tag: "Your plan",
  },
  {
    n: "04",
    title: "Ongoing follow-up",
    body: "Regular check-ins and dose review to keep your protocol working for you.",
    tag: "Stay on track",
  },
] as const;

const PREP_BEFORE = [
  "Complete the online intake — free to submit, no cart, no dose picker.",
  "List current medications, supplements, and recent labs if you have them.",
  "Write down your goal in one sentence: weight, recovery, sleep, vitality, or hormones.",
  "Plan pickup in Oswego or Illinois shipping once Ryan approves the protocol.",
] as const;

const PREP_DAY_OF = [
  "Arrive (or join telehealth) ready to talk history, not to pick a product off a shelf.",
  `${PRESCRIBING_NP.displayName} reviews your intake, asks follow-ups, and sets dose if you qualify.`,
  `A $${PEPTIDE_CONSULT_FEE_USD} consult fee reserves the visit — medication is billed only after approval.`,
  "You leave with a plan, a starting price, and a clear next step — not a guess.",
] as const;

const PREP_DONT = [
  "Don’t start peptides from another source without telling your provider.",
  "Don’t skip labs or follow-up visits once a protocol is underway.",
  "Don’t treat starting prices as a final invoice — dose sets the number.",
] as const;

const WELLNESS_IDS = ["biotin", "glutathione", "vitamin-d", "tri-immune"] as const;

/**
 * Public /rx landing — same cinematic system as Your Brow Journey:
 * black canvas, sticky in-page nav, video hero, pink trust bar, dark cards.
 */
export function PeptideTherapyPageContent() {
  const [navOpen, setNavOpen] = useState(false);
  const wellness = WELLNESS_IDS.map((id) => VITAMIN_SHOTS.find((s) => s.id === id)).filter(
    (s): s is (typeof VITAMIN_SHOTS)[number] => !!s,
  );

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
                Hello Gorgeous RX
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
          <div className="hidden items-center gap-7 text-[15px] lg:flex">
            {NAV.map((item) =>
              item.href.startsWith("#") ? (
                <a key={item.href} href={item.href} className="text-white/75 transition hover:text-white">
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className="text-white/75 transition hover:text-white">
                  {item.label}
                </Link>
              ),
            )}
            <JourneyPinkBtn href={BOOK} className="!px-5 !py-2.5 !text-[15px]">
              Book Now
            </JourneyPinkBtn>
          </div>
        </div>
        {navOpen ? (
          <div className="border-t border-white/10 px-6 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {NAV.map((item) =>
                item.href.startsWith("#") ? (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-white/85"
                    onClick={() => setNavOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-white/85"
                    onClick={() => setNavOpen(false)}
                  >
                    {item.label}
                  </Link>
                ),
              )}
              <JourneyPinkBtn href={BOOK} className="mt-2 w-full">
                Book Now
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
            <JourneyEyebrow>Hello Gorgeous RX · Oswego, IL</JourneyEyebrow>
            <h1 className="mt-4 font-serif text-[44px] font-bold leading-[1.02] text-white lg:text-[66px]">
              Medical consultations, <span className="text-[#FF2D8E]">not a peptide catalog</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80 lg:text-xl">
              Provider-led weight-management, hormone, sexual-wellness, hair, skin, and wellness
              consultations. Prescription therapy is offered only when {PRESCRIBING_NP.displayName}{" "}
              determines it is clinically appropriate.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <JourneyPinkBtn href={BOOK}>{PRIMARY_BOOKING_CTA.label}</JourneyPinkBtn>
              <JourneyGhostBtn href={RX_CARE_TEXT_SMS}>Text {RX_CARE_TEXT_DISPLAY}</JourneyGhostBtn>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                "NP-directed",
                PRESCRIBING_NP.displayName,
                `Pickup or $${REGEN_SHOP_SHIPPING_USD} IL ship`,
              ].map((chip) => (
                <JourneyChip key={chip}>{chip}</JourneyChip>
              ))}
            </div>
          </div>
          <JourneyVideoFrame
            src={PEPTIDE_SCIENCE_VIDEOS.rxHero}
            label="Hello Gorgeous RX — provider-led medical consultations"
            poster={REGEN_MARKETING.ogImage}
            className="lg:max-w-lg"
          />
        </div>
      </header>

      <RxLegalDisclaimer className="bg-[#1a0510] text-white/80 border-white/10" />

      <JourneyTrustBar />

      <section
        id="provider"
        className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24"
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
              Every RE GEN protocol is prescribed and managed by {PRESCRIBING_NP.displayName} — a
              board-certified family nurse practitioner with full Illinois prescriptive authority, on
              site six days a week in Oswego.
            </p>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-white/70">
              Medical oversight: {MEDICAL_DIRECTOR.displayName}. Nothing ships until Ryan reviews your
              history, sets your dose, and approves the plan.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["Weight management", "Hormones", "Wellness consults", "Labs first"].map((chip) => (
                <JourneyChip key={chip}>{chip}</JourneyChip>
              ))}
            </div>
            <blockquote className="mt-7 max-w-xl border-l-[3px] border-[#FF2D8E] pl-5 font-serif text-xl italic leading-snug text-white">
              “Treatment is individualized after evaluation — not picked from a public menu.”
            </blockquote>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <JourneyPinkBtn href={BOOK}>Book with Ryan</JourneyPinkBtn>
              <JourneyGhostBtn href={RX_CARE_TEXT_SMS}>Text {RX_CARE_TEXT_DISPLAY}</JourneyGhostBtn>
            </div>
          </div>
        </div>
      </section>

      <section
        id="founder"
        className="bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
          <div className="overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/images/brow-journey/founder-dani.png"
                alt="Danielle Alcala — Founder, Hello Gorgeous Med Spa"
                fill
                className="object-cover object-[center_22%]"
                sizes="(max-width: 1024px) 100vw, 380px"
              />
            </div>
          </div>
          <div>
            <JourneyEyebrow>A Note From Our Founder</JourneyEyebrow>
            <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight text-white lg:text-[44px]">
              Why I built <span className="text-[#FF2D8E]">Hello Gorgeous RX</span>
            </h2>
            <div className="mt-6 flex max-w-xl flex-col gap-4 text-[17px] leading-relaxed text-white/85">
              <p>
                When I built Hello Gorgeous, I knew our clients would eventually need more than a
                beautiful treatment room. They needed a provider who could sit with them, read their
                labs, and write a plan that actually fits their life.
              </p>
              <p>
                That&apos;s why Ryan is here — on site six days a week — and why Hello Gorgeous RX is
                consult-first. We advertise medical consultations, not a compounded-drug catalog.
                Nothing ships until he reviews your history and approves a plan.
              </p>
              <p>
                I want the same standard for your protocol that we hold for every brow, every laser,
                every visit: you leave feeling cared for, not sold to.
              </p>
            </div>
            <blockquote className="mt-6 max-w-xl border-l-[3px] border-[#FF2D8E] pl-5 font-serif text-[22px] italic leading-snug text-white">
              Real help, delivered by people who actually know you.
            </blockquote>
            <div className="mt-6 flex flex-wrap items-baseline gap-3.5">
              <span className="font-serif text-[28px] font-bold text-[#FF2D8E]">xoxo, Danielle Alcala</span>
              <span className="text-[13px] font-bold uppercase tracking-[0.16em] text-white/60">
                Founder, Hello Gorgeous Med Spa
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <JourneySectionHead
              eyebrow="A Smarter Approach"
              title="What is"
              titleAccent="peptide therapy?"
              description="Peptides are short chains of amino acids your body already uses as messengers. This page is education about a medical consultation — not a catalog of compounded drugs, doses, or disease claims."
            />
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-white/70">
              Every visit at Hello Gorgeous RX starts with a provider consult and medical screening.
              Prescription therapy is offered only when clinically appropriate.
            </p>
            <Link
              href={LEARN_HREF}
              className="mt-6 inline-block text-sm font-bold text-[#FF2D8E] underline decoration-[#FF2D8E]/40 underline-offset-4 hover:text-white"
            >
              Read our education guide →
            </Link>
          </div>
          <JourneyVideoFrame
            src={PEPTIDE_SCIENCE_VIDEOS.rxEducation}
            label="What are peptides — science animation, Hello Gorgeous RX"
            poster={REGEN_MARKETING.brandBanner}
          />
        </div>
      </section>

      <section id="consults" className="scroll-mt-24 px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            center
            eyebrow="Consultations"
            title="Medical services,"
            titleAccent="not a product menu."
          />
          <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RX_PUBLIC_SERVICES.map((item) => (
              <Link
                key={item.n}
                href={item.href}
                className="rounded-[20px] border border-white/14 bg-gradient-to-b from-[#140109] to-[#0a0206] p-6 transition hover:-translate-y-1 hover:border-[#FF2D8E]"
              >
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FF2D8E]">
                  {item.n}
                </p>
                <h3 className="mt-2 font-serif text-[22px] font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/70">{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow="Everyday Add-Ons"
            title="Vitamin Bar"
            titleAccent="shots"
            description="In-clinic wellness shots you can stack with a protocol. Pricing is confirmed at your visit."
          />
          <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {wellness.map((shot) => (
              <Link
                key={shot.id}
                href="/iv-shots"
                className="rounded-[20px] border border-white/14 bg-[#0a0206] p-5 transition hover:-translate-y-1 hover:border-[#FF2D8E]"
              >
                <h3 className="font-serif text-xl font-bold text-white">{shot.name}</h3>
                <p className="mt-2 text-sm leading-snug text-white/70">{shot.benefit}</p>
                <p className="mt-3 text-sm font-extrabold text-[#FF2D8E]">From ${shot.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="program"
        className="scroll-mt-24 bg-[radial-gradient(80%_90%_at_80%_0%,#12030c,#000_60%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow="Your Program"
            title="Built around your biology —"
            titleAccent="not guesswork"
            description={`Intake is free to submit. A $${PEPTIDE_CONSULT_FEE_USD} consult reserves your visit with ${PRESCRIBING_NP.displayName}.`}
          />
          <div className="relative mt-12">
            <div
              className="absolute bottom-2 left-[11px] top-2 hidden w-0.5 bg-gradient-to-b from-[#FF2D8E] to-[#FF2D8E]/15 lg:block"
              aria-hidden
            />
            <div className="space-y-10 lg:pl-10">
              {PROGRAM_STEPS.map((step) => (
                <div key={step.n} className="relative lg:pl-6">
                  <div
                    className="absolute -left-[34px] top-1 hidden h-6 w-6 rounded-full border-[3px] border-[#FF2D8E] bg-black shadow-[0_0_0_5px_rgba(255,45,142,0.14)] lg:block"
                    aria-hidden
                  />
                  <div className="font-serif text-2xl font-bold text-white">
                    {step.n} {step.title}{" "}
                    <span className="ml-3 inline-block rounded-full bg-[#FF2D8E] px-3 py-1 align-middle text-[11px] font-extrabold tracking-wider text-black">
                      {step.tag}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-base leading-relaxed text-white/72">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <JourneyPinkBtn href={BOOK}>Book your consult</JourneyPinkBtn>
          </div>
        </div>
      </section>

      <section id="prep" className="px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow="Before Your Consult"
            title="A little prep makes a"
            titleAccent="big difference"
            description="Come ready. Ryan can do his best work when your history, goals, and questions are already on the table."
          />
          <div className="mt-11 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[20px] border border-white/14 bg-[#0a0206] p-8">
              <h3 className="font-serif text-[22px] font-bold">In the days before</h3>
              <ul className="mt-4 space-y-3">
                {PREP_BEFORE.map((item) => (
                  <JourneyCheckItem key={item}>{item}</JourneyCheckItem>
                ))}
              </ul>
            </div>
            <div className="rounded-[20px] border border-white/14 bg-[#0a0206] p-8">
              <h3 className="font-serif text-[22px] font-bold">Day of your consult</h3>
              <ul className="mt-4 space-y-3">
                {PREP_DAY_OF.map((item) => (
                  <JourneyCheckItem key={item}>{item}</JourneyCheckItem>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[20px] border border-[#FF2D8E]/40 bg-gradient-to-b from-[#1a0510] to-[#0a0206] p-8">
              <h3 className="font-serif text-[22px] font-bold text-[#FF2D8E]">Please skip</h3>
              <ul className="mt-4 space-y-3">
                {PREP_DONT.map((item) => (
                  <li key={item} className="flex gap-3 text-[15.5px] leading-snug text-white/85">
                    <span className="shrink-0 font-black text-white/40">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[18px] bg-[#FFF5F9] p-7 text-black">
              <h4 className="font-serif text-xl font-bold">Trust the process</h4>
              <p className="mt-2 text-[15px] leading-relaxed text-black/75">
                Intake is free. The ${PEPTIDE_CONSULT_FEE_USD} consult reserves Ryan&apos;s time. Medication
                is invoiced only after he approves your protocol — pickup in Oswego or ship across
                Illinois for ${REGEN_SHOP_SHIPPING_USD}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="scroll-mt-24 bg-[radial-gradient(80%_90%_at_22%_0%,#12030c,#000_60%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            center
            eyebrow="Common Q & A"
            title="Your questions,"
            titleAccent="answered"
            description="Clear answers before you start intake. Still unsure? Book a consult."
          />
          <div className="mx-auto mt-11 flex max-w-[860px] flex-col gap-3">
            {PEPTIDES_HUB_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group overflow-hidden rounded-[14px] border border-white/14 bg-[#0a0206]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-serif text-lg font-bold text-white marker:content-none group-open:text-[#FF2D8E]">
                  {faq.question}
                  <span className="text-2xl font-normal text-[#FF2D8E] group-open:hidden">+</span>
                  <span className="hidden text-2xl font-normal text-[#FF2D8E] group-open:inline">
                    –
                  </span>
                </summary>
                <p className="px-6 pb-5 text-[15px] leading-relaxed text-white/72">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="scroll-mt-24 bg-[radial-gradient(80%_90%_at_80%_0%,#12030c,#000_60%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow="Pricing"
            title="Simple, honest"
            titleAccent="pricing"
            description={`${RX_CONSULT_FEE_NOTE} ${RX_GLP1_COMPOUNDED_NOTICE}`}
          />
          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article className="flex flex-col rounded-[20px] border border-[#FF2D8E]/50 bg-gradient-to-b from-[#140109] to-[#0a0206] p-7 transition hover:-translate-y-1 hover:border-[#FF2D8E]">
              <span className="self-start rounded-full bg-[#FF2D8E] px-3 py-1 text-[11px] font-extrabold tracking-wider text-black">
                INTAKE ALWAYS FREE
              </span>
              <h3 className="mt-4 font-serif text-2xl font-bold">NP consult</h3>
              <p className="mt-2 font-serif text-[44px] font-bold leading-none text-[#FF2D8E]">
                ${PEPTIDE_CONSULT_FEE_USD}
              </p>
              <p className="mt-1 text-[13px] text-white/55">reserves your visit · no cart</p>
              <ul className="mt-4 space-y-2">
                {[
                  "History, labs & goal review",
                  "Dose set by Ryan — not a dropdown",
                  "Medication billed only after approval",
                ].map((item) => (
                  <JourneyCheckItem key={item}>{item}</JourneyCheckItem>
                ))}
              </ul>
              <JourneyPinkBtn href={BOOK} className="mt-6 w-full">
                Book your consult
              </JourneyPinkBtn>
            </article>
            <article className="flex flex-col rounded-[20px] border border-white/14 bg-gradient-to-b from-[#140109] to-[#0a0206] p-7 transition hover:-translate-y-1 hover:border-[#FF2D8E]">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FF2D8E]">
                Medical weight loss
              </p>
              <h3 className="mt-2 font-serif text-2xl font-bold">GLP-1 programs</h3>
              <p className="mt-3 font-serif text-[44px] font-bold leading-none">
                ${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}
                <span className="ml-1 text-lg font-semibold text-white/50">/mo</span>
              </p>
              <p className="mt-1 text-[13px] text-white/55">
                Starting program fee · not a branded equivalent · confirmed at consult
              </p>
              <ul className="mt-4 space-y-2">
                {["Compounded GLP-1 is not FDA-approved", "Branded options discussed when they fit"].map((item) => (
                  <JourneyCheckItem key={item}>{item}</JourneyCheckItem>
                ))}
              </ul>
            </article>
            <article className="flex flex-col rounded-[20px] border border-white/14 bg-gradient-to-b from-[#140109] to-[#0a0206] p-7 transition hover:-translate-y-1 hover:border-[#FF2D8E]">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FF2D8E]">
                Prescription therapy
              </p>
              <h3 className="mt-2 font-serif text-2xl font-bold">When appropriate</h3>
              <p className="mt-3 font-serif text-[28px] font-bold leading-snug">Quoted at consult</p>
              <p className="mt-1 text-[13px] text-white/55">
                We do not publish a public compounded-peptide menu or cart.
              </p>
              <ul className="mt-4 space-y-2">
                {["Ryan decides if a prescription is appropriate", `Illinois shipping when medication ships`].map(
                  (item) => (
                    <JourneyCheckItem key={item}>{item}</JourneyCheckItem>
                  ),
                )}
              </ul>
            </article>
            <article className="flex flex-col justify-center rounded-[20px] border border-[#FF2D8E]/35 bg-gradient-to-b from-[#1a0510] to-[#0a0206] p-7 sm:col-span-2 lg:col-span-3">
              <p className="font-serif text-[22px] italic leading-snug text-white">
                Not sure which protocol is right for you?
              </p>
              <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-white/72">
                That&apos;s exactly what your consult is for. No pressure — only guidance from{" "}
                {PRESCRIBING_NP.displayName}.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <JourneyPinkBtn href={BOOK}>Book a consult</JourneyPinkBtn>
                <JourneyGhostBtn href={CONSULT_HREF}>Start intake</JourneyGhostBtn>
              </div>
            </article>
          </div>

          <div className="mt-6 grid gap-8 rounded-3xl border border-white/14 bg-[radial-gradient(90%_120%_at_85%_10%,#2a0820,#0a0206_70%)] p-8 lg:grid-cols-[1.35fr_0.65fr] lg:p-11">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF2D8E] text-base font-black text-black">
                  %
                </span>
                <span className="font-serif text-[22px] font-bold">Cherry</span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/55">
                  Financing Partner
                </span>
              </div>
              <h3 className="font-serif text-[32px] font-bold leading-tight lg:text-[38px]">
                Protocol set. <span className="text-[#FF2D8E] italic">Bills manageable.</span>
              </h3>
              <p className="mt-3 max-w-lg text-[17px] leading-relaxed text-white/80">
                Pay over time with <strong className="text-white">0% APR options</strong> through Cherry.
                Apply in seconds, see your options, and start the plan Ryan writes — no hard credit check
                to preview.
              </p>
              <div className="mt-5 flex flex-wrap gap-5 text-sm font-semibold">
                {["Apply in seconds", "High approval amounts", "True 0% APR options"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <span className="text-[#FF2D8E]">✓</span> {item}
                  </span>
                ))}
              </div>
              <JourneyPinkBtn href={CHERRY_PAY_URL} external className="mt-6">
                Apply with Cherry
              </JourneyPinkBtn>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-[18px] bg-white p-4">
                <Image
                  src="/images/brow-journey/cherry-qr.png"
                  alt="Scan to apply for Cherry financing"
                  width={170}
                  height={170}
                />
              </div>
              <p className="text-center text-[13px] font-bold tracking-wide text-white/70">
                Scan to apply in seconds
              </p>
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-[11.5px] leading-relaxed text-white/42">
            Payment options through Cherry are issued by Cherry financing partners. Term length, approval
            amount, 0% APR and other promotional rates are subject to eligibility. Starting prices are
            not a final invoice — dose is set at consult.
          </p>
        </div>
      </section>

      <section id="learn" className="bg-[radial-gradient(80%_90%_at_18%_0%,#12030c,#000_60%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow="RE GEN Learn"
            title="Guides &"
            titleAccent="explainers"
            description="Clear education before you start intake — reviewed by our NP, written for real questions."
          />
          <div className="mt-11 grid gap-6 lg:grid-cols-3">
            {LEARN_GUIDES.map((post) => (
              <Link
                key={post.slug}
                href={post.path}
                className="flex flex-col overflow-hidden rounded-[20px] border border-white/14 bg-gradient-to-b from-[#140109] to-[#0a0206] transition hover:-translate-y-1 hover:border-[#FF2D8E]"
              >
                <div className="relative h-[190px] w-full bg-black">
                  <Image
                    src={post.heroImage}
                    alt={post.heroImageAlt}
                    fill
                    className="object-contain p-6"
                    sizes="33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FF2D8E]">
                    {post.category}
                  </p>
                  <h3 className="mt-2 font-serif text-[23px] font-bold leading-snug">{post.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-snug text-white/70">{post.subtitle}</p>
                  <span className="mt-auto pt-4 text-sm font-bold text-[#FF2D8E]">Read the guide →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[radial-gradient(80%_120%_at_50%_0%,#2a0820,#000_70%)] px-6 py-20 text-center lg:py-24">
        <JourneyEyebrow>Start Your Protocol</JourneyEyebrow>
        <h2 className="mt-3 font-serif text-[36px] font-bold leading-tight lg:text-[52px]">
          Ready to build <span className="text-[#FF2D8E]">your protocol?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/80">
          Intake is free. {PRESCRIBING_NP.displayName} sets your plan. Nothing ships until he approves
          it — serving Oswego, Naperville, Aurora, Plainfield, Yorkville & Montgomery, IL.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <JourneyPinkBtn href={BOOK}>{PRIMARY_BOOKING_CTA.label}</JourneyPinkBtn>
          <JourneyGhostBtn href={RX_CARE_TEXT_SMS}>Text {RX_CARE_TEXT_DISPLAY}</JourneyGhostBtn>
          <JourneyGhostBtn href={CALL}>Call {SITE.phone}</JourneyGhostBtn>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-12">
        <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-8">
          <div>
            <p className="font-serif text-[22px] font-bold">Hello Gorgeous RX</p>
            <p className="mt-2 text-[15px] leading-relaxed text-white/70">
              74 W. Washington Street, Oswego, IL 60543
              <br />
              {SITE.phone} · hellogorgeousmedspa.com
            </p>
            <p className="mt-2 font-serif italic text-white/80">&ldquo;{SITE.tagline}&rdquo;</p>
          </div>
          <p className="max-w-md text-[13px] leading-relaxed text-white/45">
            NP-directed by {PRESCRIBING_NP.displayName} under Medical Director{" "}
            {MEDICAL_DIRECTOR.displayName}. Provider-led peptide and wellness consultations are
            available. Treatment recommendations are individualized after a medical evaluation.
            Prescription therapies are offered only when clinically appropriate. Compounded
            medications are not FDA-approved. Fees for routine professional services may be
            adjusted. No outcome is guaranteed.
          </p>
        </div>
      </footer>
    </div>
  );
}
