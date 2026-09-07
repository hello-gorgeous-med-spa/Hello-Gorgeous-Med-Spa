import type { Metadata } from "next";

import { RegenAffiliateMarketing } from "@/components/regen/RegenAffiliateMarketing";

export const metadata: Metadata = {
  title: "Partner Marketing Kit",
  description:
    "REGEN RX partner assets — flyer, business card, how-it-works video, and vial art. Illinois adults only.",
};

export default function AffiliatesMarketingPage() {
  return <RegenAffiliateMarketing />;
}
