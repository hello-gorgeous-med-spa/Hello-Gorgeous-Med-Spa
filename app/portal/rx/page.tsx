import type { Metadata } from "next";

import { PortalRxDashboard } from "@/components/portal/PortalRxDashboard";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "My RX | Client Portal",
  description: "Track GLP-1 and peptide refills, pay invoices, and reorder from your Hello Gorgeous patient portal.",
  alternates: { canonical: `${SITE.url}/portal/rx` },
};

export default function PortalRxPage() {
  return <PortalRxDashboard />;
}
