import type { Metadata } from "next";

import { InModeTreatmentPage } from "@/components/services/InModeTreatmentPage";
import { QUANTUM_TREATMENT_LANDING } from "@/lib/inmode-treatment-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: QUANTUM_TREATMENT_LANDING.metaTitle,
  description: QUANTUM_TREATMENT_LANDING.metaDescription,
  path: QUANTUM_TREATMENT_LANDING.path,
});

export default function QuantumRfOswegoPage() {
  return <InModeTreatmentPage slug="quantum-rf-oswego" />;
}
