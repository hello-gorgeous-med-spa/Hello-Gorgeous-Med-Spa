/** REGEN RX refill / add-on screening (BPC-157 first, now generic SKU picker). */

import { regenRequestSkuById } from "@/lib/regen/refill-request-catalog";

export const REGEN_REFILL_HUB_PATH = "/regen/refill";
export const BPC157_REFILL_PATH = "/regen/refill/bpc-157";
export const BPC157_REFILL_CAMPAIGN = "regen_refill_bpc157";
export const BPC157_REFILL_SHORT_URL = "https://hellogorgeousmedspa.com/regen/refill/bpc-157";

export const BPC157_REFILL_SMS =
  `REGEN RX refill screening — BPC-157. Existing patients only. Tap to complete so Ryan can review: ${BPC157_REFILL_SHORT_URL}`;

export const BPC157_REFILL_ACK =
  "I understand BPC-157 is not FDA approved for this indication, is considered investigational, and long-term risks are not fully known. I am continuing voluntarily.";

export const FORM_TYPES = ["Capsule", "Injectable SubQ", "Nasal Spray", "Other"] as const;
export const STORAGE_OPTIONS = ["Refrigerated", "Room Temp", "Reconstituted date", "Other"] as const;
export const MISSED_OPTIONS = ["None", "1-2", "3+"] as const;
export const BENEFIT_WHEN = ["Day 1-3", "Week 1", "Week 2", "Week 3-4", "No benefit yet"] as const;
export const ALCOHOL_OPTIONS = ["None", "1-3", "4-7", "8+"] as const;
export const ADHERENCE_OPTIONS = ["As directed", "Changed"] as const;
export const CONDITION_OPTIONS = [
  "Liver",
  "Kidney",
  "Heart",
  "Clotting disorder",
  "Autoimmune",
  "Cancer history",
  "None",
  "Other",
] as const;
export const HIGH_RISK_CONDITIONS = [
  "Liver",
  "Kidney",
  "Heart",
  "Clotting disorder",
  "Autoimmune",
  "Cancer history",
] as const;

export const SAFETY_FLAGS = [
  {
    id: "s1",
    label: "Nausea, flushing, dizziness, headache, palpitations?",
    flag: "Nausea/flushing/dizziness/headache/palpitations",
  },
  {
    id: "s2",
    label: "Swelling at injection site, rash, joint pain, mood change?",
    flag: "Swelling/rash/joint pain/mood change",
  },
  {
    id: "s3",
    label: "ER visit, hospitalization, new diagnosis since last fill?",
    flag: "ER visit / hospitalization / new diagnosis",
  },
  {
    id: "s4",
    label: "New allergies or reaction?",
    flag: "New allergies/reaction",
  },
  {
    id: "s5",
    label: "Infection, fever, illness last 7 days?",
    flag: "Infection/fever/illness last 7 days",
  },
  {
    id: "s6",
    label: "For injectable: redness, warmth, pain, drainage?",
    flag: "Injection site redness/warmth/pain/drainage",
    injectableOnly: true,
  },
] as const;

export type SafetyFlagId = (typeof SAFETY_FLAGS)[number]["id"];

export type Bpc157RefillForm = {
  requestIntent: string;
  skuId: string;
  fullName: string;
  dob: string;
  phone: string;
  email: string;
  formType: string;
  strength: string;
  earlyWhy: string;
  storedHow: string;
  missedDoses: string;
  missedWhy: string;
  reconstDate: string;
  originalGoal: string;
  improvement: number;
  firstBenefit: string;
  betterWorse: string;
  reinjury: string;
  s1: string;
  s1Detail: string;
  s2: string;
  s2Detail: string;
  s3: string;
  s3Detail: string;
  s4: string;
  s4Detail: string;
  s5: string;
  s5Detail: string;
  s6: string;
  s6Rotating: string;
  s6Detail: string;
  otherSideEffects: string;
  conditions: string[];
  conditionOther: string;
  pregnant: string;
  weightChange: string;
  newMeds: string;
  alcohol: string;
  adherence: string;
  nextGoal: string;
  ack: boolean;
  questions: string;
  signature: string;
};

export const EMPTY_BPC157_REFILL: Bpc157RefillForm = {
  requestIntent: "",
  skuId: "",
  fullName: "",
  dob: "",
  phone: "",
  email: "",
  formType: "",
  strength: "",
  earlyWhy: "",
  storedHow: "",
  missedDoses: "",
  missedWhy: "",
  reconstDate: "",
  originalGoal: "",
  improvement: 50,
  firstBenefit: "",
  betterWorse: "",
  reinjury: "",
  s1: "",
  s1Detail: "",
  s2: "",
  s2Detail: "",
  s3: "",
  s3Detail: "",
  s4: "",
  s4Detail: "",
  s5: "",
  s5Detail: "",
  s6: "",
  s6Rotating: "",
  s6Detail: "",
  otherSideEffects: "",
  conditions: [],
  conditionOther: "",
  pregnant: "",
  weightChange: "",
  newMeds: "",
  alcohol: "",
  adherence: "",
  nextGoal: "",
  ack: false,
  questions: "",
  signature: "",
};

export type Bpc157RefillErrors = Partial<Record<keyof Bpc157RefillForm, string>>;

export function validateBpc157Refill(e: Bpc157RefillForm): Bpc157RefillErrors {
  const a: Bpc157RefillErrors = {};
  if (e.requestIntent !== "refill" && e.requestIntent !== "add") a.requestIntent = "Required";
  if (!regenRequestSkuById(e.skuId)) a.skuId = "Select a protocol";
  if (!e.fullName.trim()) a.fullName = "Required";
  if (!e.dob) a.dob = "Required";
  if (!e.phone.trim()) a.phone = "Required";
  if (!e.email.includes("@")) a.email = "Valid email required";
  if (!e.formType) a.formType = "Required";
  if (!e.strength.trim()) a.strength = "Required";
  if (!e.originalGoal.trim()) a.originalGoal = "Required";
  if (!e.firstBenefit) a.firstBenefit = "Required";
  if (!e.nextGoal.trim()) a.nextGoal = "Required";
  if (!e.ack) a.ack = "You must acknowledge to continue";
  if (!e.signature.trim()) a.signature = "Signature required";
  if (!e.pregnant) a.pregnant = "Required";
  if (!e.adherence) a.adherence = "Required";
  if (!e.newMeds.trim()) a.newMeds = "Required";
  for (const id of ["s1", "s2", "s3", "s4", "s5"] as const) {
    if (!e[id]) a[id] = "Select Yes or No";
  }
  if (e.formType === "Injectable SubQ" && !e.s6) a.s6 = "Required for injectable";
  return a;
}

export function bpc157RedFlags(e: Bpc157RefillForm): string[] {
  const v: string[] = [];
  for (const flag of SAFETY_FLAGS) {
    if (e[flag.id] === "Yes") v.push(flag.flag);
  }
  if (e.formType === "Injectable SubQ" && e.s6Rotating === "No") {
    v.push("Not rotating sites / reusing needle");
  }
  if (e.pregnant === "Yes") v.push("Pregnant / TTC / Breastfeeding");
  if (e.conditions.some((z) => (HIGH_RISK_CONDITIONS as readonly string[]).includes(z))) {
    v.push("New significant medical condition");
  }
  if (e.adherence === "Changed") v.push("Changed dose on own");
  return v;
}

export function smsRefillHref(): string {
  return `sms:?&body=${encodeURIComponent(BPC157_REFILL_SMS)}`;
}
