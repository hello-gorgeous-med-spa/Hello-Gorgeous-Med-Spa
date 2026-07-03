/**
 * RE GEN post-payment intake — pay first, then health history, then telehealth before ship.
 */

import type { IntakeFormField } from "@/lib/hgos/intake-forms";
import type { RegenCategory } from "@/lib/regen/intake-router";
import { getProductIntakeRoute } from "@/lib/regen/intake-router";
import { computeBmi, evaluateGlp1Eligibility, parseGlp1Numbers } from "@/lib/glp1-intake";

export const REGEN_POST_PAYMENT_INTAKE_SLUG = "regen-post-payment-intake";

export type RegenIntakeStep = {
  id: string;
  title: string;
  description?: string;
  fields: IntakeFormField[];
};

const CONSENT_STEP: RegenIntakeStep = {
  id: "consent",
  title: "Consent & signature",
  description:
    "Your provider reviews this intake before any prescription ships. Nothing is dispensed without clinical approval.",
  fields: [
    {
      id: "intake_consent",
      type: "checkbox",
      label: "I acknowledge:",
      required: true,
      options: [
        "The information I provide is accurate to the best of my knowledge",
        "This intake is for clinical review — not a diagnosis or guarantee of treatment",
        "A licensed NP must approve my order before pharmacy dispatch",
        "Hello Gorgeous Med Spa may contact me about my order and telehealth visit",
      ],
    },
    {
      id: "legal_name",
      type: "text",
      label: "Electronic signature (type your full legal name)",
      required: true,
      placeholder: "Must match the name on your order",
    },
    { id: "signature", type: "signature", label: "Sign below", required: true },
  ],
};

const DEMOGRAPHICS_STEP: RegenIntakeStep = {
  id: "demographics",
  title: "Your details & shipping",
  description: "Confirm contact info and where your Rx should ship after NP approval.",
  fields: [
    {
      id: "confirm_name",
      type: "text",
      label: "Full legal name",
      required: true,
      placeholder: "Jane Doe",
    },
    {
      id: "confirm_email",
      type: "text",
      label: "Email",
      required: true,
      placeholder: "you@email.com",
    },
    {
      id: "confirm_phone",
      type: "phone",
      label: "Mobile phone",
      required: true,
      placeholder: "(630) 555-1234",
    },
    { id: "dob", type: "date", label: "Date of birth", required: true },
    {
      id: "sex",
      type: "select",
      label: "Sex assigned at birth",
      required: true,
      options: ["Female", "Male", "Prefer not to say"],
      helpText: "Used for appropriate clinical screening only.",
    },
    {
      id: "shipping_street",
      type: "text",
      label: "Shipping street address",
      required: true,
      placeholder: "123 Main St",
    },
    {
      id: "shipping_city",
      type: "text",
      label: "City",
      required: true,
      placeholder: "Oswego",
    },
    {
      id: "shipping_state",
      type: "text",
      label: "State",
      required: true,
      placeholder: "IL",
    },
    {
      id: "shipping_zip",
      type: "text",
      label: "ZIP code",
      required: true,
      placeholder: "60543",
    },
    {
      id: "emergency_name",
      type: "text",
      label: "Emergency contact name",
      required: true,
    },
    {
      id: "emergency_phone",
      type: "phone",
      label: "Emergency contact phone",
      required: true,
    },
  ],
};

const MEDICAL_BASE_STEP: RegenIntakeStep = {
  id: "medical",
  title: "Medical history",
  description: "Complete and accurate answers help Ryan Kent, FNP-BC review your order safely.",
  fields: [
    {
      id: "allergies",
      type: "textarea",
      label: "Medication or drug allergies",
      required: true,
      placeholder: "None, or list drug name and reaction",
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
      label: "List prescription medications (include dose if known)",
      required: false,
      placeholder: "Include supplements and OTC meds you take regularly",
      conditionalOn: { field: "rx_medications", value: "Yes" },
    },
    {
      id: "conditions",
      type: "checkbox",
      label: "Do any of these apply to you?",
      required: false,
      options: [
        "High blood pressure",
        "High cholesterol",
        "Diabetes (Type 2)",
        "Heart disease",
        "Kidney disease",
        "Liver disease",
        "Thyroid disorder",
        "Autoimmune condition",
        "Cancer (current or history)",
        "None of the above",
      ],
    },
    {
      id: "surgeries",
      type: "textarea",
      label: "Past surgeries or hospitalizations (optional)",
      required: false,
      placeholder: "None",
    },
    {
      id: "pregnant",
      type: "radio",
      label: "Are you pregnant, trying to conceive, or breastfeeding?",
      required: true,
      options: ["Yes", "No", "N/A"],
    },
  ],
};

