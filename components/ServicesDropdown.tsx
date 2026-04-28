"use client";

import Link from "next/link";

import { BOOKING_URL } from "@/lib/flows";
import { SERVICES_MENU_GOALS, SERVICES_MENU_HERO, type MenuItemBadge } from "@/lib/services-menu-data";

function BadgePill({ kind }: { kind: MenuItemBadge }) {
  const label =
    kind === "exclusive"
      ? "EXCLUSIVE"
      : kind === "popular"
        ? "POPULAR"
        : kind === "new"
          ? "NEW"
          : kind === "vip"
            ? "VIP"
            : "PKG";
  return (
    <span className="inline-flex items-center rounded-full bg-[#FF2D8E] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
      {label}
    </span>
  );
}

export function ServicesDropdown({
  isOpen,
  onClose,
  onMouseEnter,
}: {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
}) {
  if (!isOpen) return null;

  const hero = SERVICES_MENU_HERO;

  return (
    <div
      className="fixed left-0 right-0 top-16 z-50 overflow-x-hidden border-b-4 border-black bg-white shadow-2xl"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
      role="navigation"
      aria-label="Services menu"
    >
      <div className="h-2 bg-gradient-to-r from-[#E6007E] via-[#FF2D8E] to-[#E6007E]" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {/* Hero — InMode Trifecta */}
        <div
          className="relative mb-8 overflow-hidden rounded-2xl border-4 border-black bg-gradient-to-br from-brand-50 via-white to-brand-50 p-6 md:p-8"
          style={{ boxShadow: "8px 8px 0 0 rgba(255, 45, 142, 0.55)" }}
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FF2D8E]/15 blur-3xl" aria-hidden />
          <div className="relative z-10">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="text-2xl" aria-hidden>
                ⭐
              </span>
              <h3 className="bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] bg-clip-text text-2xl font-black text-transparent md:text-3xl">
                {hero.name}
              </h3>
              {hero.badge && (
                <span className="rounded-full border-2 border-black bg-[#E6007E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Exclusive to Hello Gorgeous
                </span>
              )}
            </div>
            <p className="mb-6 max-w-3xl text-sm font-medium text-black md:text-base">{hero.subtitle}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {hero.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className="group flex flex-col rounded-xl border-2 border-black/10 bg-white p-4 transition-all hover:border-[#E6007E] hover:shadow-md"
                >
                  <div className="mb-1 flex items-center gap-2">
                    {item.icon && <span className="text-lg">{item.icon}</span>}
                    <span className="text-sm font-bold text-black group-hover:text-[#E6007E]">{item.name}</span>
                    {item.badge && <BadgePill kind={item.badge} />}
                  </div>
                  {item.description && <p className="text-xs font-medium text-black/60">{item.description}</p>}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Goal-based columns */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES_MENU_GOALS.map((section) => (
            <div key={section.id} className="min-w-0">
              <div className="mb-3 border-b-2 border-brand-200 pb-2">
                <h4 className="text-base font-black text-black">{section.name}</h4>
                <p className="mt-1 text-xs font-medium text-black/60">{section.subtitle}</p>
              </div>
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-start justify-between gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-brand-50"
                    >
                      <span className="flex min-w-0 items-start gap-2">
                        {item.icon && (
                          <span className="shrink-0 text-base" aria-hidden>
                            {item.icon}
                          </span>
                        )}
                        <span className="text-sm font-semibold text-black group-hover:text-[#E6007E]">{item.name}</span>
                      </span>
                      {item.badge && <BadgePill kind={item.badge} />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-stretch justify-between gap-4 border-t-2 border-black/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm font-medium text-black/70">Not sure which treatment is right for you?</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/services"
              onClick={onClose}
              className="text-sm font-bold text-[#E6007E] underline decoration-2 underline-offset-4 hover:text-[#FF2D8E]"
            >
              View all services
            </Link>
            <Link
              href={BOOKING_URL}
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full bg-[#E6007E] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(230,0,126,0.35)] transition hover:bg-[#FF2D8E]"
            >
              Book free consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
