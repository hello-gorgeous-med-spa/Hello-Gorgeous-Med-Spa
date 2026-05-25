"use client";

import dynamic from "next/dynamic";

const BrowMappingTool = dynamic(
  () => import("@/components/admin/brow-mapping/BrowMappingTool").then((m) => m.BrowMappingTool),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <p className="text-sm font-semibold text-black/70">Loading Brow Mapping Intelligence…</p>
      </div>
    ),
  },
);

export function BrowMappingPageClient() {
  return <BrowMappingTool />;
}
