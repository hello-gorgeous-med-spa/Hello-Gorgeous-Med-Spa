"use client";

import { useEffect, useState } from "react";

import { GetAppQrPromo } from "@/components/GetAppQrPromo";
import { trackEvent } from "@/components/GoogleAnalytics";
import { CLIENT_APP } from "@/lib/client-app";

const STORAGE_KEY = "hg_get_app_popup_dismissed";
const SHOW_AFTER_MS = 3500;
const SCROLL_THRESHOLD = 0.12;
const DISMISS_DAYS = 3;

const BLOCKED_PREFIXES = [
  "/admin",
  "/portal",
  "/login",
  "/auth",
  "/pos",
  "/charting",
  "/kiosk",
  "/provider",
  "/app",
];

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

export function GetAppPopup() {
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
      trackEvent("popup_view", { popup: "get_app" });
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

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hg-get-app-popup-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" onClick={handleClose} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-3xl border-4 border-black bg-white shadow-[10px_10px_0_0_rgba(230,0,126,0.45)] overflow-hidden">
        <div
          className="px-5 py-4 text-white border-b-4 border-black"
          style={{ background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)" }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 top-3 rounded-full border-2 border-white/40 bg-white/10 p-1.5 text-white hover:bg-white/25 transition"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">New · Oswego, IL</p>
          <h2 id="hg-get-app-popup-title" className="mt-1 pr-8 text-xl sm:text-2xl font-black leading-tight">
            Get the{" "}
            <span className="text-[#FFB8DC]">{CLIENT_APP.shortName} App</span>
          </h2>
          <p className="mt-1 text-xs text-white/80">Scan the QR — add to your home screen in seconds.</p>
        </div>

        <div className="px-5 py-6">
          <GetAppQrPromo qrSize={168} utmMedium="popup" layout="stack" theme="light" />
          <button
            type="button"
            onClick={() => {
              trackEvent("popup_cta", { popup: "get_app", action: "dismiss" });
              handleClose();
            }}
            className="mt-5 block w-full text-center text-xs text-black/45 hover:text-black/65"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
