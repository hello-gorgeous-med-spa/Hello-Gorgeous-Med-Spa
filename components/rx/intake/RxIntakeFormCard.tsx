"use client";

import type { ReactNode } from "react";

export function RxIntakeFormCard({
  stepIndex,
  stepCount,
  stepTitle,
  stepLabels,
  children,
}: {
  stepIndex: number;
  stepCount: number;
  stepTitle: string;
  /** Optional short labels under progress bar (mobile-friendly) */
  stepLabels?: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
      <div className="border-b border-black/10 bg-gradient-to-r from-[#FFF0F7] to-white px-5 py-5 md:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">
          Step {stepIndex + 1} of {stepCount}
        </p>
        <h2 className="mt-1 text-xl font-black text-black md:text-2xl">{stepTitle}</h2>
        <div className="mt-4 flex gap-1.5" role="progressbar" aria-valuenow={stepIndex + 1} aria-valuemin={1} aria-valuemax={stepCount}>
          {Array.from({ length: stepCount }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i <= stepIndex ? "bg-[#E6007E]" : "bg-black/10"
              }`}
            />
          ))}
        </div>
        {stepLabels && stepLabels.length === stepCount && (
          <div className="mt-2 hidden gap-1 sm:flex">
            {stepLabels.map((label, i) => (
              <span
                key={label}
                className={`flex-1 truncate text-[10px] font-semibold ${
                  i === stepIndex ? "text-[#E6007E]" : "text-black/35"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