const WEIGHT_LOSS_STEP: RegenIntakeStep = {
  id: "weight-loss",
  title: "Weight loss screening",
  description: "Required for GLP-1 / weight management orders.",
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
      label: "Current weight (lbs)",
      required: true,
      placeholder: "180",
    },
    {
      id: "weight_goal",
      type: "select",
      label: "Weight loss goal",
      required: true,
      options: ["10–20 lbs", "20–50 lbs", "50+ lbs", "Maintenance / metabolic support"],
    },
    {
      id: "type1_diabetes",
      type: "radio",
      label: "Do you have Type 1 diabetes?",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "mtc_men2",
      type: "radio",
      label:
        "Personal or family history of medullary thyroid carcinoma (MTC) or MEN type 2?",
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
    {
      id: "on_glp1",
      type: "radio",
      label: "Are you currently taking a GLP-1 medication?",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "treatment_goals",
      type: "textarea",
      label: "Anything else your provider should know about your weight loss goals?",
      required: false,
      placeholder: "Optional",
    },
  ],
};

const SEXUAL_HEALTH_STEP: RegenIntakeStep = {
  id: "sexual-health",
  title: "Sexual health screening",
  fields: [
    {
      id: "nitrates",
      type: "radio",
      label: "Do you take nitrates or nitroglycerin for chest pain?",
      required: true,
      options: ["Yes", "No"],
      helpText: "Required safety screen for PDE-5 medications.",
    },
    {
      id: "heart_condition",
      type: "radio",
      label: "History of heart attack, stroke, or uncontrolled high blood pressure?",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "treatment_goals",
      type: "textarea",
      label: "What are you hoping to improve?",
      required: false,
      placeholder: "Optional — helps your provider personalize care",
    },
  ],
};

const HORMONES_STEP: RegenIntakeStep = {
  id: "hormones",
  title: "Hormone therapy screening",
  fields: [
    {
      id: "hormone_symptoms",
      type: "checkbox",
      label: "Which symptoms apply?",
      required: false,
      options: [
        "Low energy / fatigue",
        "Low libido",
        "Mood changes",
        "Sleep issues",
        "Weight gain",
        "Hot flashes",
        "Muscle loss",
        "Brain fog",
        "None of the above",
      ],
    },
    {
      id: "prior_hrt",
      type: "radio",
      label: "Have you used hormone therapy before?",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "prior_hrt_detail",
      type: "textarea",
      label: "If yes, what did you use and when?",
      required: false,
      conditionalOn: { field: "prior_hrt", value: "Yes" },
    },
    {
      id: "treatment_goals",
      type: "textarea",
      label: "Primary goals for hormone therapy",
      required: false,
    },
  ],
};

const WELLNESS_STEP: RegenIntakeStep = {
  id: "wellness",
  title: "Protocol screening",
  fields: [
    {
      id: "cancer_active",
      type: "radio",
      label: "Do you have active cancer or are you undergoing cancer treatment?",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "immunosuppressed",
      type: "radio",
      label: "Are you immunosuppressed or on chronic steroids?",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "treatment_goals",
      type: "textarea",
      label: "What results are you hoping for with this protocol?",
      required: false,
    },
  ],
};

const CATEGORY_STEPS: Record<RegenCategory, RegenIntakeStep | null> = {
  "weight-loss": WEIGHT_LOSS_STEP,
  "sexual-health": SEXUAL_HEALTH_STEP,
  hormones: HORMONES_STEP,
  "daily-wellness": WELLNESS_STEP,
  "hair-skin": WELLNESS_STEP,
  labs: WELLNESS_STEP,
};

