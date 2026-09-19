"use client";

import Image from "next/image";
import Link from "next/link";

import { BestOfOswegoBadge } from "@/components/BestOfOswegoBadge";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { InModeTrainingCertificates } from "@/components/marketing/InModeTrainingCertificates";
import { BOOKING_URL } from "@/lib/flows";
import {
  ABOUT_DANI_IMAGE,
  DANI_LONG_BIO,
  DANI_MEDIUM_BIO,
} from "@/lib/founder-credentials";
import { MEDICAL_TRUST_PROVIDERS } from "@/lib/medical-trust";
import { DANIELLE_INMODE_CERTIFICATES } from "@/lib/inmode-training-certificates";
import { SITE } from "@/lib/seo";

const PRACTICE_STATS = [
  { value: "10+", label: "Years serving Oswego" },
  { value: "$500K+", label: "Invested in InMode technology" },
  { value: "23+", label: "Medical-grade treatments" },
  { value: "2,200+", label: "Active clients" },
] as const;

const ABOUT_FAQS = [
  {
    question: "Who owns Hello Gorgeous?",
    answer:
      "Danielle Alcala-Glazier — Licensed Esthetician and founder. She works in the Oswego studio every day. Prescriptions are written by Ryan Kent, FNP-BC under Medical Director Dr. Mukesh Arora, MD. Danielle is not the prescriber.",
  },
  {
    question: "Who performs treatments at Hello Gorgeous?",
    answer:
      "Danielle Alcala-Glazier performs hands-on aesthetic treatments — brows, skin, and advanced device work she's trained on for 10+ years. Kristina Huda, BSN, RN is our RN injector. Ryan Kent, FNP-BC writes RE GEN RX prescriptions under Medical Director Dr. Mukesh Arora, MD — not a remote letterhead from another state.",
  },
  {
    question: "Is Hello Gorgeous a chain or franchise?",
    answer:
      "No. Hello Gorgeous is family-owned by Danielle Alcala-Glazier at 74 W. Washington St. in downtown Oswego. Dani still works in the office every day, answers texts, and invests in equipment — not a corporate med spa model.",
  },
  {
    question: "Where can I read answers about Botox, Morpheus8, and weight loss?",
    answer:
      "Our full med spa FAQ covers Botox, dermal fillers, Morpheus8 Burst, Quantum RF, Solaria CO₂, GLP-1 weight loss, hormone therapy, financing, and booking — 40+ answers in one place.",
  },
] as const;

type AboutSection = {
  id: string;
  number: string;
  title: string;
  badge?: string;
  description: string;
  highlights?: string[];
  image?: { src: string; alt: string; priority?: boolean };
  learnMoreHref?: string;
  learnMoreLabel?: string;
  extraLinks?: { label: string; href: string }[];
  bodyExtra?: string;
};

const SECTIONS: AboutSection[] = [
  {
    id: "founders",
    number: "01",
    title: "On Site Every Week",
    badge: "FOUNDER",
    description:
      "Danielle Alcala-Glazier at 74 W. Washington St., downtown Oswego — a real founder with a real story, not a franchise. Family-owned medical aesthetics under physician Medical Director oversight.",
    highlights: [
      "Family-owned · not a chain",
      "Downtown Oswego studio",
      "Physician-directed medical aesthetics",
      "Best of Oswego #1 Med Spa",
    ],
    image: {
      src: ABOUT_DANI_IMAGE,
      alt: "Danielle Alcala-Glazier, founder of Hello Gorgeous Med Spa in Oswego, IL",
      priority: true,
    },
    learnMoreHref: "/best-med-spa-oswego-il",
    learnMoreLabel: "Why we're #1 in Oswego →",
  },
  {
    id: "dani",
    number: "02",
    title: "Danielle Alcala-Glazier",
    badge: "OWNER & FOUNDER",
    description: DANI_MEDIUM_BIO,
    highlights: [
      "Licensed Esthetician · Phlebotomist · CMAA · CNA",
      "RN degree in progress",
      "InMode Trifecta: Morpheus8 · Quantum RF · Solaria CO₂",
      "Microblading · skin · hands-on care daily",
    ],
    image: {
      src: ABOUT_DANI_IMAGE,
      alt: "Danielle Alcala-Glazier, Licensed Esthetician and founder of Hello Gorgeous Med Spa in Oswego, IL",
    },
  },
  {
    id: "story",
    number: "03",
    title: "The Story Behind the Name",
    description: DANI_LONG_BIO,
    learnMoreHref: "/blog/my-jerry-maguire-moment",
    learnMoreLabel: "Read: My Jerry Maguire Moment →",
  },
  {
    id: "recognition",
    number: "04",
    title: "Awards & The Practice in Numbers",
    description:
      "More than a decade serving Oswego, Naperville, Aurora, Plainfield, and the western suburbs — with community recognition and serious investment in technology most local practices don't offer.",
    highlights: [
      `${SITE.reviewRating}★ on Google · ${SITE.reviewCount} reviews`,
      "Best of Oswego #1 Med Spa",
      "Best Skincare · Best Weight Loss",
      "Best in Class awards 2023, 2025, 2026",
    ],
    learnMoreHref: "/faq",
    learnMoreLabel: "Read the full FAQ →",
    extraLinks: [
      { label: "Meet the full team — Kristina, Michelle, Laura & Jen →", href: "/meet-the-team" },
    ],
  },
];

