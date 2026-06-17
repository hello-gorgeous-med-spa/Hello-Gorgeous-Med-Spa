"use client";

import Image from "next/image";
import Link from "next/link";

import { BestOfOswegoBadge } from "@/components/BestOfOswegoBadge";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { InModeTrainingCertificates } from "@/components/marketing/InModeTrainingCertificates";
import { BOOKING_URL } from "@/lib/flows";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import {
  ABOUT_DANI_IMAGE,
  DANI_LONG_BIO,
  DANI_MEDIUM_BIO,
  RYAN_IMAGE,
  RYAN_LONG_BIO,
  RYAN_MEDIUM_BIO,
  TEAM_FOUNDERS_IMAGE,
} from "@/lib/founder-credentials";
import { DANIELLE_INMODE_CERTIFICATES } from "@/lib/inmode-training-certificates";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

const JUMP_LINKS = [
  { href: "#founders", label: "Dani & Ryan" },
  { href: "#dani", label: "Meet Dani" },
  { href: "#ryan", label: "Meet Ryan" },
  { href: "#story", label: "Our story" },
  { href: "#faq", label: "FAQ" },
] as const;

const PRACTICE_STATS = [
  { value: "10+", label: "Years serving Oswego" },
  { value: "$500K+", label: "Invested in InMode technology" },
  { value: "23+", label: "Medical-grade treatments" },
  { value: "2,200+", label: "Active clients" },
] as const;

function SectionBadge({ n }: { n: number }) {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-white text-lg font-black border-2 border-black"
      aria-hidden
    >
      {n}
    </span>
  );
}

function StampCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border-4 border-black bg-white p-8 md:p-10 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] ${className}`}
    >
      {children}
    </div>
  );
}

export function AboutPageContent() {
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

          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 md:px-6">
            <FadeUp>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-[#E6007E] animate-pulse" aria-hidden />
                Hello Gorgeous
              </div>
              <p className="text-sm md:text-base text-[#FFB8DC] font-semibold mb-4 max-w-2xl mx-auto leading-relaxed">
                {HG_TAGLINE}
              </p>
              <p className="text-xs md:text-sm uppercase tracking-widest text-white/70 font-medium mb-4">
                Oswego · Naperville · Aurora · Plainfield
              </p>
              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-white drop-shadow-lg">
                Meet{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  Dani &amp; Ryan
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed mb-10">
                A real founder with a real story. A board-certified NP on site 7 days a week — not a rented medical
                director from another state. Family-owned at{" "}
                <Link
                  href="/best-med-spa-oswego-il"
                  className="text-[#FFB8DC] font-semibold underline decoration-[#E6007E] underline-offset-4 hover:text-white"
                >
                  #1 Best Med Spa in Oswego
                </Link>
                .
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={BOOKING_URL} variant="gradient" className="shadow-[0_8px_32px_-4px_rgba(230,0,126,0.55)]">
                  Book a free consultation
                </CTA>
                <CTA href="/services" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black">
                  View services
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Jump row */}
        <Section className="!py-12 border-b-4 border-black bg-white/70 backdrop-blur-sm">
          <nav aria-label="About page sections" className="max-w-5xl mx-auto px-4 md:px-6">
            <p className="text-sm font-bold text-black uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#E6007E]" aria-hidden>
                ✦
              </span>
              Jump to a section
            </p>
            <ul className="flex flex-wrap gap-2">
              {JUMP_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-block text-sm px-4 py-2 rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 text-black font-medium shadow-sm hover:border-[#E6007E] hover:text-[#E6007E] hover:shadow-md transition-all"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Section>

        {/* Founders photo */}
        <Section id="founders" className="scroll-mt-28 !py-16 md:!py-20 bg-gradient-to-b from-white to-[#FFF5FA] border-b-4 border-black">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <FadeUp>
              <StampCard>
                <div className="flex items-start gap-3 mb-6">
                  <SectionBadge n={1} />
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-black leading-tight">On site every week</h2>
                    <p className="text-black/65 mt-2 leading-relaxed font-medium">
                      Dani &amp; Ryan at 74 W. Washington St., downtown Oswego — real founders, not a franchise.
                    </p>
                  </div>
                </div>
                <div className="relative aspect-[4/5] max-h-[min(480px,70vh)] w-full overflow-hidden rounded-2xl border-4 border-black">
                  <Image
                    src={TEAM_FOUNDERS_IMAGE}
                    alt="Danielle Alcala-Glazier and Ryan Kent, FNP-BC at Hello Gorgeous Med Spa in Oswego, IL — founders with the hello gorgeous neon sign"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 672px"
                    priority
                  />
                </div>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Dani */}
        <Section id="dani" className="scroll-mt-28 !py-16 md:!py-20 bg-white/50 border-b-4 border-black">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <FadeUp>
              <StampCard>
                <div className="grid md:grid-cols-[220px_1fr] gap-8 items-start">
                  <div className="relative aspect-[4/5] w-full max-w-[220px] mx-auto overflow-hidden rounded-2xl border-4 border-black">
                    <Image
                      src={ABOUT_DANI_IMAGE}
                      alt="Danielle Alcala-Glazier, Licensed Esthetician and founder of Hello Gorgeous Med Spa in Oswego, IL"
                      fill
                      className="object-cover object-top"
                      sizes="220px"
                    />
                  </div>
                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <SectionBadge n={2} />
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black text-black">Danielle Alcala-Glazier</h2>
                        <p className="mt-1 text-[#E6007E] font-bold uppercase tracking-wider text-sm">Owner &amp; Founder</p>
                      </div>
                    </div>
                    <p className="text-black/85 font-medium leading-relaxed">{DANI_MEDIUM_BIO}</p>
                    <div className="mt-6">
                      <InModeTrainingCertificates
                        items={DANIELLE_INMODE_CERTIFICATES}
                        compact
                        title="InMode verified training"
                        subtitle="Luxora, Morpheus8 Deep, Quantum RF, Solaria CO₂ — InMode clinical education."
                      />
                    </div>
                  </div>
                </div>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Story */}
        <Section id="story" className="scroll-mt-28 !py-16 md:!py-20 bg-gradient-to-b from-white to-[#FFF5FA] border-b-4 border-black">
          <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-8">
            <FadeUp>
              <StampCard>
                <div className="flex items-start gap-3 mb-6">
                  <SectionBadge n={3} />
                  <h2 className="text-2xl md:text-3xl font-black text-black leading-tight">The story behind the name</h2>
                </div>
                <p className="text-black/85 font-medium leading-relaxed whitespace-pre-line">{DANI_LONG_BIO}</p>
              </StampCard>
            </FadeUp>
            <FadeUp delayMs={80}>
              <StampCard className="bg-gradient-to-br from-[#FFF0F7] to-white">
                <p className="text-[#E6007E] font-bold uppercase tracking-wider text-xs mb-3">A Founder&apos;s Letter</p>
                <h3 className="text-xl md:text-2xl font-black text-black mb-4">My Jerry Maguire Moment</h3>
                <p className="text-black/85 font-medium leading-relaxed mb-6">
                  After almost 10 years building Hello Gorgeous in Oswego, Danielle shares the truth about ownership — the
                  risk, the resilience, the boundaries, and the next chapter.{" "}
                  <span className="italic text-[#E6007E]">
                    &ldquo;Still standing. Still learning. Still growing. Still gorgeous.&rdquo;
                  </span>
                </p>
                <Link
                  href="/blog/my-jerry-maguire-moment"
                  className="inline-flex items-center justify-center rounded-full border-4 border-black bg-white px-6 py-3 text-sm font-bold text-[#E6007E] shadow-[6px_6px_0_0_rgba(230,0,126,0.35)] hover:bg-[#FFF0F7] transition-colors"
                >
                  Read the full letter →
                </Link>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Ryan */}
        <Section id="ryan" className="scroll-mt-28 !py-16 md:!py-20 bg-white/50 border-b-4 border-black">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <FadeUp>
              <StampCard>
                <div className="grid md:grid-cols-[220px_1fr] gap-8 items-start">
                  <div className="relative aspect-[4/5] w-full max-w-[220px] mx-auto overflow-hidden rounded-2xl border-4 border-black">
                    <Image
                      src={RYAN_IMAGE}
                      alt="Ryan Kent, FNP-BC, Medical Director at Hello Gorgeous Med Spa"
                      fill
                      className="object-cover object-top"
                      sizes="220px"
                    />
                  </div>
                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <SectionBadge n={4} />
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black text-black">Ryan Kent, FNP-BC</h2>
                        <p className="mt-1 text-[#E6007E] font-bold uppercase tracking-wider text-sm">Medical Director</p>
                      </div>
                    </div>
                    <p className="text-black/85 font-medium leading-relaxed">{RYAN_MEDIUM_BIO}</p>
                    <p className="mt-4 text-black/85 font-medium leading-relaxed whitespace-pre-line">{RYAN_LONG_BIO}</p>
                    <div className="mt-6 flex flex-col gap-2 text-sm font-bold">
                      <Link href="/providers/ryan" className="text-[#E6007E] hover:underline">
                        Ryan&apos;s full provider profile →
                      </Link>
                      <Link href="/telehealth" className="text-[#E6007E] hover:underline">
                        Book a telehealth visit with Ryan →
                      </Link>
                    </div>
                  </div>
                </div>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Team advantage + FAQ */}
        <Section id="faq" className="scroll-mt-28 !py-16 md:!py-20 bg-gradient-to-b from-white to-[#FFF5FA] border-b-4 border-black">
          <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-8">
            <FadeUp>
              <StampCard>
                <h2 className="text-xl md:text-2xl font-black text-black mb-3">Why our male + female team matters</h2>
                <p className="text-black/80 font-medium leading-relaxed mb-5">
                  Choice, balance, and a plan built from more than one perspective — how Dani and Ryan work together for
                  every client.
                </p>
                <Link
                  href="/blog/male-female-practitioners-med-spa-advantage-oswego-il"
                  className="inline-flex items-center justify-center rounded-full border-4 border-black bg-white px-6 py-3 text-sm font-bold text-[#E6007E] shadow-[6px_6px_0_0_rgba(230,0,126,0.35)] hover:bg-[#FFF0F7] transition-colors"
                >
                  Read the article →
                </Link>
              </StampCard>
            </FadeUp>
            <FadeUp delayMs={60}>
              <StampCard>
                <h2 className="text-xl md:text-2xl font-black text-black mb-3">Questions before you book?</h2>
                <p className="text-black/80 font-medium leading-relaxed mb-5">
                  Botox, Morpheus8, GLP-1, hormones, financing — answered in our full med spa FAQ.
                </p>
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center rounded-full border-4 border-black bg-white px-6 py-3 text-sm font-bold text-[#E6007E] shadow-[6px_6px_0_0_rgba(230,0,126,0.35)] hover:bg-[#FFF0F7] transition-colors"
                >
                  Read the full FAQ →
                </Link>
              </StampCard>
            </FadeUp>
          </div>
        </Section>

        {/* Awards + stats */}
        <Section className="!py-16 md:!py-20 bg-white border-b-4 border-black">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <FadeUp>
              <StampCard className="text-center mb-8">
                <h2 className="text-2xl font-black text-black mb-6">Awards &amp; recognition</h2>
                <BestOfOswegoBadge variant="default" className="mx-auto" />
                <p className="mt-6 text-black/75 font-medium">
                  {SITE.reviewRating}★ on Google · {SITE.reviewCount} reviews · Best of Oswego #1 Med Spa, Best Skincare,
                  Best Weight Loss
                </p>
              </StampCard>
            </FadeUp>
            <FadeUp delayMs={60}>
              <h2 className="text-xl font-black text-black text-center mb-6">The practice in numbers</h2>
              <div className="grid grid-cols-2 gap-4">
                {PRACTICE_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border-4 border-black bg-white p-5 text-center shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]"
                  >
                    <p className="text-2xl md:text-3xl font-black text-[#E6007E]">{stat.value}</p>
                    <p className="mt-2 text-xs md:text-sm font-semibold text-black/75">{stat.label}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Closing CTA */}
        <Section className="relative !py-20 overflow-hidden border-t-4 border-black">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(125deg, ${BRAND.pinkHot} 0%, ${BRAND.pink} 45%, #9b0a4d 100%)`,
            }}
          />
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 drop-shadow-md">Ready to meet us in person?</h2>
            <p className="text-white/95 text-lg mb-10 max-w-xl mx-auto">
              Book a free consultation at our Oswego studio — Dani and Ryan are in the office every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="white" className="shadow-xl">
                Book online
              </CTA>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-[#E6007E] transition shadow-lg"
              >
                Contact us
              </Link>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
