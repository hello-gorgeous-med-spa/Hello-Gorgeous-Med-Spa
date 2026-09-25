"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import {
  FORMULATION_HUB_LINKS,
  FORMULATION_NAV_LABEL,
  isFormulationHubPath,
} from "@/lib/regen/formulation-partner";
import { regenHostHref } from "@/lib/regen/refill-request-catalog";

const TEAL = "#0D9488";

export function RegenFormulationNavDropdown() {
  const pathname = usePathname() || "";
  const active = isFormulationHubPath(pathname);
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const show = () => {
    clearTimeout(timeout.current);
    setOpen(true);
  };
  const hide = () => {
    timeout.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative hidden lg:block"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button
        type="button"
        className={`flex items-center gap-1 text-sm font-medium transition-colors ${
          active || open ? "text-white" : "text-gray-400 hover:text-white"
        }`}
        style={active || open ? { color: TEAL } : undefined}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => setOpen(true)}
      >
        {FORMULATION_NAV_LABEL}
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open ? (
        <div className="absolute left-1/2 top-full z-50 min-w-[280px] -translate-x-1/2 pt-3">
          <div
            id={menuId}
            role="menu"
            className="overflow-hidden rounded-2xl border bg-[#111111] shadow-2xl"
            style={{ borderColor: `${TEAL}40` }}
          >
            {FORMULATION_HUB_LINKS.map((link) => {
              const path = pathname.replace(/^\/regen(?=\/|$)/, "") || "/";
              const isCurrent = path === link.href || path.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.id}
                  href={link.id === "compound-shop" ? regenHostHref(link.href) : link.href}
                  role="menuitem"
                  className="block border-b px-4 py-3 last:border-0 hover:bg-white/5"
                  style={{ borderColor: `${TEAL}18` }}
                  onClick={() => setOpen(false)}
                >
                  <span
                    className="block text-sm font-semibold"
                    style={{ color: isCurrent ? TEAL : "#FAF9F6" }}
                  >
                    {link.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-white/50">{link.sub}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
