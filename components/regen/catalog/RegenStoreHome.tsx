"use client";

import Link from "next/link";

import { ProductCard } from "@/components/regen/catalog/CatalogProductCard";
import type { CatalogProduct } from "@/lib/regen/catalog";
import { STORE_AISLE_LABEL } from "@/lib/regen-shop-nav";

const HOW_IT_WORKS = [
  { n: "01", title: "Pick a protocol", body: "Choose what you want to start." },
  { n: "02", title: "Start intake", body: "Free to submit · about 4 minutes." },
  { n: "03", title: "NP consult", body: "$49 · Ryan Kent, FNP-BC sets your dose." },
  { n: "04", title: "Pickup or ship", body: "Invoiced after approval · $30 IL ship." },
] as const;

type Props = {
  goals: readonly string[];
  products: CatalogProduct[];
  onSelectGoal: (goal: string) => void;
  onShopAll: () => void;
};

/**
 * Public /rx home — a store shelf, not a landing page. Staff portals keep the
 * cinematic catalog. Category chips + product grid first; process and FAQ stay
 * below the merchandise.
 */
export function RegenStoreHome({ goals, products, onSelectGoal, onShopAll }: Props) {
  return (
    <>
      <section className="relative overflow-hidden border-b-4 border-black px-6 py-10 sm:py-12">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0a0a0a 0%, #1a0a12 40%, #2d1020 70%, #0a0a0a 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 80% at 12% 20%, rgba(230,0,126,0.35) 0%, transparent 55%),
              radial-gradient(ellipse 50% 60% at 92% 80%, rgba(255,45,142,0.28) 0%, transparent 50%)
            `,
          }}
        />
        <div className="relative mx-auto max-w-[1200px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">
            Hello Gorgeous RX · Oswego
          </p>
          <h1 className="mt-2 font-serif text-4xl font-black tracking-tight text-white sm:text-5xl">
            Shop{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              RE GEN
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-base font-medium text-white/80">
            Starting prices on the shelf. Ryan Kent, FNP-BC sets your dose at consult.
            Nothing ships until he approves it.
          </p>
        </div>
      </section>

      <div className="sticky top-[116px] z-30 border-b-4 border-black bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] gap-2 overflow-x-auto px-6 py-3">
          {goals.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => onSelectGoal(goal)}
              className="shrink-0 rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black shadow-[3px_3px_0_0_rgba(230,0,126,0.35)] transition hover:bg-[#FFF0F7] hover:text-[#E6007E]"
            >
              {STORE_AISLE_LABEL[goal] ?? goal}
            </button>
          ))}
          <button
            type="button"
            onClick={onShopAll}
            className="shrink-0 rounded-full border-2 border-black bg-[#FF2D8E] px-4 py-2 text-sm font-black text-black shadow-[3px_3px_0_0_#000]"
          >
            Shop all
          </button>
        </div>
      </div>

      <section id="shop" className="scroll-mt-[160px] px-6 py-10 sm:py-14">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">On the shelf</p>
              <h2 className="mt-1 font-serif text-3xl font-black text-black">Featured protocols</h2>
            </div>
            <button
              type="button"
              onClick={onShopAll}
              className="text-sm font-bold text-[#E6007E] underline decoration-[#E6007E]/40 underline-offset-4 hover:text-[#FF2D8E]"
            >
              Shop all protocols →
            </button>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} consultMode />
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-[148px] border-t-4 border-black bg-white px-6 py-10"
      >
        <div className="mx-auto grid max-w-[1200px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]"
            >
              <p className="text-[11px] font-black tracking-widest text-[#E6007E]">{step.n}</p>
              <h3 className="mt-1 font-serif text-lg font-black text-black">{step.title}</h3>
              <p className="mt-1 text-sm font-medium text-black/70">{step.body}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-[1200px] text-center text-sm font-medium text-black/55">
          <Link href="/peptides" className="font-bold text-[#E6007E] hover:underline">
            Peptide therapy
          </Link>
          {" · "}
          <Link href="/rx/learn/what-are-peptides" className="font-bold text-[#E6007E] hover:underline">
            New to peptides? Read the guide
          </Link>
          {" · "}
          {goals.map((goal, i) => (
            <span key={goal}>
              {i > 0 ? " · " : null}
              <button
                type="button"
                onClick={() => onSelectGoal(goal)}
                className="font-bold text-[#E6007E] hover:underline"
              >
                {STORE_AISLE_LABEL[goal] ?? goal}
              </button>
            </span>
          ))}
        </p>
      </section>
    </>
  );
}
