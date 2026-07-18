"use client";

import Image from "next/image";

import { productImage } from "@/lib/regen/catalog";
import { CATALOG_BUNDLES } from "@/lib/regen/catalog/bundles";

const STAGE_BG = "/images/regen/brand/regen-stage-cinematic-plum.jpg";
const LINEUP_HERO = "/images/regen/brand/regen-stacks-bundles-lineup-cinematic.jpg";

export type RegenStackCard = {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  accent: string;
  items: { name: string; price: string }[];
  price: string;
  total: string;
  save: string;
  add: () => void;
};

type Props = {
  bundles: RegenStackCard[];
};

/** Hero drug art per bundle id (from CATALOG_BUNDLES pick order) */
function stackArtKeys(bundleId: string): string[] {
  const def = CATALOG_BUNDLES.find((b) => b.id === bundleId);
  if (!def) return [];
  return def.pick.map((pk) => pk[0]).filter(Boolean).slice(0, 3);
}

export function RegenStacksTheater({ bundles }: Props) {
  return (
    <section
      id="stacks"
      className="scroll-mt-[148px] relative overflow-hidden px-4 py-16 sm:px-6 lg:py-24"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(212,175,55,0.14) 0%, transparent 50%), radial-gradient(ellipse 60% 45% at 90% 30%, rgba(255,45,142,0.22) 0%, transparent 50%), linear-gradient(180deg, #0a0610 0%, #050308 50%, #14081c 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        aria-hidden
        style={{
          background:
            "linear-gradient(125deg, transparent 26%, rgba(255,220,180,0.16) 48%, rgba(255,45,142,0.12) 54%, transparent 76%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px]">
        <div className="mb-10 max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#F5D76E]/35 bg-[#F5D76E]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F5D76E] backdrop-blur">
            Curated stacks
          </p>
          <h2 className="mt-4 font-serif text-4xl font-black tracking-tight text-white lg:text-5xl">
            Stacks &{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              bundles
            </span>
          </h2>
          <p
            className="mt-2 text-sm font-black uppercase tracking-[0.28em]"
            style={{
              background: "linear-gradient(90deg, #F5D76E 0%, #FF2D8E 55%, #E6007E 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Protocol packs · One-tap cart
          </p>
          <p className="mt-3 text-base font-medium leading-relaxed text-white/65">
            Curated combinations providers love — add the full stack in one tap. List pricing shown;
            NP review applies to every item.
          </p>
        </div>

        <div className="mb-10 overflow-hidden rounded-[1.75rem] border border-[#FF2D8E]/30 shadow-[0_28px_60px_-20px_rgba(230,0,126,0.5)]">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={LINEUP_HERO}
              alt="RE GEN stacks and bundles — cinematic peptide vial lineup"
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
          {bundles.map((b) => {
            const keys = stackArtKeys(b.id);
            const arts = keys.map((k) => productImage(k));

            return (
              <article
                key={b.id}
                className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-[1.75rem] border border-[#FF2D8E]/25 shadow-[0_24px_48px_-14px_rgba(230,0,126,0.45)] transition duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:min-h-[300px] sm:flex-row"
              >
                {/* Visual stage */}
                <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-[42%]">
                  <Image src={STAGE_BG} alt="" fill className="object-cover" sizes="40vw" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `
                        linear-gradient(125deg, transparent 30%, rgba(255,220,180,0.2) 48%, rgba(255,45,142,0.18) 55%, transparent 75%),
                        linear-gradient(180deg, ${b.accent}66 0%, transparent 45%, rgba(0,0,0,0.55) 100%)
                      `,
                    }}
                  />
                  <span
                    className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white"
                    style={{
                      background: "linear-gradient(135deg, #FF5FB1 0%, #E6007E 55%, #9b0a4d 100%)",
                      boxShadow: "0 0 14px rgba(255,45,142,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
                    }}
                  >
                    {b.tagline}
                  </span>

                  {/* Overlapping vials — big & pop */}
                  <div className="absolute inset-0 flex items-end justify-center pb-2 pt-10 sm:items-center sm:pb-0">
                    <div
                      className="pointer-events-none absolute bottom-[10%] left-1/2 h-6 w-[60%] -translate-x-1/2 rounded-[100%] bg-black/55 blur-lg sm:bottom-[18%]"
                      aria-hidden
                    />
                    <div className="relative flex h-[88%] w-full items-end justify-center sm:h-[78%] sm:items-center">
                      {arts.map((src, i) => {
                        const offsets = [
                          "z-[3] -translate-x-6 scale-110 sm:-translate-x-8",
                          "z-[2] translate-x-1 scale-100",
                          "z-[1] translate-x-8 scale-90 opacity-90 sm:translate-x-10",
                        ];
                        return (
                          <div
                            key={`${b.id}-${i}`}
                            className={`absolute h-[95%] w-[58%] max-w-[160px] transition duration-500 group-hover:scale-105 ${offsets[i] ?? offsets[0]}`}
                          >
                            <Image
                              src={src}
                              alt=""
                              fill
                              className="object-contain drop-shadow-[0_22px_32px_rgba(0,0,0,0.65)]"
                              sizes="160px"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Copy + CTA */}
                <div className="relative flex flex-1 flex-col bg-gradient-to-br from-[#12081a] to-[#0a0610] px-5 py-5 sm:px-6 sm:py-6">
                  <p
                    className="text-[11px] font-black uppercase tracking-[0.2em]"
                    style={{
                      background: "linear-gradient(90deg, #F5D76E, #FFD700)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    Stack protocol
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-black leading-tight text-white">
                    {b.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">{b.blurb}</p>

                  <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-3">
                    {b.items.map((item) => (
                      <li
                        key={item.name}
                        className="flex items-center justify-between gap-3 text-sm font-medium text-white/80"
                      >
                        <span className="truncate">
                          <span className="mr-2 text-[#FF2D8E]">✦</span>
                          {item.name}
                        </span>
                        <span className="shrink-0 font-semibold text-white/55">{item.price}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
                    <div>
                      <p
                        className="font-serif text-3xl font-black"
                        style={{
                          background: "linear-gradient(90deg, #FFB8DC, #FF2D8E, #E6007E)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {b.price}
                      </p>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
                        Stack · list price · 30-day
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={b.add}
                      className="rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-3 text-sm font-black text-white shadow-[0_0_24px_rgba(255,45,142,0.4)] transition hover:brightness-110 active:translate-y-px"
                    >
                      Add stack to cart
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
