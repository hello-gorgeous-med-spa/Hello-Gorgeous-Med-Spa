import { NeurotoxinTreatmentPage } from "@/components/services/NeurotoxinTreatmentPage";
import { BOTOX_TREATMENT_LANDING } from "@/lib/botox-treatment-landing";

/** @deprecated Prefer NeurotoxinTreatmentPage — kept as a thin alias for Botox. */
export function BotoxTreatmentPage() {
  return (
    <NeurotoxinTreatmentPage content={BOTOX_TREATMENT_LANDING} procedureName="Botox Cosmetic" />
  );
}
