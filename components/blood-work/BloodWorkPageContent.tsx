"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  BLOOD_WORK_BOTTOM_LINE,
  BLOOD_WORK_DOMAINS,
  BLOOD_WORK_FAQS,
  BLOOD_WORK_JUMP_LINKS,
  BLOOD_WORK_LAB_PARTNERS,
  BLOOD_WORK_MEDICAL_REVIEW,
  BLOOD_WORK_PATTERNS,
  BLOOD_WORK_PREP_TIPS,
  BLOOD_WORK_RETEST_BULLETS,
} from "@/lib/blood-work";
import { HG_TAGLINE } from "@/lib/brand-tagline";
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
                    Lab Education · {HG_TAGLINE}
                  </p>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">
                    Oswego · Fox Valley · NP-supervised
                  </p>
                  <h1 className="mt-4 text-4xl font-black leading-[1.05] text-white md:text-5xl lg:text-6xl">
                    Your{" "}
                    <span
                      className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                      style={{ WebkitBackgroundClip: "text" }}
                    >
                      Blood Work
                    </span>{" "}
                    Explained
                  </h1>
                  <p className="mt-6 text-lg font-medium leading-relaxed text-white/85 md:text-xl">
                    A complete guide to comprehensive wellness panels — what each domain measures, how
                    markers connect, and how Hello Gorgeous orders labs through{" "}
                    <strong className="text-white">FullScript</strong>,{" "}
                    <strong className="text-white">Quest</strong>, and{" "}
                    <strong className="text-white">LabCorp</strong>.
                  </p>
                  <p className="mt-4 text-sm text-white/60">
                    Medically reviewed by {BLOOD_WORK_MEDICAL_REVIEW.reviewer} · Updated{" "}
                    {BLOOD_WORK_MEDICAL_REVIEW.updated}
                  </p>
                  <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    <CTA href={BOOKING_URL} variant="gradient" className="px-8 py-4">
                      Book Lab Consult
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

        {/* Why comprehensive */}
        <Section className="border-b-4 border-black bg-white">
          <div className="mx-auto max-w-6xl space-y-8 px-4 md:px-6">
            <FadeUp>
              <StampCard id="why-comprehensive" index={1} title="Why comprehensive blood work matters">
                <div className="space-y-4 text-base font-medium leading-relaxed text-black/85">
                  <p>
                    A standard annual physical checks 8–14 markers — enough to confirm nothing is acutely
                    wrong, but not much more. It screens for disease; it does not show how each system is
                    actually performing.
                  </p>
                  <p>
                    A 60+ biomarker panel asks a different question: instead of “is anything broken?”, it
                    asks <em>“how is everything running?”</em> Heart disease, metabolic syndrome, and
                    hormonal decline develop gradually — often before a basic panel flags them.
                  </p>
                  <p>
                    This is not about finding problems where none exist. It is about having enough data to
                    make informed decisions — especially when you are exploring{" "}
                    <Link href="/gentlemens-club#hormones" className="text-[#E6007E] underline decoration-[#E6007E]">
                      TRT
                    </Link>
                    ,{" "}
                    <Link href="/biote-hormone-therapy-oswego" className="text-[#E6007E] underline decoration-[#E6007E]">
                      BioTE hormones
                    </Link>
                    , or{" "}
                    <Link href="/glp-1-weight-loss-oswego" className="text-[#E6007E] underline decoration-[#E6007E]">
                      GLP-1 weight loss
                    </Link>
                    .
                  </p>
                </div>
              </StampCard>
            </FadeUp>

            <FadeUp>
              <StampCard index={2} title="Reference ranges vs. targets">
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
              <StampCard title="Frequently asked questions">
                <dl className="space-y-6">
                  {BLOOD_WORK_FAQS.map((faq) => (
                    <div key={faq.question}>
                      <dt className="font-bold text-[#E6007E]">▸ {faq.question}</dt>
                      <dd className="mt-2 text-sm font-medium leading-relaxed text-black/85">
                        {faq.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
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
              <h2 className="text-3xl font-black text-white md:text-4xl">Ready for baseline labs?</h2>
              <p className="mt-4 text-lg font-medium text-white/90">
                60+ biomarkers · FullScript, Quest, or LabCorp · In-person review with{" "}
                {BLOOD_WORK_MEDICAL_REVIEW.reviewer}. No referral needed.
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
