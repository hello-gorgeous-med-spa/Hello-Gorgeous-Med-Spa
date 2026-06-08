"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  appForHimUrl,
  FOR_HIM_SERVICES,
  GENTLEMENS_CLUB_FAQS,
  GENTLEMENS_CLUB_FATHERS_DAY_IMAGE,
  GENTLEMENS_CLUB_HERO_IMAGE,
  GENTLEMENS_CLUB_PILLS,
  GENTLEMENS_CLUB_TIERS,
} from "@/lib/gentlemens-club";
import { SITE } from "@/lib/seo";

/** Dark menu card — matches IV Therapy drip grid. */
function MenuCard({
  title,
  accentLine,
  description,
  badge,
}: {
  title: string;
  accentLine: string;
  description: string;
  badge?: string;
}) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#151922] p-6 transition-all duration-300 hover:border-[#FF2D8E]/50 hover:shadow-[0_0_24px_rgba(255,45,142,0.12)]">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="font-serif text-2xl text-white tracking-tight">{title}</h3>
        {badge ? (
          <span className="rounded-full border border-[#FF2D8E]/40 bg-[#FF2D8E]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#FFB8DC]">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="text-sm font-medium leading-relaxed text-[#7dd3fc]">{accentLine}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-400">{description}</p>
    </article>
  );
}

function TierCard({
  tier,
}: {
  tier: (typeof GENTLEMENS_CLUB_TIERS)[number];
}) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border p-6 md:p-8 transition-all duration-300 ${
        tier.highlight
          ? "border-[#FF2D8E]/40 bg-[#151922] shadow-[0_0_32px_rgba(255,45,142,0.08)]"
          : "border-white/10 bg-[#151922] hover:border-[#7dd3fc]/40"
      }`}
    >
      {tier.highlight ? (
        <span className="absolute -top-3 left-6 rounded-full bg-[#FF2D8E] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          Most popular
        </span>
      ) : null}

      <h3 className="mt-1 font-serif text-2xl text-white tracking-tight">{tier.name}</h3>
      <p className={`mt-3 text-4xl font-black tabular-nums ${tier.highlight ? "text-white" : "text-[#7dd3fc]"}`}>
        ${tier.pricePerMonth}
        <span className="text-lg font-semibold text-gray-500">/mo</span>
      </p>
      <p className="mt-3 text-sm font-medium leading-relaxed text-[#7dd3fc]">
        {tier.perks.slice(0, 3).join(" • ")}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-gray-400">{tier.summary}</p>

      <ul className="mt-5 flex-1 space-y-2">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex gap-2 text-sm text-gray-300">
            <span className={tier.highlight ? "text-[#FF2D8E]" : "text-[#7dd3fc]"} aria-hidden>
              {tier.highlight ? "♥" : "★"}
            </span>
            {perk}
          </li>
        ))}
      </ul>

      {tier.footnote ? <p className="mt-4 text-xs text-gray-500">{tier.footnote}</p> : null}

      <a
        href={tier.squarePayUrl ?? BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-6 block rounded-xl px-6 py-3 text-center text-sm font-bold transition-all ${
          tier.highlight
            ? "bg-[#FF2D8E] text-white hover:bg-[#e0267d]"
            : "border-2 border-[#7dd3fc]/50 text-[#7dd3fc] hover:bg-[#7dd3fc]/10"
        }`}
      >
        Join {tier.name}
      </a>
    </article>
  );
}

