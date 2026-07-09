"use client";

import Image from "next/image";

import { useCart } from "@/lib/regen/cart-context";
import {
  REGEN_CATALOG_LOGO,
  getMonograph,
  getProtocol,
  goalAccent,
  productImage,
  productInitials,
  type CatalogProduct,
  type SupplyDays,
} from "@/lib/regen/catalog";
import { catalogLineId, price30, price90, supplyPrice } from "@/lib/regen/catalog/pricing";
import { formatCatalogMoney } from "./CatalogProductCard";

type ProductDetailDrawerProps = {
  product: CatalogProduct;
  variantIndex: number;
  supply: SupplyDays;
  onClose: () => void;
  onVariantChange: (index: number) => void;
  onSupplyChange: (supply: SupplyDays) => void;
};

export function ProductDetailDrawer({
  product,
  variantIndex,
  supply,
  onClose,
  onVariantChange,
  onSupplyChange,
}: ProductDetailDrawerProps) {
  const { addItem } = useCart();
  const mono = getMonograph(product.drugKey);
  const proto = getProtocol(product.drugKey);
  const idx = Math.min(variantIndex, product.variants.length - 1);
  const variant = product.variants[idx];
  const p30 = price30(product, variant);
  const p90 = price90(product, variant);
  const current = supply === 90 ? p90 : p30;
  const img = productImage(product.drugKey);
  const accent = goalAccent(product.goal);

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
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-[rgba(10,10,10,0.45)]"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[520px] flex-col overflow-y-auto bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.15)]"
        role="dialog"
        aria-modal
        aria-label={product.name}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-lg text-black/60 hover:text-black"
          aria-label="Close"
        >
          ×
        </button>

        {img ? (
          <div className="relative h-[230px] w-full bg-[#0a0a0a]">
            <Image src={img} alt="" fill className="object-cover" sizes="520px" />
            <Image
              src={REGEN_CATALOG_LOGO}
              alt="RE GEN"
              width={88}
              height={22}
              className="absolute left-3.5 top-3.5 opacity-95"
            />
          </div>
        ) : (
          <div className="px-6 pt-8">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold text-white"
              style={{ backgroundColor: accent }}
            >
              {productInitials(product.name)}
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF2D8E]">
              {product.goal}
            </p>
            <h2 className="mt-1 font-serif text-[28px] font-extrabold leading-tight text-[#0a0a0a]">
              {mono.name || product.name}
            </h2>
            <p className="mt-1 text-sm text-[#666]">{mono.tagline}</p>
          </div>

          <div className="rounded-2xl bg-[#FFF0F7] p-4">
            <p className="font-serif text-[30px] font-extrabold text-[#FF2D8E]">
              {formatCatalogMoney(current)}
            </p>
            <p className="text-sm text-black/60">
              {supply === 90 ? "90-day supply" : "30-day supply"}
            </p>
          </div>

          {product.variants.length > 1 && (
            <div>
              <p className="mb-2 text-sm font-bold text-black/70">Strength</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((vr, i) => (
                  <button
                    key={vr.strength}
                    type="button"
                    onClick={() => onVariantChange(i)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      i === idx
                        ? "border-2 border-[#FF2D8E] bg-[#FFF0F7] text-[#0a0a0a]"
                        : "border border-black/15 bg-white text-[#555]"
                    }`}
                  >
                    {vr.strength} · {formatCatalogMoney(price30(product, vr))}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-bold text-black/70">Supply length</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onSupplyChange(30)}
                className={`flex-1 rounded-[14px] px-4 py-3 text-left transition ${
                  supply === 30
                    ? "border-2 border-[#FF2D8E] bg-[#FFF0F7]"
                    : "border border-black/15 bg-white"
                }`}
              >
                <span className="block text-sm font-bold">30-day supply</span>
                <span className="text-[#FF2D8E]">{formatCatalogMoney(p30)}</span>
              </button>
              <button
                type="button"
                onClick={() => onSupplyChange(90)}
                className={`relative flex-1 rounded-[14px] px-4 py-3 text-left transition ${
                  supply === 90
                    ? "border-2 border-[#FF2D8E] bg-[#FFF0F7]"
                    : "border border-black/15 bg-white"
                }`}
              >
                <span className="absolute -top-2 right-2 rounded-full bg-[#16a34a] px-2 py-0.5 text-[10px] font-bold text-white">
                  SAVE 10%
                </span>
                <span className="block text-sm font-bold">90-day supply</span>
                <span className="text-[#FF2D8E]">{formatCatalogMoney(p90)}</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="w-full rounded-[22px] bg-[#FF2D8E] py-4 text-base font-bold text-white shadow-[0_8px_24px_rgba(255,45,142,0.28)] transition hover:bg-[#E6007E]"
          >
            Add to cart
          </button>

          {mono.what && (
            <section>
              <h3 className="text-sm font-bold text-[#0a0a0a]">What it is</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/80">{mono.what}</p>
            </section>
          )}

          {mono.benefits && mono.benefits.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-[#0a0a0a]">Benefits</h3>
              <ul className="mt-2 space-y-1.5">
                {mono.benefits.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-black/80">
                    <span className="text-[#16a34a]">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {mono.howUsed && (
            <section>
              <h3 className="text-sm font-bold text-[#0a0a0a]">How it&apos;s used</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/80">{mono.howUsed}</p>
            </section>
          )}

          {proto && (
            <section className="rounded-2xl bg-[#FFF0F7] p-4">
              <h3 className="text-sm font-bold text-[#0a0a0a]">Typical protocol</h3>
              {proto.route && (
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#E6007E]">
                  {proto.route}
                </p>
              )}
              {proto.summary && (
                <p className="mt-2 text-sm text-black/80">{proto.summary}</p>
              )}
              {proto.phases && proto.phases.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {proto.phases.map((ph) => (
                    <div
                      key={ph.label}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs"
                    >
                      <span className="font-bold">{ph.label}</span>
                      <span className="text-black/60"> · {ph.dose} · {ph.freq}</span>
                    </div>
                  ))}
                </div>
              )}
              {proto.howTo && (
                <p className="mt-3 text-sm text-black/75">{proto.howTo}</p>
              )}
              <p className="mt-2 text-xs italic text-black/55">
                Your provider confirms your exact dose after intake review.
              </p>
            </section>
          )}

          {mono.contra && mono.contra.length > 0 && (
            <section className="rounded-2xl border border-[#FDE8C8] bg-[#FFF9F0] p-4">
              <h3 className="text-sm font-bold text-[#B45309]">Not for you if</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#7c4a12]">
                {mono.contra.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          {mono.side && mono.side.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-black/70">Possible side effects</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-black/60">
                {mono.side.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
          )}

          {mono.note && (
            <p className="text-sm italic text-black/55">{mono.note}</p>
          )}

          <p className="border-t border-black/10 pt-4 text-xs leading-relaxed text-black/50">
            Educational information only — not medical advice. A Hello Gorgeous provider
            reviews every order before anything ships. Compounded medications are prepared
            under provider supervision and are not FDA-approved to treat, cure, or prevent
            disease.
          </p>
        </div>
      </aside>
    </>
  );
}
