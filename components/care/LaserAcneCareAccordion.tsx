"use client";

import { useState } from "react";

export type CareAccordionItem = {
  id: string;
  title: string;
  children: React.ReactNode;
  /** Visually emphasize (border/background) */
  highlight?: boolean;
};

export function LaserAcneCareAccordion({ items }: { items: CareAccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`rounded-xl border overflow-hidden transition-colors ${
              item.highlight
                ? "border-[#E6007E]/40 bg-[#E6007E]/[0.06] ring-1 ring-[#E6007E]/20"
                : "border-black/10 bg-white"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-black hover:text-[#E6007E] transition-colors"
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <span className="text-xl text-[#E6007E] shrink-0 ml-3">{isOpen ? "−" : "+"}</span>
            </button>
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-out ${
                isOpen ? "max-h-[min(4800px,200vh)]" : "max-h-0"
              }`}
            >
              <div className="px-5 pb-5 pt-0 text-black/80 text-sm leading-relaxed space-y-3 border-t border-black/5">
                {item.children}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
