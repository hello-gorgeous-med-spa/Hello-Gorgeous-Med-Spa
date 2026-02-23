"use client";

import { useState } from "react";

export type FAQItem = { question: string; answer: string };

export function FAQAccordion({ items, className = "" }: { items: FAQItem[]; className?: string }) {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <div className={className}>
      {items.map((item, i) => (
        <div
          key={i}
          className="border-b border-black/10 last:border-b-0"
        >
          <button
            type="button"
            onClick={() => setOpenId(openId === i ? null : i)}
            className="w-full py-4 flex items-center justify-between text-left font-semibold text-black hover:text-[#E6007E] transition-colors"
            aria-expanded={openId === i}
          >
            <span>{item.question}</span>
            <span className="text-xl text-[#E6007E] shrink-0 ml-2">
              {openId === i ? "−" : "+"}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              openId === i ? "max-h-96" : "max-h-0"
            }`}
          >
            <p className="pb-4 text-gray-600 text-sm leading-relaxed">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
