"use client";

import { BrowShapeIcon } from "@/components/education/brow-mapping/BrowShapeIcon";
import { BROW_SHAPES, type BrowShapeId } from "@/data/brow-mapping-intelligence";

export function BrowShapePicker({
  value,
  onChange,
}: {
  value: BrowShapeId;
  onChange: (id: BrowShapeId) => void;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[#E6007E]">7 brow shapes</h2>
      <p className="mt-1 text-xs text-gray-600">Preview shape directly on the client photo.</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
        {BROW_SHAPES.map((shape) => (
          <button
            key={shape.id}
            type="button"
            onClick={() => onChange(shape.id)}
            className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2 transition ${
              value === shape.id
                ? "border-[#E6007E] bg-[#FFF0F7] ring-2 ring-[#E6007E]/30"
                : "border-gray-200 hover:border-[#FFB8DC]"
            }`}
          >
            <BrowShapeIcon shapeId={shape.id} active={value === shape.id} />
            <span className="text-[11px] font-bold text-black">{shape.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
