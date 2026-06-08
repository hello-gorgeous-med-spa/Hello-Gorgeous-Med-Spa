"use client";

import { GiftCardShopSection } from "@/components/gift-cards/GiftCardShopSection";

/** @deprecated Prefer `<GiftCardShopSection />` — kept for legacy imports. */
export function GiftCardBanner() {
  return <GiftCardShopSection variant="compact" className="border-y-4 border-black" />;
}
