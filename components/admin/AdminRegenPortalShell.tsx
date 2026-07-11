"use client";

import Link from "next/link";
import { Suspense } from "react";

import { RegenCatalogPortal } from "@/components/regen/catalog/RegenCatalogPortal";

const ADMIN_PORTAL_BASE = "/admin/rx/portal";

export function AdminRegenPortalShell() {
  return (
    <div className="min-h-full bg-[#FFF9FB]">
      <div className="border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/admin/rx/ops"
              className="font-semibold text-[#E6007E] hover:underline"
            >
              ← RX Ops Console
            </Link>
            <span className="text-black/25">|</span>
            <span className="font-bold text-black">RE GEN Portal</span>
            <span className="rounded-full bg-[#FFF0F7] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#E6007E]">
              Staff
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/admin/rx/clinic-sale?mode=regen"
              className="rounded-full border-2 border-black px-3 py-1.5 font-bold text-black hover:bg-black hover:text-white"
            >
              In-clinic sale
            </Link>
            <Link
              href="/admin/rx/my-book"
              className="rounded-full border border-[#E6007E] px-3 py-1.5 font-semibold text-[#E6007E] hover:bg-[#FFF0F7]"
            >
              My book
            </Link>
            <Link
              href="/rx"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-black/15 px-3 py-1.5 font-semibold text-black/70 hover:border-[#E6007E] hover:text-[#E6007E]"
            >
              Public catalog ↗
            </Link>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center text-black/50">
            Loading RE GEN portal…
          </div>
        }
      >
        <RegenCatalogPortal basePath={ADMIN_PORTAL_BASE} />
      </Suspense>
    </div>
  );
}
