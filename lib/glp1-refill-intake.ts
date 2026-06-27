/**
 * Hello Gorgeous RX™ GLP-1 weight loss refill — `/glp1-refill`
 * Submissions → hg_form_submissions slug `glp1-refill-request`
 */

import type { IntakeFormField } from "@/lib/hgos/intake-forms";
import { glp1SignerName } from "@/lib/glp1-intake";
import { glp1DoseTierById } from "@/lib/glp1-dose-tiers";
import { GLP1_INSURANCE_OVERSIGHT } from "@/lib/glp1-refill-pricing";
import { GLP1_REFILL_ADDON_FIELD_OPTIONS } from "@/lib/peptide-monthly-addons";
import {
  GLP1_PAYMENT_FIRST_FINE_PRINT,
  GLP1_REORDER_TELEHEALTH_COPY,
  GLP1_REORDER_TELEHEALTH_FEE_USD,
  GLP1_SUPPLY_CYCLE_TELEHEALTH_COPY,
  glp1TelehealthProviderFlags,
} from "@/lib/glp1-telehealth-policy";
import {
  RX_SUPPLY_CYCLE_FIELD_OPTIONS,
} from "@/lib/rx-supply-cycle";

export const GLP1_REFILL_INTAKE_SLUG = "glp1-refill-request";

export const GLP1_REFILL_DISQUALIFIED_MESSAGE =
  "Thank you for your submission. Based on your answers, we cannot process this refill online at this time. Please call (630) 636-6193 — we may still be able to help after a direct clinical conversation. New patients should complete the full GLP-1 screening at /glp1-intake.";

export type Glp1RefillStep = {
  id: string;
  title: string;
  description?: string;
  fields: IntakeFormField[];
};

const CONTACT_FIELDS: IntakeFormField[] = [
  {
    id: "first_name",
    type: "text",
    label: "First name",
    required: true,
    placeholder: "Jane",
  },
  {
    id: "last_name",
    type: "text",
    label: "Last name",
    required: true,
    placeholder: "Doe",
  },
  {
    id: "email",
    type: "text",
    label: "Email",
    required: true,
    placeholder: "you@email.com",
  },
  {
    id: "phone",
    type: "phone",
    label: "Mobile phone",
    required: true,
    placeholder: "(630) 555-1234",
    helpText: "Used to match your chart and send refill updates.",
  },
  { id: "dob", type: "date", label: "Date of birth", required: true },
];

const SHIPPING_FIELDS: IntakeFormField[] = [
  {
    id: "address_line1",
    type: "text",
    label: "Street address",
    required: true,
    placeholder: "123 Main St",
  },
  {
    id: "address_line2",
    type: "text",
    label: "Apt / unit (optional)",
    required: false,
    placeholder: "Apt 2B",
  },
  {
    id: "city",
    type: "text",
    label: "City",
    required: true,
    placeholder: "Oswego",
  },
  {
    id: "state",
    type: "text",
    label: "State",
    required: true,
    placeholder: "IL",
    helpText: "2-letter state code",
  },
  {
    id: "zip",
    type: "text",
    label: "ZIP code",
    required: true,
    placeholder: "60543",
  },
  {
    id: "ship_to_home",
    type: "radio",
    label: "Ship medication to this address?",
    required: true,
    options: ["Yes — ship to my home (cold-chain delivery)", "No — I will pick up at the spa"],
    helpText: "Most patients choose home delivery. Pick-up is at 74 W Washington St, Oswego.",
  },
];

