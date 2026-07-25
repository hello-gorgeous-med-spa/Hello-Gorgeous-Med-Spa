"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/Section";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";
import { VITAMIN_MEMBERSHIPS } from "@/lib/vitamin-bar";

const PHONE_DISPLAY = `(${SITE.phone.slice(0, 3)}) ${SITE.phone.slice(4, 7)}-${SITE.phone.slice(8)}`;
const PHONE_HREF = `tel:${SITE.phone.replace(/-/g, "")}`;

const SERVICES = [
  {
    title: "Botox & Injectables",
    body: "Smooth frown lines, forehead, and crow's feet with natural-looking neurotoxin. Five brands offered.",
    price: "$10",
    unit: "/unit",
    href: "/botox-oswego",
  },
  {
    title: "Dermal Fillers",
    body: "Restore volume and contour lips, cheeks, and jawline with premium HA fillers.",
    price: "$549",
    unit: "/syringe",
    href: "/dermal-fillers-oswego-il",
  },
  {
    title: "Morpheus8 Microneedling",
    body: "RF microneedling that tightens skin and remodels collagen with minimal downtime.",
    price: "$399",
    unit: "/session",
    href: "/morpheus8-burst-oswego-il",
  },
  {
    title: "CO₂ Laser Resurfacing",
    body: "Solaria CO₂ resurfacing for texture, tone, and years-back radiance.",
    price: "$899",
    unit: "/treatment",
    href: "/solaria-co2-oswego",
  },
  {
    title: "IV & Vitamin Bar",
    body: "Hydration, energy, and immunity drips plus B12 and lipo shots for quick wellness.",
    price: "$79",
    unit: "/drip",
    href: "/iv-therapy",
  },
  {
    title: "Medical Weight Loss",
    body: "NP-supervised GLP-1 programs (semaglutide & tirzepatide) and peptide therapy.",
    price: "From $249",
    unit: "/mo",
    href: "/glp-1-weight-loss-oswego",
    badge: "Hello Gorgeous RX",
  },
] as const;

const TRIFECTA = [
  {
    title: "Quantum RF",
    body: "Radiofrequency contouring that tightens and lifts from within — the deep-tissue foundation.",
    accent: "from-[#ec4899] to-[#db2777]",
    border: "border-pink-500/40",
    href: "/quantum-rf-oswego-il",
  },
  {
    title: "Morpheus8 Burst",
    body: "Fractional RF microneedling that remodels collagen and refines texture with barely any downtime.",
    accent: "from-[#3b82f6] to-[#6366f1]",
    border: "border-blue-500/40",
    href: "/morpheus8-burst-oswego-il",
  },
  {
    title: "Solaria CO₂",
    body: "Ablative CO₂ laser for deeper resurfacing — tone, scars, and true glow restored.",
    accent: "from-[#f59e0b] to-[#f97316]",
    border: "border-amber-500/40",
    href: "/solaria-co2-oswego",
  },
] as const;

const REVIEWS = [
  {
    quote:
      "Finally a med spa that treats you like a patient, not a transaction. My Botox looks completely natural and the team explained every step.",
    name: "Jessica M. · Naperville",
  },
  {
    quote:
      "The Trifecta package took years off my skin. Dani and Ryan actually know the science — you can tell this is a real medical practice.",
    name: "Amanda R. · Oswego",
  },
  {
    quote:
      "Their GLP-1 program came with real medical check-ins the whole way. Worth every mile of the drive from Plainfield.",
    name: "Brittany K. · Plainfield",
  },
] as const;

const FAQS = [
  {
    q: "Is the consultation really free?",
    a: "Yes — consultations with our nurse practitioner are always free, with no obligation to book a treatment.",
  },
  {
    q: "Does Botox hurt?",
    a: "Most clients feel only a tiny pinch. Treatments take about 10 minutes and you can return to your day right after.",
  },
  {
    q: "What makes you different from other Oswego spas?",
    a: "We're a nurse-practitioner-directed medical practice with a full-authority NP on site and device-grade technology — we screen you like a medical practice, because we are one.",
  },
  {
    q: "Do you offer medical weight loss?",
    a: "Yes. Hello Gorgeous RX offers NP-supervised GLP-1 programs (semaglutide & tirzepatide), peptides, and hormone therapy — eligibility is determined at consult.",
  },
  {
    q: "How do I book?",
    a: "Book online at hellogorgeousmedspa.com/book, or call (630) 636-6193. Same-day appointments are often available.",
  },
] as const;

