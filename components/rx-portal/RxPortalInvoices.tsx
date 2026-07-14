"use client";

import { Suspense } from "react";

import { RxInvoicesTool } from "@/components/admin/RxInvoicesTool";
import { RxPortalShell } from "@/components/rx-portal/RxPortalShell";

export function RxPortalInvoices() {
  return (
    <RxPortalShell title="Invoices">
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden p-2 sm:p-4">
        <Suspense fallback={<p className="p-6 text-slate-500 text-sm">Loading invoices…</p>}>
          <RxInvoicesTool />
        </Suspense>
      </div>
    </RxPortalShell>
  );
}
