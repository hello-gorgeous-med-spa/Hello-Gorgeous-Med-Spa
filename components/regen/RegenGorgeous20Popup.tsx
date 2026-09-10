"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  GORGEOUS20_CODE,
  GORGEOUS20_HERO,
  GORGEOUS20_LEGAL,
  GORGEOUS20_PERCENT,
  GORGEOUS20_START_HREF,
} from "@/lib/regen-gorgeous20";

const STORAGE_KEY = "regen_gorgeous20_popup_dismissed";
const DISMISS_DAYS = 7;

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

export function RegenGorgeous20Popup() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!shouldShow()) setVisible(false);
  }, []);

  if (!visible) return null;

  const close = () => {
    dismiss();
    setVisible(false);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gorgeous20-popup-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-4 border-black bg-[#0A0A0A] shadow-[8px_8px_0_0_rgba(233,30,140,0.45)]">
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-lg font-bold text-white"
          aria-label="Close savings offer"
        >
          ×
        </button>
        <img
          src={GORGEOUS20_HERO}
          alt="Danielle and a licensed Illinois clinician"
          className="h-44 w-full object-cover object-top"
        />
        <div className="space-y-3 p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#0D9488]">
            Special &amp; savings
          </p>
          <h2 id="gorgeous20-popup-title" className="font-serif text-3xl font-black text-[#FAF9F6]">
            First order {GORGEOUS20_PERCENT}% off
          </h2>
          <p className="text-xl font-black text-[#E91E8C]">{GORGEOUS20_CODE}</p>
          <p className="text-sm font-medium text-white/75">
            Enter the code on the payment screen. Illinois patients. A licensed Illinois clinician prescribes only when it is clinically appropriate.
          </p>
          <Link
            href={GORGEOUS20_START_HREF}
            onClick={close}
            className="block rounded-full bg-[#E91E8C] px-6 py-3 text-center text-sm font-extrabold text-white"
          >
            Start free — use {GORGEOUS20_CODE}
          </Link>
          <p className="text-[11px] leading-relaxed text-white/40">{GORGEOUS20_LEGAL}</p>
        </div>
      </div>
    </div>
  );
}
