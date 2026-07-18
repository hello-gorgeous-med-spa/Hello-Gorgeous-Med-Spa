import type { Metadata } from "next";

import { BotoxTreatmentPage } from "@/components/services/BotoxTreatmentPage";
import { BOTOX_TREATMENT_LANDING } from "@/lib/botox-treatment-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: BOTOX_TREATMENT_LANDING.metaTitle,
  description: BOTOX_TREATMENT_LANDING.metaDescription,
  path: BOTOX_TREATMENT_LANDING.path,
});

export default function BotoxOswegoPage() {
  return <BotoxTreatmentPage />;
}
