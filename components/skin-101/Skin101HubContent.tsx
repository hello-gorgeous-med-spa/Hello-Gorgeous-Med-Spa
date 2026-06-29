"use client";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { Skin101GuideCard } from "@/components/skin-101/Skin101GuideCard";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import { SITE } from "@/lib/seo";
import { SKIN_101_PATH, SKIN_101_SKIN_ONLY_GUIDES } from "@/lib/skin-101-nav";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

const MORE_LEARNING = [
  { label: "FAQ", href: "/faq", sub: "Treatments, safety, booking & financing" },
  { label: "Blog & Guides", href: "/blog", sub: "Long-form articles from our team" },
  { label: "Help Me Choose", href: "/help-me-choose", sub: "Goal-based treatment finder" },
  { label: "Pre & Post Care", href: "/pre-post-care", sub: "What to do before and after treatments" },
];

export function Skin101HubContent() {
  return (
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${BRAND.pinkHot}22 0%, transparent 50%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 35%, #fafafa 100%)
          `,
        }}
      />

      <main>
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
                radial-gradient(circle at 85% 20%, ${BRAND.pinkHot} 0%, transparent 40%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 md:px-6">
            <FadeUp>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-[#E6007E] animate-pulse" aria-hidden />
                Science Explainer Series
              </div>
              <p className="text-sm md:text-base text-[#FFB8DC] font-semibold mb-4">{HG_TAGLINE}</p>
              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-white drop-shadow-lg">
                Skin{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  101
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed mb-10">
                Plain-language guides for clients who want to learn before they book — skin layers, acids, collagen,
                lymphatic drainage, peptides, goal-based peptide matching, and the science behind what we do at Hello Gorgeous in Oswego.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={PRIMARY_BOOKING_CTA.href} variant="gradient">
                  {PRIMARY_BOOKING_CTA.label}
                </CTA>
                <CTA href="/faq" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black">
                  Read our FAQ
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        <Section className="!py-16 border-b-4 border-black bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <p className="text-sm font-bold uppercase tracking-wider text-[#E6007E] mb-2">Start here</p>
            <h2 className="text-3xl font-black text-black mb-8">Guides in this series</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {SKIN_101_SKIN_ONLY_GUIDES.map((guide) => (
                <Skin101GuideCard key={guide.slug} guide={guide} />
              ))}
              <Link
                href="/peptides"
                className="group flex flex-col overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] transition hover:border-[#E6007E]"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b-4 border-black bg-[#0a0a0a]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(230,0,126,0.35)_0%,transparent_60%)]" />
                  <div className="relative z-10 flex h-full flex-col justify-end p-6">
                    <span className="mb-2 inline-flex w-fit rounded-full border-2 border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      Hello Gorgeous RX™
                    </span>
                    <h3 className="text-2xl font-black text-white group-hover:text-[#FFB8DC]">
                      Peptide Therapy
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm font-medium text-[#E6007E]">NP-supervised · licensed pharmacy only</p>
                  <p className="mt-2 text-sm text-black/75 leading-relaxed">
                    BPC-157, Sermorelin, GHK-Cu, GLP-1 & more — pricing, protocols, and FAQs in one place.
                  </p>
                  <p className="mt-4 text-sm font-bold text-black">View peptide hub →</p>
                </div>
              </Link>
            </div>
          </div>
        </Section>

        <Section className="!py-14 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-black text-black mb-2">More ways to learn</h2>
            <p className="text-black/70 mb-8 max-w-2xl">
              Skin 101 is for ingredient and treatment science. These pages help with booking, care, and bigger-picture
              questions.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {MORE_LEARNING.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border-2 border-black/15 bg-white p-5 transition hover:border-[#E6007E] hover:shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]"
                >
                  <h3 className="font-black text-black">{item.label}</h3>
                  <p className="mt-1 text-sm text-black/65">{item.sub}</p>
                </Link>
              ))}
            </div>
          </div>
        </Section>

        <Section
          className="relative overflow-hidden !py-16"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        >
          <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl font-black text-white mb-4">Questions after reading?</h2>
            <p className="text-white/90 mb-8 font-medium">
              That&apos;s what consults are for — no pressure, just honest answers. {SITE.phone}
            </p>
            <CTA href={PRIMARY_BOOKING_CTA.href} variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#E6007E]">
              {PRIMARY_BOOKING_CTA.label}
            </CTA>
          </div>
        </Section>
      </main>
    </div>
  );
}
