"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  FACIALS_FAQS,
  FACIALS_MARISSA_SPECIAL,
  FACIALS_PEELS_MARKETING,
  FACIALS_TREATMENTS,
  FACIALS_TRIFECTA,
} from "@/lib/facials-peels-marketing";
import { SITE } from "@/lib/seo";

function PinkPillLink({
  href,
  children,
  className = "",
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#FF3D9A] to-[#E6007E] px-7 py-3.5 text-base font-bold text-white shadow-[0_12px_30px_rgba(255,45,142,0.4)] transition hover:-translate-y-0.5 ${className}`;
  if (external || href.startsWith("http") || href.startsWith("tel:")) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={cls}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function FacialsPeelsPageContent() {
  const { images, bookHref, squareBookHref, phoneHref, phoneDisplay } = FACIALS_PEELS_MARKETING;
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-white text-[#111] antialiased">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1240px] px-6 pt-5">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-black/55" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#E6007E]">
            Home
          </Link>
          <span aria-hidden>›</span>
          <Link href="/services" className="hover:text-[#E6007E]">
            Services
          </Link>
          <span aria-hidden>›</span>
          <span className="font-semibold text-[#FF2D8E]">Facials &amp; Peels</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-[1240px] px-6 pb-2 pt-3" id="top">
        <div className="grid items-stretch gap-7 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative min-h-[420px] overflow-hidden rounded-[26px] bg-[#e9e4e0] lg:min-h-[540px]">
            <Image
              src={images.hero}
              alt="Medical-grade skin care at Hello Gorgeous Med Spa"
              fill
              priority
              className="object-cover object-[center_25%]"
              sizes="(max-width: 1024px) 100vw, 640px"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,.28) 48%, rgba(0,0,0,.03) 80%)",
              }}
              aria-hidden
            />
            <div className="absolute bottom-0 left-0 max-w-[82%] p-8 md:p-11">
              <span className="mb-5 inline-block rounded-full bg-[#FF2D8E]/85 px-3.5 py-1.5 text-xs font-bold tracking-[0.24em] text-white">
                MEDICAL-GRADE SKIN CARE
              </span>
              <h1 className="font-serif text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[58px]">
                Facials &amp; Peels
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
                Not your spa-day facial — clinical-strength HydraFacials, dermaplaning, chemical peels, VI Peel, and
                IPL photofacials. Zero fluff, real results.
              </p>
              <div className="mt-6">
                <PinkPillLink href={bookHref}>Book a free consult ›</PinkPillLink>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 rounded-[26px] border border-black/12 p-8 shadow-[0_8px_34px_rgba(0,0,0,0.06)] sm:p-9">
            <div className="flex items-center gap-2.5">
              <span
                className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-[#FF2D8E]"
                aria-hidden
              />
              <span className="text-xs font-bold tracking-[0.22em] text-[#FF2D8E]">
                {FACIALS_MARISSA_SPECIAL.eyebrow}
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold leading-tight sm:text-[30px]">
              {FACIALS_MARISSA_SPECIAL.title}
            </h2>
            <div className="flex items-baseline gap-2.5">
              <span className="font-serif text-5xl font-extrabold text-[#FF2D8E]">
                {FACIALS_MARISSA_SPECIAL.price}
              </span>
              <span className="text-base font-semibold text-black/55">{FACIALS_MARISSA_SPECIAL.priceNote}</span>
            </div>
            <p className="text-[15px] leading-relaxed text-black/60">{FACIALS_MARISSA_SPECIAL.body}</p>
            <PinkPillLink href={FACIALS_MARISSA_SPECIAL.href} className="mt-1 w-full !py-3.5">
              {FACIALS_MARISSA_SPECIAL.ctaLabel}
            </PinkPillLink>
            <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-black/8 pt-4 text-[13px] text-black/55">
              {FACIALS_MARISSA_SPECIAL.proof.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trifecta */}
      <section className="mx-auto mt-16 max-w-[1180px] px-6 lg:mt-[74px]" id="special" aria-labelledby="trifecta-heading">
        <div className="grid items-center gap-10 rounded-[26px] border-2 border-[#FF2D8E] bg-gradient-to-b from-[#FFF5F9] to-white p-8 shadow-[0_16px_46px_rgba(255,45,142,0.16)] lg:grid-cols-[1.15fr_1fr] lg:gap-11 lg:p-[42px]">
          <div>
            <span className="mb-4 inline-block rounded-full bg-[#FF2D8E] px-3.5 py-1.5 text-[11px] font-bold tracking-[0.2em] text-white">
              {FACIALS_TRIFECTA.badge}
            </span>
            <h2 id="trifecta-heading" className="font-serif text-4xl font-extrabold leading-none tracking-tight lg:text-[44px]">
              {FACIALS_TRIFECTA.title}{" "}
              <span className="italic text-[#FF2D8E]">{FACIALS_TRIFECTA.titleAccent}</span>
            </h2>
            <div className="mt-2 flex items-baseline gap-2.5">
              <span className="font-serif text-5xl font-extrabold text-[#FF2D8E]">{FACIALS_TRIFECTA.price}</span>
              <span className="text-base font-semibold text-black/55">{FACIALS_TRIFECTA.priceNote}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {FACIALS_TRIFECTA.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border-[1.5px] border-[#FF2D8E]/40 px-4 py-2 text-sm font-semibold text-[#111]"
                >
                  {chip}
                </span>
              ))}
            </div>
            <p className="mt-5 text-base leading-relaxed text-black/65">{FACIALS_TRIFECTA.description}</p>
            <div className="mt-6">
              <PinkPillLink href={squareBookHref} external>
                {FACIALS_TRIFECTA.ctaLabel}
              </PinkPillLink>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            <p className="text-xs font-bold tracking-[0.16em] text-[#FF2D8E]">ELEVATE IT — ADD ON</p>
            {FACIALS_TRIFECTA.addOns.map((addon) => (
              <div
                key={addon.name}
                className="flex items-center gap-4 rounded-[18px] border border-black/12 bg-white px-5 py-5"
              >
                <div className="relative h-[62px] w-[62px] shrink-0 overflow-hidden rounded-xl bg-[#f2f2f2]">
                  <Image src={addon.image} alt={addon.imageAlt} fill className="object-cover" sizes="62px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-xl font-bold sm:text-[22px]">{addon.name}</p>
                  <p className="mt-1 text-sm text-black/60">{addon.blurb}</p>
                </div>
                <p className="shrink-0 font-serif text-2xl font-extrabold text-[#FF2D8E]">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu rows */}
      <section id="menu" className="scroll-mt-24 px-6 pb-5 pt-[70px]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-[72px]">
          {FACIALS_TREATMENTS.map((t, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={t.num}
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-[52px] ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                <div className="relative min-h-[320px] overflow-hidden rounded-3xl bg-[#efe9e6] lg:min-h-[440px]">
                  <Image
                    src={t.image}
                    alt={`${t.name} at Hello Gorgeous Med Spa`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 560px"
                  />
                  <span
                    className="absolute left-[18px] top-[18px] font-serif text-4xl font-extrabold text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.4)]"
                    aria-hidden
                  >
                    {t.num}
                  </span>
                </div>
                <div>
                  <span className="mb-3.5 inline-block rounded-full border-[1.5px] border-[#FF2D8E]/40 px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-[#FF2D8E]">
                    {t.badge}
                  </span>
                  <h3 className="font-serif text-3xl font-bold leading-tight tracking-tight lg:text-[38px]">
                    {t.name}
                  </h3>
                  <p className="mt-3.5 text-[17px] leading-relaxed text-black/72">{t.desc}</p>
                  <ul className="mt-4 list-disc space-y-2 pl-5">
                    {t.bullets.map((b) => (
                      <li key={b} className="text-[15px] leading-snug text-[#222]">
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 overflow-hidden rounded-2xl border border-black/10">
                    {t.prices.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-4 border-b border-black/[0.07] px-[18px] py-3.5 last:border-b-0"
                      >
                        <div>
                          <p className="text-[15px] font-semibold text-[#111]">{row.label}</p>
                          {row.sub ? <p className="mt-0.5 text-[13px] text-black/50">{row.sub}</p> : null}
                        </div>
                        <p className="shrink-0 font-serif text-xl font-extrabold text-[#FF2D8E]">{row.price}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={t.href}
                    className="mt-[18px] inline-flex items-center gap-1.5 text-[15px] font-bold text-[#E6007E] transition hover:gap-2.5 hover:text-[#111]"
                  >
                    Full treatment details →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 px-6 pb-10 pt-24">
        <h2 className="mx-auto max-w-[820px] text-center font-serif text-4xl font-bold tracking-tight sm:text-[50px]">
          Common Questions
        </h2>
        <div className="mx-auto mt-10 max-w-[820px]">
          {FACIALS_FAQS.map((faq, i) => {
            const open = openFaq === i;
            return (
              <div key={faq.q} className="border-b border-black/12">
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? -1 : i)}
                  className="flex w-full items-center justify-between gap-5 px-1 py-[26px] text-left"
                  aria-expanded={open}
                >
                  <span className="text-lg font-semibold text-[#111] sm:text-[21px]">{faq.q}</span>
                  <span className="shrink-0 text-[28px] font-normal leading-none text-[#FF2D8E]" aria-hidden>
                    {open ? "–" : "+"}
                  </span>
                </button>
                {open ? (
                  <p className="mb-[26px] max-w-[720px] px-1 text-[17px] leading-relaxed text-black/72">{faq.a}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[#111] px-6 py-[90px] text-center">
        <div className="mx-auto max-w-[760px]">
          <p className="mb-5 text-xs font-bold tracking-[0.3em] text-[#FF2D8E]">DOWNTOWN OSWEGO · NP-DIRECTED</p>
          <h2 className="font-serif text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-[52px]">
            Book your free <span className="italic text-[#FF2D8E]">consultation</span>
          </h2>
          <p className="mx-auto mt-[18px] max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
            Questions about Facials &amp; Peels? We&apos;re at {SITE.address.streetAddress},{" "}
            {SITE.address.addressLocality}, IL.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <PinkPillLink href={bookHref}>Book a free consult ›</PinkPillLink>
            <a
              href={phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 px-10 py-4 text-[17px] font-bold text-white transition hover:border-[#FF2D8E]"
            >
              Call {phoneDisplay.replace(/[()]/g, "").replace(" ", "-")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
