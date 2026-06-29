import Image from "next/image";
import Link from "next/link";

import { FadeUp } from "@/components/Section";
import {
  GLP1_INTAKE_PATH,
  GLP1_REFILL_PATH,
  HELLO_GORGEOUS_RX_START_PATH,
  HG_RX_TELEHEALTH_BOOKING_LABEL,
  HG_RX_TELEHEALTH_BOOKING_URL,
  PEPTIDE_REQUEST_PATH,
} from "@/lib/flows";
import { GENTLEMENS_CLUB_PATH } from "@/lib/gentlemens-club";
import { HOMEPAGE_MEDICAL_ANCHOR } from "@/lib/homepage-buyer-paths";
import { CLIENT_APP } from "@/lib/client-app";
import { SHOP_RX_HERO_IMAGE } from "@/lib/shop-rx-product-images";

import { HomepageMedicalStickyBar } from "./HomepageMedicalStickyBar";
import { HomepageShopRxFinder } from "./HomepageShopRxFinder";

const TRUST = [
  "NP-supervised telehealth",
  "Ship to home · Illinois",
  "My RX portal & refills",
] as const;

const QUICK_ACTIONS = [
  { href: GLP1_INTAKE_PATH, label: "GLP-1 intake", sub: "New patient" },
  { href: GLP1_REFILL_PATH, label: "GLP-1 refill", sub: "Existing RX" },
  { href: HELLO_GORGEOUS_RX_START_PATH, label: "Peptides", sub: "Start Here" },
  { href: "/portal/rx", label: "My RX portal", sub: "Orders & refills" },
  { href: `${CLIENT_APP.path}?rx=1`, label: "Hello Gorgeous app", sub: "Install free" },
] as const;

const MORE_MEDICAL = [
  { href: "/iv-therapy", label: "IV therapy" },
  { href: "/vitamin-bar", label: "Vitamin bar" },
  { href: GENTLEMENS_CLUB_PATH, label: "Men's TRT" },
  { href: "/rx", label: "Full RX catalog" },
  { href: "/medical", label: "Medical hub" },
] as const;

/** Hims-style medical lane — one place for GLP-1, peptides, hormones, refills, portal. */
export function HomepageMedicalLane() {
  return (
    <div id={HOMEPAGE_MEDICAL_ANCHOR} className="scroll-mt-20">
      <section
        className="relative flex min-h-[min(78vh,720px)] items-end overflow-hidden border-b-4 border-black"
        aria-labelledby="homepage-medical-lane-heading"
      >
        <Image
          src={SHOP_RX_HERO_IMAGE}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-55 saturate-[0.9]"
          sizes="100vw"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(230,0,126,0.22)_0%,transparent_55%)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 pt-24 sm:pb-14 sm:pt-28">
          <FadeUp className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/75">
              Hello Gorgeous RX™
            </p>
            <h2
              id="homepage-medical-lane-heading"
              className="mt-4 font-serif text-4xl font-normal leading-[1.05] text-white sm:text-5xl md:text-[3.25rem]"
            >
              Medical programs,{" "}
              <span className="italic text-[#FFB8DC]">prescribed</span> for you.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
              GLP-1 · peptides · hormones · vitamins · refills — supervised by Ryan Kent, FNP-BC.
            </p>
          </FadeUp>

          <FadeUp delayMs={80}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#find-your-treatment"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-lg transition hover:bg-[#FFF0F7]"
              >
                Find your treatment
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/portal/rx"
                className="inline-flex items-center rounded-full border-2 border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-[#E6007E] hover:bg-[#E6007E]/20"
              >
                My RX portal
              </Link>
            </div>
          </FadeUp>

          <FadeUp delayMs={120}>
            <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2">
              {TRUST.map((item) => (
                <li
                  key={item}
                  className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/50 sm:text-[10px]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#0a0a0a] px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFB8DC]">
              Start in one tap
            </p>
          </FadeUp>
          <FadeUp delayMs={60}>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex flex-col rounded-2xl border-2 border-white/12 bg-white/5 px-4 py-4 transition hover:border-[#E6007E]/55 hover:bg-[#E6007E]/10"
                >
                  <span className="text-sm font-bold text-white group-hover:text-[#FFB8DC]">
                    {action.label}
                  </span>
                  <span className="mt-1 text-[11px] text-white/45">{action.sub}</span>
                </Link>
              ))}
            </div>
          </FadeUp>
          <FadeUp delayMs={100}>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={PEPTIDE_REQUEST_PATH}
                className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/90 transition hover:border-[#E6007E]"
              >
                Peptide request form
              </Link>
              <a
                href={HG_RX_TELEHEALTH_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-[#FFB8DC] transition hover:border-[#E6007E]"
              >
                {HG_RX_TELEHEALTH_BOOKING_LABEL}
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      <HomepageShopRxFinder />

      <div className="border-b-4 border-black bg-[#FAF7F4] px-4 py-6 pb-20 md:pb-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
            Also explore
          </span>
          {MORE_MEDICAL.map((link, i) => (
            <span key={link.href} className="flex items-center gap-4">
              {i > 0 ? <span className="hidden text-black/20 sm:inline" aria-hidden>·</span> : null}
              <Link
                href={link.href}
                className="font-semibold text-[#C90A68] underline decoration-[#E6007E]/30 underline-offset-2 hover:text-[#E6007E]"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      </div>

      <HomepageMedicalStickyBar sectionId={HOMEPAGE_MEDICAL_ANCHOR} />
    </div>
  );
}
