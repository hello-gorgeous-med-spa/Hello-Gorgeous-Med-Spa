import type { Metadata } from "next";

import { RegenAffiliatePlaybook } from "@/components/regen/RegenAffiliatePlaybook";

export const metadata: Metadata = {
  title: "Partner Playbook",
  description: "REGEN RX partner playbook and manual — talking points for Illinois referrals.",
  robots: { index: false, follow: false },
};

export default function AffiliatesPlaybookPage() {
  return <RegenAffiliatePlaybook />;
}
