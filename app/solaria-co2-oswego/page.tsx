import type { Metadata } from "next";

import { InModeTreatmentPage } from "@/components/services/InModeTreatmentPage";
import { SOLARIA_TREATMENT_LANDING } from "@/lib/inmode-treatment-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: SOLARIA_TREATMENT_LANDING.metaTitle,
  description: SOLARIA_TREATMENT_LANDING.metaDescription,
  path: SOLARIA_TREATMENT_LANDING.path,
});

export default function SolariaCo2OswegoPage() {
  return <InModeTreatmentPage slug="solaria-co2-oswego" />;
}
