"use client";

import type { TinaDaviesPigmentId } from "@/data/brow-mapping-intelligence";
import { PIGMENT_PREVIEW_DISCLAIMER, TINA_DAVIES_PIGMENTS, TINA_PIGMENT_BY_ID } from "@/lib/brow-mapping/pigments";

export function PigmentPicker({
  value,
  onChange,
}: {
  value: TinaDaviesPigmentId;
  onChange: (id: TinaDaviesPigmentId) => void;
}) {
  const active = TINA_PIGMENT_BY_ID[value];

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[#E6007E]">Tina Davies · pigment preview</h2>
      <p className="mt-1 text-xs text-gray-600">Consultation preview only — not a healed-color guarantee.</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TINA_DAVIES_PIGMENTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className={`overflow-hidden rounded-lg border text-left transition ${
              value === p.id ? "border-[#E6007E] ring-2 ring-[#E6007E]/30" : "border-gray-200"
            }`}
          >
            <div className="h-7 w-full" style={{ background: p.hex }} />
            <div className="bg-gray-50 px-2 py-1.5">
              <p className="text-[10px] font-bold text-black">{p.name}</p>
              <p className="text-[9px] text-gray-500">{p.undertone}</p>
            </div>
          </button>
        ))}
      </div>
      {active ? (
        <div className="mt-3 space-y-1 rounded-lg bg-[#FFF0F7] p-3 text-xs text-black">
          <p>
            <strong>Best for:</strong> {active.bestFor}
          </p>
          <p>
            <strong>Caution:</strong> {active.caution}
          </p>
          <p>
            <strong>Modifier:</strong> {active.modifier}
          </p>
        </div>
      ) : null}
      <p className="mt-2 text-[10px] text-gray-500">{PIGMENT_PREVIEW_DISCLAIMER}</p>
    </section>
  );
}
