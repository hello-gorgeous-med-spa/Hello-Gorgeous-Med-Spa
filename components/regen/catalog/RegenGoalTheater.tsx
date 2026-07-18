"use client";

import Image from "next/image";
import { useMemo } from "react";

import {
  CATALOG_GOALS,
  CATALOG_PRODUCTS,
  goalCounts,
  listingPriceText,
  price30,
  productImage,
  SHOP_GOALS,
  type CatalogGoalId,
  type CatalogProduct,
} from "@/lib/regen/catalog";

const STAGE_BG = "/images/regen/brand/regen-stage-cinematic-plum.jpg";

/** Dark cinematic stages — different undertones per goal (not tan Hims) */
const GOAL_STAGE: Record<
  CatalogGoalId,
  {
    wash: string;
    glow: string;
    drugKey: string;
    heroName: string;
    badge: string;
  }
> = {
  "Lose Weight": {
    wash: "rgba(230,0,126,0.45)",
    glow: "rgba(255,45,142,0.55)",
    drugKey: "tirzepatide",
    heroName: "Tirzepatide",
    badge: "Top seller",
  },
  "Recovery & Performance": {
    wash: "rgba(40,80,180,0.4)",
    glow: "rgba(96,165,250,0.45)",
    drugKey: "bpc157",
    heroName: "BPC-157",
    badge: "Repair",
  },
  Intimacy: {
    wash: "rgba(180,20,90,0.5)",
    glow: "rgba(255,45,142,0.5)",
    drugKey: "pt141",
    heroName: "PT-141",
    badge: "Discreet",
  },
  Hormones: {
    wash: "rgba(120,30,90,0.45)",
    glow: "rgba(236,72,153,0.45)",
    drugKey: "testosterone",
    heroName: "Testosterone",
    badge: "Balance",
  },
  "Skin & Hair": {
    wash: "rgba(200,60,140,0.4)",
    glow: "rgba(255,95,177,0.45)",
    drugKey: "ghkcu",
    heroName: "GHK-Cu",
    badge: "Glow",
  },
  "Energy & Longevity": {
    wash: "rgba(160,90,20,0.4)",
    glow: "rgba(251,191,36,0.4)",
    drugKey: "nad",
    heroName: "NAD+",
    badge: "Cellular",
  },
};

function lowestPricedInGoal(goal: string): CatalogProduct | null {
  const items = CATALOG_PRODUCTS.filter((p) => p.goal === goal && p.variants?.[0]);
  if (!items.length) return null;
  return items.reduce((best, p) => {
    const a = price30(p, p.variants[0]);
    const b = price30(best, best.variants[0]);
    return a < b ? p : best;
  });
}

function heroProduct(goal: CatalogGoalId, drugKey: string): CatalogProduct | null {
  return (
    CATALOG_PRODUCTS.find((p) => p.goal === goal && p.drugKey === drugKey) ??
    lowestPricedInGoal(goal)
  );
}

type Props = {
  onSelectGoal: (goal: string) => void;
};

