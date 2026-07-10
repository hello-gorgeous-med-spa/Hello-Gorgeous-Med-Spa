import type { Metadata } from "next";

import { AdminRegenPortalShell } from "@/components/admin/AdminRegenPortalShell";

export const metadata: Metadata = {
  title: "RE GEN Portal | Hello Gorgeous Admin",
  description:
    "Staff shoppable RE GEN catalog — browse goals, stacks, and checkout for patient-assisted orders.",
  robots: { index: false, follow: false },
};

export default function AdminRegenPortalPage() {
  return <AdminRegenPortalShell />;
}
