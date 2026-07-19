"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { trackEvent } from "@/components/GoogleAnalytics";
import { CLIENT_APP } from "@/lib/client-app";

const PROMO_IMAGE = "/images/marketing/hello-gorgeous-app-popup-promo.png";
const STORAGE_KEY = "hg_get_app_popup_dismissed";
/** Runs after consult lead popup so we don't stack two modals. */
const SHOW_AFTER_MS = 14000;
const SCROLL_THRESHOLD = 0.55;
const DISMISS_DAYS = 7;
const CONSULT_STORAGE_KEY = "hg_consult_popup_dismissed";

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
      // Wait until consult lead popup has been dismissed so we don't stack modals
      try {
        if (!localStorage.getItem(CONSULT_STORAGE_KEY)) return;
      } catch {
        /* ignore */
      }
      shown = true;
      setVisible(true);
      trackEvent("popup_view", { popup: "get_app" });
    };

    const timer = setTimeout(tryShow, SHOW_AFTER_MS);
    const poll = setInterval(tryShow, 2000);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight || 1;
      if (window.scrollY / max >= SCROLL_THRESHOLD) tryShow();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      clearInterval(poll);
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
      className="fixed inset-0 z-[100] flex items-end justify-center p-2 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hg-get-app-popup-title"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[4px]" onClick={handleClose} aria-hidden="true" />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 rounded-full border border-white/30 bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 id="hg-get-app-popup-title" className="sr-only">
          Get the {CLIENT_APP.shortName} App — scan the QR code
        </h2>

        <Link
          href={`${CLIENT_APP.path}?utm_source=website&utm_medium=popup&utm_campaign=get_app_promo`}
          onClick={() => trackEvent("popup_cta", { popup: "get_app", action: "open_app" })}
          className="block"
        >
          <Image
            src={PROMO_IMAGE}
            alt="Get the Hello Gorgeous App — scan QR to book Botox, facials, Morpheus8, Build Your IV Bag from $89, Vitamin Bar and more. Oswego, IL."
            width={1024}
            height={576}
            className="block h-auto w-full"
          />
        </Link>

        <button
          type="button"
          onClick={() => {
            trackEvent("popup_cta", { popup: "get_app", action: "dismiss" });
            handleClose();
          }}
          className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/55 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm transition hover:bg-black/70 hover:text-white"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
