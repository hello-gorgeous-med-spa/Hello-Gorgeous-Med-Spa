"use client";

import Image from "next/image";
import Link from "next/link";

import {
  JOURNEY_HERO_BG,
  JOURNEY_SECTION_BG_A,
  JOURNEY_SECTION_BG_B,
  JourneyChip,
  JourneyDarkCard,
  JourneyEyebrow,
  JourneyGhostBtn,
  JourneyPinkBtn,
  JourneySectionHead,
  JourneyTrustBar,
  JourneyVideoFrame,
} from "@/components/marketing/JourneyPageUi";
import { FadeUp } from "@/components/Section";
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

export function Morpheus8PageContent() {
  const { images } = MORPHEUS8_MARKETING;

  return (
    <div className="relative min-h-[100dvh] bg-black text-white">
      <main className="min-w-0">
        <header className={JOURNEY_HERO_BG}>
          <div
            className="pointer-events-none absolute -right-28 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,45,142,0.28),transparent_62%)]"
            aria-hidden
          />
          <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-24">
            <div>
              <JourneyEyebrow>{MORPHEUS8_MARKETING.eyebrow} · Oswego, IL</JourneyEyebrow>
              <h1 className="mt-4 font-serif text-[44px] font-bold leading-[1.02] text-white lg:text-[66px]">
                Morpheus8{" "}
                <span className="text-[#FF2D8E]">Burst + Deep</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80 lg:text-xl">
                {MORPHEUS8_MARKETING.subhead}
              </p>
              <p className="mt-3 text-sm text-white/60">{MORPHEUS8_MARKETING.trustLine}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <JourneyPinkBtn href={MORPHEUS8_MARKETING.bookHref}>Book free consult</JourneyPinkBtn>
                <JourneyGhostBtn href="#pricing">See pricing</JourneyGhostBtn>
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {["InMode verified", "Up to 8mm depth", "Face + body"].map((chip) => (
                  <JourneyChip key={chip}>{chip}</JourneyChip>
                ))}
              </div>
            </div>
            <JourneyVideoFrame
              src={MORPHEUS8_MARKETING.scienceVideo}
              label="Morpheus8 RF microneedling — cellular science animation at Hello Gorgeous Med Spa"
              poster={images.hero}
              className="lg:max-w-lg"
            />
          </div>
        </header>
        <JourneyTrustBar />

        <nav className="sticky top-0 z-20 border-b border-white/10 bg-black/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1200px] gap-2 overflow-x-auto px-6 py-3">
            {MORPHEUS8_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white/80 transition hover:border-[#FF2D8E] hover:text-[#FF2D8E]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <section id="why" className={`scroll-mt-24 ${JOURNEY_SECTION_BG_A} px-6 py-16 lg:py-24`}>
          <FadeUp>
            <div className="mx-auto max-w-4xl rounded-[20px] border border-[#FF2D8E]/35 bg-[#0a0206] p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-[#FF2D8E] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-black">
                    {MORPHEUS8_INTRO_SPECIAL.badge}
                  </span>
                  <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">{MORPHEUS8_INTRO_SPECIAL.title}</h2>
                  <p className="mt-2 max-w-xl text-white/75">{MORPHEUS8_INTRO_SPECIAL.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-4xl font-bold text-[#FF2D8E]">{MORPHEUS8_INTRO_SPECIAL.priceLabel}</p>
                  <p className="text-sm text-white/55">{MORPHEUS8_INTRO_SPECIAL.priceNote}</p>
                </div>
              </div>
              <div className="mt-6">
                <JourneyPinkBtn href={MORPHEUS8_MARKETING.bookHref}>{MORPHEUS8_INTRO_SPECIAL.ctaLabel}</JourneyPinkBtn>
              </div>
            </div>
          </FadeUp>
        </section>

        <section className={`${JOURNEY_SECTION_BG_B} px-6 py-16 lg:py-24`}>
          <div className="mx-auto max-w-[1200px]">
            <FadeUp>
              <JourneySectionHead
                eyebrow="Why Morpheus8 Burst"
                title="The deepest"
                titleAccent="RF microneedling"
              />
            </FadeUp>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MORPHEUS8_WHAT_IT_DOES.map((item, i) => (
                <FadeUp key={item.id} delayMs={i * 50}>
                  <article className="flex h-full flex-col rounded-[20px] border border-white/14 bg-[#0a0206] p-5">
                    <p className="font-serif text-3xl font-bold text-[#FF2D8E]">{item.stat}</p>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-white/45">{item.statLabel}</p>
                    <h3 className="mt-3 font-serif text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">{item.body}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <section id="results" className={`scroll-mt-24 px-6 py-16 lg:py-24`}>
          <div className="mx-auto max-w-[1200px]">
            <FadeUp>
              <JourneySectionHead
                eyebrow="Real results"
                title="Before & after —"
                titleAccent="Morpheus8 Burst + Deep"
                description="Real patient photos at Hello Gorgeous Med Spa, Oswego IL. Individual results vary."
              />
            </FadeUp>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MORPHEUS8_RESULTS.map((item, i) => (
                <FadeUp key={item.src} delayMs={i * 40}>
                  <figure className="overflow-hidden rounded-[20px] border border-[#FF2D8E]/35 bg-[#0a0206]">
                    <Image src={item.src} alt={item.alt} width={627} height={490} className="h-auto w-full" />
                    <figcaption className="border-t border-white/10 px-4 py-3 text-sm font-bold text-[#FF2D8E]">
                      {item.label}
                    </figcaption>
                  </figure>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <section id="areas" className={`scroll-mt-24 ${JOURNEY_SECTION_BG_A} px-6 py-16 lg:py-24`}>
          <div className="mx-auto max-w-[1200px]">
            <FadeUp>
              <JourneySectionHead
                eyebrow="Treatment areas"
                title="Face + body —"
                titleAccent="one platform"
              />
            </FadeUp>
            <div className="mt-8 flex flex-wrap gap-3">
              {MORPHEUS8_TREATMENT_AREAS.map((area) => (
                <JourneyChip key={area}>{area}</JourneyChip>
              ))}
            </div>
            <FadeUp delayMs={60}>
              <div className="mt-10 overflow-hidden rounded-[20px] border border-[#FF2D8E]/35">
                <Image src={images.bodyTech} alt="Morpheus8 Burst body RF microneedling technology" width={1200} height={630} className="h-auto w-full" />
              </div>
            </FadeUp>
          </div>
        </section>

        <section id="how" className={`scroll-mt-24 ${JOURNEY_SECTION_BG_B} px-6 py-16 lg:py-24`}>
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-center">
            <FadeUp>
              <JourneySectionHead
                eyebrow="How it works"
                title="Consult to"
                titleAccent="collagen rebuild"
              />
              <ol className="mt-8 space-y-4">
                {MORPHEUS8_STEPS.map((step) => (
                  <li key={step.step} className="rounded-[20px] border border-white/14 bg-[#0a0206] p-4">
                    <div className="flex gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF2D8E] text-sm font-extrabold text-black">
                        {step.step}
                      </span>
                      <div>
                        <h3 className="font-bold text-white">{step.title}</h3>
                        <p className="mt-1 text-sm text-white/75">{step.body}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <Link href={MORPHEUS8_MARKETING.careHref} className="mt-6 inline-flex text-sm font-bold text-[#FF2D8E] underline underline-offset-4">
                Pre & post care guide →
              </Link>
            </FadeUp>
            <FadeUp delayMs={80}>
              <JourneyVideoFrame
                src={MORPHEUS8_MARKETING.introVideo}
                label="Morpheus8 Burst clinical treatment highlight — Hello Gorgeous Med Spa"
                poster={images.verified}
              />
            </FadeUp>
          </div>
        </section>

        <section id="pricing" className={`scroll-mt-24 px-6 py-16 lg:py-24`}>
          <div className="mx-auto max-w-[1200px]">
            <FadeUp>
              <JourneySectionHead
                eyebrow="Pricing"
                title="Honest packages ·"
                titleAccent="free consult first"
              />
            </FadeUp>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MORPHEUS8_PACKAGES.map((pkg, i) => (
                <FadeUp key={pkg.id} delayMs={i * 40}>
                  <article
                    className={`flex h-full flex-col rounded-[20px] border bg-[#0a0206] p-5 ${
                      pkg.highlight ? "border-[#FF2D8E]/60 ring-1 ring-[#FF2D8E]/30" : "border-white/14"
                    }`}
                  >
                    <h3 className="font-serif text-lg font-bold text-white">{pkg.name}</h3>
                    <p className="mt-2 font-serif text-3xl font-bold text-[#FF2D8E]">{pkg.price}</p>
                    <p className="text-xs text-white/55">{pkg.detail}</p>
                    <ul className="mt-4 flex-1 space-y-2 text-sm text-white/80">
                      {pkg.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="text-[#FF2D8E]" aria-hidden>
                            ✓
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5">
                      <JourneyPinkBtn
                        href={"href" in pkg && pkg.href ? pkg.href : MORPHEUS8_MARKETING.bookHref}
                        className="w-full px-4 py-2.5 text-sm"
                      >
                        {"href" in pkg && pkg.href ? "View specials" : "Book consult"}
                      </JourneyPinkBtn>
                    </div>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <section className={`${JOURNEY_SECTION_BG_A} px-6 py-16 lg:py-24`}>
          <FadeUp>
            <JourneyDarkCard className="mx-auto max-w-4xl text-center">
              <JourneyEyebrow>Pair with Solaria CO₂</JourneyEyebrow>
              <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">
                Surface + depth = complete transformation
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/75">
                Morpheus8 remodels beneath the skin. Solaria resurfaces the surface. Together — VIP Trifecta.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <JourneyGhostBtn href={MORPHEUS8_MARKETING.compareSolariaHref}>Explore Solaria CO₂</JourneyGhostBtn>
                <JourneyPinkBtn href={MORPHEUS8_MARKETING.trifectaHref}>VIP Trifecta packages</JourneyPinkBtn>
              </div>
            </JourneyDarkCard>
          </FadeUp>
        </section>

        <section id="faq" className={`scroll-mt-24 ${JOURNEY_SECTION_BG_B} px-6 py-16 lg:py-24`}>
          <div className="mx-auto max-w-[900px]">
            <FadeUp>
              <JourneySectionHead eyebrow="FAQ" title="Morpheus8" titleAccent="questions" />
            </FadeUp>
            <div className="mt-10 space-y-3">
              {MORPHEUS8_FAQS.map((faq, idx) => (
                <FadeUp key={faq.q} delayMs={idx * 30}>
                  <details
                    className="group rounded-[20px] border border-white/14 bg-[#0a0206] open:border-[#FF2D8E]/50"
                    {...(idx === 0 ? { open: true } : {})}
                  >
                    <summary className="cursor-pointer list-none px-5 py-4 font-bold text-white marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="flex items-start justify-between gap-3">
                        <span>{faq.q}</span>
                        <span className="text-[#FF2D8E] transition group-open:rotate-45">+</span>
                      </span>
                    </summary>
                    <div className="border-t border-white/10 px-5 pb-4 pt-3 text-sm leading-relaxed text-white/80">
                      {faq.a}
                    </div>
                  </details>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#FF2D8E] px-6 py-16 text-black lg:py-20">
          <div className="mx-auto max-w-[720px] text-center">
            <h2 className="font-serif text-[34px] font-bold leading-tight lg:text-[46px]">
              Ready for tighter, smoother skin?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-black/80">
              Free consult · InMode certified · Oswego IL
            </p>
            <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
              <Link
                href={MORPHEUS8_MARKETING.bookHref}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black bg-black px-8 py-3 text-sm font-extrabold text-white transition hover:bg-white hover:text-black"
              >
                Book free consult
              </Link>
              <a
                href={MORPHEUS8_MARKETING.phoneHref}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black/60 px-8 py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white"
              >
                Call {MORPHEUS8_MARKETING.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
