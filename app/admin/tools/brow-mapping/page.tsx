import type { Metadata } from "next";

import { BrowMappingPageClient } from "@/components/admin/brow-mapping/BrowMappingPageClient";

export const metadata: Metadata = {
  title: "Brow Mapping Intelligence | Hello Gorgeous Admin",
  robots: { index: false, follow: false },
};

export default function AdminBrowMappingPage() {
  return <BrowMappingPageClient />;
}