export function RegenGoalTheater({ onSelectGoal }: Props) {
  const counts = useMemo(() => goalCounts(CATALOG_PRODUCTS), []);

  return (
    <section
      id="shop-by-goal"
      className="scroll-mt-[148px] relative overflow-hidden px-4 py-16 sm:px-6 lg:py-24"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 70% 0%, rgba(255,45,142,0.28) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(212,175,55,0.12) 0%, transparent 45%), linear-gradient(180deg, #0d0610 0%, #050308 50%, #12081a 100%)",
      }}
    >
      {/* Diagonal studio beam across section */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "linear-gradient(125deg, transparent 28%, rgba(255,200,160,0.18) 48%, rgba(255,45,142,0.12) 52%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px]">
        <div className="mb-10 max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#FF2D8E]/40 bg-[#FF2D8E]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC] backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF2D8E]" aria-hidden />
            RE GEN shop
          </p>
          <h2 className="mt-4 font-serif text-4xl font-black tracking-tight text-white lg:text-5xl">
            Shop by{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              goal
            </span>
          </h2>
          <p
            className="mt-2 text-sm font-black uppercase tracking-[0.28em]"
            style={{
              background: "linear-gradient(90deg, #F5D76E 0%, #FF2D8E 50%, #E6007E 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            New high dose · Metallic results
          </p>
          <p className="mt-3 text-base font-medium leading-relaxed text-white/65">
            Pick what you want to change — then browse real protocols with pricing. Every order is
            NP-reviewed before it ships.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {SHOP_GOALS.map((goal) => {
            const stage = GOAL_STAGE[goal];
            const meta = CATALOG_GOALS.find((g) => g.id === goal);
            const product = heroProduct(goal, stage.drugKey);
            const img = productImage(stage.drugKey, product?.form);
            const fromPrice = product ? listingPriceText(product) : null;
            const count = counts[goal] ?? 0;

            return (
              <button
                key={goal}
                type="button"
                onClick={() => onSelectGoal(goal)}
                className="group relative flex aspect-[3/4] flex-col overflow-hidden rounded-[1.75rem] text-left outline-none transition duration-300 hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-[#FF2D8E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050308] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                style={{
                  boxShadow: `0 24px 48px -12px ${stage.glow}, 0 0 0 1px rgba(255,45,142,0.25)`,
                }}
              >
                {/* Cinematic stage photo */}
                <Image
                  src={STAGE_BG}
                  alt=""
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  priority={goal === "Lose Weight"}
                />
                {/* Per-goal color wash + diagonal beam */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(125deg, transparent 30%, rgba(255,220,180,0.22) 48%, rgba(255,45,142,0.18) 55%, transparent 75%),
                      linear-gradient(180deg, ${stage.wash} 0%, transparent 40%, rgba(0,0,0,0.75) 100%)
                    `,
                  }}
                />

                {/* Badge — metallic hot pink */}
                <span
                  className="absolute right-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white"
                  style={{
                    background: "linear-gradient(135deg, #FF5FB1 0%, #E6007E 55%, #9b0a4d 100%)",
                    boxShadow: "0 0 16px rgba(255,45,142,0.55), inset 0 1px 0 rgba(255,255,255,0.35)",
                  }}
                >
                  {stage.badge}
                </span>

                {/* BIG floating vial — dominates the card */}
                <div className="relative z-[1] flex flex-[1.35] items-center justify-center px-2 pt-8">
                  <div
                    className="pointer-events-none absolute bottom-[12%] left-1/2 h-8 w-[70%] -translate-x-1/2 rounded-[100%] bg-black/60 blur-xl"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute left-1/2 top-[28%] h-40 w-40 -translate-x-1/2 rounded-full blur-3xl"
                    style={{ background: stage.glow }}
                    aria-hidden
                  />
                  <div className="relative h-[92%] w-[95%] max-w-none transition duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-contain drop-shadow-[0_28px_40px_rgba(0,0,0,0.65)]"
                      sizes="(max-width: 640px) 90vw, 360px"
                    />
                  </div>
                </div>

                {/* Copy */}
                <div className="relative z-[2] px-5 pb-5 pt-0">
                  <p
                    className="text-[11px] font-black uppercase tracking-[0.2em]"
                    style={{
                      background: "linear-gradient(90deg, #F5D76E, #FFD700, #E8C547)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      filter: "drop-shadow(0 0 8px rgba(245,215,110,0.45))",
                    }}
                  >
                    {stage.heroName}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-black leading-tight text-white drop-shadow-md">
                    {goal}
                  </h3>
                  {fromPrice ? (
                    <p className="mt-1.5 text-sm font-black">
                      <span
                        style={{
                          background: "linear-gradient(90deg, #FFB8DC, #FF2D8E, #E6007E)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {fromPrice.charAt(0).toUpperCase() + fromPrice.slice(1)}
                      </span>
                      <span className="font-semibold text-white/55"> · 30-day</span>
                    </p>
                  ) : null}
                  <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-snug text-white/75">
                    {meta?.blurb}
                  </p>
                  <p className="mt-3 text-sm font-black text-white">
                    Shop {count} options{" "}
                    <span className="inline-block text-[#FF2D8E] transition group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
