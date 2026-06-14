import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { BestOfOswegoBadge } from "@/components/BestOfOswegoBadge";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { InModeTrainingCertificates } from "@/components/marketing/InModeTrainingCertificates";
import {
  ABOUT_PAGE_SEO_DESCRIPTION,
  DANI_IMAGE,
  DANI_LONG_BIO,
  DANI_MEDIUM_BIO,
  RYAN_IMAGE,
  RYAN_LONG_BIO,
  RYAN_MEDIUM_BIO,
  aboutPageGraphJsonLd,
} from "@/lib/founder-credentials";
import { DANIELLE_INMODE_CERTIFICATES } from "@/lib/inmode-training-certificates";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Danielle Alcala-Glazier & Ryan Kent, FNP-BC | Hello Gorgeous Med Spa Oswego IL",
  description: ABOUT_PAGE_SEO_DESCRIPTION,
  path: "/about",
  keywords: [
    "Danielle Alcala-Glazier",
    "Hello Gorgeous Med Spa Oswego",
    "med spa owner Oswego IL",
    "Ryan Kent FNP-BC",
    "nurse practitioner med spa Oswego",
    "Best of Oswego med spa",
    "Morpheus8 Oswego",
    "med spa Naperville Aurora Plainfield",
  ],
});

const PRACTICE_STATS = [
  { value: "10+", label: "Years serving Oswego" },
  { value: "$500K+", label: "Invested in InMode technology" },
  { value: "23+", label: "Medical-grade treatments" },
  { value: "2,200+", label: "Active clients" },
];

export default function AboutPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "About Dani & Ryan", url: `${SITE.url}/about` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageGraphJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <Section className="bg-gradient-to-br from-black via-[#1a0a12] to-black text-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <p className="text-[#FFB8DC] text-sm font-semibold tracking-wide mb-4 max-w-2xl mx-auto leading-relaxed">
              {HG_TAGLINE}
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
            <div className="mt-8">
              <InModeTrainingCertificates
                items={DANIELLE_INMODE_CERTIFICATES}
                compact
                title="InMode verified training"
                subtitle="Certificate of attendance for Luxora, Morpheus8 Deep, Quantum RF, Solaria CO₂, and related platforms — issued by InMode clinical education."
              />
            </div>
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

      <Section className="bg-white border-b-4 border-black">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="rounded-3xl border-4 border-black bg-gradient-to-br from-[#FFF0F7] to-white p-8 md:p-10 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <p className="text-[#E6007E] font-bold uppercase tracking-wider text-xs mb-3">
                A Founder&apos;s Letter
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-black mb-4">
                My Jerry Maguire Moment
              </h2>
              <p className="text-black/85 font-medium leading-relaxed mb-6">
                There comes a moment in business when you stop pretending everything is easy. After almost 10
                years building Hello Gorgeous in Oswego, Danielle shares the truth about ownership — the risk,
                the resilience, the boundaries, and the next chapter.{" "}
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
            </div>
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
            <p className="mt-6 text-black/85 font-medium leading-relaxed whitespace-pre-line">{RYAN_LONG_BIO}</p>
            <Link
              href="/providers/ryan"
              className="mt-6 inline-flex items-center gap-2 text-[#E6007E] font-bold hover:underline"
            >
              Ryan&apos;s full provider profile →
            </Link>
            <Link
              href="/telehealth"
              className="mt-4 block text-[#E6007E] font-bold hover:underline"
            >
              Book a telehealth visit with Ryan →
            </Link>
          </FadeUp>
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-[#FFF0F7] to-white border-b-4 border-black">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-black text-black mb-4">
              Why our male + female team is an advantage
            </h2>
            <p className="text-black/80 font-medium leading-relaxed mb-6">
              You deserve choice, balance, and a plan built from more than one perspective. Read how Dani and
              Ryan work together for every client at Hello Gorgeous.
            </p>
            <Link
              href="/blog/male-female-practitioners-med-spa-advantage-oswego-il"
              className="inline-flex items-center justify-center rounded-full border-4 border-black bg-white px-6 py-3 text-sm font-bold text-[#E6007E] shadow-[6px_6px_0_0_rgba(230,0,126,0.35)] hover:bg-[#FFF0F7] transition-colors"
            >
              Read the article →
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
