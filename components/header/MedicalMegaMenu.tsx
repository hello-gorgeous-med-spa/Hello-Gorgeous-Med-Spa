"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { RegenLogo } from "@/components/regen/RegenLogo";
import { BOOKING_URL } from "@/lib/flows";
import { SHOP_RX_NAV } from "@/lib/medical-mega-menu";
import {
  REGEN_CATEGORY_HUBS,
  REGEN_EXPLORE_FOOTER,
  type RxCategoryHub,
  type RxCategoryHubId,
} from "@/lib/rx-category-hubs";

const MEGA_MENU_TOP = "top-[7.75rem]";

function ExploreRow({
  hub,
  active,
  onSelect,
  onClose,
}: {
  hub: RxCategoryHub;
  active: boolean;
  onSelect: () => void;
  onClose: () => void;
}) {
  return (
    <Link
      href={hub.hubPath}
      onClick={onClose}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      className={`group flex items-center justify-between gap-3 rounded-lg px-3 py-3 transition ${
        active ? "bg-neutral-100" : "hover:bg-neutral-50"
      }`}
    >
      <span
        className={`text-[15px] font-medium ${
          active ? "text-neutral-900" : "text-neutral-700 group-hover:text-neutral-900"
        }`}
      >
        {hub.navLabel}
      </span>
      <svg
        className={`h-4 w-4 shrink-0 transition ${
          active ? "text-neutral-900" : "text-neutral-300 group-hover:text-neutral-500"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

function PreviewProduct({
  product,
  onClose,
}: {
  product: RxCategoryHub["products"][number];
  onClose: () => void;
}) {
  return (
    <Link
      href={product.href}
      onClick={onClose}
      className="group flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 transition hover:border-neutral-300 hover:shadow-sm"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-neutral-50">
        <Image
          src={product.image}
          alt=""
          fill
          className="object-contain p-1"
          sizes="56px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-neutral-900 group-hover:text-neutral-700">
          {product.name}
          {product.rx ? (
            <sup className="ml-0.5 text-[9px] font-medium text-neutral-400">Rx</sup>
          ) : null}
        </p>
        <p className="truncate text-xs text-neutral-500">{product.priceLabel}</p>
      </div>
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
  initialCategoryId?: RxCategoryHubId;
}) {
  const [activeId, setActiveId] = useState<RxCategoryHubId>(
    initialCategoryId ?? REGEN_CATEGORY_HUBS[0]!.id,
  );

  useEffect(() => {
    if (isOpen && initialCategoryId) {
      setActiveId(initialCategoryId);
    }
  }, [isOpen, initialCategoryId]);

  if (!isOpen) return null;

  const active =
    REGEN_CATEGORY_HUBS.find((hub) => hub.id === activeId) ?? REGEN_CATEGORY_HUBS[0]!;
  const previewProducts = active.products.slice(0, 3);

  return (
    <div
      className={`fixed left-0 right-0 z-50 border-t border-neutral-200 bg-white shadow-2xl ${MEGA_MENU_TOP}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="mx-auto max-w-6xl px-6 py-6 max-h-[calc(100vh-5.5rem)] overflow-y-auto overscroll-contain">
        <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-5">
          <RegenLogo width={150} onClick={onClose} />
          <Link
            href={SHOP_RX_NAV.href}
            onClick={onClose}
            className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
          >
            REGEN home →
          </Link>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,240px)_1fr]">
          <nav aria-label="Explore REGEN categories">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Explore
            </p>
            <ul className="space-y-0.5">
              {REGEN_CATEGORY_HUBS.map((hub) => (
                <li key={hub.id}>
                  <ExploreRow
                    hub={hub}
                    active={hub.id === activeId}
                    onSelect={() => setActiveId(hub.id)}
                    onClose={onClose}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100">
                <Image
                  src={active.previewImage}
                  alt={active.previewAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 480px"
                  priority
                />
              </div>
              <div className="mt-5">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                  {active.hero.eyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
                  {active.hero.title}{" "}
                  {active.hero.titleAccent ? (
                    <span className="text-neutral-600">{active.hero.titleAccent}</span>
                  ) : null}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">
                  {active.hero.subtitle}
                </p>
                <Link
                  href={active.hubPath}
                  onClick={onClose}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Explore {active.navLabel.toLowerCase()} →
                </Link>
              </div>
            </div>

            {previewProducts.length > 0 ? (
              <aside className="flex flex-col gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                  Shop
                </p>
                {previewProducts.map((product) => (
                  <PreviewProduct key={product.id} product={product} onClose={onClose} />
                ))}
              </aside>
            ) : null}
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {REGEN_EXPLORE_FOOTER.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={onClose}
                className="text-xs font-medium text-neutral-500 transition hover:text-neutral-900"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-xs text-neutral-500">
              NP-supervised · telehealth when required · ship to home · Illinois patients
            </p>
            <Link
              href={BOOKING_URL}
              onClick={onClose}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800"
            >
              Book $49 consult
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
