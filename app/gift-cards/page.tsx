import type { Metadata } from "next";

import { GiftCardShopSection } from "@/components/gift-cards/GiftCardShopSection";
import { pageMetadata, SITE } from "@/lib/seo";
import { squareGiftCardUrl } from "@/lib/gift-cards";

export const metadata: Metadata = pageMetadata({
  title: "eGift Cards | Hello Gorgeous Med Spa | Oswego, IL",
  description:
    "Purchase Hello Gorgeous Med Spa eGift cards online — 13 gorgeous designs, instant email delivery, any amount from $25. Redeem on Botox, facials, IV therapy & more in Oswego, IL.",
  path: "/gift-cards",
});

export default function GiftCardsPage() {
  const purchaseUrl = squareGiftCardUrl({ utmMedium: "gift_cards_page" });

  return (
    <>
      <GiftCardShopSection variant="full" />

      <section className="border-t-4 border-black bg-black text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-black text-[#FFB8DC]">How it works</h2>
          <ol className="mt-6 space-y-4 text-left text-sm text-white/85 max-w-md mx-auto">
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E6007E] text-xs font-black">1</span>
              <span>Click <strong>Purchase eGift Card</strong> — opens secure Square checkout.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E6007E] text-xs font-black">2</span>
              <span>Pick your <strong>amount</strong> and your favorite <strong>design</strong> from our collection.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E6007E] text-xs font-black">3</span>
              <span>We email the gift instantly — or schedule delivery for a special day.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E6007E] text-xs font-black">4</span>
              <span>Redeem at <strong>{SITE.name}</strong>, 74 W Washington St, Oswego — Naperville, Aurora & Fox Valley welcome.</span>
            </li>
          </ol>
          <a
            href={purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl border-2 border-[#FF2D8E] bg-[#FF2D8E] px-8 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-black"
          >
            🎁 Buy an eGift Card now
          </a>
        </div>
      </section>
    </>
  );
}
