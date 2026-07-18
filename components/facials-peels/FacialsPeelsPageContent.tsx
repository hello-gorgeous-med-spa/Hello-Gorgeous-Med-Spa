"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { JourneyFitImage } from "@/components/marketing/JourneyFitImage";
import { JourneyResultsCinema } from "@/components/marketing/JourneyResultsCinema";
import { JourneySoundVideo } from "@/components/marketing/JourneySoundVideo";
import {
  FACIALS_CONTACT,
  FACIALS_FAQS,
  FACIALS_MENU_CATEGORIES,
  FACIALS_PEELS_MARKETING,
  FACIALS_PEELS_PAGE_NAV,
  FACIALS_RESULTS,
  FACIALS_SQUARE_PROTOCOLS,
  FACIALS_STEPS,
  FACIALS_TRIFECTA_SPECIAL,
} from "@/lib/facials-peels-marketing";
import { SITE } from "@/lib/seo";

function PinkBtn({
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
  const cls = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#FF2D8E] px-7 py-3.5 text-base font-extrabold text-black transition hover:-translate-y-0.5 hover:bg-white ${className}`;
  if (external || href.startsWith("tel:") || href.startsWith("sms:")) {
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={cls}>
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

function GhostBtn({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const isExternal = href.startsWith("tel:") || href.startsWith("sms:");
  const cls = `inline-flex items-center justify-center gap-2 rounded-full border border-white/45 px-7 py-3.5 text-base font-bold text-white transition hover:-translate-y-0.5 hover:border-[#FF2D8E] hover:text-[#FF2D8E] ${className}`;
  if (isExternal) {
    return (
      <a href={href} className={cls}>
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-extrabold uppercase tracking-[0.3em] text-[#FF2D8E]">{children}</p>;
}

function SectionHead({
  eyebrow,
  title,
  titleAccent,
  description,
}: {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  description?: string;
}) {
  return (
    <div className="max-w-[720px]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-serif text-[34px] font-bold leading-[1.05] text-white lg:text-[46px]">
        {title}
        {titleAccent ? (
          <>
            {" "}
            <span className="text-[#FF2D8E]">{titleAccent}</span>
          </>
        ) : null}
      </h2>
      {description ? <p className="mt-4 text-lg leading-relaxed text-white/70">{description}</p> : null}
    </div>
  );
}

export function FacialsPeelsPageContent() {
  const { images } = FACIALS_PEELS_MARKETING;
  const bookHref = FACIALS_PEELS_MARKETING.bookHref;
  const [openFaq, setOpenFaq] = useState(0);
  const [activeCat, setActiveCat] = useState(0);
  const cat = FACIALS_MENU_CATEGORIES[activeCat] ?? FACIALS_MENU_CATEGORIES[0];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="relative overflow-hidden border-b border-white/10">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 80% at 80% 20%, rgba(255,45,142,0.22), transparent 55%), radial-gradient(50% 60% at 10% 80%, rgba(230,0,126,0.12), transparent 50%), linear-gradient(160deg, #0a0a0a 0%, #2d1020 45%, #0a0a0a 100%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-24">
          <div>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.3em] text-[#FFB8DC]">
              {SITE.address.addressLocality}, IL · Esthetic care
            </p>
            <h1 className="mt-4 font-serif text-[42px] font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[56px]">
              Facials &{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent italic"
                style={{ WebkitBackgroundClip: "text" }}
              >
                Peels
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              Not your spa-day facial — clinical-strength HydraFacials, Square signature protocols, dermaplaning,
              chemical peels, VI Peel, and IPL. Zero fluff, real results.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <PinkBtn href={bookHref}>Book facial</PinkBtn>
              <GhostBtn href="#protocols">See Square protocols</GhostBtn>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["Medical-grade", "Square bookable", "From $75", "Zero fluff"].map((chip) => (
                <span key={chip} className="rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-semibold">
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)] lg:max-w-lg">
            <JourneySoundVideo
              src={FACIALS_PEELS_MARKETING.heroVideo}
              poster={images.hero}
              label="HydraFacial science animation — Hello Gorgeous Med Spa"
              preload="auto"
              hasAudio={false}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 bg-[#FF2D8E] px-6 py-4 text-center text-[15px] font-extrabold tracking-wide text-black">
        <span>★★★★★ 5.0 on Fresha · 1,931 reviews</span>
        <span className="hidden sm:inline">·</span>
        <span>Esthetic flagship · Oswego</span>
        <span className="hidden sm:inline">·</span>
        <span>NP-led medical spa</span>
      </div>

      <nav className="sticky top-0 z-20 border-b border-white/10 bg-black/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {FACIALS_PEELS_PAGE_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-white/85 transition hover:border-[#FF2D8E] hover:text-[#FF2D8E]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <section id="why" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-14 lg:py-20">
        <div className="mx-auto max-w-4xl rounded-[20px] border border-[#FF2D8E]/35 bg-[#0a0206] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-[#FF2D8E] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-black">
                {FACIALS_TRIFECTA_SPECIAL.badge}
              </span>
              <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">
                The <span className="italic text-[#FF2D8E]">Trifecta</span>
              </h2>
              <p className="mt-2 max-w-xl text-white/75">{FACIALS_TRIFECTA_SPECIAL.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {FACIALS_TRIFECTA_SPECIAL.chips.map((c) => (
                  <span key={c} className="rounded-full border border-[#FF2D8E]/40 px-3 py-1 text-xs font-semibold text-[#FFB8DC]">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="font-serif text-4xl font-bold text-[#FF2D8E]">{FACIALS_TRIFECTA_SPECIAL.priceLabel}</p>
              <p className="text-sm text-white/55">{FACIALS_TRIFECTA_SPECIAL.priceNote}</p>
            </div>
          </div>
          <div className="mt-6">
            <PinkBtn href={bookHref}>{FACIALS_TRIFECTA_SPECIAL.ctaLabel}</PinkBtn>
          </div>
        </div>
      </section>

      <section id="protocols" className="scroll-mt-24 px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="Square Skin Spa"
            title="Signature protocols —"
            titleAccent="book by name"
            description="Live Square catalog names and prices. Pick your protocol or ask us to match your skin at consult."
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FACIALS_SQUARE_PROTOCOLS.map((p) => (
              <Link
                key={p.id}
                href={bookHref}
                className="group overflow-hidden rounded-2xl border border-white/14 bg-[#0a0206] transition hover:border-[#FF2D8E]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <Image
                    src={p.image}
                    alt={`${p.name} — Hello Gorgeous signature facial`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 50vw, 360px"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-white">{p.name}</h3>
                    <p className="shrink-0 font-serif text-xl font-bold text-[#FF2D8E]">{p.price}</p>
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/45">{p.duration}</p>
                  <p className="mt-2 text-sm text-white/70">{p.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="menu" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="Full esthetic menu"
            title="Five pathways to"
            titleAccent="better skin"
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {FACIALS_MENU_CATEGORIES.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCat(i)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                  activeCat === i
                    ? "border-[#FF2D8E] bg-[#FF2D8E] text-black"
                    : "border-white/25 text-white/80 hover:border-[#FF2D8E] hover:text-[#FF2D8E]"
                }`}
              >
                {c.num} {c.name}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="overflow-hidden rounded-3xl border border-[#FF2D8E]/35">
              <JourneyFitImage
                src={cat.image}
                alt={cat.name}
                aspectClassName="aspect-[4/5] sm:aspect-[16/11]"
                objectClassName="object-cover"
                padded={false}
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
            <div>
              <span className="inline-flex rounded-full border border-[#FF2D8E]/50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#FF2D8E]">
                {cat.badge}
              </span>
              <h3 className="mt-3 font-serif text-3xl font-bold text-white">{cat.name}</h3>
              <p className="mt-3 text-white/75">{cat.desc}</p>
              <ul className="mt-5 space-y-2">
                {cat.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-white/80">
                    <span className="text-[#FF2D8E]" aria-hidden>
                      +
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2 rounded-2xl border border-white/12 bg-black/40 p-4">
                {cat.prices.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-3 border-b border-white/8 py-2 last:border-0">
                    <div>
                      <p className="font-semibold text-white">{row.label}</p>
                      {row.sub ? <p className="text-xs text-white/45">{row.sub}</p> : null}
                    </div>
                    <p className="shrink-0 font-serif text-lg font-bold text-[#FF2D8E]">{row.price}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <PinkBtn href={bookHref}>Book now</PinkBtn>
                <GhostBtn href={cat.href}>Learn more →</GhostBtn>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="results" className="scroll-mt-24 px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="Real results"
            title="Before & after —"
            titleAccent="clinic gallery"
            description="Peel and facial photography from Hello Gorgeous. Individual results vary."
          />
          <div className="mt-10">
            <JourneyResultsCinema productName="Facials & Peels" slides={FACIALS_RESULTS} />
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead eyebrow="How it works" title="Consult to" titleAccent="consistent glow" />
            <ol className="mt-8 space-y-4">
              {FACIALS_STEPS.map((step) => (
                <li key={step.step} className="rounded-[20px] border border-white/14 bg-[#0a0206] p-4">
                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF2D8E] text-sm font-extrabold text-black">
                      {step.step}
                    </span>
                    <div>
                      <h3 className="font-bold text-white">{step.title}</h3>
                      <p className="mt-1 text-sm text-white/75">{step.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl border border-[#FF2D8E]/35 shadow-[0_16px_40px_rgba(255,45,142,0.18)] lg:max-w-[360px]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={images.founder}
                alt="Danielle and Ryan — Hello Gorgeous Med Spa founders"
                fill
                className="object-cover object-[center_22%]"
                sizes="360px"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHead eyebrow="FAQ" title="Common" titleAccent="questions" />
          <div className="mt-8 space-y-3">
            {FACIALS_FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q} className="overflow-hidden rounded-2xl border border-white/14 bg-[#0a0206]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-bold text-white">{faq.q}</span>
                    <span className="text-[#FF2D8E]" aria-hidden>
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  {open ? <p className="border-t border-white/10 px-5 py-4 text-sm leading-relaxed text-white/75">{faq.a}</p> : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="px-6 py-16 lg:py-20"
        style={{ background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)" }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>
            <span className="text-white/90">{FACIALS_CONTACT.eyebrow}</span>
          </Eyebrow>
          <h2 className="mt-3 font-serif text-3xl font-black text-white sm:text-4xl">
            {FACIALS_CONTACT.title} <span className="italic">{FACIALS_CONTACT.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">{FACIALS_CONTACT.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={bookHref}
              className="inline-flex rounded-full bg-white px-8 py-3.5 text-base font-extrabold text-[#E6007E] transition hover:-translate-y-0.5"
            >
              Book free consult
            </Link>
            <a
              href={FACIALS_PEELS_MARKETING.phoneHref}
              className="inline-flex rounded-full border-2 border-white px-8 py-3.5 text-base font-bold text-white hover:bg-white/10"
            >
              Call {FACIALS_PEELS_MARKETING.phoneDisplay}
            </a>
            <Link
              href={FACIALS_PEELS_MARKETING.hydraHref}
              className="inline-flex rounded-full border-2 border-white/70 px-8 py-3.5 text-base font-semibold text-white/95 hover:bg-white/10"
            >
              HydraFacial Journey →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
