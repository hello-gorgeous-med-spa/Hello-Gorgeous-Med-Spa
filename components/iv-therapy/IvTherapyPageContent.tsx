"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  IV_ADDON_LIST,
  IV_BAG_BASES,
  IV_BENEFITS,
  IV_BLOG_POSTS,
  IV_CAUTION_ITEMS,
  IV_EDU_BEAUTY,
  IV_EDU_DRIP,
  IV_EDU_HYDRATION,
  IV_EDU_NAD,
  IV_EDU_POWER,
  IV_EDU_PUSH,
  IV_EDU_SIGNS,
  IV_FAQS,
  IV_GROUP_PERKS,
  IV_INNER_BEAUTY,
  IV_MEDICAL_RELIEF,
  IV_MOBILE_WAITLIST,
  IV_NEW_CLIENT_OFFER,
  IV_RX_ADDONS,
  IV_SCREEN_ITEMS,
  IV_SPECIALTY_DRIPS,
  IV_STATS,
  IV_TESTIMONIALS,
  IV_THERAPY_GOALS,
  IV_THERAPY_MARKETING,
  IV_THERAPY_JUMP_NAV,
  IV_VITAMIN_DRIPS,
  IV_VITAMIN_SHOTS,
  buildIvBagSquareNote,
  squareIvBookUrl,
} from "@/lib/iv-therapy-marketing";
import { SITE } from "@/lib/seo";

