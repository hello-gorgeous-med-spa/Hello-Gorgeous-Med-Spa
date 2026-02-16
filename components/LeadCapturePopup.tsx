"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "hg_lead_popup_dismissed";
const SHOW_AFTER_MS = 4000; // Show after 4 seconds (reduced urgency, better UX)
const SCROLL_THRESHOLD = 0.35; // Or after 35% scroll
const COOKIE_DAYS = 7;

function shouldShow(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const { at } = JSON.parse(raw);
    const elapsed = Date.now() - at;
    return elapsed > COOKIE_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return true;
  }
}

function dismiss() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now() }));
  } catch {}
}

export function LeadCapturePopup() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    const path = window.location.pathname || "";
    if (path.startsWith("/admin") || path.startsWith("/portal") || path.startsWith("/login")) {
      return;
    }
    if (!shouldShow()) return;

    let shown = false;
    const tryShow = () => {
      if (shown) return;
      shown = true;
      setVisible(true);
    };

    const t = setTimeout(tryShow, SHOW_AFTER_MS);

    const onScroll = () => {
      const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
      if (scrollPct >= SCROLL_THRESHOLD) tryShow();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(t);
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
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:p-6"
      role="dialog"
      aria-label="New client offer"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-pink-500/30 bg-gradient-to-b from-gray-900 to-black p-6 shadow-2xl shadow-pink-500/10">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-full p-1.5 text-black hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <p className="text-pink-400 text-sm font-semibold uppercase tracking-wider">
          New Client Offer
        </p>
        <h3 className="mt-2 text-xl font-bold text-white">
          Get exclusive offers & first access
        </h3>
        <p className="mt-2 text-black text-sm">
          Join our list for seasonal promos, new treatment alerts, and VIP perks. No spam.
        </p>
        <Link
          href="/subscribe"
          onClick={handleClose}
          className="mt-6 block w-full rounded-md bg-hg-pink hover:bg-hg-pinkDeep py-4 text-center font-semibold uppercase tracking-widest text-sm text-white transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg"
        >
          Yes, I want in
        </Link>
        <button
          type="button"
          onClick={handleClose}
          className="mt-3 block w-full text-center text-sm text-black hover:text-black"
        >
          No thanks
        </button>
        <p className="mt-4 text-[10px] text-black leading-tight">
          By signing up you agree to receive marketing messages. Message and data rates may
          apply. Reply STOP to opt out of SMS. We respect your privacy—see our{" "}
          <Link href="/privacy" className="underline hover:text-black">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