const REFILL_FIELDS: IntakeFormField[] = [
  {
    id: "existing_patient",
    type: "radio",
    label: "Are you an existing Hello Gorgeous GLP-1 weight loss patient?",
    required: true,
    options: ["Yes", "No"],
    helpText: "Refills are for patients already established with Ryan Kent, FNP-BC.",
  },
  {
    id: "last_visit_within_12mo",
    type: "radio",
    label: `Have you completed a Hello Gorgeous GLP-1 check-in in the last 90 days?`,
    required: true,
    options: ["Yes", "No"],
    helpText: `Required for single-month (30-day) refills only. 90-day supply and 3-month auto-pay skip telehealth for this order. ${GLP1_REORDER_TELEHEALTH_COPY}`,
  },
  {
    id: "current_medication",
    type: "radio",
    label: "Medication for this refill",
    required: true,
    options: ["Semaglutide", "Tirzepatide", "Insurance oversight (med via my plan)", "Other / switching — discuss with NP"],
  },
  {
    id: "current_dose",
    type: "text",
    label: "Current weekly dose (mg) if known",
    required: false,
    placeholder: "e.g. 5 mg / week",
  },
  {
    id: "last_dose_date",
    type: "date",
    label: "Date of your last injection",
    required: true,
  },
  {
    id: "weight_lbs",
    type: "text",
    label: "Current weight (lbs)",
    required: true,
    placeholder: "165",
  },
  {
    id: "dose_changes",
    type: "radio",
    label: "Any dose, medication, or health changes since your last visit?",
    required: true,
    options: ["Yes", "No"],
  },
  {
    id: "dose_changes_detail",
    type: "textarea",
    label: "Describe changes (if yes)",
    required: false,
    placeholder: "New medications, dose adjustments requested, hospital visits…",
    conditionalOn: { field: "dose_changes", value: "Yes" },
  },
  {
    id: "side_effects",
    type: "radio",
    label: "Any side effects since your last refill?",
    required: true,
    options: ["Yes", "No"],
  },
  {
    id: "side_effects_detail",
    type: "textarea",
    label: "Describe side effects (if yes)",
    required: false,
    conditionalOn: { field: "side_effects", value: "Yes" },
  },
  {
    id: "refill_notes",
    type: "textarea",
    label: "Anything Ryan should know before approving this refill?",
    required: false,
    placeholder: "How you're feeling, goals for this month, shipping notes…",
  },
  {
    id: "supply_cycle",
    type: "radio",
    label: "Prescription supply cycle",
    required: true,
    options: [...RX_SUPPLY_CYCLE_FIELD_OPTIONS],
    helpText: `${GLP1_SUPPLY_CYCLE_TELEHEALTH_COPY["90-day"]} ${GLP1_SUPPLY_CYCLE_TELEHEALTH_COPY["30-day"]} Prices update when you select your dose tier.`,
  },
  {
    id: "monthly_peptide_addon",
    type: "radio",
    label: "Optional monthly add-on (ships with your refill after NP approval)",
    required: true,
    options: GLP1_REFILL_ADDON_FIELD_OPTIONS,
  },
];

const MEDICAL_UPDATE_FIELDS: IntakeFormField[] = [
  {
    id: "pregnant",
    type: "radio",
    label: "Are you pregnant, trying to conceive, or breastfeeding?",
    required: true,
    options: ["Yes", "No", "N/A"],
  },
  {
    id: "med_allergies",
    type: "radio",
    label: "Medication allergies?",
    required: true,
    options: ["Yes", "No"],
  },
  {
    id: "med_allergies_list",
    type: "textarea",
    label: "List medication allergies",
    required: false,
    placeholder: "Drug name and reaction",
    conditionalOn: { field: "med_allergies", value: "Yes" },
  },
  {
    id: "rx_medications",
    type: "radio",
    label: "Any new prescription medications since your last visit?",
    required: true,
    options: ["Yes", "No"],
  },
  {
    id: "rx_medications_list",
    type: "textarea",
    label: "List new medications",
    required: false,
    placeholder: "Include dose if known",
    conditionalOn: { field: "rx_medications", value: "Yes" },
  },
];

