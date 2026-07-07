import { evaluateGlp1Eligibility } from "@/lib/glp1-intake";
import { evaluateGlp1RefillEligibility } from "@/lib/glp1-refill-intake";
import { isGlp1FormSlug } from "@/lib/glp1-form-alert";
import { evaluatePeptideEligibility } from "@/lib/peptide-intake";
import { isPeptideFormSlug } from "@/lib/peptide-form-alert";
import type { RegenCategory } from "@/lib/regen/intake-router";
import { evaluateRegenIntake } from "@/lib/regen/post-payment-intake";
import type { RxClinicClinical } from "@/lib/rx-clinic-encounter";
import type { RxOpsRequestKind } from "@/lib/rx-ops/types";

export type ScreeningFlag = { icon: string; ok: boolean; text: string };

function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function eligibilityFlags(
  qualified: boolean,
  disqualificationReasons: string[],
  providerFlags: string[],
  bmi: number | null,
): ScreeningFlag[] {
  const flags: ScreeningFlag[] = [];

  if (bmi != null) {
    flags.push({
      icon: bmi >= 27 ? "✓" : "!",
      ok: bmi >= 27,
      text: `BMI ${bmi}${bmi < 27 ? " — review weight criteria" : ""}`,
    });
  }

  for (const reason of disqualificationReasons) {
    flags.push({ icon: "✕", ok: false, text: reason });
  }

  for (const flag of providerFlags) {
    flags.push({ icon: "!", ok: false, text: flag });
  }

  if (qualified && disqualificationReasons.length === 0 && providerFlags.length === 0) {
    flags.unshift({ icon: "✓", ok: true, text: "Automated screening passed — no blocking flags" });
  } else if (qualified && providerFlags.length > 0) {
    flags.unshift({
      icon: "!",
      ok: false,
      text: "Qualified with provider review flags",
    });
  }

  return flags;
}

export function screeningForIntakeSlug(
  slug: string,
  responses: Record<string, unknown>,
): ScreeningFlag[] {
  if (isGlp1FormSlug(slug)) {
    const eligibility =
      slug.includes("refill")
        ? evaluateGlp1RefillEligibility(responses)
        : evaluateGlp1Eligibility(responses);
    return eligibilityFlags(
      eligibility.qualified,
      eligibility.disqualificationReasons,
      eligibility.providerFlags,
      "bmi" in eligibility ? eligibility.bmi : null,
    );
  }

  if (isPeptideFormSlug(slug)) {
    const eligibility = evaluatePeptideEligibility(responses);
    return eligibilityFlags(
      eligibility.qualified,
      eligibility.disqualificationReasons,
      eligibility.providerFlags,
      null,
    );
  }

  return [{ icon: "✓", ok: true, text: "Intake submitted — awaiting provider review" }];
}

export function goalToRegenCategory(goal: string | null | undefined): RegenCategory {
  const g = String(goal || "").toLowerCase();
  if (g.includes("weight")) return "weight-loss";
  if (g.includes("sexual") || g.includes("ed") || g.includes("libido")) return "sexual-health";
  if (g.includes("hormone") || g.includes("hrt")) return "hormones";
  if (g.includes("hair") || g.includes("skin")) return "hair-skin";
  if (g.includes("lab")) return "labs";
  return "daily-wellness";
}

export function screeningForRegen(
  goal: string | null,
  intakeData: Record<string, unknown>,
  extras: {
    allergies?: string | null;
    intakeComplete?: boolean;
    telehealthRequired?: boolean;
    telehealthComplete?: boolean;
    paid?: boolean;
  },
): ScreeningFlag[] {
  const category = goalToRegenCategory(goal);
  const eligibility = evaluateRegenIntake(category, intakeData);
  const flags = eligibilityFlags(
    eligibility.qualified,
    eligibility.disqualificationReasons,
    eligibility.providerFlags,
    eligibility.bmi,
  );

  if (!extras.paid) {
    flags.push({ icon: "!", ok: false, text: "Payment pending" });
  }
  if (extras.intakeComplete === false) {
    flags.push({ icon: "!", ok: false, text: "Post-payment intake incomplete" });
  } else if (extras.intakeComplete) {
    flags.push({ icon: "✓", ok: true, text: "Post-payment intake complete" });
  }
  if (extras.telehealthRequired !== false && !extras.telehealthComplete) {
    flags.push({ icon: "!", ok: false, text: "Telehealth visit pending" });
  } else if (extras.telehealthComplete) {
    flags.push({ icon: "✓", ok: true, text: "Telehealth complete" });
  }
  if (extras.allergies && extras.allergies !== "None") {
    flags.push({ icon: "!", ok: false, text: `Allergies: ${extras.allergies}` });
  }

  return flags;
}

export function screeningForClinic(
  clinical: RxClinicClinical,
  paid: boolean,
): ScreeningFlag[] {
  const flags: ScreeningFlag[] = [];

  if (!paid) {
    flags.push({ icon: "!", ok: false, text: "Payment pending" });
  } else {
    flags.push({ icon: "✓", ok: true, text: "In-clinic payment captured" });
  }

  if (clinical.allergiesReviewed) {
    flags.push({ icon: "✓", ok: true, text: "Allergies reviewed in encounter" });
  } else {
    flags.push({ icon: "!", ok: false, text: "Allergies not marked reviewed" });
  }

  if (clinical.currentMedicationsReviewed) {
    flags.push({ icon: "✓", ok: true, text: "Medications reviewed" });
  } else {
    flags.push({ icon: "!", ok: false, text: "Medications not marked reviewed" });
  }

  if (clinical.contraindicationsNone) {
    flags.push({ icon: "✓", ok: true, text: "No contraindications documented" });
  } else {
    flags.push({ icon: "!", ok: false, text: "Contraindications — confirm before approve" });
  }

  if (clinical.weightLbs != null) {
    flags.push({
      icon: "✓",
      ok: true,
      text: `Weight on file: ${clinical.weightLbs} lbs`,
    });
  }

  if (clinical.labsOnFile) {
    flags.push({ icon: "✓", ok: true, text: "Labs on file" });
  }

  return flags;
}

export function intakePairsFromResponses(
  responses: Record<string, unknown>,
  limit = 14,
): Array<{ q: string; a: string }> {
  const skip = new Set(["signature", "_meta", "intake_consent"]);
  return Object.entries(responses)
    .filter(([k, v]) => !skip.has(k) && v != null && String(v).trim() !== "")
    .slice(0, limit)
    .map(([k, v]) => ({
      q: humanizeKey(k),
      a: Array.isArray(v) ? v.join(", ") : String(v),
    }));
}

export function defaultSigSuggestion(product: string, compound: string): string {
  return `Continue ${product || compound} per Hello Gorgeous protocol. Document SIG for pharmacy dispatch.`;
}
