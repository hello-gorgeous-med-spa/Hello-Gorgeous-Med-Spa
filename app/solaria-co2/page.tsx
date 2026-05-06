import type { Metadata } from "next";
import { TreatmentHubPage } from "@/components/hubs/TreatmentHubPage";
import { pageMetadata } from "@/lib/seo";
import { TREATMENT_HUBS } from "@/lib/treatment-hubs";

export const metadata: Metadata = pageMetadata({
  title: "Solaria CO2 Treatment Hub | Hello Gorgeous Med Spa",
  description:
    "Solaria CO2 treatment hub with resurfacing education, downtime and recovery guidance, comparisons, and consultation pathways.",
  path: "/solaria-co2",
});

export default function SolariaHubRoute() {
  return <TreatmentHubPage hub={TREATMENT_HUBS["solaria-co2"]} />;
}
