import type { Metadata } from "next";

import { NeurotoxinTreatmentPage } from "@/components/services/NeurotoxinTreatmentPage";
import { JEUVEAU_TREATMENT_LANDING } from "@/lib/jeuveau-treatment-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: JEUVEAU_TREATMENT_LANDING.metaTitle,
  description: JEUVEAU_TREATMENT_LANDING.metaDescription,
  path: JEUVEAU_TREATMENT_LANDING.path,
});

export default function JeuveauOswegoPage() {
  return (
    <NeurotoxinTreatmentPage content={JEUVEAU_TREATMENT_LANDING} procedureName="Jeuveau" />
  );
}
