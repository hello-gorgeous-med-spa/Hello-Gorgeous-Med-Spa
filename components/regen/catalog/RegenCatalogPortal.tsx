"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useCart } from "@/lib/regen/cart-context";
import {
  CATALOG_BUNDLES,
  CATALOG_GOALS,
  CATALOG_PRODUCTS,
  CLIENT_VISIBLE_PRODUCTS,
  HERO_DRUG_KEYS,
  bundlePrice,
  filterCatalogByPrice,
  findClientProductByDrugKey,
  findProductByDrugKey,
  formGroup,
  getCatalogProduct,
  getMonograph,
  goalAccent,
  goalFromSlug,
  goalSlug,
  isClientVisibleProduct,
  isKitComponentProduct,
  price30,
  sortCatalogProducts,
  type CatalogPriceFilter,
  type CatalogProduct,
  type CatalogSort,
  type SupplyDays,
} from "@/lib/regen/catalog";
import { catalogLineId } from "@/lib/regen/catalog/pricing";
import { catalogClientMonthlyUsd } from "@/lib/regen/catalog/client-price";
import { catalogConsultRoute } from "@/lib/regen/catalog/consult-route";
import {
  ProductCard,
  formatCatalogMoney,
} from "@/components/regen/catalog/CatalogProductCard";
import { ProductDetailDrawer } from "@/components/regen/catalog/ProductDetailDrawer";
import { RegenGoalTheater } from "@/components/regen/catalog/RegenGoalTheater";
import { RegenHowItWorksTheater } from "@/components/regen/catalog/RegenHowItWorksTheater";
import { RegenScienceTheater } from "@/components/regen/catalog/RegenScienceTheater";
import { RegenStacksTheater } from "@/components/regen/catalog/RegenStacksTheater";
import { RegenStoreHome } from "@/components/regen/catalog/RegenStoreHome";
import { RegenShopStickyNav } from "@/components/regen/catalog/RegenShopStickyNav";
import { CLIENT_SHOP_GOALS } from "@/lib/regen/catalog/client-visibility";
import { RxFindYourPeptideCta } from "@/components/rx/RxFindYourPeptideCta";
import { RxScienceHomeHero } from "@/components/rx/RxScienceHomeHero";
import { JourneySectionHead } from "@/components/marketing/JourneyPageUi";
import { REGEN_SHOP_PAGE_WASH } from "@/lib/regen/shop-surface";
import { goalFromStorefrontCat } from "@/lib/regen/storefront-deep-link";
import {
  REGEN_SHOP_FAQS,
  REGEN_SHOP_NAV,
  STORE_AISLE_LABEL,
  regenClientShopNav,
} from "@/lib/regen-shop-nav";
import { RxPatientJourneyBand } from "@/components/rx/RxPatientJourneyBand";

const SECTION_SCROLL = "scroll-mt-[148px]";

type View = "home" | "goal" | "all" | "search";

