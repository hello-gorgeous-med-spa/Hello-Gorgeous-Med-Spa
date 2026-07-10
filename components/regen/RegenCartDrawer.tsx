"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import { useCart } from "@/lib/regen/cart-context";
import { formatCatalogMoney } from "@/components/regen/catalog/CatalogProductCard";

export function RegenCartDrawer() {
  const pathname = usePathname();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    shipping,
    total,
    subscribe,
    refillWeeks,
    toggleSubscribe,
    setRefillWeeks,
    hasCatalogItems,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const catalogMode =
    hasCatalogItems ||
    (pathname?.startsWith("/rx/catalog") ?? false) ||
    (pathname?.startsWith("/admin/rx/portal") ?? false);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (catalogMode) {
      setIsCheckingOut(true);
      setError(null);

      try {
        const res = await fetch("/api/regen/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              id: i.id,
              name: i.name,
              priceUsd: i.priceUsd,
              quantity: i.quantity,
              category: i.category,
              rx: i.rx ?? true,
              variantLabel: i.variantLabel,
              supplyDays: i.supplyDays,
            })),
            subscribe,
            refillWeeks,
            goal: items[0]?.category,
            supplyMonths: items.every((i) => i.supplyDays === 90) ? 3 : 1,
          }),
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || "Checkout failed");
        }
        window.location.href = data.checkoutUrl;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Checkout failed");
        setIsCheckingOut(false);
      }
      return;
    }

    setIsCheckingOut(true);
    setError(null);

    try {
      const res = await fetch("/api/regen/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            priceUsd: i.priceUsd,
            quantity: i.quantity,
            category: i.category,
            rx: i.rx,
          })),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Checkout failed");
      }
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={closeCart}
      />

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-xl ${
          catalogMode ? "max-w-[460px]" : "max-w-md"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <h2 className="font-serif text-lg font-extrabold text-[#0a0a0a]">
            {catalogMode ? "Your order" : "Your cart"}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-lg p-2 text-black/50 hover:bg-black/5"
            aria-label="Close cart"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="h-12 w-12 text-black/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="mt-4 text-black/70">Your cart is empty.</p>
              <p className="mt-1 text-sm text-black/50">
                {catalogMode ? "Browse treatments to get started." : "Add a treatment to get started."}
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-black/10 bg-[#FFF9FB] p-4"
                >
                  {item.image && (
                    <div className="relative h-16 w-16 shrink-0 rounded-lg bg-[#0a0a0a]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-[#0a0a0a]">
                      {item.name}
                      {item.rx && <sup className="ml-1 text-xs text-black/40">Rx</sup>}
                    </h3>
                    {catalogMode && item.variantLabel && (
                      <p className="text-xs text-black/55">
                        {item.variantLabel} ·{" "}
                        {item.supplyDays === 90 ? "90-day" : "30-day"} supply ·{" "}
                        {formatCatalogMoney(item.priceUsd)}
                      </p>
                    )}
                    {!catalogMode && (
                      <p className="text-sm text-black/60">
                        ${item.priceUsd.toFixed(2)}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded border border-black/15 text-black/60 hover:bg-white"
                      >
                        –
                      </button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded border border-black/15 text-black/60 hover:bg-white"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-xs text-black/45 hover:text-[#E6007E]"
                      >
                        Remove
                      </button>
                    </div>
                    {catalogMode && (
                      <p className="mt-2 font-serif text-lg font-extrabold text-[#FF2D8E]">
                        {formatCatalogMoney(item.priceUsd * item.quantity)}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {catalogMode && items.length > 0 && (
            <div className="mt-6 rounded-2xl bg-[#FFF0F7] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#0a0a0a]">Auto-refill & save 10%</p>
                  <p className="text-xs text-black/55">Provider confirms eligibility at review.</p>
                </div>
                <button
                  type="button"
                  onClick={toggleSubscribe}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    subscribe ? "bg-[#16a34a]" : "bg-black/20"
                  }`}
                  aria-pressed={subscribe}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      subscribe ? "left-[23px]" : "left-[3px]"
                    }`}
                  />
                </button>
              </div>
              {subscribe && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {([4, 8, 12] as const).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setRefillWeeks(w)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                        refillWeeks === w
                          ? "border-2 border-[#FF2D8E] bg-white text-[#0a0a0a]"
                          : "border border-black/15 bg-white/80 text-black/55"
                      }`}
                    >
                      Every {w} wks
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-black/10 p-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/60">Subtotal</span>
                <span className="font-medium">
                  {catalogMode ? formatCatalogMoney(subtotal) : `$${subtotal.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">
                  {catalogMode ? "Shipping (flat, Illinois)" : "Shipping"}
                </span>
                <span className="font-medium">
                  {catalogMode ? formatCatalogMoney(shipping) : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-black/10 pt-2">
                <span className="font-semibold">Total today</span>
                <span className="font-serif text-[26px] font-extrabold text-[#FF2D8E]">
                  {catalogMode ? formatCatalogMoney(total) : `$${total.toFixed(2)}`}
                </span>
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`mt-4 w-full rounded-full py-3.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                catalogMode
                  ? "bg-[#0a0a0a] hover:bg-[#FF2D8E]"
                  : "bg-[#E6007E] hover:bg-[#FF2D8E]"
              }`}
            >
              {isCheckingOut
                ? "Redirecting to Square…"
                : catalogMode
                  ? "Pay with Square & start intake →"
                  : "Checkout"}
            </button>

            <p className="mt-3 text-center text-xs text-black/50">
              {catalogMode
                ? "Pay securely via Square. Ryan Kent, FNP-BC reviews every order before anything ships."
                : "A provider must review your intake before any prescription ships."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export function CartButton() {
  const { toggleCart, itemCount } = useCart();

  return (
    <button
      type="button"
      onClick={toggleCart}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E6007E] text-xs font-semibold text-white">
          {itemCount}
        </span>
      )}
    </button>
  );
}
