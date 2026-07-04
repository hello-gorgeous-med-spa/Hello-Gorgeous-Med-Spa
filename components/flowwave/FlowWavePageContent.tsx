import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import {
  FLOWWAVE_FAQS,
  FLOWWAVE_INTRO_SPECIAL,
  FLOWWAVE_MARKETING,
  FLOWWAVE_MENS_PACKAGES,
  FLOWWAVE_PACKAGES,
  FLOWWAVE_STEPS,
  FLOWWAVE_TREATS,
  FLOWWAVE_WHAT_IT_DOES,
} from "@/lib/flowwave-marketing";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

export function FlowWavePageContent() {
  const { images } = FLOWWAVE_MARKETING;

  return (
    <div className="relative min-h-[100dvh]">
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
        <Section className="relative border-b-4 border-black py-14 lg:py-20 !px-0">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 50% 60% at 80% 40%, ${BRAND.pink}44 0%, transparent 55%),
                radial-gradient(ellipse 40% 50% at 20% 80%, ${BRAND.pinkHot}33 0%, transparent 50%)
              `,
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />

          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <FadeUp>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#FFB8DC] backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E6007E]" />
                {FLOWWAVE_MARKETING.eyebrow}
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
                Oswego · Naperville · Aurora · Fox Valley
              </p>
              <h1 className="mt-3 font-black text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                FlowWave{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  shockwave therapy
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                {FLOWWAVE_MARKETING.subhead}
              </p>
              <p className="mt-3 text-sm text-[#FFB8DC]">{FLOWWAVE_MARKETING.trustLine}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTA href={FLOWWAVE_MARKETING.bookHref} variant="gradient">
                  Book free consult
                </CTA>
                <CTA href="#pricing" variant="outline" className="!border-white !text-white hover:!bg-white/10">
                  See pricing
                </CTA>
                <a
                  href={FLOWWAVE_MARKETING.phoneHref}
                  className="inline-flex items-center text-sm font-semibold text-[#FFB8DC] underline decoration-[#E6007E] underline-offset-4"
                >
                  Call {FLOWWAVE_MARKETING.phoneDisplay}
                </a>
              </div>
            </FadeUp>

            <FadeUp delayMs={80}>
              <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <Image
                  src={images.providerHero}
                  alt="Hello Gorgeous provider with FlowWave FOCUS shockwave therapy device"
                  width={1024}
                  height={1536}
                  className="h-auto w-full object-cover object-top"
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Jump nav */}
        <nav className="sticky top-0 z-20 border-b-4 border-black bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            {[
              { href: "#what-it-does", label: "What it does" },
              { href: "#how-it-works", label: "How it works" },
              { href: "#treats", label: "What it treats" },
              { href: "#pricing", label: "Pricing" },
              { href: "#faq", label: "FAQ" },
            ].map((item) => (
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

        {/* Intro special */}
        <Section className="scroll-mt-24 border-b-4 border-black bg-white py-12">
          <FadeUp>
            <div className="mx-auto max-w-4xl rounded-3xl border-4 border-black bg-gradient-to-br from-white to-rose-50 p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    {FLOWWAVE_INTRO_SPECIAL.badge}
                  </span>
                  <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                    {FLOWWAVE_INTRO_SPECIAL.title}
                  </h2>
                  <p className="mt-2 max-w-xl text-black/80 font-medium">
                    {FLOWWAVE_INTRO_SPECIAL.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-[#E6007E]">
                    {FLOWWAVE_INTRO_SPECIAL.priceLabel}
                  </p>
                  <p className="text-sm font-semibold text-black/55">
                    {FLOWWAVE_INTRO_SPECIAL.priceNote}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <CTA href={FLOWWAVE_MARKETING.bookHref} variant="gradient">
                  {FLOWWAVE_INTRO_SPECIAL.ctaLabel}
                </CTA>
              </div>
            </div>
          </FadeUp>
        </Section>

        {/* What it does — 4 col */}
        <Section
          id="what-it-does"
          className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14"
        >
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">
              What it does
            </p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              The FlowWave difference
            </h2>
          </FadeUp>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FLOWWAVE_WHAT_IT_DOES.map((item, i) => (
              <FadeUp key={item.id} delayMs={i * 50}>
                <article className="flex h-full flex-col rounded-3xl border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.28)]">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-sm font-black text-white">
                    {i + 1}
                  </span>
                  <p className="mt-4 text-3xl font-black text-[#E6007E]">{item.stat}</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-black/45">
                    {item.statLabel}
                  </p>
                  <h3 className="mt-3 text-lg font-bold text-[#E6007E]">▸ {item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-black/80">
                    {item.body}
                  </p>
                </article>
              </FadeUp>
            ))}
          </div>
        </Section>

        {/* How it works */}
        <Section id="how-it-works" className="scroll-mt-24 border-b-4 border-black bg-white py-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <FadeUp>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">
                How it works
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Simple, fast, NP-directed
              </h2>
              <ol className="mt-8 space-y-4">
                {FLOWWAVE_STEPS.map((step) => (
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
            </FadeUp>
            <FadeUp delayMs={80}>
              <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <Image
                  src={images.recoveryBanner}
                  alt="FlowWave shockwave recovery — target pain, stimulate healing"
                  width={1672}
                  height={941}
                  className="h-auto w-full"
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* What it treats */}
        <Section
          id="treats"
          className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14"
        >
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">
              What it treats
            </p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              One device, many areas
            </h2>
            <p className="mt-3 max-w-2xl font-medium text-black/75">
              Target pain and support the body&apos;s own healing across 150+ preset treatment zones
              on the FlowWave™ FOCUS.
            </p>
          </FadeUp>
          <div className="mt-8 flex flex-wrap gap-3">
            {FLOWWAVE_TREATS.map((area) => (
              <span
                key={area}
                className="rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-bold shadow-[3px_3px_0_0_rgba(230,0,126,0.25)]"
              >
                {area}
              </span>
            ))}
          </div>
          <div className="mt-10 overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <Image
              src={images.zonesBanner}
              alt="FlowWave treatment zones across the body"
              width={1708}
              height={920}
              className="h-auto w-full"
              sizes="100vw"
            />
          </div>
        </Section>

        {/* Pricing */}
        <Section id="pricing" className="scroll-mt-24 border-b-4 border-black bg-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">Pricing</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Simple, honest packages</h2>
            <p className="mt-3 max-w-2xl font-medium text-black/75">
              Start with our intro offer, then save more with a package. Every plan begins with a free
              medical screening.
            </p>
          </FadeUp>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FLOWWAVE_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className={`flex h-full flex-col rounded-3xl border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.28)] ${
                  pkg.highlight ? "ring-4 ring-[#E6007E]/30" : ""
                }`}
              >
                {pkg.highlight ? (
                  <span className="mb-2 inline-flex self-start rounded-full bg-[#E6007E] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    Most popular
                  </span>
                ) : null}
                <h3 className="text-lg font-bold text-[#E6007E]">▸ {pkg.name}</h3>
                <p className="mt-2 text-3xl font-black">{pkg.price}</p>
                <p className="text-xs font-semibold text-black/55">{pkg.detail}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm font-medium text-black/80">
                  {pkg.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
                <Link
                  href={FLOWWAVE_MARKETING.bookHref}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-4 py-2.5 text-sm font-bold text-white"
                >
                  Choose plan
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-center">
            <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <Image
                src={images.mensBanner}
                alt="Men's shockwave therapy — ED treatment, fast, non-invasive, no downtime"
                width={1672}
                height={941}
                className="h-auto w-full"
                sizes="(max-width: 1024px) 100vw, 520px"
              />
            </div>
            <div>
              <h3 className="text-2xl font-black">Men&apos;s wellness programs</h3>
              <p className="mt-2 font-medium text-black/75">
                Private, provider-directed, and fully confidential.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {FLOWWAVE_MENS_PACKAGES.map((pkg) => (
                  <article
                    key={pkg.id}
                    className="rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]"
                  >
                    <h4 className="font-bold text-[#E6007E]">▸ {pkg.name}</h4>
                    <p className="mt-1 text-2xl font-black">{pkg.price}</p>
                    <p className="text-xs font-semibold text-black/55">{pkg.detail}</p>
                    <ul className="mt-3 space-y-1 text-sm text-black/80">
                      {pkg.bullets.map((b) => (
                        <li key={b}>• {b}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section id="faq" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">FAQ</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Good to know</h2>
          </FadeUp>
          <div className="mx-auto mt-8 max-w-3xl space-y-4">
            {FLOWWAVE_FAQS.map((item, i) => (
              <article
                key={item.q}
                className="rounded-3xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-xs font-black text-white">
                    {i + 1}
                  </span>
                  <h3 className="font-bold text-[#E6007E]">▸ {item.q}</h3>
                </div>
                <p className="text-sm font-medium leading-relaxed text-black/85">{item.a}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* Closing CTA */}
        <section
          className="relative overflow-hidden border-b-4 border-black px-4 py-16 text-center text-white sm:px-6"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-black sm:text-4xl">Ready for real relief?</h2>
            <p className="mt-3 text-white/90">
              Book your free consultation in Oswego, IL — serving Naperville, Aurora, Plainfield &amp;
              Yorkville.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <CTA href={FLOWWAVE_MARKETING.bookHref} className="!bg-white !text-[#E6007E] hover:!bg-rose-50">
                Book free consult
              </CTA>
              <a
                href={FLOWWAVE_MARKETING.phoneHref}
                className="inline-flex items-center justify-center rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Call {FLOWWAVE_MARKETING.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
