"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { RegenBannerLogo } from "@/components/regen/RegenLogo";
import { RxLegalDisclaimer } from "@/components/rx/RxLegalDisclaimer";
import { CHERRY_PAY_URL } from "@/lib/flows";
import { GLP1_RETAIL_PROGRAM } from "@/lib/glp1-program-pricing";
import { MEDICAL_DIRECTOR, PRESCRIBING_NP } from "@/lib/medical-authority";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { PEPTIDES_HUB_FAQS } from "@/lib/peptide-seo-faqs";
import { PEPTIDE_SCIENCE_VIDEOS } from "@/lib/peptide-topic-media";
import { REGEN_BRAND, REGEN_MARKETING } from "@/lib/regen-brand";
import { REGEN_SHOP_SHIPPING_USD } from "@/lib/regen/shop-surface";
import { RX_CARE_TEXT_DISPLAY, RX_CARE_TEXT_SMS } from "@/lib/rx-contact";
import {
  RX_CONSULT_FEE_NOTE,
  RX_GLP1_COMPOUNDED_NOTICE,
  RX_JOURNEY_STEPS,
  RX_PUBLIC_DISCLAIMER_LONG,
  RX_PUBLIC_SERVICES,
  RX_SERVICE_NAV,
} from "@/lib/rx-public-marketing";
import { SITE } from "@/lib/seo";
import { VITAMIN_SHOTS } from "@/lib/vitamin-bar";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

const INTAKE = "/rx/request";
const BOOK = "/book";
const CALL = `tel:${SITE.phone.replace(/\D/g, "")}`;
const WELLNESS_IDS = ["biotin", "glutathione", "vitamin-d", "tri-immune"] as const;

/**
 * Hello Gorgeous RX / RE GEN flagship — CVS-style journey, HG stamp cards.
 * Advertises medical consultations, not a compounded-peptide catalog.
 */