const CONSENT_FIELDS: IntakeFormField[] = [
  {
    id: "refill_consent",
    type: "checkbox",
    label: "Refill & shipping acknowledgement",
    required: true,
    options: [
      "I am requesting a refill of my Hello Gorgeous GLP-1 program — this is not a prescription until approved by our NP",
      "I will complete payment at checkout now — medication ships only after clinical review",
      GLP1_PAYMENT_FIRST_FINE_PRINT,
      `I understand 90-day supply or 3-month monthly auto-pay does not require telehealth for this order; a $${GLP1_REORDER_TELEHEALTH_FEE_USD} telehealth check-in is required before my next reorder afterward`,
      "I confirm my shipping address is correct for cold-chain home delivery",
      "Hello Gorgeous may contact me at the information provided by email and text",
    ],
  },
  {
    id: "legal_name",
    type: "text",
    label: "Electronic signature (type your full legal name)",
    required: true,
    placeholder: "Must match first and last name above",
  },
  { id: "signature", type: "signature", label: "Sign below", required: true },
];

export const GLP1_REFILL_STEPS: Glp1RefillStep[] = [
  {
    id: "contact",
    title: "Your information",
    description: "We'll match this to your chart and send refill updates.",
    fields: CONTACT_FIELDS,
  },
  {
    id: "shipping",
    title: "Home delivery address",
    description: "Medication ships directly to you — not to the spa unless you choose pick-up.",
    fields: SHIPPING_FIELDS,
  },
  {
    id: "refill",
    title: "Refill details",
    description: "Help Ryan approve your refill quickly at your check-in.",
    fields: REFILL_FIELDS,
  },
  {
    id: "medical",
    title: "Health update",
    description: "Quick safety check since your last visit.",
    fields: MEDICAL_UPDATE_FIELDS,
  },
  {
    id: "consent",
    title: "Consent & signature",
    description: "This form is a refill request only — not a diagnosis or prescription.",
    fields: CONSENT_FIELDS,
  },
];

export { glp1SignerName };

export function evaluateGlp1RefillEligibility(data: Record<string, unknown>): {
  qualified: boolean;
  disqualificationReasons: string[];
  providerFlags: string[];
} {
  const disqualificationReasons: string[] = [];
  const providerFlags: string[] = [];

  if (data.existing_patient === "No") {
    disqualificationReasons.push("Refills require an existing Hello Gorgeous GLP-1 patient relationship");
  }
  if (data.pregnant === "Yes") {
    disqualificationReasons.push("Pregnant, trying to conceive, or breastfeeding");
  }
  providerFlags.push(...glp1TelehealthProviderFlags({
    supplyCycleRaw: data.supply_cycle,
    lastVisitWithin90Days: data.last_visit_within_12mo,
    doseChanges: data.dose_changes,
    sideEffects: data.side_effects,
  }));
  if (data.current_medication === "Other / switching — discuss with NP") {
    providerFlags.push("Medication switch requested — NP review required");
  }
  if (data.current_medication === GLP1_INSURANCE_OVERSIGHT.label) {
    providerFlags.push("Insurance pharmacy fill — confirm coverage & pharmacy");
  }
  if (String(data.ship_to_home || "").startsWith("No")) {
    providerFlags.push("Clinic pick-up requested — do not ship to patient address");
  }

  return {
    qualified: disqualificationReasons.length === 0,
    disqualificationReasons,
    providerFlags,
  };
}

export function suggestGlp1RefillDrug(data: Record<string, unknown>): string {
  const med = String(data.current_medication || "").trim();
  const tierId = String(data.refill_dose_tier || data.dose_tier || "").trim();
  const doseTier = tierId ? glp1DoseTierById(tierId) : undefined;
  const dose = String(data.current_dose || "").trim();
  const tierLabel =
    doseTier?.doseLabel ??
    (tierId === GLP1_INSURANCE_OVERSIGHT.id ? "Insurance oversight" : tierId || null);
  const parts = [med, tierLabel, dose ? `${dose}/wk` : null].filter(Boolean);
  return parts.length ? parts.join(" — ") : "GLP-1 injectable — NP to specify";
}
