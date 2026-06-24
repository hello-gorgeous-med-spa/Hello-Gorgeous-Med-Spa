"use client";

import Image from "next/image";
import Link from "next/link";

import {
  HELLO_GORGEOUS_RX_START_PATH,
  HG_RX_TELEHEALTH_BOOKING_URL,
  PEPTIDE_REQUEST_PATH,
} from "@/lib/flows";
import { HOMEPAGE_BUYER_PATHS } from "@/lib/homepage-buyer-paths";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { TrifectaShowcaseSection } from "./trifecta-showcase";

const RX_QUICK_LINKS = [
  { href: HELLO_GORGEOUS_RX_START_PATH, label: "Start Here — pick a peptide" },
  { href: PEPTIDE_REQUEST_PATH, label: "Peptide request form" },
  { href: "/peptides", label: "All 22 peptide guides" },
  { href: "/telehealth", label: "Charm telehealth (HIPAA video)" },
  { href: "/app?rx=1", label: "Hello Gorgeous RX in the app" },
] as const;

export function BuyerPathsSection() {
  return (
    <TrifectaShowcaseSection
      id="what-we-help-with"
      className="scroll-mt-20 border-b-4 border-black"
      pill="Start here"
      title={
        <>
          What Can We{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(to right, #ec4899, #60a5fa, #f59e0b)",
            }}
          >
            Help You With?
          </span>
        </>
      }
      description="Choose your goal — we'll guide you to the right treatments without overwhelming you with every service at once."
      footer={
        <div className="space-y-5">
          <div className="rounded-2xl border-2 border-[#E6007E]/50 bg-[#0d1018] p-5 text-left shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
              Hello Gorgeous RX™ — peptides &amp; telehealth
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              New peptide protocols: submit your request, pre-pay the{" "}
              <strong className="text-white">${PEPTIDE_CONSULT_FEE_USD} NP consult</strong> via Square (same
              checkout as our Vitamin Bar), then book a secured{" "}
              <strong className="text-white">Charm EHR video visit</strong> with Ryan Kent, FNP-BC. Includes
              BPC-157, TB-500, Recovery Blend, Sermorelin, NAD+, and more.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={HELLO_GORGEOUS_RX_START_PATH}
                className="inline-flex items-center rounded-full bg-[#E6007E] px-4 py-2 text-xs font-bold text-white hover:bg-[#FF2D8E] transition"
              >
                Start Here →
              </Link>
              <Link
                href={PEPTIDE_REQUEST_PATH}
                className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:border-[#E6007E] transition"
              >
                Peptide request form
              </Link>
              <a
                href={HG_RX_TELEHEALTH_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-[#FFB8DC] hover:border-[#E6007E] transition"
              >
                Charm patient portal
              </a>
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/45">
              {RX_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#FFB8DC] underline decoration-white/20">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
            Not sure where to start?{" "}
            <Link href="/help-me-choose" className="font-semibold text-[#FFB8DC] underline decoration-[#E6007E]/50">
              Help me choose →
            </Link>
          </p>
        </div>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {HOMEPAGE_BUYER_PATHS.map((category, index) => (
          <Link
            key={category.id}
            href={category.href}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-white/10 bg-[#0d1018] shadow-[6px_6px_0_0_rgba(230,0,126,0.15)] transition duration-300 hover:-translate-y-1 hover:border-[#E6007E]/70 hover:shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-[#080a10]">
              <Image
                src={category.thumbnailImage}
                alt={category.thumbnailAlt}
                fill
                className="object-cover object-left transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                priority={index < 2}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(13,16,24,0.92) 0%, rgba(13,16,24,0.15) 45%, transparent 100%)",
                }}
              />
              <span className="absolute left-3 top-3 rounded-full border border-[#FFB8DC]/40 bg-black/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC] backdrop-blur-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              {category.id === "hello-gorgeous-rx" && (
                <span className="absolute right-3 top-3 rounded-full border border-[#E6007E] bg-[#E6007E]/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                  RX
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-lg font-black leading-tight text-white group-hover:text-[#FFB8DC]">
                {category.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">{category.summary}</p>
              <ul className="mt-3 space-y-1 text-xs text-white/45">
                {category.treatments.slice(0, 4).map((t) => (
                  <li key={t}>· {t}</li>
                ))}
              </ul>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#60a5fa] group-hover:text-[#FFB8DC]">
                {category.cta}
                <span aria-hidden className="transition group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </TrifectaShowcaseSection>
  );
}
