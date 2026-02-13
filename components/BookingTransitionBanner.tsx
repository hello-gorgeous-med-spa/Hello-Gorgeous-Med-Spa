"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const CUTOFF_DATE = new Date("2026-02-28T23:59:59");

export default function BookingTransitionBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissedUntil = localStorage.getItem("hg_banner_dismissed_until");
    if (dismissedUntil && new Date(dismissedUntil) > new Date()) {
      setDismissed(true);
    }

    const diff = CUTOFF_DATE.getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    setDaysLeft(days > 0 ? days : 0);
  }, []);

  if (!mounted) return null;

  const isActive = process.env.NEXT_PUBLIC_BOOKING_TRANSITION_ACTIVE !== "false";
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

  const isExpired = new Date() > CUTOFF_DATE;

  return (
    <div className="w-full bg-gradient-to-r from-pink-600 via-pink-500 to-pink-600 text-white text-sm md:text-base font-semibold text-center px-4 py-3 relative animate-fade sticky top-0 z-50 shrink-0">
      <a href="/book-now" className="block w-full hover:opacity-90 transition pr-8">
        {!isExpired ? (
          <>
            ✨ BIG NEWS — We&apos;ve launched the Hello Gorgeous Operating System! ✨
            <span className="block md:inline">
              {" "}
              Fresha booking will only be available through February 28.
            </span>
            {daysLeft !== null && (
              <span className="block md:inline font-bold">
                {" "}
                Fresha booking closes in {daysLeft} day{daysLeft === 1 ? "" : "s"}.
              </span>
            )}
            <span className="block md:inline underline ml-2">Book Direct</span>
          </>
        ) : (
          <>
            All bookings are now processed through the Hello Gorgeous Operating System.
            <span className="underline ml-2">Book Now</span>
          </>
        )}
      </a>

      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 p-1"
        aria-label="Dismiss banner"
      >
        <X size={18} />
      </button>
    </div>
  );
}
