"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import {
  LUXURY,
  LUXURY_HERO,
  LUXURY_INTRO,
  LUXURY_PHILOSOPHY,
  LUXURY_SERVICES,
  LUXURY_OWNER,
  LUXURY_MD,
  LUXURY_REGEN,
  LUXURY_FAQ,
  LUXURY_CONTACT,
} from "@/lib/homepage-luxury";
import {
  WEBSITE_HERO_IMAGE,
  WEBSITE_HERO_IMAGE_ALT,
} from "@/lib/website-hero";

/* -------------------------------------------------------------------------- */
/*                                   Icons                                    */
/* -------------------------------------------------------------------------- */

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconChevron({ className, open }: { className?: string; open?: boolean }) {
  return (
    <svg
      className={`${className} transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconMapPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Shared Components                             */
/* -------------------------------------------------------------------------- */

function GoldDot() {
  return <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: LUXURY.pink }} />;
}

function GoldLine() {
  return <span className="h-px w-8" style={{ backgroundColor: LUXURY.pink }} />;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[11px] font-semibold uppercase tracking-[0.2em]"
      style={{ color: LUXURY.pink }}
    >
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-3 text-[32px] sm:text-[40px] lg:text-[48px] font-bold leading-[1.1] tracking-[-0.02em]">
      {children}
    </h2>
  );
}

function Button({
  href,
  variant = "pink",
  children,
  className = "",
}: {
  href: string;
  variant?: "pink" | "dark" | "outline";
  children: ReactNode;
  className?: string;
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-[12px] px-6 py-3 text-[14px] font-semibold transition";
  const variants = {
    pink: `text-white hover:brightness-110`,
    dark: `bg-[${LUXURY.dark}] text-white hover:bg-black`,
    outline: "border border-black/15 bg-transparent text-black hover:border-black/30",
  };
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`} style={variant === "pink" ? { backgroundColor: LUXURY.pink } : variant === "dark" ? { backgroundColor: LUXURY.dark } : {}}>
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Hero                                     */
/* -------------------------------------------------------------------------- */

function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: LUXURY.cream }}>
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br opacity-60"
        style={{ backgroundImage: `linear-gradient(to bottom right, ${LUXURY.cream}, ${LUXURY.gradient.to})` }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          {/* Left: Copy */}
          <div className="space-y-6">
            <Eyebrow>{LUXURY_HERO.eyebrow}</Eyebrow>
            <h1 className="text-[32px] sm:text-[42px] lg:text-[50px] font-bold leading-[1.1] tracking-[-0.02em]">
              {LUXURY_HERO.headline}
            </h1>
            <p className="text-[18px] leading-[1.5] opacity-70 max-w-[520px]">
              {LUXURY_HERO.subhead}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button href={PRIMARY_BOOKING_CTA.href} variant="pink">
                {LUXURY_HERO.cta}
                <IconArrowRight className="h-4 w-4" />
              </Button>
              <Button href="https://tryregenrx.com" variant="outline">
                {LUXURY_HERO.ctaSecondary}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-3 pt-6">
              {LUXURY_HERO.trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 rounded-[8px] border px-3 py-2"
                  style={{ borderColor: "rgba(0,0,0,0.1)", backgroundColor: "rgba(255,255,255,0.6)" }}
                >
                  {badge.icon === "star" && <IconStar className="h-5 w-5 text-[#E91E8C]" />}
                  {badge.icon === "check" && <IconCheck className="h-5 w-5 text-[#E91E8C]" />}
                  {badge.icon === "shield" && <IconShield className="h-5 w-5 text-[#E91E8C]" />}
                  <div>
                    <p className="text-[15px] font-bold leading-tight">{badge.label}</p>
                    <p className="text-[10px] uppercase tracking-wide opacity-50">{(badge as { subLabel?: string }).subLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: designed 16:9 hero — keep the full frame so the wordmark and screening line stay intact */}
          <div
            className="relative aspect-video w-full overflow-hidden rounded-[20px] border shadow-xl"
            style={{ borderColor: "rgba(0,0,0,0.1)", backgroundColor: LUXURY.cream }}
          >
            <Image
              src={WEBSITE_HERO_IMAGE}
              alt={WEBSITE_HERO_IMAGE_ALT}
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 560px, 100vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Intro / Promise                               */
/* -------------------------------------------------------------------------- */

function IntroSection() {
  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: LUXURY.cream }}>
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Copy */}
          <div>
            <Eyebrow>{LUXURY_INTRO.eyebrow}</Eyebrow>
            <SectionTitle>{LUXURY_INTRO.headline}</SectionTitle>
            <p className="mt-5 text-[16px] leading-[1.6] opacity-70 max-w-[480px]">
              {LUXURY_INTRO.body}
            </p>
          </div>

          {/* Right: Bullets */}
          <div className="space-y-4">
            {LUXURY_INTRO.bullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-3">
                <GoldDot />
                <p className="text-[15px] leading-[1.5]">{bullet}</p>
              </div>
            ))}
            <div className="pt-4">
              <Button href="/about" variant="outline">
                About us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Services                                   */
