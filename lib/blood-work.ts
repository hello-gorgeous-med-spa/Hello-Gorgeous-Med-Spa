/**
 * /blood-work — comprehensive lab education + Hello Gorgeous ordering workflow.
 */

import type { FAQ } from "@/lib/seo";
import { FULLSCRIPT_DISPENSARY_URL } from "@/lib/flows";
import { RYAN_FULL_NAME } from "@/lib/founder-credentials";

export const BLOOD_WORK_PATH = "/blood-work";

export type BloodWorkJumpLink = {
  id: string;
  label: string;
};

export type BloodWorkDomain = {
  id: string;
  index: number;
  title: string;
  markers: string;
  summary: string;
};

export type BloodWorkPattern = {
  title: string;
  body: string;
};

export type BloodWorkPrepTip = {
  title: string;
  body: string;
};

export const BLOOD_WORK_JUMP_LINKS: BloodWorkJumpLink[] = [
  { id: "bottom-line", label: "Bottom line" },
  { id: "why-comprehensive", label: "Why it matters" },
  { id: "how-we-order", label: "How we order" },
  { id: "domains", label: "10 domains" },
  { id: "patterns", label: "Patterns" },
  { id: "prep", label: "Prep tips" },
  { id: "retest", label: "Retesting" },
  { id: "faq", label: "FAQ" },
];

export const BLOOD_WORK_BOTTOM_LINE = [
  {
    bold: "You deserve more than a standard panel.",
    rest: "Most annual physicals check 8–14 markers. Our comprehensive wellness panels check 60+ across 10 systems — heart, metabolism, hormones, thyroid, liver, kidneys, blood cells, vitamins, and inflammation.",
  },
  {
    bold: "Patterns matter more than any single number.",
    rest: "A “normal” fasting glucose means less if your insulin and triglycerides tell a different story. Comprehensive panels are designed to catch those connections.",
  },
  {
    bold: "Trends over time beat any single draw.",
    rest: "One result is a snapshot. Two or three over a year show direction — and that is where the real value is for hormone, weight loss, and longevity planning.",
  },
  {
    bold: "Your provider reads results in context.",
    rest: "Reference ranges are starting points, not verdicts. Age, activity, medications, and your goals all factor in — reviewed by our NP team.",
  },
] as const;

export const BLOOD_WORK_LAB_PARTNERS = [
  {
    id: "fullscript",
    name: "FullScript Labs",
    badge: "Primary",
    description:
      "We run most comprehensive panels through FullScript — our preferred lab workflow for hormone, metabolic, and wellness testing. Requisitions, tracking, and results stay organized in one place.",
    href: FULLSCRIPT_DISPENSARY_URL,
    cta: "Open FullScript portal →",
    bullets: [
      "60+ biomarker wellness panels",
      "Hormone & metabolic monitoring",
      "Results reviewed at your consult",
      "Supplement recommendations when appropriate",
    ],
  },
  {
    id: "quest-labcorp",
    name: "Quest & LabCorp",
    badge: "Draw sites",
    description:
      "Need a specific test or prefer a national draw site? We can call in any lab requisition to Quest Diagnostics or LabCorp — you choose the location that fits your schedule.",
    bullets: [
      "Custom requisitions when clinically indicated",
      "Quest & LabCorp locations across Fox Valley",
      "BioTE baseline & TRT monitoring labs",
      "Fasting morning draws recommended for hormones",
    ],
  },
  {
    id: "in-office",
    name: "Hello Gorgeous Oswego",
    badge: "In-office",
    description:
      "Many panels can be drawn on site at our Oswego med spa — convenient when you are already here for a consult, pellet insertion, or follow-up.",
    bullets: [
      "Phlebotomy on site when available",
      "Same-day consult + draw options",
      "Results typically within 36–72 hours",
      "No referral required",
    ],
  },
] as const;

