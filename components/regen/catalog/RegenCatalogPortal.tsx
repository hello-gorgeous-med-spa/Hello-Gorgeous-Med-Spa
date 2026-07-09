"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { useCart } from "@/lib/regen/cart-context";
import {
  CATALOG_BUNDLES,
  CATALOG_GOALS,
  CATALOG_PRODUCTS,
  HERO_DRUG_KEYS,
  SHOP_GOALS,
  bundlePrice,
  findProductByDrugKey,
  formGroup,
  getCatalogProduct,
  getMonograph,
  goalAccent,
  goalCounts,
  goalFromSlug,
  goalSlug,
  price30,
  type CatalogProduct,
  type SupplyDays,
} from "@/lib/regen/catalog";
import { catalogLineId } from "@/lib/regen/catalog/pricing";
import {
  CatalogBrandLockup,
  CatalogCartButton,
  ProductCard,
  formatCatalogMoney,
} from "@/components/regen/catalog/CatalogProductCard";
import { ProductDetailDrawer } from "@/components/regen/catalog/ProductDetailDrawer";

type View = "home" | "goal" | "all" | "search";

function resolveView(params: {
  goal: string | null;
  browse: string | null;
  q: string | null;
}): { view: View; activeGoal: string | null } {
  if (params.q?.trim()) return { view: "search", activeGoal: null };
  if (params.browse === "all") return { view: "all", activeGoal: null };
  if (params.goal) {
    const fromSlug = goalFromSlug(params.goal);
    const fromName = CATALOG_GOALS.find((g) => g.id === params.goal)?.id;
    const activeGoal = fromSlug ?? fromName ?? null;
    if (activeGoal) return { view: "goal", activeGoal };
  }
  return { view: "home", activeGoal: null };
}

