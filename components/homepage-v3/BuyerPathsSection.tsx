"use client";

import Image from "next/image";
import Link from "next/link";

import {
  HELLO_GORGEOUS_RX_START_PATH,
  HG_RX_TELEHEALTH_BOOKING_LABEL,
  HG_RX_TELEHEALTH_BOOKING_URL,
  PEPTIDE_REQUEST_PATH,
} from "@/lib/flows";
import {
  HOMEPAGE_AESTHETICS_ANCHOR,
  HOMEPAGE_MEDICAL_ANCHOR,
  homepageBuyerPathsForTrack,
  type BuyerPathCategory,
} from "@/lib/homepage-buyer-paths";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { TrifectaShowcaseSection } from "./trifecta-showcase";

const RX_QUICK_LINKS = [
  { href: HELLO_GORGEOUS_RX_START_PATH, label: "Start Here — pick a peptide" },
  { href: PEPTIDE_REQUEST_PATH, label: "Peptide request form" },
  { href: "/peptides", label: "All 22 peptide guides" },
  { href: "/portal/rx", label: "My RX portal" },
  { href: "/app?rx=1", label: "Hello Gorgeous app" },
] as const;

function BuyerPathCard({ category }: { category: BuyerPathCategory }) {
  return (
    <Link
      href={category.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-white/10 bg-[#0d1018] shadow-[6px_6px_0_0_rgba(230,0,126,0.15)] transition duration-300 hover:-translate-y-1 hover:border-[#E6007E]/70 hover:shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
    >
      <div
        className={`relative aspect-[4/3] overflow-hidden border-b border-white/10 ${
          category.id === "hello-gorgeous-rx" ? "bg-black" : "bg-[#080a10]"
        }`}
      >
        <Image
          src={category.thumbnailImage}
          alt={category.thumbnailAlt}
          fill
          className={
            category.id === "hello-gorgeous-rx"
              ? "object-contain object-center p-1 transition duration-500 group-hover:scale-[1.02]"
              : "object-cover object-left transition duration-500 group-hover:scale-[1.03]"
          }
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              category.id === "hello-gorgeous-rx"
                ? "linear-gradient(to top, rgba(13,16,24,0.75) 0%, transparent 35%)"
                : "linear-gradient(to top, rgba(13,16,24,0.92) 0%, rgba(13,16,24,0.15) 45%, transparent 100%)",
          }}
        />
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
  );
}

function TrackPathGrid({ track }: { track: "aesthetics" | "medical" }) {
  const paths = homepageBuyerPathsForTrack(track);
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {paths.map((category) => (
        <BuyerPathCard key={category.id} category={category} />
      ))}
    </div>
  );
}

export function BuyerPathsSection() {
  return (
    <>
      <TrifectaShowcaseSection
        id={HOMEPAGE_AESTHETICS_ANCHOR}
        className="scroll-mt-24 border-b-4 border-black"
        pill="Aesthetics track"
        title={
          <>
            Med spa{" "}
            <span className="text-[#60a5fa]">treatments</span>
          </>
        }
        description="Injectables, skin & laser, and body — book a consult and we’ll match you to the right treatment plan."
        footer={
          <p className="text-center text-sm text-white/55">
            <Link href="/services" className="font-semibold text-[#60a5fa] hover:underline">
              Browse full services menu →
            </Link>
          </p>
        }
      >
        <TrackPathGrid track="aesthetics" />
      </TrifectaShowcaseSection>

      <TrifectaShowcaseSection
        id={HOMEPAGE_MEDICAL_ANCHOR}
        className="scroll-mt-24 border-b-4 border-black"
        pill="Medical track"
        title={
          <>
            Programs &{" "}
            <span className="text-[#E6007E]">RX</span>
          </>
        }
        description="Weight loss, hormones, peptides, and IV — NP-supervised programs with telehealth and My RX when you need refills."
        footer={
          <div className="space-y-5">
            <div className="rounded-2xl border-2 border-[#E6007E]/50 bg-[#0d1018] p-5 text-left shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
                Hello Gorgeous RX™ — peptides &amp; telehealth
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                New peptide protocols: submit your request, pre-pay the{" "}
                <strong className="text-white">${PEPTIDE_CONSULT_FEE_USD} NP consult</strong> via Square,
                then book a secured{" "}
                <strong className="text-white">NP video visit on Fresha</strong> with Ryan Kent, FNP-BC.
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
                  {HG_RX_TELEHEALTH_BOOKING_LABEL}
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
            <p className="text-center text-sm text-white/55">
              Not sure where to start?{" "}
              <Link
                href="/help-me-choose"
                className="font-semibold text-[#FFB8DC] underline decoration-[#E6007E]/50"
              >
                Help me choose →
              </Link>
            </p>
          </div>
        }
      >
        <TrackPathGrid track="medical" />
      </TrifectaShowcaseSection>
    </>
  );
}
