"use client";

import { useEffect } from "react";

import { useCart } from "@/lib/regen/cart-context";

/**
 * Clears the local bag after a successful Square redirect so patients
 * don't re-checkout the same items when they return to /rx.
 */
export function ClearCartOnPaidOrder({ orderRef }: { orderRef: string }) {
  const { clearCart, items } = useCart();

  useEffect(() => {
    if (!orderRef || items.length === 0) return;
    clearCart();
  }, [orderRef, clearCart, items.length]);

  return null;
}
