"use client";

import {
  VITAMIN_B4G2,
  VITAMIN_B4G2_OFFER_BLURB,
  VITAMIN_INJECTION_UNIT_USD,
  VITAMIN_TREATMENT_PLANS,
  VITAMIN_WEEKS_PER_CYCLE,
  vitaminCheatSheetRows,
} from "@/lib/proposals/vitamin-injections";

type Props = {
  /** Compact for admin builder; fuller for client share. */
  variant?: "staff" | "client";
  className?: string;
};

export function VitaminInjectionCheatSheet({ variant = "client", className = "" }: Props) {
  const rows = vitaminCheatSheetRows();
  const isStaff = variant === "staff";

  return (
    <aside
      className={`rounded-2xl border-4 border-black bg-white p-4 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)] ${className}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">
        {isStaff ? "Offer sheet" : "What these injections do"}
      </p>
      <h3 className="mt-1 text-lg font-black text-black">Vitamin Bar cheat sheet</h3>
      <p className="mt-2 text-sm leading-relaxed text-black/75">{VITAMIN_B4G2_OFFER_BLURB}</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {VITAMIN_TREATMENT_PLANS.map((plan) => (
          <div
            key={plan.id}
            className="rounded-xl border-2 border-black/10 bg-[#FFF0F7] px-3 py-2 text-center"
          >
            <p className="text-[10px] font-bold uppercase tracking-wide text-black/50">
              {plan.months}-month plan
            </p>
            <p className="text-xl font-black text-[#E6007E]">${plan.priceUsd}</p>
            <p className="text-[11px] font-medium text-black/70">
              {plan.shots} shots · save ${plan.retailUsd - plan.priceUsd}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-black/55">
        Draw-up math: {VITAMIN_WEEKS_PER_CYCLE} weeks × ${VITAMIN_INJECTION_UNIT_USD} = $
        {VITAMIN_B4G2.packRetailUsd} retail · B4G2 = ${VITAMIN_B4G2.packPromoUsd} (
        {VITAMIN_B4G2.paidShots} paid + {VITAMIN_B4G2.freeShots} free).
      </p>

      <ul className="mt-4 divide-y divide-black/10 border-t border-black/10">
        {rows.map((row) => (
          <li key={row.id} className="flex flex-wrap items-start justify-between gap-2 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-black">{row.name}</p>
              <p className="text-xs leading-snug text-black/70">{row.benefit}</p>
              {isStaff ? (
                <p className="mt-0.5 text-[11px] font-medium text-[#E6007E]">{row.offerLine}</p>
              ) : null}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-black text-[#E6007E]">${row.priceUsd}</p>
              {row.memberPriceUsd != null ? (
                <p className="text-[10px] text-black/50">Member ${row.memberPriceUsd}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
