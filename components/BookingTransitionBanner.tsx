"use client";

import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/flows";

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function BookingTransitionBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissedUntil = localStorage.getItem("hg_banner_dismissed_until");
    if (dismissedUntil && new Date(dismissedUntil) > new Date()) {
      setDismissed(true);
    }
  }, []);

  if (!mounted) return null;

  const isActive = process.env.NEXT_PUBLIC_BOOKING_BANNER_ACTIVE !== "false";
  if (!isActive) return null;
  if (dismissed) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    localStorage.setItem("hg_banner_dismissed_until", tomorrow.toISOString());
    setDismissed(true);
  };

  return (
    <div className="w-full bg-black text-[#FF2D8E] text-sm md:text-base font-semibold text-center px-4 py-3 relative animate-fade sticky top-0 z-50 shrink-0">
      <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="block w-full hover:opacity-90 transition pr-8">
        Book your appointment online with Fresha — quick, easy, and secure.
        <span className="underline ml-2">Book Now</span>
      </a>

      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF2D8E] opacity-80 hover:opacity-100 p-1"
        aria-label="Dismiss banner"
      >
        <XIcon size={18} />
      </button>
    </div>
  );
}