/* -------------------------------------------------------------------------- */

function ServiceCard({
  service,
}: {
  service: (typeof LUXURY_SERVICES)[number];
}) {
  return (
    <Link
      href={service.href}
      className="group flex flex-col rounded-[16px] border p-6 transition hover:border-black/20"
      style={{ borderColor: "rgba(0,0,0,0.1)", backgroundColor: LUXURY.cream }}
    >
      <p className="text-[11px] font-mono uppercase tracking-[0.12em]" style={{ color: LUXURY.pink }}>
        {service.subtitle}
      </p>
      <h3 className="mt-2 text-[20px] font-bold">{service.title}</h3>
      <p className="mt-2 flex-1 text-[14px] leading-[1.5] opacity-70">{service.description}</p>
      {service.downtime && (
        <p className="mt-3 text-[12px] font-medium opacity-50">
          ↓ {service.downtime}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2 text-[13px] font-semibold" style={{ color: LUXURY.pink }}>
        Learn more
        <IconArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function ServicesSection() {
  return (
    <section className="py-16 lg:py-24 border-y" style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: LUXURY.warmCream }}>
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="text-center mb-12">
          <Eyebrow>Treatments</Eyebrow>
          <SectionTitle>Advanced Tech</SectionTitle>
          <p className="mt-4 text-[16px] opacity-70 max-w-[560px] mx-auto">
            We chose devices for safety data, not Instagram trends. Every device treatment requires screening, photos, and aftercare plan.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LUXURY_SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/services" variant="dark">
            View all services
          </Button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Philosophy                                 */
/* -------------------------------------------------------------------------- */

function PhilosophySection() {
  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: LUXURY.dark }}>
      <div className="mx-auto max-w-[1280px] px-6 text-white">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Image */}
          <div
            className="relative h-[360px] lg:h-[420px] overflow-hidden rounded-[18px]"
            style={{ backgroundColor: LUXURY.sand }}
          >
            <Image
              src="/images/website-hero/team-hero-circle-cinematic.jpg"
              alt="Hello Gorgeous team"
              fill
              className="object-cover"
            />
          </div>

          {/* Copy */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: LUXURY.pink }}>
              {LUXURY_PHILOSOPHY.eyebrow}
            </p>
            <h2 className="mt-3 text-[28px] sm:text-[36px] lg:text-[44px] font-bold leading-[1.1]">
              {LUXURY_PHILOSOPHY.headline}
            </h2>
            <p className="mt-5 text-[16px] leading-[1.6] text-white/70 max-w-[480px]">
              {LUXURY_PHILOSOPHY.body}
            </p>
            <div className="mt-8 space-y-4">
              {LUXURY_PHILOSOPHY.bullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: LUXURY.pink }} />
                  <p className="text-[15px] leading-[1.5] text-white/80">{bullet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Owner + MD                                   */
/* -------------------------------------------------------------------------- */

function TeamSection() {
  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: LUXURY.cream }}>
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Owner */}
          <div
            className="rounded-[18px] p-8 lg:p-12"
            style={{ backgroundColor: LUXURY.dark }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: LUXURY.pink }}>
              {LUXURY_OWNER.eyebrow}
            </p>
            <h3 className="mt-3 text-[28px] font-bold text-white">{LUXURY_OWNER.name}</h3>
            <p className="mt-1 text-[13px] text-white/60">{LUXURY_OWNER.credentials}</p>
            <p className="mt-5 text-[15px] leading-[1.6] text-white/80">{LUXURY_OWNER.body}</p>
            <div className="mt-6 flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: LUXURY.pink }}
              >
                <IconShield className="h-4 w-4 text-black" />
              </div>
              <span className="text-[14px] font-semibold text-white">{LUXURY_OWNER.headline}</span>
            </div>
          </div>

          {/* MD */}
          <div
            className="rounded-[18px] border p-8 lg:p-12"
            style={{ borderColor: "rgba(0,0,0,0.1)", backgroundColor: LUXURY.warmCream }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: LUXURY.pink }}>
              {LUXURY_MD.eyebrow}
            </p>
            <h3 className="mt-3 text-[28px] font-bold">{LUXURY_MD.name}</h3>
            <p className="mt-1 text-[13px] opacity-60">{LUXURY_MD.credentials}</p>
            <p className="mt-5 text-[15px] leading-[1.6] opacity-80">{LUXURY_MD.body}</p>
            <div className="mt-6">
              <Link
                href="/providers/dr-arora"
                className="inline-flex items-center gap-2 text-[14px] font-semibold"
                style={{ color: LUXURY.pink }}
              >
                Meet Dr. Arora
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 REGEN RX                                   */
/* -------------------------------------------------------------------------- */

