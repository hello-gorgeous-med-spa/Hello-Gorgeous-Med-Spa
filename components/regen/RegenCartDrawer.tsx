"use client";

import { useState } from "react";
import Image from "next/image";

import { useCart } from "@/lib/regen/cart-context";

export function RegenCartDrawer() {
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
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (items.length === 0) return;

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
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">Your cart</h2>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="h-12 w-12 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="mt-4 text-neutral-600">Your cart is empty.</p>
              <p className="mt-1 text-sm text-neutral-500">Add a treatment to get started.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  {item.image && (
                    <div className="relative h-16 w-16 shrink-0 rounded-lg bg-white">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-900">
                      {item.name}
                      {item.rx && <sup className="ml-1 text-xs text-neutral-400">Rx</sup>}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      ${item.priceUsd.toFixed(2)}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded border border-neutral-300 text-neutral-600 hover:bg-neutral-100"
                      >
                        –
                      </button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded border border-neutral-300 text-neutral-600 hover:bg-neutral-100"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-xs text-neutral-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-200 p-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2 text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="mt-4 w-full rounded-lg bg-[#E6007E] py-3.5 text-sm font-semibold text-white transition hover:bg-[#FF2D8E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCheckingOut ? "Redirecting to checkout..." : "Checkout"}
            </button>

            <p className="mt-3 text-center text-xs text-neutral-500">
              A provider must review your intake before any prescription ships.
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
