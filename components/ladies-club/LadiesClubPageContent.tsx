"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { ClubBeforeYouCallStrip } from "@/components/club/ClubBeforeYouCallStrip";
import { ClubFlyerGallery } from "@/components/club/ClubFlyerGallery";
import { ClubStartHereBand } from "@/components/club/ClubStartHereBand";
import { ClubStickyCta } from "@/components/club/ClubStickyCta";
import { FadeUp, Section } from "@/components/Section";
import { LADIES_CLUB_START_PATHS, LADIES_CLUB_STICKY_CTA } from "@/lib/club-start-here";
import { PROGRAM_CONSULT_BOOKING_URL } from "@/lib/flows";
import { RYAN_FULL_NAME } from "@/lib/founder-credentials";
import {
  CLUB_VITAMIN_FLYERS,
  LADIES_CLUB_GLP1_FLYERS,
  clubPeptideFlyers,
} from "@/lib/club-flyer-images";
import {
  appForHerUrl,
  LADIES_CLUB_BIOTE_INCLUDED,
  LADIES_CLUB_BIOTE_QUICK_FACTS,
  LADIES_CLUB_FAQS,
  LADIES_CLUB_GLP1_STACK,
  LADIES_CLUB_HERO_IMAGE,
  LADIES_CLUB_HERO_IMAGE_ALT,
  LADIES_CLUB_HORMONE_SYMPTOMS,
  LADIES_CLUB_JUMP_LINKS,
  LADIES_CLUB_MEMBERSHIP_TIERS,
  LADIES_CLUB_PILLARS,
  LADIES_CLUB_PILLS,
  LADIES_CLUB_PT141_FLYER,
  LADIES_CLUB_SCREENERS,
  LADIES_CLUB_SERVICES,
  LADIES_CLUB_WEIGHT_HORMONES_IMAGE,
} from "@/lib/ladies-club";
import { PEPTIDE_RETAIL_FROM_MONTHLY_USD } from "@/lib/peptide-retail-pricing";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { SITE } from "@/lib/seo";

function ServiceCard({ svc }: { svc: (typeof LADIES_CLUB_SERVICES)[number] }) {
  const linkClass = "mt-5 text-sm font-bold text-[#FF2D8E] hover:underline";
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#151922] transition hover:border-[#FF2D8E]/40">
      <div className="relative aspect-[16/10] w-full border-b border-white/10 bg-black">
        <Image
          src={svc.image}
          alt={svc.imageAlt}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        {svc.badge ? (
          <span className="absolute right-3 top-3 rounded-full border border-[#FF2D8E]/40 bg-[#FF2D8E]/90 px-2 py-0.5 text-[9px] font-bold uppercase text-white">
            {svc.badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF2D8E]">
          {svc.icon} {svc.eyebrow}
        </p>
        <h3 className="mt-2 text-xl font-black text-white">{svc.title}</h3>
        <p className="mt-3 text-sm text-gray-400">{svc.description}</p>
        <ul className="mt-4 flex-1 space-y-2">
          {svc.bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm text-gray-300">
              <span className="text-[#FF2D8E]">▸</span>
              {b}
            </li>
          ))}
        </ul>
        {svc.anchor ? (
          <a href={svc.href} className={linkClass}>{svc.cta}</a>
        ) : svc.external ? (
          <a href={svc.href} target="_blank" rel="noopener noreferrer" className={linkClass}>{svc.cta}</a>
        ) : (
          <Link href={svc.href} className={linkClass}>{svc.cta}</Link>
        )}
      </div>
    </article>
  );
}

