"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import {
  BHRT_COST_COMPARISON,
  BHRT_COST_COMPARISON_NOTE,
  BHRT_COST_DISCLAIMER,
  BHRT_COST_FIRST_MONTH,
  BHRT_COST_FIRST_MONTH_TOTAL,
  BHRT_COST_HERO,
  BHRT_COST_INCLUDED,
  BHRT_COST_INCLUDED_CALLOUT,
  BHRT_COST_INSURANCE,
  BHRT_COST_JUMP_LINKS,
  BHRT_COST_LIFE_STAGES,
  BHRT_COST_MEDICAL_REVIEW,
  BHRT_COST_QUICK_ANSWER,
  BHRT_COST_RELATED,
  BHRT_COST_WHY_BIOTE,
  BHRT_COST_WHY_BIOTE_DISCLAIMER,
  BHRT_COST_WORTH_IT,
  BHRT_COST_WORTH_IT_MATH,
  BHRT_COST_FAQS,
  LADIES_CLUB_BHRT_COST_PATH,
} from "@/lib/ladies-club-bhrt-cost";
import { LADIES_CLUB_PATH } from "@/lib/ladies-club";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
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

export function BhrtCostPageContent() {
  return (
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${BRAND.pinkHot}22 0%, transparent 50%),
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
              <Link
                href={LADIES_CLUB_PATH}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#FFB8DC] hover:text-white"
              >
                ← Back to The Ladies&apos; Club
              </Link>
              <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#E6007E]" />
                    {BHRT_COST_HERO.eyebrow}
                  </p>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">
                    Oswego · {HG_TAGLINE}
                  </p>
                  <h1 className="mt-4 text-4xl font-black leading-[1.05] text-white md:text-5xl lg:text-6xl">
                    {BHRT_COST_HERO.titleBefore}{" "}
                    <span
                      className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                      style={{ WebkitBackgroundClip: "text" }}
                    >
                      {BHRT_COST_HERO.titleAccent}
                    </span>
                  </h1>
                  <p className="mt-6 text-lg font-medium leading-relaxed text-white/85 md:text-xl">
                    {BHRT_COST_HERO.subtitle}
                  </p>
                  <p className="mt-4 text-sm text-white/60">
                    Medically reviewed by {BHRT_COST_MEDICAL_REVIEW.reviewer} · Updated{" "}
                    {BHRT_COST_MEDICAL_REVIEW.updated}
                  </p>
                  <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    <CTA href={BOOKING_URL} variant="gradient" className="px-8 py-4">
                      Book Hormone Consult
                    </CTA>
                    <CTA
                      href={`tel:${SITE.phone}`}
                      variant="outline"
                      className="border-white/30 px-8 py-4 text-white hover:border-white hover:bg-white/10"
                    >
                      Call {SITE.phone}
                    </CTA>
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-md shrink-0 lg:mx-0">
                  <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.5)]">
                    <Image
                      src={BHRT_COST_HERO.heroImage}
                      alt={BHRT_COST_HERO.heroImageAlt}
                      width={640}
                      height={400}
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
          aria-label="BHRT cost guide sections"
          className="sticky top-0 z-20 border-b-4 border-black bg-white/70 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 md:px-6">
            {BHRT_COST_JUMP_LINKS.map((link) => (
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

        {/* Quick answer */}
        <Section className="border-b-4 border-black bg-gradient-to-b from-white to-[#FFF0F7]/50">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard id="quick-answer" title={BHRT_COST_QUICK_ANSWER.headline}>
                <ul className="space-y-4">
                  {BHRT_COST_QUICK_ANSWER.bullets.map((item) => (
                    <li key={item.bold} className="flex gap-3 text-base leading-relaxed text-black/85">
                      <span className="shrink-0 font-bold text-[#E6007E]">▸</span>
                      <span>
                        <strong className="text-[#E6007E]">{item.bold}</strong> {item.rest}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-2xl border-2 border-black/10 bg-[#FFF0F7] p-5 text-base font-semibold leading-relaxed text-black/85">
                  {BHRT_COST_QUICK_ANSWER.bottomLine}
                </p>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* What's included */}
        <Section id="whats-included" className="scroll-mt-24 border-b-4 border-black bg-white">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard title="What's included in women's BioTE care">
                <div className="grid gap-5 md:grid-cols-2">
                  {BHRT_COST_INCLUDED.map((item) => (
                    <div key={item.title} className="rounded-2xl border-2 border-black/10 bg-[#FFF0F7]/60 p-5">
                      <h3 className="font-bold text-[#E6007E]">▸ {item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-black/80">{item.body}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-relaxed text-black/70">{BHRT_COST_INCLUDED_CALLOUT}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <CTA href={BOOKING_URL} variant="gradient">
                    Book free consult
                  </CTA>
                  <CTA href="/biote-hormone-therapy-oswego" variant="outline">
                    BioTE menu →
                  </CTA>
                </div>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Comparison */}
        <Section id="comparison" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard title="BHRT cost comparison">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b-2 border-black">
                        <th className="py-3 pr-4 font-black text-neutral-900">Provider model</th>
                        <th className="py-3 pr-4 font-black text-neutral-900">Typical annual</th>
                        <th className="py-3 pr-4 font-black text-neutral-900">What's included</th>
                        <th className="py-3 font-black text-neutral-900">What's often missing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BHRT_COST_COMPARISON.map((row) => (
                        <tr
                          key={row.model}
                          className={`border-b border-black/10 ${row.highlight ? "bg-[#FFF0F7]/80" : ""}`}
                        >
                          <td className="py-4 pr-4 align-top">
                            <p className="font-bold text-neutral-900">{row.model}</p>
                            {row.modelSub ? (
                              <p className="mt-1 text-xs text-neutral-500">{row.modelSub}</p>
                            ) : null}
                          </td>
                          <td className="py-4 pr-4 align-top font-semibold text-[#E6007E]">{row.annualCost}</td>
                          <td className="py-4 pr-4 align-top text-black/80">{row.included}</td>
                          <td className="py-4 align-top text-black/70">{row.missing}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-black/75">{BHRT_COST_COMPARISON_NOTE}</p>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Why BioTE */}
        <Section id="why-biote" className="scroll-mt-24 border-b-4 border-black bg-white">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard title="Why BioTE pellets at Hello Gorgeous">
                <div className="space-y-5">
                  {BHRT_COST_WHY_BIOTE.map((block) => (
                    <div key={block.title}>
                      <h3 className="font-bold text-[#E6007E]">▸ {block.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-black/80">{block.body}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 rounded-2xl border-2 border-black/10 bg-neutral-50 p-5 text-sm leading-relaxed text-black/75">
                  {BHRT_COST_WHY_BIOTE_DISCLAIMER}
                </p>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* First month */}
        <Section id="first-month" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-white to-[#FFF0F7]/50">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard title="What your first months look like">
                <div className="grid gap-4 sm:grid-cols-2">
                  {BHRT_COST_FIRST_MONTH.map((step, i) => (
                    <div
                      key={step.title}
                      className="rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">
                        {step.step}
                      </span>
                      <h3 className="mt-2 font-black text-neutral-900">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-black/80">{step.body}</p>
                      {step.cost ? (
                        <p className="mt-3 text-lg font-black text-[#E6007E]">{step.cost}</p>
                      ) : null}
                      {i === 0 ? (
                        <span className="sr-only">Step {i + 1}</span>
                      ) : null}
                    </div>
                  ))}
                </div>
                <p className="mt-6 font-semibold leading-relaxed text-black/85">{BHRT_COST_FIRST_MONTH_TOTAL}</p>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Insurance */}
        <Section id="insurance" className="scroll-mt-24 border-b-4 border-black bg-white">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard title="Insurance, cash-pay & HSA/FSA">
                <div className="space-y-6">
                  {BHRT_COST_INSURANCE.map((block) => (
                    <div key={block.title}>
                      <h3 className="font-bold text-neutral-900">{block.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-black/80">{block.body}</p>
                    </div>
                  ))}
                </div>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Worth it */}
        <Section id="worth-it" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard title="Is BHRT worth the investment?">
                <div className="grid gap-4 sm:grid-cols-2">
                  {BHRT_COST_WORTH_IT.map((item) => (
                    <div key={item.title} className="rounded-2xl border-2 border-black/10 p-5">
                      <h3 className="font-bold text-[#E6007E]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-black/80">{item.body}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-base font-semibold leading-relaxed text-black/85">
                  {BHRT_COST_WORTH_IT_MATH}
                </p>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Life stages */}
        <Section id="life-stages" className="scroll-mt-24 border-b-4 border-black bg-white">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard title="BHRT at different life stages">
                <div className="grid gap-5 md:grid-cols-3">
                  {BHRT_COST_LIFE_STAGES.map((stage) => (
                    <div
                      key={stage.title}
                      className="rounded-2xl border-4 border-black bg-gradient-to-b from-white to-rose-50 p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]"
                    >
                      <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">{stage.age}</p>
                      <h3 className="mt-2 text-lg font-black text-neutral-900">{stage.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-black/80">{stage.body}</p>
                      {stage.link ? (
                        <Link
                          href={stage.link.href}
                          className="mt-4 inline-block text-sm font-bold text-[#E6007E] hover:underline"
                        >
                          {stage.link.label}
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* FAQ */}
        <Section id="faq" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-white to-[#FFF0F7]/50">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeUp>
              <StampCard title="BHRT cost FAQ">
                <FAQAccordion items={BHRT_COST_FAQS} />
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Related + CTA */}
        <Section
          className="border-b-4 border-black py-16"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        >
          <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
            <FadeUp>
              <h2 className="text-3xl font-black text-white md:text-4xl">Book your hormone consult</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                Start with a free consult and baseline labs — transparent pricing before you commit.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <CTA href={BOOKING_URL} variant="outline" className="!border-white !bg-white !text-[#E6007E]">
                  Book consult
                </CTA>
                <CTA
                  href={`tel:${SITE.phone}`}
                  variant="outline"
                  className="!border-white/50 !text-white hover:!bg-white/10"
                >
                  Call {SITE.phone}
                </CTA>
              </div>
              <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-bold text-white/90">
                {BHRT_COST_RELATED.map((link) => (
                  <Link key={link.href} href={link.href} className="hover:text-white hover:underline">
                    {link.label} →
                  </Link>
                ))}
              </div>
              <p className="mx-auto mt-10 max-w-3xl text-xs leading-relaxed text-white/70">
                {BHRT_COST_DISCLAIMER}
              </p>
              <p className="mt-4 text-xs text-white/50">
                <Link href={LADIES_CLUB_BHRT_COST_PATH} className="hover:text-white/70">
                  {LADIES_CLUB_BHRT_COST_PATH}
                </Link>
              </p>
            </FadeUp>
          </div>
        </Section>
      </main>
    </div>
  );
}
