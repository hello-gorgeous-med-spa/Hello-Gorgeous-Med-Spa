"use client";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import { HG_RX_TELEHEALTH_BOOKING_URL } from "@/lib/flows";
import {
  RX_PATIENT_CARE_ADDON_GROUPS,
  RX_PATIENT_CARE_GUIDES,
  RX_PATIENT_CARE_HERO,
  RX_PATIENT_CARE_JUMP_LINKS,
  RX_PATIENT_CARE_SECTIONS,
  rxCareAddonPriceLabel,
} from "@/lib/rx-patient-care-hub";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

function StampCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] ${className}`}
    >
      {children}
    </div>
  );
}

function SectionBadge({ index }: { index: number }) {
  return (
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-sm font-black text-white">
      {index}
    </span>
  );
}

function CareActionCard({
  title,
  description,
  href,
  cta,
  priceHint,
  badge,
  icon,
  external,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
  priceHint?: string;
  badge?: string;
  icon: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl" aria-hidden>
          {icon}
        </span>
        {badge && (
          <span className="rounded-full border-2 border-black bg-[#FFF0F7] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#E6007E]">
            {badge}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-lg font-black text-black group-hover:text-[#E6007E] transition-colors">
        {title}
      </h3>
      {priceHint && (
        <p className="mt-1 text-sm font-bold text-[#E6007E]">{priceHint}</p>
      )}
      <p className="mt-2 text-sm font-medium leading-relaxed text-black/75">{description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#E6007E]">
        {cta}
        <svg
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </>
  );

  const cardClass =
    "group block h-full p-6 md:p-7 transition hover:-translate-y-0.5 hover:shadow-[10px_10px_0_0_rgba(230,0,126,0.45)]";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cardClass}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={cardClass}>
      {inner}
    </Link>
  );
}

export function RxPatientCareHubContent() {
  return (
    <div className="relative min-h-[100dvh]">
      {/* Ambient brand wash */}
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
        <Section className="relative border-b-4 border-black py-16 lg:py-24 !px-0">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 20% 30%, ${BRAND.pink} 0%, transparent 45%),
                radial-gradient(circle at 85% 20%, ${BRAND.pinkHot} 0%, transparent 40%),
                radial-gradient(circle at 70% 80%, ${BRAND.pink}33 0%, transparent 35%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6">
            <FadeUp>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                <span
                  className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#E6007E]"
                  aria-hidden
                />
                {RX_PATIENT_CARE_HERO.eyebrow}
              </div>
              <p className="mx-auto mb-4 max-w-2xl text-sm font-semibold leading-relaxed text-[#FFB8DC] md:text-base">
                {HG_TAGLINE}
              </p>
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/70 md:text-sm">
                Oswego · Naperville · Aurora · Plainfield · Illinois RX patients
              </p>
              <h1 className="mb-6 text-4xl font-black leading-tight text-white drop-shadow-lg md:text-6xl">
                {RX_PATIENT_CARE_HERO.title}{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  {RX_PATIENT_CARE_HERO.titleAccent}
                </span>
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
                {RX_PATIENT_CARE_HERO.subtitle}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <CTA href={RX_PATIENT_CARE_HERO.primaryCta.href} variant="gradient" className="px-8 py-3.5">
                  {RX_PATIENT_CARE_HERO.primaryCta.label}
                </CTA>
                <CTA
                  href={RX_PATIENT_CARE_HERO.secondaryCta.href}
                  variant="outline"
                  className="border-white px-8 py-3.5 text-white hover:bg-white hover:text-black"
                >
                  {RX_PATIENT_CARE_HERO.secondaryCta.label}
                </CTA>
              </div>
              <p className="mt-8 text-sm text-white/60">
                Questions? Call{" "}
                <a
                  href={`tel:${SITE.phone.replace(/-/g, "")}`}
                  className="font-bold text-[#FFB8DC] underline decoration-[#E6007E] hover:text-white"
                >
                  {SITE.phone}
                </a>{" "}
                · Supervised by Ryan Kent, FNP-BC
              </p>
            </FadeUp>
          </div>
        </Section>

        {/* Jump nav */}
        <nav
          aria-label="Patient care sections"
          className="sticky top-0 z-20 border-b-2 border-black/10 bg-white/70 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 px-4 py-3">
            {RX_PATIENT_CARE_JUMP_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-black/80 transition hover:border-[#E6007E] hover:text-[#E6007E]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Refills + New patients sections */}
        {RX_PATIENT_CARE_SECTIONS.map((section, sectionIdx) => (
          <Section
            key={section.id}
            id={section.id}
            className={`scroll-mt-20 border-b-4 border-black py-14 md:py-16 ${
              sectionIdx % 2 === 0
                ? "bg-white"
                : "bg-gradient-to-b from-[#FFF0F7]/80 to-white"
            }`}
          >
            <FadeUp>
              <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex items-start gap-4">
                  <SectionBadge index={section.index} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E6007E]">
                      {section.eyebrow}
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-black md:text-3xl">{section.title}</h2>
                    <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-black/70 md:text-base">
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {section.cards.map((card, cardIdx) => (
                    <FadeUp key={card.id} delayMs={40 * cardIdx}>
                      <StampCard className="h-full overflow-hidden">
                        <CareActionCard {...card} />
                      </StampCard>
                    </FadeUp>
                  ))}
                </div>
              </div>
            </FadeUp>
          </Section>
        ))}

        {/* Monthly add-ons */}
        <Section
          id="add-ons"
          className="scroll-mt-20 border-b-4 border-black bg-white py-14 md:py-16"
        >
          <FadeUp>
            <div className="mx-auto max-w-5xl">
              <div className="mb-8 flex items-start gap-4">
                <SectionBadge index={3} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E6007E]">
                    Stack with GLP-1
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-black md:text-3xl">
                    Monthly peptide add-ons
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-black/70 md:text-base">
                    NAD+, Sermorelin, and bundled formats ship with your GLP-1 refill after Ryan approves.
                    Select your option on step 3 of the{" "}
                    <Link href="/glp1-refill" className="font-bold text-[#E6007E] underline underline-offset-2">
                      GLP-1 refill form
                    </Link>
                    .
                  </p>
                </div>
              </div>

              {RX_PATIENT_CARE_ADDON_GROUPS.map((group) => (
                <div key={group.group} className="mb-10 last:mb-0">
                  <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-black/80">
                    {group.title}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {group.cards.map((addon) => (
                      <StampCard key={addon.id} className="overflow-hidden">
                        <Link href={addon.href} className="block p-5 md:p-6 group">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-base font-black text-black group-hover:text-[#E6007E]">
                              {addon.title}
                            </h4>
                            <span className="shrink-0 rounded-lg border-2 border-black bg-[#FFF0F7] px-2 py-1 text-xs font-black text-[#E6007E]">
                              {rxCareAddonPriceLabel(addon.monthlyUsd)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-medium leading-relaxed text-black/75">
                            {addon.description}
                          </p>
                          <p className="mt-2 text-xs font-medium text-black/50">{addon.note}</p>
                          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#E6007E]">
                            Add on refill form
                            <span aria-hidden>→</span>
                          </span>
                        </Link>
                      </StampCard>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </Section>

        {/* Patient guides */}
        <Section
          id="guides"
          className="scroll-mt-20 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7]/80 to-white py-14 md:py-16"
        >
          <FadeUp>
            <div className="mx-auto max-w-5xl">
              <div className="mb-8 flex items-start gap-4">
                <SectionBadge index={4} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E6007E]">
                    Download & print
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-black md:text-3xl">
                    Patient guides & dosing charts
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-black/70 md:text-base">
                    Injection technique, medication education, and NAD+ / Sermorelin bundle references —
                    also available after you submit a refill.
                  </p>
                </div>
              </div>

              <StampCard className="divide-y-2 divide-black/10 overflow-hidden">
                <ul className="divide-y-2 divide-black/10">
                  {RX_PATIENT_CARE_GUIDES.map((guide) => (
                    <li key={guide.id}>
                      <a
                        href={guide.href}
                        target={guide.external ? "_blank" : undefined}
                        rel={guide.external ? "noopener noreferrer" : undefined}
                        className="group flex flex-col gap-1 px-5 py-4 transition hover:bg-[#FFF0F7] sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-6"
                      >
                        <div>
                          <p className="font-bold text-[#E6007E] group-hover:text-[#FF2D8E]">
                            ▸ {guide.title}
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-black/70">{guide.description}</p>
                        </div>
                        <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-black/45 group-hover:text-[#E6007E]">
                          Open
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </StampCard>
            </div>
          </FadeUp>
        </Section>

        {/* Help / closing CTA */}
        <Section id="help" className="scroll-mt-20 py-14 md:py-16">
          <FadeUp>
            <div
              className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border-4 border-black px-6 py-12 text-center md:px-12 md:py-16"
              style={{
                background:
                  "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`,
                }}
                aria-hidden
              />
              <div className="relative z-10">
                <h2 className="text-2xl font-black text-white md:text-4xl">
                  Need help with your refill?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base font-medium text-white/90 md:text-lg">
                  Book a telehealth check-in, call the spa, or open the Hello Gorgeous client app for
                  quick links on your phone.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <CTA
                    href={HG_RX_TELEHEALTH_BOOKING_URL}
                    variant="outline"
                    className="border-white bg-white/10 px-8 py-3.5 text-white backdrop-blur hover:bg-white hover:text-[#E6007E]"
                  >
                    Book telehealth
                  </CTA>
                  <CTA href="/app" variant="outline" className="border-white px-8 py-3.5 text-white hover:bg-white hover:text-[#E6007E]">
                    Open client app
                  </CTA>
                  <a
                    href={`tel:${SITE.phone.replace(/-/g, "")}`}
                    className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#E6007E]"
                  >
                    Call {SITE.phone}
                  </a>
                </div>
                <p className="mt-8 text-xs text-white/70">
                  Illinois residents only · Prescriptions require medical evaluation ·{" "}
                  <Link href="/rx" className="underline hover:text-white">
                    Hello Gorgeous RX™
                  </Link>
                </p>
              </div>
            </div>
          </FadeUp>
        </Section>
      </main>
    </div>
  );
}
