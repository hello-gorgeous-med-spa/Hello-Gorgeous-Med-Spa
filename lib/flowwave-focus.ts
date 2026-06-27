/**
 * FlowWave FOCUS — shockwave / CRT intake constants & screening logic.
 */

export const FLOWWAVE_BRAND = {
  name: "FlowWave FOCUS",
  subtitle: "Cellular Reaction Technology",
  blue: "#1A5F8A",
  blueLight: "#D5E8F5",
} as const;

export const FLOWWAVE_TREATMENT_AREAS = [
  { id: "R1", label: "Neck (R1)" },
  { id: "R2", label: "Shoulder (R2)" },
  { id: "R3", label: "Back (R3)" },
  { id: "R4", label: "Buttock (R4)" },
  { id: "R5", label: "Elbow (R5)" },
  { id: "R6", label: "Wrist (R6)" },
  { id: "R7", label: "Hand (R7)" },
  { id: "R8", label: "Knee (R8)" },
  { id: "R9", label: "Leg (R9)" },
  { id: "R10", label: "Ankle (R10)" },
  { id: "R11", label: "Foot (R11)" },
  { id: "R12", label: "ED (R12) — male only" },
  { id: "R13", label: "Fat reduction (R13)" },
  { id: "multi", label: "Multiple areas" },
] as const;

export const FLOWWAVE_HANDLE_TYPES = [
  "CRT Focused Shockwave",
  "ED Focusing Handle",
] as const;

export const FLOWWAVE_ABSOLUTE_CONTRAINDICATIONS = [
  { id: "contra_pacemaker", label: "Cardiac pacemaker, heart rate regulator, or implanted electronic/cardiac device (ECS)" },
  { id: "contra_artbone", label: "Artificial bone or prosthetic implants" },
  { id: "contra_silicosis", label: "Diagnosed silicosis" },
  { id: "contra_cancer", label: "Malignant tumor or active cancer" },
  { id: "contra_htn", label: "Severe hypertension or serious cardiovascular / cerebrovascular disease" },
  { id: "contra_renal", label: "Renal failure or severe active infection" },
  { id: "contra_metal", label: "Metal implants or metallic teeth in or near the treatment area" },
  { id: "contra_pregnant", label: "Pregnant" },
  { id: "contra_intox", label: "Currently intoxicated or high fever" },
  { id: "contra_epilepsy", label: "Epilepsy or severe sensitivity-related mental health condition" },
  { id: "contra_cachexia", label: "Cachexia or unable to care for self independently" },
  { id: "contra_device", label: "Artificial heart-lung device or other life-sustaining implanted device" },
] as const;

export const FLOWWAVE_CAUTION_FLAGS = [
  { id: "caut_menses", label: "Currently menstruating" },
  { id: "caut_minor", label: "Under 18 years old" },
  { id: "caut_bleed", label: "Hemorrhagic condition, active trauma, inflammation, skin disease, or skin infection" },
  { id: "caut_numb", label: "Numbness or reduced sensation in treatment area" },
  { id: "caut_immune", label: "Immune deficiency or history of abnormal scar formation" },
  { id: "caut_fillers", label: "Cosmetic surgery or medical fillers / implants near treatment area" },
  { id: "caut_acute", label: "Acute disease, infectious disease, or cardiac disease" },
  { id: "caut_edema", label: "Skin inflammation or edema in or near treatment area" },
] as const;

export const FLOWWAVE_PRE_TREATMENT_CHECKS = [
  { id: "pre_contra", label: "Contraindication screening reviewed — no absolute contraindications present" },
  { id: "pre_devices", label: "Client removed hearing aids, watches, magnetic cards, and mobile phone" },
  { id: "pre_skin", label: "Treatment area assessed — no active inflammation, open wounds, or edema" },
  { id: "pre_watersac", label: "Water sac inspected — no damage, aging, or stickiness" },
  { id: "pre_gel", label: "Ultrasonic coupling agent applied — full skin contact, no bubbles" },
  { id: "pre_water", label: "Client advised to drink water during and after session" },
  { id: "pre_params", label: "Parameters confirmed (intensity, frequency, preset shots, area)" },
] as const;

export type FlowWaveScreeningResult = "pending" | "cleared" | "caution" | "contraindicated";

export type FlowWaveIntakeStatus =
  | "draft"
  | "contraindicated"
  | "caution_review"
  | "cleared"
  | "in_treatment"
  | "complete"
  | "cancelled";

export type FlowWaveIntakeData = Record<string, unknown>;
export type FlowWaveSoapData = Record<string, unknown>;
export type FlowWavePolicyData = Record<string, unknown>;

export function evaluateFlowWaveScreening(intakeData: FlowWaveIntakeData): {
  screeningResult: FlowWaveScreeningResult;
  status: FlowWaveIntakeStatus;
  absoluteIds: string[];
  cautionIds: string[];
} {
  const absoluteIds = FLOWWAVE_ABSOLUTE_CONTRAINDICATIONS.filter(
    (c) => intakeData[c.id] === true,
  ).map((c) => c.id);
  const cautionIds = FLOWWAVE_CAUTION_FLAGS.filter((c) => intakeData[c.id] === true).map(
    (c) => c.id,
  );

  if (absoluteIds.length > 0) {
    return {
      screeningResult: "contraindicated",
      status: "contraindicated",
      absoluteIds,
      cautionIds,
    };
  }
  if (cautionIds.length > 0) {
    return {
      screeningResult: "caution",
      status: "caution_review",
      absoluteIds,
      cautionIds,
    };
  }
  return {
    screeningResult: "cleared",
    status: "cleared",
    absoluteIds,
    cautionIds,
  };
}

const FLOWWAVE_APPOINTMENT_KEYWORDS = [
  "flowwave",
  "shockwave",
  "shock wave",
  "focused shock",
  "crt",
  "cellular reaction",
  "rejuva",
] as const;

export function isFlowWaveAppointment(
  serviceName?: string | null,
  notes?: string | null,
): boolean {
  const hay = `${serviceName || ""} ${notes || ""}`.toLowerCase();
  return FLOWWAVE_APPOINTMENT_KEYWORDS.some((k) => hay.includes(k));
}

export function flowWaveIntakeUrl(opts: {
  clientId: string;
  appointmentId?: string;
  intakeId?: string;
}): string {
  const params = new URLSearchParams({ client: opts.clientId });
  if (opts.appointmentId) params.set("appointment", opts.appointmentId);
  if (opts.intakeId) params.set("intake", opts.intakeId);
  return `/admin/flowwave/intake?${params.toString()}`;
}
