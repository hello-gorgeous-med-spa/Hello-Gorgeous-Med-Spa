"use client";

import Link from "next/link";
import { useState } from "react";

import { CatalogCartButton } from "@/components/regen/catalog/CatalogProductCard";
import { REGEN_SHOP_BOOK_HREF, REGEN_SHOP_NAV } from "@/lib/regen-shop-nav";

type Props = {
  basePath?: string;
  /** When browsing a goal/search, reset catalog to home. */
  onGoHome?: () => void;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

function navHref(href: string, basePath: string) {
  if (href.startsWith("#")) return `${basePath}${href}`;
  return href;
}

export function RegenShopStickyNav({
  basePath = "/rx",
  onGoHome,
  showSearch = true,
  searchValue = "",
  onSearchChange,
}: Props) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/82 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-6 py-3.5">
        <button
          type="button"
          onClick={onGoHome}
          className="flex shrink-0 items-center gap-2.5 text-left font-bold"
          aria-label="RE GEN home"
        >
          <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-[13px] font-extrabold text-white">
            HG
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-base text-white">Hello Gorgeous</span>
            <span className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FF2D8E]">
              RE GEN
            </span>
          </span>
        </button>

        <button
          type="button"
          className="rounded-lg border border-white/20 px-3 py-1.5 text-sm font-bold text-white lg:hidden"
          onClick={() => setNavOpen((o) => !o)}
          aria-expanded={navOpen}
          aria-label="Toggle menu"
        >
          Menu
        </button>

        <div className="hidden items-center gap-6 text-[14px] lg:flex">
          {REGEN_SHOP_NAV.map((item) => {
            const href = navHref(item.href, basePath);
            return item.href.startsWith("#") ? (
              <a
                key={item.href}
                href={href}
                className="text-white/75 transition hover:text-white"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={href}
                className="text-white/75 transition hover:text-white"
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={REGEN_SHOP_BOOK_HREF}
            className="inline-flex items-center justify-center rounded-full bg-[#FF2D8E] px-5 py-2.5 text-[14px] font-extrabold text-black transition hover:-translate-y-0.5 hover:bg-white"
          >
            Book Now
          </Link>
          <CatalogCartButton />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <CatalogCartButton />
        </div>
      </div>

      {showSearch ? (
        <div className="border-t border-white/10 px-6 py-3">
          <div className="relative mx-auto max-w-[1200px]">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search treatments, goals, ingredients…"
              className="h-[42px] w-full rounded-full border border-white/15 bg-[#0a0206] pl-11 pr-4 text-sm text-white outline-none ring-[#FF2D8E] placeholder:text-white/40 focus:ring-2"
            />
          </div>
        </div>
      ) : null}

      {navOpen ? (
        <div className="border-t border-white/10 px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {REGEN_SHOP_NAV.map((item) => {
              const href = navHref(item.href, basePath);
              return item.href.startsWith("#") ? (
                <a
                  key={item.href}
                  href={href}
                  className="text-white/85"
                  onClick={() => setNavOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={href}
                  className="text-white/85"
                  onClick={() => setNavOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={REGEN_SHOP_BOOK_HREF}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#FF2D8E] px-7 py-3.5 text-base font-extrabold text-black"
              onClick={() => setNavOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
