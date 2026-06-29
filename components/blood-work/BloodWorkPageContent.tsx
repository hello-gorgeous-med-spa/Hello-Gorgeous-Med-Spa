"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL, LABS_HUB_PATH } from "@/lib/flows";
import {
  BLOOD_WORK_BOTTOM_LINE,
  BLOOD_WORK_DOMAINS,
  BLOOD_WORK_FAQS,
  BLOOD_WORK_FASTING,
  BLOOD_WORK_HERO,
  BLOOD_WORK_JUMP_LINKS,
  BLOOD_WORK_LAB_PARTNERS,
  BLOOD_WORK_MEDICAL_REVIEW,
  BLOOD_WORK_PATTERNS,
  BLOOD_WORK_PREP_TIPS,
  BLOOD_WORK_PRICING,
  BLOOD_WORK_PRICING_NOTE,
  BLOOD_WORK_QUICK_FACTS,
  BLOOD_WORK_RETEST_BULLETS,
  BLOOD_WORK_TEST_CATEGORIES,
  BLOOD_WORK_WHY_IT_MATTERS,
} from "@/lib/blood-work";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  roseText: "#FFB8DC",
  dark: "#0a0a0a",
};

function StampCard({
  index,
  title,
  children,
  id,
  className = "",
}: {
  index?: number;
  title: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <article
      id={id}
      className={`scroll-mt-28 rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] md:p-8 ${className}`}
    >
      <div className="mb-4 flex items-start gap-3">
        {index != null ? (
          <span className="inline-flex shrink-0 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-sm font-black text-white">
            {index}
          </span>
        ) : null}
        <h2 className="text-xl font-black text-neutral-900 md:text-2xl">{title}</h2>
      </div>
      {children}
    </article>
  );
}

