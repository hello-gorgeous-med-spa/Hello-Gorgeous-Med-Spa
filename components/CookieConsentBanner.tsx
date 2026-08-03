"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getConsentStatus,
  setConsentStatus,
  type ConsentStatus,
} from "@/lib/cookie-consent";

/**
 * Cookie consent banner matching HG brand (pink/black stamp style).
 *
 * Displays at the bottom of the screen until user accepts or declines.
 * Choice is persisted to localStorage. Fully accessible with keyboard navigation.
 */
export function CookieConsentBanner() {
  const [status, setStatus] = useState<ConsentStatus | "loading">("loading");

  useEffect(() => {
    setStatus(getConsentStatus());
  }, []);

  const handleAccept = () => {
    setConsentStatus("accepted");
    setStatus("accepted");
    // Trigger a custom event so GoogleAnalytics can react immediately
    window.dispatchEvent(new CustomEvent("hg:consent-updated"));
  };

  const handleDecline = () => {
    setConsentStatus("declined");
    setStatus("declined");
  };

  // Don't render during SSR or after user has decided
  if (status === "loading" || status !== null) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6"
    >
      <div
        className="
          mx-auto max-w-2xl
          rounded-2xl border-4 border-black bg-white
          shadow-[6px_6px_0_0_rgba(230,0,126,0.4)]
          p-5 sm:p-6
        "
      >
        <h2
          id="cookie-banner-title"
          className="text-lg font-bold text-black mb-2"
        >
          We value your privacy
        </h2>
        <p id="cookie-banner-desc" className="text-sm text-black/80 mb-4">
          We use cookies for analytics and to improve your experience. Essential
          cookies keep the site working. Marketing cookies help us understand
          how you use our site.{" "}
          <Link
            href="/privacy"
            className="text-[#E6007E] underline hover:text-[#FF2D8E] focus:outline-none focus:ring-2 focus:ring-[#E6007E] focus:ring-offset-1 rounded"
          >
            Privacy Policy
          </Link>
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAccept}
            className="
              flex-1 px-5 py-2.5 rounded-full
              bg-gradient-to-r from-[#FF2D8E] to-[#E6007E]
              text-white font-semibold text-sm
              border-2 border-black
              shadow-[3px_3px_0_0_rgba(0,0,0,1)]
              hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5
              focus:outline-none focus:ring-2 focus:ring-[#E6007E] focus:ring-offset-2
              transition-all duration-150
            "
          >
            Accept All
          </button>
          <button
            onClick={handleDecline}
            className="
              flex-1 px-5 py-2.5 rounded-full
              bg-white text-black font-semibold text-sm
              border-2 border-black
              shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]
              hover:shadow-[1px_1px_0_0_rgba(0,0,0,0.2)] hover:translate-x-0.5 hover:translate-y-0.5
              hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
              transition-all duration-150
            "
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
}
