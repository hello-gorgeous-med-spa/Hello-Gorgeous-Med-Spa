"use client";

import Link from "next/link";
import { THE_BOOK } from "@/lib/the-book";

/**
 * Compact floating badge for The Book — minimal footprint homepage placement.
 * Replaces the full TheBookHomeSection when less space is needed.
 */
export function TheBookBadge() {
  return (
    <div className="fixed bottom-24 right-4 z-40 md:bottom-6 md:right-6">
      <Link
        href={THE_BOOK.slugPath}
        className="group flex items-center gap-3 rounded-full bg-black/90 backdrop-blur-md border border-[#E6007E]/40 pl-4 pr-5 py-2.5 shadow-xl shadow-black/30 hover:border-[#E6007E] hover:shadow-[#E6007E]/20 transition-all"
      >
        {/* Mini book icon */}
        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#2d1520] to-black border border-white/10">
          <span className="text-lg">📖</span>
        </span>
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-widest text-[#E6007E] font-bold">New</p>
          <p className="text-sm font-semibold text-white leading-tight group-hover:text-[#E6007E] transition-colors">
            The Book
          </p>
        </div>
      </Link>
    </div>
  );
}