export const BLOOD_WORK_DOMAINS: BloodWorkDomain[] = [
  {
    id: "cardiovascular",
    index: 1,
    title: "Cardiovascular & Lipids",
    markers:
      "Lp(a), Total Cholesterol, HDL, Triglycerides, LDL, Cholesterol/HDL Ratio, Non-HDL Cholesterol, ApoB",
    summary:
      "Your heart health snapshot. Beyond standard cholesterol, ApoB is widely used as a strong measure of atherosclerotic risk, and Lp(a) is a genetic factor the National Lipid Association recommends checking at least once in adulthood.",
  },
  {
    id: "metabolic",
    index: 2,
    title: "Metabolic & Blood Sugar",
    markers: "Fasting Insulin, Fasting Glucose, BUN/Creatinine Ratio, HbA1c",
    summary:
      "How your body handles energy. Most standard panels only check glucose — adding fasting insulin shows how hard your body works to keep blood sugar stable, often years before glucose or HbA1c shift.",
  },
  {
    id: "hormones",
    index: 3,
    title: "Hormones & Endocrine",
    markers:
      "SHBG, Free Testosterone, Bioavailable Testosterone, Total Testosterone, DHEA-S, FSH, LH, Estradiol, PSA (men)",
    summary:
      "Markers that affect energy, body composition, mood, and recovery. Total testosterone alone can mislead — free and bioavailable testosterone complete the picture, especially with obesity or high SHBG.",
  },
  {
    id: "thyroid",
    index: 4,
    title: "Thyroid Function",
    markers: "TSH, Free T4, Free T3, TPO Antibodies",
    summary:
      "Your thyroid drives metabolism, energy, and temperature. TSH screens well, but Free T4, Free T3, and TPO antibodies reveal conversion issues and autoimmune thyroid disease.",
  },
  {
    id: "liver",
    index: 5,
    title: "Liver Function",
    markers:
      "Albumin, Total Protein, Globulin, A/G Ratio, Total Bilirubin, Alkaline Phosphatase (ALP), AST, ALT",
    summary:
      "How well your liver processes nutrients, medications, and toxins. AST also rises with muscle breakdown — a hard training week can elevate it; ALT is more liver-specific.",
  },
  {
    id: "kidney",
    index: 6,
    title: "Kidney Function",
    markers: "BUN, Creatinine, eGFR, Sodium, Potassium, Chloride, CO2, Calcium",
    summary:
      "Kidneys filter waste and balance electrolytes. eGFR estimates filtration. Electrolytes reflect hydration and acid-base balance — context matters when creatinine is mildly elevated.",
  },
  {
    id: "cbc",
    index: 7,
    title: "Blood Cells & Counts",
    markers:
      "Complete Blood Count with Differential — WBC, RBC, Hemoglobin, Hematocrit, MCV, MCH, MCHC, RDW, Platelets, and white cell differential",
    summary:
      "Red cells (oxygen delivery), white cells (immune defense), and platelets (clotting). Red cell indices can hint at iron or B12 issues; the differential shows which immune lines are active.",
  },
  {
    id: "vitamins",
    index: 8,
    title: "Vitamins & Nutrients",
    markers: "Vitamin D (25-hydroxyvitamin D), Vitamin B12",
    summary:
      "Two nutrients with wide-ranging effects. Vitamin D supports bone, immune, and mood health. B12 is essential for energy, nerves, and red blood cells — deficiency is more common than many people realize.",
  },
  {
    id: "inflammation",
    index: 9,
    title: "Inflammation Markers",
    markers: "High-Sensitivity C-Reactive Protein (hs-CRP)",
    summary:
      "Low-grade systemic inflammation. AHA guidelines tie hs-CRP tiers to cardiovascular risk — but CRP also rises with illness, injury, or hard training, so context is essential.",
  },
  {
    id: "patterns",
    index: 10,
    title: "Cross-Domain Patterns",
    markers: "Relationships across all domains above",
    summary:
      "The tenth “domain” is how markers interact — metabolic insulin resistance plus lipid patterns, thyroid effects on SHBG, inflammation compounding metabolic risk. This is where comprehensive panels pay off.",
  },
];

