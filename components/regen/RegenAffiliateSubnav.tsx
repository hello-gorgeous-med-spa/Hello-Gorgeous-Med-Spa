"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AFFILIATE_NAV } from "@/lib/regen/affiliate-marketing";

const BRAND = { teal: "#1FB8A6", pink: "#EF1A6E" };

export function RegenAffiliateSubnav() {
  const pathname = usePathname() || "";

  return (
    <div className="border-b border-white/10 bg-black/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6 py-3">
        {AFFILIATE_NAV.map((item) => {
          const regenHref = `/regen${item.href}`;
          const active =
            item.href === "/affiliates"
              ? pathname === "/affiliates" || pathname === "/regen/affiliates"
              : pathname === item.href ||
                pathname === regenHref ||
                pathname.startsWith(`${item.href}/`) ||
                pathname.startsWith(`${regenHref}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${
                active ? "text-black" : "text-white/70 hover:text-white"
              }`}
              style={active ? { background: BRAND.teal } : { background: "rgba(255,255,255,0.06)" }}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/affiliates/apply"
          className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white"
          style={{ background: BRAND.pink }}
        >
          Apply
        </Link>
      </div>
    </div>
  );
}
