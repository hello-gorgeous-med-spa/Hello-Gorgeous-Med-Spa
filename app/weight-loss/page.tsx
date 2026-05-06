import type { Metadata } from "next";
import { TreatmentHubPage } from "@/components/hubs/TreatmentHubPage";
import { pageMetadata } from "@/lib/seo";
import { TREATMENT_HUBS } from "@/lib/treatment-hubs";

export const metadata: Metadata = pageMetadata({
  title: "Weight Loss Treatment Hub | Hello Gorgeous Med Spa",
  description:
    "Weight-loss hub with GLP-1 education, candidacy FAQs, comparisons, provider commentary, and consultation funnels.",
  path: "/weight-loss",
});

export default function WeightLossHubRoute() {
  return <TreatmentHubPage hub={TREATMENT_HUBS["weight-loss"]} />;
}
