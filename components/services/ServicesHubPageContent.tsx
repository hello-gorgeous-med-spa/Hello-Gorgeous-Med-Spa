"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { TwoDoorsForkBand } from "@/components/TwoDoorsForkBand";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import {
  SERVICES_HUB_MORE,
  SERVICES_HUB_NAV,
  SERVICES_LOOKBOOK,
  type ServicesLookbookItem,
} from "@/lib/services-hub-marketing";
import { SERVICES, SITE, servicePublicPath } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  rose: "#FFF0F7",
  cream: "#FAF7F4",
};

function LookbookTile({ item, priority }: { item: ServicesLookbookItem; priority?: boolean }) {
  return (
    <Link
      href={item.href}
      className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E6007E]"
    >
      {/* 1:1 frame — creatives show whole, no tall-card crop */}
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

export function ServicesHubPageContent() {
  return (
    <div className="relative min-h-[100dvh] bg-[#FAF7F4] text-black">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 70% 40% at 50% 0%, ${BRAND.pink}12 0%, transparent 55%),
            linear-gradient(180deg, ${BRAND.cream} 0%, #ffffff 50%, ${BRAND.rose} 100%)
          `,
        }}
      />

      <main>
        <header className="border-b border-black/10">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_1.05fr] md:items-end md:px-8 md:py-12 lg:gap-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#E6007E]">
                Hello Gorgeous · Oswego
              </p>
              <h1 className="mt-3 font-serif text-5xl font-medium tracking-tight text-black sm:text-6xl">
                Services
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-black/65">
                Campaign lookbook — your creatives, full square, linked to each treatment path.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <CTA href={PRIMARY_BOOKING_CTA.href} variant="gradient">
                  {PRIMARY_BOOKING_CTA.label}
                </CTA>
                <a
                  href="#lookbook"
                  className="inline-flex items-center px-2 py-3 text-sm font-semibold text-[#E6007E] underline decoration-[#E6007E]/40 underline-offset-4"
                >
                  Browse lookbook
                </a>
              </div>
            </div>
            {/* Opening tile in the header so first viewport isn’t text-only */}
            <FadeUp>
              <LookbookTile item={SERVICES_LOOKBOOK[0]} priority />
            </FadeUp>
          </div>
        </header>

        <nav className="sticky top-0 z-20 border-b border-black/10 bg-[#FAF7F4]/92 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2.5 sm:px-6 md:px-8">
            {SERVICES_HUB_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/70 transition hover:text-[#E6007E]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <section id="lookbook" className="scroll-mt-14 border-b border-black/10">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:px-8 md:py-14">
            <FadeUp>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#E6007E]">
                Lookbook
              </p>
              <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
                Tap a piece
              </h2>
            </FadeUp>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {SERVICES_LOOKBOOK.slice(1).map((item, i) => (
                <FadeUp key={item.id} delayMs={30 * (i % 6)}>
                  <LookbookTile item={item} />
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <Section id="more" className="scroll-mt-14 !bg-transparent py-12">
          <FadeUp>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#E6007E]">
              More care
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight">Also in clinic</h2>
          </FadeUp>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {SERVICES_HUB_MORE.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-serif text-xl text-black underline decoration-black/20 underline-offset-4 transition hover:text-[#E6007E] hover:decoration-[#E6007E]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section className="!py-8">
          <div className="mx-auto max-w-6xl">
            <TwoDoorsForkBand activeDoor="med-spa" surface="light" />
          </div>
        </Section>

        <Section id="catalog" className="scroll-mt-14 border-t border-black/10 bg-white py-12">
          <FadeUp>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#E6007E]">
              Full catalog
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight">Everything we offer</h2>
          </FadeUp>
          <div className="mt-8 columns-1 gap-x-10 sm:columns-2 lg:columns-3">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={servicePublicPath(s)}
                className="mb-4 block break-inside-avoid border-b border-black/10 pb-3 text-sm transition hover:border-[#E6007E]"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E6007E]">
                  {s.category}
                </span>
                <span className="mt-1 block font-semibold text-black">{s.name}</span>
              </Link>
            ))}
          </div>
        </Section>

        <section
          className="px-6 py-16 text-center md:px-10"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 50%, #9b0a4d 100%)",
          }}
        >
          <h2 className="font-serif text-3xl font-medium text-white sm:text-4xl">
            Ready for your consult?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/90">
            NP-led plans in Oswego — call{" "}
            <a href={`tel:${SITE.phone}`} className="font-semibold underline">
              (630) 636-6193
            </a>
          </p>
          <div className="mt-8 flex justify-center">
            <CTA
              href={PRIMARY_BOOKING_CTA.href}
              variant="outline"
              className="!border-white !bg-white !text-[#E6007E]"
            >
              {PRIMARY_BOOKING_CTA.label}
            </CTA>
          </div>
        </section>
      </main>
    </div>
  );
}
