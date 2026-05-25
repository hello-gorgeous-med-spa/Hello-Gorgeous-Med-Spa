import type { Metadata } from "next";

import { BrowMappingTool } from "@/components/admin/brow-mapping/BrowMappingTool";

export const metadata: Metadata = {
  title: "Brow Mapping Intelligence | Hello Gorgeous Admin",
  robots: { index: false, follow: false },
};

export default function AdminBrowMappingPage() {
  return <BrowMappingTool />;
}
