"use client";

import Link from "next/link";

import { HOMEPAGE_BUYER_PATHS } from "@/lib/homepage-buyer-paths";
import { TrifectaShowcaseSection } from "./trifecta-showcase";

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
        <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
          Not sure where to start?{" "}
          <Link href="/help-me-choose" className="font-semibold text-[#FFB8DC] underline decoration-[#E6007E]/50">
            Help me choose →
          </Link>
        </p>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {HOMEPAGE_BUYER_PATHS.map((category, index) => (
          <Link
            key={category.id}
            href={category.href}
            className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#151922]/90 p-5 backdrop-blur-sm transition hover:border-[#E6007E]/40 hover:bg-[#1a1f2e]"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
              0{index + 1}
            </p>
            <h3 className="mt-2 text-lg font-black leading-tight text-white group-hover:text-[#FFB8DC]">
              {category.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">{category.summary}</p>
            <ul className="mt-3 space-y-1 text-xs text-white/50">
              {category.treatments.slice(0, 4).map((t) => (
                <li key={t}>· {t}</li>
              ))}
            </ul>
            <span className="mt-4 text-sm font-bold text-[#60a5fa] group-hover:underline">
              {category.cta} →
            </span>
          </Link>
        ))}
      </div>
    </TrifectaShowcaseSection>
  );
}
