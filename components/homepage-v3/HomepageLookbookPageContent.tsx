"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { TwoDoorsForkBand } from "@/components/TwoDoorsForkBand";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { REVIEW_TRUST_HEADLINE, reviewTrustBody } from "@/lib/review-trust-copy";
import {
  SERVICES_HUB_MORE,
  SERVICES_HUB_PATH,
  SERVICES_LOOKBOOK,
  type ServicesLookbookItem,
} from "@/lib/services-hub-marketing";
import { HOME_TESTIMONIALS, SITE } from "@/lib/seo";

function LookbookTile({ item, priority }: { item: ServicesLookbookItem; priority?: boolean }) {
  return (
    <Link
      href={item.href}
      className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E6007E]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#e8e2dc]">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          priority={priority}
          className="object-cover object-center transition duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div>
          <p className="font-serif text-lg font-semibold tracking-tight text-black sm:text-xl">
            {item.label}
          </p>
          {item.note ? <p className="mt-0.5 text-sm text-black/55">{item.note}</p> : null}
        </div>
        <span className="shrink-0 text-sm font-medium text-[#E6007E] transition group-hover:translate-x-0.5">
          View →
        </span>
      </div>
    </Link>
  );
}

export function HomepageLookbookPageContent() {
  return (
    <div className="relative bg-[#FAF7F4] text-black">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 70% 35% at 50% 0%, #E6007E14 0%, transparent 55%),
            linear-gradient(180deg, #FAF7F4 0%, #ffffff 50%, #FFF0F7 100%)
          `,
        }}
      />

      {/* Direction under hero */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:px-8 md:py-16">
          <FadeUp>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#E6007E]">
              Start here
            </p>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <h2 className="font-serif text-4xl font-medium tracking-tight text-black sm:text-5xl">
                  What are you looking for?
                </h2>
                <p className="mt-3 text-base leading-relaxed text-black/65 sm:text-lg">
                  Same lookbook as our Services page — tap a piece, or browse the full atlas.
                </p>
              </div>
              <CTA href={SERVICES_HUB_PATH} variant="gradient">
                Explore all services →
              </CTA>
            </div>
          </FadeUp>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {SERVICES_LOOKBOOK.slice(0, 6).map((item, i) => (
              <FadeUp key={item.id} delayMs={30 * i}>
                <LookbookTile item={item} priority={i < 2} />
              </FadeUp>
            ))}
          </div>

          <FadeUp delayMs={80}>
            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-sm border border-black/10 bg-white/70 px-5 py-5 sm:flex-row sm:items-center sm:px-7">
              <p className="font-serif text-xl text-black sm:text-2xl">
                More facials, injectables, body, and RX in the full lookbook.
              </p>
              <Link
                href={SERVICES_HUB_PATH}
                className="shrink-0 text-sm font-bold uppercase tracking-[0.16em] text-[#E6007E] underline decoration-[#E6007E]/35 underline-offset-4"
              >
                Open /services →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Rest of lookbook tiles */}
      <section className="border-b border-black/10 bg-white/50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:px-8 md:py-14">
          <FadeUp>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#E6007E]">
              More from the lookbook
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
              Keep exploring
            </h2>
          </FadeUp>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {SERVICES_LOOKBOOK.slice(6).map((item, i) => (
              <FadeUp key={item.id} delayMs={30 * (i % 6)}>
                <LookbookTile item={item} />
              </FadeUp>
            ))}
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {SERVICES_HUB_MORE.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-serif text-lg text-black underline decoration-black/20 underline-offset-4 transition hover:text-[#E6007E] hover:decoration-[#E6007E]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section className="!py-10">
        <div className="mx-auto max-w-6xl">
          <TwoDoorsForkBand activeDoor="med-spa" surface="light" />
        </div>
      </Section>

      {/* Reviews — cream surface, same trust copy */}
      <section id="reviews" className="border-y border-black/10 bg-white py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <FadeUp>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#E6007E]">
              Client love
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
              What our clients are saying
            </h2>
            <p className="mt-3 max-w-2xl text-base text-black/65">{reviewTrustBody()}</p>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-[#E6007E]">
              {REVIEW_TRUST_HEADLINE}
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {HOME_TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name + t.service} delayMs={40 * (i % 4)}>
                <figure className="flex h-full flex-col border border-black/10 bg-[#FAF7F4] p-6 md:p-8">
                  <p className="text-[#E6007E]" aria-hidden>
                    {"★".repeat(Math.min(5, Math.round(t.rating)))}
                  </p>
                  <blockquote className="mt-3 flex-1 text-base leading-relaxed text-black/85 md:text-lg">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-black/10 pt-4">
                    <cite className="not-italic font-semibold text-black">{t.name}</cite>
                    <span className="mt-0.5 block text-sm text-black/55">{t.location}</span>
                    <span className="text-sm font-medium text-[#E6007E]">{t.service}</span>
                  </figcaption>
                </figure>
              </FadeUp>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link
              href="/reviews"
              className="text-sm font-bold text-[#E6007E] underline decoration-[#E6007E]/35 underline-offset-4"
            >
              Read more reviews →
            </Link>
          </p>
        </div>
      </section>

      <section
        className="px-6 py-16 text-center md:px-10"
        style={{
          background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 50%, #9b0a4d 100%)",
        }}
      >
        <h2 className="font-serif text-3xl font-medium text-white sm:text-4xl">
          Ready when you are
        </h2>
        <p className="mx-auto mt-3 max-w-md text-white/90">
          Free consult with our NP-led team — call{" "}
          <a href={`tel:${SITE.phone}`} className="font-semibold underline">
            (630) 636-6193
          </a>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CTA
            href={PRIMARY_BOOKING_CTA.href}
            variant="outline"
            className="!border-white !bg-white !text-[#E6007E]"
          >
            {PRIMARY_BOOKING_CTA.label}
          </CTA>
          <CTA
            href={SERVICES_HUB_PATH}
            variant="outline"
            className="!border-white !text-white hover:!bg-white/10"
          >
            Browse services
          </CTA>
        </div>
      </section>
    </div>
  );
}
