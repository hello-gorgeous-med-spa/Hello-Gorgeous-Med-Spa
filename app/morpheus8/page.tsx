import type { Metadata } from "next";
import { TreatmentHubPage } from "@/components/hubs/TreatmentHubPage";
import { pageMetadata } from "@/lib/seo";
import { TREATMENT_HUBS } from "@/lib/treatment-hubs";

export const metadata: Metadata = pageMetadata({
  title: "Morpheus8 Treatment Hub | Hello Gorgeous Med Spa",
  description:
    "Morpheus8 treatment hub with downtime, recovery, FAQs, comparisons, provider commentary, transcript-ready videos, and booking pathways.",
  path: "/morpheus8",
});

export default function Morpheus8HubRoute() {
  return <TreatmentHubPage hub={TREATMENT_HUBS["morpheus8"]} />;
}
