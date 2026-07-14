"use client";

import { Suspense } from "react";

import { RxInvoicesTool } from "@/components/admin/RxInvoicesTool";

export default function RxInvoicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-black/50">Loading invoices…</div>}>
      <RxInvoicesTool />
    </Suspense>
  );
}
