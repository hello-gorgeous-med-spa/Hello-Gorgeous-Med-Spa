"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/lib/regen/cart-context";
import { peptideHubSlugFromCatalog } from "@/lib/peptide-hub-from-catalog";
import { peptideTopicHref } from "@/lib/peptides-hub";
import {
  REGEN_CATALOG_LOGO,
  getMonograph,
  getProtocol,
  goalAccent,
  goalSlug,
  productImage,
  productInitials,
  type CatalogProduct,
  type SupplyDays,
} from "@/lib/regen/catalog";
import { catalogLineId, price30, price90, supplyPrice } from "@/lib/regen/catalog/pricing";
import { formatCatalogMoney } from "@/components/regen/catalog/CatalogProductCard";

type ProductDetailPanelProps = {
  product: CatalogProduct;
  /** When true, show back-to-shop link for full page mode */
  pageMode?: boolean;
};

export function ProductDetailPanel({ product, pageMode = false }: ProductDetailPanelProps) {
  const { addItem } = useCart();
  const [variantIndex, setVariantIndex] = useState(0);
  const [supply, setSupply] = useState<SupplyDays>(30);

  const mono = getMonograph(product.drugKey);
  const proto = getProtocol(product.drugKey);
  const idx = Math.min(variantIndex, product.variants.length - 1);
  const variant = product.variants[idx];
  const p30 = price30(product, variant);
  const p90 = price90(product, variant);
  const current = supply === 90 ? p90 : p30;
  const img = productImage(product.drugKey, product.goal);
  const accent = goalAccent(product.goal);
  const educationSlug = peptideHubSlugFromCatalog(product.drugKey, product.name);
  const educationHref = educationSlug ? peptideTopicHref(educationSlug) : null;

  const handleAdd = () => {
    addItem({
      id: catalogLineId(product.id, idx, supply),
      name: product.name,
      priceUsd: supplyPrice(product, variant, supply),
      category: product.goal,
      rx: true,
      image: img,
      variantLabel: variant.strength,
      supplyDays: supply,
    });
  };

  return (
    <div className={pageMode ? "bg-gradient-to-b from-[#FFF0F7] via-white to-[#f5f5f5]" : ""}>
      {pageMode ? (
        <div className="border-b-4 border-black bg-black px-6 py-4">
          <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4">
            <Link
              href={`/rx?goal=${goalSlug(product.goal)}`}
              className="text-sm font-bold text-[#FFB8DC] hover:text-white"
            >
              ← Back to {product.goal}
            </Link>
            <Link href="/rx" className="font-serif text-sm font-extrabold tracking-[0.14em] text-white">
              RE GEN
            </Link>
          </div>
        </div>
      ) : null}

      <div
        className={
          pageMode
            ? "mx-auto grid max-w-[1100px] gap-8 px-6 py-10 lg:grid-cols-2 lg:gap-12 lg:py-14"
            : "flex flex-col"
        }
      >
        {/* Media */}
        <div
          className={
            pageMode
              ? "relative aspect-square overflow-hidden rounded-3xl border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(230,0,126,0.4)]"
              : "relative"
          }
        >
          {img ? (
            <div className={`relative w-full bg-black ${pageMode ? "h-full min-h-[320px]" : "h-[230px]"}`}>
              <Image src={img} alt={product.name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 520px" priority={pageMode} />
              <Image
                src={REGEN_CATALOG_LOGO}
                alt="RE GEN"
                width={88}
                height={22}
                className="absolute left-3.5 top-3.5 opacity-95"
              />
            </div>
          ) : (
            <div
              className={`flex items-center justify-center ${pageMode ? "min-h-[320px]" : "h-[180px] px-6 pt-8"}`}
              style={{
                background: `radial-gradient(circle at 30% 20%, ${accent}55, transparent 55%), linear-gradient(145deg, #1a0a12, #0a0a0a)`,
              }}
            >
              <span className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-white/20 bg-black/40 text-3xl font-black text-white">
                {productInitials(product.name)}
              </span>
            </div>
          )}
        </div>

        {/* Buy panel */}
        <div className={pageMode ? "text-black" : "space-y-5 px-6 pb-10 pt-5 text-white"}>
          <div className={pageMode ? "space-y-4" : "space-y-5"}>
            <div>
              <p
                className={`text-[11px] font-bold uppercase tracking-widest ${pageMode ? "text-[#E6007E]" : "text-[#FFB8DC]"}`}
              >
                {product.goal} · {product.form}
              </p>
              <h1
                className={`mt-2 font-serif font-extrabold leading-tight ${pageMode ? "text-4xl text-black lg:text-5xl" : "text-3xl text-white"}`}
              >
                {product.name}
              </h1>
              <p className={`mt-2 text-sm leading-relaxed ${pageMode ? "text-black/65" : "text-white/65"}`}>
                {mono.tagline || "Compounded prescription · NP-reviewed before ship"}
              </p>
            </div>

            {product.variants.length > 1 && (
              <div>
                <p className={`mb-2 text-xs font-bold uppercase tracking-wide ${pageMode ? "text-black/50" : "text-white/50"}`}>
                  Strength
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.strength}
                      type="button"
                      onClick={() => setVariantIndex(i)}
                      className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition ${
                        i === idx
                          ? "border-black bg-[#FF2D8E] text-black shadow-[2px_2px_0_0_#000]"
                          : pageMode
                            ? "border-black/20 bg-white text-black/70 hover:border-[#E6007E]"
                            : "border-white/20 bg-[#0a0206] text-white/70 hover:border-[#FF2D8E]"
                      }`}
                    >
                      {v.strength}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className={`mb-2 text-xs font-bold uppercase tracking-wide ${pageMode ? "text-black/50" : "text-white/50"}`}>
                Supply
              </p>
              <div className="grid grid-cols-2 gap-2">
                {([30, 90] as const).map((s) => {
                  const price = s === 90 ? p90 : p30;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSupply(s)}
                      className={`rounded-2xl border-2 p-3 text-left transition ${
                        supply === s
                          ? "border-black bg-[#FFF0F7] shadow-[3px_3px_0_0_rgba(230,0,126,0.45)]"
                          : pageMode
                            ? "border-black/15 bg-white hover:border-[#E6007E]"
                            : "border-white/15 bg-[#0a0206] hover:border-[#FF2D8E]"
                      }`}
                    >
                      <p className={`text-xs font-bold ${pageMode ? "text-black/50" : "text-white/50"}`}>
                        {s}-day{s === 90 ? " · save ~10%" : ""}
                      </p>
                      <p className={`mt-1 font-serif text-xl font-extrabold ${pageMode ? "text-[#E6007E]" : "text-[#FF2D8E]"}`}>
                        {formatCatalogMoney(price)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="w-full rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] py-4 text-base font-black text-white shadow-[4px_4px_0_0_#000] transition hover:brightness-110"
            >
              Add {supply === 90 ? "90-day" : "30-day"} · {formatCatalogMoney(current)}
            </button>

            {educationHref ? (
              <Link
                href={educationHref}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black py-3.5 text-sm font-bold transition ${
                  pageMode
                    ? "bg-white text-[#E6007E] hover:bg-[#FFF0F7]"
                    : "border-[#FF2D8E] text-[#FF2D8E] hover:bg-[#FF2D8E] hover:text-black"
                }`}
              >
                Full education page →
              </Link>
            ) : null}
          </div>

          {/* Clinical copy */}
          <div className={`mt-8 space-y-5 ${pageMode ? "rounded-3xl border-2 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]" : ""}`}>
            {mono.what && (
              <section>
                <h2 className={`text-sm font-bold ${pageMode ? "text-[#E6007E]" : "text-white"}`}>What it is</h2>
                <p className={`mt-2 text-sm leading-relaxed ${pageMode ? "text-black/75" : "text-white/80"}`}>{mono.what}</p>
              </section>
            )}

            {mono.benefits && mono.benefits.length > 0 && (
              <section>
                <h2 className={`text-sm font-bold ${pageMode ? "text-[#E6007E]" : "text-white"}`}>Benefits</h2>
                <ul className="mt-2 space-y-1.5">
                  {mono.benefits.map((b) => (
                    <li key={b} className={`flex gap-2 text-sm ${pageMode ? "text-black/75" : "text-white/80"}`}>
                      <span className="text-[#E6007E]">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {mono.howUsed && (
              <section>
                <h2 className={`text-sm font-bold ${pageMode ? "text-[#E6007E]" : "text-white"}`}>How it&apos;s used</h2>
                <p className={`mt-2 text-sm leading-relaxed ${pageMode ? "text-black/75" : "text-white/80"}`}>{mono.howUsed}</p>
              </section>
            )}

            {proto && (
              <section
                className={`rounded-2xl border p-4 ${pageMode ? "border-[#E6007E]/30 bg-[#FFF0F7]" : "border-[#FF2D8E]/25 bg-[#140109]"}`}
              >
                <h2 className={`text-sm font-bold ${pageMode ? "text-black" : "text-white"}`}>Typical protocol</h2>
                {proto.route && (
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#E6007E]">{proto.route}</p>
                )}
                {proto.summary && (
                  <p className={`mt-2 text-sm ${pageMode ? "text-black/75" : "text-white/80"}`}>{proto.summary}</p>
                )}
                <p className={`mt-2 text-xs italic ${pageMode ? "text-black/50" : "text-white/55"}`}>
                  Your provider confirms your exact dose after intake review.
                </p>
              </section>
            )}

            <p className={`border-t pt-4 text-xs leading-relaxed ${pageMode ? "border-black/10 text-black/45" : "border-white/10 text-white/45"}`}>
              Educational information only — not medical advice. A Hello Gorgeous provider reviews every
              order before anything ships. Compounded medications are prepared under provider supervision
              and are not FDA-approved to treat, cure, or prevent disease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
