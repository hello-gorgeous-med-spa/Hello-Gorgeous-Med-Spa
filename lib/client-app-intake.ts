/**
 * Vitamin Bar / drive-thru wellness intake — used in the Hello Gorgeous client app (/app).
 * Submissions go to hg_form_submissions via slug `vitamin-bar-intake`.
 */

import type { IntakeForm } from "@/lib/hgos/intake-forms";

export const CLIENT_APP_INTAKE_SLUG = "vitamin-bar-intake";

export const CLIENT_APP_INTAKE_STORAGE_KEY = "hg-client-intake-completed";

export const VITAMIN_BAR_INTAKE_FORM: IntakeForm = {
  id: CLIENT_APP_INTAKE_SLUG,
  name: "Wellness Intake",
  description:
    "Quick health screening for Vitamin Bar shots and drive-thru wellness. Required before your first injection visit.",
  category: "intake",
  requiresSignature: true,
  expiresInDays: 365,
  requiredForServices: ["vitamin-bar"],
  fields: [
    { id: "section-contact", type: "section", label: "Your info", required: false },
    {
      id: "full_name",
      type: "text",
      label: "Full legal name",
      required: true,
      placeholder: "Jane Doe",
    },
    {
      id: "phone",
      type: "phone",
      label: "Mobile phone",
      required: true,
      placeholder: "(630) 555-1234",
      helpText: "Used to match your chart and check you in curbside.",
    },
    { id: "dob", type: "date", label: "Date of birth", required: true },
    {
      id: "email",
      type: "text",
      label: "Email (optional)",
      required: false,
      placeholder: "you@email.com",
    },

    { id: "section-medical", type: "section", label: "Health screening", required: false },
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
      label: "Do any of the following apply to you?",
      required: false,
      options: [
        "Diabetes",
        "Kidney or liver disease",
        "Heart disease",
        "Bleeding disorder or on blood thinners",
        "Autoimmune condition",
        "Cancer (current or history)",
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
      id: "recent_illness",
      type: "radio",
      label: "Have you had fever, infection, or been hospitalized in the last 14 days?",
      required: true,
      options: ["Yes", "No"],
    },

    { id: "section-consent", type: "section", label: "Consent", required: false },
    {
      id: "understand_treatment",
      type: "checkbox",
      label: "I understand and acknowledge:",
      required: true,
      options: [
        "Vitamin injections are administered by licensed providers at Hello Gorgeous Med Spa",
        "Results vary; injections are not a substitute for medical care from my primary doctor",
        "I will report any unusual reaction immediately",
        "I have had the opportunity to ask questions",
      ],
    },
    {
      id: "accuracy",
      type: "checkbox",
      label: "Certification",
      required: true,
      options: ["I confirm the information above is accurate to the best of my knowledge"],
    },
    { id: "signature", type: "signature", label: "Signature", required: true },
  ],
};

export function markClientIntakeCompleted(reference?: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      CLIENT_APP_INTAKE_STORAGE_KEY,
      JSON.stringify({ at: new Date().toISOString(), reference: reference || null }),
    );
  } catch {
    /* ignore quota / private mode */
  }
}

export function getClientIntakeCompletion(): { at: string; reference: string | null } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CLIENT_APP_INTAKE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { at?: string; reference?: string | null };
    if (!parsed?.at) return null;
    return { at: parsed.at, reference: parsed.reference ?? null };
  } catch {
    return null;
  }
}
