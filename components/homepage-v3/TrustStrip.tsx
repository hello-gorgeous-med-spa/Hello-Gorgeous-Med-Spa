"use client";

import { BEST_OF_OSWEGO } from "@/lib/best-of-oswego";

const trustItems = [
  { title: BEST_OF_OSWEGO.primary },
  { title: "NP on site · 7 days a week" },
  { title: "InMode Trifecta provider" },
  { title: "Oswego, IL · family-owned" },
];

export function TrustStrip() {
  return (
    <section className="border-b-4 border-black bg-black py-5">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-center gap-2.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#E6007E]" aria-hidden />
              <span className="text-sm font-bold text-white leading-snug">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
