import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { HeroV3 } from "@/components/homepage-v3/HeroV3";
import { FadeUp } from "@/components/Section";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { REVIEW_TRUST_HEADLINE, reviewTrustBody } from "@/lib/review-trust-copy";
import { HOME_TESTIMONIALS, SITE } from "@/lib/seo";
import {
  ATELIER,
  ATELIER_ABOUT,
  ATELIER_DANI_ALT,
  ATELIER_DANI_IMAGE,
  ATELIER_DEVICES,
  ATELIER_DOORS,
  ATELIER_GALLERY,
  ATELIER_JUMP,
  ATELIER_SERVICES,
  ATELIER_SLOGAN,
} from "@/lib/homepage-atelier";

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: ATELIER.pink }}>
      {children}
    </p>
  );
}

function OutlineTitle({ children, accent }: { children: ReactNode; accent?: string }) {
  return (
    <h2 className="mt-3 font-black tracking-tight text-black text-4xl sm:text-5xl">
      {children}
      {accent ? (
        <>
          {" "}
          <span style={{ color: ATELIER.pink }}>{accent}</span>
        </>
      ) : null}
    </h2>
  );
}

export function HomepageAtelier({
  googleRating,
  googleCount,
  liveReviews,
}: {
  googleRating?: string;
  googleCount?: string;
  liveReviews?: ReactNode;
} = {}) {
  return (
    <div className="bg-[#fdf8f4] text-black">
      <HeroV3 />

      <nav
        aria-label="On this page"
        className="sticky top-16 z-30 border-b border-black/5 bg-[#fdf8f4]/90 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-7 gap-y-2 px-6 py-3">
          {ATELIER_JUMP.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[12px] font-bold uppercase tracking-[0.18em] text-black/70 transition hover:text-[#ff00a1]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <FadeUp>
          <Eyebrow>Oswego, IL · by consult</Eyebrow>
          <p className="mt-5 max-w-3xl font-black leading-[1.05] tracking-tight text-4xl sm:text-6xl">
            {ATELIER_SLOGAN}
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-black/65 sm:text-lg">
            Safety-first menu. Licensed Illinois clinicians. Downtown Oswego — not a facial factory.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={PRIMARY_BOOKING_CTA.href}
              className="inline-flex items-center rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white"
              style={{ backgroundColor: ATELIER.pink }}
            >
              Book consult
            </Link>
            <Link
              href="#devices"
              className="inline-flex items-center rounded-full border-2 border-black px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em]"
            >
              View devices
            </Link>
          </div>
        </FadeUp>
      </section>

      <section id="services" className="scroll-mt-28 border-t border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <FadeUp>
            <Eyebrow>The menu</Eyebrow>
            <OutlineTitle accent="care.">Medical spa</OutlineTitle>
            <p className="mt-4 max-w-xl text-black/60">
              Built on screening, not trends. Every plan starts with a consult.
            </p>
          </FadeUp>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {ATELIER_SERVICES.map((item, i) => (
              <FadeUp key={item.id} delayMs={40 * i}>
                <Link href={item.href} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f3eee8]">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                      <p className="mt-1 text-sm text-black/55">{item.note}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: ATELIER.pink }}>
                      View →
                    </span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
          <p className="mt-10">
            <Link href="/services" className="text-sm font-bold uppercase tracking-[0.16em] underline underline-offset-4">
              Full services lookbook →
            </Link>
          </p>
        </div>
      </section>

      <section id="devices" className="scroll-mt-28 border-t border-black/5">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <FadeUp>
            <Eyebrow>InMode · in clinic</Eyebrow>
            <OutlineTitle accent="devices.">Advanced</OutlineTitle>
            <p className="mt-4 max-w-xl text-black/60">
              Solaria CO₂, Morpheus8 Burst, Quantum RF, Lumecca. Screening required. Results vary.
            </p>
          </FadeUp>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {ATELIER_DEVICES.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group flex flex-col justify-between border border-black/10 bg-white p-7 transition hover:border-[#ff00a1]"
              >
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">{item.eyebrow}</p>
                  <h3 className="mt-3 text-3xl font-black tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm text-black/55">{item.note}</p>
                </div>
                <span className="mt-8 text-sm font-bold" style={{ color: ATELIER.pink }}>
                  Learn →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-28 border-t border-black/5 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <FadeUp>
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden bg-[#f3eee8]">
              <Image
                src={ATELIER_DANI_IMAGE}
                alt={ATELIER_DANI_ALT}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 480px"
                priority
              />
            </div>
          </FadeUp>
          <FadeUp delayMs={80}>
            <Eyebrow>The owner</Eyebrow>
            <OutlineTitle>{ATELIER_ABOUT.name}</OutlineTitle>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em]" style={{ color: ATELIER.pink }}>
              {ATELIER_ABOUT.role}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-black/80">{ATELIER_ABOUT.lede}</p>
            <p className="mt-4 text-base leading-relaxed text-black/60">{ATELIER_ABOUT.body}</p>
            <Link
              href={ATELIER_ABOUT.href}
              className="mt-8 inline-flex text-sm font-bold uppercase tracking-[0.16em] underline underline-offset-4"
            >
              Meet Danielle →
            </Link>
          </FadeUp>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-28 border-t border-black/5">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <FadeUp>
            <Eyebrow>The studio</Eyebrow>
            <OutlineTitle accent="gallery.">Inside</OutlineTitle>
          </FadeUp>
          <div className="mt-12 grid grid-cols-2 gap-3 md:gap-4">
            {ATELIER_GALLERY.map((photo) => (
              <div key={photo.src} className="relative aspect-square overflow-hidden bg-[#f3eee8]">
                <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="50vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="scroll-mt-28 border-t border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <FadeUp>
            <Eyebrow>Client love</Eyebrow>
            <OutlineTitle>Screened like a practice.</OutlineTitle>
            <p className="mt-2 text-2xl font-black tracking-tight" style={{ color: ATELIER.pink }}>
              Treated like family.
            </p>
            {liveReviews ? <div className="mt-8">{liveReviews}</div> : null}
            <p className="mt-4 max-w-2xl text-black/60">{reviewTrustBody({ googleRating, googleCount })}</p>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em]" style={{ color: ATELIER.pink }}>
              {REVIEW_TRUST_HEADLINE}
            </p>
          </FadeUp>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {HOME_TESTIMONIALS.slice(0, 4).map((t) => (
              <figure key={t.name + t.service} className="border border-black/10 bg-[#fdf8f4] p-7">
                <blockquote className="text-base leading-relaxed text-black/80">“{t.text}”</blockquote>
                <figcaption className="mt-5 text-sm">
                  <cite className="not-italic font-bold">{t.name}</cite>
                  <span className="block text-black/50">{t.location}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-8">
            <Link href="/reviews" className="text-sm font-bold uppercase tracking-[0.16em] underline underline-offset-4">
              More reviews →
            </Link>
          </p>
        </div>
      </section>

      <section className="border-t border-black/5">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-14 sm:grid-cols-2">
          {ATELIER_DOORS.map((door) => (
            <Link
              key={door.href}
              href={door.href}
              className="border border-black/10 bg-white p-8 transition hover:border-[#ff00a1]"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">{door.detail}</p>
              <p className="mt-2 text-3xl font-black tracking-tight">{door.label}</p>
              <span className="mt-6 inline-block text-sm font-bold" style={{ color: ATELIER.pink }}>
                Enter →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="book"
        className="px-6 py-20 text-center text-white"
        style={{ backgroundColor: ATELIER.pink }}
      >
        <h2 className="font-black tracking-tight text-4xl sm:text-5xl">Ready when you are.</h2>
        <p className="mx-auto mt-4 max-w-md text-white/90">
          Free consult · downtown Oswego ·{" "}
          <a href={`tel:${SITE.phone}`} className="font-semibold underline">
            (630) 636-6193
          </a>
        </p>
        <Link
          href={PRIMARY_BOOKING_CTA.href}
          className="mt-8 inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-black"
        >
          {PRIMARY_BOOKING_CTA.label}
        </Link>
      </section>
    </div>
  );
}
