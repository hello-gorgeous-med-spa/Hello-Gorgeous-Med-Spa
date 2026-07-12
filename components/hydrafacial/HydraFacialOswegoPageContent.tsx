"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  JOURNEY_SECTION_BG_A,
  JOURNEY_SECTION_BG_B,
  JourneyChip,
  JourneyGhostBtn,
  JourneyPinkBtn,
  JourneySectionHead,
  JourneyTrustBar,
} from "@/components/marketing/JourneyPageUi";
import { RealPatientReviews } from "@/components/RealPatientReviews";
import {
  HYDRAFACIAL_ARTIST,
  HYDRAFACIAL_FAQS,
  HYDRAFACIAL_IMAGES,
  HYDRAFACIAL_MARISSA_SPECIAL,
  HYDRAFACIAL_MARKETING,
  HYDRAFACIAL_MEMBERSHIP,
  HYDRAFACIAL_NAV,
  HYDRAFACIAL_PLATFORM,
  HYDRAFACIAL_PREMIUM_ADDONS,
  HYDRAFACIAL_PRICING,
  HYDRAFACIAL_TECH_STEPS,
  HYDRAFACIAL_TREATS,
} from "@/lib/hydrafacial-marketing";
import { SITE } from "@/lib/seo";

export function HydraFacialOswegoPageContent() {
  const [navOpen, setNavOpen] = useState(false);
  const special = HYDRAFACIAL_MARISSA_SPECIAL;

  return (
    <div className="min-h-[100dvh] bg-black font-sans text-white">
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/82 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5 font-bold">
            <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-[13px] font-extrabold text-white">
              HG
            </span>
            <span className="hidden text-base sm:inline">Hello Gorgeous Med Spa</span>
          </div>
          <button
            type="button"
            className="rounded-lg border border-white/20 px-3 py-1.5 text-sm font-bold lg:hidden"
            onClick={() => setNavOpen((o) => !o)}
            aria-expanded={navOpen}
            aria-label="Toggle menu"
          >
            Menu
          </button>
          <div className="hidden items-center gap-7 text-[15px] lg:flex">
            {HYDRAFACIAL_NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-white/75 transition hover:text-white">
                {item.label}
              </a>
            ))}
            <JourneyPinkBtn href={special.bookHref} className="!px-5 !py-2.5 !text-sm">
              Book $129
            </JourneyPinkBtn>
          </div>
        </div>
        {navOpen ? (
          <div className="border-t border-white/10 px-6 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {HYDRAFACIAL_NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-white/85"
                  onClick={() => setNavOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <JourneyPinkBtn href={special.bookHref}>Book Marissa’s $129 special</JourneyPinkBtn>
            </div>
          </div>
        ) : null}
      </nav>

      {/* Hero — image-led like microblading journey */}
      <header className="relative overflow-hidden bg-[radial-gradient(120%_80%_at_50%_-10%,#2a0820_0%,#0a0206_45%,#000_100%)]">
        <div
          className="pointer-events-none absolute -right-28 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,45,142,0.28),transparent_62%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-24">
          <div>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.3em] text-[#FF2D8E]">
              {HYDRAFACIAL_MARKETING.eyebrow}
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
              Oswego · Naperville · Aurora · Yorkville
            </p>
            <h1 className="mt-4 font-serif text-[40px] font-bold leading-[1.05] text-white lg:text-[58px]">
              HydraFacial in <span className="text-[#FF2D8E]">Oswego, IL</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80">
              {HYDRAFACIAL_MARKETING.subhead}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <JourneyPinkBtn href={special.bookHref}>{special.ctaLabel}</JourneyPinkBtn>
              <JourneyGhostBtn href={HYDRAFACIAL_MARKETING.phoneHref}>
                Call {HYDRAFACIAL_MARKETING.phoneDisplay}
              </JourneyGhostBtn>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <JourneyChip>Rejuva Fresh platform</JourneyChip>
              <JourneyChip>$129 with Marissa</JourneyChip>
              <JourneyChip>Zero downtime</JourneyChip>
            </div>
          </div>
          <div className="mx-auto w-full overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)] lg:max-w-lg">
            <div className="relative aspect-[4/5] w-full bg-black sm:aspect-square">
              <Image
                src={HYDRAFACIAL_IMAGES.treatment}
                alt="Rejuva Fresh Hydra Spa Infusion HydraFacial treatment at Hello Gorgeous Med Spa"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 520px"
              />
            </div>
          </div>
        </div>
      </header>
      <JourneyTrustBar />

      {/* $129 Special band */}
      <section id="special" className={`${JOURNEY_SECTION_BG_A} scroll-mt-24 px-6 py-16 lg:py-20`}>
        <div className="mx-auto max-w-[1200px] rounded-[20px] border-2 border-[#FF2D8E] bg-[#0a0206] p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-[#FF2D8E] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-black">
                {special.badge}
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-white sm:text-4xl">{special.title}</h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-white/55">
                {special.duration}
              </p>
              <ul className="mt-5 space-y-2.5 text-[15px] text-white/85">
                {special.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="shrink-0 font-black text-[#FF2D8E]">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-white/60">{special.note}</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="font-serif text-5xl font-bold text-[#FF2D8E] sm:text-6xl">{special.price}</p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-white/55">
                {special.priceNote}
              </p>
              <div className="mt-6">
                <JourneyPinkBtn href={special.bookHref}>{special.ctaLabel}</JourneyPinkBtn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section id="technology" className="scroll-mt-24 px-6 py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[#FF2D8E]/35 bg-[#0a0206]">
            <Image
              src={HYDRAFACIAL_IMAGES.device}
              alt="Rejuva Fresh Hydra Spa Infusion machine at Hello Gorgeous Med Spa"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
          <div>
            <JourneySectionHead
              eyebrow={HYDRAFACIAL_PLATFORM.brand}
              title={HYDRAFACIAL_PLATFORM.product}
              titleAccent="technology"
              description={HYDRAFACIAL_PLATFORM.body}
            />
            <ul className="mt-6 space-y-2.5">
              {HYDRAFACIAL_PLATFORM.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-[15px] text-white/85">
                  <span className="shrink-0 font-black text-[#FF2D8E]">✓</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {HYDRAFACIAL_TECH_STEPS.map((s) => (
                <article key={s.step} className="rounded-[20px] border border-white/14 bg-[#0a0206] p-4">
                  <p className="font-serif text-2xl font-bold text-[#FF2D8E]/50">{s.step}</p>
                  <h3 className="mt-1 font-serif text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Premium add-ons */}
      <section id="add-ons" className={`${JOURNEY_SECTION_BG_B} scroll-mt-24 px-6 py-16 lg:py-20`}>
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow="Customize your glow"
            title="Pick 2 premium"
            titleAccent="add-ons"
            description="Included with Marissa’s $129 special — choose any two modalities from the Rejuva Fresh platform."
            center
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HYDRAFACIAL_PREMIUM_ADDONS.map((addon) => (
              <article
                key={addon.name}
                className="rounded-[20px] border border-white/14 bg-[#0a0206] p-5 transition hover:border-[#FF2D8E]/50"
              >
                <h3 className="font-serif text-lg font-bold text-[#FF2D8E]">{addon.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{addon.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Marissa */}
      <section id="artist" className="scroll-mt-24 px-6 py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-[#FF2D8E]/35">
            <Image
              src={HYDRAFACIAL_ARTIST.image}
              alt={HYDRAFACIAL_ARTIST.name}
              fill
              className="object-cover object-top"
              sizes="400px"
            />
          </div>
          <div>
            <JourneySectionHead
              eyebrow="Your esthetician"
              title={HYDRAFACIAL_ARTIST.name}
              titleAccent="· glow artist"
              description={HYDRAFACIAL_ARTIST.bio}
            />
            <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-[#FFB8DC]">
              {HYDRAFACIAL_ARTIST.role}
            </p>
            <blockquote className="mt-6 border-l-4 border-[#FF2D8E] pl-5 font-serif text-xl italic text-white/90">
              “{HYDRAFACIAL_ARTIST.quote}”
            </blockquote>
            <div className="mt-8">
              <JourneyPinkBtn href={special.bookHref}>Book with Marissa — $129</JourneyPinkBtn>
            </div>
          </div>
        </div>
      </section>

      {/* What it treats */}
      <section id="treats" className={`${JOURNEY_SECTION_BG_A} scroll-mt-24 px-6 py-16 lg:py-20`}>
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow="What it treats"
            title="One treatment,"
            titleAccent="dozens of benefits"
            description="Customized hydro-dermabrasion for all skin types — immediate glow, zero downtime."
            center
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HYDRAFACIAL_TREATS.map((item) => (
              <article key={item.concern} className="rounded-[20px] border border-white/14 bg-[#0a0206] p-5">
                <h3 className="font-serif text-lg font-bold text-[#FF2D8E]">{item.concern}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Membership + pricing */}
      <section id="pricing" className="scroll-mt-24 px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow="Pricing"
            title="Glow now,"
            titleAccent="or monthly"
            description="Start with Marissa’s $129 special — or lock in monthly glow with membership."
            center
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HYDRAFACIAL_PRICING.map((card) => (
              <Link
                key={card.name}
                href={card.href}
                className={`rounded-[20px] border p-5 transition hover:-translate-y-0.5 ${
                  card.featured
                    ? "border-[#FF2D8E] bg-[#140109] shadow-[0_12px_40px_rgba(255,45,142,0.2)]"
                    : "border-white/14 bg-[#0a0206] hover:border-[#FF2D8E]/40"
                }`}
              >
                {card.featured ? (
                  <span className="mb-3 inline-flex rounded-full bg-[#FF2D8E] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-black">
                    Featured
                  </span>
                ) : null}
                <h3 className="font-serif text-xl font-bold text-white">{card.name}</h3>
                <p className="mt-2 font-serif text-3xl font-bold text-[#FF2D8E]">{card.price}</p>
                <p className="mt-2 text-sm text-white/65">{card.note}</p>
              </Link>
            ))}
          </div>

          <div className="mt-10 rounded-[20px] border border-white/14 bg-[#0a0206] p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#FFB8DC]">
                  {HYDRAFACIAL_MEMBERSHIP.badge}
                </span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-white">
                  Monthly glow — HydraFacial + dermaplaning
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-white/80">
                  {HYDRAFACIAL_MEMBERSHIP.perks.map((perk) => (
                    <li key={perk} className="flex gap-2">
                      <span className="text-[#FF2D8E]" aria-hidden>
                        ✓
                      </span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-right">
                <p className="font-serif text-4xl font-bold text-[#FF2D8E]">
                  {HYDRAFACIAL_MEMBERSHIP.price}
                  <span className="text-lg font-semibold text-white/55">{HYDRAFACIAL_MEMBERSHIP.priceNote}</span>
                </p>
                <div className="mt-4">
                  <JourneyPinkBtn href={HYDRAFACIAL_MARKETING.appHref}>
                    {HYDRAFACIAL_MEMBERSHIP.ctaLabel}
                  </JourneyPinkBtn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`${JOURNEY_SECTION_BG_B} scroll-mt-24 px-6 py-16 lg:py-20`}>
        <div className="mx-auto max-w-[900px]">
          <JourneySectionHead eyebrow="FAQ" title="HydraFacial" titleAccent="questions" center />
          <div className="mt-10 space-y-3">
            {HYDRAFACIAL_FAQS.map((faq, idx) => (
              <details
                key={faq.question}
                className="group rounded-[20px] border border-white/14 bg-[#0a0206] open:border-[#FF2D8E]/50"
                {...(idx === 0 ? { open: true } : {})}
              >
                <summary className="cursor-pointer list-none px-5 py-4 font-bold text-white marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-3">
                    <span>{faq.question}</span>
                    <span className="text-[#FF2D8E] transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <div className="border-t border-white/10 px-5 pb-4 pt-3 text-sm leading-relaxed text-white/80">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-white text-black">
        <RealPatientReviews
          service="facial"
          serviceLabel="HydraFacial in Oswego"
          heading="Real HydraFacial results in Oswego"
          intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`}
        />
      </div>

      <section className="border-t-4 border-black bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] px-6 py-16 text-center">
        <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">Ready for your glow?</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/90">
          Book Marissa’s $129 HydraFacial + Dermaplaning special — oxygen spray and two premium add-ons included.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <JourneyPinkBtn href={special.bookHref} className="!bg-white !text-black hover:!bg-black hover:!text-white">
            Book $129 special
          </JourneyPinkBtn>
          <a
            href={HYDRAFACIAL_MARKETING.phoneHref}
            className="inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-3.5 text-base font-bold text-white transition hover:bg-white/10"
          >
            Call {HYDRAFACIAL_MARKETING.phoneDisplay}
          </a>
        </div>
      </section>
    </div>
  );
}