export function PeptideTherapyPageContent() {
  const [navOpen, setNavOpen] = useState(false);
  const wellness = WELLNESS_IDS.map((id) => VITAMIN_SHOTS.find((s) => s.id === id)).filter(
    (s): s is (typeof VITAMIN_SHOTS)[number] => !!s,
  );

  return (
    <div className="relative min-h-[100dvh] font-sans text-black">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${BRAND.pinkHot}22 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 0% 70%, ${BRAND.pink}18 0%, transparent 45%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 35%, #fafafa 100%)
          `,
        }}
      />

      <nav className="sticky top-0 z-40 border-b-4 border-black bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-2.5 md:px-6">
          <RegenBannerLogo width={168} priority />
          <button
            type="button"
            className="rounded-lg border-2 border-black px-3 py-1.5 text-sm font-bold lg:hidden"
            onClick={() => setNavOpen((o) => !o)}
            aria-expanded={navOpen}
            aria-label="Toggle menu"
          >
            Menu
          </button>
          <div className="hidden items-center gap-6 text-sm font-semibold lg:flex">
            {RX_SERVICE_NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-black/70 transition hover:text-[#E6007E]">
                {item.label}
              </a>
            ))}
            <CTA href={BOOK} variant="gradient" className="!px-6 !py-2.5 !text-[13px]">
              Book consult
            </CTA>
          </div>
        </div>
        {navOpen ? (
          <div className="border-t-4 border-black px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {RX_SERVICE_NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-semibold text-black/80"
                  onClick={() => setNavOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <CTA href={BOOK} variant="gradient">
                Book consult
              </CTA>
            </div>
          </div>
        ) : null}
      </nav>

      <Section className="relative border-b-4 border-black py-16 lg:py-24 !px-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background: `radial-gradient(circle at 20% 30%, ${BRAND.pink} 0%, transparent 45%),
              radial-gradient(circle at 85% 20%, ${BRAND.pinkHot} 0%, transparent 40%),
              radial-gradient(circle at 70% 80%, ${BRAND.pink}33 0%, transparent 35%)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

        <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-10 px-4 md:px-6 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#E6007E]" aria-hidden />
              {REGEN_BRAND.name} · Hello Gorgeous RX
            </div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#FFB8DC] md:text-sm">
              Oswego · Naperville · Aurora · Plainfield · Yorkville
            </p>
            <h1 className="mt-4 font-black text-4xl leading-tight text-white drop-shadow-lg md:text-6xl">
              One place for{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                medically supervised
              </span>{" "}
              care
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
              Book a ${PEPTIDE_CONSULT_FEE_USD} consult with {PRESCRIBING_NP.displayName}. Treatment is
              individualized after evaluation. Prescription therapy — including peptide or GLP-1 care —
              is offered only when clinically appropriate.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <CTA href={BOOK} variant="gradient" className="shadow-[0_8px_32px_-4px_rgba(230,0,126,0.55)]">
                Book ${PEPTIDE_CONSULT_FEE_USD} consult
              </CTA>
              <CTA
                href={INTAKE}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black"
              >
                Start intake
              </CTA>
            </div>
            <p className="mt-4 text-sm text-[#FFB8DC]">
              Or text{" "}
              <a href={RX_CARE_TEXT_SMS} className="font-bold underline decoration-[#E6007E] underline-offset-4">
                {RX_CARE_TEXT_DISPLAY}
              </a>
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <video
              className="aspect-[4/3] w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={REGEN_MARKETING.ogImage}
              aria-label="RE GEN by Hello Gorgeous RX"
            >
              <source src={PEPTIDE_SCIENCE_VIDEOS.rxHero} type="video/mp4" />
            </video>
          </div>
        </div>
      </Section>

      <RxLegalDisclaimer className="border-b-4 border-black" />

      <Section className="!py-10 border-b-4 border-black bg-white/70 backdrop-blur-sm">
        <nav aria-label="Hello Gorgeous RX topics" className="mx-auto max-w-5xl px-4 md:px-6">
          <p className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black">
            <span className="text-[#E6007E]" aria-hidden>
              ✦
            </span>
            Jump to a section
          </p>
          <ul className="flex flex-wrap gap-2">
            {RX_SERVICE_NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex rounded-full border-2 border-black bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-sm font-bold transition hover:border-[#E6007E] hover:text-[#E6007E]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <Section id="consults" className="scroll-mt-28 border-b-4 border-black bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">Consultations</p>
            <h2 className="mt-2 font-black text-3xl text-black md:text-5xl">
              Choose a <span className="text-[#E6007E]">medical service</span>
            </h2>
            <p className="mt-3 max-w-2xl text-lg font-medium text-black/70">
              Goal-based visits — not a public catalog of compounded drugs. {PRESCRIBING_NP.displayName}{" "}
              decides what, if anything, is prescribed.
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RX_PUBLIC_SERVICES.map((item) => (
              <Link
                key={item.n}
                href={item.href}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] transition hover:-translate-y-1"
              >
                <div className="relative h-40 w-full bg-[#FFF0F7]">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="inline-flex w-fit rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-2.5 py-1 text-[11px] font-black text-white">
                    {item.n}
                  </span>
                  <h3 className="mt-3 font-black text-xl leading-snug text-black">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-black/70">{item.body}</p>
                  <span className="mt-4 text-sm font-black text-[#E6007E]">Start this consult →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="how"
        className="scroll-mt-28 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">How it works</p>
            <h2 className="mt-2 font-black text-3xl text-black md:text-5xl">
              Here for you <span className="text-[#E6007E]">every step</span>
            </h2>
          </FadeUp>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {RX_JOURNEY_STEPS.map((step) => (
              <article
                key={step.n}
                className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
              >
                <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-sm font-black text-white">
                  {step.n}
                </span>
                <h3 className="mt-4 font-black text-xl text-black">{step.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-black/70">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section id="provider" className="scroll-mt-28 border-b-4 border-black bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 md:px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
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
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">Your NP</p>
            <h2 className="mt-2 font-black text-3xl text-black md:text-5xl">
              Ryan <span className="text-[#E6007E]">Kent, FNP-BC</span>
            </h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-black/50">
              {PRESCRIBING_NP.roleLine}
            </p>
            <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-black/80">
              Every RE GEN plan is prescribed and managed by {PRESCRIBING_NP.displayName} — on site
              six days a week in Oswego. Medical oversight: {MEDICAL_DIRECTOR.displayName}.
            </p>
            <p className="mt-4 max-w-xl font-medium leading-relaxed text-black/70">
              Nothing ships until he reviews your history and decides a prescription is clinically
              appropriate. That is the visit — not a cart.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <CTA href={BOOK} variant="gradient">
                Book with Ryan
              </CTA>
              <a
                href={RX_CARE_TEXT_SMS}
                className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-[#E6007E] px-10 py-4 text-sm font-semibold uppercase tracking-widest text-[#E6007E] transition hover:bg-[#E6007E] hover:text-white"
              >
                Text {RX_CARE_TEXT_DISPLAY}
              </a>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section
        id="glp1"
        className="scroll-mt-28 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">Weight management</p>
            <h2 className="mt-2 font-black text-3xl text-black md:text-5xl">
              Understanding <span className="text-[#E6007E]">GLP-1</span> care
            </h2>
            <p className="mt-4 max-w-3xl text-lg font-medium leading-relaxed text-black/75">
              GLP-1 is a hormone your body already makes. Some FDA-approved medications mimic that
              pathway for weight management. Brand examples, when they fit, include Wegovy® and
              Zepbound®. {RX_GLP1_COMPOUNDED_NOTICE}
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              {
                title: "Check candidacy",
                body: "A medical evaluation comes first. GLP-1 therapy is not appropriate for everyone.",
              },
              {
                title: "Review options",
                body: "Your NP discusses branded medications and, when clinically justified, a patient-specific compounded alternative — never as a generic or a brand equivalent.",
              },
              {
                title: "Follow-up",
                body: "If a plan is approved, you pick up in Oswego or ship in Illinois. Check-ins stay with Ryan.",
              },
            ].map((card, i) => (
              <article
                key={card.title}
                className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
              >
                <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-[11px] font-black text-white">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-black text-xl text-black">{card.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-black/70">{card.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm font-medium text-black/55">
            When a compounded GLP-1 program is prescribed, published starting fees begin at $
            {GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo. That is not a branded copay and not a promise
            of a specific product. Confirm at consult.
          </p>
        </div>
      </Section>

      <Section id="peptides" className="scroll-mt-28 border-b-4 border-black bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 md:px-6 lg:grid-cols-2">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">Peptide consultations</p>
            <h2 className="mt-2 font-black text-3xl text-black md:text-5xl">
              What <span className="text-[#E6007E]">peptide therapy</span> means here
            </h2>
            <p className="mt-4 text-lg font-medium leading-relaxed text-black/75">
              Peptides are short chains of amino acids your body already uses as messengers. This page
              is a medical consultation — not a menu of named compounded drugs, doses, or disease
              claims.
            </p>
            <p className="mt-4 font-medium leading-relaxed text-black/70">
              After evaluation, {PRESCRIBING_NP.displayName} may recommend a prescription, another
              service, or no medication. Compounded medications are not FDA-approved.
            </p>
            <Link
              href="/rx/learn/what-are-peptides"
              className="mt-6 inline-block text-sm font-black text-[#E6007E] underline decoration-[#E6007E]/40 underline-offset-4 hover:text-black"
            >
              Read the education guide →
            </Link>
          </FadeUp>
          <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <video
              className="aspect-video w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={REGEN_MARKETING.brandBanner}
              aria-label="What peptides are — education animation, Hello Gorgeous RX"
            >
              <source src={PEPTIDE_SCIENCE_VIDEOS.rxEducation} type="video/mp4" />
            </video>
          </div>
        </div>
      </Section>

      <Section className="border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">In clinic</p>
            <h2 className="mt-2 font-black text-3xl text-black md:text-4xl">
              Vitamin Bar <span className="text-[#E6007E]">shots</span>
            </h2>
            <p className="mt-3 max-w-2xl font-medium text-black/70">
              Walk-in wellness shots at our Oswego Vitamin Bar — a clinic service, not a prescription
              peptide cart. Pricing is confirmed at your visit.
            </p>
          </FadeUp>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {wellness.map((shot) => (
              <Link
                key={shot.id}
                href="/iv-shots"
                className="rounded-3xl border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] transition hover:-translate-y-1"
              >
                <h3 className="font-black text-lg text-black">{shot.name}</h3>
                <p className="mt-2 text-sm font-medium text-black/70">{shot.benefit}</p>
                <p className="mt-3 text-sm font-black text-[#E6007E]">From ${shot.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="pricing"
        className="scroll-mt-28 border-b-4 border-black bg-white py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">Consult fee</p>
            <h2 className="mt-2 font-black text-3xl text-black md:text-5xl">
              Simple, honest <span className="text-[#E6007E]">pricing</span>
            </h2>
            <p className="mt-4 max-w-3xl font-medium leading-relaxed text-black/70">
              {RX_CONSULT_FEE_NOTE}
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <article className="flex flex-col rounded-3xl border-4 border-black bg-white p-7 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <span className="w-fit rounded-full border-2 border-black bg-[#FF2D8E] px-3 py-1 text-[11px] font-black tracking-wider text-black">
                INTAKE ALWAYS FREE
              </span>
              <h3 className="mt-4 font-black text-2xl">NP consult</h3>
              <p className="mt-2 font-black text-5xl leading-none text-[#E6007E]">
                ${PEPTIDE_CONSULT_FEE_USD}
              </p>
              <p className="mt-2 text-sm font-medium text-black/55">Reserves your visit · fees may be adjusted</p>
              <CTA href={BOOK} variant="gradient" className="mt-6">
                Book your consult
              </CTA>
            </article>
            <article className="flex flex-col rounded-3xl border-4 border-black bg-white p-7 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#E6007E]">
                Medical weight loss
              </p>
              <h3 className="mt-2 font-black text-2xl">GLP-1 programs</h3>
              <p className="mt-3 font-black text-4xl leading-none">
                From ${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}
                <span className="ml-1 text-lg font-semibold text-black/45">/mo</span>
              </p>
              <p className="mt-2 text-sm font-medium text-black/55">
                Starting program fee if prescribed · not a branded equivalent · confirmed at consult
              </p>
            </article>
            <article className="flex flex-col rounded-3xl border-4 border-black bg-white p-7 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#E6007E]">
                Prescription therapy
              </p>
              <h3 className="mt-2 font-black text-2xl">When appropriate</h3>
              <p className="mt-3 font-black text-3xl leading-snug">Quoted at consult</p>
              <p className="mt-2 text-sm font-medium text-black/55">
                We do not publish a public compounded-peptide menu or cart. Illinois shipping $
                {REGEN_SHOP_SHIPPING_USD} when medication ships.
              </p>
            </article>
          </div>
          <div className="mt-8 rounded-3xl border-4 border-black bg-[#FFF0F7] p-6 md:p-8">
            <h3 className="font-black text-xl">Pay over time with Cherry</h3>
            <p className="mt-2 max-w-2xl font-medium text-black/70">
              After Ryan writes a plan, eligible patients can preview 0% APR options. Apply in
              seconds — no hard credit check to preview.
            </p>
            <CTA href={CHERRY_PAY_URL} variant="gradient" className="mt-5">
              Apply with Cherry
            </CTA>
          </div>
        </div>
      </Section>

      <Section
        id="faq"
        className="scroll-mt-28 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[860px] px-4 md:px-6">
          <h2 className="text-center font-black text-3xl text-black md:text-5xl">
            Your questions, <span className="text-[#E6007E]">answered</span>
          </h2>
          <div className="mt-10 flex flex-col gap-3">
            {PEPTIDES_HUB_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-bold text-[#E6007E] marker:content-none">
                  <span>
                    <span aria-hidden>▸ </span>
                    {faq.question}
                  </span>
                  <span className="text-2xl font-normal group-open:hidden">+</span>
                  <span className="hidden text-2xl font-normal group-open:inline">–</span>
                </summary>
                <p className="px-6 pb-5 font-medium leading-relaxed text-black/85">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      <section
        className="relative overflow-hidden border-b-4 border-black px-4 py-20 text-center text-white lg:py-24"
        style={{ background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative mx-auto max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Start here</p>
          <h2 className="mt-3 font-black text-4xl leading-tight lg:text-5xl">
            Ready for your consult?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/90">
            Intake is free. {PRESCRIBING_NP.displayName} sets the plan. Nothing ships until he
            approves it.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <CTA href={BOOK} variant="white">
              Book ${PEPTIDE_CONSULT_FEE_USD} consult
            </CTA>
            <CTA href={INTAKE} variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black">
              Start intake
            </CTA>
          </div>
        </div>
      </section>

      <footer className="bg-white px-4 py-12 md:px-6">
        <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-8">
          <div>
            <p className="font-black text-xl">Hello Gorgeous RX · {REGEN_BRAND.name}</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-black/70">
              74 W. Washington Street, Oswego, IL 60543
              <br />
              <a href={CALL} className="underline decoration-[#E6007E] underline-offset-2">
                {SITE.phone}
              </a>{" "}
              · hellogorgeousmedspa.com
            </p>
          </div>
          <p className="max-w-lg text-[12px] leading-relaxed text-black/50">{RX_PUBLIC_DISCLAIMER_LONG}</p>
        </div>
      </footer>
    </div>
  );
}