function Accent({ children }: { children: React.ReactNode }) {
  return <span className="text-[#FF2D8E]">{children}</span>;
}

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`text-xs font-bold uppercase tracking-[0.22em] text-[#FF2D8E] ${className}`}
    >
      {children}
    </p>
  );
}

function PrimaryBtn({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#FF2D8E] px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_30px_rgba(255,45,142,0.35)] transition hover:bg-[#E6007E] ${className}`}
    >
      {children}
    </Link>
  );
}

function OutlineBtn({
  href,
  children,
  className = "",
  dark = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-[48px] items-center justify-center rounded-full border-2 px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] transition ${
        dark
          ? "border-white text-white hover:bg-white hover:text-black"
          : "border-black text-black hover:bg-black hover:text-white"
      } ${className}`}
    >
      {children}
    </Link>
  );
}

/**
 * Homepage body from HelloGorgeous-Landing.dc.html design-system template.
 * Site Header/Footer stay in layout; cinematic HeroV3 sits above this.
 */
export function HelloGorgeousLandingPageContent() {
  const memberships = VITAMIN_MEMBERSHIPS.slice(0, 3);

  return (
    <div className="overflow-x-hidden bg-white text-black">
      {/* Intro hero (template) */}
      <section id="top" className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <FadeUp>
            <span className="inline-flex items-center rounded-full bg-[#FFD700] px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">
              Best of Oswego
            </span>
            <Eyebrow className="mt-5">Medical Aesthetics · Oswego, IL</Eyebrow>
            <h1 className="mt-3 font-serif text-[clamp(2.4rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-tight">
              Medical Experts.
              <br />
              <Accent>Real Results.</Accent>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-black/75 md:text-xl">
              {SITE.tagline} Nurse-practitioner-directed injectables, lasers, and wellness — with a
              full-authority NP on site.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryBtn href={PRIMARY_BOOKING_CTA.href}>{PRIMARY_BOOKING_CTA.label}</PrimaryBtn>
              <OutlineBtn href={PHONE_HREF}>Call {PHONE_DISPLAY}</OutlineBtn>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm font-semibold text-black/70">
              <div className="flex items-center gap-2">
                <span className="tracking-widest text-[#FF2D8E]">★★★★★</span>
                <span>
                  {SITE.freshaReviewRating} · {SITE.freshaReviewCount} Fresha reviews
                </span>
              </div>
              <div className="hidden h-5 w-px bg-black/15 sm:block" />
              <span>Same-day appointments</span>
            </div>
          </FadeUp>

          <FadeUp delayMs={80} className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-[8%] z-0 animate-pulse rounded-full bg-[radial-gradient(circle_at_60%_40%,rgba(255,45,142,0.35),transparent_62%)] blur-2xl"
            />
            <div className="relative z-[1] aspect-[4/3] overflow-hidden rounded-3xl bg-black shadow-[8px_8px_0_0_rgba(255,45,142,0.35)]">
              <Image
                src="/images/hg-landing/hero-banner.png"
                alt="Hello Gorgeous Med Spa provider team"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 560px"
                priority
              />
            </div>
            <div className="absolute bottom-[-14px] left-[-10px] z-[2] rounded-2xl border-2 border-black bg-white px-5 py-4 shadow-lg">
              <div className="font-serif text-3xl font-bold leading-none text-[#FF2D8E]">
                {SITE.reviewRating}★
              </div>
              <div className="mt-1 text-xs font-semibold">{SITE.reviewCount}+ Google reviews</div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-black px-6 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "#1", l: "Best Med Spa in Oswego" },
            { n: "2,000+", l: "5-star client reviews" },
            { n: "NP", l: "Full-authority provider on site" },
            { n: "$0", l: "Consultations, always free" },
          ].map((s) => (
            <FadeUp key={s.l}>
              <div className="font-serif text-5xl font-bold leading-none text-[#FF2D8E]">{s.n}</div>
              <div className="mt-2 text-sm text-white/70">{s.l}</div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-white px-6 py-20 md:py-24">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <Eyebrow>Treatments</Eyebrow>
          <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight md:text-5xl">
            Everything to help you <Accent>feel gorgeous</Accent>
          </h2>
          <p className="mt-4 text-lg text-black/70">
            Injectables, advanced lasers, skin, and medical wellness — every visit directed by a
            licensed nurse practitioner.
          </p>
        </FadeUp>
        <div className="mx-auto mt-14 grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <FadeUp key={s.title} delayMs={i * 40}>
              <Link
                href={s.href}
                className="flex h-full flex-col rounded-3xl border-4 border-black bg-white p-7 shadow-[8px_8px_0_0_rgba(255,45,142,0.28)] transition hover:-translate-y-0.5"
              >
                {"badge" in s && s.badge ? (
                  <span className="mb-3 inline-flex w-fit rounded-full bg-[#FFF0F7] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#E6007E]">
                    {s.badge}
                  </span>
                ) : null}
                <h3 className="font-serif text-2xl font-bold text-[#FF2D8E]">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-black/70">{s.body}</p>
                <p className="mt-5 font-serif text-3xl font-bold text-[#FF2D8E]">
                  {s.price}
                  <span className="ml-1 text-sm font-sans font-semibold text-black/55">{s.unit}</span>
                </p>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Trifecta */}
      <section id="tech" className="bg-[#18181b] px-6 py-20 text-white md:py-24">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <Eyebrow className="text-pink-300">Advanced Technology</Eyebrow>
          <h2 className="mt-3 bg-gradient-to-r from-pink-400 via-sky-400 to-amber-400 bg-clip-text font-serif text-4xl font-bold text-transparent md:text-5xl">
            The Trifecta
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Three device-grade platforms — used together for skin that looks lifted, smooth, and
            real.
          </p>
        </FadeUp>
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
          {TRIFECTA.map((t, i) => (
            <FadeUp key={t.title} delayMs={i * 50}>
              <Link
                href={t.href}
                className={`block h-full rounded-[22px] border bg-zinc-900/80 p-8 ${t.border} transition hover:bg-zinc-900`}
              >
                <div className={`mb-5 h-13 w-13 rounded-[14px] bg-gradient-to-br ${t.accent}`} style={{ width: 52, height: 52 }} />
                <h3 className="text-xl font-bold text-white">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{t.body}</p>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Memberships — real Vitamin Bar plans */}
      <section id="membership" className="bg-[#FFF5F9] px-6 py-20 md:py-24">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <Eyebrow>Memberships</Eyebrow>
          <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight md:text-5xl">
            Look gorgeous for <Accent>less, every month</Accent>
          </h2>
          <p className="mt-4 text-lg text-black/70">
            Vitamin Bar memberships with monthly shots and member pricing. Cancel anytime.
          </p>
        </FadeUp>
        <div className="mx-auto mt-14 grid max-w-6xl items-stretch gap-6 md:grid-cols-3">
          {memberships.map((m, i) => {
            const featured = Boolean(m.highlight);
            return (
              <FadeUp key={m.id} delayMs={i * 40}>
                <div
                  className={`flex h-full flex-col rounded-3xl border-4 p-7 ${
                    featured
                      ? "-translate-y-1 border-[#FF2D8E] bg-black text-white shadow-[8px_8px_0_0_rgba(255,45,142,0.4)]"
                      : "border-black bg-white shadow-[8px_8px_0_0_rgba(255,45,142,0.22)]"
                  }`}
                >
                  {featured ? (
                    <span className="mb-3 inline-flex w-fit rounded-full bg-[#FFD700] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-black">
                      Most Popular
                    </span>
                  ) : null}
                  <h3 className={`font-serif text-2xl font-bold ${featured ? "text-white" : ""}`}>
                    {m.name}
                  </h3>
                  <p
                    className={`mt-2 font-serif text-4xl font-bold ${
                      featured ? "text-[#FF2D8E]" : "text-black"
                    }`}
                  >
                    ${m.pricePerMonth}
                    <span
                      className={`ml-1 text-sm font-sans font-normal ${
                        featured ? "text-white/60" : "text-black/55"
                      }`}
                    >
                      /mo
                    </span>
                  </p>
                  <ul
                    className={`mt-5 flex-1 space-y-2 text-sm leading-relaxed ${
                      featured ? "text-white/80" : "text-black/75"
                    }`}
                  >
                    {m.perks.map((p) => (
                      <li key={p}>✓ {p}</li>
                    ))}
                  </ul>
                  <Link
                    href={m.squarePayUrl || "/monthly-memberships"}
                    className={`mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] transition ${
                      featured
                        ? "bg-[#FF2D8E] text-white hover:bg-[#E6007E]"
                        : "border-2 border-black text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    Choose {m.name.replace(/^The /, "")}
                  </Link>
                </div>
              </FadeUp>
            );
          })}
        </div>
        <FadeUp className="mt-8 text-center">
          <Link href="/monthly-memberships" className="text-sm font-bold text-[#E6007E] underline">
            See all memberships →
          </Link>
        </FadeUp>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-white px-6 py-20 md:py-24">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <Eyebrow>Reviews</Eyebrow>
          <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight md:text-5xl">
            Oswego <Accent>loves it here</Accent>
          </h2>
        </FadeUp>
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <FadeUp key={r.name} delayMs={i * 40}>
              <blockquote className="h-full rounded-3xl border border-black/10 bg-[#FFF5F9] p-7">
                <div className="tracking-widest text-[#FF2D8E]">★★★★★</div>
                <p className="mt-4 text-base leading-relaxed text-black/80">&ldquo;{r.quote}&rdquo;</p>
                <footer className="mt-5 text-sm font-bold">{r.name}</footer>
              </blockquote>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Providers */}
      <section className="bg-black px-6 py-20 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeUp>
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-[8px_8px_0_0_rgba(255,45,142,0.35)]">
              <Image
                src="/images/hg-landing/founders.jpg"
                alt="Dani and Ryan, Hello Gorgeous providers"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 640px"
              />
            </div>
          </FadeUp>
          <FadeUp delayMs={60}>
            <Eyebrow>Meet Your Team</Eyebrow>
            <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight md:text-5xl">
              Dani &amp; Ryan, <Accent>on site weekly</Accent>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              A female + male nurse-practitioner team who personally direct every plan. You&apos;re
              screened, consented, and treated by licensed medical providers — not a technician.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {["Full-authority NP", "Licensed & insured", "Free medical screening"].map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-black"
                >
                  {b}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <PrimaryBtn href={PRIMARY_BOOKING_CTA.href}>Meet Us — Book a Consult</PrimaryBtn>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white px-6 py-20 md:py-24">
        <FadeUp className="mx-auto mb-10 max-w-3xl text-center">
          <Eyebrow>Common Questions</Eyebrow>
          <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight md:text-5xl">
            Good to <Accent>know</Accent>
          </h2>
        </FadeUp>
        <div className="mx-auto max-w-3xl divide-y divide-black/10 border-y border-black/10">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl font-semibold text-black marker:content-none [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-2xl text-[#FF2D8E] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-black/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section id="book" className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] px-6 py-20 text-center text-white md:py-24">
        <FadeUp className="mx-auto max-w-3xl">
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold">
            Ready to feel gorgeous?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Book your free consultation — same-day appointments often available in Oswego, IL.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={PRIMARY_BOOKING_CTA.href}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold uppercase tracking-[0.12em] text-black transition hover:bg-black hover:text-white"
            >
              {PRIMARY_BOOKING_CTA.label}
            </Link>
            <Link
              href={PHONE_HREF}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black bg-black px-8 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white"
            >
              Call {PHONE_DISPLAY}
            </Link>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
