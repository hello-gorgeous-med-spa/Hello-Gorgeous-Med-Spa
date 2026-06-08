"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  GIFT_CARD_DESIGNS,
  GIFT_CARD_PRESET_AMOUNTS,
  squareGiftCardUrl,
  type GiftCardDesign,
} from "@/lib/gift-cards";

type Props = {
  /** Compact strip for homepage; full for /gift-cards page */
  variant?: "compact" | "full";
  className?: string;
};

export function GiftCardShopSection({ variant = "full", className = "" }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const purchaseUrl = squareGiftCardUrl({
    utmMedium: variant === "compact" ? "homepage_gift_strip" : "gift_cards_page",
  });

  const designs = GIFT_CARD_DESIGNS;
  const current = designs[index] ?? designs[0];

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + designs.length) % designs.length);
    },
    [designs.length],
  );

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => go(1), variant === "compact" ? 4500 : 3800);
    return () => clearInterval(timer);
  }, [go, paused, variant]);

  const isCompact = variant === "compact";

  return (
    <section
      className={`relative overflow-hidden ${className}`}
      style={{
        background: isCompact
          ? "linear-gradient(135deg, #FFF0F7 0%, #ffffff 50%, #fdf2f8 100%)"
          : "linear-gradient(180deg, #FFF0F7 0%, #ffffff 40%, #fafafa 100%)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-labelledby="gift-card-shop-heading"
    >
      {!isCompact && (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(230,0,126,0.12), transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,45,142,0.08), transparent 40%)",
          }}
        />
      )}

      <div
        className={`relative mx-auto max-w-6xl px-4 ${isCompact ? "py-8 md:py-10" : "py-12 md:py-16"}`}
      >
        <div className={`grid items-center gap-8 ${isCompact ? "lg:grid-cols-2" : "lg:grid-cols-[1.05fr_0.95fr]"}`}>
          {/* Slideshow */}
          <div className={isCompact ? "order-2 lg:order-1" : ""}>
            <div
              className="relative mx-auto max-w-md rounded-3xl border-4 border-black bg-white p-3 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
              role="region"
              aria-roledescription="carousel"
              aria-label="Hello Gorgeous eGift card designs"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black">
                {designs.map((design, i) => (
                  <SlideImage key={design.id} design={design} active={i === index} />
                ))}

                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-white/90 text-lg font-bold shadow-md transition hover:bg-[#FF2D8E] hover:text-white"
                  aria-label="Previous design"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-white/90 text-lg font-bold shadow-md transition hover:bg-[#FF2D8E] hover:text-white"
                  aria-label="Next design"
                >
                  ›
                </button>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#FFB8DC]">
                    Design {index + 1} of {designs.length}
                  </p>
                  <p className="text-sm font-bold text-white">{current.name}</p>
                  <p className="text-xs text-white/70">{current.tagline}</p>
                </div>
              </div>

              {/* Dot nav */}
              <div className="mt-3 flex flex-wrap justify-center gap-1.5 px-1">
                {designs.map((d, i) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-6 bg-[#E6007E]" : "w-2 bg-black/15 hover:bg-[#FF2D8E]/50"
                    }`}
                    aria-label={`Show design: ${d.name}`}
                    aria-current={i === index ? "true" : undefined}
                  />
                ))}
              </div>

              {/* Thumbnail strip — desktop full variant only */}
              {!isCompact && (
                <div className="mt-4 hidden gap-2 overflow-x-auto pb-1 md:flex">
                  {designs.map((d, i) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setIndex(i)}
                      className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        i === index ? "border-[#E6007E] ring-2 ring-[#E6007E]/30" : "border-black/10 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={d.image} alt="" fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Copy + purchase */}
          <div className={isCompact ? "order-1 lg:order-2 text-center lg:text-left" : "text-center lg:text-left"}>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E6007E]">
              {isCompact ? "Instant eGift" : "Hello Gorgeous eGift Cards"}
            </p>
            <h2
              id="gift-card-shop-heading"
              className={`mt-2 font-black text-black leading-tight ${
                isCompact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
              }`}
            >
              Give the gift of{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                confidence
              </span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-black/75 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {isCompact
                ? "13 gorgeous designs · email delivery in seconds · redeem on any service at our Oswego med spa."
                : "Browse our full design collection, pick your amount, and checkout securely on Square. Delivered by email — perfect for birthdays, holidays, thank-yous, or just because."}
            </p>

            <div className="mt-5 flex flex-wrap justify-center lg:justify-start gap-2">
              {GIFT_CARD_PRESET_AMOUNTS.map((amt) => (
                <a
                  key={amt}
                  href={purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-[4.25rem] flex-col items-center rounded-xl border-2 border-black bg-white px-3 py-2 text-center shadow-[3px_3px_0_0_rgba(230,0,126,0.25)] transition hover:-translate-y-0.5 hover:border-[#E6007E]"
                >
                  <span className="text-lg font-black text-[#E6007E]">${amt}</span>
                  <span className="text-[9px] font-semibold uppercase tracking-wide text-black/50">Gift</span>
                </a>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3">
              <a
                href={purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border-4 border-black px-6 py-3 text-sm font-black text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition hover:brightness-110"
                style={{ background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)" }}
              >
                <span aria-hidden>🎁</span>
                Purchase eGift Card
                <span aria-hidden>→</span>
              </a>
              {!isCompact && (
                <Link
                  href="/app?tab=deals"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-5 py-3 text-sm font-bold text-black transition hover:border-[#E6007E] hover:text-[#E6007E]"
                >
                  Also in the app
                </Link>
              )}
            </div>

            <p className="mt-4 text-xs text-black/55 max-w-md mx-auto lg:mx-0">
              Secure checkout via{" "}
              <a
                href={purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#E6007E] underline decoration-[#FF2D8E]/40"
              >
                Square eGift
              </a>
              . Choose your favorite design at checkout · instant email delivery · redeem in-spa on any eligible service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SlideImage({ design, active }: { design: GiftCardDesign; active: boolean }) {
  return (
    <div
      className={`absolute inset-0 transition-all duration-700 ease-out ${
        active ? "opacity-100 scale-100 z-[1]" : "opacity-0 scale-[1.03] z-0 pointer-events-none"
      }`}
      aria-hidden={!active}
    >
      <Image
        src={design.image}
        alt={`${design.name} — Hello Gorgeous Med Spa eGift card design`}
        fill
        className="object-contain p-1"
        sizes="(max-width: 768px) 100vw, 420px"
        priority={design.id === GIFT_CARD_DESIGNS[0]?.id}
      />
    </div>
  );
}
