import type { Metadata } from "next";

import { RegenAffiliateProgram } from "@/components/regen/RegenAffiliateProgram";

export const metadata: Metadata = {
  title: "Partner Program",
  description:
    "Refer Illinois adults to REGEN RX. Earn a marketing referral fee — never tied to a prescription. Med spas, day spas, and creators.",
};

export default function AffiliatesPage() {
  return <RegenAffiliateProgram />;
}
