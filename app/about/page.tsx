import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { BestOfOswegoBadge } from "@/components/BestOfOswegoBadge";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  DANI_IMAGE,
  DANI_LONG_BIO,
  DANI_MEDIUM_BIO,
  RYAN_IMAGE,
  RYAN_MEDIUM_BIO,
} from "@/lib/founder-credentials";
import { pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Dani & Ryan | Hello Gorgeous Med Spa Oswego IL",
  description:
    "Meet Danielle Alcala-Glazier, founder of Hello Gorgeous Med Spa, and Ryan Kent, FNP-BC, Medical Director. Family-owned, NP-directed aesthetics in Oswego, IL — Best of Oswego #1 Med Spa.",
  path: "/about",
});

const PRACTICE_STATS = [
  { value: "10+", label: "Years serving Oswego" },
  { value: "$500K+", label: "Invested in InMode technology" },
  { value: "23+", label: "Medical-grade treatments" },
  { value: "2,200+", label: "Active clients" },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />

      <Section className="bg-gradient-to-br from-black via-[#1a0a12] to-black text-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <p className="text-[#FFB8DC] text-sm font-semibold tracking-widest uppercase mb-4">
              Family-owned · NP-directed · Oswego, IL
            </p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
              The people behind{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                Hello Gorgeous
              </span>
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              A real founder with a real story. A board-certified NP on site 7 days a week. Not a chain — and
              that&apos;s the point.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <CTA href={BOOKING_URL} variant="gradient">
                Book a Consultation
              </CTA>
              <CTA href="/services" variant="outline">
                Explore Services
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section id="dani" className="scroll-mt-24 bg-white border-b-4 border-black">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[280px_1fr] gap-10 items-start">
          <FadeUp>
            <div className="relative aspect-[4/5] w-full max-w-[280px] mx-auto overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <Image
                src={DANI_IMAGE}
                alt="Danielle Alcala-Glazier, Owner and Founder of Hello Gorgeous Med Spa"
                fill
                className="object-cover"
                sizes="280px"
                priority
              />
            </div>
          </FadeUp>
          <FadeUp delayMs={60}>
            <h2 className="text-3xl font-black text-black">Danielle Alcala-Glazier</h2>
            <p className="mt-2 text-[#E6007E] font-bold uppercase tracking-wider text-sm">Owner & Founder</p>
            <p className="mt-6 text-black/85 font-medium leading-relaxed">{DANI_MEDIUM_BIO}</p>
          </FadeUp>
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-[#FFF0F7] to-white border-b-4 border-black">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <h2 className="text-2xl font-black text-black mb-6">The story behind the name</h2>
            <p className="text-black/85 font-medium leading-relaxed whitespace-pre-line">{DANI_LONG_BIO}</p>
          </FadeUp>
        </div>
      </Section>

      <Section id="ryan" className="scroll-mt-24 bg-white border-b-4 border-black">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[280px_1fr] gap-10 items-start">
          <FadeUp>
            <div className="relative aspect-[4/5] w-full max-w-[280px] mx-auto overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <Image
                src={RYAN_IMAGE}
                alt="Ryan Kent, FNP-BC, Medical Director at Hello Gorgeous Med Spa"
                fill
                className="object-cover"
                sizes="280px"
              />
            </div>
          </FadeUp>
          <FadeUp delayMs={60}>
            <h2 className="text-3xl font-black text-black">Ryan Kent, FNP-BC</h2>
            <p className="mt-2 text-[#E6007E] font-bold uppercase tracking-wider text-sm">Medical Director</p>
            <p className="mt-6 text-black/85 font-medium leading-relaxed">{RYAN_MEDIUM_BIO}</p>
            <Link
              href="/telehealth"
              className="mt-6 inline-flex items-center gap-2 text-[#E6007E] font-bold hover:underline"
            >
              Book a telehealth visit with Ryan →
            </Link>
          </FadeUp>
        </div>
      </Section>

      <Section className="bg-gray-50 border-b-4 border-black">
        <div className="max-w-5xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-2xl font-black text-black mb-6">Awards & recognition</h2>
            <BestOfOswegoBadge variant="default" className="mx-auto" />
            <p className="mt-6 text-black/75 font-medium">
              {SITE.reviewRating}★ on Google · {SITE.reviewCount} reviews · Best of Oswego #1 Med Spa, Best
              Skincare, Best Weight Loss
            </p>
          </FadeUp>
        </div>
      </Section>

      <Section className="bg-white border-b-4 border-black">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <h2 className="text-2xl font-black text-black text-center mb-10">The practice in numbers</h2>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PRACTICE_STATS.map((stat, idx) => (
              <FadeUp key={stat.label} delayMs={idx * 50}>
                <div className="rounded-2xl border-4 border-black bg-white p-6 text-center shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
                  <p className="text-3xl font-black text-[#E6007E]">{stat.value}</p>
                  <p className="mt-2 text-sm font-semibold text-black/75">{stat.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to meet us in person?</h2>
          <p className="text-white/90 text-lg mb-8 font-medium">
            Book a free consultation at our Oswego studio — Dani and Ryan are in the office every week.
          </p>
          <CTA href={BOOKING_URL} variant="white">
            Book Your Consultation
          </CTA>
        </div>
      </Section>
    </>
  );
}
