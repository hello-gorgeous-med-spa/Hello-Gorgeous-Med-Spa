/**
 * Hello Gorgeous RX™ peptide request & refill intake.
 * Submissions → hg_form_submissions (slug: peptide-therapy-request | peptide-refill-request)
 */

import type { IntakeFormField } from "@/lib/hgos/intake-forms";
import {
  GLP1_SUPPLY_CYCLE_TELEHEALTH_COPY,
  glp1TelehealthProviderFlags,
} from "@/lib/glp1-telehealth-policy";
import {
  RX_SUPPLY_CYCLE_FIELD_OPTIONS,
} from "@/lib/rx-supply-cycle";

export const PEPTIDE_REQUEST_INTAKE_SLUG = "peptide-therapy-request";
export const PEPTIDE_REFILL_INTAKE_SLUG = "peptide-refill-request";

export type PeptideRequestType = "new" | "refill";

export type PeptideIntakeStep = {
  id: string;
  title: string;
  description?: string;
  /** Omit on refill flow when step only applies to new */
  requestTypes?: PeptideRequestType[];
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
    helpText: "Used to match your chart and send telehealth links.",
  },
  { id: "dob", type: "date", label: "Date of birth", required: true },
  {
    id: "zip",
    type: "text",
    label: "ZIP code",
    required: true,
    placeholder: "60543",
  },
];

const MEDICAL_FIELDS: IntakeFormField[] = [
  {
    id: "allergies",
    type: "textarea",
    label: "Allergies (medications, foods, latex, etc.)",
    required: false,
    placeholder: "None",
  },
  {
    id: "medications",
    type: "textarea",
    label: "Current medications & supplements",
    required: false,
    placeholder: "None",
  },
  {
    id: "medical_conditions",
    type: "checkbox",
    label: "Do any of the following apply?",
    required: false,
    options: [
      "Diabetes",
      "Kidney or liver disease",
      "Heart disease or uncontrolled blood pressure",
      "Active or untreated cancer",
      "Autoimmune condition",
      "History of blood clots",
      "None of the above",
    ],
  },
  {
    id: "pregnant",
    type: "radio",
    label: "Are you pregnant, trying to conceive, or breastfeeding?",
    required: true,
    options: ["Yes", "No", "N/A"],
  },
  {
    id: "recent_hospitalization",
    type: "radio",
    label: "Hospitalization, surgery, or ER visit in the last 30 days?",
    required: true,
    options: ["Yes", "No"],
  },
];

const REFILL_FIELDS: IntakeFormField[] = [
  {
    id: "existing_patient",
    type: "radio",
    label: "Are you an existing Hello Gorgeous RX™ peptide patient?",
    required: true,
    options: ["Yes", "No"],
    helpText: "Refills are for patients already established with our NP-led peptide program.",
  },
  {
    id: "last_visit_within_12mo",
    type: "radio",
    label: "Have you had a peptide telehealth or in-office visit with us in the last 12 months?",
    required: true,
    options: ["Yes", "No"],
  },
  {
    id: "current_peptide",
    type: "text",
    label: "Which peptide(s) are you currently on?",
    required: true,
    placeholder: "e.g. BPC-157 + Sermorelin",
  },
  {
    id: "last_dose_date",
    type: "date",
    label: "Date of your last dose",
    required: true,
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
    placeholder: "New medications, side effects, dose adjustments requested…",
    conditionalOn: { field: "dose_changes", value: "Yes" },
  },
  {
    id: "side_effects",
    type: "radio",
    label: "Any side effects since starting your protocol?",
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
    id: "refill_goal",
    type: "textarea",
    label: "Anything you want Ryan to know before approving this refill?",
    required: false,
    placeholder: "How you're feeling, goals for this cycle, shipping notes…",
  },
  {
    id: "supply_cycle",
    type: "radio",
    label: "Prescription supply cycle",
    required: true,
    options: [...RX_SUPPLY_CYCLE_FIELD_OPTIONS],
    helpText: `${GLP1_SUPPLY_CYCLE_TELEHEALTH_COPY["90-day"]} ${GLP1_SUPPLY_CYCLE_TELEHEALTH_COPY["30-day"]} Combined total updates for all peptides selected.`,
  },
];

const NEW_PROTOCOL_FIELDS: IntakeFormField[] = [
  {
    id: "primary_goal",
    type: "checkbox",
    label: "What are your primary goals? (select all that apply)",
    required: true,
    options: [
      "Recovery / healing",
      "Energy & longevity",
      "Sleep & restoration",
      "Body composition / weight",
      "Skin, hair & anti-aging",
      "Focus & brain health",
      "Intimacy & vitality",
      "Other (describe below)",
    ],
  },
  {
    id: "goal_notes",
    type: "textarea",
    label: "Tell us more about your goals",
    required: true,
    placeholder: "What outcome matters most? Timeline? Prior peptide experience?",
  },
  {
    id: "prior_peptide_use",
    type: "radio",
    label: "Have you used peptide therapy before (any clinic or research source)?",
    required: true,
    options: ["Yes", "No"],
  },
  {
    id: "prior_peptide_detail",
    type: "textarea",
    label: "Prior peptide experience (if yes)",
    required: false,
    conditionalOn: { field: "prior_peptide_use", value: "Yes" },
  },
  {
    id: "preferred_format",
    type: "radio",
    label: "Preferred format (if known)",
    required: false,
    options: ["Injectable", "Topical", "Not sure — discuss at telehealth"],
  },
];

