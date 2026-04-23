"use client";

import Link from "next/link";

const PINK = "#E6007E";

export function QuantumRFStickyCta() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-black bg-black p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.45)] md:hidden"
      data-book-now
    >
      <Link
        href="/book"
        className="flex w-full items-center justify-center rounded-md py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-95"
        style={{ backgroundColor: PINK }}
      >
        Book Consultation
      </Link>
    </div>
  );
}
