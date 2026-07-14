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
  ProductCard,
  formatCatalogMoney,
} from "@/components/regen/catalog/CatalogProductCard";
import { ProductDetailDrawer } from "@/components/regen/catalog/ProductDetailDrawer";
import { RegenShopStickyNav } from "@/components/regen/catalog/RegenShopStickyNav";
import { RxPeptideEducationSection } from "@/components/rx/RxPeptideEducationSection";
import { RxScienceHomeHero } from "@/components/rx/RxScienceHomeHero";
import {
  JourneySectionHead,
  JOURNEY_SECTION_BG_B,
} from "@/components/marketing/JourneyPageUi";
import { REGEN_SHOP_FAQS } from "@/lib/regen-shop-nav";

const SECTION_SCROLL = "scroll-mt-[148px]";

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

export function RegenCatalogPortal({
  initialGoalSlug,
  basePath = "/rx",
}: {
  initialGoalSlug?: string;
  /** Admin staff portal uses `/admin/rx/portal` */
  basePath?: string;
}) {
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
      router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: true });
    },
    [router, basePath],
  );

  const onSearchChange = (value: string) => {
    setQuery(value);
    if (value.trim()) navigate({ q: value });
    else navigate({ goal: activeGoal, browse: view === "all" ? "all" : null });
  };

  const scrollToShopByGoal = useCallback(() => {
    document.getElementById("shop-by-goal")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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
    <div className="min-h-screen bg-black font-sans text-white">
      <RegenShopStickyNav
        basePath={basePath}
        onGoHome={() => {
          if (view === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
          navigate({});
        }}
        searchValue={query}
        onSearchChange={onSearchChange}
      />

      {view === "home" ? (
        <>
          <div id="science" className={SECTION_SCROLL}>
            <RxScienceHomeHero onExploreGoals={scrollToShopByGoal} />
            <RxPeptideEducationSection />
          </div>

          {/* Shop by goal */}
          <section
            id="shop-by-goal"
            className={`${SECTION_SCROLL} ${JOURNEY_SECTION_BG_B} px-6 py-16 lg:py-24`}
          >
            <div className="mx-auto max-w-[1200px]">
              <JourneySectionHead
                eyebrow="Your protocol, matched to your goal"
                title="Shop by"
                titleAccent="goal"
                description="Once you understand the science, browse RE GEN by what you want to work on — weight, recovery, hormones, intimacy, skin, or longevity. Every order is NP-reviewed before it ships."
              />
              <div className="mt-8 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
                {SHOP_GOALS.map((goal) => {
                  const accent = goalAccent(goal);
                  const meta = CATALOG_GOALS.find((g) => g.id === goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => navigate({ goal })}
                      className="group rounded-[20px] border border-white/14 bg-[#0a0206] p-6 text-left shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-[#FF2D8E] hover:shadow-[0_20px_40px_rgba(255,45,142,0.18)] motion-reduce:hover:translate-y-0"
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
                      <h3 className="text-lg font-bold text-white">{goal}</h3>
                      <p className="mt-2 text-sm text-white/60">{meta?.blurb}</p>
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
          <section id="popular" className={`${SECTION_SCROLL} px-6 py-16 lg:py-24`}>
            <div className="mx-auto max-w-[1200px]">
              <div className="flex items-end justify-between gap-4">
                <JourneySectionHead eyebrow="Client favorites" title="Popular" titleAccent="protocols" />
                <button
                  type="button"
                  onClick={() => navigate({ browse: "all" })}
                  className="text-sm font-bold text-[#FF2D8E] hover:underline"
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
          <section id="stacks" className={`${SECTION_SCROLL} ${JOURNEY_SECTION_BG_B} px-6 py-16 lg:py-24`}>
            <div className="mx-auto max-w-[1200px]">
              <JourneySectionHead
                eyebrow="Curated stacks"
                title="Stacks &"
                titleAccent="bundles"
                description="Curated combinations — save 10% when you add a stack to cart."
              />
              <div className="mt-10 grid gap-[18px] md:grid-cols-2">
                {bundles.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-[20px] border border-white/14 bg-[#0a0206] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
                  >
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-bold text-black"
                      style={{ backgroundColor: b.accent }}
                    >
                      {b.tagline}
                    </span>
                    <h3 className="mt-3 font-serif text-2xl font-extrabold text-white">{b.name}</h3>
                    <p className="mt-2 text-sm text-white/65">{b.blurb}</p>
                    <ul className="mt-4 space-y-1 text-sm text-white/70">
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
                      <span className="text-sm text-white/40 line-through">{b.total}</span>
                      <span className="rounded-full bg-[#16a34a]/15 px-2 py-0.5 text-xs font-bold text-[#16a34a]">
                        Save {b.save}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={b.add}
                      className="mt-5 w-full rounded-full border-2 border-[#FF2D8E] py-3 text-sm font-bold text-[#FF2D8E] transition hover:bg-[#FF2D8E] hover:text-black"
                    >
                      Add stack to cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className={`${SECTION_SCROLL} px-6 pb-16 pt-4`}>
            <div className="mx-auto max-w-[1200px] rounded-3xl border border-[#FF2D8E]/35 bg-[#0a0206] px-8 py-12 md:px-12">
              <JourneySectionHead eyebrow="How RE GEN works" title="Three steps to" titleAccent="your protocol" />
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
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF2D8E] text-sm font-extrabold text-black">
                      {step.n}
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm text-white/75">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* FAQ — same dropdown pattern as Brow Journey */}
          <section
            id="faq"
            className={`${SECTION_SCROLL} bg-[radial-gradient(80%_90%_at_80%_0%,#12030c,#000_60%)] px-6 py-16 lg:py-24`}
          >
            <div className="mx-auto max-w-[1200px]">
              <JourneySectionHead
                eyebrow="Common Q & A"
                title="Your questions,"
                titleAccent="answered"
                description="Clear answers before you start intake. Still unsure? Book a free consult with our NP-led team."
              />
              <div className="mx-auto mt-11 flex max-w-[860px] flex-col gap-3">
                {REGEN_SHOP_FAQS.map((faq) => (
                  <details
                    key={faq.q}
                    className="group overflow-hidden rounded-[14px] border border-white/14 bg-[#0a0206]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-serif text-lg font-bold text-white marker:content-none group-open:text-[#FF2D8E]">
                      {faq.q}
                      <span className="text-2xl font-normal text-[#FF2D8E] group-open:hidden">+</span>
                      <span className="hidden text-2xl font-normal text-[#FF2D8E] group-open:inline">
                        –
                      </span>
                    </summary>
                    <p className="px-6 pb-5 text-[15px] leading-relaxed text-white/72">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="px-6 py-10">
          <div className="mx-auto max-w-[1200px]">
            <button
              type="button"
              onClick={() => navigate({})}
              className="text-sm font-semibold text-[#FF2D8E] hover:underline"
            >
              ← All goals
            </button>
            <h1 className="mt-4 font-serif text-4xl font-extrabold text-white">{browseTitle}</h1>
            <p className="mt-2 max-w-2xl text-white/65">{browseSub}</p>
            <p className="mt-3 text-sm font-semibold text-white/50">
              {filteredProducts.length} products
            </p>

            {formChips.length > 2 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {formChips.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormFilter(f)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      f === formFilter
                        ? "border-2 border-[#FF2D8E] bg-[#FF2D8E]/15 text-[#FF2D8E]"
                        : "border border-white/20 bg-[#0a0206] text-white/65 hover:border-[#FF2D8E]/50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <p className="mt-12 text-center text-white/50">No products match your filters.</p>
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