export function RegenCatalogPortal({ initialGoalSlug }: { initialGoalSlug?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem, openCart } = useCart();

  const goalParam = initialGoalSlug ?? searchParams.get("goal");
  const browseParam = searchParams.get("browse");
  const queryParam = searchParams.get("q") ?? "";

  const { view, activeGoal } = resolveView({
    goal: goalParam,
    browse: browseParam,
    q: queryParam,
  });

  const [query, setQuery] = useState(queryParam);
  const [formFilter, setFormFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selVar, setSelVar] = useState(0);
  const [supply, setSupply] = useState<SupplyDays>(30);

  const counts = useMemo(() => goalCounts(CATALOG_PRODUCTS), []);

  const navigate = useCallback(
    (next: { goal?: string | null; browse?: string | null; q?: string | null }) => {
      const params = new URLSearchParams();
      if (next.q?.trim()) params.set("q", next.q.trim());
      else if (next.browse === "all") params.set("browse", "all");
      else if (next.goal) params.set("goal", goalSlug(next.goal));

      const qs = params.toString();
      router.push(qs ? `/rx/catalog?${qs}` : "/rx/catalog", { scroll: true });
    },
    [router],
  );

  const onSearchChange = (value: string) => {
    setQuery(value);
    if (value.trim()) navigate({ q: value });
    else navigate({ goal: activeGoal, browse: view === "all" ? "all" : null });
  };

  const openProduct = (id: string) => {
    setSelectedId(id);
    setSelVar(0);
    setSupply(30);
  };

  const selectedProduct = selectedId ? getCatalogProduct(selectedId) : undefined;

  const filteredProducts = useMemo(() => {
    let list: CatalogProduct[] = [];
    if (view === "goal" && activeGoal) {
      list = CATALOG_PRODUCTS.filter((p) => p.goal === activeGoal);
      if (formFilter !== "All") {
        list = list.filter((p) => formGroup(p.form) === formFilter);
      }
    } else if (view === "all") {
      list = [...CATALOG_PRODUCTS];
    } else if (view === "search") {
      const q = query.trim().toLowerCase();
      list = CATALOG_PRODUCTS.filter((p) => {
        const mono = getMonograph(p.drugKey);
        return `${p.name} ${p.category} ${p.goal} ${mono.name ?? ""}`
          .toLowerCase()
          .includes(q);
      });
    }
    return list;
  }, [view, activeGoal, formFilter, query]);

  const formChips = useMemo(() => {
    if (view !== "goal" || !activeGoal) return [];
    const groups = [
      ...new Set(
        CATALOG_PRODUCTS.filter((p) => p.goal === activeGoal).map((p) =>
          formGroup(p.form),
        ),
      ),
    ];
    return ["All", ...groups];
  }, [view, activeGoal]);

  const bestSellers = useMemo(
    () =>
      HERO_DRUG_KEYS.map((k) => findProductByDrugKey(k)).filter(
        (p): p is CatalogProduct => !!p,
      ),
    [],
  );

  const bundles = useMemo(
    () =>
      CATALOG_BUNDLES.map((b) => {
        const resolved = b.pick
          .map((pk) => {
            const p = findProductByDrugKey(pk[0]);
            if (!p) return null;
            return {
              id: p.id,
              v: 0,
              name: p.name,
              retail: price30(p, p.variants[0]),
            };
          })
          .filter(Boolean) as { id: string; v: number; name: string; retail: number }[];

        const { total, price, save } = bundlePrice(resolved.map((r) => r.retail));

        return {
          ...b,
          accent: goalAccent(b.tagline),
          items: resolved.map((r) => ({
            name: r.name,
            price: formatCatalogMoney(r.retail),
          })),
          total: formatCatalogMoney(total),
          price: formatCatalogMoney(price),
          save: formatCatalogMoney(save),
          add: () => {
            resolved.forEach((r) => {
              const p = getCatalogProduct(r.id)!;
              const variant = p.variants[r.v];
              addItem({
                id: catalogLineId(r.id, r.v, 30),
                name: p.name,
                priceUsd: price30(p, variant),
                category: p.goal,
                rx: true,
                variantLabel: variant.strength,
                supplyDays: 30,
              });
            });
            openCart();
          },
        };
      }),
    [addItem, openCart],
  );

  const goalBlurb =
    CATALOG_GOALS.find((g) => g.id === activeGoal)?.blurb ?? "";

  const browseTitle =
    view === "goal"
      ? activeGoal ?? "Browse"
      : view === "search"
        ? "Search results"
        : view === "all"
          ? "Full catalog"
          : "";

  const browseSub =
    view === "goal"
      ? goalBlurb
      : view === "search"
        ? `Showing matches for "${query}"`
        : view === "all"
          ? "Everything your provider can prescribe."
          : "";

  return (
    <div className="min-h-screen bg-[#FFF9FB] text-[#0a0a0a]">
      {/* Ambient wash */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, #FFF0F7 0%, #ffffff 40%, #f9fafb 100%)",
        }}
        aria-hidden
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-white/[0.92] backdrop-blur-[10px]">
        <div className="mx-auto flex h-[66px] max-w-[1200px] items-center gap-4 px-6">
          <CatalogBrandLockup onClickHome={() => navigate({})} />
          <div className="relative mx-auto hidden max-w-md flex-1 md:block">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
              value={query}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search treatments, goals, ingredients…"
              className="h-[42px] w-full rounded-full border border-black/10 bg-white pl-11 pr-4 text-sm outline-none ring-[#FF2D8E] focus:ring-2"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate({})}
              className="hidden text-sm font-semibold text-black/70 hover:text-[#E6007E] sm:block"
            >
              Home
            </button>
            <CatalogCartButton />
          </div>
        </div>
        <div className="border-t border-black/[0.06] px-6 py-3 md:hidden">
          <input
            type="search"
            value={query}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search treatments…"
            className="h-[42px] w-full rounded-full border border-black/10 bg-white px-4 text-sm outline-none ring-[#FF2D8E] focus:ring-2"
          />
        </div>
      </header>

      {view === "home" ? (
        <>
          {/* Hero */}
          <section className="border-b border-black/5 bg-gradient-to-b from-[#FFF5F9] to-white px-6 py-14 md:py-20">
            <div className="mx-auto max-w-[1200px]">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#FF2D8E]">
                RENEW · REBALANCE · REGENERATE
              </p>
              <h1 className="mt-4 max-w-3xl font-serif text-4xl font-extrabold leading-tight md:text-[56px]">
                Your treatments, made{" "}
                <span className="text-[#FF2D8E]">effortless.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-black/75 md:text-lg">
                Browse the full RE GEN formulary — NP-directed by{" "}
                <strong>Ryan Kent, FNP-BC</strong>. Every order is reviewed before
                anything ships. Flat <strong>$30</strong> Illinois shipping.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate({ goal: "Lose Weight" })}
                  className="rounded-full bg-[#FF2D8E] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(255,45,142,0.28)] hover:bg-[#E6007E]"
                >
                  Start with weight loss
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ browse: "all" })}
                  className="rounded-full border-2 border-[#0a0a0a] bg-transparent px-6 py-3 text-sm font-bold text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
                >
                  Browse full catalog
                </button>
              </div>
            </div>
          </section>

          {/* Shop by goal */}
          <section className="px-6 py-14">
            <div className="mx-auto max-w-[1200px]">
              <h2 className="font-serif text-3xl font-extrabold">Shop by goal</h2>
              <div className="mt-8 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
                {SHOP_GOALS.map((goal) => {
                  const accent = goalAccent(goal);
                  const meta = CATALOG_GOALS.find((g) => g.id === goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => navigate({ goal })}
                      className="group rounded-[20px] border border-black/10 bg-white p-6 text-left shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] motion-reduce:hover:translate-y-0"
                      style={{ borderColor: "transparent" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                      }}
                    >
                      <div
                        className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-lg text-white"
                        style={{ backgroundColor: accent }}
                      >
                        {goal === "Lose Weight"
                          ? "⚖"
                          : goal === "Recovery & Performance"
                            ? "💪"
                            : goal === "Intimacy"
                              ? "♥"
                              : goal === "Hormones"
                                ? "⚡"
                                : goal === "Skin & Hair"
                                  ? "✨"
                                  : "☀"}
                      </div>
                      <h3 className="text-lg font-bold">{goal}</h3>
                      <p className="mt-2 text-sm text-black/60">{meta?.blurb}</p>
                      <p className="mt-4 text-sm font-bold" style={{ color: accent }}>
                        {counts[goal] ?? 0} options →
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Best sellers */}
          <section className="border-t border-black/5 bg-white px-6 py-14">
            <div className="mx-auto max-w-[1200px]">
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-serif text-3xl font-extrabold">Client favorites</h2>
                <button
                  type="button"
                  onClick={() => navigate({ browse: "all" })}
                  className="text-sm font-bold text-[#E6007E] hover:underline"
                >
                  View all →
                </button>
              </div>
              <div className="mt-8 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
                {bestSellers.map((p) => (
                  <ProductCard key={p.id} product={p} onOpen={openProduct} />
                ))}
              </div>
            </div>
          </section>

          {/* Bundles */}
          <section className="px-6 py-14">
            <div className="mx-auto max-w-[1200px]">
              <h2 className="font-serif text-3xl font-extrabold">Stacks & bundles</h2>
              <p className="mt-2 text-black/60">Curated combinations — save 10%.</p>
              <div className="mt-8 grid gap-[18px] md:grid-cols-2">
                {bundles.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-[20px] border border-black/10 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
                  >
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
                      style={{ backgroundColor: b.accent }}
                    >
                      {b.tagline}
                    </span>
                    <h3 className="mt-3 font-serif text-2xl font-extrabold">{b.name}</h3>
                    <p className="mt-2 text-sm text-black/65">{b.blurb}</p>
                    <ul className="mt-4 space-y-1 text-sm text-black/70">
                      {b.items.map((item) => (
                        <li key={item.name} className="flex justify-between gap-2">
                          <span>{item.name}</span>
                          <span>{item.price}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span className="font-serif text-2xl font-extrabold text-[#FF2D8E]">
                        {b.price}
                      </span>
                      <span className="text-sm text-black/40 line-through">{b.total}</span>
                      <span className="rounded-full bg-[#16a34a]/15 px-2 py-0.5 text-xs font-bold text-[#16a34a]">
                        Save {b.save}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={b.add}
                      className="mt-5 w-full rounded-full border-2 border-[#0a0a0a] py-3 text-sm font-bold hover:bg-[#0a0a0a] hover:text-white"
                    >
                      Add stack to cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="px-6 pb-16">
            <div className="mx-auto max-w-[1200px] rounded-3xl bg-[#0a0a0a] px-8 py-12 text-white md:px-12">
              <h2 className="font-serif text-3xl font-extrabold">How RE GEN works</h2>
              <ol className="mt-8 grid gap-8 md:grid-cols-3">
                {[
                  {
                    n: "1",
                    title: "Shop & start intake",
                    body: "Add treatments to your cart and begin the secure RE GEN intake.",
                  },
                  {
                    n: "2",
                    title: "NP reviews your plan",
                    body: "Ryan Kent, FNP-BC reviews your health history and order before approval.",
                  },
                  {
                    n: "3",
                    title: "Shipped to your door",
                    body: "Approved orders ship with flat $30 Illinois shipping. Auto-refill available.",
                  },
                ].map((step) => (
                  <li key={step.n}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF2D8E] text-sm font-bold">
                      {step.n}
                    </span>
                    <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm text-white/75">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </>
      ) : (
        <section className="px-6 py-10">
          <div className="mx-auto max-w-[1200px]">
            <button
              type="button"
              onClick={() => navigate({})}
              className="text-sm font-semibold text-[#E6007E] hover:underline"
            >
              ← All goals
            </button>
            <h1 className="mt-4 font-serif text-4xl font-extrabold">{browseTitle}</h1>
            <p className="mt-2 max-w-2xl text-black/65">{browseSub}</p>
            <p className="mt-3 text-sm font-semibold text-black/50">
              {filteredProducts.length} products
            </p>

            {formChips.length > 2 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {formChips.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormFilter(f)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      f === formFilter
                        ? "border-2 border-[#FF2D8E] bg-[#FFF0F7] text-[#0a0a0a]"
                        : "border border-black/15 bg-white text-[#555]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <p className="mt-12 text-center text-black/50">No products match your filters.</p>
            ) : (
              <div className="mt-8 grid gap-[18px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} onOpen={openProduct} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t-4 border-black bg-[#0a0a0a] px-6 py-12 text-white">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-serif text-xl font-extrabold tracking-[0.14em]">RE GEN</p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75">
            RE GEN is the telehealth prescription arm of Hello Gorgeous Med Spa, NP-directed
            by Ryan Kent, FNP-BC. Compounded medications require a prescription and completed
            intake. Information on this site is educational, not medical advice. Member retail
            pricing plus flat $30 Illinois shipping. Research peptides are used under provider
            supervision and are not FDA-approved to treat, cure, or prevent disease.{" "}
            <strong>74 W. Washington St, Oswego, IL 60543 · (630) 636-6193</strong>
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link href="/rx" className="text-[#FFB8DC] hover:underline">
              RE GEN home
            </Link>
            <Link href="/rx/request" className="text-[#FFB8DC] hover:underline">
              Start intake
            </Link>
            <Link href="/book" className="text-[#FFB8DC] hover:underline">
              Book in-spa
            </Link>
          </div>
        </div>
      </footer>

      {selectedProduct && (
        <ProductDetailDrawer
          product={selectedProduct}
          variantIndex={selVar}
          supply={supply}
          onClose={() => setSelectedId(null)}
          onVariantChange={setSelVar}
          onSupplyChange={setSupply}
        />
      )}
    </div>
  );
}