export function BloodWorkPageContent() {
  return (
    <div className="relative min-h-[100dvh]">
      {/* Ambient brand wash */}
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

      <main className="min-w-0">
        {/* Hero */}
        <Section className="relative border-b-4 border-black py-16 lg:py-24 !px-0">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, ${BRAND.pink}33 0%, transparent 45%),
                radial-gradient(circle at 80% 20%, ${BRAND.pinkHot}22 0%, transparent 40%)
              `,
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />

          <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
                    <span
                      className="h-2 w-2 animate-pulse rounded-full"
                      style={{ backgroundColor: BRAND.pink }}
                    />
                    {BLOOD_WORK_HERO.eyebrow}
                  </p>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">
                    Oswego · Fox Valley · NP-supervised
                  </p>
                  <h1 className="mt-4 text-4xl font-black leading-[1.05] text-white md:text-5xl lg:text-6xl">
                    {BLOOD_WORK_HERO.title}
                  </h1>
                  <p className="mt-6 text-lg font-medium leading-relaxed text-white/85 md:text-xl">
                    {BLOOD_WORK_HERO.subtitle}
                  </p>
                  <p className="mt-4 text-sm text-white/60">
                    Medically reviewed by {BLOOD_WORK_MEDICAL_REVIEW.reviewer} · Updated{" "}
                    {BLOOD_WORK_MEDICAL_REVIEW.updated}
                  </p>
                  <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    <CTA href={LABS_HUB_PATH} variant="gradient" className="px-8 py-4">
                      {BLOOD_WORK_HERO.ctaLabel}
                    </CTA>
                    <CTA
                      href={BOOKING_URL}
                      variant="outline"
                      className="border-white/30 px-8 py-4 text-white hover:border-white hover:bg-white/10"
                    >
                      Book in-house draw
                    </CTA>
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-sm shrink-0 lg:mx-0">
                  <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.5)]">
                    <Image
                      src="/images/homepage-buyer-paths/weight-loss-hormones.png"
                      alt="Hello Gorgeous hormone and wellness lab panels"
                      width={480}
                      height={480}
                      className="h-auto w-full object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Jump nav */}
        <nav
          aria-label="Blood work sections"
          className="sticky top-0 z-20 border-b-4 border-black bg-white/70 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 md:px-6">
            {BLOOD_WORK_JUMP_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="shrink-0 rounded-full border-2 border-neutral-200 bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-xs font-bold text-neutral-700 transition hover:border-[#E6007E] hover:text-[#E6007E]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        {/* What we test */}
        <Section id="what-we-test" className="scroll-mt-28 border-b-4 border-black bg-gradient-to-b from-white to-[#FFF0F7]/50">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <div className="mb-8 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">60+ biomarkers</p>
                <h2 className="mt-2 text-3xl font-black text-neutral-900 md:text-4xl">What we test</h2>
                <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-black/70">
                  Comprehensive panels across the systems that drive hormone optimization, weight loss, and
                  longevity planning.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {BLOOD_WORK_TEST_CATEGORIES.map((cat) => (
                  <article
                    key={cat.id}
                    className="flex h-full flex-col rounded-3xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]"
                  >
                    <h3 className="font-black text-[#E6007E]">{cat.title}</h3>
                    <ul className="mt-4 flex-1 space-y-2">
                      {cat.markers.map((m) => (
                        <li key={m} className="flex gap-2 text-sm text-black/80">
                          <span className="text-[#E6007E]">•</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={cat.learnHref}
                      className="mt-5 text-sm font-bold text-[#E6007E] hover:underline"
                    >
                      Learn more →
                    </a>
                  </article>
                ))}
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Why it matters */}
        <Section id="why-comprehensive" className="scroll-mt-28 border-b-4 border-black bg-white">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard title="Why it matters">
                <p className="text-base font-medium leading-relaxed text-black/85">
                  {BLOOD_WORK_WHY_IT_MATTERS.lead}
                </p>
                <p className="mt-4 text-base font-medium leading-relaxed text-black/85">
                  {BLOOD_WORK_WHY_IT_MATTERS.body}
                </p>
                <p className="mt-6 rounded-2xl border-2 border-black/10 bg-[#FFF0F7] p-5 font-semibold text-black/85">
                  {BLOOD_WORK_WHY_IT_MATTERS.callout}
                </p>
                <div className="mt-6 space-y-4 text-base font-medium leading-relaxed text-black/85">
                  <p>
                    This is the foundation for{" "}
                    <Link href="/biote-hormone-therapy-oswego" className="text-[#E6007E] underline">
                      BioTE hormones
                    </Link>
                    ,{" "}
                    <Link href="/glp-1-weight-loss-oswego" className="text-[#E6007E] underline">
                      GLP-1 weight loss
                    </Link>
                    ,{" "}
                    <Link href="/peptides" className="text-[#E6007E] underline">
                      peptide therapy
                    </Link>
                    , and{" "}
                    <Link href="/ladies-club/bhrt-cost" className="text-[#E6007E] underline">
                      hormone program pricing
                    </Link>
                    .
                  </p>
                </div>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Fasting */}
        <Section id="fasting" className="scroll-mt-28 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7]/60 to-white">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard title="Fasting for your blood draw">
                <p className="mb-6 text-base font-medium text-black/80">
                  For the most accurate results, we recommend fasting before your draw. While not always
                  strictly required, fasting gives cleaner data — especially for metabolic and lipid markers.
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[BLOOD_WORK_FASTING.minimum, BLOOD_WORK_FASTING.ideal, BLOOD_WORK_FASTING.allowed].map(
                    (item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border-4 border-black bg-white p-5 text-center shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">
                          {item.label}
                        </p>
                        <p className="mt-2 text-2xl font-black text-neutral-900">{item.value}</p>
                        <p className="mt-2 text-sm text-black/70">{item.note}</p>
                      </div>
                    ),
                  )}
                </div>
                <p className="mt-6 text-sm font-medium leading-relaxed text-black/75">
                  <strong className="text-[#E6007E]">Why it matters:</strong> {BLOOD_WORK_FASTING.whyItMatters}
                </p>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Quick facts */}
        <Section id="quick-facts" className="scroll-mt-28 border-b-4 border-black bg-white">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <h2 className="mb-8 text-center text-3xl font-black text-neutral-900">Blood panel quick facts</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {BLOOD_WORK_QUICK_FACTS.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-2xl border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 p-6 text-center"
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-black/50">{fact.label}</p>
                    <p className="mt-2 text-3xl font-black text-[#E6007E]">{fact.value}</p>
                    <p className="mt-2 text-sm text-black/70">{fact.note}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Pricing */}
        <Section id="pricing" className="scroll-mt-28 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7]/50 to-white">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <h2 className="mb-8 text-center text-3xl font-black text-neutral-900">Pricing</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {BLOOD_WORK_PRICING.map((tier) => (
                  <article
                    key={tier.id}
                    className={`relative flex h-full flex-col rounded-3xl border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] ${
                      tier.highlight ? "bg-gradient-to-br from-white to-rose-50" : "bg-white"
                    }`}
                  >
                    {tier.badge ? (
                      <span className="absolute -top-3 right-4 rounded-full border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-[10px] font-bold uppercase text-white">
                        {tier.badge}
                      </span>
                    ) : null}
                    <h3 className="text-xl font-black text-neutral-900">{tier.name}</h3>
                    <p className="mt-3 text-4xl font-black text-[#E6007E]">{tier.price}</p>
                    <p className="mt-4 flex-1 text-sm font-medium leading-relaxed text-black/80">
                      {tier.description}
                    </p>
                    {tier.orderHref ? (
                      <CTA href={tier.orderHref} variant="gradient" className="mt-5 w-full justify-center py-3 text-sm">
                        Order this panel →
                      </CTA>
                    ) : null}
                  </article>
                ))}
              </div>
              <p className="mt-6 text-center text-sm font-medium text-black/70">{BLOOD_WORK_PRICING_NOTE}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <CTA href={LABS_HUB_PATH} variant="gradient">
                  {BLOOD_WORK_HERO.ctaLabel}
                </CTA>
                <CTA href={BOOKING_URL} variant="outline">
                  Book in-house draw
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Bottom line */}
        <Section className="border-b-4 border-black bg-gradient-to-b from-white to-[#FFF0F7]/50">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard id="bottom-line" title="The bottom line">
                <ul className="space-y-4">
                  {BLOOD_WORK_BOTTOM_LINE.map((item) => (
                    <li key={item.bold} className="flex gap-3 text-base leading-relaxed text-black/85">
                      <span className="shrink-0 font-bold text-[#E6007E]">▸</span>
                      <span>
                        <strong className="text-[#E6007E]">{item.bold}</strong> {item.rest}
                      </span>
                    </li>
                  ))}
                </ul>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Why comprehensive — reference ranges (kept for depth) */}
        <Section className="border-b-4 border-black bg-gradient-to-b from-[#FFF0F7]/40 to-white">
          <div className="mx-auto max-w-6xl space-y-8 px-4 md:px-6">
            <FadeUp>
              <StampCard index={1} title="Reference ranges vs. targets">
                <div className="space-y-4 text-base font-medium leading-relaxed text-black/85">
                  <p>
                    <strong className="text-[#E6007E]">Reference ranges</strong> come from population
                    statistics — the middle 95% of a large “healthy” group. Being inside the range does
                    not guarantee optimal; being slightly outside does not always mean disease.
                  </p>
                  <p>
                    <strong className="text-[#E6007E]">Medical society targets</strong> (AHA, ADA,
                    Endocrine Society) tie specific numbers to outcomes — e.g., LDL goals for heart risk or
                    HbA1c thresholds for prediabetes. Your provider interprets both in the context of your
                    history, medications, and goals.
                  </p>
                </div>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* How we order labs */}
        <Section
          id="how-we-order"
          className="scroll-mt-28 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7]/60 to-white"
        >
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <div className="mb-8 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">
                  Hello Gorgeous Lab Workflow
                </p>
                <h2 className="mt-2 text-3xl font-black text-neutral-900 md:text-4xl">
                  How we order your labs
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-black/70">
                  FullScript is our go-to for comprehensive panels. We can call in any requisition to Quest
                  or LabCorp — and draw many panels in office at Oswego.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {BLOOD_WORK_LAB_PARTNERS.map((partner) => (
                  <article
                    key={partner.id}
                    className="flex h-full flex-col rounded-3xl border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-neutral-900">{partner.name}</h3>
                      <span className="rounded-full border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        {partner.badge}
                      </span>
                    </div>
                    <p className="mt-3 flex-1 text-sm font-medium leading-relaxed text-black/75">
                      {partner.description}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {partner.bullets.map((b) => (
                        <li key={b} className="flex gap-2 text-sm text-black/80">
                          <span className="text-[#E6007E]">•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    {"href" in partner && partner.href ? (
                      <a
                        href={partner.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-block text-sm font-bold text-[#E6007E] hover:underline"
                      >
                        {partner.cta}
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>

              <p className="mt-8 text-center text-sm font-medium text-black/60">
                Baseline hormone & wellness panels typically{" "}
                <strong className="text-[#E6007E]">$250–450</strong> — exact panel confirmed at consult.
              </p>
            </FadeUp>
          </div>
        </Section>

        {/* 10 domains */}
        <Section id="domains" className="scroll-mt-28 border-b-4 border-black bg-white">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">
                  60+ biomarkers · 10 domains
                </p>
                <h2 className="mt-2 text-3xl font-black text-neutral-900 md:text-4xl">
                  What comprehensive panels cover
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {BLOOD_WORK_DOMAINS.map((domain) => (
                  <article
                    key={domain.id}
                    id={domain.id}
                    className="scroll-mt-28 rounded-2xl border-2 border-black/10 bg-gradient-to-br from-white to-rose-50/50 p-5 transition hover:border-[#E6007E]/40"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-sm font-black text-white">
                        {domain.index}
                      </span>
                      <div>
                        <h3 className="font-black text-[#E6007E]">{domain.title}</h3>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-black/50">
                          {domain.markers}
                        </p>
                        <p className="mt-3 text-sm font-medium leading-relaxed text-black/80">
                          {domain.summary}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Patterns */}
        <Section
          id="patterns"
          className="scroll-mt-28 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7]/50 to-white"
        >
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard index={3} title="How markers connect — patterns beat single numbers">
                <p className="mb-6 text-base font-medium text-black/80">
                  Your body is an integrated system. The most useful insights come from relationships between
                  markers, not any single value in isolation.
                </p>
                <div className="space-y-5">
                  {BLOOD_WORK_PATTERNS.map((pattern) => (
                    <div key={pattern.title} className="border-l-4 border-[#E6007E] pl-4">
                      <h3 className="font-bold text-[#E6007E]">{pattern.title}</h3>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-black/80">
                        {pattern.body}
                      </p>
                    </div>
                  ))}
                </div>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Prep */}
        <Section id="prep" className="scroll-mt-28 border-b-4 border-black bg-white">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard index={4} title="What can affect your results">
                <p className="mb-6 text-base font-medium text-black/80">
                  Blood work is a snapshot from the moment of your draw. These factors help you prepare and
                  interpret results accurately.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {BLOOD_WORK_PREP_TIPS.map((tip) => (
                    <div
                      key={tip.title}
                      className="rounded-2xl border-2 border-neutral-200 bg-rose-50/30 p-4"
                    >
                      <h3 className="font-bold text-[#E6007E]">{tip.title}</h3>
                      <p className="mt-2 text-sm font-medium leading-relaxed text-black/80">{tip.body}</p>
                    </div>
                  ))}
                </div>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Retest */}
        <Section
          id="retest"
          className="scroll-mt-28 border-b-4 border-black bg-gradient-to-b from-white to-[#FFF0F7]/40"
        >
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard index={5} title="How often to retest">
                <ul className="space-y-3">
                  {BLOOD_WORK_RETEST_BULLETS.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm font-medium leading-relaxed text-black/85">
                      <span className="shrink-0 text-[#E6007E]">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* FAQ */}
        <Section id="faq" className="scroll-mt-28 border-b-4 border-black bg-white">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard title="Common questions">
                <FAQAccordion items={BLOOD_WORK_FAQS} />
              </StampCard>
            </FadeUp>

            <p className="mt-8 text-center text-xs font-medium text-black/50">
              Educational content only — not a substitute for medical advice, diagnosis, or treatment.
            </p>
          </div>
        </Section>

        {/* CTA band */}
        <Section className="relative overflow-hidden !py-0 !px-0">
          <div
            className="relative px-4 py-16 md:px-6 md:py-20"
            style={{
              background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
              }}
            />
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-black text-white md:text-4xl">Know your numbers</h2>
              <p className="mt-4 text-lg font-medium text-white/90">
                Get a complete picture of your health with comprehensive lab testing — reviewed by{" "}
                {BLOOD_WORK_MEDICAL_REVIEW.reviewer}, not a raw PDF.
              </p>
              <p className="mt-3">
                <Link href="/understand-your-body" className="text-sm font-bold text-white/90 underline hover:text-white">
                  See what actionable lab results look like →
                </Link>
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CTA
                  href={BOOKING_URL}
                  className="bg-white px-8 py-4 font-bold text-[#E6007E] hover:bg-rose-50"
                >
                  Book Lab Consult
                </CTA>
                <CTA
                  href="/understand-your-body"
                  variant="outline"
                  className="border-white px-8 py-4 text-white hover:bg-white/10"
                >
                  Persona guide first →
                </CTA>
              </div>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
