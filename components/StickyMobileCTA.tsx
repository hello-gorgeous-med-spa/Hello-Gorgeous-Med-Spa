"use client";

import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/flows";

export function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Gradient fade */}
      <div className="h-4 bg-gradient-to-t from-black to-transparent" />
      
      {/* CTA Bar */}
      <div className="bg-black/95 backdrop-blur-lg border-t border-pink-500/30 px-4 py-3 safe-area-pb">
        <div className="flex gap-3">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[48px] py-4 px-6 bg-hg-pink hover:bg-hg-pinkDeep text-white font-semibold uppercase tracking-widest text-sm text-center rounded-md transition-all duration-300 ease-out flex items-center justify-center"
          >
            Book Now
          </a>
          <a
            href="tel:630-636-6193"
            className="min-h-[48px] py-3 px-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition flex items-center justify-center gap-2"
          >
            <span>📞</span>
            <span className="hidden xs:inline">Call</span>
          </a>
        </div>
      </div>
    </div>
  );
}