function RegenSection() {
  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: LUXURY.dark }}>
      <div className="mx-auto max-w-[1280px] px-6">
        <div
          className="rounded-[20px] p-8 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
          style={{ backgroundColor: LUXURY.darker }}
        >
          <div className="flex-1 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: LUXURY.pink }}>
              {LUXURY_REGEN.eyebrow}
            </p>
            <h2 className="mt-3 text-[28px] sm:text-[36px] font-bold">{LUXURY_REGEN.headline}</h2>
            <p className="mt-2 text-[18px] text-white/70">{LUXURY_REGEN.subhead}</p>
            <p className="mt-4 text-[15px] leading-[1.6] text-white/60 max-w-[480px]">{LUXURY_REGEN.body}</p>
            <p className="mt-4 text-[13px] font-semibold" style={{ color: LUXURY.pink }}>
              {LUXURY_REGEN.promo}
            </p>
            <p className="mt-1 text-[11px] text-white/40">{LUXURY_REGEN.legal}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button href={LUXURY_REGEN.ctaHref} variant="pink">
              {LUXURY_REGEN.cta}
              <IconArrowRight className="h-4 w-4" />
            </Button>
            <Link
              href={LUXURY_REGEN.exploreHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] border text-[14px] font-semibold text-white/80 hover:text-white transition"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              {LUXURY_REGEN.exploreLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   FAQ                                      */
/* -------------------------------------------------------------------------- */

function FaqItem({ item }: { item: (typeof LUXURY_FAQ)[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b py-5" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[16px] font-semibold pr-4">{item.q}</span>
        <IconChevron className="h-5 w-5 shrink-0 opacity-50" open={open} />
      </button>
      {open && (
        <p className="mt-3 text-[15px] leading-[1.6] opacity-70 pr-8">{item.a}</p>
      )}
    </div>
  );
}

function FaqSection() {
  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: LUXURY.cream }}>
      <div className="mx-auto max-w-[900px] px-6">
        <div className="text-center mb-10">
          <Eyebrow>FAQ</Eyebrow>
          <SectionTitle>How it works</SectionTitle>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
          {LUXURY_FAQ.map((item) => (
            <FaqItem key={item.q} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Contact                                   */
/* -------------------------------------------------------------------------- */

function ContactSection() {
  return (
    <section className="py-16 lg:py-24 border-t" style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: LUXURY.warmCream }}>
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          {/* Brand + CTA */}
          <div>
            <h2 className="text-[26px] font-bold">
              HELLO <span style={{ color: LUXURY.pink }}>GORGEOUS</span>
            </h2>
            <p className="mt-3 text-[14px] opacity-60 max-w-[300px]">
              Medical spa in downtown Oswego. Free consults, free parking.
            </p>
            <div className="mt-6">
              <Button href={PRIMARY_BOOKING_CTA.href} variant="pink">
                Book Free Consult
              </Button>
            </div>
          </div>

          {/* Phone */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-50">Contact</p>
            <div className="mt-4 space-y-3">
              <Link
                href={LUXURY_CONTACT.phoneHref}
                className="flex items-center gap-2 text-[15px] font-medium hover:opacity-70 transition"
              >
                <IconPhone className="h-4 w-4 text-[#E91E8C]" />
                {LUXURY_CONTACT.phone}
              </Link>
              <Link
                href={LUXURY_CONTACT.regenPhoneHref}
                className="flex items-center gap-2 text-[14px] opacity-60 hover:opacity-100 transition"
              >
                <IconPhone className="h-4 w-4" />
                {LUXURY_CONTACT.regenPhone}
                <span className="text-[11px]">(RX)</span>
              </Link>
            </div>
          </div>

          {/* Hours */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-50">Hours</p>
            <div className="mt-4 space-y-2">
              {LUXURY_CONTACT.hours.map((h) => (
                <div key={h.day} className="flex items-center gap-2 text-[14px]">
                  <IconClock className="h-4 w-4 opacity-40" />
                  <span className="font-medium">{h.day}</span>
                  <span className="opacity-60">{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-50">Location</p>
            <Link
              href={LUXURY_CONTACT.addressHref}
              target="_blank"
              rel="noopener"
              className="mt-4 flex items-start gap-2 text-[14px] hover:opacity-70 transition"
            >
              <IconMapPin className="h-4 w-4 mt-0.5 text-[#E91E8C]" />
              <div>
                <p className="font-medium">{LUXURY_CONTACT.address}</p>
                <p className="mt-1 opacity-60">{LUXURY_CONTACT.parking}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Main                                     */
/* -------------------------------------------------------------------------- */

export function HomepageLuxury({
  googleRating,
  googleCount,
}: {
  googleRating?: string;
  googleCount?: string;
} = {}) {
  return (
    <div className="min-h-screen w-full selection:bg-[#D4AF37]/30" style={{ color: LUXURY.dark }}>
      <HeroSection />
      <IntroSection />
      <ServicesSection />
      <PhilosophySection />
      <TeamSection />
      <RegenSection />
      <FaqSection />
      <ContactSection />
    </div>
  );
}

export default HomepageLuxury;
