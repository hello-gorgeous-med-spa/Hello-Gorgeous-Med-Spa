"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  FALL_MAKEOVER_CAMPAIGN,
  FALL_MAKEOVER_CONTACT,
  FALL_MAKEOVER_FAQS,
  FALL_MAKEOVER_NAV,
  FALL_MAKEOVER_PACKAGES,
  type FallMakeoverLane,
  type FallMakeoverPackage,
} from "@/lib/campaigns/fall-makeover-2026";
import { HG_TAGLINE } from "@/lib/brand-tagline";
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
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
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
  center,
}: {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-[720px] ${center ? "mx-auto text-center" : ""}`}>
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

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-[15px] leading-snug text-white/85">
      <span className="shrink-0 font-black text-[#FF2D8E]">✓</span>
      <span>{children}</span>
    </li>
  );
}

function LaneChip({ lane }: { lane: FallMakeoverLane }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest ${
        lane === "inside" ? "border-[#FF2D8E]/55 text-[#FF2D8E]" : "border-white/30 text-white/80"
      }`}
    >
      {lane === "inside" ? "Inside" : "Outside"}
    </span>
  );
}

function PackageCard({ pkg }: { pkg: FallMakeoverPackage }) {
  return (
    <article
      id={pkg.id}
      className="flex scroll-mt-24 flex-col overflow-hidden rounded-[20px] border border-white/14 bg-gradient-to-b from-[#140109] to-[#0a0206] transition hover:-translate-y-1 hover:border-[#FF2D8E]"
    >
      <div className="relative aspect-square w-full bg-black">
        <Image src={pkg.image} alt={pkg.imageAlt} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 33vw" />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FF2D8E]">{pkg.concern}</p>
        <h3 className="mt-2 font-serif text-[27px] font-bold text-white">{pkg.name}</h3>
        <p className="mt-3 self-start rounded-full bg-[#FF2D8E] px-3 py-1 text-[11px] font-extrabold tracking-wider text-black">
          {pkg.savingsLabel}
        </p>
        <p className="mt-4 text-[15px] font-bold leading-snug text-white">{pkg.tagline}</p>
        <p className="mt-2 text-[15px] leading-relaxed text-white/70">{pkg.why}</p>
        <ul className="mt-5 space-y-4">
          {pkg.lines.map((line) => (
            <li key={line.name} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <LaneChip lane={line.lane} />
                <Link
                  href={line.href}
                  className="font-bold text-[#FF2D8E] underline decoration-[#FF2D8E]/40 underline-offset-4 hover:text-white"
                >
                  {line.name}
                </Link>
              </div>
              <p className="text-sm leading-relaxed text-white/70">{line.detail}</p>
              <p className="mt-1 text-sm font-extrabold text-white">{line.priceLabel}</p>
            </li>
          ))}
        </ul>
        <PinkBtn href={pkg.bookHref} className="mt-7 w-full">
          Book {pkg.name} consult
        </PinkBtn>
      </div>
    </article>
  );
}

