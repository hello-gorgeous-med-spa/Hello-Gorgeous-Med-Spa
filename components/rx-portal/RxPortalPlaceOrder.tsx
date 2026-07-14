"use client";

import Link from "next/link";
import { Suspense } from "react";

import { RegenCatalogPortal } from "@/components/regen/catalog/RegenCatalogPortal";
import { RxPortalShell } from "@/components/rx-portal/RxPortalShell";
import { RX_PORTAL_PHARMACY_PLACE_ORDER_URL } from "@/lib/rx-portal/nav";

const PLACE_ORDER_BASE = "/rx-portal/place-order";

export function RxPortalPlaceOrder() {
  return (
    <RxPortalShell title="Place Order">
      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-wider text-teal-700">
            Patient sale · Hello Gorgeous RX
          </p>
          <h3 className="mt-1 text-lg font-black text-[#0B1F33]">Place Patient Order</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Shop the RE GEN catalog and check out for a patient (staff-assisted sale with{" "}
            <code className="text-xs">sold_by</code> attribution). Use the catalog below.
          </p>
          <Link
            href="#patient-catalog"
            className="inline-flex mt-4 rounded-lg bg-teal-500 px-4 py-2 text-sm font-bold text-[#0B1F33] hover:bg-teal-400"
          >
            Open patient catalog ↓
          </Link>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-wider text-sky-700">
            Compounding pharmacy
          </p>
          <h3 className="mt-1 text-lg font-black text-[#0B1F33]">Order from Pharmacy</h3>
          <p className="mt-2 text-sm text-sky-950/80 leading-relaxed">
            Compounded RX for inventory or patient pickup still uses the pharmacy vendor portal
            until live API credentials are enabled (
            <code className="text-xs">RX_PHARMACY_API_ENABLED</code>).
          </p>
          <a
            href={RX_PORTAL_PHARMACY_PLACE_ORDER_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex mt-4 rounded-lg bg-[#0B1F33] px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
          >
            Open Formulation / FormuConnect portal ↗
          </a>
          <p className="mt-2 text-[11px] text-slate-500">
            Manual until Phase 6 API sync · Chrome recommended
          </p>
        </div>
      </div>

      <div id="patient-catalog" className="scroll-mt-4 rounded-2xl border border-slate-200 overflow-hidden bg-white">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm font-bold text-[#0B1F33]">RE GEN · Patient order catalog</p>
        </div>
        <Suspense
          fallback={
            <div className="flex min-h-[40vh] items-center justify-center text-slate-400">
              Loading catalog…
            </div>
          }
        >
          <RegenCatalogPortal basePath={PLACE_ORDER_BASE} />
        </Suspense>
      </div>
    </RxPortalShell>
  );
}
