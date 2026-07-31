import {
  evaluateGlp1Eligibility,
  parseGlp1Numbers,
  computeBmi,
} from "@/lib/glp1-intake";
import type { ConsultScreening, ConsultScreeningResult, ConsultVertical } from "@/lib/consults/types";

export type WeightLossScreenField = {
  id: string;
  label: string;
  type: "text" | "radio";
  options?: string[];
  placeholder?: string;
  helpText?: string;
};

/** Staff consult checklist — mirrors GLP-1 intake hard stops + provider flags. */
export const WEIGHT_LOSS_SCREEN_FIELDS: WeightLossScreenField[] = [
  {
    id: "height_ft",
    label: "Height (feet)",
    type: "text",
    placeholder: "5",
  },
  {
    id: "height_in",
    label: "Height (inches)",
    type: "text",
    placeholder: "6",
  },
  {
    id: "weight_lbs",
    label: "Weight (lbs)",
    type: "text",
    placeholder: "180",
  },
  {
    id: "type1_diabetes",
    label: "Type 1 diabetes?",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    id: "pregnant",
    label: "Pregnant, trying to conceive, or breastfeeding?",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    id: "mtc_men2",
    label: "Personal/family history of MTC or MEN 2?",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    id: "pancreatitis",
    label: "History of pancreatitis?",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    id: "on_glp1",
    label: "Currently on a GLP-1 medication?",
    type: "radio",
    options: ["Yes", "No"],
  },
];

export function evaluateConsultScreening(
  vertical: ConsultVertical,
  answers: Record<string, unknown>
): ConsultScreeningResult {
  if (vertical === "weight_loss") {
    return evaluateGlp1Eligibility(answers);
  }

  // Thin verticals: no hard clinical gate in v1 — always pass, staff documents notes.
  return {
    qualified: true,
    disqualificationReasons: [],
    providerFlags: [],
    bmi: null,
  };
}

export function screeningAllowsPropose(screening: ConsultScreening | null | undefined): boolean {
  if (!screening?.result) return false;
  if (screening.staffOverride) return Boolean(screening.staffOverrideNote?.trim());
  return screening.result.qualified;
}

export function weightLossBmiPreview(answers: Record<string, unknown>): number | null {
  const { heightFt, heightIn, weightLbs } = parseGlp1Numbers(answers);
  return computeBmi(heightFt, heightIn, weightLbs);
}