export function GentlemensClubPageContent() {
  const appUrl = appForHimUrl();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 50% -5%, rgba(59,130,246,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 100% 40%, rgba(255,45,142,0.12) 0%, transparent 50%),
            #0a0a0a
          `,
        }}
      />

      {/* Hero flyer */}
      <Section className="relative border-b-4 border-black py-10 md:py-14 !px-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h1 className="sr-only">
              The Gentlemen&apos;s Club — Men&apos;s Wellness Membership at Hello Gorgeous Med Spa, Oswego IL
            </h1>
            <div className="relative overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(255,45,142,0.35)]">
              <div className="relative aspect-[16/10] w-full md:aspect-[21/9]">
                <Image
                  src={GENTLEMENS_CLUB_HERO_IMAGE}
                  alt="The Gentlemen's Club — Brotox, hormones, peptide therapy and recovery for men at Hello Gorgeous Med Spa Oswego IL"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 1152px"
                  priority
                />
              </div>
            </div>

            <div className="mt-8 text-center md:text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFB8DC]">👑 For Him · Oswego, IL</p>
              <p className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                {GENTLEMENS_CLUB_PILLS.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/70"
                  >
                    {pill}
                  </span>
                ))}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3 justify-center md:justify-start">
                <CTA href={BOOKING_URL} variant="gradient" className="!px-8 !py-4">
                  Book Your Consult
                </CTA>
                <CTA href="#pricing" variant="outline" className="!border-[#FF2D8E] !text-[#FFB8DC] hover:!bg-[#FF2D8E] hover:!text-white !px-8 !py-4">
                  View Membership Tiers
                </CTA>
                <CTA href={appUrl} variant="outline" className="!border-[#7dd3fc]/50 !text-[#7dd3fc] hover:!bg-[#7dd3fc]/10 !px-8 !py-4">
                  Open App — For Him
                </CTA>
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Men's services — 4-col drip-style grid */}
      <Section className="py-12 md:py-16 bg-[#0a0a0a] !py-12 md:!py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <FadeUp>
            <div className="mb-10 max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">Men&apos;s services</p>
              <h2 className="mt-2 font-serif text-2xl md:text-3xl text-white">Built for how men show up</h2>
              <p className="mt-2 text-white/55">
                Brotox, hormones, peptides &amp; recovery — private, judgment-free, NP-led in downtown Oswego.
              </p>
            </div>
          </FadeUp>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FOR_HIM_SERVICES.map((svc, i) => (
              <FadeUp key={svc.id} delayMs={40 * (i % 4)}>
                <Link href={svc.href} target={"external" in svc && svc.external ? "_blank" : undefined} className="block h-full">
                  <MenuCard
                    title={svc.label}
                    badge={svc.badge}
                    accentLine={svc.cta}
                    description={svc.blurb}
                  />
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Membership tiers — dark cards, readable text */}
      <Section id="pricing" className="scroll-mt-24 border-y-4 border-black bg-[#0a0a0a] !py-14 md:!py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <FadeUp>
            <div className="mb-10 text-center">
              <h2 className="font-serif text-3xl md:text-4xl text-white">Choose Your Tier</h2>
              <p className="mt-2 text-gray-400">No contracts. Cancel anytime.</p>
            </div>
          </FadeUp>

          <div className="grid gap-6 md:grid-cols-2">
            {GENTLEMENS_CLUB_TIERS.map((tier, i) => (
              <FadeUp key={tier.id} delayMs={60 * i}>
                <TierCard tier={tier} />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* What's included — 4-col grid */}
      <Section className="bg-[#0a0a0a] !py-12 md:!py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <FadeUp>
            <div className="mb-10 max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">Membership perks</p>
              <h2 className="mt-2 font-serif text-2xl md:text-3xl text-white">What&apos;s included</h2>
            </div>
          </FadeUp>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Brotox", line: "Member pricing · Neurotoxin", desc: "Member pricing on every neurotoxin treatment. Look sharp, no big deal." },
              { title: "Hormone Optimization", line: "Lab-guided · TRT", desc: "Lab-guided TRT and hormone care. Energy, strength, libido, mood." },
              { title: "Peptide Therapy", line: "BPC-157 · Sermorelin · NAD+", desc: "Recovery, performance, body composition. The cutting edge." },
              { title: "Monthly Wellness Shot", line: "B12 · Lipo-C · NAD+", desc: "B12, Lipo-C, or NAD+ every month. Your call." },
            ].map((item, i) => (
              <FadeUp key={item.title} delayMs={40 * (i % 4)}>
                <MenuCard title={item.title} accentLine={item.line} description={item.desc} />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Father's Day promo */}
      <Section className="border-t border-white/10 bg-[#030712] !py-12 md:!py-16">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <FadeUp>
              <div className="relative overflow-hidden rounded-2xl border border-white/10">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={GENTLEMENS_CLUB_FATHERS_DAY_IMAGE}
                    alt="Happy Father's Day — Gift Brotox at Hello Gorgeous Med Spa"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </FadeUp>
            <FadeUp delayMs={80}>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">Gift Brotox</p>
              <h2 className="mt-2 font-serif text-2xl md:text-3xl text-white">
                Because you love him… <span className="text-gray-500">but his frown lines had to go.</span>
              </h2>
              <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                eGift cards deliver instantly through Square — perfect for dads, husbands &amp; boyfriends.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <CTA href={FOR_HIM_SERVICES[3].href} variant="gradient">
                  Buy eGift Card
                </CTA>
                <CTA href={BOOKING_URL} variant="outline" className="!border-white/30 !text-white hover:!bg-white hover:!text-black">
                  Book Brotox
                </CTA>
              </div>
            </FadeUp>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-[#0a0a0a] !py-14 md:!py-20">
        <div className="max-w-3xl mx-auto px-4 w-full">
          <FadeUp>
            <h2 className="font-serif text-2xl md:text-3xl text-white mb-8 text-center">Questions</h2>
            <div className="space-y-4">
              {GENTLEMENS_CLUB_FAQS.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-white/10 bg-[#151922] open:border-[#FF2D8E]/40"
                >
                  <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-white hover:text-[#FFB8DC] flex items-center justify-between gap-3">
                    {faq.question}
                    <span className="text-[#FF2D8E] group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="px-5 pb-4 text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Closing CTA */}
      <section
        className="border-t-4 border-black py-16 md:py-20"
        style={{ background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-3xl mb-2" aria-hidden>
            👑
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to join?</h2>
          <p className="text-white/90 text-lg mb-8">
            Book your complimentary consult — Ryan Kent, FNP-BC on site 7 days a week.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <CTA href={BOOKING_URL} variant="white">
              Book Your Consult
            </CTA>
            <CTA href={appUrl} variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-[#E6007E]">
              Open App — For Him
            </CTA>
          </div>
          <p className="mt-6 text-sm text-white/75">
            📍 {SITE.address.streetAddress}, {SITE.address.addressLocality} · 📞 {SITE.phone}
          </p>
        </div>
      </section>
    </div>
  );
}
