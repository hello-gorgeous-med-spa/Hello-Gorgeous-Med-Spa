import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { RealPatientReviews } from "@/components/RealPatientReviews";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { RYAN_FULL_NAME } from "@/lib/founder-credentials";
import {
  GENTLEMENS_CLUB_FATHERS_DAY_IMAGE,
  GENTLEMENS_CLUB_HERO_IMAGE,
} from "@/lib/gentlemens-club";
import {
  MENS_WELLNESS_JUMP_LINKS,
  MENS_WELLNESS_MEMBERSHIP,
  MENS_WELLNESS_FAQS,
  MENS_WELLNESS_PILLARS,
  MENS_WELLNESS_SCREENERS,
  MENS_WELLNESS_SERVICES,
} from "@/lib/mens-wellness";
import { SITE } from "@/lib/seo";

function ServiceCard({
  icon,
  eyebrow,
  title,
  description,
  bullets,
  href,
  cta,
  external,
  badge,
}: (typeof MENS_WELLNESS_SERVICES)[number]) {
  return (
    <article className="flex h-full flex-col rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] transition hover:shadow-[10px_10px_0_0_rgba(230,0,126,0.45)]">
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl" aria-hidden>
          {icon}
        </span>
        {badge ? (
          <span className="rounded-full border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">{eyebrow}</p>
      <h3 className="mt-1 text-xl font-black text-neutral-900">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">{description}</p>
      <ul className="mt-4 flex-1 space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2 text-sm text-neutral-700">
            <span className="shrink-0 font-bold text-[#E6007E]">▸</span>
            {b}
          </li>
        ))}
      </ul>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 text-sm font-bold text-[#E6007E] hover:underline"
        >
          {cta}
        </a>
      ) : (
        <Link href={href} className="mt-5 text-sm font-bold text-[#E6007E] hover:underline">
          {cta}
        </Link>
      )}
    </article>
  );
}

