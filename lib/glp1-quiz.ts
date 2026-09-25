import { SQUARE_RX_TELEHEALTH_BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";

export const GLP1_QUIZ_PATH = "/glp-1-quiz";
export const GLP1_QUIZ_HG_URL = "https://hellogorgeousmedspa.com/glp-1-quiz";
export const GLP1_QUIZ_TRYREGEN_URL = "https://tryregenrx.com/glp-1-quiz";
export const GLP1_QUIZ_CAMPAIGN = "glp1_quiz";

export const GLP1_QUIZ_NURSE_CTA = "Schedule a call with a Nurse";
export const GLP1_QUIZ_CONSULT_HREF = SQUARE_RX_TELEHEALTH_BOOKING_URL;

export const GLP1_QUIZ_STEPS = [
  { id: "start", label: "Start" },
  { id: "details", label: "Details" },
  { id: "eligibility", label: "Eligibility" },
] as const;

export type Glp1QuizBrand = "hg" | "regen";
export type Glp1QuizStatus = "qualified" | "needs_review" | "disqualified";

export const GLP1_TYPES = [
  { id: "semaglutide", label: "Semaglutide" },
  { id: "tirzepatide", label: "Tirzepatide" },
  { id: "retatrutide", label: "Retatrutide — request review" },
  { id: "unsure", label: "Not sure — help me choose" },
] as const;

export const GLP1_REASONS = [
  { id: "weight-loss", label: "Weight loss" },
  { id: "maintenance", label: "Maintenance" },
  { id: "blood-sugar", label: "Blood sugar" },
  { id: "pcos", label: "PCOS" },
] as const;

export const YES_NO = [
  { id: "no", label: "No" },
  { id: "yes", label: "Yes" },
] as const;

export const YES_NO_UNSURE = [
  { id: "no", label: "No" },
  { id: "unsure", label: "Not sure" },
  { id: "yes", label: "Yes" },
] as const;

/** Section A — yes = not a telemedicine candidate on this form. */
export const ABSOLUTE_FLAGS = [
  { id: "mtc", label: "Personal or family history of medullary thyroid carcinoma (MTC)?" },
  { id: "men2", label: "Personal or family history of MEN2 syndrome?" },
  { id: "pancreatitis", label: "History of pancreatitis?" },
  { id: "retinopathy", label: "Diabetic retinopathy?" },
  { id: "pregnant", label: "Pregnant, trying to conceive, or breastfeeding?" },
  { id: "type1", label: "Type 1 diabetes?" },
  { id: "allergy", label: "Severe allergy to a GLP-1 medicine, adhesives, or benzyl alcohol?" },
] as const;

export const REVIEW_FLAGS = [
  { id: "type2", label: "Type 2 diabetes?" },
  { id: "gallbladder", label: "Gallbladder disease or gallstones?" },
  { id: "kidney", label: "Kidney disease?" },
  { id: "gi", label: "Gastroparesis or significant GERD?" },
  { id: "eating", label: "Eating disorder (current or history)?" },
  { id: "mood", label: "Depression, anxiety, or suicidal thoughts?" },
  { id: "thyroid", label: "Thyroid disease (other than MTC / MEN2)?" },
  { id: "heart", label: "Heart disease, high blood pressure, or high cholesterol?" },
] as const;

export type Glp1QuizForm = {
  glpType: string;
  reason: string;
  goals: string;
  priorGlp1: string;
  heightFt: string;
  heightIn: string;
  weightLbs: string;
  recentAttempts: string;
  fullName: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  emergencyName: string;
  emergencyPhone: string;
  howHeard: string;
  a1c: string;
  meds: string;
  insulin: string;
  sulfonylurea: string;
  bloodThinners: string;
  allergies: string;
  supplements: string;
  alcohol: string;
  smoking: string;
  diet: string;
  exercise: string;
  sleep: string;
  willingChanges: string;
  ackRxOnly: boolean;
  ackSideEffects: boolean;
  ackCompounded: boolean;
  ackSms: boolean;
  ackHipaa: boolean;
} & Record<(typeof ABSOLUTE_FLAGS)[number]["id"], string> &
  Record<(typeof REVIEW_FLAGS)[number]["id"], string>;

export const EMPTY_GLP1_QUIZ: Glp1QuizForm = {
  glpType: "",
  reason: "",
  goals: "",
  priorGlp1: "",
  heightFt: "",
  heightIn: "",
  weightLbs: "",
  recentAttempts: "",
  fullName: "",
  dob: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "IL",
  zip: "",
  emergencyName: "",
  emergencyPhone: "",
  howHeard: "",
  mtc: "",
  men2: "",
  pancreatitis: "",
  retinopathy: "",
  pregnant: "",
  type1: "",
  allergy: "",
  type2: "",
  gallbladder: "",
  kidney: "",
  gi: "",
  eating: "",
  mood: "",
  thyroid: "",
  heart: "",
  a1c: "",
  meds: "",
  insulin: "",
  sulfonylurea: "",
  bloodThinners: "",
  allergies: "",
  supplements: "",
  alcohol: "",
  smoking: "",
  diet: "",
  exercise: "",
  sleep: "",
  willingChanges: "",
  ackRxOnly: false,
  ackSideEffects: false,
  ackCompounded: false,
  ackSms: false,
  ackHipaa: false,
};

export function computeBmi(heightFt: string, heightIn: string, weightLbs: string): number | null {
  const ft = Number(heightFt);
  const inch = Number(heightIn);
  const lbs = Number(weightLbs);
  const totalIn = ft * 12 + (Number.isFinite(inch) ? inch : 0);
  if (!(lbs > 0) || !(totalIn >= 48 && totalIn <= 96)) return null;
  return Math.round((703 * lbs) / (totalIn * totalIn) * 10) / 10;
}

export function bmiLabel(bmi: number | null): string {
  if (bmi == null) return "";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function absoluteYesFlags(form: Pick<Glp1QuizForm, (typeof ABSOLUTE_FLAGS)[number]["id"]>): string[] {
  return ABSOLUTE_FLAGS.filter((f) => form[f.id] === "yes").map((f) => f.label);
}

export function reviewYesFlags(form: Pick<Glp1QuizForm, (typeof REVIEW_FLAGS)[number]["id"] | "insulin" | "sulfonylurea" | "bloodThinners">): string[] {
  const flags = REVIEW_FLAGS.filter((f) => form[f.id] === "yes").map((f) => f.label);
  if (form.insulin === "yes") flags.push("Insulin");
  if (form.sulfonylurea === "yes") flags.push("Sulfonylurea");
  if (form.bloodThinners === "yes") flags.push("Blood thinners");
  return flags;
}

export function quizStatus(form: Glp1QuizForm): Glp1QuizStatus {
  if (form.state.trim().toUpperCase() !== "IL") return "disqualified";
  if (absoluteYesFlags(form).length) return "disqualified";
  if (reviewYesFlags(form).length) return "needs_review";
  return "qualified";
}

export const GLP1_QUIZ_DQ_COPY =
  "It looks like you may not qualify for telemedicine GLP-1 at this time. Based on your answers, your medical history means you are not a great candidate for telemedicine. The safest course of action is to work with a local doctor or clinic, as certain complications may need closer monitoring.";

export const GLP1_QUIZ_DQ_EXCEPTION =
  "If you believe you are an exception, schedule a call with our nurse. A visit is not a guaranteed prescription.";

export type Glp1QuizErrors = Partial<Record<keyof Glp1QuizForm, string>>;

export function validateGlp1QuizStep(form: Glp1QuizForm, step: 0 | 1 | 2): Glp1QuizErrors {
  const e: Glp1QuizErrors = {};
  if (step === 0) {
    if (!form.glpType) e.glpType = "Required";
    if (!form.reason) e.reason = "Required";
    if (!form.goals.trim()) e.goals = "Required";
    if (!form.priorGlp1) e.priorGlp1 = "Required";
    if (computeBmi(form.heightFt, form.heightIn, form.weightLbs) == null) {
      e.heightFt = "Enter height and weight";
      e.weightLbs = "Required";
    }
  }
  if (step === 1) {
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.dob) e.dob = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!form.zip.trim()) e.zip = "Required";
  }
  if (step === 2) {
    for (const f of ABSOLUTE_FLAGS) {
      if (!form[f.id]) e[f.id] = "Required";
    }
    for (const f of REVIEW_FLAGS) {
      if (!form[f.id]) e[f.id] = "Required";
    }
    if (!form.meds.trim()) e.meds = "Required — list medications or None";
    if (!form.allergies.trim()) e.allergies = "Required — list allergies or None";
    if (!form.willingChanges) e.willingChanges = "Required";
    if (!form.ackRxOnly) e.ackRxOnly = "Required";
    if (!form.ackSideEffects) e.ackSideEffects = "Required";
    if (!form.ackCompounded) e.ackCompounded = "Required";
    if (!form.ackSms) e.ackSms = "Required";
    if (!form.ackHipaa) e.ackHipaa = "Required";
  }
  return e;
}

export function validateGlp1Quiz(form: Glp1QuizForm): Glp1QuizErrors {
  return {
    ...validateGlp1QuizStep(form, 0),
    ...validateGlp1QuizStep(form, 1),
    ...validateGlp1QuizStep(form, 2),
  };
}

export function glp1QuizShareUrl(brand: Glp1QuizBrand): string {
  return brand === "regen" ? GLP1_QUIZ_TRYREGEN_URL : GLP1_QUIZ_HG_URL;
}

export const GLP1_QUIZ_SMS = [
  "REGEN RX / Hello Gorgeous — 3-minute GLP-1 screening. A licensed Illinois clinician reviews every request:",
  GLP1_QUIZ_TRYREGEN_URL,
].join(" ");

export const GLP1_QUIZ_TRUST = [
  "Licensed Illinois clinician review",
  `${SITE.reviewRating}★ Google · ${SITE.reviewCount} reviews`,
  "Illinois adults 21+",
  "No card on this form",
] as const;
