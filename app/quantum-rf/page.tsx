import type { Metadata } from "next";
import { TreatmentHubPage } from "@/components/hubs/TreatmentHubPage";
import { pageMetadata } from "@/lib/seo";
import { TREATMENT_HUBS } from "@/lib/treatment-hubs";

export const metadata: Metadata = pageMetadata({
  title: "Quantum RF Treatment Hub | Hello Gorgeous Med Spa",
  description:
    "Quantum RF treatment hub with candidacy guidance, recovery context, comparisons, videos, and direct booking pathways.",
  path: "/quantum-rf",
});

export default function QuantumRfHubRoute() {
  return <TreatmentHubPage hub={TREATMENT_HUBS["quantum-rf"]} />;
}
