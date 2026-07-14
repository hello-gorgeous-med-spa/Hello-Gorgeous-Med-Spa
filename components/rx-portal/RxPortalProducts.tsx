"use client";

import { AdminRxCatalogContent } from "@/components/admin/AdminRxCatalogContent";
import { RxPortalShell } from "@/components/rx-portal/RxPortalShell";

export function RxPortalProducts() {
  return (
    <RxPortalShell title="RE GEN Formulary">
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <AdminRxCatalogContent />
      </div>
    </RxPortalShell>
  );
}
