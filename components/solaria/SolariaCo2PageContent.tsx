"use client";

import Image from "next/image";
import Link from "next/link";

import { FAQAccordion } from "@/components/FAQAccordion";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import {
  SOLARIA_FAQS,
  SOLARIA_LAUNCH_SPECIAL,
  SOLARIA_MARKETING,
  SOLARIA_NAV,
  SOLARIA_PACKAGES,
  SOLARIA_RESULTS,
  SOLARIA_STEPS,
  SOLARIA_TREATS,
  SOLARIA_WHAT_IT_DOES,
} from "@/lib/solaria-marketing";

const BRAND = { pink: "#E6007E", pinkHot: "#FF2D8E", rose: "#FFF0F7", dark: "#0a0a0a" };

export function SolariaCo2PageContent() {
  const { images } = SOLARIA_MARKETING;

  return (
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 35%, #fafafa 100%)
          `,
        }}
      />

      <main className="min-w-0">
        <Section className="relative border-b-4 border-black py-14 lg:py-20 !px-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1020] via-black to-[#2d1020] opacity-95" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <FadeUp>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#FFB8DC] backdrop-blur">
                {SOLARIA_MARKETING.eyebrow}
              </span>
              <h1 className="mt-5 font-black text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                Solaria{" "}
                <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent" style={{ WebkitBackgroundClip: "text" }}>
                  CO₂ laser
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">{SOLARIA_MARKETING.subhead}</p>
              <p className="mt-3 text-sm text-[#FFB8DC]">{SOLARIA_MARKETING.trustLine}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTA href={SOLARIA_MARKETING.bookHref} variant="gradient">Book free consult</CTA>
                <CTA href="#pricing" variant="outline" className="!border-white !text-white hover:!bg-white/10">See launch special</CTA>
              </div>
            </FadeUp>
            <FadeUp delayMs={80}>
              <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <Image src={images.workstation} alt="InMode Solaria CO2 laser at Hello Gorgeous Med Spa" width={1024} height={768} className="h-auto w-full object-cover" priority />
              </div>
            </FadeUp>
          </div>
        </Section>

        <nav className="sticky top-0 z-20 border-b-4 border-black bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
            {SOLARIA_NAV.map((item) => (
              <a key={item.href} href={item.href} className="shrink-0 rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-xs font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]">
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <Section id="why" className="scroll-mt-24 border-b-4 border-black bg-white py-12">
          <FadeUp>
            <div className="mx-auto max-w-4xl rounded-3xl border-4 border-black bg-gradient-to-br from-white to-rose-50 p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] sm:p-8">
              <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-[11px] font-bold uppercase text-white">{SOLARIA_LAUNCH_SPECIAL.badge}</span>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">{SOLARIA_LAUNCH_SPECIAL.title}</h2>
              <p className="mt-2 font-medium text-black/80">{SOLARIA_LAUNCH_SPECIAL.description}</p>
              <p className="mt-4 text-4xl font-black text-[#E6007E]">{SOLARIA_LAUNCH_SPECIAL.priceLabel}</p>
              <p className="text-sm text-black/55">{SOLARIA_LAUNCH_SPECIAL.priceNote}</p>
              <div className="mt-6"><CTA href={SOLARIA_MARKETING.bookHref} variant="gradient">{SOLARIA_LAUNCH_SPECIAL.ctaLabel}</CTA></div>
            </div>
          </FadeUp>
        </Section>

        <Section className="border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SOLARIA_WHAT_IT_DOES.map((item, i) => (
              <FadeUp key={item.id} delayMs={i * 50}>
                <article className="rounded-3xl border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.28)]">
                  <p className="text-3xl font-black text-[#E6007E]">{item.stat}</p>
                  <h3 className="mt-3 font-bold text-[#E6007E]">▸ {item.title}</h3>
                  <p className="mt-2 text-sm font-medium text-black/80">{item.body}</p>
                </article>
              </FadeUp>
            ))}
          </div>
        </Section>

        <Section
          id="technology"
          className="scroll-mt-24 border-b-4 border-black bg-black py-14 text-white"
          aria-label="InMode Solaria technology overview"
        >
          <FadeUp>
            <p className="text-center text-xs font-bold uppercase tracking-widest text-[#FFB8DC]">
              InMode manufacturer
            </p>
            <h2 className="mt-2 text-center text-3xl font-black md:text-4xl">What is Solaria?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-white/80 sm:text-base">
              Solaria by InMode fractional CO₂ is indicated for ablative skin resurfacing — precise
              microbeam treatments with faster healing than traditional full-field resurfacing.
            </p>
            <figure className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl border-4 border-white/80 bg-white">
              <div className="relative aspect-[1024/477] w-full">
                <Image
                  src={images.inmodeOverview}
                  alt="InMode Solaria CO₂ workstation with key benefits — fractional ablative skin resurfacing at Hello Gorgeous Med Spa, Oswego IL"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 896px"
                  loading="lazy"
                />
              </div>
              <figcaption className="border-t border-black/10 bg-white px-4 py-3 text-center text-xs text-black/60 sm:text-sm">
                Manufacturer education graphic. Solaria and InMode are trademarks of InMode Ltd.
              </figcaption>
            </figure>
            <p className="mt-6 text-center text-sm text-white/85">
              <a
                href={SOLARIA_MARKETING.inmodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#FFB8DC] underline decoration-[#E6007E] underline-offset-2 hover:text-white"
              >
                Learn more on InMode.com
              </a>
              <span> — official Solaria workstation page (opens in a new tab)</span>
            </p>
          </FadeUp>
        </Section>

        <Section id="results" className="scroll-mt-24 border-b-4 border-black bg-white py-14">
          <h2 className="text-3xl font-black">Real Solaria CO₂ results</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {SOLARIA_RESULTS.map((item) => (
              <figure key={item.src} className="overflow-hidden rounded-3xl border-4 border-black shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]">
                <Image src={item.src} alt={item.alt} width={800} height={600} className="h-auto w-full" />
                <figcaption className="border-t-2 border-black px-4 py-2 text-sm font-bold text-[#E6007E]">{item.label}</figcaption>
              </figure>
            ))}
          </div>
        </Section>

        <Section id="treats" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
          <h2 className="text-3xl font-black">What Solaria treats</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {SOLARIA_TREATS.map((t) => (
              <span key={t} className="rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-bold">{t}</span>
            ))}
          </div>
        </Section>

        <Section id="how" className="scroll-mt-24 border-b-4 border-black bg-white py-14">
          <ol className="mt-6 space-y-4 max-w-2xl">
            {SOLARIA_STEPS.map((step) => (
              <li key={step.step} className="rounded-2xl border-2 border-black p-4">
                <span className="font-black text-[#E6007E]">{step.step}.</span> <strong>{step.title}</strong> — {step.body}
              </li>
            ))}
          </ol>
          <Link href={SOLARIA_MARKETING.careHref} className="mt-6 inline-flex text-sm font-bold text-[#E6007E] underline">Pre & post care →</Link>
        </Section>

        <Section id="pricing" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SOLARIA_PACKAGES.map((pkg) => (
              <article key={pkg.id} className={`rounded-3xl border-4 border-black bg-white p-5 ${pkg.highlight ? "ring-4 ring-[#E6007E]/30" : ""}`}>
                <h3 className="font-bold text-[#E6007E]">{pkg.name}</h3>
                <p className="text-3xl font-black">{pkg.price}</p>
                <ul className="mt-3 space-y-1 text-sm">{pkg.bullets.map((b) => <li key={b}>• {b}</li>)}</ul>
                <Link href={"href" in pkg && pkg.href ? pkg.href : SOLARIA_MARKETING.bookHref} className="mt-4 inline-block rounded-full bg-[#E6007E] px-4 py-2 text-sm font-bold text-white">Book / view</Link>
              </article>
            ))}
          </div>
        </Section>

        <Section className="border-b-4 border-black bg-black py-12 text-center text-white">
          <h2 className="text-2xl font-black">Pair with Morpheus8 Burst</h2>
          <div className="mt-4 flex justify-center gap-3">
            <Link href={SOLARIA_MARKETING.compareMorpheusHref} className="rounded-full border-2 border-white px-6 py-3 font-bold">Explore Morpheus8</Link>
            <Link href={SOLARIA_MARKETING.trifectaHref} className="rounded-full bg-[#E6007E] px-6 py-3 font-bold">VIP Trifecta</Link>
          </div>
        </Section>

        <Section id="faq" className="scroll-mt-24 py-14">
          <FAQAccordion items={SOLARIA_FAQS.map((f) => ({ question: f.q, answer: f.a }))} />
        </Section>

        <Section className="border-t-4 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] py-14 text-center text-white">
          <h2 className="text-3xl font-black">Reveal your best skin</h2>
          <CTA href={SOLARIA_MARKETING.bookHref} variant="outline" className="mt-6 !border-white !bg-white !text-[#E6007E]">Book free consult</CTA>
        </Section>
      </main>
    </div>
  );
}