const TELEHEALTH_CONSENT_FIELDS: IntakeFormField[] = [
  {
    id: "telehealth_consent",
    type: "checkbox",
    label: "Telehealth & compliance acknowledgement",
    required: true,
    options: [
      "I understand a telehealth visit with Hello Gorgeous RX™ is required before any prescription or refill is approved",
      "Peptide therapy requires ongoing NP oversight — this request is not a prescription",
      "Medication and pharmacy costs are separate from the consultation fee",
      "I will not share or resell prescribed peptides",
      "Hello Gorgeous may contact me at the information provided",
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

export const PEPTIDE_INTAKE_STEPS: PeptideIntakeStep[] = [
  {
    id: "request-type",
    title: "New or refill?",
    description:
      "Existing patients can request a refill. New clients start with a protocol request and required NP telehealth visit.",
    fields: [
      {
        id: "request_type",
        type: "radio",
        label: "What are you requesting?",
        required: true,
        options: ["New peptide protocol", "Refill of existing protocol"],
      },
    ],
  },
  {
    id: "peptide-select",
    title: "Select peptide(s)",
    description: "Choose what you'd like reviewed. Ryan will confirm the right protocol at your telehealth visit.",
    fields: [
      {
        id: "selected_peptides",
        type: "checkbox",
        label: "Peptide(s) requested",
        required: true,
        options: [],
      },
    ],
  },
  {
    id: "contact",
    title: "Your information",
    fields: CONTACT_FIELDS,
  },
  {
    id: "medical",
    title: "Health screening",
    description: "Required for safe prescribing. Answer honestly — we review every submission.",
    fields: MEDICAL_FIELDS,
  },
  {
    id: "refill-details",
    title: "Refill details",
    description: "Help Ryan approve your refill quickly at telehealth.",
    requestTypes: ["refill"],
    fields: REFILL_FIELDS,
  },
  {
    id: "new-details",
    title: "Your goals",
    requestTypes: ["new"],
    fields: NEW_PROTOCOL_FIELDS,
  },
  {
    id: "consent",
    title: "Consent & signature",
    description:
      "This form is screening and request only — not a diagnosis or prescription. Telehealth with our NP is required.",
    fields: TELEHEALTH_CONSENT_FIELDS,
  },
];

export function peptideRequestType(data: Record<string, unknown>): PeptideRequestType {
  const raw = String(data.request_type || "");
  if (raw.toLowerCase().includes("refill")) return "refill";
  return "new";
}

export function intakeSlugForRequest(data: Record<string, unknown>): string {
  return peptideRequestType(data) === "refill"
    ? PEPTIDE_REFILL_INTAKE_SLUG
    : PEPTIDE_REQUEST_INTAKE_SLUG;
}

export function stepsForRequestType(type: PeptideRequestType): PeptideIntakeStep[] {
  return PEPTIDE_INTAKE_STEPS.filter(
    (step) => !step.requestTypes || step.requestTypes.includes(type),
  );
}

export function evaluatePeptideEligibility(data: Record<string, unknown>): {
  qualified: boolean;
  disqualificationReasons: string[];
  providerFlags: string[];
} {
  const disqualificationReasons: string[] = [];
  const providerFlags: string[] = [];
  const type = peptideRequestType(data);

  if (data.pregnant === "Yes") {
    disqualificationReasons.push("Pregnant, trying to conceive, or breastfeeding");
  }

  const conditions = data.medical_conditions;
  if (Array.isArray(conditions)) {
    if (conditions.includes("Active or untreated cancer")) {
      disqualificationReasons.push("Active or untreated cancer");
    }
    if (conditions.includes("History of blood clots")) {
      providerFlags.push("History of blood clots — NP review required");
    }
    if (conditions.includes("Kidney or liver disease")) {
      providerFlags.push("Kidney or liver disease — NP review required");
    }
  }

  if (data.recent_hospitalization === "Yes") {
    providerFlags.push("Recent hospitalization/surgery — NP review required");
  }

  if (type === "refill") {
    if (data.existing_patient === "No") {
      disqualificationReasons.push("Refills require an existing Hello Gorgeous RX™ patient relationship");
    }
    providerFlags.push(...glp1TelehealthProviderFlags({
      supplyCycleRaw: data.supply_cycle,
      lastVisitWithin90Days: data.last_visit_within_12mo,
      doseChanges: data.dose_changes,
      sideEffects: data.side_effects,
    }));
  }

  if (data.prior_peptide_use === "Yes" && type === "new") {
    providerFlags.push("Prior peptide use — verify sourcing and history at telehealth");
  }

  const selected = data.selected_peptides;
  if (!Array.isArray(selected) || selected.length === 0) {
    disqualificationReasons.push("No peptide selected");
  }

  return {
    qualified: disqualificationReasons.length === 0,
    disqualificationReasons,
    providerFlags,
  };
}

export function peptideSignerName(data: Record<string, unknown>): string {
  const legal = String(data.legal_name || "").trim();
  if (legal) return legal;
  const first = String(data.first_name || "").trim();
  const last = String(data.last_name || "").trim();
  return [first, last].filter(Boolean).join(" ");
}

export const PEPTIDE_DISQUALIFIED_MESSAGE =
  "Thank you for your submission. Based on your answers, we cannot process this request online at this time. Please call (630) 636-6193 to speak with our team — we may still be able to help after a direct clinical conversation.";