export function LadiesClubPageContent() {
  const appUrl = appForHerUrl();

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 text-white md:pb-0">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 50% -5%, rgba(255,45,142,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 0% 50%, rgba(255,184,220,0.08) 0%, transparent 50%),
            #0a0a0a
          `,
        }}
      />

      {/* Hero */}
      <Section className="relative border-b border-white/10 !py-12 md:!py-20 !px-0">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <FadeUp>
            <div className="flex flex-wrap gap-2 mb-6">
              {LADIES_CLUB_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-[#FF2D8E]/30 bg-[#FF2D8E]/10 px-3 py-1 text-[10px] font-bold tracking-widest text-[#FFB8DC]"
                >
                  {pill}
                </span>
              ))}
            </div>
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFB8DC]">
                  Hello Gorgeous Med Spa · Oswego IL
                </p>
                <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
                  The Ladies&apos; Club
                </h1>
                <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-xl">
                  Hormones · GLP-1 · peptides · IV &amp; Vitamin Bar — one NP-led home for women&apos;s wellness at Hello Gorgeous.
                  {` `}{RYAN_FULL_NAME} on site 7 days.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <CTA href="/quiz/perimenopause-readiness" variant="gradient">
                    Take 2-min screener
                  </CTA>
                  <CTA href={PROGRAM_CONSULT_BOOKING_URL} variant="outline" className="!border-[#FF2D8E] !text-[#FFB8DC] hover:!bg-[#FF2D8E] hover:!text-white">
                    Book $49 consult
                  </CTA>
                  <CTA href={appUrl} variant="outline" className="!border-white/30 !text-white hover:!bg-white hover:!text-black">
                    Join in app
                  </CTA>
                </div>
                <ClubBeforeYouCallStrip />
              </div>
              <div className="overflow-hidden rounded-2xl border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(255,45,142,0.35)]">
                <div className="relative aspect-[1024/567] w-full">
                  <Image
                    src={LADIES_CLUB_HERO_IMAGE}
                    alt={LADIES_CLUB_HERO_IMAGE_ALT}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 1024px) 100vw, 560px"
                    priority
                  />
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      <ClubStartHereBand
        eyebrow="Not sure where to start?"
        title="Pick your path — we'll route you in 2 minutes"
        paths={LADIES_CLUB_START_PATHS}
      />

      {/* Jump nav */}
      <nav className="sticky top-[var(--header-offset,0px)] z-20 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto px-4 py-3">
          {LADIES_CLUB_JUMP_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full border border-white/15 px-4 py-1.5 text-xs font-bold text-gray-300 hover:border-[#FF2D8E] hover:text-[#FFB8DC]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Services */}
      <Section id="services" className="scroll-mt-24 border-t border-white/10 bg-[#1a1d24] !py-14 md:!py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">Women&apos;s services</p>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl text-white">Built for how you show up</h2>
          </FadeUp>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LADIES_CLUB_SERVICES.map((svc, i) => (
              <FadeUp key={svc.id} delayMs={40 * (i % 3)}>
                <ServiceCard svc={svc} />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Pillars */}
      <Section className="border-t border-white/10 bg-[#030712] !py-12 md:!py-16">
        <div className="max-w-7xl mx-auto px-4">
          <FadeUp>
            <h2 className="font-serif text-2xl md:text-3xl text-white">Why women choose Hello Gorgeous</h2>
          </FadeUp>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {LADIES_CLUB_PILLARS.map((pillar, i) => (
              <FadeUp key={pillar.title} delayMs={i * 40}>
                <article className="h-full rounded-2xl border border-white/10 bg-[#151922] p-6">
                  <h3 className="font-serif text-xl text-white">{pillar.title}</h3>
                  <p className="mt-3 text-sm text-[#FFB8DC] font-medium">Our promise</p>
                  <p className="mt-3 text-sm text-gray-400 leading-relaxed">{pillar.description}</p>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Hormones / BioTE */}
      <Section id="hormones" className="scroll-mt-24 border-t border-white/10 bg-[#0a0a0a] !py-14 md:!py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">Medical Services</p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl text-white">Weight Loss + Hormones</h2>
            <p className="mt-4 max-w-3xl text-gray-400">
              GLP-1 weight loss · HRT · TRT · BioTE — lab-guided bioidentical hormone therapy for perimenopause,
              menopause, and cycle-related symptoms.
            </p>
          </FadeUp>

          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
            <FadeUp>
              <div className="overflow-hidden rounded-2xl border-4 border-black shadow-[6px_6px_0_0_rgba(255,45,142,0.3)]">
                <div className="relative aspect-[16/10] w-full bg-black">
                  <Image
                    src={LADIES_CLUB_WEIGHT_HORMONES_IMAGE}
                    alt="Women's weight loss and hormone optimization — Hello Gorgeous Med Spa"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 560px"
                  />
                </div>
              </div>
            </FadeUp>
            <FadeUp delayMs={60}>
              <h3 className="text-xl font-black text-white">Signs worth discussing</h3>
              <p className="mt-2 text-sm text-gray-400">Often blamed on stress or aging — but addressable with the right labs.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {LADIES_CLUB_HORMONE_SYMPTOMS.slice(0, 6).map((s) => (
                  <div key={s.title} className="rounded-xl border border-white/10 bg-[#151922] p-4">
                    <span className="text-xl" aria-hidden>{s.icon}</span>
                    <p className="mt-2 font-bold text-white text-sm">{s.title}</p>
                    <p className="mt-1 text-xs text-gray-500">{s.description}</p>
                  </div>
                ))}
              </div>
              <Link href="/quiz/perimenopause-readiness" className="mt-6 inline-block font-bold text-[#FFB8DC] hover:underline">
                Take the 2-minute Perimenopause Screener →
              </Link>
            </FadeUp>
          </div>

          <FadeUp delayMs={80}>
            <h3 className="mt-16 text-center text-xl font-black uppercase tracking-tight text-white">BioTE quick facts</h3>
          </FadeUp>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LADIES_CLUB_BIOTE_QUICK_FACTS.map((fact, i) => (
              <FadeUp key={fact.label} delayMs={i * 30}>
                <div className="rounded-2xl border border-white/10 bg-[#151922] p-6 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{fact.label}</p>
                  <p className="mt-2 text-3xl font-black text-[#FF2D8E]">{fact.value}</p>
                  <p className="mt-2 text-sm text-gray-400">{fact.note}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[LADIES_CLUB_BIOTE_INCLUDED.oversight, LADIES_CLUB_BIOTE_INCLUDED.program].map((col, i) => (
              <FadeUp key={col.title} delayMs={i * 40}>
                <div className="rounded-2xl border border-white/10 bg-[#151922] p-6 md:p-8">
                  <h4 className="text-lg font-bold text-white">{col.title}</h4>
                  <ul className="mt-5 space-y-3">
                    {col.bullets.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-gray-300">
                        <span className="text-[#FF2D8E]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delayMs={100}>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTA href="/biote-hormone-therapy-oswego" variant="gradient">BioTE program →</CTA>
              <CTA href="/ladies-club/bhrt-cost" variant="outline" className="!border-white/30 !text-white">
                BHRT cost guide →
              </CTA>
              <CTA href="/blood-work" variant="outline" className="!border-white/30 !text-white">Lab guide →</CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* GLP-1 */}
      <Section id="glp1" className="scroll-mt-24 border-t border-white/10 bg-[#1a1d24] !py-14 md:!py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-wider text-[#FF2D8E]">Medical weight loss</p>
            <h2 className="mt-3 text-3xl font-black text-white">GLP-1 programs for women</h2>
            <p className="mt-4 max-w-2xl text-gray-400">
              NP-supervised semaglutide from ${LADIES_CLUB_GLP1_STACK.semaglutideFrom}/mo · tirzepatide from $
              {LADIES_CLUB_GLP1_STACK.tirzepatideFrom}/mo — medication, supplies, and included check-ins. Stack with
              BioTE when clinically appropriate.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTA href="/glp-1-weight-loss-oswego" variant="gradient">See GLP-1 program</CTA>
              <CTA href="/quiz/glp-1-readiness" variant="outline" className="!border-white/30 !text-white">GLP-1 screener</CTA>
            </div>
          </FadeUp>
          <ClubFlyerGallery flyers={LADIES_CLUB_GLP1_FLYERS} />
        </div>
      </Section>

      {/* Peptides / PT-141 */}
      <Section id="peptides" className="scroll-mt-24 border-t border-white/10 bg-[#0a0a0a] !py-14 md:!py-20">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">Hello Gorgeous RX™</p>
            <h2 className="mt-2 text-center text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              {LADIES_CLUB_PT141_FLYER.name} — {LADIES_CLUB_PT141_FLYER.tagline}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-gray-400">
              {LADIES_CLUB_PT141_FLYER.description} Protocols from ${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo after evaluation.
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
            <FadeUp delayMs={40}>
              <div className="overflow-hidden rounded-2xl border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(255,45,142,0.35)]">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={LADIES_CLUB_PT141_FLYER.image}
                    alt={LADIES_CLUB_PT141_FLYER.imageAlt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 560px"
                  />
                </div>
              </div>
            </FadeUp>
            <FadeUp delayMs={80}>
              <ul className="space-y-3">
                {LADIES_CLUB_PT141_FLYER.bullets.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-semibold text-white/90">
                    <span className="text-[#FF2D8E]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-2xl font-black text-white">
                From ${LADIES_CLUB_PT141_FLYER.fromMonthlyUsd}
                <span className="text-base font-semibold text-gray-500">/mo</span>
              </p>
              <p className="mt-2 text-sm text-gray-500">
                ${PEPTIDE_CONSULT_FEE_USD} NP consult · medication billed separately
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CTA href={PROGRAM_CONSULT_BOOKING_URL} variant="gradient">Book $49 consult</CTA>
                <CTA href={LADIES_CLUB_PT141_FLYER.learnMoreHref} variant="outline" className="!border-white/30 !text-white">
                  PT-141 guide →
                </CTA>
                <CTA href="/peptides" variant="outline" className="!border-white/30 !text-white">
                  Full peptide menu →
                </CTA>
              </div>
            </FadeUp>
          </div>

          <FadeUp delayMs={120}>
            <h3 className="mt-16 text-center text-xl font-black uppercase tracking-tight text-white md:text-2xl">
              Peptide protocols we prescribe
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-500">
              BPC-157, TB-500, GHK-Cu, sermorelin, NAD+, CJC/Ipamorelin &amp; more — after NP evaluation.
            </p>
          </FadeUp>
          <ClubFlyerGallery flyers={clubPeptideFlyers("ladies")} columns={3} />
        </div>
      </Section>

      {/* Vitamin Bar */}
      <Section id="vitamin-bar" className="scroll-mt-24 border-t border-white/10 bg-[#1a1d24] !py-14 md:!py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">The Vitamin Bar</p>
            <h2 className="mt-2 text-3xl font-black text-white">IV drips &amp; drive-thru shots</h2>
            <p className="mt-4 max-w-2xl text-gray-400">
              NAD+, glutathione, biotin, tri-immune &amp; more — member pricing from $49/mo with Glow Pass.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <CTA href="/iv-shots" variant="gradient">IV &amp; shots menu</CTA>
              <CTA href="/vitamin-bar" variant="outline" className="!border-white/30 !text-white">Vitamin Bar app</CTA>
            </div>
          </FadeUp>
          <ClubFlyerGallery flyers={CLUB_VITAMIN_FLYERS} columns={3} />
        </div>
      </Section>

      {/* Screeners */}
      <Section id="screeners" className="scroll-mt-24 border-t border-white/10 bg-[#030712] !py-12 md:!py-16">
        <div className="max-w-4xl mx-auto px-4">
          <FadeUp>
            <h2 className="font-serif text-2xl text-white">Not sure where to start?</h2>
            <p className="mt-2 text-gray-400">2-minute educational screeners — not a diagnosis.</p>
          </FadeUp>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {LADIES_CLUB_SCREENERS.map((screener, i) => (
              <FadeUp key={screener.id} delayMs={i * 40}>
                <Link
                  href={screener.href}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#151922] p-6 transition hover:border-[#FF2D8E]/40"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white group-hover:text-[#FFB8DC]">{screener.title}</h3>
                    {"badge" in screener && screener.badge ? (
                      <span className="rounded-full bg-[#FF2D8E] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        {screener.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 flex-1 text-sm text-gray-400">{screener.sub}</p>
                  <span className="mt-4 text-[#FF2D8E]">→</span>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Membership */}
      <Section id="pricing" className="scroll-mt-24 border-t border-white/10 bg-[#0a0a0a] !py-14 md:!py-20">
        <div className="max-w-5xl mx-auto px-4">
          <FadeUp>
            <h2 className="text-center text-3xl font-black text-white">Membership</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-gray-400">
              Women&apos;s Hormone Member plus Glow aesthetic tiers — month-to-month through Square.
            </p>
          </FadeUp>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {LADIES_CLUB_MEMBERSHIP_TIERS.map((tier, i) => (
              <FadeUp key={tier.id} delayMs={i * 50}>
                <article
                  className={`flex h-full flex-col rounded-2xl border p-6 md:p-8 ${
                    tier.highlight
                      ? "border-[#FF2D8E]/40 bg-[#151922] shadow-[0_0_32px_rgba(255,45,142,0.08)]"
                      : "border-white/10 bg-[#151922]"
                  }`}
                >
                  {tier.highlight ? (
                    <span className="mb-3 inline-block w-fit rounded-full bg-[#FF2D8E] px-3 py-1 text-[10px] font-bold uppercase text-white">
                      Most popular
                    </span>
                  ) : null}
                  <h3 className="font-serif text-2xl text-white">{tier.name}</h3>
                  <p className="mt-3 text-4xl font-black text-[#FFB8DC]">
                    ${tier.pricePerMonth}
                    <span className="text-lg text-gray-500">/mo</span>
                  </p>
                  <p className="mt-3 text-sm text-gray-400">{tier.summary}</p>
                  <ul className="mt-5 flex-1 space-y-2">
                    {tier.perks.map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-gray-300">
                        <span className="text-[#FF2D8E]">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  {tier.footnote ? <p className="mt-4 text-xs text-gray-500">{tier.footnote}</p> : null}
                  <CTA
                    href={"href" in tier && tier.href ? tier.href : PROGRAM_CONSULT_BOOKING_URL}
                    variant={tier.highlight ? "gradient" : "outline"}
                    className={`mt-6 ${!tier.highlight ? "!border-white/30 !text-white" : ""}`}
                  >
                    {tier.highlight ? "Book consult" : "View memberships"}
                  </CTA>
                </article>
              </FadeUp>
            ))}
          </div>
          <FadeUp delayMs={120}>
            <p className="mt-8 text-center text-sm text-gray-500">
              Vitamin Bar plans from $49/mo ·{" "}
              <Link href="/monthly-memberships" className="text-[#FF2D8E] hover:underline">
                See all wellness memberships →
              </Link>
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="scroll-mt-24 border-t border-white/10 bg-[#030712] !py-14 md:!py-20">
        <div className="max-w-3xl mx-auto px-4">
          <FadeUp>
            <h2 className="font-serif text-2xl text-white">FAQ</h2>
          </FadeUp>
          <dl className="mt-8 space-y-8">
            {LADIES_CLUB_FAQS.map((faq, i) => (
              <FadeUp key={faq.question} delayMs={i * 30}>
                <div>
                  <dt className="font-bold text-[#FF2D8E]">{faq.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-gray-400">{faq.answer}</dd>
                </div>
              </FadeUp>
            ))}
          </dl>
        </div>
      </Section>

      {/* CTA */}
      <Section className="border-t border-white/10 !py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white">Ready to feel like yourself again?</h2>
          <p className="mt-4 text-gray-400">
            Start with a screener or book online — text us if you have a quick question.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <CTA href="/quiz/perimenopause-readiness" variant="gradient">
              Take screener
            </CTA>
            <CTA href={PROGRAM_CONSULT_BOOKING_URL} variant="outline" className="!border-[#FF2D8E] !text-[#FFB8DC]">
              Book $49 consult
            </CTA>
            <CTA href={`sms:${SITE.phone.replace(/\D/g, "")}`} variant="outline" className="!border-white/30 !text-white">
              Text us
            </CTA>
          </div>
        </div>
      </Section>

      <ClubStickyCta config={LADIES_CLUB_STICKY_CTA} />
    </div>
  );
}
