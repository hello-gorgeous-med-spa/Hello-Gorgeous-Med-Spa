"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { HG_RX_TELEHEALTH_BOOKING_URL } from "@/lib/flows";
import {
  RX_PATIENT_CARE_ADDON_GROUPS,
  RX_PATIENT_CARE_GUIDES,
  RX_PATIENT_CARE_HERO,
  RX_PATIENT_CARE_JOURNEY,
  RX_PATIENT_CARE_PATHS,
  RX_PATIENT_CARE_SECTIONS,
  RX_PATIENT_CARE_TRUST,
  rxCareAddonPriceLabel,
  type RxCareCard,
} from "@/lib/rx-patient-care-hub";
import { SITE } from "@/lib/seo";

function IconTagBadge({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="hidden shrink-0 flex-col items-center justify-center gap-2 border-l border-black/8 bg-[#FFFBFC] px-5 py-4 text-center sm:flex md:px-6">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0F7] text-2xl shadow-inner ring-2 ring-[#E6007E]/15">
        {emoji}
      </span>
      <span className="max-w-[88px] text-[10px] font-bold uppercase leading-tight tracking-wide text-[#E6007E]">
        {label}
      </span>
    </div>
  );
}

function ServiceRow({ card }: { card: RxCareCard }) {
  const body = (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:border-[#E6007E]/35 hover:shadow-[0_16px_48px_rgba(230,0,126,0.14)] sm:flex-row sm:items-stretch">
      {card.image ? (
        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#FFF0F7] sm:w-36 md:w-40 lg:w-44">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.image}
            alt={card.imageAlt ?? card.title}
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            width={480}
            height={480}
          />
        </div>
      ) : (
        <div className="flex aspect-square w-full shrink-0 items-center justify-center bg-[#FFF0F7] text-4xl sm:w-36 md:w-40 lg:w-44">
          {card.icon}
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {card.badge && (
            <span className="rounded-full bg-[#FFF0F7] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#E6007E]">
              {card.badge}
            </span>
          )}
          {card.priceHint && (
            <span className="text-xs font-semibold text-[#E6007E]">{card.priceHint}</span>
          )}
        </div>
        <h3 className="mt-1 text-lg font-bold text-black group-hover:text-[#E6007E]">{card.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-black/65">{card.description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#E6007E]">
          {card.cta}
          <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
            →
          </span>
        </span>
      </div>
      {card.iconTag && <IconTagBadge emoji={card.iconTag.emoji} label={card.iconTag.label} />}
    </div>
  );

  if (card.external) {
    return (
      <a href={card.href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {body}
      </a>
    );
  }
  return (
    <Link href={card.href} className="block h-full">
      {body}
    </Link>
  );
}

export function RxPatientCareHubContent() {
  const [activePath, setActivePath] = useState<(typeof RX_PATIENT_CARE_PATHS)[number]["id"]>("refills");
  const [journeyStep, setJourneyStep] = useState(0);
  const [selectedAddon, setSelectedAddon] = useState<string | null>(null);
  const [guideFilter, setGuideFilter] = useState("All");

  const guideTags = ["All", ...Array.from(new Set(RX_PATIENT_CARE_GUIDES.map((g) => g.tag)))];
  const filteredGuides =
    guideFilter === "All"
      ? RX_PATIENT_CARE_GUIDES
      : RX_PATIENT_CARE_GUIDES.filter((g) => g.tag === guideFilter);

  const selectedAddonCard = RX_PATIENT_CARE_ADDON_GROUPS.flatMap((g) => g.cards).find(
    (a) => a.id === selectedAddon,
  );

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const selectPath = useCallback(
    (id: (typeof RX_PATIENT_CARE_PATHS)[number]["id"]) => {
      setActivePath(id);
      scrollTo(id);
    },
    [scrollTo],
  );

  const activeJourney = RX_PATIENT_CARE_JOURNEY[journeyStep];

  return (
    <div className="min-h-[100dvh] bg-[#FFFBFC]">
      {/* ── Hero: light, Hers-style ── */}
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:gap-14 md:py-16 lg:px-6">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#E6007E]">
              {RX_PATIENT_CARE_HERO.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight text-black md:text-5xl lg:text-[3.25rem]">
              {RX_PATIENT_CARE_HERO.title}{" "}
              <span className="text-[#E6007E]">{RX_PATIENT_CARE_HERO.titleAccent}</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-black/70 md:text-lg">
              {RX_PATIENT_CARE_HERO.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTA href={RX_PATIENT_CARE_HERO.primaryCta.href} variant="gradient" className="px-8 py-3.5">
                {RX_PATIENT_CARE_HERO.primaryCta.label}
              </CTA>
              <CTA
                href={RX_PATIENT_CARE_HERO.secondaryCta.href}
                variant="outline"
                className="border-black/20 px-8 py-3.5 text-black hover:border-[#E6007E] hover:text-[#E6007E]"
              >
                {RX_PATIENT_CARE_HERO.secondaryCta.label}
              </CTA>
            </div>
            <p className="mt-6 text-sm text-black/50">
              Questions?{" "}
              <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="font-semibold text-[#E6007E] hover:underline">
                {SITE.phone}
              </a>
            </p>
          </FadeUp>

          <FadeUp delayMs={80}>
            <div className="relative mx-auto max-w-md md:max-w-none">
              <div className="overflow-hidden rounded-3xl bg-[#f0ebe8] shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={RX_PATIENT_CARE_HERO.heroImage}
                  alt={RX_PATIENT_CARE_HERO.heroImageAlt}
                  className="aspect-[4/3] w-full object-cover object-center"
                  width={1024}
                  height={682}
                  fetchPriority="high"
                />
              </div>
              <div className="absolute -bottom-4 left-4 right-4 flex flex-wrap gap-2 sm:left-6 sm:right-6">
                {RX_PATIENT_CARE_TRUST.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-black/10 bg-white/95 px-3 py-1 text-[11px] font-semibold text-black/75 shadow-sm backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Path picker — primary navigation */}
      <div className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 lg:px-6">
          {RX_PATIENT_CARE_PATHS.map((path) => (
            <button
              key={path.id}
              type="button"
              onClick={() => selectPath(path.id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activePath === path.id
                  ? "bg-[#E6007E] text-white shadow-md"
                  : "bg-[#FFF0F7] text-black/70 hover:bg-[#FFE0F0] hover:text-[#E6007E]"
              }`}
            >
              {path.label}
            </button>
          ))}
        </div>
      </div>

      {/* How it works — horizontal stepper */}
      <Section id="journey" className="scroll-mt-24 border-b border-black/10 bg-white !py-14">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-2xl font-bold text-black md:text-3xl">How refills work</h2>
            <p className="mt-2 max-w-xl text-sm text-black/60 md:text-base">
              Four steps from request to doorstep — most patients complete the form in minutes.
            </p>
          </FadeUp>

          <div className="mt-10 hidden md:grid md:grid-cols-4 md:gap-0">
            {RX_PATIENT_CARE_JOURNEY.map((step, idx) => {
              const active = journeyStep === idx;
              const done = journeyStep > idx;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setJourneyStep(idx)}
                  className="group relative flex flex-col items-start px-2 text-left"
                >
                  {idx < RX_PATIENT_CARE_JOURNEY.length - 1 && (
                    <span
                      className={`absolute left-8 top-4 h-0.5 w-[calc(100%-2rem)] ${
                        done ? "bg-[#E6007E]" : "bg-black/10"
                      }`}
                      aria-hidden
                    />
                  )}
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

          <div className="mt-8 rounded-2xl border border-black/10 bg-[#FFFBFC] p-6 md:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">
              Step {activeJourney.step} of {RX_PATIENT_CARE_JOURNEY.length}
            </p>
            <h3 className="mt-2 text-xl font-bold text-black md:text-2xl">{activeJourney.title}</h3>
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
              ) : (
                <Link
                  href={activeJourney.href}
                  className="inline-flex rounded-full bg-[#E6007E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#C90A68]"
                >
                  {activeJourney.cta}
                </Link>
              )}
              {journeyStep < RX_PATIENT_CARE_JOURNEY.length - 1 && (
                <button
                  type="button"
                  onClick={() => setJourneyStep((s) => s + 1)}
                  className="rounded-full border border-black/15 px-6 py-2.5 text-sm font-semibold text-black/70 hover:border-[#E6007E]/40"
                >
                  Next step
                </button>
              )}
            </div>
          </div>

          {/* Mobile step dots */}
          <div className="mt-4 flex justify-center gap-2 md:hidden">
            {RX_PATIENT_CARE_JOURNEY.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Step ${idx + 1}`}
                onClick={() => setJourneyStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  journeyStep === idx ? "w-8 bg-[#E6007E]" : "w-2 bg-black/15"
                }`}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Refill + new patient rows */}
      {RX_PATIENT_CARE_SECTIONS.map((section) => (
        <Section
          key={section.id}
          id={section.id}
          className={`scroll-mt-24 border-b border-black/10 !py-14 ${
            activePath !== section.id && activePath !== "add-ons" && activePath !== "guides"
              ? ""
              : ""
          } ${section.id === "refills" ? "bg-[#FFFBFC]" : "bg-white"}`}
        >
          <div className="mx-auto max-w-6xl">
            <FadeUp>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E6007E]">{section.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-bold text-black md:text-3xl">{section.title}</h2>
              <p className="mt-2 max-w-2xl text-sm text-black/60 md:text-base">{section.description}</p>
            </FadeUp>
            <div className="mt-8 flex flex-col gap-4">
              {section.cards.map((card, idx) => (
                <FadeUp key={card.id} delayMs={40 * idx}>
                  <ServiceRow card={card} />
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>
      ))}

      {/* Add-ons — light, clean compare cards */}
      <Section id="add-ons" className="scroll-mt-24 border-b border-black/10 bg-[#FFF0F7]/50 !py-14">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-2xl font-bold text-black md:text-3xl">Monthly add-ons</h2>
            <p className="mt-2 max-w-2xl text-sm text-black/60 md:text-base">
              Stack NAD+ or Sermorelin with your GLP-1 refill. Select on{" "}
              <Link href="/glp1-refill#monthly-add-ons" className="font-semibold text-[#E6007E] underline underline-offset-2">
                step 3 of the refill form
              </Link>
              .
            </p>
          </FadeUp>

          {RX_PATIENT_CARE_ADDON_GROUPS.map((group) => (
            <div key={group.group} className="mt-10">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-black/45">{group.title}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.cards.map((addon) => {
                  const selected = selectedAddon === addon.id;
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => setSelectedAddon(selected ? null : addon.id)}
                      className={`group flex w-full flex-col overflow-hidden rounded-2xl border bg-white text-left transition sm:flex-row sm:items-stretch ${
                        selected
                          ? "border-[#E6007E] ring-2 ring-[#E6007E]/25 shadow-[0_8px_30px_rgba(230,0,126,0.15)]"
                          : "border-black/10 shadow-sm hover:border-[#E6007E]/30 hover:shadow-md"
                      }`}
                    >
                      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#FFF0F7] sm:w-32 md:w-36">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={addon.image}
                          alt={addon.imageAlt}
                          className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                          width={480}
                          height={480}
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-black group-hover:text-[#E6007E]">{addon.title}</h4>
                          <span className="shrink-0 rounded-lg bg-[#FFF0F7] px-2 py-1 text-sm font-bold text-[#E6007E]">
                            {rxCareAddonPriceLabel(addon.monthlyUsd)}
                          </span>
                        </div>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-black/65">{addon.description}</p>
                        {selected && (
                          <p className="mt-3 text-xs font-semibold text-[#E6007E]">✓ Selected — add on refill form</p>
                        )}
                      </div>
                      <IconTagBadge emoji={addon.iconTag.emoji} label={addon.iconTag.label} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {selectedAddonCard && (
            <div className="mt-8 flex justify-center">
              <Link
                href={selectedAddonCard.href}
                className="inline-flex items-center gap-2 rounded-full bg-[#E6007E] px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-[#C90A68]"
              >
                Add {selectedAddonCard.title} on refill form →
              </Link>
            </div>
          )}
        </div>
      </Section>

      {/* Guides */}
      <Section id="guides" className="scroll-mt-24 border-b border-black/10 bg-white !py-14">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-2xl font-bold text-black md:text-3xl">Patient guides</h2>
            <p className="mt-2 text-sm text-black/60">Injection technique, dosing charts, and program info.</p>
          </FadeUp>

          <div className="mt-6 flex flex-wrap gap-2">
            {guideTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setGuideFilter(tag)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  guideFilter === tag
                    ? "bg-black text-white"
                    : "bg-[#FFF0F7] text-black/65 hover:text-[#E6007E]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGuides.map((guide) => (
              <a
                key={guide.id}
                href={guide.href}
                target={guide.external ? "_blank" : undefined}
                rel={guide.external ? "noopener noreferrer" : undefined}
                className="group flex items-start gap-3 rounded-xl border border-black/10 bg-[#FFFBFC] p-4 transition hover:border-[#E6007E]/30 hover:bg-white hover:shadow-sm"
              >
                <span className="text-xl">{guide.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-black group-hover:text-[#E6007E]">{guide.title}</p>
                  <p className="mt-0.5 text-xs text-black/55">{guide.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* Help */}
      <Section id="help" className="scroll-mt-24 !py-14">
        <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-[#E6007E] to-[#9b0a4d] px-6 py-12 text-center text-white md:px-12">
          <h2 className="text-2xl font-bold md:text-3xl">Need help?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/85 md:text-base">
            Book telehealth, call the spa, or open the client app — same links, no runaround.
          </p>
          <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row">
            <a
              href={HG_RX_TELEHEALTH_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#E6007E] hover:bg-[#FFF0F7]"
            >
              Book telehealth
            </a>
            <Link
              href="/app"
              className="inline-flex rounded-full border-2 border-white/80 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Client app
            </Link>
            <a
              href={`tel:${SITE.phone.replace(/-/g, "")}`}
              className="inline-flex rounded-full border-2 border-white/80 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {SITE.phone}
            </a>
          </div>
        </div>
      </Section>
    </div>
  );
}
