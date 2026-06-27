"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import { GLP1_REFILL_PATH, HG_RX_TELEHEALTH_BOOKING_URL } from "@/lib/flows";
import {
  RX_PATIENT_CARE_ADDON_GROUPS,
  RX_PATIENT_CARE_GUIDES,
  RX_PATIENT_CARE_HERO,
  RX_PATIENT_CARE_JOURNEY,
  RX_PATIENT_CARE_JUMP_LINKS,
  RX_PATIENT_CARE_MARQUEE,
  RX_PATIENT_CARE_SECTIONS,
  rxCareAddonPriceLabel,
  type RxCareCard,
} from "@/lib/rx-patient-care-hub";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

function RxCareKeyframes() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @keyframes rx-float {
            0%, 100% { transform: translateY(0) rotate(var(--rx-rot, 0deg)); }
            50% { transform: translateY(-12px) rotate(var(--rx-rot, 0deg)); }
          }
          @keyframes rx-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes rx-shimmer {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
          @keyframes rx-pulse-ring {
            0%, 100% { box-shadow: 0 0 0 0 rgba(230,0,126,0.45); }
            50% { box-shadow: 0 0 0 14px rgba(230,0,126,0); }
          }
          .rx-float { animation: rx-float 5s ease-in-out infinite; }
          .rx-float-delay-1 { animation-delay: 0.8s; }
          .rx-float-delay-2 { animation-delay: 1.6s; }
          .rx-marquee-track { animation: rx-marquee 28s linear infinite; }
          .rx-shimmer-text {
            background: linear-gradient(90deg, #FFB8DC 0%, #fff 25%, #FF2D8E 50%, #FFB8DC 75%, #fff 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            animation: rx-shimmer 4s linear infinite;
          }
          .rx-pulse-cta { animation: rx-pulse-ring 2.5s ease-in-out infinite; }
        `,
      }}
    />
  );
}

function BentoActionCard({
  card,
  featured,
}: {
  card: RxCareCard;
  featured?: boolean;
}) {
  const inner = (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border-4 border-black bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_rgba(230,0,126,0.45)] ${
        featured ? "md:col-span-2 md:grid md:grid-cols-[1.1fr_0.9fr]" : ""
      }`}
    >
      {card.image && (
        <div
          className={`relative overflow-hidden bg-gradient-to-br ${card.accentClass ?? "from-[#FFF0F7] to-white"} ${
            featured ? "min-h-[200px] md:min-h-full" : "h-36 sm:h-40"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,45,142,0.25),transparent_55%)]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.image}
            alt={card.imageAlt ?? card.title}
            className={`absolute object-contain drop-shadow-2xl transition duration-500 group-hover:scale-105 ${
              featured
                ? "bottom-0 right-0 h-[88%] w-auto max-w-[85%]"
                : "bottom-2 right-2 h-[85%] w-auto max-w-[70%]"
            }`}
            loading="lazy"
          />
          <span className="absolute left-4 top-4 text-3xl drop-shadow-md" aria-hidden>
            {card.icon}
          </span>
          {card.badge && (
            <span className="absolute right-3 top-3 rounded-full border-2 border-black bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#E6007E] backdrop-blur-sm">
              {card.badge}
            </span>
          )}
        </div>
      )}

      <div className={`flex flex-1 flex-col p-5 md:p-6 ${!card.image ? "pt-6" : ""}`}>
        {!card.image && (
          <div className="mb-3 flex items-start justify-between">
            <span className="text-3xl">{card.icon}</span>
            {card.badge && (
              <span className="rounded-full border-2 border-black bg-[#FFF0F7] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#E6007E]">
                {card.badge}
              </span>
            )}
          </div>
        )}
        <h3 className="text-lg font-black leading-snug text-black group-hover:text-[#E6007E] md:text-xl">
          {card.title}
        </h3>
        {card.priceHint && (
          <p className="mt-1.5 text-sm font-black text-[#E6007E]">{card.priceHint}</p>
        )}
        <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-black/72">{card.description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[#E6007E]">
          {card.cta}
          <span className="transition-transform group-hover:translate-x-1.5" aria-hidden>
            →
          </span>
        </span>
      </div>
    </article>
  );

  if (card.external) {
    return (
      <a href={card.href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }
  return (
    <Link href={card.href} className="block h-full">
      {inner}
    </Link>
  );
}

export function RxPatientCareHubContent() {
  const [activeSection, setActiveSection] = useState("journey");
  const [journeyStep, setJourneyStep] = useState(0);
  const [selectedAddon, setSelectedAddon] = useState<string | null>(null);
  const [guideFilter, setGuideFilter] = useState<string>("All");

  const guideTags = ["All", ...Array.from(new Set(RX_PATIENT_CARE_GUIDES.map((g) => g.tag)))];
  const filteredGuides =
    guideFilter === "All"
      ? RX_PATIENT_CARE_GUIDES
      : RX_PATIENT_CARE_GUIDES.filter((g) => g.tag === guideFilter);

  const selectedAddonCard = RX_PATIENT_CARE_ADDON_GROUPS.flatMap((g) => g.cards).find(
    (a) => a.id === selectedAddon,
  );

  useEffect(() => {
    const ids = RX_PATIENT_CARE_JUMP_LINKS.map((l) => l.id);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  }, []);

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden">
      <RxCareKeyframes />

      {/* Ambient wash */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 50% -5%, ${BRAND.pink}28 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 100% 20%, ${BRAND.pinkHot}18 0%, transparent 50%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #fff 40%, #fafafa 100%)
          `,
        }}
      />

      <main className="min-w-0">
        {/* ── HERO ── */}
        <section className="relative overflow-hidden border-b-4 border-black bg-[#1a0812]">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background: `radial-gradient(circle at 15% 35%, ${BRAND.pink} 0%, transparent 42%),
                radial-gradient(circle at 88% 25%, ${BRAND.pinkHot} 0%, transparent 38%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.65)_100%)]" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:py-20 lg:grid-cols-2 lg:gap-14 lg:px-6 lg:py-24">
            <FadeUp className="text-center lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                <span className="rx-pulse-cta inline-block h-2 w-2 rounded-full bg-[#E6007E]" aria-hidden />
                {RX_PATIENT_CARE_HERO.eyebrow}
              </div>
              <p className="mb-3 text-sm font-semibold text-[#FFB8DC] md:text-base">{HG_TAGLINE}</p>
              <h1 className="font-serif text-4xl font-black leading-[1.05] text-white md:text-5xl xl:text-6xl">
                {RX_PATIENT_CARE_HERO.title}{" "}
                <span className="rx-shimmer-text italic">{RX_PATIENT_CARE_HERO.titleAccent}</span>
              </h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-white/88 md:text-lg lg:mx-0 mx-auto">
                {RX_PATIENT_CARE_HERO.subtitle}
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start justify-center">
                <CTA
                  href={RX_PATIENT_CARE_HERO.primaryCta.href}
                  variant="gradient"
                  className="rx-pulse-cta px-8 py-4 text-base font-black shadow-[0_0_40px_rgba(230,0,126,0.45)]"
                >
                  {RX_PATIENT_CARE_HERO.primaryCta.label}
                </CTA>
                <CTA
                  href={RX_PATIENT_CARE_HERO.secondaryCta.href}
                  variant="outline"
                  className="border-2 border-white/80 px-8 py-4 text-white hover:bg-white hover:text-black"
                >
                  {RX_PATIENT_CARE_HERO.secondaryCta.label}
                </CTA>
              </div>
              <button
                type="button"
                onClick={() => scrollTo("journey")}
                className="mt-6 text-sm font-bold text-[#FFB8DC] underline decoration-[#E6007E] underline-offset-4 hover:text-white"
              >
                See how refills work ↓
              </button>
            </FadeUp>

            {/* Hero visual collage */}
            <FadeUp delayMs={120} className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative aspect-[4/3.5] w-full">
                <div className="absolute inset-4 overflow-hidden rounded-[2rem] border-4 border-black shadow-[12px_12px_0_0_rgba(230,0,126,0.5)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={RX_PATIENT_CARE_HERO.heroImage}
                    alt={RX_PATIENT_CARE_HERO.heroImageAlt}
                    className="h-full w-full object-cover"
                    width={1024}
                    height={682}
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-4 right-4 text-left text-xs font-bold uppercase tracking-widest text-white/90">
                    Home delivery · NP-supervised
                  </p>
                </div>

                {RX_PATIENT_CARE_HERO.floatAssets.map((asset, i) => (
                  <div
                    key={asset.src}
                    className={`rx-float absolute ${asset.className} ${i === 1 ? "rx-float-delay-1" : i === 2 ? "rx-float-delay-2" : ""}`}
                    style={{
                      top: i === 0 ? "0%" : i === 1 ? "8%" : "auto",
                      bottom: i === 2 ? "4%" : "auto",
                      left: i === 0 ? "-2%" : i === 1 ? "auto" : "4%",
                      right: i === 1 ? "-4%" : "auto",
                      ["--rx-rot" as string]: i === 0 ? "-8deg" : i === 1 ? "6deg" : "-4deg",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset.src} alt={asset.alt} className="h-auto drop-shadow-2xl" loading="lazy" />
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Marquee */}
        <div className="overflow-hidden border-b-4 border-black bg-black py-3">
          <div className="rx-marquee-track flex w-max gap-8 whitespace-nowrap px-4">
            {[...RX_PATIENT_CARE_MARQUEE, ...RX_PATIENT_CARE_MARQUEE].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white"
              >
                <span className="text-[#E6007E]">✦</span> {item}
              </span>
            ))}
          </div>
        </div>

        {/* Sticky nav */}
        <nav
          aria-label="Patient care sections"
          className="sticky top-0 z-30 border-b-2 border-black/10 bg-white/80 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {RX_PATIENT_CARE_JUMP_LINKS.map((link) => {
              const active = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollTo(link.id)}
                  className={`shrink-0 rounded-full border-2 px-4 py-2 text-xs font-black uppercase tracking-wide transition ${
                    active
                      ? "border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                      : "border-black/15 bg-white text-black/75 hover:border-[#E6007E] hover:text-[#E6007E]"
                  }`}
                >
                  <span aria-hidden className="mr-1.5">
                    {link.emoji}
                  </span>
                  {link.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Journey — interactive steps */}
        <Section id="journey" className="scroll-mt-24 border-b-4 border-black bg-white py-14 md:py-18 !py-14">
          <div className="mx-auto max-w-6xl">
            <FadeUp>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#E6007E]">The glow-up loop</p>
              <h2 className="mt-2 font-serif text-3xl font-black text-black md:text-4xl">
                Refills in <span className="text-[#E6007E] italic">four taps</span>
              </h2>
            </FadeUp>

            <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
              <div className="flex flex-col gap-2">
                {RX_PATIENT_CARE_JOURNEY.map((step, idx) => {
                  const active = journeyStep === idx;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setJourneyStep(idx)}
                      className={`rounded-2xl border-4 px-4 py-4 text-left transition ${
                        active
                          ? "border-black bg-[#FFF0F7] shadow-[6px_6px_0_0_rgba(230,0,126,0.4)]"
                          : "border-black/15 bg-white hover:border-[#E6007E]/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{step.icon}</span>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#E6007E]">
                            Step {step.step}
                          </p>
                          <p className="font-black text-black">{step.title}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="relative overflow-hidden rounded-3xl border-4 border-black bg-gradient-to-br from-[#1a0812] to-[#2d1020] p-8 text-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#E6007E]/30 blur-3xl" />
                <p className="text-6xl font-black text-white/10">{RX_PATIENT_CARE_JOURNEY[journeyStep].step}</p>
                <p className="mt-2 text-3xl">{RX_PATIENT_CARE_JOURNEY[journeyStep].icon}</p>
                <h3 className="mt-4 text-2xl font-black">{RX_PATIENT_CARE_JOURNEY[journeyStep].title}</h3>
                <p className="mt-3 text-base font-medium leading-relaxed text-white/80">
                  {RX_PATIENT_CARE_JOURNEY[journeyStep].detail}
                </p>
                <CTA
                  href={journeyStep === 0 ? GLP1_REFILL_PATH : journeyStep === 1 ? HG_RX_TELEHEALTH_BOOKING_URL : GLP1_REFILL_PATH}
                  variant="gradient"
                  className="mt-8 inline-flex"
                >
                  {journeyStep === 0 ? "Start my refill" : journeyStep === 1 ? "Book telehealth" : "Go to refill hub"}
                </CTA>
              </div>
            </div>
          </div>
        </Section>

        {/* Refills + New patients — bento grids */}
        {RX_PATIENT_CARE_SECTIONS.map((section, sectionIdx) => (
          <Section
            key={section.id}
            id={section.id}
            className={`scroll-mt-24 border-b-4 border-black py-14 md:py-16 ${
              sectionIdx % 2 === 0 ? "bg-gradient-to-b from-[#FFF0F7]/90 to-white" : "bg-white"
            }`}
          >
            <div className="mx-auto max-w-6xl">
              <FadeUp>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#E6007E]">{section.eyebrow}</p>
                <h2 className="mt-2 font-serif text-3xl font-black text-black md:text-4xl">{section.title}</h2>
                <p className="mt-3 max-w-2xl text-base font-medium text-black/70">{section.description}</p>
              </FadeUp>

              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
                {section.cards.map((card, cardIdx) => (
                  <FadeUp key={card.id} delayMs={50 * cardIdx} className={cardIdx === 0 ? "sm:col-span-2" : ""}>
                    <BentoActionCard card={card} featured={cardIdx === 0} />
                  </FadeUp>
                ))}
              </div>
            </div>
          </Section>
        ))}

        {/* Add-on studio — pick & go */}
        <Section id="add-ons" className="scroll-mt-24 border-b-4 border-black bg-black py-14 text-white md:py-16">
          <div className="mx-auto max-w-6xl px-0">
            <FadeUp>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#FFB8DC]">Stack your protocol</p>
              <h2 className="mt-2 font-serif text-3xl font-black md:text-4xl">
                Monthly add-ons — <span className="text-[#FF2D8E] italic">pick your power-up</span>
              </h2>
              <p className="mt-3 max-w-2xl text-base font-medium text-white/70">
                Tap a card to preview, then add it on step 3 of your{" "}
                <Link href="/glp1-refill" className="font-bold text-[#FFB8DC] underline underline-offset-2">
                  GLP-1 refill
                </Link>
                .
              </p>
            </FadeUp>

            {RX_PATIENT_CARE_ADDON_GROUPS.map((group) => (
              <div key={group.group} className="mt-10">
                <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-white/55">{group.title}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.cards.map((addon) => {
                    const selected = selectedAddon === addon.id;
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => setSelectedAddon(selected ? null : addon.id)}
                        className={`group relative overflow-hidden rounded-3xl border-4 text-left transition duration-300 ${
                          selected
                            ? "border-[#FF2D8E] bg-white/10 shadow-[0_0_0_4px_rgba(255,45,142,0.35),8px_8px_0_0_#E6007E]"
                            : "border-white/20 bg-white/5 hover:border-white/50 hover:bg-white/10"
                        }`}
                      >
                        <div className={`relative h-32 bg-gradient-to-br ${addon.accentClass}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={addon.image}
                            alt={addon.imageAlt}
                            className="absolute bottom-0 right-2 h-[90%] w-auto object-contain drop-shadow-2xl transition group-hover:scale-105"
                            loading="lazy"
                          />
                          <span className="absolute left-4 top-4 text-2xl">{addon.emoji}</span>
                          <span className="absolute right-3 top-3 rounded-lg border-2 border-black bg-white px-2 py-1 text-xs font-black text-[#E6007E]">
                            {rxCareAddonPriceLabel(addon.monthlyUsd)}
                          </span>
                        </div>
                        <div className="p-5">
                          <h4 className="text-lg font-black text-white">{addon.title}</h4>
                          <p className="mt-2 text-sm font-medium text-white/75">{addon.description}</p>
                          <p className="mt-2 text-xs text-white/45">{addon.note}</p>
                          {selected && (
                            <p className="mt-3 text-xs font-black uppercase tracking-wider text-[#FFB8DC]">
                              ✓ Selected — add on refill form
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {selectedAddonCard && (
              <div className="sticky bottom-4 z-20 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href={selectedAddonCard.href}
                  className="inline-flex items-center gap-2 rounded-full border-4 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-8 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition hover:scale-[1.02]"
                >
                  Add {selectedAddonCard.title} on refill →
                </Link>
              </div>
            )}
          </div>
        </Section>

        {/* Guides — filterable tile grid */}
        <Section
          id="guides"
          className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14 md:py-16"
        >
          <div className="mx-auto max-w-6xl">
            <FadeUp>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#E6007E]">Your pocket pharmacy</p>
              <h2 className="mt-2 font-serif text-3xl font-black text-black md:text-4xl">
                Guides &amp; dosing charts
              </h2>
            </FadeUp>

            <div className="mt-6 flex flex-wrap gap-2">
              {guideTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setGuideFilter(tag)}
                  className={`rounded-full border-2 px-4 py-1.5 text-xs font-black uppercase tracking-wide transition ${
                    guideFilter === tag
                      ? "border-black bg-black text-white"
                      : "border-black/15 bg-white text-black/70 hover:border-[#E6007E]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGuides.map((guide) => (
                <a
                  key={guide.id}
                  href={guide.href}
                  target={guide.external ? "_blank" : undefined}
                  rel={guide.external ? "noopener noreferrer" : undefined}
                  className="group flex flex-col rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_0_rgba(230,0,126,0.45)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-3xl">{guide.emoji}</span>
                    <span className="rounded-md border border-black/15 bg-[#FFF0F7] px-2 py-0.5 text-[10px] font-black uppercase text-[#E6007E]">
                      {guide.tag}
                    </span>
                  </div>
                  <h3 className="mt-3 font-black text-black group-hover:text-[#E6007E]">{guide.title}</h3>
                  <p className="mt-1 flex-1 text-sm font-medium text-black/65">{guide.description}</p>
                  <span className="mt-4 text-xs font-black uppercase tracking-wider text-[#E6007E]">
                    Open →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Section>

        {/* Help CTA */}
        <Section id="help" className="scroll-mt-24 py-14 md:py-16">
          <FadeUp>
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border-4 border-black px-6 py-14 text-center md:px-12"
              style={{ background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)" }}
            >
              <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-black/20 blur-2xl" />
              <div className="relative z-10">
                <p className="text-4xl" aria-hidden>
                  💬
                </p>
                <h2 className="mt-4 font-serif text-3xl font-black text-white md:text-5xl">
                  Stuck? We got you, bestie.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-lg font-medium text-white/90">
                  Book telehealth, call the spa, or pop open the client app — same links, zero runaround.
                </p>
                <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row">
                  <CTA
                    href={HG_RX_TELEHEALTH_BOOKING_URL}
                    variant="outline"
                    className="border-2 border-white bg-white/15 px-8 py-3.5 font-black text-white backdrop-blur hover:bg-white hover:text-[#E6007E]"
                  >
                    Book telehealth
                  </CTA>
                  <CTA href="/app" variant="outline" className="border-2 border-white px-8 py-3.5 font-black text-white hover:bg-white hover:text-[#E6007E]">
                    Client app
                  </CTA>
                  <a
                    href={`tel:${SITE.phone.replace(/-/g, "")}`}
                    className="inline-flex rounded-full border-2 border-white px-8 py-3.5 text-sm font-black text-white hover:bg-white hover:text-[#E6007E]"
                  >
                    {SITE.phone}
                  </a>
                </div>
              </div>
            </div>
          </FadeUp>
        </Section>
      </main>
    </div>
  );
}
