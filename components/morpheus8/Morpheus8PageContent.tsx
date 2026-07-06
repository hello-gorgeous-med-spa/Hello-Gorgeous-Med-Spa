"use client";

import Image from "next/image";
import Link from "next/link";

import { FAQAccordion } from "@/components/FAQAccordion";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import {
  MORPHEUS8_FAQS,
  MORPHEUS8_INTRO_SPECIAL,
  MORPHEUS8_MARKETING,
  MORPHEUS8_NAV,
  MORPHEUS8_PACKAGES,
  MORPHEUS8_RESULTS,
  MORPHEUS8_STEPS,
  MORPHEUS8_TREATMENT_AREAS,
  MORPHEUS8_WHAT_IT_DOES,
} from "@/lib/morpheus8-marketing";

const BRAND = { pink: "#E6007E", pinkHot: "#FF2D8E", rose: "#FFF0F7", dark: "#0a0a0a" };

export function Morpheus8PageContent() {
  const { images } = MORPHEUS8_MARKETING;

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
        <Section className="relative border-b-4 border-black py-14 lg:py-20 !px-0">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
            }}
          />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <FadeUp>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#FFB8DC] backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E6007E]" />
                {MORPHEUS8_MARKETING.eyebrow}
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
                Oswego · Naperville · Aurora · Fox Valley
              </p>
              <h1 className="mt-3 font-black text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                Morpheus8{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  Burst + Deep
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                {MORPHEUS8_MARKETING.subhead}
              </p>
              <p className="mt-3 text-sm text-[#FFB8DC]">{MORPHEUS8_MARKETING.trustLine}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTA href={MORPHEUS8_MARKETING.bookHref} variant="gradient">
                  Book free consult
                </CTA>
                <CTA href="#pricing" variant="outline" className="!border-white !text-white hover:!bg-white/10">
                  See pricing
                </CTA>
              </div>
            </FadeUp>
            <FadeUp delayMs={80}>
              <div className="mx-auto w-full max-w-lg overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] lg:max-w-none">
                <div className="relative aspect-video w-full bg-black">
                  <video
                    src={MORPHEUS8_MARKETING.introVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 h-full w-full object-contain"
                    aria-label="Morpheus8 Burst RF microneedling at Hello Gorgeous Med Spa"
                  />
                </div>
              </div>
            </FadeUp>
          </div>
        </Section>

        <nav className="sticky top-0 z-20 border-b-4 border-black bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            {MORPHEUS8_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-xs font-bold text-black transition hover:border-[#E6007E] hover:text-[#E6007E]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <Section id="why" className="scroll-mt-24 border-b-4 border-black bg-white py-12">
          <FadeUp>
            <div className="mx-auto max-w-4xl rounded-3xl border-4 border-black bg-gradient-to-br from-white to-rose-50 p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    {MORPHEUS8_INTRO_SPECIAL.badge}
                  </span>
                  <h2 className="mt-3 text-2xl font-black sm:text-3xl">{MORPHEUS8_INTRO_SPECIAL.title}</h2>
                  <p className="mt-2 max-w-xl font-medium text-black/80">{MORPHEUS8_INTRO_SPECIAL.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-[#E6007E]">{MORPHEUS8_INTRO_SPECIAL.priceLabel}</p>
                  <p className="text-sm font-semibold text-black/55">{MORPHEUS8_INTRO_SPECIAL.priceNote}</p>
                </div>
              </div>
              <div className="mt-6">
                <CTA href={MORPHEUS8_MARKETING.bookHref} variant="gradient">
                  {MORPHEUS8_INTRO_SPECIAL.ctaLabel}
                </CTA>
              </div>
            </div>
          </FadeUp>
        </Section>

        <Section className="border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">Why Morpheus8 Burst</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">The deepest RF microneedling</h2>
          </FadeUp>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MORPHEUS8_WHAT_IT_DOES.map((item, i) => (
              <FadeUp key={item.id} delayMs={i * 50}>
                <article className="flex h-full flex-col rounded-3xl border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.28)]">
                  <p className="text-3xl font-black text-[#E6007E]">{item.stat}</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-black/45">{item.statLabel}</p>
                  <h3 className="mt-3 text-lg font-bold text-[#E6007E]">▸ {item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-black/80">{item.body}</p>
                </article>
              </FadeUp>
            ))}
          </div>
        </Section>

        <Section id="results" className="scroll-mt-24 border-b-4 border-black bg-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">Real results</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Before & after — Morpheus8 Burst + Deep</h2>
            <p className="mt-3 max-w-2xl font-medium text-black/75">
              Real patient photos at Hello Gorgeous Med Spa, Oswego IL. Individual results vary.
            </p>
          </FadeUp>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MORPHEUS8_RESULTS.map((item, i) => (
              <FadeUp key={item.src} delayMs={i * 40}>
                <figure className="overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]">
                  <Image src={item.src} alt={item.alt} width={627} height={490} className="h-auto w-full" />
                  <figcaption className="border-t-2 border-black px-4 py-2 text-sm font-bold text-[#E6007E]">
                    {item.label}
                  </figcaption>
                </figure>
              </FadeUp>
            ))}
          </div>
        </Section>

        <Section id="areas" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">Treatment areas</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Face + body — one platform</h2>
          </FadeUp>
          <div className="mt-8 flex flex-wrap gap-3">
            {MORPHEUS8_TREATMENT_AREAS.map((area) => (
              <span
                key={area}
                className="rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-bold shadow-[3px_3px_0_0_rgba(230,0,126,0.25)]"
              >
                {area}
              </span>
            ))}
          </div>
          <div className="mt-10 overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <Image src={images.bodyTech} alt="Morpheus8 Burst body RF microneedling technology" width={1200} height={630} className="h-auto w-full" />
          </div>
        </Section>

        <Section id="how" className="scroll-mt-24 border-b-4 border-black bg-white py-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <FadeUp>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">How it works</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">Consult to collagen rebuild</h2>
              <ol className="mt-8 space-y-4">
                {MORPHEUS8_STEPS.map((step) => (
                  <li key={step.step} className="rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
                    <div className="flex gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-sm font-black text-white">
                        {step.step}
                      </span>
                      <div>
                        <h3 className="font-bold text-[#E6007E]">▸ {step.title}</h3>
                        <p className="mt-1 text-sm font-medium text-black/80">{step.body}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <Link href={MORPHEUS8_MARKETING.careHref} className="mt-6 inline-flex text-sm font-bold text-[#E6007E] underline">
                Pre & post care guide →
              </Link>
            </FadeUp>
            <FadeUp delayMs={80}>
              <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <Image src={images.verified} alt="Hello Gorgeous verified InMode Morpheus8 provider" width={800} height={600} className="h-auto w-full" />
              </div>
            </FadeUp>
          </div>
        </Section>

        <Section id="pricing" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">Pricing</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Honest packages · free consult first</h2>
          </FadeUp>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MORPHEUS8_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className={`flex h-full flex-col rounded-3xl border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.28)] ${pkg.highlight ? "ring-4 ring-[#E6007E]/30" : ""}`}
              >
                <h3 className="text-lg font-bold text-[#E6007E]">▸ {pkg.name}</h3>
                <p className="mt-2 text-3xl font-black">{pkg.price}</p>
                <p className="text-xs font-semibold text-black/55">{pkg.detail}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm font-medium text-black/80">
                  {pkg.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
                <Link
                  href={"href" in pkg && pkg.href ? pkg.href : MORPHEUS8_MARKETING.bookHref}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-4 py-2.5 text-sm font-bold text-white"
                >
                  {"href" in pkg && pkg.href ? "View specials" : "Book consult"}
                </Link>
              </article>
            ))}
          </div>
        </Section>

        <Section className="border-b-4 border-black bg-black py-12 text-center text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFB8DC]">Pair with Solaria CO₂</p>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">Surface + depth = complete transformation</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Morpheus8 remodels beneath the skin. Solaria resurfaces the surface. Together — VIP Trifecta.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={MORPHEUS8_MARKETING.compareSolariaHref} className="rounded-full border-2 border-white px-6 py-3 font-bold hover:bg-white hover:text-black">
              Explore Solaria CO₂
            </Link>
            <Link href={MORPHEUS8_MARKETING.trifectaHref} className="rounded-full bg-[#E6007E] px-6 py-3 font-bold hover:bg-[#FF2D8E]">
              VIP Trifecta packages
            </Link>
          </div>
        </Section>

        <Section id="faq" className="scroll-mt-24 bg-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">FAQ</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Morpheus8 questions</h2>
          </FadeUp>
          <div className="mt-8 max-w-3xl">
            <FAQAccordion items={MORPHEUS8_FAQS.map((f) => ({ question: f.q, answer: f.a }))} />
          </div>
        </Section>

        <Section className="border-t-4 border-black bg-gradient-to-r from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] py-14 text-center text-white">
          <h2 className="text-3xl font-black">Ready for tighter, smoother skin?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">Free consult · InMode certified · Oswego IL</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CTA href={MORPHEUS8_MARKETING.bookHref} variant="outline" className="!border-white !bg-white !text-[#E6007E]">
              Book free consult
            </CTA>
            <a href={MORPHEUS8_MARKETING.phoneHref} className="inline-flex items-center rounded-full border-2 border-white px-6 py-3 font-bold">
              Call {MORPHEUS8_MARKETING.phoneDisplay}
            </a>
          </div>
        </Section>
      </main>
    </div>
  );
}
