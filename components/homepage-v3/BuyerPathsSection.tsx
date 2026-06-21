"use client";

import Image from "next/image";
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
            className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-white/10 bg-[#0d1018] shadow-[6px_6px_0_0_rgba(230,0,126,0.15)] transition duration-300 hover:-translate-y-1 hover:border-[#E6007E]/70 hover:shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
          >
            <div className="relative aspect-[4/5] overflow-hidden border-b border-white/10">
              <Image
                src={category.thumbnailImage}
                alt={category.thumbnailAlt}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                priority={index < 2}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, #0d1018 0%, rgba(13,16,24,0.55) 38%, rgba(13,16,24,0.08) 100%)",
                }}
              />
              <span className="absolute left-3 top-3 rounded-full border border-[#FFB8DC]/40 bg-black/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC] backdrop-blur-sm">
                0{index + 1}
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-4 pt-10">
                <h3 className="text-lg font-black leading-tight text-white drop-shadow-md group-hover:text-[#FFB8DC]">
                  {category.title}
                </h3>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-4 pt-3">
              <p className="flex-1 text-sm leading-relaxed text-white/70">{category.summary}</p>
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
