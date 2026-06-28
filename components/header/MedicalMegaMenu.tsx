"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BOOKING_URL } from "@/lib/flows";
import {
  getMedicalMegaMenuItem,
  getShopRxCategory,
  MEDICAL_MEGA_MENU_FOOTER,
  resolveShopRxItemImage,
  SHOP_RX_CATEGORIES,
  SHOP_RX_NAV,
  type ShopRxCategoryId,
} from "@/lib/medical-mega-menu";

const MEGA_MENU_TOP = "top-[7.75rem]";

function RxMark() {
  return (
    <sup className="ml-0.5 align-super text-[9px] font-bold tracking-normal text-[#FF2D8E]">
      Rx
    </sup>
  );
}

function MegaMenuItemLink({
  item,
  onClose,
  onHover,
}: {
  item: import("@/lib/medical-mega-menu").MedicalMegaMenuItem;
  onClose: () => void;
  onHover: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClose}
      onMouseEnter={onHover}
      onFocus={onHover}
      className="group flex items-start justify-between gap-2 py-3 transition-colors"
    >
      <span className="text-[15px] font-semibold leading-snug text-white group-hover:text-[#FFB8DC]">
        {item.label}
        {item.rx ? <RxMark /> : null}
      </span>
      {item.badge === "NEW" ? (
        <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/70">
          New
        </span>
      ) : item.badge === "POPULAR" ? (
        <span className="shrink-0 rounded bg-[#E6007E]/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#FFB8DC]">
          Popular
        </span>
      ) : null}
    </Link>
  );
}

export function MedicalMegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  initialCategoryId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  initialCategoryId?: ShopRxCategoryId;
}) {
  const [activeCategoryId, setActiveCategoryId] = useState<ShopRxCategoryId>(
    initialCategoryId ?? SHOP_RX_CATEGORIES[0]!.id,
  );
  const category =
    getShopRxCategory(activeCategoryId) ?? SHOP_RX_CATEGORIES[0]!;
  const [featuredId, setFeaturedId] = useState(category.defaultFeaturedId);

  useEffect(() => {
    if (isOpen && initialCategoryId) {
      setActiveCategoryId(initialCategoryId);
    }
  }, [isOpen, initialCategoryId]);

  useEffect(() => {
    setFeaturedId(category.defaultFeaturedId);
  }, [category.defaultFeaturedId, activeCategoryId]);

  if (!isOpen) return null;

  const featured =
    getMedicalMegaMenuItem(featuredId) ??
    getMedicalMegaMenuItem(category.defaultFeaturedId)!;
  const featuredImage = resolveShopRxItemImage(featured, category.id);

  return (
    <div
      className={`fixed left-0 right-0 z-50 border-t border-white/10 shadow-2xl backdrop-blur-md ${MEGA_MENU_TOP}`}
      style={{ backgroundColor: "rgba(16, 16, 20, 0.98)" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="mx-auto max-w-6xl px-6 py-6 max-h-[calc(100vh-5.5rem)] overflow-y-auto overscroll-contain">
        {/* Category tabs — Good Life style */}
        <div className="flex flex-wrap gap-2 border-b border-dotted border-white/15 pb-4">
          {SHOP_RX_CATEGORIES.map((cat) => {
            const active = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                type="button"
                onMouseEnter={() => setActiveCategoryId(cat.id)}
                onFocus={() => setActiveCategoryId(cat.id)}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                  active
                    ? "bg-[#E6007E] text-white shadow-[2px_2px_0_0_rgba(230,0,126,0.45)]"
                    : "bg-white/5 text-white/55 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat.navLabel}
              </button>
            );
          })}
          <Link
            href={SHOP_RX_NAV.href}
            onClick={onClose}
            className="ml-auto hidden items-center self-center text-xs font-semibold text-[#FFB8DC] underline underline-offset-2 hover:text-white sm:inline-flex"
          >
            {category.exploreLabel} →
          </Link>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_260px]">
          <div className="grid grid-cols-2 gap-x-10 gap-y-8">
            {category.columns.map((column) => (
              <div key={column.heading}>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFB8DC]/85">
                  {column.heading}
                </p>
                <ul>
                  {column.items.map((item, index) => (
                    <li
                      key={item.id}
                      className={index > 0 ? "border-t border-dotted border-white/15" : undefined}
                    >
                      <MegaMenuItemLink
                        item={item}
                        onClose={onClose}
                        onHover={() => setFeaturedId(item.id)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <aside className="hidden lg:flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Featured</p>
            {featuredImage.src ? (
              <div className="relative mt-4 aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <Image
                  src={featuredImage.src}
                  alt={featuredImage.alt}
                  fill
                  className="object-contain p-4"
                  sizes="260px"
                />
              </div>
            ) : null}
            <p className="mt-4 text-lg font-bold leading-tight text-white">
              {featured.label}
              {featured.rx ? <RxMark /> : null}
            </p>
            {featured.tagline ? (
              <p className="mt-2 text-[11px] font-bold uppercase leading-relaxed tracking-[0.12em] text-[#E6007E]">
                {featured.tagline}
              </p>
            ) : null}
            <Link
              href={featured.href}
              onClick={onClose}
              className="mt-5 inline-flex items-center justify-center rounded-full border-2 border-black bg-[#E6007E] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#FF2D8E]"
            >
              Get started →
            </Link>
            <Link
              href={category.hubHref}
              onClick={onClose}
              className="mt-3 text-center text-xs font-semibold text-white/50 underline underline-offset-2 hover:text-[#FFB8DC]"
            >
              {category.exploreLabel}
            </Link>
          </aside>
        </div>

        <div className="mt-8 border-t border-dotted border-white/15 pt-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {MEDICAL_MEGA_MENU_FOOTER.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={onClose}
                className="text-xs font-semibold text-white/50 transition hover:text-[#FFB8DC]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/40 max-w-lg">
              NP-supervised · telehealth when required · ship to home · Illinois patients
            </p>
            <Link
              href={BOOKING_URL}
              onClick={onClose}
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#E6007E] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#FF2D8E]"
            >
              Book $49 consult
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
