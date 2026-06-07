"use client";

import { BEST_OF_OSWEGO } from "@/lib/best-of-oswego";

const trustItems = [
  { title: BEST_OF_OSWEGO.primary, accent: "#ec4899" },
  { title: "NP on site · 7 days a week", accent: "#60a5fa" },
  { title: "InMode Trifecta provider", accent: "#f59e0b" },
  { title: "Oswego, IL · family-owned", accent: "#f472b6" },
];

export function TrustStrip() {
  return (
    <section className="relative overflow-hidden border-b-4 border-black" style={{ backgroundColor: "#000000" }}>
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-0 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full blur-[60px]"
          style={{ backgroundColor: "rgba(236, 72, 153, 0.08)" }}
        />
        <div
          className="absolute right-0 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full blur-[60px]"
          style={{ backgroundColor: "rgba(59, 130, 246, 0.08)" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-5 md:px-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(24, 24, 27, 0.6)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.accent }}
                aria-hidden
              />
              <span className="text-sm font-bold leading-snug text-white">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
