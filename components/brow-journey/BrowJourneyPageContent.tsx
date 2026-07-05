"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  BROW_JOURNEY_AFTERCARE,
  BROW_JOURNEY_BLOG,
  BROW_JOURNEY_CONTACT,
  BROW_JOURNEY_FAQS,
  BROW_JOURNEY_FORMS,
  BROW_JOURNEY_HEALING,
  BROW_JOURNEY_IMAGES,
  BROW_JOURNEY_NAV,
  BROW_JOURNEY_PRE_CARE,
  BROW_JOURNEY_PRICING,
  BROW_JOURNEY_SHAPES,
  BROW_JOURNEY_TD_SHADES,
  BROW_JOURNEY_TECHNIQUE_COMPARE,
  BROW_JOURNEY_TECHNIQUES,
} from "@/lib/brow-journey-marketing";
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
  return (
    <p className="text-[13px] font-extrabold uppercase tracking-[0.3em] text-[#FF2D8E]">{children}</p>
  );
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
      {description ? (
        <p className="mt-4 text-lg leading-relaxed text-white/70">{description}</p>
      ) : null}
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

function BrowCurve({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 120 34" fill="none" className="mb-3.5 h-11 w-full" aria-hidden>
      <path d={path} stroke="#FF2D8E" strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}

export function BrowJourneyPageContent() {
  const [navOpen, setNavOpen] = useState(false);
  const { bookHref, phoneTel, phoneDisplay, textTel, textDisplay, financingHref } = BROW_JOURNEY_CONTACT;
  const pricing = BROW_JOURNEY_PRICING;

  return (
    <div className="min-h-[100dvh] bg-black font-sans text-white">
      {/* Sticky nav */}
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
            {BROW_JOURNEY_NAV.map((item) => (
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
              {BROW_JOURNEY_NAV.map((item) => (
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

      {/* Hero */}
      <header className="relative overflow-hidden bg-[radial-gradient(90%_70%_at_78%_25%,#2a0820_0%,#12030c_55%,#000_100%)]">
        <div
          className="pointer-events-none absolute -right-28 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,45,142,0.28),transparent_62%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-24">
          <div>
            <Eyebrow>Permanent Makeup · Oswego, IL</Eyebrow>
            <h1 className="mt-4 font-serif text-[44px] font-bold leading-[1.02] text-white lg:text-[66px]">
              Your Brow <span className="text-[#FF2D8E]">Journey</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80 lg:text-xl">
              Wake up with brows you love. Your step-by-step guide to microblading & brow PMU at Hello
              Gorgeous — from consultation and mapping to healing and your perfecting touch-up.{" "}
              {SITE.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <PinkBtn href={bookHref}>Book a Free Consult</PinkBtn>
              <GhostBtn href={textTel}>Text {textDisplay}</GhostBtn>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["NP-directed", "Licensed medical professionals", "Custom-mapped to your face"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-semibold"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
            <div className="relative aspect-[4/5] w-full bg-black">
              <video
                src={BROW_JOURNEY_IMAGES.heroVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover"
                aria-label="Microblading and brow PMU at Hello Gorgeous Med Spa — Jen Vokoun, permanent makeup artist"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Trust bar */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 bg-[#FF2D8E] px-6 py-4 text-center text-[15px] font-extrabold tracking-wide text-black">
        <span>★★★★★ 5.0 on Fresha · 1,931 reviews</span>
        <span className="hidden sm:inline">·</span>
        <span>#1 Best Med Spa in Oswego</span>
        <span className="hidden sm:inline">·</span>
        <span>Full-authority NP on site</span>
      </div>

      {/* Artist */}
      <section id="artist" className="bg-[radial-gradient(85%_95%_at_20%_30%,#1a0510,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <div className="overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
            <div className="relative aspect-square w-full">
              <Image
                src={BROW_JOURNEY_IMAGES.artistJen}
                alt="Jen Vokoun — Permanent Makeup Artist at Hello Gorgeous Med Spa"
                fill
                className="object-cover object-[center_30%]"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
            </div>
          </div>
          <div>
            <Eyebrow>Meet Your Artist</Eyebrow>
            <h2 className="mt-3 font-serif text-[38px] font-bold leading-tight text-white lg:text-[52px]">
              Jen <span className="text-[#FF2D8E]">Vokoun</span>
            </h2>
            <p className="mt-2 text-[15px] font-bold uppercase tracking-[0.16em] text-white/60">
              Permanent Makeup & Brow Artist
            </p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
              Jen brings an artist&apos;s eye and a steady, meticulous hand to every brow at Hello Gorgeous
              Med Spa. She&apos;s known for natural, custom-mapped results that suit your face, your skin,
              and your lifestyle — never a one-size-fits-all trend.
            </p>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-white/70">
              From your first consultation through your perfecting touch-up, Jen walks you through every step
              so you feel calm, informed, and cared for — the Hello Gorgeous way.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["Microblading", "Ombré / powder", "Combo & nano", "Custom brow mapping"].map((chip) => (
                <span key={chip} className="rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-semibold">
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/55">What we use</span>
              <span className="rounded-full border border-[#FF2D8E]/55 px-4 py-1.5 text-[13px] font-semibold">
                Tina Davies pigments
              </span>
            </div>
            <blockquote className="mt-7 max-w-xl border-l-[3px] border-[#FF2D8E] pl-5 font-serif text-xl italic leading-snug text-white">
              &ldquo;I want you to leave loving your brows — and understanding exactly how they&apos;ll heal
              into something even more beautiful.&rdquo;
            </blockquote>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <PinkBtn href={bookHref}>Book with Jen</PinkBtn>
              <GhostBtn href={textTel}>Text {textDisplay}</GhostBtn>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section id="founder" className="bg-[radial-gradient(85%_95%_at_78%_20%,#12030c,#000_62%)] px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
          <div className="overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={BROW_JOURNEY_IMAGES.founderDani}
                alt="Danielle Alcala — Founder, Hello Gorgeous Med Spa"
                fill
                className="object-cover object-[center_22%]"
                sizes="(max-width: 1024px) 100vw, 380px"
              />
            </div>
          </div>
          <div>
            <Eyebrow>A Note From Our Founder</Eyebrow>
            <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight text-white lg:text-[44px]">
              Why I chose Jen
            </h2>
            <div className="mt-6 flex max-w-xl flex-col gap-4 text-[17px] leading-relaxed text-white/85">
              <p>
                When I set out to bring microblading to Hello Gorgeous, I knew it had to be someone I trusted
                completely. That&apos;s Jen — and honestly, there isn&apos;t much this woman can&apos;t do.
              </p>
              <p>
                She&apos;s a full-time mom to my two stepsons, Tony and Will Alcala — at nearly every sporting
                event, working a full-time job, and running both a bakery and a cleaning business. (Bonus:
                give her any design and she&apos;ll make the cake — and she is spotless, organized, a true
                perfectionist.)
              </p>
              <p>
                Together we took the journey to learn microblading, earn our certifications, and practice on
                friends and family. Jen sat in her living room eight hours a night for months to perfect what
                she was meant to do.
              </p>
              <p>
                She is the kindest, most caring person, who will go above and beyond for anyone. I want the
                best for you — and she&apos;s the best.
              </p>
            </div>
            <blockquote className="mt-6 max-w-xl border-l-[3px] border-[#FF2D8E] pl-5 font-serif text-[22px] italic leading-snug text-white">
              Welcome to our family, Jen — although you already are.
            </blockquote>
            <div className="mt-6 flex flex-wrap items-baseline gap-3.5">
              <span className="font-serif text-[28px] font-bold text-[#FF2D8E]">xoxo, Danielle Alcala</span>
              <span className="text-[13px] font-bold uppercase tracking-[0.16em] text-white/60">
                Founder, Hello Gorgeous Med Spa
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Techniques */}
      <section id="techniques" className="px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="Understanding Your Options"
            title="There's no single best brow —"
            titleAccent="only the best brow for you"
            description="A simple guide to the techniques we offer, so you can feel confident in your choice. At your consultation we'll match one to your skin type, goals, and lifestyle."
          />
          <div className="mt-11 grid gap-6 sm:grid-cols-2">
            {BROW_JOURNEY_TECHNIQUES.map((tech) => (
              <article
                key={tech.id}
                className="flex flex-col overflow-hidden rounded-[20px] border border-white/14 bg-gradient-to-b from-[#140109] to-[#0a0206] transition hover:-translate-y-1 hover:border-[#FF2D8E]"
              >
                <div className="relative h-[210px] w-full">
                  <Image src={tech.image} alt={tech.imageAlt} fill className="object-cover object-[center_42%]" sizes="50vw" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FF2D8E]">{tech.kicker}</p>
                  <h3 className="mt-2 font-serif text-[27px] font-bold text-white">{tech.name}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/70">{tech.description}</p>
                  <p className="mt-3.5 text-sm leading-snug text-white/85">
                    <strong className="font-bold text-[#FF2D8E]">Best for:</strong> {tech.bestFor}
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-2.5">
                    {(["finish", "lasts", "skin"] as const).map((key) => (
                      <div key={key} className="rounded-xl border border-[#FF2D8E]/35 px-3 py-2.5 text-center">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-white/50">
                          {key === "finish" ? "Finish" : key === "lasts" ? "Lasts" : "Skin"}
                        </div>
                        <div className="mt-0.5 text-sm font-bold">{tech.specs[key]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 overflow-hidden rounded-[18px] border border-white/14">
            <div className="hidden grid-cols-[1.4fr_1.6fr_1.1fr_1fr] gap-3 bg-[#140109] px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-white/60 sm:grid">
              <div>Technique</div>
              <div>Look</div>
              <div>Best skin</div>
              <div>Longevity</div>
            </div>
            {BROW_JOURNEY_TECHNIQUE_COMPARE.map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-1 gap-1 border-t border-white/10 px-6 py-4 text-[15px] sm:grid-cols-[1.4fr_1.6fr_1.1fr_1fr] sm:gap-3 sm:items-center"
              >
                <div className="font-serif text-lg font-bold text-[#FF2D8E]">{row.name}</div>
                <div className="text-white/85">{row.look}</div>
                <div className="hidden text-white/85 sm:block">{row.skin}</div>
                <div className="text-white/85">{row.longevity}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shapes */}
      <section id="shapes" className="bg-[radial-gradient(80%_90%_at_15%_0%,#12030c,#000_60%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="Mapped to You"
            title="The 7"
            titleAccent="brow shapes"
            description="We map your brows to your bone structure and facial proportions using classic points — start, arch, and tail. You'll approve the mapped shape in the mirror before any pigment is applied."
          />
          <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BROW_JOURNEY_SHAPES.map((shape) => (
              <article
                key={shape.name}
                className="rounded-2xl border border-white/14 bg-[#0a0206] p-5 transition hover:border-[#FF2D8E]"
              >
                <BrowCurve path={shape.path} />
                <h3 className="font-serif text-xl font-bold">{shape.name}</h3>
                <p className="mt-1.5 text-[13.5px] leading-snug text-white/65">{shape.description}</p>
              </article>
            ))}
            <article className="flex flex-col justify-center rounded-2xl border border-[#FF2D8E]/40 bg-gradient-to-b from-[#1a0510] to-[#0a0206] p-5">
              <h3 className="font-serif text-[19px] font-bold text-[#FF2D8E]">Not sure?</h3>
              <p className="mt-1.5 text-[13.5px] leading-snug text-white/80">
                That&apos;s exactly what your consultation is for. No pressure — only guidance.
              </p>
            </article>
          </div>
          <p className="mt-8 max-w-3xl border-l-[3px] border-[#FF2D8E] pl-5 text-base leading-relaxed text-white/85">
            <strong className="text-white">How we choose your shape:</strong> we enhance your natural features
            rather than forcing a trend. Bring an inspiration photo if you like — but trust the mapping
            process; we tailor the shape to your face.
          </p>
        </div>
      </section>

      {/* Pigments */}
      <section id="pigments" className="bg-[radial-gradient(85%_95%_at_80%_10%,#12030c,#000_60%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="The Pigments We Use"
            title="Premium color, matched to you — by"
            titleAccent="Tina Davies"
            description="We use the professional Tina Davies I ❤ INK Brow Collection — award-winning, vegan, cruelty-free pigments trusted by top brow artists worldwide. Every brow is custom color-matched to your skin tone and undertone so your result heals soft, true, and natural."
          />
          <div className="mt-11 grid gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-[22px] border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.18)]">
              <div className="relative aspect-[4/3] w-full">
                <Image src={BROW_JOURNEY_IMAGES.tdHands} alt="Tina Davies I love INK pigment collection" fill className="object-cover" sizes="50vw" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-[22px] border border-white/14 bg-gradient-to-b from-[#140109] to-[#0a0206] p-7">
                <h3 className="font-serif text-2xl font-bold">Why we chose Tina Davies</h3>
                <ul className="mt-4 space-y-3">
                  {[
                    "Professional-grade, vegan & cruelty-free pigments",
                    "Engineered to heal true — minimal color shift over time",
                    "A full 7-shade range for every skin tone & undertone",
                    "Fitzpatrick-matched (F1–F6) for a natural, lasting result",
                    "The industry standard, trusted by master brow artists",
                  ].map((item) => (
                    <CheckItem key={item}>{item}</CheckItem>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-4 rounded-[22px] border border-[#FF2D8E]/50 bg-[#0a0206] px-7 py-5">
                <span className="font-serif text-2xl font-bold">I ❤ INK</span>
                <span className="h-9 w-px bg-white/20" aria-hidden />
                <p className="text-[15px] leading-snug text-white/78">
                  The Tina Davies <strong className="text-[#FF2D8E]">Brow Collection</strong> — our house pigment line.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/50">Our shade range</p>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {BROW_JOURNEY_TD_SHADES.map((shade) => (
                <div key={shade.name} className="text-center">
                  <div className="h-[70px] rounded-xl border border-white/12" style={{ background: shade.color }} />
                  <p className="mt-2 font-serif text-[15px] font-bold">{shade.name}</p>
                  <p className="text-[11px] text-white/50">{shade.fitz}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-3xl border-l-[3px] border-[#FF2D8E] pl-5 text-base leading-relaxed text-white/85">
              <strong className="text-white">Custom color matching:</strong> at your consultation we hold shade
              swatches against your skin to visualize your best match — because the right pigment is what keeps
              your brows looking natural for years.
            </p>
          </div>
          <div className="mt-8 overflow-hidden rounded-[22px] border border-white/14 bg-white">
            <Image
              src={BROW_JOURNEY_IMAGES.tdChart}
              alt="Tina Davies I love INK Brow Collection shade reference chart"
              width={1200}
              height={800}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* Pre-care */}
      <section id="prep" className="px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="Before Your Appointment"
            title="A little prep makes a"
            titleAccent="big difference"
            description="Following these steps helps your skin take pigment evenly and heal beautifully — so you get the best possible result."
          />
          <div className="mt-11 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[20px] border border-white/14 bg-[#0a0206] p-8">
              <h3 className="font-serif text-[22px] font-bold">In the days before</h3>
              <ul className="mt-4 space-y-3">
                {BROW_JOURNEY_PRE_CARE.before.map((item) => (
                  <CheckItem key={item}>{item}</CheckItem>
                ))}
              </ul>
            </div>
            <div className="rounded-[20px] border border-white/14 bg-[#0a0206] p-8">
              <h3 className="font-serif text-[22px] font-bold">Day of your appointment</h3>
              <ul className="mt-4 space-y-3">
                {BROW_JOURNEY_PRE_CARE.dayOf.map((item) => (
                  <CheckItem key={item}>{item}</CheckItem>
                ))}
              </ul>
              <div className="mt-6 flex gap-4 rounded-2xl border border-dashed border-[#FF2D8E]/60 p-5">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#FF2D8E]">Please reschedule if</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-white/85">{BROW_JOURNEY_PRE_CARE.reschedule}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Healing */}
      <section id="healing" className="bg-[radial-gradient(80%_90%_at_85%_10%,#12030c,#000_60%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="After Your Appointment"
            title="Your healing"
            titleAccent="timeline"
            description="Brow PMU heals in stages — and every one of them is normal. Here's exactly what to expect, day by day."
          />
          <div className="relative mt-12 border-l-0 pl-0 lg:border-l-0 lg:pl-10">
            <div className="absolute bottom-2 left-[11px] top-2 hidden w-0.5 bg-gradient-to-b from-[#FF2D8E] to-[#FF2D8E]/15 lg:block" aria-hidden />
            <div className="space-y-10">
              {BROW_JOURNEY_HEALING.map((phase) => (
                <div key={phase.when} className="relative lg:pl-6">
                  <div className="absolute -left-[34px] top-1 hidden h-6 w-6 rounded-full border-[3px] border-[#FF2D8E] bg-black shadow-[0_0_0_5px_rgba(255,45,142,0.14)] lg:block" aria-hidden />
                  <div className="font-serif text-2xl font-bold text-white">
                    {phase.when}{" "}
                    <span className="ml-3 inline-block rounded-full bg-[#FF2D8E] px-3 py-1 align-middle text-[11px] font-extrabold tracking-wider text-black">
                      {phase.tag}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-base leading-relaxed text-white/72">{phase.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Aftercare */}
      <section id="aftercare" className="px-6 py-14 lg:py-16">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead eyebrow="Aftercare" title="Do &" titleAccent="don't" description="Your aftercare is half of your result. Keep these close for the two weeks after your visit." />
          <div className="mt-11 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[20px] border border-[#FF2D8E]/40 bg-gradient-to-b from-[#1a0510] to-[#0a0206] p-8">
              <h3 className="font-serif text-[22px] font-bold text-[#FF2D8E]">Please DO</h3>
              <ul className="mt-4 space-y-3">
                {BROW_JOURNEY_AFTERCARE.do.map((item) => (
                  <CheckItem key={item}>{item}</CheckItem>
                ))}
              </ul>
            </div>
            <div className="rounded-[20px] border border-white/14 bg-[#0a0206] p-8">
              <h3 className="font-serif text-[22px] font-bold">Please DON&apos;T</h3>
              <ul className="mt-4 space-y-3">
                {BROW_JOURNEY_AFTERCARE.dont.map((item) => (
                  <li key={item} className="flex gap-3 text-[15.5px] leading-snug text-white/85">
                    <span className="shrink-0 font-black text-white/40">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-11 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[18px] bg-[#FFF5F9] p-7 text-black">
              <h4 className="font-serif text-xl font-bold">Trust the process</h4>
              <p className="mt-2 text-[15px] leading-relaxed text-black/75">
                Healed PMU looks 30–50% lighter and softer than it does on day one. Your perfecting touch-up at
                6–8 weeks is when we bring everything to its final, beautiful result.
              </p>
            </div>
            <div className="rounded-[18px] border border-[#FF2D8E] bg-black p-7">
              <h4 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#FF2D8E]">
                Call us right away if
              </h4>
              <p className="mt-2 text-[15px] leading-relaxed text-white/85">
                You notice signs of infection — spreading redness, swelling, warmth, pus, or fever. We&apos;re
                always here for you:{" "}
                <a href={phoneTel} className="font-bold text-[#FF2D8E] no-underline">
                  {phoneDisplay}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — before pricing in nav order healing comes before pricing; FAQ section here */}
      <section id="faq" className="bg-[radial-gradient(80%_90%_at_80%_0%,#12030c,#000_60%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            center
            eyebrow="Common Q & A"
            title="Your questions,"
            titleAccent="answered"
            description="Everything you want to know before your first brow appointment. Still curious? Your free consultation is the place to ask it all."
          />
          <div className="mx-auto mt-11 flex max-w-[860px] flex-col gap-3">
            {BROW_JOURNEY_FAQS.map((faq) => (
              <details key={faq.q} className="group overflow-hidden rounded-[14px] border border-white/14 bg-[#0a0206]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-serif text-lg font-bold text-white marker:content-none group-open:text-[#FF2D8E]">
                  {faq.q}
                  <span className="text-2xl font-normal text-[#FF2D8E] group-open:hidden">+</span>
                  <span className="hidden text-2xl font-normal text-[#FF2D8E] group-open:inline">–</span>
                </summary>
                <p className="px-6 pb-5 text-[15px] leading-relaxed text-white/72">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[radial-gradient(80%_90%_at_22%_0%,#12030c,#000_60%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="Pricing"
            title="Simple, honest"
            titleAccent="pricing"
            description="Start with a free consultation — we'll map your brows, match your color, and quote your exact plan. Every session is provider-guided, uses premium Tina Davies pigments, and includes your 6-week perfecting touch-up."
          />
          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Free consult */}
            <article className="flex flex-col rounded-[20px] border border-[#FF2D8E]/50 bg-gradient-to-b from-[#140109] to-[#0a0206] p-7 transition hover:-translate-y-1 hover:border-[#FF2D8E]">
              <span className="self-start rounded-full bg-[#FF2D8E] px-3 py-1 text-[11px] font-extrabold tracking-wider text-black">ALWAYS FREE</span>
              <h3 className="mt-4 font-serif text-2xl font-bold">Consultation & Brow Mapping</h3>
              <p className="mt-2 font-serif text-[44px] font-bold leading-none text-[#FF2D8E]">Free</p>
              <p className="mt-1 text-[13px] text-white/55">~30 minutes · no pressure</p>
              <ul className="mt-4 space-y-2">
                {["Custom brow mapping to your face", "Skin-tone & pigment color match", "Technique recommendation"].map((item) => (
                  <CheckItem key={item}>{item}</CheckItem>
                ))}
              </ul>
              <PinkBtn href={bookHref} className="mt-6 w-full">
                Book your free consult
              </PinkBtn>
            </article>

            {/* Microblading */}
            <PriceCard
              kicker="Hair-stroke · Manual"
              title="Microblading"
              price={pricing.microblading}
              subtitle="Initial session"
              image={BROW_JOURNEY_IMAGES.priceMicroblade}
              imageAlt="Microblading with a manual blade"
              bullets={["The most natural, hair-like result", "Best for dry / normal skin", "6-week touch-up included"]}
            />
            <PriceCard
              kicker="Machine Hybrid · Combo"
              title="Microblading + Shading"
              price={pricing.combo}
              subtitle="Initial session"
              image={BROW_JOURNEY_IMAGES.priceShading}
              imageAlt="Machine hybrid brow shading"
              bullets={["Crisp strokes + soft shading", "Fuller, most defined look", "6-week touch-up included"]}
            />
            <PriceCard
              kicker="6-Week Post"
              title="Perfecting Touch-Up"
              price={pricing.touchup}
              subtitle="with your initial session"
              image={BROW_JOURNEY_IMAGES.priceMachine}
              imageAlt="Perfecting touch-up with a machine"
              bullets={["Refine shape, color & density", "Essential to your final result"]}
            />
            <PriceCard
              kicker="Keep Them Fresh"
              title="Annual Color Refresher"
              price={pricing.refresher}
              subtitle="once a year · existing clients"
              image={BROW_JOURNEY_IMAGES.priceNatural}
              imageAlt="Refreshed, natural-looking brows"
              bullets={["Boost color & crispness yearly", "Far less than a new set"]}
            />
            <article className="flex flex-col justify-center rounded-[20px] border border-[#FF2D8E]/35 bg-gradient-to-b from-[#1a0510] to-[#0a0206] p-7">
              <p className="font-serif text-[22px] italic leading-snug text-white">Not sure which is right for you?</p>
              <p className="mt-2.5 text-[15px] leading-relaxed text-white/72">
                Your free consultation answers that — no pressure, only guidance.
              </p>
              <GhostBtn href={bookHref} className="mt-5 self-start">
                Book a free consult
              </GhostBtn>
            </article>
          </div>

          {/* Meet Jen special */}
          <div className="mt-6 grid gap-8 rounded-3xl bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] p-8 shadow-[0_20px_60px_rgba(255,45,142,0.3)] lg:grid-cols-[1.25fr_1fr] lg:p-12">
            <div>
              <span className="inline-flex rounded-full bg-black px-4 py-1.5 text-xs font-extrabold tracking-wider text-white">
                ★ LIMITED · PORTFOLIO SPECIAL
              </span>
              <h3 className="mt-4 font-serif text-[32px] font-bold leading-tight text-black lg:text-[40px]">
                The &ldquo;Meet Jen&rdquo; Special
              </h3>
              <p className="mt-3 max-w-lg text-[17px] leading-relaxed text-black/80">
                Jen is building her portfolio — so for a limited number of clients, you get founder-guided
                microblading at a special rate. In exchange, we take before & after photos for her book. Same
                premium pigments, same care, an unbeatable price.
              </p>
              <ul className="mt-4 space-y-2 text-[15px] font-semibold text-black">
                {[
                  "Includes your 6-week perfecting touch-up",
                  "Provider-guided & fully screened",
                  "Only a limited number of spots",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="font-black">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[18px] bg-black p-8">
              <div className="flex items-baseline justify-between border-b border-white/15 pb-4">
                <div>
                  <p className="font-serif text-xl font-bold">Microblading</p>
                  <p className="text-xs text-white/50 line-through">Reg. {pricing.microblading}</p>
                </div>
                <p className="font-serif text-[34px] font-bold text-[#FF2D8E]">{pricing.meetMicroblading}</p>
              </div>
              <div className="flex items-baseline justify-between pt-4">
                <div>
                  <p className="font-serif text-xl font-bold">Microblading + Shading</p>
                  <p className="text-xs text-white/50 line-through">Reg. {pricing.combo}</p>
                </div>
                <p className="font-serif text-[34px] font-bold text-[#FF2D8E]">{pricing.meetCombo}</p>
              </div>
              <PinkBtn href={bookHref} className="mt-6 w-full">
                Claim a &ldquo;Meet Jen&rdquo; spot
              </PinkBtn>
            </div>
          </div>

          {/* Cherry */}
          <div className="mt-6 grid gap-8 rounded-3xl border border-white/14 bg-[radial-gradient(90%_120%_at_85%_10%,#2a0820,#0a0206_70%)] p-8 lg:grid-cols-[1.35fr_0.65fr] lg:p-11">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF2D8E] text-base font-black text-black">%</span>
                <span className="font-serif text-[22px] font-bold">Cherry</span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/55">Financing Partner</span>
              </div>
              <h3 className="font-serif text-[32px] font-bold leading-tight lg:text-[38px]">
                Brows done. <span className="text-[#FF2D8E] italic">Bills manageable.</span>
              </h3>
              <p className="mt-3 max-w-lg text-[17px] leading-relaxed text-white/80">
                Pay over time with <strong className="text-white">0% APR options</strong> through Cherry. Apply in
                seconds, get high approval amounts, and book the brows you want today — no hard credit check to see
                your options.
              </p>
              <div className="mt-5 flex flex-wrap gap-5 text-sm font-semibold">
                {["Apply in seconds", "High approval amounts", "True 0% APR options"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <span className="text-[#FF2D8E]">✓</span> {item}
                  </span>
                ))}
              </div>
              <PinkBtn href={financingHref} external className="mt-6">
                Apply with Cherry
              </PinkBtn>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-[18px] bg-white p-4">
                <Image src={BROW_JOURNEY_IMAGES.cherryQr} alt="Scan to apply for Cherry financing" width={170} height={170} />
              </div>
              <p className="text-center text-[13px] font-bold tracking-wide text-white/70">Scan to apply in seconds</p>
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-[11.5px] leading-relaxed text-white/42">
            Payment options through Cherry are issued by the following financing partners: withcherry.com/financing-partners.
            Term length, approval amount, 0% APR and other promotional rates are subject to eligibility.
          </p>
          <p className="mt-5 text-center text-[13px] text-white/50">
            Introductory pricing — your exact quote is confirmed at your free consultation.
          </p>
        </div>
      </section>

      {/* Forms */}
      <section id="forms" className="px-6 py-14 lg:py-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-8 rounded-3xl border border-[#FF2D8E]/50 bg-gradient-to-b from-[#1a0510] to-[#0a0206] p-8 lg:grid-cols-[1.4fr_1fr] lg:p-12">
            <div>
              <Eyebrow>Before You Arrive</Eyebrow>
              <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight lg:text-[38px]">
                Your client <span className="text-[#FF2D8E]">forms</span>
              </h2>
              <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-white/78">
                Download and complete your consultation & intake packet before your appointment — it saves time in
                the chair and helps us give you the safest, most beautiful result.
              </p>
              <div className="mt-7 flex flex-wrap gap-3.5">
                <a
                  href={BROW_JOURNEY_FORMS.pdfHref}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF2D8E] px-7 py-3.5 text-base font-extrabold text-black transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Download the Packet (PDF)
                </a>
                <Link href={BROW_JOURNEY_FORMS.intakeHref} className="inline-flex items-center rounded-full border border-white/45 px-7 py-3.5 text-base font-bold text-white transition hover:border-[#FF2D8E] hover:text-[#FF2D8E]">
                  Complete intake online
                </Link>
              </div>
            </div>
            <ul className="flex flex-col justify-center gap-2.5">
              {BROW_JOURNEY_FORMS.checklist.map((item) => (
                <CheckItem key={item}>{item}</CheckItem>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="bg-[radial-gradient(80%_90%_at_18%_0%,#12030c,#000_60%)] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead
            eyebrow="The Brow Journal"
            title="Tips &"
            titleAccent="brow guides"
            description="Real talk on techniques, healing, and getting the most from your brows — from our team to you. More articles coming soon."
          />
          <div className="mt-11 grid gap-6 lg:grid-cols-3">
            {BROW_JOURNEY_BLOG.map((post) => (
              <a
                key={post.title}
                href={post.href}
                className="flex flex-col overflow-hidden rounded-[20px] border border-white/14 bg-gradient-to-b from-[#140109] to-[#0a0206] transition hover:-translate-y-1 hover:border-[#FF2D8E]"
              >
                <div className="relative h-[190px] w-full">
                  <Image src={post.image} alt={post.imageAlt} fill className="object-cover" sizes="33vw" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FF2D8E]">{post.kicker}</p>
                  <h3 className="mt-2 font-serif text-[23px] font-bold leading-snug">{post.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-snug text-white/70">{post.teaser}</p>
                  <span className="mt-auto pt-4 text-sm font-bold text-[#FF2D8E]">Read the guide →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[radial-gradient(80%_120%_at_50%_0%,#2a0820,#000_70%)] px-6 py-20 text-center lg:py-24">
        <Eyebrow>Start Your Brow Journey</Eyebrow>
        <h2 className="mt-3 font-serif text-[36px] font-bold leading-tight lg:text-[52px]">
          Wake up with brows <span className="text-[#FF2D8E]">you love</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/80">
          Book a free consultation and we&apos;ll map the shape and technique that&apos;s right for you — serving
          Oswego, Naperville, Aurora, Plainfield, Yorkville & Montgomery, IL.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <PinkBtn href={bookHref}>Book a Free Consult</PinkBtn>
          <GhostBtn href={textTel}>Text {textDisplay}</GhostBtn>
          <GhostBtn href={phoneTel}>Call {phoneDisplay}</GhostBtn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-12">
        <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-8">
          <div>
            <p className="font-serif text-[22px] font-bold">Hello Gorgeous Med Spa</p>
            <p className="mt-2 text-[15px] leading-relaxed text-white/70">
              74 W. Washington Street, Oswego, IL 60543
              <br />
              {phoneDisplay} · hellogorgeousmedspa.com
            </p>
            <p className="mt-2 font-serif italic text-white/80">&ldquo;{SITE.tagline}&rdquo;</p>
          </div>
          <p className="max-w-md text-[13px] leading-relaxed text-white/45">
            Family-owned. NP-directed. All treatments are performed by licensed medical professionals. Permanent
            makeup is a cosmetic tattoo; results are semi-permanent and fade gradually. A full consultation is
            required prior to treatment. Individual results vary by skin type, lifestyle, sun exposure, and
            aftercare.
          </p>
        </div>
      </footer>
    </div>
  );
}

function PriceCard({
  kicker,
  title,
  price,
  subtitle,
  image,
  imageAlt,
  bullets,
}: {
  kicker: string;
  title: string;
  price: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  bullets: string[];
}) {
  return (
    <article className="flex flex-col rounded-[20px] border border-white/14 bg-gradient-to-b from-[#140109] to-[#0a0206] p-7 transition hover:-translate-y-1 hover:border-[#FF2D8E]">
      <div className="relative mb-4 h-[150px] w-full overflow-hidden rounded-xl">
        <Image src={image} alt={imageAlt} fill className="object-cover object-[center_45%]" sizes="33vw" />
      </div>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FF2D8E]">{kicker}</p>
      <h3 className="mt-2 font-serif text-2xl font-bold">{title}</h3>
      <p className="mt-3 font-serif text-[44px] font-bold leading-none">{price}</p>
      <p className="mt-1 text-[13px] text-white/55">{subtitle}</p>
      <ul className="mt-4 space-y-2">
        {bullets.map((item) => (
          <CheckItem key={item}>{item}</CheckItem>
        ))}
      </ul>
    </article>
  );
}
