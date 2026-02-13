"use client";

import type { SimulationLevel } from "@/utils/lipMorph";

const OPTIONS: { label: string; value: SimulationLevel }[] = [
  { label: "Original", value: "original" },
  { label: "Lip Flip", value: "lipFlip" },
  { label: "0.5 Syringe", value: "half" },
  { label: "1 Syringe", value: "one" },
  { label: "1.5 Syringes", value: "oneHalf" },
  { label: "2 Syringes", value: "two" },
];

interface ControlsProps {
  value: SimulationLevel;
  onChange: (level: SimulationLevel) => void;
}

export function Controls({ value, onChange }: ControlsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`
            px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200
            ${value === opt.value
              ? "bg-[#E6007E] text-white shadow-md"
              : "bg-white border border-[#EAE4E8] text-[#111111] hover:border-[#E6007E]/50 hover:bg-[#FDF7FA]"
            }
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
