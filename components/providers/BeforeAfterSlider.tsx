"use client";

import Image from "next/image";
import { useState } from "react";

type BeforeAfterSliderProps = {
  beforeUrl: string;
  afterUrl: string;
  alt?: string;
};

export function BeforeAfterSlider({ beforeUrl, afterUrl, alt }: BeforeAfterSliderProps) {
  const [value, setValue] = useState(50);

  return (
    <div className="space-y-3">
      <div className="relative h-72 w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40">
        <Image src={afterUrl} alt={alt || "After"} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" priority={false} />
        <div
          className="absolute inset-y-0 left-0 overflow-hidden border-r border-pink-400/80 shadow-[10px_0_30px_rgba(0,0,0,0.4)]"
          style={{ width: `${value}%` }}
        >
          <Image src={beforeUrl} alt={alt || "Before"} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" priority={false} />
        </div>
        <div className="absolute inset-y-0 left-0 right-0 pointer-events-none flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-800">
            <span>Before</span>
            <div className="h-1 w-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />
            <span>After</span>
          </div>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-pink-500"
        aria-label="Adjust before and after comparison"
      />
    </div>
  );
}
