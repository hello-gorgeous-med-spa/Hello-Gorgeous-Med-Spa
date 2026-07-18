import type { Metadata } from "next";

import { NeurotoxinTreatmentPage } from "@/components/services/NeurotoxinTreatmentPage";
import { DAXXIFY_TREATMENT_LANDING } from "@/lib/daxxify-treatment-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: DAXXIFY_TREATMENT_LANDING.metaTitle,
  description: DAXXIFY_TREATMENT_LANDING.metaDescription,
  path: DAXXIFY_TREATMENT_LANDING.path,
});

export default function DaxxifyOswegoPage() {
  return (
    <NeurotoxinTreatmentPage content={DAXXIFY_TREATMENT_LANDING} procedureName="Daxxify" />
  );
}
