import type { Metadata } from "next";

import { InModeTreatmentPage } from "@/components/services/InModeTreatmentPage";
import { MORPHEUS8_BURST_TREATMENT_LANDING } from "@/lib/inmode-treatment-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: MORPHEUS8_BURST_TREATMENT_LANDING.metaTitle,
  description: MORPHEUS8_BURST_TREATMENT_LANDING.metaDescription,
  path: MORPHEUS8_BURST_TREATMENT_LANDING.path,
});

export default function Morpheus8BurstOswegoPage() {
  return <InModeTreatmentPage slug="morpheus8-burst-oswego" />;
}
