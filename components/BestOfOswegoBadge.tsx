"use client";

import { BEST_OF_OSWEGO } from "@/lib/best-of-oswego";

type Variant = "full" | "compact" | "inline" | "list";

interface BestOfOswegoBadgeProps {
  variant?: Variant;
  className?: string;
}

/** Full badge — trophy + primary ranking, for hero/header */
export function BestOfOswegoBadge({ variant = "full", className = "" }: BestOfOswegoBadgeProps) {
  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/50 text-[#FFD700] text-xs font-bold uppercase tracking-wider ${className}`}
      >
        <span>🏆</span>
        <span>{BEST_OF_OSWEGO.badgeShort}</span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <span className={`inline-flex items-center gap-1.5 text-[#FFD700] font-semibold ${className}`}>
        <span>🏆</span>
        <span>#{BEST_OF_OSWEGO.rankings[0].rank} {BEST_OF_OSWEGO.primary}</span>
      </span>
    );
  }

  if (variant === "list") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {BEST_OF_OSWEGO.rankings.map((r) => (
          <span
            key={r.label}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700] text-xs font-semibold"
          >
            <span>🏆</span>
            <span>#{r.rank} {r.label}</span>
          </span>
        ))}
      </div>
    );
  }

  // full
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/10 border-2 border-[#FFD700]/60 text-[#FFD700] ${className}`}
    >
      <span className="text-xl">🏆</span>
      <div>
        <p className="font-bold text-sm uppercase tracking-wider">Best of Oswego {BEST_OF_OSWEGO.year}</p>
        <p className="text-xs font-semibold opacity-90">#{BEST_OF_OSWEGO.rankings[0].rank} {BEST_OF_OSWEGO.primary}</p>
      </div>
    </div>
  );
}
