import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { RealPatientReviews } from "@/components/RealPatientReviews";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { RYAN_FULL_NAME } from "@/lib/founder-credentials";
import {
  LOW_T_SYMPTOMS,
  MENS_HORMONES_APPROACH_COPY,
  MENS_HORMONES_APPROACH_COPY_2,
  MENS_HORMONES_FAQS,
  MENS_HORMONES_GLP1_STACK,
  MENS_HORMONES_HERO_IMAGE,
  MENS_HORMONES_INCLUDED,
  MENS_HORMONE_ADD_ONS,
  MENS_HORMONE_ADD_ONS_DISCLAIMER,
  MENS_HORMONES_MEMBERSHIP_FROM,
  MENS_HORMONES_QUICK_FACTS,
  MENS_HORMONES_RELATED_LINKS,
} from "@/lib/mens-hormones";
import { SITE } from "@/lib/seo";

const REVIEWED_DATE = "March 2026";

function QuickFactCard({ label, value, note }: (typeof MENS_HORMONES_QUICK_FACTS)[number]) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#E6007E]">{value}</p>
      <p className="mt-2 text-sm text-neutral-600">{note}</p>
    </div>
  );
}

function IncludedColumn({ title, bullets }: { title: string; bullets: readonly string[] }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 md:p-8">
      <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
      <ul className="mt-5 space-y-3">
        {bullets.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-neutral-700">
            <span className="shrink-0 text-[#E6007E]">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddOnMedicationCard({
  name,
  description,
  priceMonthlyUsd,
  learnMoreHref,
}: (typeof MENS_HORMONE_ADD_ONS)[number]) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#151922] p-6 md:p-8">
      <h3 className="text-xl font-black uppercase tracking-tight text-white">{name}</h3>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-400">{description}</p>
      <p className="mt-6 text-2xl font-black text-white">
        ${priceMonthlyUsd}
        <span className="text-base font-semibold text-gray-500">/month</span>
      </p>
      {learnMoreHref ? (
        <Link href={learnMoreHref} className="mt-4 text-sm font-semibold text-[#FFB8DC] hover:underline">
          Learn more →
        </Link>
      ) : null}
    </article>
  );
}

