import type { Metadata } from "next";

import { RegenAffiliateDashboard } from "@/components/regen/RegenAffiliateDashboard";

export const metadata: Metadata = {
  title: "Partner Dashboard",
  robots: { index: false, follow: false },
};

export default function AffiliatesDashboardPage() {
  return <RegenAffiliateDashboard />;
}
