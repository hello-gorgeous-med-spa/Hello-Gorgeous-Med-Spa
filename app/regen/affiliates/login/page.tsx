import type { Metadata } from "next";

import { RegenAffiliateLogin } from "@/components/regen/RegenAffiliateLogin";

export const metadata: Metadata = {
  title: "Partner Login",
  robots: { index: false, follow: false },
};

export default function AffiliatesLoginPage() {
  return <RegenAffiliateLogin />;
}