export async function MensWellnessPageContent() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,184,220,0.35) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 100% 30%, rgba(230,0,126,0.08) 0%, transparent 50%),
            linear-gradient(180deg, #FFF0F7 0%, #ffffff 45%, #f5f5f5 100%)
          `,
        }}
        aria-hidden
      />

      {/* Hero */}
      <Section className="relative overflow-hidden border-b-4 border-black !py-0 !px-0">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0a0a0a 0%, #12101a 40%, #2d1020 100%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(230,0,126,0.18)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.12)_0%,transparent_45%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
          <FadeUp>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#E6007E]" aria-hidden />
              Men's Wellness · Oswego, IL
            </span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">
              Hello Gorgeous Med Spa
            </p>
            <h1 className="mt-3 text-4xl font-black leading-[1.05] text-white md:text-5xl lg:text-6xl">
              Gorgeous{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                for Him.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
              Brotox · TRT · peptides · GLP-1 — medical-grade care for men who want to look sharp, feel
              stronger, and skip the awkward med-spa vibe.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <CTA href={BOOKING_URL} variant="gradient" className="px-8 py-4">
                Book men's consult
              </CTA>
              <CTA
                href="#services"
                variant="outline"
                className="border-white/30 px-8 py-4 text-white hover:bg-white hover:text-black"
              >
                See services
              </CTA>
            </div>
            <p className="mt-6 text-sm text-white/60">
              NP oversight by {RYAN_FULL_NAME} ·{" "}
              <a href={`tel:${SITE.phone}`} className="text-[#FFB8DC] underline decoration-[#E6007E]">
                {SITE.phone}
              </a>
            </p>
          </FadeUp>

          <FadeUp delayMs={80}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] sm:col-span-2">
                <div className="relative aspect-[16/9] w-full bg-black">
                  <Image
                    src={GENTLEMENS_CLUB_HERO_IMAGE}
                    alt="Men's wellness at Hello Gorgeous Med Spa — Brotox, hormones, peptides in Oswego IL"
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 768px) 100vw, 480px"
                    priority
                  />
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <div className="relative aspect-square w-full bg-black">
                  <Image
                    src={GENTLEMENS_CLUB_FATHERS_DAY_IMAGE}
                    alt="Gift Brotox — men's wellness gift card Hello Gorgeous Oswego"
                    fill
                    className="object-contain object-center"
                    sizes="240px"
                  />
                </div>
              </div>
              <Link
                href={MENS_WELLNESS_MEMBERSHIP.href}
                className="flex flex-col justify-center rounded-2xl border-4 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] p-5 shadow-[8px_8px_0_0_rgba(0,0,0,0.25)] transition hover:scale-[1.02]"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Membership</p>
                <p className="mt-1 text-xl font-black text-white">The Gentlemen's Club</p>
                <p className="mt-2 text-sm text-white/90">From ${MENS_WELLNESS_MEMBERSHIP.fromPrice}/mo</p>
                <p className="mt-3 text-sm font-bold text-white">Learn more →</p>
              </Link>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Jump nav */}
      <nav
        aria-label="On this page"
        className="sticky top-[var(--header-offset,0px)] z-20 border-b-4 border-black bg-white/80 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 md:px-6">
          {MENS_WELLNESS_JUMP_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full border-2 border-neutral-200 bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:border-[#E6007E] hover:text-[#E6007E]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Services */}
      <Section id="services" className="scroll-mt-24 border-b-4 border-black bg-white">
        <FadeUp>
          <div className="mx-auto max-w-6xl">
            <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-bold uppercase text-white">
              01
            </span>
            <h2 className="mt-4 text-3xl font-black text-neutral-900 md:text-4xl">Men's wellness services</h2>
            <p className="mt-3 max-w-2xl text-neutral-600">
              Medical-grade treatments designed around how men look, feel, and perform — aesthetics through
              full NP-supervised optimization.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {MENS_WELLNESS_SERVICES.map((svc, idx) => (
                <FadeUp key={svc.id} delayMs={idx * 40}>
                  <ServiceCard {...svc} />
                </FadeUp>
              ))}
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Screeners */}
      <Section
        id="screeners"
        className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white"
      >
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-bold uppercase text-white">
              02
            </span>
            <h2 className="mt-4 text-3xl font-black text-neutral-900 md:text-4xl">Not sure where to start?</h2>
            <p className="mt-3 max-w-2xl text-neutral-600">
              2-minute educational screeners — not a diagnosis. Results point you to the right consult.
            </p>
          </FadeUp>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {MENS_WELLNESS_SCREENERS.map((screener, idx) => (
              <FadeUp key={screener.id} delayMs={idx * 50}>
                <Link
                  href={screener.href}
                  className="group flex items-center justify-between rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] transition hover:shadow-[10px_10px_0_0_rgba(230,0,126,0.45)]"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-neutral-900 group-hover:text-[#E6007E]">
                        {screener.title}
                      </h3>
                      {screener.badge ? (
                        <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                          {screener.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">{screener.sub}</p>
                  </div>
                  <span className="text-2xl font-bold text-[#E6007E] transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Why us */}
      <Section id="why-us" className="scroll-mt-24 border-b-4 border-black bg-white">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-bold uppercase text-white">
              03
            </span>
            <h2 className="mt-4 text-3xl font-black text-neutral-900 md:text-4xl">
              Why men choose Hello Gorgeous
            </h2>
          </FadeUp>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {MENS_WELLNESS_PILLARS.map((pillar, idx) => (
              <FadeUp key={pillar.title} delayMs={idx * 50}>
                <article className="h-full rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                  <h3 className="text-lg font-bold text-[#E6007E]">▸ {pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-700">{pillar.description}</p>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Membership */}
      <Section
        id="membership"
        className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-neutral-900 to-[#1a0a12] text-white"
      >
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <FadeUp>
            <span className="inline-flex rounded-xl border-2 border-white/30 bg-[#E6007E] px-3 py-1 text-xs font-bold uppercase text-white">
              04
            </span>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">The Gentlemen's Club</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Men's wellness membership — member pricing on Brotox, monthly wellness shots (B12, Lipo-C, or
              NAD+), priority booking, and optional hormone & peptide tiers.
            </p>
            <p className="mt-4 text-3xl font-black text-[#FFB8DC]">
              From ${MENS_WELLNESS_MEMBERSHIP.fromPrice}/mo
              <span className="text-base font-semibold text-white/60"> · no contracts</span>
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTA href={MENS_WELLNESS_MEMBERSHIP.href} variant="gradient">
                Explore membership
              </CTA>
              <CTA
                href={BOOKING_URL}
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-black"
              >
                Book consult first
              </CTA>
            </div>
          </FadeUp>
          <FadeUp delayMs={80}>
            <div className="rounded-3xl border-4 border-black bg-[#151922] p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <p className="text-xs font-bold uppercase tracking-widest text-[#FFB8DC]">
                Father's Day · Birthdays · Just Because
              </p>
              <h3 className="mt-3 text-2xl font-black">Skip the tie. Gift the confidence.</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Brotox gift cards and men's wellness consults make gifts he'll actually use.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <CTA
                  href={MENS_WELLNESS_SERVICES.find((s) => s.id === "gift")!.href}
                  variant="gradient"
                  className="text-sm"
                >
                  Gift Brotox
                </CTA>
                <CTA href={BOOKING_URL} variant="outline" className="border-white/30 text-white text-sm">
                  Gift a consult
                </CTA>
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="scroll-mt-24 border-b-4 border-black bg-white">
        <div className="mx-auto max-w-3xl">
          <FadeUp>
            <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-bold uppercase text-white">
              05
            </span>
            <h2 className="mt-4 text-3xl font-black text-neutral-900 md:text-4xl">Men's wellness FAQ</h2>
          </FadeUp>
          <div className="mt-10 space-y-4">
            {MENS_WELLNESS_FAQS.map((faq, idx) => (
              <FadeUp key={faq.question} delayMs={idx * 30}>
                <article className="rounded-3xl border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
                  <h3 className="font-bold text-[#E6007E]">▸ {faq.question}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-700">{faq.answer}</p>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Reviews */}
      <Section className="border-b-4 border-black bg-neutral-50">
        <div className="mx-auto max-w-6xl">
          <RealPatientReviews
            service="general"
            serviceLabel="Men's Wellness"
            heading="What our clients say"
            intro={`${SITE.reviewCount}+ verified reviews · ${SITE.reviewRating} stars on Google`}
          />
        </div>
      </Section>

      {/* Closing CTA */}
      <Section className="relative overflow-hidden !py-0 !px-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <div
          className="relative px-4 py-16 text-center md:px-6 md:py-20"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        >
          <FadeUp>
            <h2 className="text-3xl font-black text-white md:text-4xl">Ready to feel like yourself again?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
              One consultation. Real answers. A plan built around you — Brotox, hormones, peptides, or all of
              the above.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CTA href={BOOKING_URL} variant="outline" className="border-white bg-white text-[#E6007E] hover:bg-white/90">
                Book men's consult
              </CTA>
              <CTA
                href={`tel:${SITE.phone}`}
                variant="outline"
                className="border-white/60 text-white hover:bg-white/10"
              >
                Call {SITE.phone}
              </CTA>
            </div>
            <p className="mt-6 text-sm text-white/70">
              {SITE.address.streetAddress}, {SITE.address.addressLocality} IL
            </p>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
