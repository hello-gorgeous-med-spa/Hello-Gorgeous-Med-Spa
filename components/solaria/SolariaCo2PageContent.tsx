"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { JourneyFitImage } from "@/components/marketing/JourneyFitImage";
import { JourneyResultsCinema } from "@/components/marketing/JourneyResultsCinema";
import { JourneySoundVideo } from "@/components/marketing/JourneySoundVideo";
import {
  SOLARIA_CONTACT,
  SOLARIA_DEPTH_GUIDE,
  SOLARIA_FAQS,
  SOLARIA_FOUNDER_NOTE,
  SOLARIA_INMODE_STORY,
  SOLARIA_LAUNCH_SPECIAL,
  SOLARIA_MARKETING,
  SOLARIA_NAV,
  SOLARIA_PACKAGES,
  SOLARIA_RECOVERY,
  SOLARIA_RESULTS,
  SOLARIA_STEPS,
  SOLARIA_TREATMENT_AREAS,
  SOLARIA_TREATS,
  SOLARIA_WHAT_IT_DOES,
} from "@/lib/solaria-marketing";
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

export function SolariaCo2PageContent() {
  const [navOpen, setNavOpen] = useState(false);
  const { bookHref, phoneTel, phoneDisplay, textTel, textDisplay } = SOLARIA_CONTACT;
  const { images } = SOLARIA_MARKETING;

  return (
    <div className="min-h-[100dvh] bg-black font-sans text-white">
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/82 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5 font-bold">
            <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-[13px] font-extrabold text-white">
              HG
            </span>
            <span className="hidden text-base sm:inline">Solaria CO₂ · InMode</span>
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
          <div className="hidden items-center gap-6 text-[15px] lg:flex">
            {SOLARIA_NAV.map((item) => (
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
              {SOLARIA_NAV.map((item) => (
                <a key={item.href} href={item.href} className="text-white/85" onClick={() => setNavOpen(false)}>
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
            <Eyebrow>{SOLARIA_MARKETING.eyebrow}</Eyebrow>
            <h1 className="mt-4 font-serif text-[44px] font-bold leading-[1.02] text-white lg:text-[66px]">
              Your Solaria <span className="text-[#FF2D8E]">Journey</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80 lg:text-xl">
              {SOLARIA_MARKETING.subhead} {SITE.tagline}
            </p>
            <p className="mt-3 text-sm text-white/55">{SOLARIA_MARKETING.trustLine}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <PinkBtn href={bookHref}>Book a Free Consult</PinkBtn>
              <GhostBtn href={textTel}>Text {textDisplay}</GhostBtn>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["InMode verified", "Fractional CO₂", "Custom depth", "$899 launch"].map((chip) => (
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
            <JourneySoundVideo
              src={`${SOLARIA_MARKETING.heroVideo}?v=2`}
              poster={images.hero}
              label="Solaria CO2 laser resurfacing at Hello Gorgeous Med Spa — InMode verified provider"
              preload="auto"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 bg-[#FF2D8E] px-6 py-4 text-center text-[15px] font-extrabold tracking-wide text-black">
        <span>★★★★★ 5.0 on Fresha · 1,931 reviews</span>
        <span className="hidden sm:inline">·</span>
        <span>Only Solaria in the western suburbs</span>
        <span className="hidden sm:inline">·</span>
        <span>Full-authority NP on site</span>
      </div>

      <section id="why" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-14 lg:py-20">
        <div className="mx-auto max-w-4xl rounded-[20px] border border-[#FF2D8E]/35 bg-[#0a0206] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-[#FF2D8E] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-black">
                {SOLARIA_LAUNCH_SPECIAL.badge}
              </span>
              <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">{SOLARIA_LAUNCH_SPECIAL.title}</h2>
              <p className="mt-2 max-w-xl text-white/75">{SOLARIA_LAUNCH_SPECIAL.description}</p>
            </div>
            <div className="text-right">
              <p className="font-serif text-4xl font-bold text-[#FF2D8E]">{SOLARIA_LAUNCH_SPECIAL.priceLabel}</p>
              <p className="text-sm text-white/55">{SOLARIA_LAUNCH_SPECIAL.priceNote}</p>
            </div>
          </div>
          <div className="mt-6">
            <PinkBtn href={bookHref}>{SOLARIA_LAUNCH_SPECIAL.ctaLabel}</PinkBtn>
          </div>
        </div>
      </section>

      <section id="inmode" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
            <JourneySoundVideo
              src={`${SOLARIA_MARKETING.treatmentsSocialVideo}?v=2`}
              poster={SOLARIA_MARKETING.treatmentsSocialPoster}
              label="Official InMode Solaria treatments social video"
              aspectClassName="aspect-[9/16]"
              objectClassName="object-cover"
              preload="auto"
            />
          </div>
          <div>
            <Eyebrow>{SOLARIA_INMODE_STORY.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-serif text-[34px] font-bold leading-tight text-white lg:text-[48px]">
              {SOLARIA_INMODE_STORY.title}{" "}
              <span className="text-[#FF2D8E]">{SOLARIA_INMODE_STORY.titleAccent}</span>
            </h2>
            <div className="mt-5 flex max-w-xl flex-col gap-4 text-[17px] leading-relaxed text-white/85">
              {SOLARIA_INMODE_STORY.body.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {SOLARIA_INMODE_STORY.chips.map((chip) => (
                <span key={chip} className="rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-semibold">
                  {chip}
                </span>
              ))}
            </div>
            <blockquote className="mt-7 max-w-xl border-l-[3px] border-[#FF2D8E] pl-5 font-serif text-xl italic leading-snug text-white">
              &ldquo;{SOLARIA_INMODE_STORY.quote}&rdquo;
            </blockquote>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <PinkBtn href={bookHref}>Book Solaria consult</PinkBtn>
              <GhostBtn href={SOLARIA_MARKETING.trifectaHref}>See InMode Trifecta</GhostBtn>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-[1200px] gap-3 sm:grid-cols-2 sm:gap-4">
          <JourneyFitImage
            src={images.overview}
            alt="InMode Solaria manufacturer workstation overview"
            aspectClassName="aspect-[16/10]"
          />
          <JourneyFitImage
            src={images.workstation}
            alt="Solaria CO2 workstation at Hello Gorgeous Med Spa"
            aspectClassName="aspect-[16/10]"
          />
        </div>
      </section>

      <section className="bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:gap-12">
          <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-[#FF2D8E]/35 shadow-[0_16px_40px_rgba(255,45,142,0.18)] lg:max-w-[300px]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={images.founder}
                alt="Danielle Alcala-Glazier and Ryan Kent, FNP-BC — Founders, Hello Gorgeous Med Spa"
                fill
                className="object-cover object-[center_22%]"
                sizes="300px"
              />
            </div>
          </div>
          <div>
            <Eyebrow>{SOLARIA_FOUNDER_NOTE.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight text-white lg:text-[44px]">
              {SOLARIA_FOUNDER_NOTE.title}
            </h2>
            <div className="mt-6 flex max-w-xl flex-col gap-4 text-[17px] leading-relaxed text-white/85">
              {SOLARIA_FOUNDER_NOTE.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-baseline gap-3.5">
              <span className="font-serif text-[28px] font-bold text-[#FF2D8E]">{SOLARIA_FOUNDER_NOTE.signOff}</span>
              <span className="text-[13px] font-bold uppercase tracking-[0.16em] text-white/60">
                {SOLARIA_FOUNDER_NOTE.role}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead eyebrow="Why Solaria CO₂" title="Gold-standard" titleAccent="fractional resurfacing" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SOLARIA_WHAT_IT_DOES.map((item) => (
              <article key={item.id} className="flex h-full flex-col rounded-[20px] border border-white/14 bg-[#0a0206] p-5">
                <p className="font-serif text-3xl font-bold text-[#FF2D8E]">{item.stat}</p>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-white/45">{item.statLabel}</p>
                <h3 className="mt-3 font-serif text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="treats" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="What Solaria treats"
            title="Surface concerns ·"
            titleAccent="real rewrite"
            description="Official InMode Solaria education — the same CO₂ platform we run in Oswego."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            {SOLARIA_TREATS.map((t) => (
              <span key={t} className="rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-semibold">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {SOLARIA_TREATMENT_AREAS.map((area) => (
              <span key={area} className="rounded-full border border-[#FF2D8E]/40 px-4 py-1.5 text-[13px] font-semibold text-[#FFB8DC]">
                {area}
              </span>
            ))}
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-3 sm:gap-4">
            <JourneyFitImage
              src={images.edu1}
              alt="Solaria by InMode educational graphic 1"
              aspectClassName="aspect-[4/5]"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <JourneyFitImage
              src={images.edu2}
              alt="Solaria by InMode educational graphic 2"
              aspectClassName="aspect-[4/5]"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <JourneyFitImage
              src={images.edu3}
              alt="Solaria by InMode educational graphic 3"
              aspectClassName="aspect-[4/5]"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
        </div>
      </section>

      <section id="results" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="Real results"
            title="Before & after —"
            titleAccent="cinematic gallery"
            description="HD slideshow of Hello Gorgeous clinic cases and curated InMode clinical photography. Individual results vary."
          />
          <div className="mt-10">
            <JourneyResultsCinema productName="Solaria CO₂" slides={SOLARIA_RESULTS} />
          </div>
        </div>
      </section>

      <section id="recovery" className="scroll-mt-24 px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="Recovery guide"
            title="Plan your"
            titleAccent="downtime honestly"
            description="Recovery depends on depth — light fractional heals faster; deeper ablative needs more calendar space."
          />
          <div className="mt-10 overflow-x-auto rounded-[20px] border border-white/14">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#FF2D8E] text-black">
                <tr>
                  <th className="px-4 py-3 font-extrabold">Depth</th>
                  <th className="px-4 py-3 font-extrabold">Redness</th>
                  <th className="px-4 py-3 font-extrabold">Peeling</th>
                  <th className="px-4 py-3 font-extrabold">Full healing</th>
                  <th className="px-4 py-3 font-extrabold">Makeup / work</th>
                </tr>
              </thead>
              <tbody>
                {SOLARIA_RECOVERY.map((row) => (
                  <tr key={row.level} className="border-t border-white/10 bg-[#0a0206]">
                    <td className="px-4 py-3 font-bold text-white">{row.level}</td>
                    <td className="px-4 py-3 text-white/80">{row.redness}</td>
                    <td className="px-4 py-3 text-white/80">{row.peeling}</td>
                    <td className="px-4 py-3 text-white/80">{row.healing}</td>
                    <td className="px-4 py-3 text-white/80">{row.makeup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-white/55">
            Day 1–3: sunburned feel. Day 4–7: peel & flake. Week 2+: pink, refining skin. SPF 50+ is non-negotiable.
          </p>
        </div>
      </section>

      <section id="how" className="scroll-mt-24 bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead eyebrow="How it works" title="Consult to" titleAccent="new skin" />
            <ol className="mt-8 space-y-4">
              {SOLARIA_STEPS.map((step) => (
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
            <Link
              href={SOLARIA_MARKETING.careHref}
              className="mt-6 inline-flex text-sm font-bold text-[#FF2D8E] underline underline-offset-4"
            >
              Pre & post care guide →
            </Link>
          </div>
          <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl border border-[#FF2D8E]/35 shadow-[0_16px_40px_rgba(255,45,142,0.18)] lg:max-w-[360px]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={images.clinicDanielle}
                alt="Danielle with Solaria CO2 InMode at Hello Gorgeous Med Spa clinic"
                fill
                className="object-cover object-center"
                sizes="360px"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead eyebrow="Pricing" title="$899 launch ·" titleAccent="depth quoted at consult" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SOLARIA_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className={`flex h-full flex-col rounded-[20px] border bg-[#0a0206] p-5 ${
                  pkg.highlight ? "border-[#FF2D8E]/60 ring-1 ring-[#FF2D8E]/30" : "border-white/14"
                }`}
              >
                <h3 className="font-serif text-lg font-bold text-white">{pkg.name}</h3>
                <p className="mt-2 font-serif text-3xl font-bold text-[#FF2D8E]">{pkg.price}</p>
                <p className="text-xs text-white/55">{pkg.detail}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-white/80">
                  {pkg.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-[#FF2D8E]" aria-hidden>
                        ✓
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <PinkBtn
                    href={"href" in pkg && pkg.href ? pkg.href : bookHref}
                    className="w-full !px-4 !py-2.5 !text-sm"
                  >
                    {"href" in pkg && pkg.href ? "View specials" : "Book consult"}
                  </PinkBtn>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 rounded-[20px] border border-white/14 bg-[#0a0206] p-6">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#FF2D8E]">Depth guide (education)</p>
            <p className="mt-2 text-sm text-white/60">
              Manufacturer-style planning ranges — your final quote is customized after we assess skin, goals, and downtime.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {SOLARIA_DEPTH_GUIDE.map((row) => (
                <div key={row.area} className="rounded-2xl border border-white/10 p-4">
                  <h3 className="font-serif text-lg font-bold text-white">{row.area}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-white/75">
                    <li>✓ {row.light}</li>
                    <li>✓ {row.moderate}</li>
                    <li className="text-white/50">{row.note}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl rounded-[20px] border border-[#FF2D8E]/35 bg-[#0a0206] p-8 text-center">
          <Eyebrow>InMode Trifecta</Eyebrow>
          <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">
            Surface + depth + contour = complete transformation
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Solaria resurfaces. Morpheus8 remodels beneath. Quantum contours. Together — VIP Trifecta.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <GhostBtn href={SOLARIA_MARKETING.compareMorpheusHref}>Explore Morpheus8</GhostBtn>
            <GhostBtn href={SOLARIA_MARKETING.quantumHref}>Explore Quantum RF</GhostBtn>
            <PinkBtn href={SOLARIA_MARKETING.trifectaHref}>VIP Trifecta packages</PinkBtn>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[900px]">
          <SectionHead eyebrow="FAQ" title="Solaria" titleAccent="questions" />
          <div className="mt-10 space-y-3">
            {SOLARIA_FAQS.map((faq, idx) => (
              <details
                key={faq.q}
                className="group rounded-[20px] border border-white/14 bg-[#0a0206] open:border-[#FF2D8E]/50"
                {...(idx === 0 ? { open: true } : {})}
              >
                <summary className="cursor-pointer list-none px-5 py-4 font-bold text-white marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-3">
                    <span>{faq.q}</span>
                    <span className="text-[#FF2D8E] transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <div className="border-t border-white/10 px-5 pb-4 pt-3 text-sm leading-relaxed text-white/80">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FF2D8E] px-6 py-16 text-black lg:py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="font-serif text-[34px] font-bold leading-tight lg:text-[46px]">
            Ready for smoother, clearer skin?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-black/80">
            Free consult · InMode Solaria · Oswego IL · $899 launch
          </p>
          <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
            <Link
              href={bookHref}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black bg-black px-8 py-3 text-sm font-extrabold text-white transition hover:bg-white hover:text-black"
            >
              Book free consult
            </Link>
            <a
              href={textTel}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black/60 px-8 py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white"
            >
              Text {textDisplay}
            </a>
            <a
              href={phoneTel}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black/60 px-8 py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white"
            >
              Call {phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
