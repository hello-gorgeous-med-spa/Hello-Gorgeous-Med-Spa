import type { Metadata } from "next";

import { NeurotoxinTreatmentPage } from "@/components/services/NeurotoxinTreatmentPage";
import { BOTOX_TREATMENT_LANDING } from "@/lib/botox-treatment-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: BOTOX_TREATMENT_LANDING.metaTitle,
  description: BOTOX_TREATMENT_LANDING.metaDescription,
  path: BOTOX_TREATMENT_LANDING.path,
});

export default function BotoxOswegoPage() {
  return (
    <NeurotoxinTreatmentPage content={BOTOX_TREATMENT_LANDING} procedureName="Botox Cosmetic" />
  );
}
