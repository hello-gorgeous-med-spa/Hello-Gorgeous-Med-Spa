"use client";

import Image from "next/image";
import Link from "next/link";

import { FAQAccordion } from "@/components/FAQAccordion";
import { CTA } from "@/components/CTA";
import { InjectablesTreatPicker } from "@/components/injectables/InjectablesTreatPicker";
import { FadeUp, Section } from "@/components/Section";
import {
  INJECTABLES_FAQS,
  INJECTABLES_FILLER_PACKAGES,
  INJECTABLES_INTRO_SPECIAL,
  INJECTABLES_MARKETING,
  INJECTABLES_PAGE_NAV,
  INJECTABLES_STEPS,
  INJECTABLES_TREATMENT_AREAS,
  INJECTABLES_WHAT_IT_DOES,
} from "@/lib/injectables-marketing";
import { INJECTABLES_BRAND_CARDS } from "@/lib/injectables-treat-goals";

const BRAND = { pink: "#E6007E", pinkHot: "#FF2D8E", rose: "#FFF0F7", dark: "#0a0a0a" };

export function InjectablesPageContent() {
  const { images } = INJECTABLES_MARKETING;

  return (
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}22 0%, transparent 55%),
            radial-gradient(ellipse 50% 35% at 100% 20%, ${BRAND.pinkHot}14 0%, transparent 50%),
            linear-gradient(180deg, #ffffff 0%, ${BRAND.rose} 40%, #ffffff 100%)
          `,
        }}
      />

      <main className="min-w-0">
        {/* Mockup-style conversion hero — no FadeUp (opacity:0 hides LCP hero) */}
        <Section className="border-b-4 border-black !bg-transparent py-10 lg:py-14">
          <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8">
            <div className="relative min-h-[420px] overflow-hidden rounded-[1.75rem] border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.28)] sm:min-h-[520px]">
              <Image
                src={images.hero}
                alt="Botox and fillers — medical aesthetics at Hello Gorgeous Med Spa Oswego"
                fill
                priority
                className="object-cover object-[center_28%]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                <span className="inline-flex w-fit rounded-full bg-[#E6007E] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                  Medical aesthetics
                </span>
                <h1 className="mt-4 font-serif text-4xl font-black leading-[1.05] text-white sm:text-5xl">
                  Your First Botox Treatment
                </h1>
                <p className="mt-3 text-lg font-bold text-white">
                  Starting at $10 Per Unit
                </p>
                <p className="mt-1 text-sm font-medium text-white/80">
                  Custom plan set at your free consultation.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <CTA href="#pricing" variant="gradient">
                    Get pricing →
                  </CTA>
                  <CTA
                    href={INJECTABLES_MARKETING.bookHref}
                    variant="outline"
                    className="!border-white !text-white hover:!bg-white/10"
                  >
                    Book free consult
                  </CTA>
                </div>
              </div>
            </div>
            <InjectablesTreatPicker />
          </div>
        </Section>

        <nav className="sticky top-0 z-20 border-b-4 border-black bg-white/80 backdrop-blur">
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

        {/* Clinic video + stills from the Botox landing build */}
        <Section id="clinic" className="scroll-mt-24 border-b-4 border-black bg-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">In our Oswego clinic</p>
            <h2 className="mt-2 font-serif text-3xl font-black sm:text-4xl">See the experience</h2>
            <p className="mt-3 max-w-2xl font-medium text-black/70">
              Silent HD clinic footage from real Hello Gorgeous visits — the same care behind every neurotoxin and filler appointment.
            </p>
          </FadeUp>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <FadeUp>
              <div className="overflow-hidden rounded-3xl border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <video
                  className="aspect-[9/16] max-h-[70vh] w-full object-cover md:aspect-video md:max-h-none"
                  controls
                  playsInline
                  preload="metadata"
                  poster="/videos/botox/botox-clinic-slideshow-poster.jpg"
                >
                  <source src="/videos/botox/botox-clinic-slideshow.mp4" type="video/mp4" />
                </video>
              </div>
            </FadeUp>
            <FadeUp delayMs={60}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]"
                  >
                    <Image
                      src={`/images/botox/slideshow/0${n}.jpg`}
                      alt={`Botox clinic still ${n} — Hello Gorgeous Med Spa Oswego`}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm font-medium text-black/60">
                NP-directed · authentic product · you approve every unit and syringe.
              </p>
            </FadeUp>
          </div>
        </Section>

        <Section id="why" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
          <FadeUp>
            <div className="mx-auto max-w-4xl rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] sm:p-8">
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

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Brand subpages */}
        <Section id="brands" className="scroll-mt-24 border-b-4 border-black bg-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">Neurotoxin brands</p>
            <h2 className="mt-2 font-serif text-3xl font-black sm:text-4xl">All 5 brands we offer</h2>
            <p className="mt-3 max-w-2xl font-medium text-black/70">
              Pick a brand to learn more — or start with your treatment goals above and we’ll recommend the best fit at consult.
            </p>
          </FadeUp>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INJECTABLES_BRAND_CARDS.map((brand, i) => (
              <FadeUp key={brand.id} delayMs={i * 40}>
                <Link
                  href={brand.href}
                  className="flex h-full flex-col rounded-3xl border-4 border-black bg-gradient-to-br from-white to-rose-50 p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.28)] transition hover:-translate-y-0.5"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">Neurotoxin</p>
                  <h3 className="mt-1 font-serif text-2xl font-black text-black">{brand.name}</h3>
                  <p className="mt-2 text-2xl font-black text-[#E6007E]">{brand.price}</p>
                  {"note" in brand && brand.note ? (
                    <p className="text-xs font-semibold text-black/50">{brand.note}</p>
                  ) : null}
                  <p className="mt-3 flex-1 text-sm font-medium text-black/75">{brand.blurb}</p>
                  <span className="mt-4 text-sm font-extrabold text-[#E6007E]">Learn more →</span>
                </Link>
              </FadeUp>
            ))}
          </div>
        </Section>

        <Section id="fillers" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <FadeUp>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">Dermal & lip fillers</p>
              <h2 className="mt-2 font-serif text-3xl font-black sm:text-4xl">Volume, definition & balance</h2>
              <p className="mt-3 max-w-xl font-medium text-black/75">
                Premium HA fillers for lips, cheeks, jawline & more — with Lip Studio AI preview and 2-week follow-up included.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {INJECTABLES_TREATMENT_AREAS.slice(0, 8).map((area) => (
                  <span
                    key={area}
                    className="rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-bold shadow-[3px_3px_0_0_rgba(230,0,126,0.25)]"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={INJECTABLES_MARKETING.lipFillerHref}
                  className="inline-flex rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-3 text-sm font-extrabold text-white"
                >
                  Lip filler →
                </Link>
                <Link
                  href={INJECTABLES_MARKETING.dermalFillersHref}
                  className="inline-flex rounded-full border-2 border-black px-6 py-3 text-sm font-extrabold hover:border-[#E6007E] hover:text-[#E6007E]"
                >
                  Dermal fillers →
                </Link>
                <Link
                  href={INJECTABLES_MARKETING.lipStudioHref}
                  className="inline-flex rounded-full border-2 border-[#E6007E] px-6 py-3 text-sm font-extrabold text-[#E6007E]"
                >
                  Lip Studio preview →
                </Link>
              </div>
            </FadeUp>
            <FadeUp delayMs={60}>
              <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <Image
                  src={images.lipPromo}
                  alt="Lip filler at Hello Gorgeous Med Spa — natural enhancement Oswego IL"
                  width={900}
                  height={1100}
                  className="h-auto w-full"
                />
              </div>
            </FadeUp>
          </div>
        </Section>

        <Section id="how" className="scroll-mt-24 border-b-4 border-black bg-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">How it works</p>
            <h2 className="mt-2 font-serif text-3xl font-black sm:text-4xl">Consult to gorgeous</h2>
          </FadeUp>
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {INJECTABLES_STEPS.map((step) => (
              <li
                key={step.step}
                className="rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]"
              >
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
        </Section>

        <Section id="pricing" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">Pricing</p>
            <h2 className="mt-2 font-serif text-3xl font-black sm:text-4xl">Honest menu · free consult first</h2>
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
          <h2 className="mt-3 font-serif text-2xl font-black sm:text-3xl">Injectables + InMode Trifecta</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Volume and lines from fillers & Botox — texture and tightening from Morpheus8 & Solaria CO₂.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={INJECTABLES_MARKETING.morpheus8Href}
              className="rounded-full border-2 border-white px-6 py-3 font-bold hover:bg-white hover:text-black"
            >
              Explore Morpheus8
            </Link>
            <Link
              href="/services/solaria-co2"
              className="rounded-full bg-[#E6007E] px-6 py-3 font-bold hover:bg-[#FF2D8E]"
            >
              Solaria CO₂
            </Link>
          </div>
        </Section>

        <Section id="faq" className="scroll-mt-24 bg-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">FAQ</p>
            <h2 className="mt-2 font-serif text-3xl font-black sm:text-4xl">Injectables questions</h2>
          </FadeUp>
          <div className="mt-8 max-w-3xl">
            <FAQAccordion items={INJECTABLES_FAQS.map((f) => ({ question: f.q, answer: f.a }))} />
          </div>
        </Section>

        <Section className="border-t-4 border-black bg-gradient-to-r from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] py-14 text-center text-white">
          <h2 className="font-serif text-3xl font-black">Ready for your consult?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">
            Botox $10/unit · lip filler $450 · NP-led · Oswego IL
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CTA
              href={INJECTABLES_MARKETING.bookHref}
              variant="outline"
              className="!border-white !bg-white !text-[#E6007E]"
            >
              Book free consult
            </CTA>
            <a
              href={INJECTABLES_MARKETING.phoneHref}
              className="inline-flex items-center rounded-full border-2 border-white px-6 py-3 font-bold"
            >
              Call {INJECTABLES_MARKETING.phoneDisplay}
            </a>
          </div>
        </Section>
      </main>
    </div>
  );
}
