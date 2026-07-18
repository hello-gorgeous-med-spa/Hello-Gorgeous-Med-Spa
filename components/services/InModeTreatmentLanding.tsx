"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { FadeUp, Section } from "@/components/Section";
import { ServiceMenuClinicMedia } from "@/components/services/ServiceMenuClinicMedia";
import type { InModeTreatmentLandingContent } from "@/lib/inmode-treatment-landing";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { REGEN_SHOP_PAGE_WASH } from "@/lib/regen/shop-surface";
import type {
  ServiceMenuGallerySlide,
  ServiceMenuResultSlide,
  ServiceMenuVideo,
} from "@/lib/service-menu-types";
import { SITE } from "@/lib/seo";

type Props = {
  content: InModeTreatmentLandingContent;
  videos?: ServiceMenuVideo[];
  gallery?: ServiceMenuGallerySlide[];
  results?: ServiceMenuResultSlide[];
};

function BookBtn({ className = "" }: { className?: string }) {
  return (
    <Link
      href={PRIMARY_BOOKING_CTA.href}
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-7 py-3.5 text-sm font-black text-white shadow-[0_0_24px_rgba(255,45,142,0.35)] transition hover:brightness-110 ${className}`}
    >
      {PRIMARY_BOOKING_CTA.label}
    </Link>
  );
}

function SectionTitle({
  eyebrow,
  title,
  light = true,
}: {
  eyebrow?: string;
  title: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p
          className={`text-xs font-bold uppercase tracking-[0.2em] ${
            light ? "text-[#E6007E]" : "text-[#FFB8DC]"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`mt-2 font-serif text-3xl font-black tracking-tight md:text-4xl ${
          light ? "text-black" : "text-white"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

export function InModeTreatmentLanding({
  content,
  videos = [],
  gallery = [],
  results = [],
}: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const manufacturerImages = content.manufacturerOverview
    ? [
        {
          src: content.manufacturerOverview.imageSrc,
          alt: content.manufacturerOverview.imageAlt,
        },
        ...(content.manufacturerOverview.additionalImages ?? []),
      ]
    : [];

  const hasMedia = videos.length > 0 || gallery.length > 0 || results.length > 0;

  return (
    <div className="relative min-h-screen font-sans text-black" style={{ background: REGEN_SHOP_PAGE_WASH }}>
      {/* Dark cinematic hero — RE GEN mix */}
      <header className="relative isolate overflow-hidden border-b-4 border-black">
        <Image
          src={content.heroImage}
          alt={content.heroImageAlt}
          fill
          priority
          className={`object-cover ${content.heroObjectPosition ?? "object-[center_30%]"}`}
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background: content.heroPortraitFocus
              ? "linear-gradient(180deg, rgba(10,6,16,0.28) 0%, rgba(10,6,16,0.42) 45%, rgba(10,6,16,0.68) 100%), radial-gradient(ellipse 60% 50% at 70% 20%, rgba(230,0,126,0.18), transparent 55%)"
              : "linear-gradient(115deg, rgba(10,6,16,0.78) 0%, rgba(20,8,18,0.55) 42%, rgba(10,6,16,0.35) 100%), radial-gradient(ellipse 55% 45% at 75% 25%, rgba(230,0,126,0.28), transparent 60%)",
          }}
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center md:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FFB8DC]">
            {content.locality}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-black tracking-tight text-white md:text-6xl">
            {content.productName}
            {content.productAccent ? (
              <>
                {" "}
                <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                  {content.productAccent}
                </span>
              </>
            ) : null}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {content.heroSubhead}
          </p>
          <div className="mt-6 rounded-2xl border border-white/20 bg-black/35 px-6 py-4 backdrop-blur">
            <p className="font-serif text-2xl font-black text-white md:text-3xl">{content.priceLine}</p>
            {content.priceNote ? (
              <p className="mt-1 text-sm font-semibold text-[#FFB8DC]">{content.priceNote}</p>
            ) : null}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <BookBtn />
            <a
              href="#what-is"
              className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-3.5 text-sm font-bold text-white transition hover:border-[#FF2D8E] hover:bg-white/5"
            >
              Learn more ↓
            </a>
          </div>
          {content.trustItems && content.trustItems.length > 0 ? (
            <ul className="mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-2">
              {content.trustItems.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white/90 backdrop-blur"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>

      {/* What is */}
      <Section id="what-is" className="scroll-mt-24 !bg-transparent py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <FadeUp>
            <SectionTitle title={content.whatTitle} />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-black/75 md:text-lg">
              {content.whatBody.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
            {content.treatsIntro ? (
              <p className="mt-8 text-sm font-bold text-black">{content.treatsIntro}</p>
            ) : null}
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {content.treats.map((item) => (
                <li key={item} className="flex gap-2 text-sm font-medium text-black/80 md:text-base">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E6007E]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <BookBtn />
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Pricing band */}
      <section className="border-y border-black/10 bg-white/70 py-10">
        <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">Pricing</p>
            <p className="mt-1 font-serif text-3xl font-black text-black">{content.priceLine}</p>
            {content.priceNote ? (
              <p className="mt-1 text-sm font-semibold text-black/65">{content.priceNote}</p>
            ) : null}
          </div>
          <BookBtn />
        </div>
      </section>

      {/* Areas we treat */}
      {content.areaCards && content.areaCards.length > 0 ? (
        <Section id="areas" className="scroll-mt-24 !bg-transparent py-14 md:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <FadeUp>
              <SectionTitle
                eyebrow="Treatment areas"
                title={content.areaCardsTitle ?? "Areas we treat"}
              />
              {content.areaCardsIntro ? (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/65 md:text-base">
                  {content.areaCardsIntro}
                </p>
              ) : null}
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {content.areaCards.map((area) => {
                  const inner = (
                    <>
                      <h3 className="font-serif text-lg font-black text-black group-hover:text-[#E6007E]">
                        {area.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-black/65">{area.blurb}</p>
                    </>
                  );
                  const cardClass =
                    "group rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.18)] transition hover:-translate-y-0.5";
                  return area.href ? (
                    <Link key={area.title} href={area.href} className={cardClass}>
                      {inner}
                      <p className="mt-3 text-xs font-bold text-[#E6007E]">Learn more →</p>
                    </Link>
                  ) : (
                    <div key={area.title} className={cardClass}>
                      {inner}
                    </div>
                  );
                })}
              </div>
            </FadeUp>
          </div>
        </Section>
      ) : null}

      {/* Manufacturer */}
      {content.manufacturerOverview && manufacturerImages.length > 0 ? (
        <Section id="technology" className="scroll-mt-24 !bg-transparent py-14 md:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <FadeUp>
              <SectionTitle
                eyebrow="InMode manufacturer"
                title={content.manufacturerOverview.title}
              />
              {content.manufacturerOverview.description ? (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/65 md:text-base">
                  {content.manufacturerOverview.description}
                </p>
              ) : null}
              <div className="mt-8 flex flex-col gap-6">
                {manufacturerImages.map((img) => (
                  <figure
                    key={img.src}
                    className="overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={1024}
                      height={780}
                      className="h-auto w-full object-contain"
                      sizes="(max-width: 768px) 100vw, 896px"
                      loading="lazy"
                    />
                    <figcaption className="border-t border-black/10 px-4 py-2 text-center text-xs text-black/50">
                      Manufacturer education graphic. Individual results vary. Candidacy confirmed in
                      consultation.
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-5 text-sm text-black/70">
                <a
                  href={content.manufacturerOverview.learnMoreHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#E6007E] underline underline-offset-2"
                >
                  {content.manufacturerOverview.learnMoreLabel ?? "Learn more on InMode.com"}
                </a>
                <span> — official manufacturer page</span>
              </p>
            </FadeUp>
          </div>
        </Section>
      ) : null}

      {/* Dark media band */}
      {hasMedia ? (
        <section className="border-y-4 border-black bg-[#0a0a0a] py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <ServiceMenuClinicMedia
              videos={videos}
              gallery={gallery}
              results={results}
              title="See it in our Oswego clinic"
              subtitle="Procedure video, clinic photography, and real client results."
            />
          </div>
        </section>
      ) : null}

      {/* How it works */}
      <Section id="how-it-works" className="scroll-mt-24 !bg-transparent py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <FadeUp>
            <SectionTitle title={content.howTitle} />
            <p className="mt-5 text-base leading-relaxed text-black/75 md:text-lg">{content.howBody}</p>
            <ul className="mt-6 space-y-2">
              {content.howBullets.map((b) => (
                <li key={b} className="flex gap-2 text-sm font-medium text-black/80 md:text-base">
                  <span className="font-black text-[#E6007E]">▸</span>
                  {b}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </Section>

      {/* Before / During / After */}
      <section className="border-y border-black/10 bg-white/80 py-14 md:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionTitle eyebrow="Your visit" title="Before, during & after" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { title: "Before treatment", body: content.before },
              { title: "During treatment", body: content.during },
              { title: "After treatment", body: content.after },
            ].map((step) => (
              <div key={step.title} className="rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
                <h3 className="font-serif text-xl font-black text-[#E6007E]">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-black/70">{step.body}</p>
              </div>
            ))}
          </div>
          {content.careGuideHref ? (
            <p className="mt-8 text-sm">
              <Link
                href={content.careGuideHref}
                className="font-semibold text-[#E6007E] underline underline-offset-2"
              >
                Full pre & post care guide →
              </Link>
            </p>
          ) : null}
        </div>
      </section>

      {/* FAQ */}
      <Section id="faq" className="scroll-mt-24 !bg-transparent py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionTitle title="Frequently asked questions" />
          <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
            {content.faqs.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div key={faq.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-semibold text-black">{faq.q}</span>
                    <span className="text-xl font-light text-[#E6007E]">{open ? "–" : "+"}</span>
                  </button>
                  {open ? (
                    <p className="pb-4 text-sm leading-relaxed text-black/70">{faq.a}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Consult CTA */}
      <section className="relative overflow-hidden border-y-4 border-black py-16 text-white">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-3xl font-black md:text-4xl">{content.consultTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85">
            {content.consultBody}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={PRIMARY_BOOKING_CTA.href}
              className="inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-black text-[#E6007E] transition hover:bg-neutral-100"
            >
              {PRIMARY_BOOKING_CTA.label}
            </Link>
            <a
              href="tel:+16306366193"
              className="inline-flex rounded-full border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Call {SITE.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionTitle eyebrow="Also explore" title="Related InMode treatments" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {content.related.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)] transition hover:-translate-y-0.5"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">
                  {item.eyebrow}
                </p>
                <h3 className="mt-1 font-serif text-xl font-black text-black group-hover:text-[#E6007E]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-black/65">{item.blurb}</p>
                <p className="mt-3 text-sm font-bold text-[#E6007E]">View more →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
