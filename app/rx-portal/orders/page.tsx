import { Suspense } from "react";

import { RxPortalOrderHistory } from "@/components/rx-portal/RxPortalOrderHistory";

export default function RxPortalOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-500">Loading orders…</div>}>
      <RxPortalOrderHistory />
    </Suspense>
  );
}
