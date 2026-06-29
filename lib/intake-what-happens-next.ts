import type { RxPostSubmitStep } from "@/components/rx/intake/RxPostSubmitHeader";
import { PROGRAM_CONSULT_FEE_USD } from "@/lib/flows";

/** Phase 8 — GLP-1 intake success path (mirrors peptide RxPostSubmitCard steps). */
export function glp1IntakeQualifiedSteps(): RxPostSubmitStep[] {
  return [
    { label: "Intake submitted — clinical team notified", status: "complete" },
    { label: `Book your $${PROGRAM_CONSULT_FEE_USD} NP consult on Fresha`, status: "current" },
    { label: "Ryan Kent, FNP-BC reviews your chart", status: "upcoming" },
    { label: "Program pricing & ship-to-home (if approved)", status: "upcoming" },
    { label: "Track refills in your RX portal", status: "upcoming" },
  ];
}

export const GLP1_INTAKE_SUCCESS_HEADLINE = "You qualify — here's what happens next";
export const GLP1_INTAKE_SUCCESS_INTRO =
  "Our clinical team reviews every GLP-1 intake within one business day. Book your consult to keep momentum — reference your intake number at check-in.";
