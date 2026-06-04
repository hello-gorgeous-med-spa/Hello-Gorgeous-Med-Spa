"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { trackEvent } from "@/components/GoogleAnalytics";
import { BOOKING_URL } from "@/lib/flows";
import { PEPTIDE_CONSULT_SPECIAL } from "@/lib/peptide-featured";
import { SITE } from "@/lib/seo";

const STORAGE_KEY = "hg_consult49_vitamin_popup_dismissed";
const SHOW_AFTER_MS = 5000;
const SCROLL_THRESHOLD = 0.3;
const DISMISS_DAYS = 7;

const BLOCKED_PREFIXES = ["/admin", "/portal", "/login", "/auth", "/pos", "/charting", "/kiosk", "/provider"];

function shouldShow(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const { at } = JSON.parse(raw) as { at: number };
    return Date.now() - at > DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return true;
  }
}

function dismiss() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function Consult49VitaminPopup() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    const path = window.location.pathname || "";
    if (BLOCKED_PREFIXES.some((p) => path.startsWith(p))) return;
    if (!shouldShow()) return;

    let shown = false;
    const tryShow = () => {
      if (shown) return;
      shown = true;
      setVisible(true);
      trackEvent("popup_view", { popup: "consult49_vitamin" });
    };

    const timer = setTimeout(tryShow, SHOW_AFTER_MS);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight || 1;
      if (window.scrollY / max >= SCROLL_THRESHOLD) tryShow();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mounted]);

  const handleClose = () => {
    dismiss();
    setVisible(false);
  };

  const handleBook = () => {
    trackEvent("popup_cta", { popup: "consult49_vitamin", action: "book" });
    handleClose();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hg-offer-popup-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg rounded-3xl border-4 border-black bg-white shadow-[10px_10px_0_0_rgba(230,0,126,0.45)] overflow-hidden">
        <div
          className="px-6 py-5 text-white border-b-4 border-black"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full border-2 border-white/40 bg-white/10 p-1.5 text-white hover:bg-white/25 transition"
            aria-label="Close offer"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
            Hello Gorgeous Med Spa · Oswego, IL
          </p>
          <h2 id="hg-offer-popup-title" className="mt-2 pr-10 text-2xl sm:text-3xl font-black leading-tight">
            Check us out —{" "}
            <span className="text-[#FFB8DC]">this one&apos;s for you</span>
          </h2>
        </div>

        <div className="px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-4">
              <p className="text-3xl font-black text-[#E6007E]">{PEPTIDE_CONSULT_SPECIAL.price}</p>
              <p className="mt-1 text-sm font-bold text-black">NP-led consultation</p>
              <p className="mt-2 text-xs text-black/70 leading-relaxed">
                Peptides, wellness, hormones &amp; more — personalized plan. Medication priced separately when
                prescribed.
              </p>
            </div>
            <div className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-4">
              <p className="text-3xl font-black text-[#E6007E]">FREE</p>
              <p className="mt-1 text-sm font-bold text-black">Vitamin injection at your visit</p>
              <p className="mt-2 text-xs text-black/70 leading-relaxed">
                B12, Vitamin D, Biotin, or Glutathione — up to $65 value when you come in for your consult.
              </p>
            </div>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-black/80">
            <li className="flex gap-2">
              <span className="text-[#E6007E] font-bold" aria-hidden>
                ✓
              </span>
              <span>
                <strong className="text-black">Full-authority NP on site</strong> — 7 days a week in Oswego
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#E6007E] font-bold" aria-hidden>
                ✓
              </span>
              <span>
                Serving <strong className="text-black">Naperville, Aurora, Plainfield &amp; Yorkville</strong>
              </span>
            </li>
          </ul>

          <a
            href={BOOKING_URL}
            onClick={handleBook}
            className="mt-6 block w-full rounded-full border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] py-4 text-center text-sm font-bold uppercase tracking-widest text-white shadow-[4px_4px_0_0_#111] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#111]"
          >
            Book {PEPTIDE_CONSULT_SPECIAL.price} consult + free vitamin
          </a>
          <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center text-center">
            <Link
              href="/peptides"
              onClick={handleClose}
              className="text-sm font-semibold text-[#E6007E] underline decoration-[#E6007E] underline-offset-4 hover:text-[#FF2D8E]"
            >
              Explore peptide therapy
            </Link>
            <a
              href={`tel:${SITE.phone.replace(/[^0-9+]/g, "")}`}
              onClick={() => trackEvent("popup_cta", { popup: "consult49_vitamin", action: "call" })}
              className="text-sm font-semibold text-black/70 hover:text-[#E6007E]"
            >
              Call {SITE.phone}
            </a>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="mt-4 block w-full text-center text-xs text-black/50 hover:text-black/70"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