function PinkPill({
  href,
  children,
  className = "",
  variant = "gradient",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "gradient" | "dark" | "outline" | "outlineDark";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-bold transition hover:-translate-y-0.5";
  const variants = {
    gradient:
      "bg-gradient-to-br from-[#FF3D9A] to-[#E6007E] text-white shadow-[0_12px_30px_rgba(255,45,142,0.4)]",
    dark: "bg-[#111] text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)] hover:bg-white hover:text-[#E6007E]",
    outline: "border-2 border-[#FF2D8E] bg-white text-[#E6007E] hover:bg-[#FF2D8E] hover:text-white",
    outlineDark:
      "border-2 border-white/40 bg-transparent text-white hover:border-[#FF2D8E]",
  };
  const cls = `${base} ${variants[variant]} ${className}`;
  const external = href.startsWith("http") || href.startsWith("tel:");
  if (external) {
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

function PulseDot() {
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full bg-[#FF2D8E]"
      style={{ animation: "ivpulse 2.4s ease-in-out infinite" }}
      aria-hidden
    />
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3.5 inline-flex items-center gap-2.5">
      <PulseDot />
      <span className="text-[13px] font-bold tracking-[0.28em] text-[#FF2D8E]">{children}</span>
    </div>
  );
}

export function IvTherapyPageContent() {
  const {
    images,
    bagBookHref,
    squareBookHref,
    vitaminShotBookHref,
    phoneHref,
    phoneDisplay,
    phoneDisplayShort,
    olympiaBlog,
  } = IV_THERAPY_MARKETING;
  /** Default IV CTAs → Square Appointments (IV services) */
  const bookHref = bagBookHref;
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<Record<string, boolean>>({});
  const [baseIdx, setBaseIdx] = useState(0);
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [bagCopied, setBagCopied] = useState(false);

  const base = IV_BAG_BASES[baseIdx] ?? IV_BAG_BASES[0];
  const selectedAddons = IV_ADDON_LIST.filter((a) => addons[a.name]);
  const bagTotal = base.price + selectedAddons.reduce((t, a) => t + a.price, 0);
  const boosts = IV_ADDON_LIST.filter((a) => !a.rx);
  const rxBoosts = IV_ADDON_LIST.filter((a) => a.rx);

  const toggleGoal = (label: string) =>
    setSelectedGoals((s) => ({ ...s, [label]: !s[label] }));
  const toggleAddon = (name: string) =>
    setAddons((s) => ({ ...s, [name]: !s[name] }));

  const bookMyBag = async () => {
    const note = buildIvBagSquareNote(
      base.name,
      selectedAddons.map((a) => a.name),
      bagTotal,
    );
    try {
      await navigator.clipboard.writeText(note);
      setBagCopied(true);
      window.setTimeout(() => setBagCopied(false), 4000);
    } catch {
      // Clipboard may be blocked — still open Square booking
    }
    window.open(bagBookHref, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white text-[#111] antialiased" style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}>
      <style jsx global>{`
        @keyframes ivpulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.35;
          }
        }
      `}</style>

      {/* Sticky nav — matches Design Canvas */}
      <nav className="sticky top-0 z-40 border-b border-black/8 bg-white/92 backdrop-blur-[10px]">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-6 py-4">
          <a href="#top" className="flex shrink-0 flex-col leading-none text-[#111]">
            <span className="font-serif text-2xl font-extrabold tracking-tight">Hello Gorgeous</span>
            <span className="mt-0.5 text-[10px] font-bold tracking-[0.32em] text-[#FF2D8E]">MED SPA</span>
          </a>
          <div className="hidden items-center gap-7 text-[15px] font-medium md:flex">
            {IV_THERAPY_JUMP_NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-[#111] hover:text-[#E6007E]">
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={phoneHref} className="hidden text-sm font-semibold text-[#111] sm:inline">
              {phoneDisplay}
            </a>
            <PinkPill href={bookHref} className="!px-5 !py-3 !text-sm">
              Book a Drip ›
            </PinkPill>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto border-t border-black/5 px-4 py-2 md:hidden">
          {IV_THERAPY_JUMP_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-black/10 bg-rose-50/80 px-3 py-1 text-xs font-bold"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div id="top" className="mx-auto max-w-[1240px] px-6">
        <nav className="flex flex-wrap items-center gap-2.5 px-1 pb-1.5 pt-5 text-sm font-medium text-black/55" aria-label="Breadcrumb">
          <Link href="/" className="text-black/55 hover:text-[#E6007E]">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span>Wellness</span>
          <span aria-hidden>›</span>
          <span className="font-semibold text-[#FF2D8E]">IV Therapy</span>
        </nav>

        {/* Hero */}
        <section className="grid items-stretch gap-7 py-3.5 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative min-h-[420px] overflow-hidden rounded-[26px] bg-[#f3eef0] lg:min-h-[560px]">
            <Image
              src={images.hero}
              alt="IV therapy infusion bag at Hello Gorgeous Med Spa"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 640px"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg,rgba(0,0,0,.86) 0%,rgba(0,0,0,.16) 46%,rgba(0,0,0,0) 78%)",
              }}
              aria-hidden
            />
            <div className="absolute bottom-0 left-0 max-w-[80%] p-8 md:p-11">
              <span className="mb-5 inline-block rounded-full bg-[#FF2D8E]/85 px-3.5 py-1.5 text-xs font-bold tracking-[0.24em] text-white">
                IV &amp; VITAMIN BAR
              </span>
              <h1 className="font-serif text-4xl font-extrabold leading-[1.02] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,.3)] sm:text-5xl lg:text-[58px]">
                IV Therapy
              </h1>
              <p className="mt-4 text-base font-medium leading-relaxed text-white [text-shadow:0_1px_12px_rgba(0,0,0,.4)] sm:text-lg lg:text-[19px]">
                Hydration and nutrients delivered straight to your bloodstream — 100% absorption, medically
                supervised, in about 45 minutes.
              </p>
              <div className="mt-6">
                <PinkPill href={bookHref} className="!px-8 !py-4 !text-[17px]">
                  Book your drip ›
                </PinkPill>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-[26px] border border-black/12 p-8 shadow-[0_8px_34px_rgba(0,0,0,0.06)] sm:p-9">
            <h2 className="font-serif text-2xl font-bold leading-tight tracking-tight sm:text-[30px]">
              What do you want to feel?
            </h2>
            <p className="mt-2 text-[15px] text-black/60">Tap your goals — our NP will build the right drip for you.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {IV_THERAPY_GOALS.map((goal) => {
                const on = !!selectedGoals[goal];
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`rounded-[14px] border-[1.5px] px-3.5 py-3.5 text-left text-sm font-semibold transition ${
                      on
                        ? "border-[#FF2D8E] bg-[#FF2D8E] text-white"
                        : "border-black/14 bg-white text-[#111] hover:border-[#FF2D8E]"
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap gap-4 border-t border-black/8 pt-4 text-[13px] font-semibold text-black/60">
              <span>💧 100% absorption</span>
              <span>⏱ ~45 min</span>
              <span>🩺 NP-supervised</span>
            </div>
            <PinkPill href={bookHref} variant="outline" className="mt-5 w-full !py-3.5 !text-base">
              Book my drip ›
            </PinkPill>
          </div>
        </section>
      </div>

      {/* New client offer — pink band */}
      <section className="mx-auto mt-11 max-w-[1240px] px-6">
        <div className="relative flex flex-wrap items-center justify-between gap-7 overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF3D9A] to-[#E6007E] px-8 py-9 shadow-[0_16px_40px_rgba(255,45,142,0.32)] lg:px-10">
          <div
            className="pointer-events-none absolute -right-10 -top-20 h-[280px] w-[280px] rounded-full bg-white/12"
            aria-hidden
          />
          <div className="relative min-w-[280px] flex-1">
            <span className="mb-3.5 inline-block rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold tracking-[0.2em] text-[#E6007E]">
              {IV_NEW_CLIENT_OFFER.badge}
            </span>
            <h2 className="font-serif text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-[38px]">
              {IV_NEW_CLIENT_OFFER.titleBefore}
              <span className="italic">{IV_NEW_CLIENT_OFFER.titleAccent}</span>
            </h2>
            <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-white/90">{IV_NEW_CLIENT_OFFER.body}</p>
          </div>
          <PinkPill href={IV_NEW_CLIENT_OFFER.href} variant="dark" className="relative !px-9 !py-4 !text-[17px]">
            {IV_NEW_CLIENT_OFFER.ctaLabel}
          </PinkPill>
        </div>
      </section>

      {/* Stat strip */}
      <section className="mt-[70px] bg-[#111] px-6 py-11">
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-6 text-center sm:grid-cols-4">
          {IV_STATS.map((s) => (
            <div key={s.label}>
              <p className="font-serif text-3xl font-bold leading-none text-[#FF2D8E] sm:text-[38px]">{s.value}</p>
              <p className="mt-2 text-sm text-white/88">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Drip menu */}
      <section id="menu" className="scroll-mt-24 px-6 pb-5 pt-[90px]">
        <div className="mx-auto max-w-[1240px] text-center">
          <SectionEyebrow>OLYMPIA INFUSION KITS</SectionEyebrow>
          <h2 className="font-serif text-4xl font-bold tracking-tight sm:text-[50px]">
            The <span className="italic text-[#FF2D8E]">Drip Menu</span>
          </h2>
          <p className="mx-auto mt-3.5 max-w-[680px] text-lg leading-relaxed text-black/60 sm:text-[19px]">
            Premium-quality compounds, each formulated for a goal. Every drip is reviewed by our medical team before
            your appointment.
          </p>
        </div>

        <div className="mx-auto mb-5 mt-11 flex max-w-[1240px] items-center gap-4">
          <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-2xl shadow-[0_8px_22px_rgba(255,45,142,0.2)]">
            <Image src={images.drip} alt="" fill className="object-cover" sizes="60px" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold tracking-tight sm:text-[30px]">
              Vitamin <span className="italic text-[#FF2D8E]">IV Therapy</span>
            </h3>
            <p className="mt-0.5 text-[15px] text-black/55">Wellness drips for hydration, energy, immunity &amp; glow.</p>
          </div>
          <div
            className="ml-2 hidden h-0.5 flex-1 sm:block"
            style={{ background: "linear-gradient(90deg,rgba(255,45,142,.35),transparent)" }}
            aria-hidden
          />
        </div>

        <div className="mx-auto mb-[60px] grid max-w-[1240px] gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {IV_VITAMIN_DRIPS.map((drip) => (
            <article
              key={drip.id}
              className="group flex flex-col overflow-hidden rounded-[22px] border-2 border-black bg-white shadow-[8px_10px_0_rgba(255,45,142,0.22)] transition hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[12px_14px_0_rgba(255,45,142,0.36)]"
            >
              <div className="relative h-[170px] overflow-hidden" style={{ background: drip.bg }}>
                <Image
                  src={drip.image}
                  alt={drip.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1280px) 50vw, 380px"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(180deg,rgba(0,0,0,0) 38%,rgba(0,0,0,.86))" }}
                  aria-hidden
                />
                <span className="absolute right-3.5 top-3.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-extrabold text-[#111] shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
                  {drip.price}
                </span>
                <div className="absolute bottom-3.5 left-[18px] right-[18px]">
                  <p className="font-serif text-[26px] font-extrabold leading-none text-white [text-shadow:0_2px_12px_rgba(0,0,0,.78)]">
                    {drip.name}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-white/85 [text-shadow:0_1px_8px_rgba(0,0,0,.82)]">
                    {drip.kit}
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-[#FF2D8E]">{drip.tag}</p>
                <p className="mb-4 text-[15px] leading-relaxed text-black/70">{drip.description}</p>
                <p className="mb-2 text-xs font-bold tracking-[0.1em] text-black/60">INFUSION KIT CONTAINS</p>
                <ul className="mb-5 flex flex-1 list-disc flex-col gap-1.5 pl-[18px]">
                  {drip.contains.map((c) => (
                    <li key={c} className="text-sm leading-snug text-black/65">
                      {c}
                    </li>
                  ))}
                </ul>
                <PinkPill href={squareIvBookUrl(drip.squareVariationId)} className="w-full !py-3 !text-[15px]">
                  Book this drip ›
                </PinkPill>
              </div>
            </article>
          ))}
        </div>

        {/* Specialty */}
        <div className="mx-auto mb-5 flex max-w-[1240px] items-center gap-4">
          <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-2xl shadow-[0_8px_22px_rgba(0,0,0,0.25)]">
            <Image src={images.aging} alt="" fill className="object-cover" sizes="60px" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold tracking-tight sm:text-[30px]">
              Specialty <span className="italic text-[#FF2D8E]">IV Treatments</span>
            </h3>
            <p className="mt-0.5 text-[15px] text-black/55">Advanced, NP-screened infusions for longevity &amp; recovery.</p>
          </div>
          <div
            className="ml-2 hidden h-0.5 flex-1 sm:block"
            style={{ background: "linear-gradient(90deg,rgba(255,45,142,.35),transparent)" }}
            aria-hidden
          />
        </div>
        <div className="mx-auto grid max-w-[1240px] gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {IV_SPECIALTY_DRIPS.map((drip) => (
            <article
              key={drip.id}
              className="group flex flex-col overflow-hidden rounded-[22px] border-2 border-black bg-[#111] shadow-[8px_10px_0_rgba(255,45,142,0.22)] transition hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[12px_14px_0_rgba(255,45,142,0.42)]"
            >
              <div className="relative h-[170px] overflow-hidden" style={{ background: drip.bg }}>
                {drip.image ? (
                  <Image
                    src={drip.image}
                    alt={drip.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 1280px) 50vw, 380px"
                  />
                ) : null}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(180deg,rgba(0,0,0,0) 34%,rgba(0,0,0,.78))" }}
                  aria-hidden
                />
                <span className="absolute left-3.5 top-3.5 rounded-full bg-[#FF2D8E]/92 px-2.5 py-1.5 text-[10px] font-bold tracking-[0.12em] text-white">
                  NP-SCREENED
                </span>
                <span className="absolute right-3.5 top-3.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-extrabold text-[#111] shadow-md">
                  {drip.price}
                </span>
                <p className="absolute bottom-3.5 left-[18px] right-[18px] font-serif text-[26px] font-extrabold leading-none text-white [text-shadow:0_2px_12px_rgba(0,0,0,.78)]">
                  {drip.name}
                </p>
              </div>
              <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-[#FF2D8E]">{drip.tag}</p>
                <p className="mb-4 text-[15px] leading-relaxed text-white/78">{drip.description}</p>
                <p className="mb-2 text-xs font-bold tracking-[0.1em] text-white/40">INFUSION INCLUDES</p>
                <ul className="mb-5 flex flex-1 list-disc flex-col gap-1.5 pl-[18px]">
                  {drip.contains.map((c) => (
                    <li key={c} className="text-sm leading-snug text-white/82">
                      {c}
                    </li>
                  ))}
                </ul>
                <PinkPill
                  href={drip.squareVariationId ? squareIvBookUrl(drip.squareVariationId) : squareBookHref}
                  className="w-full !py-3 !text-[15px]"
                >
                  Book a consult ›
                </PinkPill>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Inner Beauty feature */}
      <section className="mx-auto mt-[74px] max-w-[1180px] px-6">
        <div className="grid overflow-hidden rounded-[26px] border-2 border-[#FF2D8E] shadow-[0_16px_46px_rgba(255,45,142,0.16)] lg:grid-cols-[1fr_1.1fr]">
          <div className="relative min-h-[320px] bg-[#f0ebe8] lg:min-h-[420px]">
            <Image
              src={IV_INNER_BEAUTY.image}
              alt="Inner Beauty IV drip"
              fill
              className="object-cover object-center transition duration-500 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center bg-gradient-to-b from-[#FFF5F9] to-white p-8 lg:p-12">
            <span className="mb-4 inline-block self-start rounded-full bg-[#FF2D8E] px-3.5 py-1.5 text-[11px] font-bold tracking-[0.2em] text-white">
              {IV_INNER_BEAUTY.badge}
            </span>
            <h3 className="font-serif text-4xl font-extrabold leading-none tracking-tight">{IV_INNER_BEAUTY.name}</h3>
            <p className="mt-2 font-serif text-5xl font-extrabold text-[#FF2D8E]">{IV_INNER_BEAUTY.price}</p>
            <p className="mt-4 text-[17px] leading-relaxed text-black/65">{IV_INNER_BEAUTY.description}</p>
            <p className="mb-2.5 mt-5 text-xs font-bold tracking-[0.12em] text-black/60">WHAT&apos;S IN IT</p>
            <ul className="mb-6 flex list-disc flex-col gap-2.5 pl-5">
              {IV_INNER_BEAUTY.ingredients.map((ing) => (
                <li key={ing.name} className="text-[15px] leading-relaxed text-black/70">
                  <strong>{ing.name}</strong> — {ing.blurb}
                </li>
              ))}
            </ul>
            <PinkPill href={IV_INNER_BEAUTY.bookHref} className="self-start !px-8 !py-3.5">
              {IV_INNER_BEAUTY.ctaLabel}
            </PinkPill>
          </div>
        </div>
      </section>

      {/* Medical relief */}
      <section id="medical" className="scroll-mt-24 mt-[84px] bg-[#111] px-6 py-[88px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <SectionEyebrow>NP ON SITE · PRESCRIPTION-STRENGTH</SectionEyebrow>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-[50px]">
              Medical <span className="italic text-[#FF2D8E]">Relief Drips</span>
            </h2>
            <p className="mx-auto mt-3.5 max-w-[720px] text-lg leading-relaxed text-white/88 sm:text-[19px]">
              Feeling awful? Because we have a nurse practitioner on site, we can add prescription medication — like
              anti-nausea and anti-inflammatory — to get you feeling human again. Reviewed and administered by our
              medical team, when clinically appropriate.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {IV_MEDICAL_RELIEF.map((m) => (
              <article
                key={m.name}
                className="flex flex-col rounded-[20px] border border-white/16 bg-white/[0.04] px-6 py-7 transition hover:border-[#FF2D8E] hover:bg-[#FF2D8E]/8"
              >
                <p className="mb-2.5 text-[11px] font-bold tracking-[0.14em] text-[#FF2D8E]">{m.tag}</p>
                <h3 className="mb-3 font-serif text-[26px] font-bold leading-tight text-white">{m.name}</h3>
                <p className="mb-4 flex-1 text-[15px] leading-relaxed text-white/88">{m.desc}</p>
                <p className="mb-2 text-[11px] font-bold tracking-[0.1em] text-white/40">MAY INCLUDE</p>
                <ul className="flex list-disc flex-col gap-1.5 pl-[18px]">
                  {m.contains.map((c) => (
                    <li key={c} className="text-sm leading-snug text-white/85">
                      {c}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap items-center justify-between gap-6 rounded-[20px] border border-white/16 px-8 py-7">
            <div className="min-w-[260px] flex-1">
              <h3 className="mb-3 font-serif text-2xl font-bold text-white">Prescription add-ons to any drip</h3>
              <div className="flex flex-wrap gap-2.5">
                {IV_RX_ADDONS.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border-[1.5px] border-[#FF2D8E]/50 px-3.5 py-2 text-[13px] font-semibold text-white"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <PinkPill href={bookHref} className="!px-8 !py-4">
              Book a relief drip ›
            </PinkPill>
          </div>
          <p className="mx-auto mt-6 max-w-[640px] text-center text-[13px] text-white/40">
            Prescription medications are administered only after evaluation by our nurse practitioner and when clinically
            appropriate. Not a substitute for emergency care.
          </p>
        </div>
      </section>

      {/* Add-ons */}
      <section className="px-6 pb-5 pt-[90px]">
        <div className="mx-auto max-w-[1240px] text-center">
          <SectionEyebrow>SUPERCHARGE YOUR DRIP</SectionEyebrow>
          <h2 className="font-serif text-4xl font-bold tracking-tight sm:text-[50px]">
            Add-ons <span className="italic text-[#FF2D8E]">from $25</span>
          </h2>
          <p className="mx-auto mt-3.5 mb-10 max-w-[640px] text-lg leading-relaxed text-black/60 sm:text-[19px]">
            Boost any drip with an extra push of what your body needs. Prescription add-ons are screened by our NP.
          </p>
        </div>
        <div className="mx-auto grid max-w-[1160px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {IV_ADDON_LIST.map((a) => (
            <div
              key={a.name}
              className="flex items-center justify-between gap-3 rounded-2xl border-[1.5px] border-black/12 px-5 py-5 transition hover:border-[#FF2D8E]"
            >
              <div>
                <p className="text-base font-bold text-[#111]">{a.name}</p>
                <p className="mt-0.5 text-[13px] text-black/55">{a.note}</p>
              </div>
              {a.rx ? (
                <span className="shrink-0 rounded-full bg-[#111] px-2.5 py-1 text-[10px] font-bold tracking-wider text-white">
                  RX · NP
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* Build your own bag */}
      <section className="px-6 pb-5 pt-[70px]">
        <div className="mx-auto max-w-[1240px] overflow-hidden rounded-[26px] border-2 border-black shadow-[10px_12px_0_rgba(255,45,142,0.22)]">
          <div className="bg-[#111] px-8 py-8 text-center text-white">
            <p className="mb-2 text-xs font-bold tracking-[0.24em] text-[#FF2D8E]">INTERACTIVE</p>
            <h2 className="font-serif text-3xl font-extrabold leading-none sm:text-[40px]">
              Build Your Own <span className="italic text-[#FF2D8E]">Bag</span>
            </h2>
            <p className="mt-2.5 text-base text-white/86">
              Pick a base drip, stack your boosts, and see your estimate. Final plan confirmed by our NP.
            </p>
          </div>
          <div className="grid lg:grid-cols-4">
            <div className="border-b border-black/10 p-8 lg:border-b-0 lg:border-r">
              <p className="mb-4 text-xs font-bold tracking-[0.14em] text-black/60">1 · CHOOSE YOUR BASE</p>
              <div className="flex flex-col gap-2.5">
                {IV_BAG_BASES.map((b, i) => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => setBaseIdx(i)}
                    className={`flex items-center justify-between gap-2.5 rounded-xl border-[1.5px] px-3.5 py-3 text-left text-[15px] font-semibold transition ${
                      baseIdx === i
                        ? "border-[#FF2D8E] bg-[#FF2D8E] text-white"
                        : "border-black/14 bg-white text-[#111] hover:border-[#FF2D8E]"
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="font-extrabold">${b.price}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="border-b border-black/10 p-8 lg:border-b-0 lg:border-r">
              <p className="mb-4 text-xs font-bold tracking-[0.14em] text-black/60">2 · STACK YOUR BOOSTS · $25 EACH</p>
              <div className="flex flex-col gap-2.5">
                {boosts.map((a) => (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => toggleAddon(a.name)}
                    className={`flex items-center justify-between gap-2.5 rounded-xl border-[1.5px] px-3.5 py-3 text-left text-[15px] font-semibold transition ${
                      addons[a.name]
                        ? "border-[#FF2D8E] bg-[#FF2D8E] text-white"
                        : "border-black/14 bg-white text-[#111] hover:border-[#FF2D8E]"
                    }`}
                  >
                    <span>{a.name}</span>
                    <span className="font-extrabold">${a.price}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="border-b border-black/10 p-8 lg:border-b-0 lg:border-r">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold tracking-[0.14em] text-black/60">3 · PRESCRIPTION · $30 EACH</span>
                <span className="rounded-full bg-[#111] px-2 py-1 text-[9px] font-bold tracking-wider text-white">
                  NP
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {rxBoosts.map((a) => (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => toggleAddon(a.name)}
                    className={`rounded-xl border-[1.5px] px-3.5 py-3 text-left text-[15px] font-semibold transition ${
                      addons[a.name]
                        ? "border-[#FF2D8E] bg-[#FF2D8E] text-white"
                        : "border-black/14 bg-white text-[#111] hover:border-[#FF2D8E]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2.5">
                      <span>{a.name}</span>
                      <span className="font-extrabold">${a.price}</span>
                    </div>
                    <p className={`mt-0.5 text-xs font-medium ${addons[a.name] ? "text-white/70" : "text-black/55"}`}>
                      {a.note}
                    </p>
                  </button>
                ))}
              </div>
              <p className="mt-3.5 text-[11px] leading-snug text-black/60">
                Rx add-ons require NP evaluation and are given only when clinically appropriate.
              </p>
            </div>
            <div className="flex flex-col bg-[#FFF5F9] p-8">
              <p className="mb-4 text-xs font-bold tracking-[0.14em] text-black/60">4 · YOUR BAG</p>
              <div className="flex flex-1 flex-col rounded-2xl border border-black/10 bg-white p-6">
                <p className="text-[13px] text-black/65">Base drip</p>
                <p className="mb-3.5 font-serif text-2xl font-bold">{base.name}</p>
                <p className="text-[13px] text-black/65">Boosts added</p>
                <p className="mb-4 font-serif text-2xl font-bold">{selectedAddons.length}</p>
                <div className="mt-auto flex items-baseline justify-between border-t border-black/12 pt-4">
                  <span className="text-sm font-semibold text-black/60">Estimated total</span>
                  <span className="font-serif text-[34px] font-extrabold text-[#FF2D8E]">${bagTotal}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void bookMyBag()}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#FF3D9A] to-[#E6007E] px-7 py-3.5 text-base font-bold text-white shadow-[0_12px_30px_rgba(255,45,142,0.4)] transition hover:-translate-y-0.5"
              >
                Book my bag ›
              </button>
              <p className="mt-3 text-center text-xs text-black/55">
                {bagCopied
                  ? "Bag summary copied — paste into Square booking notes if prompted."
                  : "Opens Square Appointments checkout for Build Your Own Bag. Estimate only — NP confirms."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vitamin shots */}
      <section id="shots" className="scroll-mt-24 px-6 pb-5 pt-[90px]">
        <div className="mx-auto max-w-[1000px] text-center">
          <h2 className="font-serif text-4xl font-bold tracking-tight sm:text-[46px]">
            Quick <span className="italic text-[#FF2D8E]">Vitamin Shots</span>
          </h2>
          <p className="mx-auto mt-3.5 max-w-[620px] text-lg text-black/60">
            Short on time? Grab a fast intramuscular boost — in and out in minutes.
          </p>
          <div className="mb-10 mt-3 inline-flex items-center gap-2 rounded-full bg-[#111] px-5 py-2 text-[15px] font-bold text-white">
            Every shot <span className="text-[#FF2D8E]">$25</span>
          </div>
        </div>
        <div className="mx-auto grid max-w-[1160px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {IV_VITAMIN_SHOTS.map((s) => (
            <article
              key={s.name}
              className="flex flex-col rounded-[20px] border-2 border-black bg-white p-6 shadow-[6px_8px_0_rgba(255,45,142,0.16)] transition hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[10px_12px_0_rgba(255,45,142,0.3)]"
            >
              <div className="mb-4 flex items-start gap-3.5">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br from-[#FFE3F0] to-[#FFD0E6] font-serif text-lg font-extrabold text-[#E6007E]">
                  {s.image ? (
                    <Image src={s.image} alt={s.name} fill className="object-contain bg-white" sizes="56px" />
                  ) : (
                    s.initial
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-[22px] font-bold leading-tight">{s.name}</h3>
                  <p className="mt-1 text-[13px] text-black/55">{s.sub}</p>
                </div>
              </div>
              <ul className="mb-4 flex flex-1 list-disc flex-col gap-1.5 pl-[18px]">
                {s.benefits.map((b) => (
                  <li key={b} className="text-sm leading-snug text-black/65">
                    {b}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between gap-3 border-t border-black/10 pt-3">
                <p className="text-xs font-bold tracking-wider text-[#FF2D8E]">
                  BEST FOR · <span className="text-black/65">{s.bestFor}</span>
                </p>
                <span className="shrink-0 rounded-full bg-gradient-to-br from-[#FF3D9A] to-[#E6007E] px-3 py-1 text-[15px] font-extrabold text-white shadow-[0_6px_16px_rgba(255,45,142,0.3)]">
                  $25
                </span>
              </div>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-6 max-w-[1160px] text-center">
          <PinkPill href={vitaminShotBookHref} variant="dark" className="!px-9 !py-3.5">
            Book a vitamin shot ›
          </PinkPill>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="scroll-mt-24 px-6 pb-5 pt-[90px]">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl bg-[#eef1f4] lg:min-h-[480px]">
            <Image src={images.drip} alt="Why IV therapy absorption matters" fill className="object-cover" sizes="560px" />
          </div>
          <div>
            <h2 className="mb-5 font-serif text-4xl font-bold tracking-tight sm:text-[44px]">
              Why <span className="italic text-[#FF2D8E]">IV</span> beats a pill
            </h2>
            <p className="mb-5 text-lg leading-relaxed text-black/70">{IV_BENEFITS.body}</p>
            <ul className="mb-6 flex list-disc flex-col gap-2.5 pl-[22px]">
              {IV_BENEFITS.bullets.map((b) => (
                <li key={b} className="text-[17px] leading-relaxed text-black/70">
                  {b}
                </li>
              ))}
            </ul>
            <p className="text-[15px] leading-relaxed text-black/60">{IV_BENEFITS.closing}</p>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="px-6 pb-5 pt-[90px]">
        <div className="mx-auto max-w-[1240px] text-center">
          <SectionEyebrow>THE SCIENCE, MADE SIMPLE</SectionEyebrow>
          <h2 className="font-serif text-4xl font-bold tracking-tight sm:text-[50px]">
            IV Therapy, <span className="italic text-[#FF2D8E]">explained</span>
          </h2>
          <p className="mx-auto mt-3.5 mb-11 max-w-[680px] text-lg leading-relaxed text-black/60 sm:text-[19px]">
            A quick, honest look at what a drip does, how you&apos;ll feel, and why it works.
          </p>
        </div>

        <div className="mx-auto grid max-w-[1240px] gap-5 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-[22px] border-2 border-black p-8 shadow-[8px_10px_0_rgba(255,45,142,0.2)]">
            <h3 className="mb-5 font-serif text-[30px] font-bold italic">Benefits of IV Hydration</h3>
            <div className="flex flex-col gap-4">
              {IV_EDU_HYDRATION.map((b) => (
                <div key={b} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFE3F0] font-extrabold text-[#E6007E]">
                    ✓
                  </div>
                  <p className="text-base font-medium text-black/70">{b}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-[22px] border-2 border-[#FF2D8E] bg-[#111] text-white shadow-[8px_10px_0_rgba(255,45,142,0.28)]">
            <div className="px-8 pb-2 pt-8">
              <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#FF2D8E]">SIGNS YOUR DRIP IS WORKING</p>
              <h3 className="font-serif text-[28px] font-bold leading-tight">
                The glow-up is internal before it&apos;s external.
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3.5 px-8 pb-8 pt-5">
              {IV_EDU_SIGNS.map((s) => (
                <div key={s} className="flex items-center gap-2.5">
                  <span className="text-lg text-[#FF2D8E]">✦</span>
                  <span className="text-[15px] font-medium text-white/90">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-5 flex max-w-[1240px] items-center gap-4 rounded-[18px] border border-dashed border-black/20 bg-[#FFF5F9] px-6 py-5">
          <span className="text-[26px]" aria-hidden>
            🧊
          </span>
          <p className="text-base leading-relaxed text-black/65">
            <strong>Feel a little cool during your drip?</strong> Totally normal — the fluid is slightly cooler than your
            body, and your circulation slows as you relax. Bring cozy socks or a blanket and settle in.
          </p>
        </div>

        <div className="mx-auto mt-5 grid max-w-[1240px] overflow-hidden rounded-[22px] border-2 border-[#FF2D8E] shadow-[8px_10px_0_rgba(255,45,142,0.24)] lg:grid-cols-[1fr_1.5fr]">
          <div className="flex min-h-[280px] flex-col justify-center bg-gradient-to-br from-[#FFF0F6] to-[#FBE9EF] p-9">
            <p className="mb-2.5 text-xs font-bold tracking-[0.2em] text-[#E6007E]">CLIENT FAVORITE</p>
            <h3 className="font-serif text-[38px] font-extrabold leading-tight">
              What&apos;s in a <span className="italic text-[#FF2D8E]">Beauty Drip</span>?
            </h3>
            <p className="mt-4 text-base leading-relaxed text-black/84">
              Five skin-loving ingredients that work from the inside out — because the glow starts within.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4 px-8 py-8">
            {IV_EDU_BEAUTY.map((b) => (
              <div key={b.t} className="flex items-start gap-3.5">
                <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#FF2D8E] text-[15px] font-extrabold text-white">
                  ✦
                </div>
                <p className="text-[15px] leading-relaxed text-black/84">
                  <span className="text-base font-extrabold text-[#111]">{b.t}</span> — {b.d}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-5 overflow-hidden rounded-[22px] border-2 border-black shadow-[8px_10px_0_rgba(255,45,142,0.2)] max-w-[1240px]">
          <div className="px-6 pb-1.5 pt-7 text-center">
            <p className="mb-1.5 text-xs font-bold tracking-[0.2em] text-[#FF2D8E]">WHAT&apos;S THE DIFFERENCE?</p>
            <h3 className="font-serif text-[30px] font-bold">
              IV Push <span className="italic text-black/40">vs.</span> IV Drip
            </h3>
          </div>
          <div className="grid md:grid-cols-2">
            <div className="border-b border-black/10 px-8 py-7 md:border-b-0 md:border-r">
              <span className="mb-4 inline-block rounded-full bg-[#FFE3F0] px-4 py-2 text-[13px] font-extrabold tracking-wider text-[#E6007E]">
                IV PUSH
              </span>
              <ul className="flex list-disc flex-col gap-2.5 pl-5">
                {IV_EDU_PUSH.map((p) => (
                  <li key={p} className="text-[15px] leading-relaxed text-black/70">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#111] px-8 py-7 text-white">
              <span className="mb-4 inline-block rounded-full bg-[#FF2D8E]/90 px-4 py-2 text-[13px] font-extrabold tracking-wider text-white">
                IV DRIP
              </span>
              <ul className="flex list-disc flex-col gap-2.5 pl-5">
                {IV_EDU_DRIP.map((d) => (
                  <li key={d} className="text-[15px] leading-relaxed text-white/88">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-5 grid max-w-[1240px] gap-5 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-[22px] border-2 border-black p-8 shadow-[8px_10px_0_rgba(255,45,142,0.2)]">
            <h3 className="mb-5 font-serif text-[28px] font-bold">
              The Power of <span className="italic text-[#FF2D8E]">IV</span>
            </h3>
            <div className="flex flex-col gap-4">
              {IV_EDU_POWER.map((p) => (
                <div key={p.t} className="border-l-[3px] border-[#FF2D8E] pl-3.5">
                  <p className="text-[15px] font-extrabold tracking-wide text-[#111]">{p.t}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-black/84">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[22px] border-2 border-black p-8 shadow-[8px_10px_0_rgba(255,45,142,0.2)]">
            <div className="mb-5 flex items-baseline gap-2.5">
              <span className="font-serif text-[30px] font-extrabold text-[#FF2D8E]">NAD+</span>
              <span className="font-serif text-[26px] font-bold italic">Benefits</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {IV_EDU_NAD.map((n) => (
                <div key={n.t}>
                  <p className="mb-1 text-[15px] font-extrabold text-[#111]">{n.t}</p>
                  <p className="text-sm leading-relaxed text-black/84">{n.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#FFF5F9] px-6 py-[90px]">
        <div className="mx-auto max-w-[1240px] text-center">
          <SectionEyebrow>LOVED IN OSWEGO</SectionEyebrow>
          <h2 className="font-serif text-4xl font-bold tracking-tight sm:text-[50px]">
            What our clients <span className="italic text-[#FF2D8E]">say</span>
          </h2>
          <p className="mx-auto mt-3.5 mb-11 max-w-[640px] text-lg leading-relaxed text-black/60 sm:text-[19px]">
            Real reviews from real clients — 5.0★ on Fresha across 1,900+ visits.
          </p>
        </div>
        <div className="mx-auto grid max-w-[1240px] gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {IV_TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="flex flex-col gap-4 rounded-[22px] border-2 border-black bg-white px-6 py-7 shadow-[8px_10px_0_rgba(255,45,142,0.2)]"
            >
              <div className="flex items-center justify-between gap-2.5">
                <span className="text-base tracking-[2px] text-[#FF2D8E]">★★★★★</span>
                <span className="rounded-full border border-[#FF2D8E]/40 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#E6007E]">
                  {t.tag}
                </span>
              </div>
              <p className="flex-1 text-base leading-relaxed text-black/70">“{t.quote}”</p>
              <div className="flex items-center gap-3 border-t border-black/10 pt-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF3D9A] to-[#E6007E] font-serif text-lg font-extrabold text-white">
                  {t.name.charAt(0)}
                </div>
                <div className="leading-tight">
                  <p className="text-[15px] font-bold text-[#111]">{t.name}</p>
                  <p className="text-[13px] text-black/60">{t.loc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-9 text-center">
          <PinkPill href={bookHref} className="!px-10 !py-4 !text-[17px]">
            Book your drip ›
          </PinkPill>
        </div>
      </section>

      {/* Blog */}
      <section className="px-6 pb-5 pt-[90px]">
        <div className="mx-auto max-w-[1240px] text-center">
          <SectionEyebrow>LEARN &amp; GLOW</SectionEyebrow>
          <h2 className="font-serif text-4xl font-bold tracking-tight sm:text-[50px]">
            From the <span className="italic text-[#FF2D8E]">blog</span>
          </h2>
          <p className="mx-auto mt-3.5 mb-11 max-w-[660px] text-lg leading-relaxed text-black/60 sm:text-[19px]">
            Evidence-based reads on hydration, recovery, and longevity — so you can make confident choices about your
            wellness.
          </p>
        </div>
        <div className="mx-auto grid max-w-[1240px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {IV_BLOG_POSTS.map((b) => (
            <a
              key={b.url}
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col overflow-hidden rounded-[22px] border-2 border-black bg-white text-[#111] shadow-[8px_10px_0_rgba(255,45,142,0.2)] transition hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[12px_14px_0_rgba(255,45,142,0.36)]"
            >
              <div className="relative h-[180px] overflow-hidden bg-[#f0ebe8]">
                <Image src={b.img} alt="" fill className="object-cover" sizes="400px" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="mb-2.5 text-[11px] font-bold tracking-[0.14em] text-[#FF2D8E]">{b.tag}</p>
                <h3 className="mb-2.5 font-serif text-[23px] font-bold leading-tight">{b.title}</h3>
                <p className="mb-4 flex-1 text-[15px] leading-relaxed text-black/60">{b.excerpt}</p>
                <span className="text-[15px] font-bold text-[#E6007E]">Read the article →</span>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href={olympiaBlog}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#FF2D8E] bg-white px-9 py-3.5 text-base font-bold text-[#E6007E] transition hover:bg-[#FF2D8E] hover:text-white"
          >
            View all articles →
          </a>
        </div>
        <p className="mx-auto mt-5 max-w-[1240px] text-center text-[13px] text-black/60">
          Educational resources from our compounding partner, Olympia Pharmaceuticals. Informational only — not medical
          advice.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 px-6 pb-10 pt-[90px]">
        <h2 className="mx-auto max-w-[820px] text-center font-serif text-4xl font-bold tracking-tight sm:text-[50px]">
          Common Questions
        </h2>
        <div className="mx-auto mt-10 max-w-[820px]">
          {IV_FAQS.map((faq, i) => {
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
                  <p className="mb-[26px] max-w-[720px] px-1 text-[17px] leading-relaxed text-black/65">{faq.a}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* Health check / safety */}
      <section className="mt-[84px] bg-[#111] px-6 py-[88px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <SectionEyebrow>SAFETY FIRST · NP ON SITE</SectionEyebrow>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-[50px]">
              Your <span className="italic text-[#FF2D8E]">health check</span>
            </h2>
            <p className="mx-auto mt-3.5 mb-12 max-w-[720px] text-lg leading-relaxed text-white/88 sm:text-[19px]">
              Before any drip, our nurse practitioner screens you like a medical practice — because we are one. Here&apos;s
              what we review and when a drip may need to wait.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-[22px] border border-white/16 bg-white/[0.04] p-8">
              <h3 className="mb-5 font-serif text-[26px] font-bold text-white">What we screen</h3>
              <div className="flex flex-col gap-3.5">
                {IV_SCREEN_ITEMS.map((s) => (
                  <div key={s} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#FF2D8E]/50 bg-[#FF2D8E]/18 text-[13px] font-extrabold text-[#FF8AC2]">
                      ✓
                    </span>
                    <span className="text-[15px] font-medium text-white/90">{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[22px] border border-[#FF2D8E]/40 bg-[#FF2D8E]/6 p-8">
              <div className="mb-5 flex items-center gap-2.5">
                <span aria-hidden>⚠️</span>
                <h3 className="font-serif text-[26px] font-bold text-white">When a drip may need to wait</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {IV_CAUTION_ITEMS.map((c) => (
                  <div key={c.t} className="border-l-[3px] border-[#FF2D8E] pl-3.5">
                    <p className="mb-1 text-[15px] font-extrabold text-white">{c.t}</p>
                    <p className="text-sm leading-relaxed text-white/85">{c.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mx-auto mt-7 max-w-[720px] text-center text-[13px] text-white/42">
            This list is not exhaustive. Candidacy is determined by our nurse practitioner at your visit. IV therapy is
            not a substitute for emergency care — if you are seriously ill, seek medical attention.
          </p>
        </div>
      </section>

      {/* Group & party */}
      <section className="px-6 pb-5 pt-[90px]">
        <div className="mx-auto grid max-w-[1240px] overflow-hidden rounded-[26px] border-2 border-black shadow-[10px_12px_0_rgba(255,45,142,0.22)] lg:grid-cols-[1.15fr_1fr]">
          <div className="flex flex-col justify-center px-8 py-12 lg:px-12">
            <div className="mb-4 inline-flex items-center gap-2">
              <PulseDot />
              <span className="text-xs font-bold tracking-[0.24em] text-[#FF2D8E]">GROUP &amp; PARTY DRIPS</span>
            </div>
            <h2 className="font-serif text-4xl font-extrabold leading-tight tracking-tight sm:text-[46px]">
              Drip <span className="italic text-[#FF2D8E]">together</span>
            </h2>
            <p className="mt-4 max-w-[520px] text-lg leading-relaxed text-black/84">
              Bachelorette weekends, birthdays, bridal parties, game-day recovery, or a corporate reset — gather your
              group and we&apos;ll bring the drip bar to you.
            </p>
            <div className="mb-7 mt-6 flex flex-col gap-3">
              {IV_GROUP_PERKS.map((g) => (
                <div key={g} className="flex items-center gap-3">
                  <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#FFE3F0] text-[13px] font-extrabold text-[#E6007E]">
                    ✓
                  </span>
                  <span className="text-base font-medium text-black/70">{g}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3.5">
              <PinkPill href={phoneHref}>Plan a group drip ›</PinkPill>
              <PinkPill href={bookHref} variant="outline">
                Book online ›
              </PinkPill>
            </div>
          </div>
          <div className="relative min-h-[360px] bg-[#f0ebe8] lg:min-h-[420px]">
            <Image
              src={images.group}
              alt="Group IV therapy party at Hello Gorgeous"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Mobile waitlist */}
      <section className="mx-auto mt-20 max-w-[1240px] px-6">
        <div className="relative flex flex-wrap items-center justify-between gap-9 overflow-hidden rounded-[26px] bg-[#111] px-8 py-12 shadow-[0_18px_46px_rgba(0,0,0,0.28)] lg:px-12">
          <div
            className="pointer-events-none absolute -right-[60px] -top-[90px] h-[340px] w-[340px] rounded-full"
            style={{ background: "radial-gradient(circle,rgba(255,45,142,.28),transparent 70%)" }}
            aria-hidden
          />
          <div className="relative min-w-[300px] flex-1">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FF2D8E]/50 bg-[#FF2D8E]/16 px-4 py-2 text-xs font-bold tracking-[0.22em] text-[#FF8AC2]">
              <PulseDot />
              {IV_MOBILE_WAITLIST.badge}
            </div>
            <h2 className="font-serif text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-[46px]">
              We bring the <span className="italic text-[#FF2D8E]">IV to you</span>
            </h2>
            <p className="mt-3.5 mb-6 max-w-[560px] text-lg leading-relaxed text-white/88 sm:text-[19px]">
              {IV_MOBILE_WAITLIST.body}
            </p>
            <div className="mb-7 flex flex-wrap gap-2.5">
              {IV_MOBILE_WAITLIST.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/22 px-3.5 py-2 text-[13px] font-semibold text-white"
                >
                  {chip}
                </span>
              ))}
            </div>
            <PinkPill href={phoneHref}>{IV_MOBILE_WAITLIST.ctaLabel}</PinkPill>
          </div>
          <div className="relative h-[220px] w-[220px] shrink-0 overflow-hidden rounded-3xl border border-white/12 bg-[#1c1c1c]">
            <Image src={images.flex} alt="Mobile IV therapy coming soon" fill className="object-cover opacity-80" sizes="220px" />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mt-0 bg-[#111] px-6 py-[90px] text-center">
        <div className="mx-auto max-w-[760px]">
          <p className="mb-5 text-xs font-bold tracking-[0.3em] text-[#FF2D8E]">DOWNTOWN OSWEGO · NP-DIRECTED</p>
          <h2 className="font-serif text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-[52px]">
            Hydrate. Restore. <span className="italic text-[#FF2D8E]">Glow.</span>
          </h2>
          <p className="mx-auto mt-[18px] max-w-xl text-lg leading-relaxed text-white/88 sm:text-xl">
            Book your IV drip with our medical team. Group drips &amp; party bookings welcome.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <PinkPill href={bookHref} className="!px-10 !py-4 !text-[17px]">
              Book a drip ›
            </PinkPill>
            <PinkPill href={phoneHref} variant="outlineDark" className="!px-10 !py-4 !text-[17px]">
              Call {phoneDisplayShort}
            </PinkPill>
          </div>
        </div>
      </section>

      {/* Footer band */}
      <footer className="bg-black px-6 py-11 text-white/86">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6">
          <div className="leading-snug">
            <p className="font-serif text-[22px] font-extrabold text-white">
              Hello Gorgeous <span className="text-[#FF2D8E]">Med Spa</span>
            </p>
            <p className="mt-1.5 text-sm">
              {SITE.address.streetAddress}, {SITE.address.addressLocality}, IL {SITE.address.postalCode} · {phoneDisplay} ·
              Family-owned · NP-directed
            </p>
          </div>
          <p className="text-[13px] text-white/50">© Hello Gorgeous Med Spa · Individual results may vary.</p>
        </div>
      </footer>
    </div>
  );
}
