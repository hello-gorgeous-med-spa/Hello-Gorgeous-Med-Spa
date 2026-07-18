import type { Metadata } from "next";

import { NeurotoxinTreatmentPage } from "@/components/services/NeurotoxinTreatmentPage";
import { XEOMIN_TREATMENT_LANDING } from "@/lib/xeomin-treatment-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: XEOMIN_TREATMENT_LANDING.metaTitle,
  description: XEOMIN_TREATMENT_LANDING.metaDescription,
  path: XEOMIN_TREATMENT_LANDING.path,
});

export default function XeominOswegoPage() {
  return (
    <NeurotoxinTreatmentPage content={XEOMIN_TREATMENT_LANDING} procedureName="Xeomin" />
  );
}
