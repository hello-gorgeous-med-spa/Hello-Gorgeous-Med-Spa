"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/regen/catalog/CatalogProductCard";
import { RxFindYourPeptideCta } from "@/components/rx/RxFindYourPeptideCta";
import type { CatalogProduct, CatalogSort } from "@/lib/regen/catalog";
import { CATALOG_GOALS } from "@/lib/regen/catalog";
import { STORE_AISLE_LABEL } from "@/lib/regen-shop-nav";

const HOW_IT_WORKS = [
  { n: "01", title: "Pick a protocol", body: "Choose what you want to start." },
  { n: "02", title: "Start intake", body: "Free to submit · about 4 minutes." },
  { n: "03", title: "NP consult", body: "$49 · Ryan Kent, FNP-BC sets your dose." },
  { n: "04", title: "Pickup or ship", body: "Invoiced after approval · $30 IL ship." },
] as const;

type FilterId = "all" | string;

type Props = {
  products: CatalogProduct[];
  catalog: CatalogProduct[];
  goals: readonly string[];
  activeGoal: string | null;
  sort: CatalogSort;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSelectGoal: (goal: string) => void;
  onShopAll: () => void;
  onSortChange: (sort: CatalogSort) => void;
};

export function RegenTreatmentsShop({
  products,
  catalog,
  goals,
  activeGoal,
  sort,
  searchValue,
  onSearchChange,
  onSelectGoal,
  onShopAll,
  onSortChange,
}: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilter: FilterId = activeGoal ?? "all";

  const counts = useMemo(() => {
    const byGoal = new Map<string, number>();
    for (const p of catalog) {
      byGoal.set(p.goal, (byGoal.get(p.goal) ?? 0) + 1);
    }
    return byGoal;
  }, [catalog]);

  const filterRows = [
    { id: "all" as const, label: "All treatments", count: catalog.length },
    {
      id: "GLP-1s",
      label: "GLP-1s",
      count: catalog.filter((p) => p.drugKey === "semaglutide" || p.drugKey === "tirzepatide").length,
    },
    ...goals.map((goal) => ({
      id: goal,
      label: STORE_AISLE_LABEL[goal] ?? goal,
      count: counts.get(goal) ?? 0,
    })),
  ];

  const title =
    activeFilter === "all"
      ? "All treatments"
      : (STORE_AISLE_LABEL[activeFilter] ?? activeFilter);

  const liveGoals = CATALOG_GOALS.filter((g) => goals.includes(g.id));

  return (
    <>
      <section className="relative overflow-hidden border-b-4 border-black px-6 py-16 sm:py-24">
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
        <div className="relative mx-auto max-w-[720px] text-center">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">
            <span className="h-2 w-2 rounded-full bg-[#FF2D8E]" aria-hidden />
            Personalized, clinician-guided plans
          </p>
          <h1 className="mt-4 font-serif text-4xl font-black tracking-tight text-white sm:text-6xl">
            More healthy years{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              start here
            </span>
          </h1>
          <a
            href="#treatments"
            className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#FF2D8E] px-7 py-3.5 text-sm font-black text-black shadow-[4px_4px_0_0_#000] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            Explore treatments →
          </a>
        </div>
      </section>

      <section id="treatments" className="scroll-mt-[88px] bg-white px-6 py-10 sm:py-14">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-serif text-4xl font-black text-black">{title}</h2>
            <label className="relative block w-full max-w-md">
              <span className="sr-only">Search treatments</span>
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search treatments..."
                className="h-12 w-full rounded-full border-2 border-black/15 bg-white pl-11 pr-4 text-sm font-medium text-black outline-none ring-[#FF2D8E] placeholder:text-black/40 focus:ring-2"
              />
            </label>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-bold lg:hidden"
              aria-expanded={filtersOpen}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 7h16M7 12h10M10 17h4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Filters
            </button>
            <label className="ml-auto flex items-center gap-2 text-sm font-semibold text-black/55">
              Sort by:
              <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value as CatalogSort)}
                className="rounded-full border-2 border-black/15 bg-white px-3 py-2 text-sm font-bold text-black"
              >
                <option value="featured">Featured</option>
                <option value="name">A–Z</option>
                <option value="name-desc">Z–A</option>
                <option value="price-asc">Price: low → high</option>
                <option value="price-desc">Price: high → low</option>
              </select>
            </label>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside
              className={`${filtersOpen ? "block" : "hidden"} lg:block`}
              aria-label="Treatment filters"
            >
              <nav className="flex flex-col gap-1">
                {filterRows.map((row) => {
                  const pressed = activeFilter === row.id;
                  return (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => {
                        if (row.id === "all") onShopAll();
                        else onSelectGoal(row.id);
                        setFiltersOpen(false);
                      }}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                        pressed
                          ? "bg-[#FFF0F7] text-[#E6007E]"
                          : "text-black/70 hover:bg-black/5 hover:text-black"
                      }`}
                    >
                      <span>{row.label}</span>
                      <span className="text-xs font-bold text-black/40">{row.count}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            <div>
              {products.length === 0 ? (
                <div className="rounded-3xl border-4 border-black bg-white px-6 py-16 text-center shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                  <p className="font-serif text-2xl font-black text-black">
                    No treatments match the current filters.
                  </p>
                  <button
                    type="button"
                    onClick={onShopAll}
                    className="mt-4 text-sm font-bold text-[#E6007E] underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} consultMode />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="by-need"
        className="scroll-mt-[88px] border-t-4 border-black bg-[#FFF0F7] px-6 py-14"
      >
        <div className="mx-auto max-w-[1200px]">
          <h2 className="font-serif text-3xl font-black text-black sm:text-4xl">
            How do you want to{" "}
            <span className="text-[#E6007E]">live better?</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm font-medium text-black/65">
            Explore our treatments and learn how each one can support your goals.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveGoals.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => onSelectGoal(g.id)}
                className="rounded-3xl border-4 border-black bg-white p-5 text-left shadow-[6px_6px_0_0_rgba(230,0,126,0.35)] transition hover:-translate-y-0.5"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">
                  {g.tag}
                </p>
                <h3 className="mt-1 font-serif text-xl font-black text-black">
                  {STORE_AISLE_LABEL[g.id] ?? g.id}
                </h3>
                <p className="mt-1 text-sm font-medium text-black/65">{g.blurb}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div id="quiz">
        <RxFindYourPeptideCta />
      </div>

      <section
        id="how-it-works"
        className="scroll-mt-[88px] border-t-4 border-black bg-white px-6 py-10"
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
        </p>
      </section>
    </>
  );
}