function AboutSectionRow({ section, index }: { section: AboutSection; index: number }) {
  const showCerts = section.id === "dani";

  return (
    <FadeUp delayMs={index * 40}>
      <article id={section.id} className="scroll-mt-24 border-b border-white/10 py-10 md:py-14 last:border-b-0">
        <div className="flex gap-5 md:gap-10">
          <span
            className="shrink-0 font-serif text-5xl md:text-6xl leading-none text-white/10 tabular-nums select-none"
            aria-hidden
          >
            {section.number}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-serif text-2xl md:text-3xl text-white tracking-tight">{section.title}</h2>
              {section.badge ? (
                <span className="rounded-full border border-[#FF2D8E]/40 bg-[#FF2D8E]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#FFB8DC]">
                  {section.badge}
                </span>
              ) : null}
            </div>

            {section.image ? (
              <div className="mt-5 grid gap-6 md:grid-cols-[180px_1fr] md:items-start">
                <div className="relative aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={section.image.src}
                    alt={section.image.alt}
                    fill
                    className="object-cover object-top"
                    sizes="220px"
                    priority={section.image.priority}
                  />
                </div>
                <div>
                  <p className="max-w-2xl text-sm md:text-base leading-relaxed text-gray-400 whitespace-pre-line">
                    {section.description}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed text-gray-400 whitespace-pre-line">
                {section.description}
              </p>
            )}

            {section.bodyExtra ? (
              <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-gray-400 whitespace-pre-line">
                {section.bodyExtra}
              </p>
            ) : null}

            {section.highlights && section.highlights.length > 0 ? (
              <ul className="mt-5 space-y-2">
                {section.highlights.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-gray-300">
                    <span className="text-[#FF2D8E]" aria-hidden>
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            {showCerts ? (
              <div className="mt-6">
                <InModeTrainingCertificates
                  items={DANIELLE_INMODE_CERTIFICATES}
                  compact
                  title="InMode verified training"
                  subtitle="Luxora, Morpheus8 Deep, Quantum RF, Solaria CO₂ — InMode clinical education."
                />
              </div>
            ) : null}

            {section.id === "recognition" ? (
              <div className="mt-8 space-y-8">
                <BestOfOswegoBadge variant="default" />
                <div className="grid grid-cols-2 gap-3">
                  {PRACTICE_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/10 bg-[#151922] p-4 text-center"
                    >
                      <p className="text-xl md:text-2xl font-black tabular-nums text-[#FFB8DC]">{stat.value}</p>
                      <p className="mt-1 text-xs font-medium text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {section.learnMoreHref ? (
              <Link
                href={section.learnMoreHref}
                className="mt-5 inline-block text-sm font-bold text-[#FF2D8E] hover:underline"
              >
                {section.learnMoreLabel ?? "Learn more →"}
              </Link>
            ) : null}

            {section.extraLinks?.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mt-3 block text-sm font-bold text-[#FF2D8E] hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </article>
    </FadeUp>
  );
}

export function AboutPageContent() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 50% -5%, rgba(230,0,126,0.15) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 0% 50%, rgba(125,211,252,0.08) 0%, transparent 50%),
            #0a0a0a
          `,
        }}
      />

      <Section className="relative border-b-4 border-black py-14 md:py-20 !px-0">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">
              Oswego, IL · family-owned
            </p>
            <h1 className="mt-4 text-4xl md:text-6xl font-black leading-tight">
              Meet{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                Danielle
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75 leading-relaxed">
              A real founder with a real story. Family-owned at{" "}
              <Link href="/best-med-spa-oswego-il" className="text-[#FFB8DC] hover:underline">
                #1 Best Med Spa in Oswego
              </Link>
              . Serving Naperville, Aurora &amp; Plainfield.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
              <CTA href={BOOKING_URL} variant="gradient" className="!px-8 !py-4">
                Book consultation
              </CTA>
              <CTA
                href="/services"
                variant="outline"
                className="!border-[#FF2D8E] !text-[#FFB8DC] hover:!bg-[#FF2D8E] hover:!text-white !px-8 !py-4"
              >
                View services
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section className="!px-0 border-b-4 border-black py-10 md:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">
              The four of us
            </p>
            <h2 className="mt-2 text-center font-serif text-2xl font-bold text-white md:text-3xl">
              Owner · Prescriber · RN injector · Medical Director
            </h2>
          </FadeUp>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {MEDICAL_TRUST_PROVIDERS.map((person, i) => (
              <FadeUp key={person.name} delayMs={i * 40}>
                <Link
                  href={person.href}
                  className="block overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
                >
                  <div className="relative aspect-[3/4] bg-[#f8f4f0]">
                    <Image
                      src={person.image}
                      alt={person.imageAlt}
                      fill
                      className={
                        person.name === "Kristina Huda, BSN, RN"
                          ? "object-cover object-[center_28%]"
                          : "object-cover object-center"
                      }
                      sizes="(max-width: 1024px) 45vw, 22vw"
                    />
                  </div>
                  <div className="border-t-4 border-black p-3 sm:p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#E6007E]">
                      {person.badge}
                    </p>
                    <p className="mt-1 text-sm font-black leading-snug text-black sm:text-base">
                      {person.name}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-[#E6007E]">{person.role}</p>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section className="!px-0 py-4 md:py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {SECTIONS.map((section, i) => (
            <AboutSectionRow key={section.id} section={section} index={i} />
          ))}
        </div>
      </Section>

      <Section className="border-t-4 border-black bg-[#0a0a0a] py-12 md:py-16 !px-0">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FadeUp>
            <h2 className="text-center font-serif text-2xl md:text-3xl text-white">Common questions</h2>
          </FadeUp>
          <div className="mt-8 space-y-3">
            {ABOUT_FAQS.map((faq, i) => (
              <FadeUp key={faq.question} delayMs={i * 30}>
                <details className="rounded-xl border border-white/10 bg-[#151922] open:border-[#FF2D8E]/30">
                  <summary className="cursor-pointer list-none px-5 py-4 text-sm font-bold text-[#FFB8DC] [&::-webkit-details-marker]:hidden">
                    {faq.question}
                  </summary>
                  <p className="border-t border-white/10 px-5 py-4 text-sm leading-relaxed text-gray-400">
                    {faq.answer}
                    {faq.question.includes("male + female") ? (
                      <>
                        {" "}
                        <Link
                          href="/blog/male-female-practitioners-med-spa-advantage-oswego-il"
                          className="font-bold text-[#FF2D8E] hover:underline"
                        >
                          Read the article →
                        </Link>
                      </>
                    ) : null}
                    {faq.question.includes("Botox") ? (
                      <>
                        {" "}
                        <Link href="/faq" className="font-bold text-[#FF2D8E] hover:underline">
                          Go to FAQ →
                        </Link>
                      </>
                    ) : null}
                  </p>
                </details>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] border-t-4 border-black py-14 md:py-16 !px-0">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white">Ready to get started?</h2>
          <p className="mt-3 text-white/90 font-medium">
            {SITE.address.streetAddress}, {SITE.address.addressLocality}, IL · {SITE.phone}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <CTA href={BOOKING_URL} variant="white">
              Book online
            </CTA>
            <CTA href={`tel:${SITE.phone.replace(/\D/g, "")}`} variant="outline">
              Call {SITE.phone}
            </CTA>
          </div>
        </div>
      </Section>
    </div>
  );
}
