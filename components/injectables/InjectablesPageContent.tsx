"use client";

import Image from "next/image";
import Link from "next/link";

import { FAQAccordion } from "@/components/FAQAccordion";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import {
  INJECTABLES_FAQS,
  INJECTABLES_FILLER_PACKAGES,
  INJECTABLES_INTRO_SPECIAL,
  INJECTABLES_MARKETING,
  INJECTABLES_NEUROTOXIN_PACKAGES,
  INJECTABLES_PAGE_NAV,
  INJECTABLES_STEPS,
  INJECTABLES_TREATMENT_AREAS,
  INJECTABLES_WHAT_IT_DOES,
} from "@/lib/injectables-marketing";

const BRAND = { pink: "#E6007E", pinkHot: "#FF2D8E", rose: "#FFF0F7", dark: "#0a0a0a" };

export function InjectablesPageContent() {
  const { images } = INJECTABLES_MARKETING;

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
                {INJECTABLES_MARKETING.eyebrow}
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
                Oswego · Naperville · Aurora · Fox Valley
              </p>
              <h1 className="mt-3 font-black text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                Botox &{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  Fillers
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                {INJECTABLES_MARKETING.subhead}
              </p>
              <p className="mt-3 text-sm text-[#FFB8DC]">{INJECTABLES_MARKETING.trustLine}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTA href={INJECTABLES_MARKETING.bookHref} variant="gradient">
                  Book free consult
                </CTA>
                <CTA href="#pricing" variant="outline" className="!border-white !text-white hover:!bg-white/10">
                  See pricing
                </CTA>
              </div>
            </FadeUp>
            <FadeUp delayMs={80}>
              <div className="mx-auto w-full max-w-lg overflow-hidden rounded-3xl border-4 border-black bg-gradient-to-br from-[#2d1020] to-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] lg:max-w-none">
                <div className="relative aspect-square w-full p-8">
                  <Image
                    src={images.hero}
                    alt="Authentic Botox Cosmetic vial — Hello Gorgeous Med Spa Oswego"
                    fill
                    className="object-contain p-4"
                    priority
                  />
                </div>
              </div>
            </FadeUp>
          </div>
        </Section>

        <nav className="sticky top-0 z-20 border-b-4 border-black bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            {INJECTABLES_PAGE_NAV.map((item) => (
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
                    {INJECTABLES_INTRO_SPECIAL.badge}
                  </span>
                  <h2 className="mt-3 text-2xl font-black sm:text-3xl">{INJECTABLES_INTRO_SPECIAL.title}</h2>
                  <p className="mt-2 max-w-xl font-medium text-black/80">{INJECTABLES_INTRO_SPECIAL.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-[#E6007E]">{INJECTABLES_INTRO_SPECIAL.priceLabel}</p>
                  <p className="text-sm font-semibold text-black/55">{INJECTABLES_INTRO_SPECIAL.priceNote}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <CTA href={INJECTABLES_MARKETING.bookHref} variant="gradient">
                  {INJECTABLES_INTRO_SPECIAL.ctaLabel}
                </CTA>
                <Link
                  href={INJECTABLES_MARKETING.compareNeurotoxinsHref}
                  className="inline-flex items-center rounded-full border-2 border-black px-5 py-2.5 text-sm font-bold hover:border-[#E6007E] hover:text-[#E6007E]"
                >
                  Compare all 5 brands →
                </Link>
              </div>
            </div>
          </FadeUp>
        </Section>

        <Section className="border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">Why Hello Gorgeous</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Medical injectables, natural results</h2>
          </FadeUp>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INJECTABLES_WHAT_IT_DOES.map((item, i) => (
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

        <Section id="neurotoxins" className="scroll-mt-24 border-b-4 border-black bg-white py-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <FadeUp>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">Neurotoxins</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">All 5 brands — one honest menu</h2>
              <p className="mt-3 max-w-xl font-medium text-black/75">
                Dynamic wrinkles, preventative baby tox, masseter slimming & lip flip — mapped to your anatomy at consult.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {INJECTABLES_NEUROTOXIN_PACKAGES.map((pkg) => (
                  <article
                    key={pkg.id}
                    className="rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]"
                  >
                    <h3 className="font-bold text-[#E6007E]">{pkg.name}</h3>
                    <p className="text-2xl font-black">{pkg.price}</p>
                    {pkg.detail && <p className="text-xs font-semibold text-black/55">{pkg.detail}</p>}
                    {pkg.href && (
                      <Link href={pkg.href} className="mt-2 inline-flex text-xs font-bold text-[#E6007E] underline">
                        Learn more →
                      </Link>
                    )}
                  </article>
                ))}
              </div>
              <Link
                href={INJECTABLES_MARKETING.compareNeurotoxinsHref}
                className="mt-6 inline-flex text-sm font-bold text-[#E6007E] underline"
              >
                Botox vs Dysport vs Jeuveau vs Xeomin vs Daxxify →
              </Link>
            </FadeUp>
            <FadeUp delayMs={80}>
              <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <Image
                  src={images.depthRef}
                  alt="Skin layers and injection depth reference for neurotoxins and fillers"
                  width={800}
                  height={600}
                  className="h-auto w-full"
                />
              </div>
            </FadeUp>
          </div>
        </Section>

        <Section id="fillers" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">Dermal & lip fillers</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Volume, definition & balance</h2>
            <p className="mt-3 max-w-2xl font-medium text-black/75">
              Premium HA fillers for lips, cheeks, jawline & more — with Lip Studio AI preview and 2-week follow-up included.
            </p>
          </FadeUp>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <FadeUp>
              <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <Image
                  src={images.lipPromo}
                  alt="Lip filler at Hello Gorgeous Med Spa — natural enhancement Oswego IL"
                  width={800}
                  height={1000}
                  className="h-auto w-full"
                />
              </div>
            </FadeUp>
            <FadeUp delayMs={60}>
              <div className="flex flex-wrap gap-3">
                {INJECTABLES_TREATMENT_AREAS.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-bold shadow-[3px_3px_0_0_rgba(230,0,126,0.25)]"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href={INJECTABLES_MARKETING.lipStudioHref}
                  className="inline-flex rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-3 text-sm font-extrabold text-white"
                >
                  Try Lip Studio AI preview →
                </Link>
              </div>
            </FadeUp>
          </div>
        </Section>

        <Section id="how" className="scroll-mt-24 border-b-4 border-black bg-white py-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <FadeUp>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">How it works</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">Consult to gorgeous</h2>
              <ol className="mt-8 space-y-4">
                {INJECTABLES_STEPS.map((step) => (
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
            </FadeUp>
            <FadeUp delayMs={80}>
              <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <Image
                  src={images.menuPoster}
                  alt="Hello Gorgeous injectables menu — Botox, fillers and lip studio"
                  width={800}
                  height={1000}
                  className="h-auto w-full"
                />
              </div>
            </FadeUp>
          </div>
        </Section>

        <Section id="pricing" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">Pricing</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Honest menu · free consult first</h2>
          </FadeUp>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INJECTABLES_FILLER_PACKAGES.map((pkg) => (
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
                  href={pkg.href}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-4 py-2.5 text-sm font-bold text-white"
                >
                  Learn more
                </Link>
              </article>
            ))}
          </div>
        </Section>

        <Section className="border-b-4 border-black bg-black py-12 text-center text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFB8DC]">Pair with advanced skin</p>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">Injectables + InMode Trifecta</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Volume and lines from fillers & Botox — texture and tightening from Morpheus8 & Solaria CO₂.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={INJECTABLES_MARKETING.morpheus8Href} className="rounded-full border-2 border-white px-6 py-3 font-bold hover:bg-white hover:text-black">
              Explore Morpheus8
            </Link>
            <Link href="/services/solaria-co2" className="rounded-full bg-[#E6007E] px-6 py-3 font-bold hover:bg-[#FF2D8E]">
              Solaria CO₂
            </Link>
          </div>
        </Section>

        <Section id="faq" className="scroll-mt-24 bg-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">FAQ</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Injectables questions</h2>
          </FadeUp>
          <div className="mt-8 max-w-3xl">
            <FAQAccordion items={INJECTABLES_FAQS.map((f) => ({ question: f.q, answer: f.a }))} />
          </div>
        </Section>

        <Section className="border-t-4 border-black bg-gradient-to-r from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] py-14 text-center text-white">
          <h2 className="text-3xl font-black">Ready for your consult?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">Botox $10/unit · lip filler $450 · NP-led · Oswego IL</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CTA href={INJECTABLES_MARKETING.bookHref} variant="outline" className="!border-white !bg-white !text-[#E6007E]">
              Book free consult
            </CTA>
            <a href={INJECTABLES_MARKETING.phoneHref} className="inline-flex items-center rounded-full border-2 border-white px-6 py-3 font-bold">
              Call {INJECTABLES_MARKETING.phoneDisplay}
            </a>
          </div>
        </Section>
      </main>
    </div>
  );
}
