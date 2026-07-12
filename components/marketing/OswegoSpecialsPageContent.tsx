"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  JourneyGhostBtn,
  JourneyPinkBtn,
  JourneySectionHead,
  JourneyTrustBar,
} from "@/components/marketing/JourneyPageUi";
import {
  HYDRAFACIAL_IMAGES,
  HYDRAFACIAL_MARISSA_SPECIAL,
  HYDRAFACIAL_PATH,
} from "@/lib/hydrafacial-marketing";
import {
  IPL_79_SPECIAL,
  LASER_59_AREAS,
  LASER_59_SPECIAL,
  LASH_FULL_SET_SPECIAL,
  OSWEGO_SPECIALS_BOOK_HREF,
  OSWEGO_SPECIALS_FAQS,
  OSWEGO_SPECIALS_NAV,
  OSWEGO_SPECIALS_PATH,
  OSWEGO_SPECIALS_VALID_THROUGH,
} from "@/lib/oswego-specials";

export function OswegoSpecialsPageContent() {
  const [navOpen, setNavOpen] = useState(false);
  const hydra = HYDRAFACIAL_MARISSA_SPECIAL;
  const lashes = LASH_FULL_SET_SPECIAL;
  const laser = LASER_59_SPECIAL;
  const ipl = IPL_79_SPECIAL;

  return (
    <div className="min-h-[100dvh] bg-black font-sans text-white">
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/82 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5 font-bold">
            <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-[13px] font-extrabold text-white">
              HG
            </span>
            <span className="hidden text-base sm:inline">Hello Gorgeous · Oswego</span>
          </Link>
          <button
            type="button"
            className="rounded-lg border border-white/20 px-3 py-1.5 text-sm font-bold lg:hidden"
            onClick={() => setNavOpen((o) => !o)}
            aria-expanded={navOpen}
            aria-label="Toggle menu"
          >
            Menu
          </button>
          <div className="hidden items-center gap-6 text-[14px] lg:flex">
            {OSWEGO_SPECIALS_NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-white/75 transition hover:text-white">
                {item.label}
              </a>
            ))}
            <JourneyPinkBtn href={OSWEGO_SPECIALS_BOOK_HREF} className="!px-5 !py-2.5 !text-sm">
              Book specials
            </JourneyPinkBtn>
          </div>
        </div>
        {navOpen ? (
          <div className="border-t border-white/10 px-6 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {OSWEGO_SPECIALS_NAV.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setNavOpen(false)}>
                  {item.label}
                </a>
              ))}
              <JourneyPinkBtn href={OSWEGO_SPECIALS_BOOK_HREF}>Book specials</JourneyPinkBtn>
            </div>
          </div>
        ) : null}
      </nav>

      <header className="relative overflow-hidden bg-[radial-gradient(120%_80%_at_50%_-10%,#2a0820_0%,#0a0206_45%,#000_100%)]">
        <div
          className="pointer-events-none absolute -right-28 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,45,142,0.28),transparent_62%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1200px] px-6 py-16 text-center lg:py-24">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.3em] text-[#FF2D8E]">
            Hello Gorgeous Med Spa · Oswego, IL
          </p>
          <h1 className="mt-4 font-serif text-[40px] font-bold leading-[1.05] text-white lg:text-[56px]">
            Oswego specials to{" "}
            <span className="text-[#FF2D8E]">get you glowing</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
            Marissa’s HydraFacial $129 · full-set lashes $89 · laser hair $59 on listed areas · Zemits
            DuoCratis IPL $79. Prices locked through {OSWEGO_SPECIALS_VALID_THROUGH}.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <JourneyPinkBtn href={OSWEGO_SPECIALS_BOOK_HREF}>Book at Hello Gorgeous</JourneyPinkBtn>
            <JourneyGhostBtn href="tel:6306366193">Call (630) 636-6193</JourneyGhostBtn>
          </div>
          <p className="mt-6 text-sm text-white/55">74 W Washington St · Oswego · Naperville · Aurora · Fox Valley</p>
        </div>
      </header>
      <JourneyTrustBar />

      {/* Offer cards strip */}
      <section className="border-b border-white/10 px-6 py-10">
        <div className="mx-auto grid max-w-[1200px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "#hydrafacial", price: "$129", label: "HydraFacial + Dermaplaning", sub: "Marissa" },
            { href: "#lashes", price: "$89", label: "Full-set lashes", sub: "Marissa" },
            { href: "#laser", price: "$59", label: "Laser hair (listed areas)", sub: "Thru 2026" },
            { href: "#ipl", price: "$79", label: "IPL photofacial", sub: "Zemits DuoCratus" },
          ].map((c) => (
            <a
              key={c.href}
              href={c.href}
              className="rounded-[20px] border border-white/14 bg-[#0a0206] p-5 transition hover:border-[#FF2D8E]/50"
            >
              <p className="font-serif text-3xl font-bold text-[#FF2D8E]">{c.price}</p>
              <p className="mt-1 font-bold text-white">{c.label}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/50">{c.sub}</p>
            </a>
          ))}
        </div>
      </section>

      {/* HydraFacial */}
      <section id="hydrafacial" className="scroll-mt-24 px-6 py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[#FF2D8E]/35 sm:aspect-square">
            <Image
              src={HYDRAFACIAL_IMAGES.treatment}
              alt="HydraFacial $129 special with Marissa at Hello Gorgeous Med Spa Oswego"
              fill
              className="object-cover"
              sizes="560px"
            />
          </div>
          <div>
            <JourneySectionHead
              eyebrow={hydra.badge}
              title="HydraFacial +"
              titleAccent="dermaplaning"
              description={`${hydra.price} — ${hydra.includes.join(" · ")}`}
            />
            <p className="mt-4 text-sm text-white/60">{hydra.note}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <JourneyPinkBtn href={hydra.bookHref}>Book {hydra.price}</JourneyPinkBtn>
              <JourneyGhostBtn href={HYDRAFACIAL_PATH}>Full HydraFacial page</JourneyGhostBtn>
            </div>
          </div>
        </div>
      </section>

      {/* Lashes */}
      <section
        id="lashes"
        className="scroll-mt-24 border-y border-white/10 bg-[radial-gradient(ellipse_at_top,#1a0a12,transparent_55%)] px-6 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-[900px]">
          <JourneySectionHead
            eyebrow={lashes.badge}
            title="Full-set eyelash"
            titleAccent="extensions $89"
            description="Get Marissa busy — classic or hybrid full set, customized mapping, soft glam. Valid through end of year."
            center
          />
          <div className="mt-10 rounded-[20px] border-2 border-[#FF2D8E] bg-[#0a0206] p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <ul className="space-y-2.5 text-[15px] text-white/85">
                {lashes.includes.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="font-black text-[#FF2D8E]">✓</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="text-right">
                <p className="font-serif text-5xl font-bold text-[#FF2D8E]">{lashes.price}</p>
                <p className="text-sm text-white/55">{lashes.priceNote}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/60">{lashes.note}</p>
            <div className="mt-6">
              <JourneyPinkBtn href={lashes.bookHref}>Book lashes {lashes.price}</JourneyPinkBtn>
            </div>
          </div>
        </div>
      </section>

      {/* Laser $59 */}
      <section id="laser" className="scroll-mt-24 px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow={laser.badge}
            title="Laser hair"
            titleAccent={`${laser.price} / area`}
            description={`${laser.device}. Price locked through ${OSWEGO_SPECIALS_VALID_THROUGH} on every area below.`}
            center
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LASER_59_AREAS.map((area) => (
              <div
                key={area.id}
                className="flex items-center justify-between rounded-[20px] border border-white/14 bg-[#0a0206] px-5 py-4"
              >
                <span className="font-bold text-white">{area.label}</span>
                <span className="font-serif text-2xl font-bold text-[#FF2D8E]">{laser.price}</span>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-white/60">{laser.note}</p>
          <div className="mt-8 flex justify-center">
            <JourneyPinkBtn href={laser.bookHref}>Book laser {laser.price}</JourneyPinkBtn>
          </div>
        </div>
      </section>

      {/* IPL $79 */}
      <section
        id="ipl"
        className="scroll-mt-24 border-t border-white/10 bg-[radial-gradient(ellipse_at_bottom,#1a0a12,transparent_55%)] px-6 py-16 lg:py-20"
      >
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <JourneySectionHead
              eyebrow={ipl.badge}
              title="IPL photofacial"
              titleAccent={ipl.price}
              description={`${ipl.device}. ${ipl.guideNote}`}
            />
            <ul className="mt-6 space-y-2.5">
              {ipl.includes.map((line) => (
                <li key={line} className="flex gap-3 text-[15px] text-white/85">
                  <span className="font-black text-[#FF2D8E]">✓</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {ipl.treats.map((t) => (
                <article key={t.concern} className="rounded-[16px] border border-white/14 bg-[#0a0206] p-4">
                  <h3 className="font-bold text-[#FF2D8E]">{t.concern}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/55">{t.filterHint}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-sm text-white/60">{ipl.note}</p>
            <div className="mt-8">
              <JourneyPinkBtn href={ipl.bookHref}>Book IPL {ipl.price}</JourneyPinkBtn>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[#FF2D8E]/35 sm:aspect-square">
            <Image
              src={ipl.image}
              alt="Zemits DuoCratis IPL photofacial $79 at Hello Gorgeous Med Spa Oswego"
              fill
              className="object-cover"
              sizes="560px"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-[900px]">
          <JourneySectionHead eyebrow="FAQ" title="Oswego" titleAccent="specials" center />
          <div className="mt-10 space-y-3">
            {OSWEGO_SPECIALS_FAQS.map((faq, idx) => (
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

      <section className="border-t-4 border-black bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] px-6 py-16 text-center">
        <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
          Book Hello Gorgeous Med Spa — Oswego
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/90">
          Keep Marissa’s chair full — lashes & HydraFacial — plus year-end laser $59 and IPL $79.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <JourneyPinkBtn
            href={OSWEGO_SPECIALS_BOOK_HREF}
            className="!bg-white !text-black hover:!bg-black hover:!text-white"
          >
            Book specials now
          </JourneyPinkBtn>
          <a
            href="tel:6306366193"
            className="inline-flex rounded-full border-2 border-white px-7 py-3.5 text-base font-bold text-white"
          >
            (630) 636-6193
          </a>
        </div>
        <p className="mt-6 text-sm text-white/80">
          Canonical offers:{" "}
          <Link href={OSWEGO_SPECIALS_PATH} className="underline">
            hellogorgeousmedspa.com{OSWEGO_SPECIALS_PATH}
          </Link>
        </p>
      </section>
    </div>
  );
}