function resolveView(params: {
  goal: string | null;
  browse: string | null;
  q: string | null;
  cat: string | null;
}): { view: View; activeGoal: string | null } {
  if (params.q?.trim()) return { view: "search", activeGoal: null };
  if (params.browse === "all") return { view: "all", activeGoal: null };
  const fromCat = goalFromStorefrontCat(params.cat);
  const goalKey = params.goal || (fromCat ? goalSlug(fromCat) : null);
  if (goalKey) {
    const fromSlug = goalFromSlug(goalKey);
    const fromName = CATALOG_GOALS.find((g) => g.id === goalKey)?.id;
    const activeGoal = fromSlug ?? fromName ?? fromCat ?? null;
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
  const catParam = searchParams.get("cat");
  const productParam = searchParams.get("product");

  const { view, activeGoal } = resolveView({
    goal: goalParam,
    browse: browseParam,
    q: queryParam,
    cat: catParam,
  });

  const [query, setQuery] = useState(queryParam);
  const [formFilter, setFormFilter] = useState("All");
  const [sort, setSort] = useState<CatalogSort>("featured");
  const [priceFilter, setPriceFilter] = useState<CatalogPriceFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selVar, setSelVar] = useState(0);
  const [supply, setSupply] = useState<SupplyDays>(30);

  const isPublicShop = basePath === "/rx";

  /**
   * The public shop lists the BoomRx sheet peptides, weight loss, and hormones; staff
   * portals keep every SKU so they can still ring up a derm cream or an ED tablet.
   */
  const catalogPool = isPublicShop ? CLIENT_VISIBLE_PRODUCTS : CATALOG_PRODUCTS;

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

  const openProduct = useCallback(
    (id: string) => {
      if (isPublicShop) {
        router.push(`/rx/product/${id}`);
        return;
      }
      setSelectedId(id);
      setSelVar(0);
      setSupply(30);
    },
    [isPublicShop, router],
  );

  useEffect(() => {
    if (!productParam) return;
    const byId = getCatalogProduct(productParam);
    const byDrug = findProductByDrugKey(productParam);
    const hit = byId ?? byDrug;
    if (!hit) return;
    if (isPublicShop) {
      router.replace(`/rx/product/${hit.id}`);
      return;
    }
    openProduct(hit.id);
  }, [productParam, openProduct, isPublicShop, router]);

  const selectedProduct = selectedId ? getCatalogProduct(selectedId) : undefined;

  const priceOf = useCallback(
    (p: CatalogProduct) =>
      isPublicShop
        ? (catalogClientMonthlyUsd(p) ?? price30(p, p.variants[0]))
        : price30(p, p.variants[0]),
    [isPublicShop],
  );

  const filteredProducts = useMemo(() => {
    let list: CatalogProduct[] = [];
    if (view === "goal" && activeGoal) {
      list = catalogPool.filter((p) => p.goal === activeGoal);
      if (formFilter !== "All") {
        list = list.filter((p) => formGroup(p.form) === formFilter);
      }
    } else if (view === "all") {
      list = [...catalogPool];
      if (formFilter !== "All") {
        list = list.filter((p) => formGroup(p.form) === formFilter);
      }
    } else if (view === "search") {
      const q = query.trim().toLowerCase();
      list = catalogPool.filter((p) => {
        const mono = getMonograph(p.drugKey);
        return `${p.name} ${p.category} ${p.goal} ${mono.name ?? ""}`
          .toLowerCase()
          .includes(q);
      });
    }
    list = filterCatalogByPrice(list, priceFilter, priceOf);
    const sorted = sortCatalogProducts(list, sort, priceOf);
    if (!isPublicShop) return sorted;
    const seen = new Set<string>();
    return sorted.filter((p) => {
      if (seen.has(p.drugKey)) return false;
      seen.add(p.drugKey);
      return true;
    });
  }, [view, activeGoal, formFilter, query, priceFilter, sort, priceOf, catalogPool, isPublicShop]);

  const formChips = useMemo(() => {
    const pool =
      view === "goal" && activeGoal
        ? catalogPool.filter((p) => p.goal === activeGoal)
        : view === "all"
          ? catalogPool
          : [];
    if (!pool.length) return [];
    const groups = Array.from(new Set(pool.map((p) => formGroup(p.form))));
    return ["All", ...groups];
  }, [view, activeGoal, catalogPool]);

  const bestSellers = useMemo(
    () =>
      HERO_DRUG_KEYS.map((k) =>
        isPublicShop ? findClientProductByDrugKey(k) : findProductByDrugKey(k),
      ).filter((p): p is CatalogProduct => !!p && (!isPublicShop || isClientVisibleProduct(p))),
    [isPublicShop],
  );

  /** One SKU per compound so the shelf is a store, not a duplicate catalog dump. */
  const storeShelf = useMemo(() => {
    const seen = new Set<string>();
    const out: CatalogProduct[] = [];
    for (const p of sortCatalogProducts([...catalogPool], "featured", priceOf)) {
      if (seen.has(p.drugKey)) continue;
      seen.add(p.drugKey);
      out.push(p);
      if (out.length >= 12) break;
    }
    return out;
  }, [catalogPool, priceOf]);

  const popularProducts = isPublicShop ? storeShelf : bestSellers;

  const bundles = useMemo(
    () => {
      /** Clients get the SKU they can open; staff keep plain catalog order. */
      const pickProduct = (drugKey: string) =>
        isPublicShop ? findClientProductByDrugKey(drugKey) : findProductByDrugKey(drugKey);

      return CATALOG_BUNDLES.map((b) => {
        const resolved = b.pick
          .map((pk) => {
            const p = pickProduct(pk[0]);
            if (!p) return null;
            return {
              id: p.id,
              v: 0,
              name: p.name,
              retail: isPublicShop
                ? (catalogClientMonthlyUsd(p) ?? price30(p, p.variants[0]))
                : price30(p, p.variants[0]),
            };
          })
          .filter(Boolean) as { id: string; v: number; name: string; retail: number }[];

        const leadProduct = resolved[0] ? getCatalogProduct(resolved[0].id) : undefined;
        const consultHref =
          isPublicShop && leadProduct
            ? `${catalogConsultRoute(leadProduct).href}&stack=${b.id}`
            : undefined;

        const { total, price, save } = bundlePrice(resolved.map((r) => r.retail));

        /**
         * A stack is only offered to clients when every product in it is still on the
         * client shop — otherwise the card would quote a protocol the shopper cannot
         * open. Kit consumables are exempt: they are part of the protocol rather than
         * something the shopper browses to, so the GLP-1 Kickstart still offers its
         * month of supplies. Staff keep all seven.
         */
        const clientVisible = b.pick.every((pk) => {
          const p = pickProduct(pk[0]);
          if (!p) return false;
          return isKitComponentProduct(p) || isClientVisibleProduct(p);
        });

        return {
          ...b,
          accent: goalAccent(b.tagline),
          consultHref,
          clientVisible,
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
      });
    },
    [addItem, openCart, isPublicShop],
  );

  /**
   * Staff home still shows every stack. The public shop no longer merchandises
   * stacks on the storefront — shoppers pick a protocol, then start intake.
   */
  const stackPool = useMemo(
    () => (isPublicShop ? bundles.filter((b) => b.clientVisible) : bundles),
    [bundles, isPublicShop],
  );

  const goalBlurb =
    CATALOG_GOALS.find((g) => g.id === activeGoal)?.blurb ?? "";

  const browseTitle =
    view === "goal"
      ? STORE_AISLE_LABEL[activeGoal ?? ""] ?? activeGoal ?? "Browse"
      : view === "search"
        ? "Search results"
        : view === "all"
          ? "Shop all"
          : "";

  const browseSub =
    view === "goal"
      ? goalBlurb
      : view === "search"
        ? `Showing matches for "${query}"`
        : view === "all"
          ? "Every protocol we review in Illinois — starting price on the shelf, dose at consult."
          : "";

  return (
    <div
      className="relative min-h-screen font-sans text-black"
      style={{ background: REGEN_SHOP_PAGE_WASH }}
    >
      <RegenShopStickyNav
        basePath={basePath}
        items={isPublicShop ? regenClientShopNav(CLIENT_SHOP_GOALS) : REGEN_SHOP_NAV}
        onGoHome={() => {
          if (view === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
          navigate({});
        }}
        searchValue={query}
        onSearchChange={onSearchChange}
        searchPlaceholder={isPublicShop ? "Search the shop…" : undefined}
      />

      {view === "home" ? (
        isPublicShop ? (
          <>
            <RegenStoreHome
              goals={CLIENT_SHOP_GOALS}
              products={storeShelf}
              onSelectGoal={(goal) => navigate({ goal })}
              onShopAll={() => navigate({ browse: "all" })}
            />
            <section id="faq" className={`${SECTION_SCROLL} bg-transparent px-6 py-16 lg:py-20`}>
              <div className="mx-auto max-w-[1200px]">
                <JourneySectionHead
                  light
                  eyebrow="Before you start"
                  title="Questions,"
                  titleAccent="answered"
                  description="Clear answers before intake. Still unsure? Book a free consult."
                />
                <div className="mx-auto mt-11 flex max-w-[860px] flex-col gap-3">
                  {REGEN_SHOP_FAQS.map((faq) => (
                    <details
                      key={faq.q}
                      className="group overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(230,0,126,0.35)]"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-serif text-lg font-bold text-black marker:content-none group-open:text-[#E6007E]">
                        {faq.q}
                        <span className="text-2xl font-normal text-[#E6007E] group-open:hidden">+</span>
                        <span className="hidden text-2xl font-normal text-[#E6007E] group-open:inline">
                          –
                        </span>
                      </summary>
                      <p className="px-6 pb-5 text-[15px] font-medium leading-relaxed text-black/75">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
        <>
          <div id="top" className={SECTION_SCROLL}>
            <RxScienceHomeHero
              onExploreGoals={scrollToShopByGoal}
              showExtraEntryPoints
            />
          </div>

          <RxFindYourPeptideCta />

          <RegenGoalTheater
            onSelectGoal={(goal) => navigate({ goal })}
            showCounts
            products={catalogPool}
            clientOnly={false}
          />

          <section id="popular" className={`${SECTION_SCROLL} bg-transparent px-6 py-16 lg:py-20`}>
            <div className="mx-auto max-w-[1200px]">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">
                    Client favorites
                  </p>
                  <h2 className="mt-1 font-serif text-3xl font-black text-black lg:text-4xl">
                    Popular <span className="text-[#FF2D8E]">protocols</span>
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate({ browse: "all" })}
                  className="rounded-full border-2 border-[#FF2D8E] px-4 py-2 text-sm font-bold text-[#E6007E] transition hover:bg-[#FF2D8E] hover:text-black"
                >
                  View full catalog →
                </button>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {popularProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpen={openProduct}
                  />
                ))}
              </div>
            </div>
          </section>

          <RegenStacksTheater
            bundles={stackPool}
            hiddenCount={0}
          />

          <RegenHowItWorksTheater
            onStartShopping={scrollToShopByGoal}
            onShopWeightLoss={() => navigate({ goal: "Lose Weight" })}
            consultFlow={false}
          />

          <div className={SECTION_SCROLL}>
            <RxPatientJourneyBand surface="rose" />
          </div>

          <RegenScienceTheater onShopGoals={scrollToShopByGoal} />

          <section id="faq" className={`${SECTION_SCROLL} bg-transparent px-6 py-16 lg:py-24`}>
            <div className="mx-auto max-w-[1200px]">
              <JourneySectionHead
                light
                eyebrow="Common Q & A"
                title="Your questions,"
                titleAccent="answered"
                description="Clear answers before you start intake. Still unsure? Book a free consult with our NP-led team."
              />
              <div className="mx-auto mt-11 flex max-w-[860px] flex-col gap-3">
                {REGEN_SHOP_FAQS.map((faq) => (
                  <details
                    key={faq.q}
                    className="group overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(230,0,126,0.35)]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-serif text-lg font-bold text-black marker:content-none group-open:text-[#E6007E]">
                      {faq.q}
                      <span className="text-2xl font-normal text-[#E6007E] group-open:hidden">+</span>
                      <span className="hidden text-2xl font-normal text-[#E6007E] group-open:inline">
                        –
                      </span>
                    </summary>
                    <p className="px-6 pb-5 text-[15px] font-medium leading-relaxed text-black/75">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </>
        )
      ) : (
        <section className="bg-transparent px-6 py-10">
          <div className="mx-auto max-w-[1200px]">
            <button
              type="button"
              onClick={() => navigate({})}
              className="text-sm font-semibold text-[#E6007E] hover:underline"
            >
              ← Back to RE GEN
            </button>
            <h1 className="mt-4 font-serif text-4xl font-extrabold text-black">{browseTitle}</h1>
            <p className="mt-2 max-w-2xl text-black/65">{browseSub}</p>
            {isPublicShop ? (
              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {CLIENT_SHOP_GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => navigate({ goal })}
                    className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold shadow-[3px_3px_0_0_rgba(230,0,126,0.35)] transition ${
                      activeGoal === goal
                        ? "border-black bg-[#FF2D8E] text-black"
                        : "border-black bg-white text-black hover:bg-[#FFF0F7] hover:text-[#E6007E]"
                    }`}
                  >
                    {STORE_AISLE_LABEL[goal] ?? goal}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => navigate({ browse: "all" })}
                  className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-black shadow-[3px_3px_0_0_#000] ${
                    view === "all"
                      ? "border-black bg-[#FF2D8E] text-black"
                      : "border-black bg-white text-black"
                  }`}
                >
                  Shop all
                </button>
              </div>
            ) : null}
            <p className="mt-3 text-sm font-semibold text-black/45">
              {filteredProducts.length} {isPublicShop ? "on the shelf" : "products"}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-black/45">
                Sort
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as CatalogSort)}
                  className="rounded-lg border-2 border-black/15 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-black"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low → high</option>
                  <option value="price-desc">Price: high → low</option>
                  <option value="name">Name A–Z</option>
                </select>
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["all", "Any price"],
                    ["under-100", "Under $100"],
                    ["100-250", "$100–250"],
                    ["250-500", "$250–500"],
                    ["over-500", "$500+"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPriceFilter(id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      priceFilter === id
                        ? "border-2 border-black bg-[#FF2D8E] text-black"
                        : "border border-black/20 text-black/65 hover:border-[#FF2D8E]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {!isPublicShop && formChips.length > 2 && (
              <div className="sticky top-[120px] z-20 mt-6 -mx-1 flex flex-wrap gap-2 bg-white/90 px-1 py-3 backdrop-blur">
                {formChips.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormFilter(f)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      f === formFilter
                        ? "border-2 border-black bg-[#FF2D8E] text-black shadow-[3px_3px_0_0_#000]"
                        : "border-2 border-black/15 bg-white text-black/70 hover:border-[#FF2D8E]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <p className="mt-12 text-center text-black/45">No products match your filters.</p>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpen={isPublicShop ? undefined : openProduct}
                    consultMode={isPublicShop}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white px-6 py-12 text-black">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-serif text-xl font-extrabold tracking-[0.14em] text-[#E6007E]">RE GEN</p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-black/70">
            RE GEN is the telehealth prescription arm of Hello Gorgeous Med Spa, NP-directed
            by Ryan Kent, FNP-BC. Nothing here is sold over the counter — every request starts
            with an intake and a consult, and your NP sets the final protocol and price.
            Information on this site is educational, not medical advice. Prices shown are
            starting points. Research peptides are used under provider supervision and are not
            FDA-approved to treat, cure, or prevent disease.{" "}
            <strong>74 W. Washington St, Oswego, IL 60543 · (630) 636-6193</strong>
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link href="/rx" className="font-semibold text-[#E6007E] hover:underline">
              RE GEN home
            </Link>
            <Link href="/rx/request" className="font-semibold text-[#E6007E] hover:underline">
              Need help starting?
            </Link>
            <Link href="/book" className="font-semibold text-[#E6007E] hover:underline">
              Book in-spa
            </Link>
            {/* Carried over from the journey band so returning patients keep a refill path. */}
            {isPublicShop ? (
              <Link href="/rx/care" className="font-semibold text-[#E6007E] hover:underline">
                Returning patient? Refills
              </Link>
            ) : null}
          </div>
        </div>
      </footer>

      {selectedProduct && !isPublicShop && (
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
