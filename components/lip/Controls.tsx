"use client";

import { useState } from "react";
import type { SimulationLevel } from "@/utils/lipMorph";

const OPTIONS: { label: string; value: SimulationLevel; tooltip: string }[] = [
  { label: "Original", value: "original", tooltip: "Your natural lip shape." },
  { label: "Lip Flip", value: "lipFlip", tooltip: "Subtle vertical eversion for a natural lift." },
  { label: "0.5 Syringe", value: "half", tooltip: "Light enhancement with minimal projection." },
  { label: "1 Syringe", value: "one", tooltip: "Adds balanced projection and enhances cupid's bow definition." },
  { label: "1.5 Syringes", value: "oneHalf", tooltip: "More definition while maintaining natural proportions." },
  { label: "2 Syringes", value: "two", tooltip: "Full enhancement—the maximum we simulate for safe, realistic outcomes." },
];

interface ControlsProps {
  value: SimulationLevel;
  onChange: (level: SimulationLevel) => void;
}

export function Controls({ value, onChange }: ControlsProps) {
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <div key={opt.value} className="relative">
            <button
              type="button"
              onClick={() => onChange(opt.value)}
              onMouseEnter={() => setHoveredTooltip(opt.value)}
              onMouseLeave={() => setHoveredTooltip(null)}
              className={`
                px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200
                ${value === opt.value
                  ? "bg-[#FF2D8E] text-white shadow-md"
                  : "bg-white border border-[#000000] text-[#000000] hover:border-[#FF2D8E]/50 hover:bg-[#FFFFFF]"
                }
              `}
            >
              {opt.label}
            </button>
            {hoveredTooltip === opt.value && (
              <div className="absolute left-0 right-0 top-full mt-1 z-10 px-3 py-2 rounded-lg bg-[#000000] text-white text-xs max-w-[220px] shadow-lg">
                {opt.tooltip}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-[#000000] text-xs">
        Enhancements are intentionally capped to reflect safe, realistic outcomes.
      </p>
    </div>
  );
}