/** Map storefront quiz goal slugs to intake categories. */
export function normalizeRegenGoal(goal: string | null | undefined): RegenCategory {
  const g = (goal || "").toLowerCase().trim();
  const map: Record<string, RegenCategory> = {
    "weight-loss": "weight-loss",
    "peptide-therapy": "daily-wellness",
    "vitamin-injections": "daily-wellness",
    "sexual-health": "sexual-health",
    hormones: "hormones",
    "hair-skin": "hair-skin",
    labs: "labs",
  };
  return map[g] || "daily-wellness";
}

export function resolveOrderCategory(order: {
  goal?: string | null;
  items?: Array<{ id?: string; name?: string }> | null;
}): RegenCategory {
  if (order.goal) {
    return normalizeRegenGoal(order.goal);
  }
  const firstId = order.items?.[0]?.id;
  if (firstId) {
    return getProductIntakeRoute(firstId).intakeType === "glp1"
      ? "weight-loss"
      : getProductIntakeRoute(firstId).intakeType === "hrt"
        ? "hormones"
        : getProductIntakeRoute(firstId).intakeType === "lab"
          ? "labs"
          : getProductIntakeRoute(firstId).intakeType === "peptide"
            ? "daily-wellness"
            : "daily-wellness";
  }
  return "daily-wellness";
}

export function buildRegenPostPaymentIntakeSteps(category: RegenCategory): RegenIntakeStep[] {
  const categoryStep = CATEGORY_STEPS[category];
  return [
    DEMOGRAPHICS_STEP,
    MEDICAL_BASE_STEP,
    ...(categoryStep ? [categoryStep] : []),
    CONSENT_STEP,
  ];
}

export function evaluateRegenIntake(
  category: RegenCategory,
  data: Record<string, unknown>,
): {
  qualified: boolean;
  disqualificationReasons: string[];
  providerFlags: string[];
  bmi: number | null;
} {
  const disqualificationReasons: string[] = [];
  const providerFlags: string[] = [];

  if (data.pregnant === "Yes") {
    disqualificationReasons.push("Pregnant, trying to conceive, or breastfeeding");
  }

  if (category === "weight-loss") {
    const glp1 = evaluateGlp1Eligibility({
      ...data,
      pregnant: data.pregnant === "Yes" ? "Yes" : "No",
    });
    disqualificationReasons.push(...glp1.disqualificationReasons);
    providerFlags.push(...glp1.providerFlags);
    return {
      qualified: disqualificationReasons.length === 0,
      disqualificationReasons,
      providerFlags,
      bmi: glp1.bmi,
    };
  }

  if (category === "sexual-health") {
    if (data.nitrates === "Yes") {
      disqualificationReasons.push("Currently taking nitrates — PDE-5 therapy contraindicated");
    }
    if (data.heart_condition === "Yes") {
      providerFlags.push("Cardiac history — provider review required");
    }
  }

  if (category === "daily-wellness" || category === "hair-skin") {
    if (data.cancer_active === "Yes") {
      providerFlags.push("Active cancer — provider review required");
    }
    if (data.immunosuppressed === "Yes") {
      providerFlags.push("Immunosuppression — provider review required");
    }
  }

  if (data.on_glp1 === "Yes") {
    providerFlags.push("Currently on GLP-1 — provider review required");
  }

  const { heightFt, heightIn, weightLbs } = parseGlp1Numbers(data);
  const bmi = computeBmi(heightFt, heightIn, weightLbs);

  return {
    qualified: disqualificationReasons.length === 0,
    disqualificationReasons,
    providerFlags,
    bmi,
  };
}

export function regenIntakeSignerName(data: Record<string, unknown>): string {
  const legal = String(data.legal_name || "").trim();
  if (legal) return legal;
  return String(data.confirm_name || "").trim();
}

export function prefillRegenIntakeFromOrder(order: {
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  allergies?: string | null;
}): Record<string, string> {
  return {
    confirm_name: order.customer_name?.trim() || "",
    confirm_email: order.customer_email?.trim() || "",
    confirm_phone: order.customer_phone?.trim() || "",
    allergies: order.allergies?.trim() || "None",
  };
}
