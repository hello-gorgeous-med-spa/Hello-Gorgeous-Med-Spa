import type { Metadata } from "next";

import { RegenAffiliateApply } from "@/components/regen/RegenAffiliateApply";

export const metadata: Metadata = {
  title: "Apply to Partner",
};

export default function AffiliatesApplyPage() {
  return <RegenAffiliateApply />;
}
