import type { Metadata } from "next";
import Link from "next/link";
import { MembershipsContent } from "./MembershipsContent";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Wellness Memberships | Precision Hormone & Metabolic Reset | Hello Gorgeous",
  description:
    "Exclusive hormone optimization and weight loss memberships. Continuous care, AI-powered lab insights, quarterly visits, and personalized support. No discounts. No punch cards. Real optimization.",
  openGraph: {
    title: "Wellness Memberships | Hello Gorgeous Med Spa",
    description: "Precision Hormone Program & Metabolic Reset Program. Continuity care. Real results.",
    url: `${SITE.url}/memberships`,
  },
};

export default function MembershipsPage() {
  return (
    <div data-site="public">
      <MembershipsContent />
    </div>
  );
}