export function FallMakeoverPageContent() {
  const [navOpen, setNavOpen] = useState(false);
  const { bookHref, phoneTel, phoneDisplay, textTel, textDisplay, financingHref } = FALL_MAKEOVER_CONTACT;
  const coverTiles = [
    {
      src: FALL_MAKEOVER_CAMPAIGN.imagePath,
      alt: "Fall Makeover cover — Repair, Prevent, Lose",
      label: "Cover",
    },
    {
      src: FALL_MAKEOVER_CAMPAIGN.giftCardImagePath,
      alt: "Complimentary $100 Fall Makeover gift card — Hello Gorgeous Med Spa",
      label: "$100 gift card",
    },
    ...FALL_MAKEOVER_PACKAGES.map((pkg) => ({
      src: pkg.image,
      alt: pkg.imageAlt,
      label: `${pkg.name} · $${pkg.savingsUsd} off`,
    })),
  ];

  return (
    <div className="min-h-[100dvh] bg-black font-sans text-white">
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/82 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5 font-bold">
            <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-[13px] font-extrabold text-white">
              HG
            </span>
            <span className="hidden text-base sm:inline">Hello Gorgeous Med Spa</span>
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
          <div className="hidden items-center gap-7 text-[15px] lg:flex">
            {FALL_MAKEOVER_NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-white/75 transition hover:text-white">
                {item.label}
              </a>
            ))}
            <PinkBtn href={bookHref} className="!px-5 !py-2.5 !text-[15px]">
              Book Now
            </PinkBtn>
          </div>
        </div>
        {navOpen ? (
          <div className="border-t border-white/10 px-6 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {FALL_MAKEOVER_NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-white/85"
                  onClick={() => setNavOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <PinkBtn href={bookHref} className="mt-2 w-full">
                Book Now
              </PinkBtn>
            </div>
          </div>
        ) : null}
      </nav>

      <header className="relative overflow-hidden bg-[radial-gradient(90%_70%_at_78%_25%,#2a0820_0%,#12030c_55%,#000_100%)]">
        <div
          className="pointer-events-none absolute -right-28 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,45,142,0.28),transparent_62%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-24">
          <div>
            <Eyebrow>Fall Makeover · Oswego, IL</Eyebrow>
            <h1 className="mt-4 font-serif text-[44px] font-bold leading-[1.02] text-white lg:text-[66px]">
              Fall Makeover <span className="text-[#FF2D8E]">inside + out</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80 lg:text-xl">
              Three packages. One season. Repair pigment, prevent aging, or lose with medical weight
              loss and tightening — each one treats you from the inside and the outside. Ryan Kent,
              FNP-BC maps the plan. {HG_TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <PinkBtn href={bookHref}>Book a Fall Makeover consult</PinkBtn>
              <GhostBtn href={textTel}>Text {textDisplay}</GhostBtn>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["$100 off Repair + gift card", "$200 off Prevent", "$150 off Lose"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-semibold"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)] lg:max-w-lg">
            <div className="relative aspect-square w-full bg-black">
              <Image
                src={FALL_MAKEOVER_CAMPAIGN.imagePath}
                alt="Fall Makeover cover — Repair, Prevent, Lose"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 520px"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 bg-[#FF2D8E] px-6 py-4 text-center text-[15px] font-extrabold tracking-wide text-black">
        <span>★★★★★ 5.0 from 1,931 verified visits</span>
        <span className="hidden sm:inline">·</span>
        <span>#1 Best Med Spa in Oswego</span>
        <span className="hidden sm:inline">·</span>
        <span>Full-authority NP on site</span>
      </div>

      <section id="packages" className="scroll-mt-24 px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="Pick your lane"
            title="Repair. Prevent."
            titleAccent="Lose."
            description="Most clients pick one lane so the inside and outside work on the same goal. Launch savings apply at consult after Ryan maps candidacy — not a checkout coupon."
          />
          <div className="mt-11 grid gap-6 lg:grid-cols-3">
            {FALL_MAKEOVER_PACKAGES.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="gift-card"
        className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
            <div className="relative aspect-square w-full bg-black">
              <Image
                src={FALL_MAKEOVER_CAMPAIGN.giftCardImagePath}
                alt="Complimentary $100 Fall Makeover gift card — chrome rose gold and chrome gold"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
          </div>
          <div>
            <Eyebrow>Launch gift</Eyebrow>
            <h2 className="mt-3 font-serif text-[38px] font-bold leading-tight text-white lg:text-[52px]">
              Complimentary <span className="text-[#FF2D8E]">$100 gift card</span>
            </h2>
            <p className="mt-2 text-[15px] font-bold uppercase tracking-[0.16em] text-white/60">
              Chrome rose gold + chrome gold
            </p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
              Book the Repair lane and we include this $100 gift card at consult. Prevent is $200 off.
              Lose is $150 off. One lane per client.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Repair — $100 off + complimentary gift card",
                "Prevent (Morpheus8) — $200 off",
                "Lose — $150 off",
              ].map((item) => (
                <CheckItem key={item}>{item}</CheckItem>
              ))}
            </ul>
            <blockquote className="mt-7 max-w-xl border-l-[3px] border-[#FF2D8E] pl-5 font-serif text-xl italic leading-snug text-white">
              Applied after Ryan maps candidacy — not a checkout coupon.
            </blockquote>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <PinkBtn href={FALL_MAKEOVER_PACKAGES[0].bookHref}>Book Repair + gift card</PinkBtn>
              <GhostBtn href={textTel}>Text {textDisplay}</GhostBtn>
            </div>
          </div>
        </div>
      </section>

      <section
        id="squares"
        className="scroll-mt-24 bg-[radial-gradient(80%_90%_at_15%_0%,#12030c,#000_60%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="Share-ready 1:1"
            title="The launch"
            titleAccent="squares"
            description="The same graphics we post — full square, no crop. Save or share from this page."
          />
          <div className="mt-11 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
            {coverTiles.map((tile) => (
              <figure
                key={tile.src}
                className="overflow-hidden rounded-[20px] border border-white/14 bg-black transition hover:border-[#FF2D8E]"
              >
                <div className="relative aspect-square">
                  <Image src={tile.src} alt={tile.alt} fill className="object-contain" sizes="(max-width: 768px) 50vw, 380px" />
                </div>
                <figcaption className="border-t border-white/10 px-3 py-2.5 text-center text-[13px] font-extrabold uppercase tracking-wider text-white/80">
                  {tile.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="How we price this"
            title="Menu anchors. Your package"
            titleAccent="locks at consult."
            description="We do not post a fake bundle total. Creams, K-Glow, vitamin shots, and Morpheus8 area are quoted after Ryan clears you."
          />
          <div className="mt-11 rounded-[20px] border border-white/14 bg-gradient-to-b from-[#140109] to-[#0a0206] p-8 lg:p-11">
            <p className="text-lg leading-relaxed text-white/80">
              IPL $79 · Solaria $899 · GHK-Cu 90-day $180 · Xeomin $12/unit · Morpheus8 from $799 ·
              HydraFacial Glow $129 · GLP-1 90-day from $825. Fall launch savings apply at consult:
              $100 off Repair with a complimentary gift card, $200 off Prevent (Morpheus8), $150 off
              Lose.
            </p>
          </div>

          <div className="mt-6 grid gap-8 rounded-3xl border border-white/14 bg-[radial-gradient(90%_120%_at_85%_10%,#2a0820,#0a0206_70%)] p-8 lg:grid-cols-[1.35fr_0.65fr] lg:p-11">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF2D8E] text-base font-black text-black">
                  %
                </span>
                <span className="font-serif text-[22px] font-bold">Cherry</span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/55">
                  Financing Partner
                </span>
              </div>
              <h3 className="font-serif text-[32px] font-bold leading-tight lg:text-[38px]">
                Fall done. <span className="text-[#FF2D8E] italic">Bills manageable.</span>
              </h3>
              <p className="mt-3 max-w-lg text-[17px] leading-relaxed text-white/80">
                Cherry financing is available, including{" "}
                <strong className="text-white">6 months 0% interest</strong> for qualifying clients.
                Apply at consult or now — approval and terms depend on Cherry.
              </p>
              <div className="mt-5 flex flex-wrap gap-5 text-sm font-semibold">
                {["Apply in seconds", "6 months 0% for qualifying clients", "High approval amounts"].map(
                  (item) => (
                    <span key={item} className="flex items-center gap-2">
                      <span className="text-[#FF2D8E]">✓</span> {item}
                    </span>
                  ),
                )}
              </div>
              <PinkBtn href={financingHref} external className="mt-6">
                Apply with Cherry
              </PinkBtn>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-[18px] bg-white p-4">
                <Image
                  src="/images/brow-journey/cherry-qr.png"
                  alt="Scan to apply for Cherry financing"
                  width={170}
                  height={170}
                />
              </div>
              <p className="text-center text-[13px] font-bold tracking-wide text-white/70">
                Scan to apply in seconds
              </p>
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-[11.5px] leading-relaxed text-white/42">
            Payment options through Cherry are issued by the following financing partners:
            withcherry.com/financing-partners. Term length, approval amount, 0% APR and other
            promotional rates are subject to eligibility.
          </p>
        </div>
      </section>

      <section
        id="faq"
        className="scroll-mt-24 bg-[radial-gradient(80%_90%_at_80%_0%,#12030c,#000_60%)] px-6 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            center
            eyebrow="Common Q & A"
            title="Your questions,"
            titleAccent="answered"
            description="Everything you want to know before you pick a lane. Still curious? Your consult is the place to ask it all."
          />
          <div className="mx-auto mt-11 flex max-w-[860px] flex-col gap-3">
            {FALL_MAKEOVER_FAQS.map((faq) => (
              <details key={faq.question} className="group overflow-hidden rounded-[14px] border border-white/14 bg-[#0a0206]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-serif text-lg font-bold text-white marker:content-none group-open:text-[#FF2D8E]">
                  {faq.question}
                  <span className="text-2xl font-normal text-[#FF2D8E] group-open:hidden">+</span>
                  <span className="hidden text-2xl font-normal text-[#FF2D8E] group-open:inline">–</span>
                </summary>
                <p className="px-6 pb-5 text-[15px] leading-relaxed text-white/72">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[radial-gradient(80%_120%_at_50%_0%,#2a0820,#000_70%)] px-6 py-20 text-center lg:py-24">
        <Eyebrow>Start your Fall Makeover</Eyebrow>
        <h2 className="mt-3 font-serif text-[36px] font-bold leading-tight lg:text-[52px]">
          Tell us Repair, Prevent, or <span className="text-[#FF2D8E]">Lose</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/80">
          We map candidacy, downtime, and the real number before anything is prescribed or booked as a
          series. Serving Oswego, Naperville, Aurora, Plainfield, Yorkville & Montgomery, IL.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <PinkBtn href={bookHref}>Book a Fall Makeover consult</PinkBtn>
          <GhostBtn href={textTel}>Text {textDisplay}</GhostBtn>
          <GhostBtn href={phoneTel}>Call {phoneDisplay}</GhostBtn>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-12">
        <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-8">
          <div>
            <p className="font-serif text-[22px] font-bold">Hello Gorgeous Med Spa</p>
            <p className="mt-2 text-[15px] leading-relaxed text-white/70">
              {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion}{" "}
              {SITE.address.postalCode}
              <br />
              {phoneDisplay} · hellogorgeousmedspa.com
            </p>
            <p className="mt-2 font-serif italic text-white/80">&ldquo;{SITE.tagline}&rdquo;</p>
          </div>
          <p className="max-w-md text-[13px] leading-relaxed text-white/45">
            Family-owned. NP-directed. All treatments are performed by licensed medical professionals.
            Prescription pieces need clearance. We do not promise a shade, a pound number, or a wrinkle
            count. Individual results vary. A full consultation is required prior to treatment.
          </p>
        </div>
      </footer>
    </div>
  );
}
