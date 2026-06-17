"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { SpecialOfferCard } from "@/components/marketing/SpecialOfferCard";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { reviewTrustBody } from "@/lib/review-trust-copy";
import {
  MORE_SPECIALS_LINKS,
  SPECIALS_FEATURED,
  SPECIALS_JUMP_LINKS,
} from "@/lib/specials";
import {
  SIGNATURE_MENU_POSTER,
  SIGNATURE_MENU_SECTIONS,
} from "@/lib/signature-treatment-menu";
import { SITE } from "@/lib/seo";

export function SpecialsPageContent() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(230,0,126,0.12) 0%, transparent 55%),
            linear-gradient(180deg, #FFF0F7 0%, #ffffff 40%, #fafafa 100%)
          `,
        }}
      />

      <Section className="relative border-b-4 border-black !px-0 py-14 md:py-20">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a12 50%, #2d1020 100%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">
              Oswego, IL · NP-directed · Family-owned
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-6xl">
              Current{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                Specials
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-white/80">
              Signature pricing on injectables, Morpheus8, Quantum RF, and Solaria CO₂ — curated for clarity, not
              overwhelm. Every offer is provider-guided with a real consult first.
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/55">{reviewTrustBody()}</p>
            <div className="mt-8 flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
              <CTA href={BOOKING_URL} variant="gradient" className="!px-8 !py-4">
                Book Free Consultation
              </CTA>
              <CTA
                href="/help-me-choose"
                variant="outline"
                className="!border-[#FF2D8E] !px-8 !py-4 !text-[#FFB8DC] hover:!bg-[#FF2D8E] hover:!text-white"
              >
                Help Me Choose
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <nav
        aria-label="Specials sections"
        className="sticky top-16 z-30 border-b-4 border-black bg-white/80 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {SPECIALS_JUMP_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="shrink-0 rounded-full border-2 border-black bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-black transition hover:border-[#E6007E] hover:text-[#E6007E]"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/help-me-choose"
            className="shrink-0 rounded-full border-2 border-[#E6007E] bg-[#E6007E] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#FF2D8E]"
          >
            Not sure? Start here
          </Link>
        </div>
      </nav>

      <Section
        id="featured"
        className="scroll-mt-36 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-12 md:py-16 !px-0"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                Start here
              </span>
              <h2 className="mt-4 text-3xl font-black text-black md:text-4xl">Featured offers</h2>
              <p className="mt-3 text-sm font-medium text-black/65">
                Our most-booked signature pricing — tap any card for full treatment details.
              </p>
            </div>
          </FadeUp>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {SPECIALS_FEATURED.map((card, idx) => (
              <FadeUp key={card.href + card.title} delayMs={idx * 40}>
                <SpecialOfferCard {...card} />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section id="menu" className="scroll-mt-36 border-b-4 border-black bg-white py-12 md:py-16 !px-0">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <FadeUp>
            <div className="overflow-hidden rounded-3xl border-4 border-black bg-white p-3 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] md:p-4">
              <Image
                src={SIGNATURE_MENU_POSTER.src}
                alt={SIGNATURE_MENU_POSTER.alt}
                width={1200}
                height={1550}
                className="h-auto w-full rounded-2xl"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </FadeUp>
          <FadeUp delayMs={80}>
            <span className="inline-block rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              In-spa menu
            </span>
            <h2 className="mt-4 text-3xl font-black text-black md:text-4xl">Signature Treatment Menu</h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-black/75">
              The same poster you see in our Oswego clinic — Botox $10/unit, lip filler, Morpheus8 Burst, Quantum RF,
              Solaria CO₂, and the InMode Trifecta in one view.
            </p>
            <ul className="mt-6 space-y-3 text-sm font-semibold text-black/80">
              <li>▸ NP on site 7 days a week — consult before every treatment</li>
              <li>▸ Financing through Cherry, CareCredit &amp; Affirm on select packages</li>
              <li>▸ Scan the QR on the poster or book below on Fresha</li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTA href={BOOKING_URL} variant="gradient">
                Book Free Consultation
              </CTA>
              <CTA href="#signature-menu" variant="outline" className="!border-black !text-black hover:!bg-black hover:!text-white">
                Browse by category
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section
        id="signature-menu"
        className="scroll-mt-36 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-12 md:py-16 !px-0"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-center text-3xl font-black text-black md:text-4xl">Browse by treatment</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm font-medium text-black/65">
              Grouped by category so you can compare packages without scrolling a wall of cards.
            </p>
          </FadeUp>

          <div className="mt-12 space-y-14">
            {SIGNATURE_MENU_SECTIONS.map((section, sectionIdx) => (
              <div key={section.id} id={section.id === "trifecta" ? "trifecta" : undefined} className="scroll-mt-36">
                <FadeUp delayMs={sectionIdx * 30}>
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b-2 border-black pb-3">
                    <div>
                      <h3 className="text-2xl font-black text-[#E6007E]">{section.heading}</h3>
                      {section.tagline ? (
                        <p className="mt-1 text-sm font-medium text-black/60">{section.tagline}</p>
                      ) : null}
                    </div>
                  </div>
                </FadeUp>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((item, idx) => (
                    <FadeUp key={item.href + item.title} delayMs={sectionIdx * 30 + idx * 25}>
                      <SpecialOfferCard
                        title={item.title}
                        accentLine={item.price}
                        description={item.details?.join(" · ") ?? "Book a free consultation to confirm candidacy and pricing."}
                        href={item.href}
                        badge={section.id === "trifecta" ? "Trifecta" : undefined}
                      />
                    </FadeUp>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="more-offers" className="scroll-mt-36 border-b-4 border-black bg-white py-12 md:py-16 !px-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-center text-3xl font-black text-black md:text-4xl">More ways to save</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm font-medium text-black/65">
              Memberships, model pricing, laser promos, rewards, and new-client perks.
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MORE_SPECIALS_LINKS.map((item, idx) => (
              <FadeUp key={item.href} delayMs={idx * 30}>
                <SpecialOfferCard
                  title={item.label}
                  accentLine={item.sub}
                  description="View full details, eligibility, and booking options."
                  href={item.href}
                  badge={"badge" in item ? item.badge : undefined}
                />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section className="border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-12 md:py-14 !px-0">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <FadeUp>
            <h2 className="text-2xl font-black text-black md:text-3xl">Not sure which offer fits?</h2>
            <p className="mt-3 text-base font-medium text-black/70">
              Tell us your concern — wrinkles, skin laxity, weight loss, hormones, and more — and we&apos;ll route you to
              the right treatment page.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <CTA href="/help-me-choose" variant="gradient">
                Help Me Choose
              </CTA>
              <CTA href={`tel:${SITE.phone.replace(/\D/g, "")}`} variant="outline" className="!border-black !text-black">
                Call {SITE.phone}
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section className="relative overflow-hidden border-t-4 border-black !px-0 py-14 md:py-16">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        />
        <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-black text-white md:text-3xl">Beautifully you. Confidently gorgeous.</h2>
          <p className="mt-4 font-medium text-white/90">
            {SITE.address.streetAddress}, {SITE.address.addressLocality}, IL · {SITE.phone}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <CTA href={BOOKING_URL} variant="white">
              Book Free Consultation
            </CTA>
            <CTA href={`tel:${SITE.phone.replace(/\D/g, "")}`} variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-[#E6007E]">
              Call {SITE.phone}
            </CTA>
          </div>
        </div>
      </Section>
    </div>
  );
}
