"use client";

import { useState, type ReactNode } from "react";

/** Collapsible pricing — keeps the hero/form clean until the patient asks. */
export function RxIntakePricingAccordion({
  title = "How pricing works",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.25)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left md:px-8"
        aria-expanded={open}
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">Transparent pricing</p>
          <p className="mt-1 text-lg font-bold text-black">{title}</p>
          <p className="mt-1 text-sm text-black/55">
            Your total calculates inside the form when you pick dose &amp; supply cycle.
          </p>
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black text-lg font-bold text-[#E6007E]"
          aria-hidden
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="border-t border-black/10 px-6 pb-6 pt-2 md:px-8 md:pb-8 text-sm text-black/75 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}
