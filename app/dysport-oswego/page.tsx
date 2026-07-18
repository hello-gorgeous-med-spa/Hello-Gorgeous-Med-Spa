import type { Metadata } from "next";

import { NeurotoxinTreatmentPage } from "@/components/services/NeurotoxinTreatmentPage";
import { DYSPORT_TREATMENT_LANDING } from "@/lib/dysport-treatment-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: DYSPORT_TREATMENT_LANDING.metaTitle,
  description: DYSPORT_TREATMENT_LANDING.metaDescription,
  path: DYSPORT_TREATMENT_LANDING.path,
});

export default function DysportOswegoPage() {
  return (
    <NeurotoxinTreatmentPage content={DYSPORT_TREATMENT_LANDING} procedureName="Dysport" />
  );
}
