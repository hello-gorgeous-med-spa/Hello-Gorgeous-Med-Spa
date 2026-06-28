"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { GLP1_INTAKE_PATH } from "@/lib/flows";
import {
  getMedicalMegaMenuItem,
  getShopRxCategory,
  MEDICAL_MEGA_MENU_DEFAULT_FEATURED_ID,
} from "@/lib/medical-mega-menu";

const DISMISS_KEY = "hg-shop-rx-floating-dismissed";

export function ShopRxFloatingProduct() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    const id = window.requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const featured = getMedicalMegaMenuItem(MEDICAL_MEGA_MENU_DEFAULT_FEATURED_ID);
  const category = getShopRxCategory("weight-loss");

  if (!featured || !visible) return null;

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  return (
    <aside
      className="fixed bottom-4 left-4 z-40 w-[min(calc(100vw-2rem),340px)] animate-in fade-in slide-in-from-bottom-4 duration-500 sm:bottom-6 sm:left-6"
      aria-label="Featured Hello Gorgeous RX product"
    >
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
        <div className="relative flex gap-3 p-3 pr-10">
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-black/45 transition hover:bg-black/5 hover:text-black"
            aria-label="Dismiss featured product"
          >
            ×
          </button>

          <div className="relative h-[88px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-[#f5f0eb]">
            {featured.imageSrc ? (
              <Image
                src={featured.imageSrc}
                alt={featured.imageAlt ?? featured.label}
                fill
                className="object-contain p-1.5"
                sizes="72px"
              />
            ) : null}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-black/45">
              Most popular · {category?.navLabel ?? "Weight loss"}
            </p>
            <p className="mt-1 font-serif text-[15px] leading-snug text-black">
              {featured.label}
              <sup className="ml-0.5 text-[9px] font-bold text-[#E6007E]">Rx</sup>
            </p>
            {featured.tagline ? (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-black/55">
                {featured.tagline}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-black/8 px-3 py-2.5">
          <Link
            href={category?.hubHref ?? "/glp-1-weight-loss-oswego"}
            className="flex-1 text-center text-xs font-semibold text-black/70 transition hover:text-[#E6007E]"
          >
            Learn more →
          </Link>
          <Link
            href={featured.href ?? GLP1_INTAKE_PATH}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#3d5a4c] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#2f463a]"
          >
            Get started
          </Link>
        </div>
      </div>
    </aside>
  );
}
