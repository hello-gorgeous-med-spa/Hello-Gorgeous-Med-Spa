/**
 * Native GLP-1 weight loss screening intake — `/glp1-intake`
 * Submissions → hg_form_submissions slug `glp1-weight-loss-intake`
 */

import type { IntakeFormField } from "@/lib/hgos/intake-forms";

export const GLP1_INTAKE_SLUG = "glp1-weight-loss-intake";

export const GLP1_DISQUALIFIED_MESSAGE =
  "Thank you for completing our intake. Based on your responses, GLP-1 therapy through our current program may not be the right fit at this time. Certain conditions need a different level of care before starting this treatment. We encourage you to discuss options with your primary care provider. Questions? Call 630-636-6193.";

export type Glp1IntakeStep = {
  id: string;
  title: string;
  description?: string;
  fields: IntakeFormField[];
};

export const GLP1_INTAKE_STEPS: Glp1IntakeStep[] = [
  {
    id: "contact",
    title: "Your information",
    description: "We'll use this to match your chart and follow up within one business day.",
    fields: [
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
      },
      { id: "dob", type: "date", label: "Date of birth", required: true },
      {
        id: "zip",
        type: "text",
        label: "ZIP code",
        required: true,
        placeholder: "60543",
        helpText: "5-digit ZIP",
      },
    ],
  },
  {
    id: "screening",
    title: "Health screening",
    description: "These answers help us determine if GLP-1 therapy may be appropriate for you.",
    fields: [
      {
        id: "height_ft",
        type: "text",
        label: "Height (feet)",
        required: true,
        placeholder: "5",
      },
      {
        id: "height_in",
        type: "text",
        label: "Height (inches)",
        required: true,
        placeholder: "6",
      },
      {
        id: "weight_lbs",
        type: "text",
        label: "Weight (lbs)",
        required: true,
        placeholder: "180",
      },
      {
        id: "type1_diabetes",
        type: "radio",
        label: "Do you have Type 1 diabetes?",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "pregnant",
        type: "radio",
        label: "Are you pregnant, trying to conceive, or breastfeeding?",
        required: true,
        options: ["Yes", "No", "N/A"],
      },
      {
        id: "mtc_men2",
        type: "radio",
        label:
          "Personal or family history of medullary thyroid carcinoma (MTC) or Multiple Endocrine Neoplasia type 2 (MEN 2)?",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "on_glp1",
        type: "radio",
        label: "Are you currently taking a GLP-1 medication?",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "pancreatitis",
        type: "radio",
        label: "History of pancreatitis?",
        required: true,
        options: ["Yes", "No"],
      },
    ],
  },
  {
    id: "history",
    title: "Goals & history",
    fields: [
      {
        id: "weight_goal",
        type: "select",
        label: "Weight loss goal",
        required: true,
        options: ["10–20 lbs", "20–50 lbs", "50+ lbs"],
      },
      {
        id: "tried_before",
        type: "radio",
        label: "Have you tried weight loss programs before?",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "tried_methods",
        type: "checkbox",
        label: "What have you tried?",
        required: false,
        options: ["Diet / nutrition", "Exercise", "Prescription medication", "Other"],
        conditionalOn: { field: "tried_before", value: "Yes" },
      },
      {
        id: "conditions",
        type: "checkbox",
        label: "Do any of these apply?",
        required: false,
        options: [
          "High blood pressure",
          "High cholesterol",
          "Prediabetes",
          "Type 2 diabetes",
          "PCOS",
          "None of the above",
        ],
      },
      {
        id: "rx_medications",
        type: "radio",
        label: "Are you currently taking prescription medications?",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "rx_medications_list",
        type: "textarea",
        label: "List your prescription medications",
        required: false,
        placeholder: "Include dose if known",
        conditionalOn: { field: "rx_medications", value: "Yes" },
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
    ],
  },
  {
    id: "consent",
    title: "Consent & signature",
    description:
      "This form is for screening only — not a diagnosis or prescription. A provider will review your answers before any treatment.",
    fields: [
      {
        id: "intake_consent",
        type: "checkbox",
        label: "I acknowledge:",
        required: true,
        options: [
          "The information I provide is accurate to the best of my knowledge",
          "This intake is informational screening only — not a diagnosis or provider relationship",
          "A licensed provider must review my intake before any prescription",
          "Hello Gorgeous Med Spa may contact me about my screening results",
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
    ],
  },
];

export function computeBmi(
  heightFt: number,
  heightIn: number,
  weightLbs: number,
): number | null {
  if (!Number.isFinite(heightFt) || !Number.isFinite(heightIn) || !Number.isFinite(weightLbs)) {
    return null;
  }
  const totalIn = heightFt * 12 + heightIn;
  if (totalIn <= 0 || weightLbs <= 0) return null;
  const bmi = (weightLbs / (totalIn * totalIn)) * 703;
  return Math.round(bmi * 10) / 10;
}

export function parseGlp1Numbers(data: Record<string, unknown>) {
  const heightFt = Number.parseInt(String(data.height_ft ?? ""), 10);
  const heightIn = Number.parseInt(String(data.height_in ?? ""), 10);
  const weightLbs = Number.parseFloat(String(data.weight_lbs ?? ""));
  return { heightFt, heightIn, weightLbs };
}

export function evaluateGlp1Eligibility(data: Record<string, unknown>): {
  qualified: boolean;
  disqualificationReasons: string[];
  providerFlags: string[];
  bmi: number | null;
} {
  const disqualificationReasons: string[] = [];
  const providerFlags: string[] = [];

  const { heightFt, heightIn, weightLbs } = parseGlp1Numbers(data);
  const bmi = computeBmi(heightFt, heightIn, weightLbs);

  if (data.type1_diabetes === "Yes") {
    disqualificationReasons.push("Type 1 diabetes");
  }
  if (data.pregnant === "Yes") {
    disqualificationReasons.push("Pregnant, trying to conceive, or breastfeeding");
  }
  if (data.mtc_men2 === "Yes") {
    disqualificationReasons.push("MTC or MEN 2 history");
  }
  if (data.pancreatitis === "Yes") {
    providerFlags.push("History of pancreatitis — provider review required");
  }
  if (data.on_glp1 === "Yes") {
    providerFlags.push("Currently on GLP-1 — provider review required");
  }

  return {
    qualified: disqualificationReasons.length === 0,
    disqualificationReasons,
    providerFlags,
    bmi,
  };
}

export function glp1SignerName(data: Record<string, unknown>): string {
  const legal = String(data.legal_name || "").trim();
  if (legal) return legal;
  const first = String(data.first_name || "").trim();
  const last = String(data.last_name || "").trim();
  return [first, last].filter(Boolean).join(" ");
}
