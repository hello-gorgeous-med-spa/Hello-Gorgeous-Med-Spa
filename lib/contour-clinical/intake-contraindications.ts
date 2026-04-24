/**
 * Contraindication questions — "yes" flags provider review.
 * Aligned to Luxora / in-service style checklist.
 */
export const CL_INTAKE_CONTRA_ITEMS = [
  { id: "contra_pacemaker", label: "Pacemaker / defibrillator" },
  { id: "contra_electronic_implants", label: "Electronic implants" },
  { id: "contra_metal_treatment_area", label: "Metal implants in the treatment area" },
  { id: "contra_skin_cancer", label: "Skin cancer, history of cancer, or pre-malignant moles" },
  { id: "contra_pregnancy", label: "Pregnancy or nursing" },
  { id: "contra_cardiac", label: "Cardiac disorders" },
  { id: "contra_hypertension", label: "Uncontrolled hypertension" },
  { id: "contra_liver_kidney", label: "Liver or kidney disease" },
  { id: "contra_immunosuppression", label: "Immunosuppressive disease or medication" },
  { id: "contra_herpes", label: "Herpes simplex history in the treatment area" },
  { id: "contra_endocrine", label: "Diabetes, thyroid, or other endocrine disorder" },
  { id: "contra_active_skin", label: "Active skin condition in the treatment area" },
  { id: "contra_keloid", label: "Keloids or abnormal wound healing" },
  { id: "contra_bleeding", label: "Bleeding disorder" },
  { id: "contra_anticoagulant", label: "Anticoagulant use" },
  { id: "contra_recent_energy", label: "Recent laser, RF, or ablative treatment in the area" },
  { id: "contra_accutane", label: "Accutane (isotretinoin) within 6 months" },
  { id: "contra_recent_surgery", label: "Recent surgery in the treatment area" },
  { id: "contra_recent_filler", label: "Recent fillers or injectables in the treatment area" },
  { id: "contra_tattoo_pmu", label: "Tattoos or permanent makeup in the treatment area" },
  { id: "contra_tanning", label: "Excessive tanning" },
] as const;

export type ContraId = (typeof CL_INTAKE_CONTRA_ITEMS)[number]["id"];

export function collectContraindicationYesList(answers: Record<string, unknown>): {
  list: string[];
  requiresProviderReview: boolean;
} {
  const list: string[] = [];
  for (const item of CL_INTAKE_CONTRA_ITEMS) {
    const v = answers[item.id];
    if (v === true || v === "yes" || (typeof v === "string" && v.toLowerCase() === "yes")) {
      list.push(item.id);
    }
  }
  return { list, requiresProviderReview: list.length > 0 };
}
