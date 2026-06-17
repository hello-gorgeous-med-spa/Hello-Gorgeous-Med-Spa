"use client";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { ClinicalPhotoCarousel } from "@/components/services/ClinicalPhotoCarousel";
import { ServiceMenuVideos } from "@/components/services/ServiceMenuVideos";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import type { ServiceMenuConfig, ServiceMenuPriceRow, ServiceMenuSection } from "@/lib/service-menu-types";
import { SITE } from "@/lib/seo";

function PricingAccordion({ rows }: { rows: ServiceMenuPriceRow[] }) {
  return (
    <details className="group mt-6 rounded-xl border border-white/10 bg-[#151922]/80 open:border-[#FF2D8E]/30">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-[#7dd3fc] [&::-webkit-details-marker]:hidden">
        <span>Pricing</span>
        <span className="text-[#FFB8DC] transition-transform group-open:rotate-180" aria-hidden>
          ▼
        </span>
      </summary>
      <ul className="border-t border-white/10 px-4 py-3 space-y-3">
        {rows.map((row) => (
          <li key={row.label} className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0 flex-1">
              {row.href ? (
                <Link href={row.href} className="text-sm font-medium text-white hover:text-[#FFB8DC] hover:underline">
                  {row.label}
                </Link>
              ) : (
                <span className="text-sm font-medium text-white">{row.label}</span>
              )}
              {row.note ? <p className="text-xs text-gray-500 mt-0.5">{row.note}</p> : null}
            </div>
            <span className="shrink-0 text-sm font-black tabular-nums text-[#FFB8DC]">{row.price}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

function MenuSectionRow({ section, index }: { section: ServiceMenuSection; index: number }) {
  return (
    <FadeUp delayMs={index * 40}>
      <article className="border-b border-white/10 py-10 md:py-14 last:border-b-0">
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
            <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed text-gray-400">{section.description}</p>
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
            <PricingAccordion rows={section.pricing} />
            <Link
              href={section.learnMoreHref}
              className="mt-5 inline-block text-sm font-bold text-[#FF2D8E] hover:underline"
            >
              Full treatment details →
            </Link>
          </div>
        </div>
      </article>
    </FadeUp>
  );
}

export function ServiceMenuPageLayout({ config }: { config: ServiceMenuConfig }) {
  const { hero, sections, faqs, gallery, heroVideo, videos } = config;
  const allVideos = [...(heroVideo ? [heroVideo] : []), ...(videos ?? [])];

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
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">{hero.eyebrow}</p>
            <h1 className="mt-4 text-4xl md:text-6xl font-black leading-tight">
              {hero.titleBefore ? `${hero.titleBefore} ` : null}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                {hero.titleAccent}
              </span>
              {hero.titleAfter ? ` ${hero.titleAfter}` : null}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75 leading-relaxed">{hero.subtitle}</p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
              <CTA href={hero.primaryCta?.href ?? BOOKING_URL} variant="gradient" className="!px-8 !py-4">
                {hero.primaryCta?.label ?? "Book consultation"}
              </CTA>
              {hero.secondaryCta ? (
                <CTA
                  href={hero.secondaryCta.href}
                  variant="outline"
                  className="!border-[#FF2D8E] !text-[#FFB8DC] hover:!bg-[#FF2D8E] hover:!text-white !px-8 !py-4"
                >
                  {hero.secondaryCta.label}
                </CTA>
              ) : null}
            </div>
          </FadeUp>
        </div>
      </Section>

      {allVideos.length > 0 ? (
        <Section className="border-b-4 border-black !px-0 py-8 md:py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <ServiceMenuVideos videos={allVideos} />
            </FadeUp>
          </div>
        </Section>
      ) : gallery && gallery.length > 0 ? (
        <Section className="border-b-4 border-black !px-0 py-10 md:py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <ClinicalPhotoCarousel slides={gallery} />
            </FadeUp>
          </div>
        </Section>
      ) : null}

      <Section className="!px-0 py-4 md:py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {sections.map((section, i) => (
            <MenuSectionRow key={section.id} section={section} index={i} />
          ))}
        </div>
      </Section>

      {faqs.length > 0 ? (
        <Section className="border-t-4 border-black bg-[#0a0a0a] py-12 md:py-16 !px-0">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <FadeUp>
              <h2 className="text-center font-serif text-2xl md:text-3xl text-white">Common questions</h2>
            </FadeUp>
            <div className="mt-8 space-y-3">
              {faqs.map((faq, i) => (
                <FadeUp key={faq.question} delayMs={i * 30}>
                  <details className="rounded-xl border border-white/10 bg-[#151922] open:border-[#FF2D8E]/30">
                    <summary className="cursor-pointer list-none px-5 py-4 text-sm font-bold text-[#FFB8DC] [&::-webkit-details-marker]:hidden">
                      {faq.question}
                    </summary>
                    <p className="border-t border-white/10 px-5 py-4 text-sm leading-relaxed text-gray-400">{faq.answer}</p>
                  </details>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] border-t-4 border-black py-14 md:py-16 !px-0">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white">Ready to get started?</h2>
          <p className="mt-3 text-white/90 font-medium">
            {SITE.address.streetAddress}, {SITE.address.addressLocality}, IL · {SITE.phone}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <CTA href={BOOKING_URL} variant="white">
              Book on Fresha
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
