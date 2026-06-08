"use client";

import { useMemo, useState } from "react";

import { BOOKING_URL } from "@/lib/flows";
import {
  IV_BAG_PRESETS,
  IV_BAG_SIZES,
  IV_BAG_TARGET_RANGE,
  addonsByCategory,
  buildIvBagBookingNote,
  calculateIvBagQuote,
  toggleAddonSelection,
  type IvBagSizeId,
} from "@/lib/iv-bag-builder";
import {
  TRIFECTA_GLASS,
  trifectaAccent,
  trifectaButtonGradient,
} from "@/lib/trifecta-tokens";

function glassStyle(accentIndex: number) {
  const accent = trifectaAccent(accentIndex);
  return {
    backgroundColor: TRIFECTA_GLASS.bg,
    border: `1px solid ${accent.border}`,
  } as const;
}

type Props = {
  onClose: () => void;
};

export function ClientAppIvBagBuilder({ onClose }: Props) {
  const [sizeId, setSizeId] = useState<IvBagSizeId>("500ml");
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const quote = useMemo(() => calculateIvBagQuote(sizeId, addonIds), [sizeId, addonIds]);
  const groups = useMemo(() => addonsByCategory(), []);

  function applyPreset(presetId: string) {
    const preset = IV_BAG_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSizeId(preset.sizeId);
    setAddonIds(preset.addonIds);
  }

  function toggleAddon(id: string) {
    setAddonIds((prev) => toggleAddonSelection(prev, id));
  }

  async function copySummary() {
    const note = buildIvBagBookingNote(quote);
    try {
      await navigator.clipboard.writeText(note);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* ignore */
    }
  }

  const rangeHint = quote.inTargetRange
    ? "In our sweet spot — great value for you & us."
    : quote.belowTarget
      ? `Add a booster to reach our $${IV_BAG_TARGET_RANGE.min}–$${IV_BAG_TARGET_RANGE.max} custom bag range.`
      : `Above $${IV_BAG_TARGET_RANGE.max} — we can trim add-ons at your visit if you prefer.`;

  return (
    <div className="py-5 pb-32">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.25)" }}
          >
            💧 Olympia-sourced · NP-supervised
          </div>
          <h2 className="text-xl font-bold text-white">Build Your IV Bag</h2>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Start at ${IV_BAG_SIZES[0].basePrice} · pick your size · add boosters · most bags ${IV_BAG_TARGET_RANGE.min}–${IV_BAG_TARGET_RANGE.max}
          </p>
        </div>
        <button type="button" onClick={onClose} className="text-sm shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>
          ✕
        </button>
      </div>

      {/* Presets */}
      <section className="mb-6">
        <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
          Quick picks
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {IV_BAG_PRESETS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p.id)}
              className="shrink-0 rounded-xl px-3 py-2 text-left min-w-[7.5rem]"
              style={glassStyle(i % 3)}
            >
              <span className="text-lg">{p.emoji}</span>
              <p className="text-xs font-bold text-white mt-1">{p.name}</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>{p.tagline}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Size */}
      <section className="mb-6">
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
          1 · Choose your bag size
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {IV_BAG_SIZES.map((size, i) => {
            const active = sizeId === size.id;
            const accent = trifectaAccent(i);
            return (
              <button
                key={size.id}
                type="button"
                onClick={() => setSizeId(size.id)}
                className="rounded-2xl p-4 text-left transition"
                style={{
                  ...glassStyle(i),
                  boxShadow: active ? `0 0 0 2px ${accent.bullet}` : undefined,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white">{size.name}</span>
                  <span className="text-lg font-black" style={{ color: accent.subtitle }}>
                    ${size.basePrice}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold" style={{ color: accent.subtitle }}>
                  {size.volumeLabel}
                </p>
                <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{size.fluid}</p>
                <p className="mt-2 text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {size.duration} · {size.blurb}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Add-ons */}
      <section>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
          2 · Add boosters to your bag
        </h3>
        {groups.map((g, gi) => (
          <div key={g.category} className="mb-5">
            <h4 className="mb-2 text-xs font-semibold" style={{ color: trifectaAccent(gi % 3).subtitle }}>
              {g.label}
            </h4>
            <div className="space-y-2">
              {g.addons.map((addon, ai) => {
                const checked = addonIds.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left"
                    style={{
                      ...glassStyle((gi + ai) % 3),
                      backgroundColor: checked ? "rgba(255,45,142,0.08)" : TRIFECTA_GLASS.bg,
                    }}
                  >
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-xs font-bold"
                      style={{
                        border: `2px solid ${checked ? "#FF2D8E" : "rgba(255,255,255,0.2)"}`,
                        background: checked ? "#FF2D8E" : "transparent",
                        color: checked ? "#fff" : "transparent",
                      }}
                    >
                      ✓
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-white text-sm">{addon.name}</span>
                        {addon.consultFirst && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full"
                            style={{ background: "rgba(245,158,11,0.2)", color: "#fbbf24" }}>
                            Screening
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{addon.benefit}</p>
                    </div>
                    <span className="shrink-0 font-bold text-sm" style={{ color: trifectaAccent(ai % 3).subtitle }}>
                      +${addon.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Sticky total + CTA */}
      <div
        className="fixed bottom-[4.5rem] left-0 right-0 z-20 mx-auto max-w-xl px-5"
      >
        <div
          className="rounded-2xl p-4 backdrop-blur-md shadow-2xl"
          style={{ background: "rgba(15,15,15,0.95)", border: "1px solid rgba(255,45,142,0.35)" }}
        >
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                Your bag estimate
              </p>
              <p className="text-3xl font-black text-white">${quote.total}</p>
              <p className="text-[11px] mt-0.5" style={{ color: quote.inTargetRange ? "#4ade80" : "rgba(255,255,255,0.45)" }}>
                {rangeHint}
              </p>
              <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                Base ${quote.basePrice}
                {quote.addonsTotal > 0 ? ` + $${quote.addonsTotal} boosters` : ""}
              </p>
            </div>
            <button type="button" onClick={() => void copySummary()}
              className="text-[10px] font-semibold px-2 py-1 rounded-lg"
              style={{ color: "#93c5fd", border: "1px solid rgba(59,130,246,0.3)" }}>
              {copied ? "Copied!" : "Copy summary"}
            </button>
          </div>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block w-full rounded-xl py-3.5 text-center font-bold text-white"
            style={{ background: trifectaButtonGradient(trifectaAccent(1)) }}
          >
            Book my custom IV →
          </a>
          <p className="mt-2 text-center text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            Final formulation confirmed by our NP · Olympia pharmacy-sourced · Screening required for Rx add-ons
          </p>
        </div>
      </div>
    </div>
  );
}