export const BLOOD_WORK_PATTERNS: BloodWorkPattern[] = [
  {
    title: "Metabolic + Cardiovascular",
    body: "High fasting insulin and triglycerides with low HDL is a well-documented pattern linked to insulin resistance and increased heart risk — even when fasting glucose and LDL look normal.",
  },
  {
    title: "Thyroid + Hormones",
    body: "Thyroid hormones affect SHBG production, which shifts the balance between total and free testosterone. Low SHBG on a hormone panel may point to thyroid dysfunction as the root cause.",
  },
  {
    title: "Inflammation + Metabolic Health",
    body: "Elevated CRP alongside insulin resistance and high triglycerides suggests a metabolic-inflammatory state with compounding heart risk — a different story than elevated CRP alone.",
  },
  {
    title: "Kidney + Electrolytes",
    body: "A mildly elevated creatinine may reflect kidney stress — or dehydration. Electrolytes and clinical context help your provider tell the difference.",
  },
  {
    title: "Liver + Activity Level",
    body: "Elevated AST in someone who trains hard may reflect muscle breakdown, not liver damage. When ALT stays normal while AST is high, the interpretation shifts entirely.",
  },
];

export const BLOOD_WORK_PREP_TIPS: BloodWorkPrepTip[] = [
  {
    title: "Fasting",
    body: "Most panels require a 10–12 hour fast for glucose, insulin, and triglycerides. Do not fast longer than 16 hours. Water is fine and encouraged.",
  },
  {
    title: "Hydration",
    body: "Dehydration concentrates blood and can raise hemoglobin, creatinine, BUN, and electrolytes. Drink water before your draw — not sugary drinks.",
  },
  {
    title: "Exercise timing",
    body: "Avoid hard training for at least 48 hours before your draw. Intense lifting can elevate AST/ALT and temporarily shift testosterone and cortisol.",
  },
  {
    title: "Sleep",
    body: "Poor sleep affects hormone and metabolic markers. Aim for a normal night of sleep before your draw when possible.",
  },
  {
    title: "Supplements & medications",
    body: "Biotin can interfere with thyroid assays — the FDA recommends stopping biotin at least 72 hours before blood work. Tell us about statins, metformin, and hormone therapy.",
  },
  {
    title: "Time of day",
    body: "Testosterone peaks in the early morning. The Endocrine Society recommends hormone testing between 7:00 and 10:00 AM on a fasting draw.",
  },
];

export const BLOOD_WORK_RETEST_BULLETS = [
  "Metabolic markers: annually if prediabetes signals appear; every 3 years if normal (starting around age 35).",
  "Lipid panel: every 4–6 years if low risk; more often if abnormal or on therapy.",
  "Thyroid: based on symptoms, family history, and prior results.",
  "Hormones: low testosterone should be confirmed with a repeat morning draw before starting treatment.",
  "Kidney function: at least annually if there is an established issue.",
  "The big picture: two or three draws over a year reveal trends — far more informative than any single snapshot.",
];

export const BLOOD_WORK_FAQS: FAQ[] = [
  {
    question: "Does Hello Gorgeous offer comprehensive blood panels?",
    answer:
      "Yes. We order targeted wellness panels — often 60+ biomarkers — for hormone optimization, medical weight loss, peptide protocols, and baseline health mapping. Panels are selected based on your goals and history at consult.",
  },
  {
    question: "How do you order labs — FullScript, Quest, or LabCorp?",
    answer:
      "FullScript is our primary workflow for comprehensive wellness panels. We can also call in requisitions to Quest Diagnostics or LabCorp when that fits your test or location. Many draws can be done in office at our Oswego location.",
  },
  {
    question: "How much do baseline labs cost?",
    answer:
      "Baseline hormone and wellness panels typically run $250–450 depending on which markers are ordered. Exact pricing is confirmed at your consult — we do not surprise-bill for panels you did not agree to.",
  },
  {
    question: "Do I need a referral from my primary care doctor?",
    answer:
      "No referral is required. Ryan Kent, FNP-BC can order medically appropriate labs as part of your Hello Gorgeous care plan.",
  },
  {
    question: "How long until I get results?",
    answer:
      "Most results return within 36–72 hours depending on the panel and lab partner. We review results with you at follow-up — not as a raw PDF with no context.",
  },
  {
    question: "Is this page medical advice?",
    answer:
      "No. This guide is educational. Diagnosis and treatment require an in-person consultation where your full history, exam, and labs are reviewed together.",
  },
];

export const BLOOD_WORK_MEDICAL_REVIEW = {
  reviewer: RYAN_FULL_NAME,
  updated: "June 2026",
};