export async function MensHormonesPageContent() {
  return (
    <>
      {/* Hero */}
      <Section className="relative overflow-hidden border-b border-neutral-200 !py-0 !px-0">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a12 45%, #2d1020 100%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(230,0,126,0.14)_0%,transparent_50%)]" />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">Medical Services</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
              Men&apos;s Hormone Optimization
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
              Testosterone optimization done right. Comprehensive testing, personalized protocols, and
              ongoing monitoring — not a quick prescription and a handshake.
            </p>
            <p className="mt-4 text-sm text-white/60">
              Medically reviewed by {RYAN_FULL_NAME} · Updated {REVIEWED_DATE}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <CTA href={BOOKING_URL} variant="gradient" className="px-8 py-4">
                Book consultation
              </CTA>
              <CTA
                href="/quiz/trt-readiness"
                variant="outline"
                className="border-white/30 px-8 py-4 text-white hover:bg-white hover:text-black"
              >
                TRT readiness quiz
              </CTA>
            </div>
          </FadeUp>
          <FadeUp delayMs={80}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <Image
                src={MENS_HORMONES_HERO_IMAGE}
                alt="Men's hormone optimization and TRT at Hello Gorgeous Med Spa Oswego IL"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
                priority
              />
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Signs of low T */}
      <Section id="symptoms" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900 md:text-4xl">
              Signs of low testosterone
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-neutral-600">
              These symptoms often get blamed on &ldquo;aging&rdquo; or &ldquo;stress&rdquo; — but they may
              indicate a hormone imbalance that can be addressed.
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LOW_T_SYMPTOMS.map((symptom, idx) => (
              <FadeUp key={symptom.title} delayMs={idx * 30}>
                <article className="h-full rounded-2xl border border-neutral-200 bg-neutral-50 p-5 transition hover:border-[#E6007E]/40 hover:shadow-sm">
                  <span className="text-2xl" aria-hidden>
                    {symptom.icon}
                  </span>
                  <h3 className="mt-3 font-bold text-neutral-900">{symptom.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{symptom.description}</p>
                </article>
              </FadeUp>
            ))}
          </div>
          <FadeUp delayMs={280}>
            <div className="mt-10 rounded-2xl border border-[#E6007E]/20 bg-[#FFF0F7] p-6 text-center md:p-8">
              <p className="text-lg font-semibold text-neutral-900">
                Not sure if your symptoms are hormone-related?
              </p>
              <Link
                href="/quiz/trt-readiness"
                className="mt-3 inline-block text-lg font-bold text-[#E6007E] hover:underline"
              >
                Take the 2-minute TRT Readiness Screener →
              </Link>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Our approach */}
      <Section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <FadeUp>
            <h2 className="text-3xl font-black text-neutral-900 md:text-4xl">Our approach</h2>
            <p className="mt-6 text-neutral-700 leading-relaxed">{MENS_HORMONES_APPROACH_COPY}</p>
            <p className="mt-4 text-neutral-700 leading-relaxed">{MENS_HORMONES_APPROACH_COPY_2}</p>
            <Link
              href="/testosterone-replacement-oswego"
              className="mt-6 inline-block font-semibold text-[#E6007E] hover:underline"
            >
              See full TRT program details →
            </Link>
          </FadeUp>
          <FadeUp delayMs={80}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg">
              <Image
                src={MENS_HORMONES_HERO_IMAGE}
                alt="TRT consultation with Ryan Kent FNP-BC at Hello Gorgeous Oswego"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Quick facts */}
      <Section className="bg-white">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-center text-2xl font-black uppercase tracking-tight text-neutral-900 md:text-3xl">
              TRT program quick facts
            </h2>
          </FadeUp>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MENS_HORMONES_QUICK_FACTS.map((fact, idx) => (
              <FadeUp key={fact.label} delayMs={idx * 40}>
                <QuickFactCard {...fact} />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* What's included */}
      <Section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-3xl font-black text-neutral-900 md:text-4xl">What&apos;s included</h2>
          </FadeUp>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <FadeUp delayMs={40}>
              <IncludedColumn
                title={MENS_HORMONES_INCLUDED.oversight.title}
                bullets={MENS_HORMONES_INCLUDED.oversight.bullets}
              />
            </FadeUp>
            <FadeUp delayMs={80}>
              <IncludedColumn
                title={MENS_HORMONES_INCLUDED.program.title}
                bullets={MENS_HORMONES_INCLUDED.program.bullets}
              />
            </FadeUp>
          </div>
          <FadeUp delayMs={120}>
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-neutral-600">
              Many patients add{" "}
              <Link href="/peptides" className="font-semibold text-[#E6007E] hover:underline">
                peptide therapy
              </Link>{" "}
              to their hormone protocol — Sermorelin for growth hormone support, PT-141 for sexual health, or
              BPC-157 for recovery. These are available as add-ons to any program.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600">
              Billed separately at many clinics: labs $200–500 · provider visits $150+ each — we quote
              all-inclusive monthly programs where possible. HSA/FSA accepted.{" "}
              <Link
                href="/testosterone-replacement-oswego"
                className="font-semibold text-[#E6007E] hover:underline"
              >
                See the full TRT cost breakdown →
              </Link>
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* Add-on medications */}
      <Section id="add-ons" className="scroll-mt-24 border-t border-neutral-800 !py-0 !px-0">
        <div className="bg-[#1a1d24] px-4 py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-6xl">
            <FadeUp>
              <h2 className="text-center text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                Add-on medications
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-center text-gray-400">
                Additional medications that can support hormone therapy protocols.
              </p>
            </FadeUp>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {MENS_HORMONE_ADD_ONS.map((addOn, idx) => (
                <FadeUp key={addOn.id} delayMs={idx * 50}>
                  <AddOnMedicationCard {...addOn} />
                </FadeUp>
              ))}
            </div>
            <FadeUp delayMs={180}>
              <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-gray-500">
                {MENS_HORMONE_ADD_ONS_DISCLAIMER}
              </p>
            </FadeUp>
          </div>
        </div>
      </Section>

      {/* Pricing band */}
      <Section className="bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">TRT programs</p>
            <p className="mt-3 text-4xl font-black text-neutral-900">
              Starting at <span className="text-[#E6007E]">$200/mo</span>
            </p>
            <p className="mt-3 text-neutral-600">
              Weekly injections · BioTE pellets $750–1,200 per insertion · topical creams from $150/mo
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Gentlemen&apos;s Club members from ${MENS_HORMONES_MEMBERSHIP_FROM}/mo get member pricing on
              hormone services + monthly wellness shots.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <CTA href={BOOKING_URL} variant="gradient">
                Book your free consult
              </CTA>
              <CTA href="/gentlemens-club" variant="outline">
                Explore membership
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Stack with GLP-1 */}
      <Section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-4xl rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm md:p-10">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">Combine &amp; optimize</p>
            <h2 className="mt-3 text-2xl font-black text-neutral-900 md:text-3xl">
              On a GLP-1 too? We map the full picture.
            </h2>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              Low testosterone and metabolic weight often travel together. Many men stack hormone
              optimization with our NP-supervised GLP-1 program — semaglutide from $
              {MENS_HORMONES_GLP1_STACK.semaglutideFrom}/mo, tirzepatide from $
              {MENS_HORMONES_GLP1_STACK.tirzepatideFrom}/mo — with one team coordinating both.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <CTA href="/glp-1-weight-loss-oswego" variant="gradient">
                See GLP-1 program
              </CTA>
              <CTA href={BOOKING_URL} variant="outline">
                Book combined consult
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="scroll-mt-24 bg-white">
        <FadeUp>
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-2xl font-black text-neutral-900 md:text-3xl">Common questions</h2>
          </div>
        </FadeUp>
        <div className="mx-auto max-w-3xl space-y-3">
          {MENS_HORMONES_FAQS.map((faq, idx) => (
            <FadeUp key={faq.question} delayMs={idx * 30}>
              <details className="group rounded-xl border border-neutral-200 bg-white open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-semibold text-neutral-900">
                  <span>{faq.question}</span>
                  <span className="shrink-0 text-lg text-neutral-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-0 leading-relaxed text-neutral-600">{faq.answer}</div>
              </details>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Related reading */}
      <Section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-3xl">
          <FadeUp>
            <h2 className="text-xl font-black text-neutral-900">Related reading</h2>
            <ul className="mt-6 space-y-3">
              {MENS_HORMONES_RELATED_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-semibold text-[#E6007E] hover:underline">
                    {link.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </Section>

      {/* Reviews */}
      <Section className="bg-white">
        <div className="mx-auto max-w-6xl">
          <RealPatientReviews
            service="general"
            serviceLabel="Men's Hormone Optimization"
            heading="What our clients say"
            intro={`${SITE.reviewCount}+ verified reviews · ${SITE.reviewRating} stars on Google`}
          />
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="relative overflow-hidden border-t-4 border-black !py-0 !px-0">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-16 text-center md:px-6 md:py-20">
          <FadeUp>
            <h2 className="text-3xl font-black text-white md:text-4xl">Take the first step</h2>
            <p className="mt-4 text-lg text-white/90">
              Start with comprehensive testing. Know where you stand.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <CTA
                href={BOOKING_URL}
                variant="outline"
                className="border-2 border-white bg-white px-10 py-4 text-lg font-bold text-[#E6007E] hover:bg-white/90"
              >
                Book consultation
              </CTA>
              <CTA
                href="/quiz/trt-readiness"
                variant="outline"
                className="border-2 border-white/60 px-10 py-4 text-lg text-white hover:bg-white/10"
              >
                TRT readiness quiz
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
