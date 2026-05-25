import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Brow Mapping Intelligence | Hello Gorgeous Admin",
  robots: { index: false, follow: false },
};

export default function AdminBrowMappingPage() {
  return <BrowMappingTool />;
}
