"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";

export function MembershipsStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 py-3 px-4 bg-black/95 backdrop-blur-md border-t border-[#FF2D8E]/30 safe-area-pb transition-all duration-300"
      role="banner"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
        <p className="text-white text-sm font-medium">
          Ready? No membership required for your first visit.
        </p>
        <Link
          href={BOOKING_URL}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#FF2D8E] text-white font-bold rounded-full text-center hover:opacity-90 transition hover:scale-[1.02] active:scale-[0.98]"
        >
          Book Your Visit →
        </Link>
      </div>
    </div>
  );
}
