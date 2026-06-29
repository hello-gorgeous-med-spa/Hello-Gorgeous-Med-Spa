/**
 * Hello Gorgeous RX™ — cash-pay lab panel catalog.
 * Hormone blood work processed through Access Medical Labs (CAP/CLIA).
 * @see https://accessmedlab.com/physician-tests/hormone-panel
 */

import {
  ACCESS_MEDICAL_LAB_META,
  accessMedicalPanelForHgOrder,
  type AccessMedicalPanelCode,
} from "@/lib/access-medical-lab-catalog";

export type LabDrawOptionId = "in-office" | "quest-labcorp" | "fullscript";

export type LabDrawOption = {
  id: LabDrawOptionId;
  label: string;
  shortLabel: string;
  description: string;
  badge?: "RECOMMENDED" | "NATIONWIDE";
  stepDetail: string;
};

export type LabPanelId =
  | "peak-performance"
  | "hormone-baseline"
  | "glp1-metabolic"
  | "comprehensive-wellness"
  | "follow-up-monitoring";

export type LabPanel = {
  id: LabPanelId;
  name: string;
  tagline: string;
  retailUsd: number;
  wholesaleUsd: number;
  markerCount: string;
  markers: string[];
  bestFor: string[];
  turnaround: string;
  fasting: string;
  badge?: "POPULAR" | "BEST VALUE";
  goals: Array<"hormones" | "weight-loss" | "wellness" | "follow-up">;
  accessMedicalBlood?: { male: AccessMedicalPanelCode; female: AccessMedicalPanelCode };
  specimen?: "blood" | "saliva";
};

export const LAB_DRAW_OPTIONS: LabDrawOption[] = [
  {
    id: "in-office",
    label: "In-house draw — Hello Gorgeous Oswego",
    shortLabel: "In-house · Oswego",
    description:
      "Blood drawn on site and sent to Access Medical Labs — 24–48 hour results. SST + LAV tubes per AML protocol.",
    badge: "RECOMMENDED",
    stepDetail: "Book a fasting morning slot · 7–10 AM for hormones.",
  },
  {
    id: "quest-labcorp",
    label: "Quest or LabCorp near you",
    shortLabel: "Quest / LabCorp",
    description:
      "We email your requisition — you choose the draw site across Fox Valley (Naperville, Aurora, Plainfield, etc.).",
    badge: "NATIONWIDE",
    stepDetail: "Requisition PDF within 1 business day · thousands of draw sites.",
  },
  {
    id: "fullscript",
    label: "FullScript lab workflow",
    shortLabel: "FullScript",
    description:
      "Alternative workflow when FullScript fits your order — NP selects at review.",
    stepDetail: "Used when Access Medical or Quest is not the best fit.",
  },
];

export const LAB_HUB_PATH = "/labs" as const;

export const LAB_HUB_HERO = {
  eyebrow: "Hello Gorgeous Labs™ · Access Medical Labs",
  title: "Lab testing,",
  titleAccent: "without the runaround.",
  subtitle:
    "Cash-pay panels from $199 — drawn in-house at our Oswego med spa (processed by Access Medical Labs) or at Quest/LabCorp. Ryan Kent, FNP-BC reviews every result.",
} as const;

export const LAB_HUB_STEPS = [
  {
    step: "01",
    title: "Choose your panel",
    body: "Access Medical 778/779 baseline, 3778/3779 Plus, or Peak Performance — fixed pricing.",
  },
  {
    step: "02",
    title: "Pay online",
    body: "No insurance paperwork. Checkout takes minutes — NP confirms clinical fit.",
  },
  {
    step: "03",
    title: "Draw in-house or nearby",
    body: "In-house at Hello Gorgeous → shipped to Access Medical Labs. Or Quest/LabCorp requisition.",
  },
  {
    step: "04",
    title: "NP results review",
    body: "AML results typically 24–48 hours. We walk you through what matters.",
  },
] as const;

export const LAB_HUB_TRUST = [
  "In-house phlebotomy · Oswego",
  "Access Medical Labs · 24–48 hr",
  "NP-supervised · Ryan Kent, FNP-BC",
  "Cash-pay · no surprise bills",
] as const;

export const LAB_IN_HOUSE_HIGHLIGHT = {
  title: "In-house draws → Access Medical Labs",
  body:
    "Blood hormone panels are collected at Hello Gorgeous Oswego and processed through Access Medical Labs — CAP-accredited, high-complexity CLIA laboratory with 24–48 hour turnaround.",
  bullets: [
    "Access Medical panel 778 (male) or 779 (female) · 3778/3779 Plus available",
    "Fasting morning draws · 7–10 AM recommended per AML protocol",
    "Combine with consult, BioTE, GLP-1 visit, or book a lab-only slot",
    "Saliva NextGen panels (menopause, andropause, adrenal) ship as kits",
  ],
} as const;

export const LAB_ACCESS_MEDICAL_PARTNER = {
  name: ACCESS_MEDICAL_LAB_META.name,
  href: ACCESS_MEDICAL_LAB_META.hormonePanelUrl,
  description: ACCESS_MEDICAL_LAB_META.bloodDrawNote,
  bullets: [
    "Comprehensive Male (778) & Female (779)",
    "Male Plus (3778) & Female Plus (3779)",
    "NextGen saliva: menopause (S75), andropause (S71), adrenal (S51)",
    "Results typically 24–48 hours after sample received",
  ],
} as const;

export const LAB_PANELS: LabPanel[] = [
  {
    id: "peak-performance",
    name: "Peak Performance Profile",
    tagline: "Access Medical 778 / 779 — energy, hormones & metabolism",
    retailUsd: 199,
    wholesaleUsd: 105,
    markerCount: "17 tests",
    markers: [
      "CBC w/ Diff · CMP · Lipid panel",
      "T3/T4 Free · TSH",
      "Testosterone Free & Total · Estradiol · DHEA-S",
      "SHBG · LH · FSH · IGF-1 · CRP hs · Ferritin",
      "PSA Total (male panel)",
    ],
    bestFor: ["First-time wellness screen", "Energy & performance", "Quick hormone snapshot"],
    turnaround: "24–48 hours (Access Medical Labs)",
    fasting: "8–12 hours recommended",
    badge: "POPULAR",
    goals: ["wellness", "hormones"],
    accessMedicalBlood: { male: "778", female: "779" },
    specimen: "blood",
  },
  {
    id: "hormone-baseline",
    name: "HRT / TRT Baseline Panel",
    tagline: "Access Medical 778 / 779 — we never dose blind",
    retailUsd: 299,
    wholesaleUsd: 105,
    markerCount: "17 tests",
    markers: [
      "CBC w/ Diff · CMP · Lipid panel",
      "T3 Free · T4 Free · TSH",
      "Testosterone Free & Total · SHBG · Estradiol",
      "LH · FSH · DHEA-S · IGF-1 · CRP hs · Ferritin · PSA (men)",
    ],
    bestFor: ["BioTE / BHRT candidacy", "TRT workup", "Perimenopause & menopause"],
    turnaround: "24–48 hours (Access Medical Labs)",
    fasting: "10–12 hours · morning draw 7–10 AM",
    badge: "BEST VALUE",
    goals: ["hormones"],
    accessMedicalBlood: { male: "778", female: "779" },
    specimen: "blood",
  },
  {
    id: "glp1-metabolic",
    name: "GLP-1 Metabolic Baseline",
    tagline: "Access Medical comprehensive panel for weight-loss candidacy",
    retailUsd: 249,
    wholesaleUsd: 105,
    markerCount: "17 tests",
    markers: [
      "CMP · Lipid panel · CBC · TSH · Free T3/T4",
      "Metabolic & thyroid screen via AML 778/779",
      "Fasting draw required",
    ],
    bestFor: ["GLP-1 intake", "Medical weight loss", "Metabolic risk screening"],
    turnaround: "24–48 hours",
    fasting: "8–12 hours required",
    goals: ["weight-loss"],
    accessMedicalBlood: { male: "778", female: "779" },
    specimen: "blood",
  },
  {
    id: "comprehensive-wellness",
    name: "Comprehensive Panel Plus",
    tagline: "Access Medical 3778 / 3779 — expanded hormones + D, A1C, cortisol",
    retailUsd: 399,
    wholesaleUsd: 155,
    markerCount: "25+ tests",
    markers: [
      "Everything in 778/779 baseline",
      "DHT · Estrone · Progesterone · Cortisol · IGF-BP3",
      "Vitamin D 25-OH · Hemoglobin A1C · Estriol (female)",
    ],
    bestFor: ["Longevity & optimization", "Executive wellness", "Annual baseline"],
    turnaround: "24–48 hours (Access Medical Labs)",
    fasting: "10–12 hours ideal",
    goals: ["wellness", "hormones"],
    accessMedicalBlood: { male: "3778", female: "3779" },
    specimen: "blood",
  },
  {
    id: "follow-up-monitoring",
    name: "Follow-Up Monitoring Panel",
    tagline: "Repeat Access Medical 778 / 779 on therapy",
    retailUsd: 199,
    wholesaleUsd: 105,
    markerCount: "17 tests",
    markers: ["Repeat AML comprehensive panel per NP protocol"],
    bestFor: ["HRT/TRT follow-up", "GLP-1 monitoring", "Quarterly member review"],
    turnaround: "24–48 hours",
    fasting: "Per panel — often 8 hrs",
    goals: ["follow-up", "hormones", "weight-loss"],
    accessMedicalBlood: { male: "778", female: "779" },
    specimen: "blood",
  },
];

export const LAB_PAYMENT_FIRST_COPY =
  "Pay for your panel online. Ryan Kent, FNP-BC reviews your order, then we draw in-house at Hello Gorgeous (shipped to Access Medical Labs) or send a Quest/LabCorp requisition. Results in 24–48 hours typical.";

export const LAB_PRICING_DISCLAIMER =
  "Cash-pay panels only — not billed to insurance. Hormone blood panels map to Access Medical Labs test codes (778, 779, 3778, 3779). Exact order confirmed after NP review.";

export function labPanelById(id: string): LabPanel | undefined {
  return LAB_PANELS.find((p) => p.id === id);
}

export function labPanelsForGoal(goal: LabPanel["goals"][number]): LabPanel[] {
  return LAB_PANELS.filter((p) => p.goals.includes(goal));
}

export function labDrawOptionById(id: string): LabDrawOption | undefined {
  return LAB_DRAW_OPTIONS.find((o) => o.id === id);
}

export function labPanelMarginUsd(panel: LabPanel): number {
  return panel.retailUsd - panel.wholesaleUsd;
}

export function labPanelMarginPct(panel: LabPanel): number {
  if (panel.retailUsd <= 0) return 0;
  return Math.round((labPanelMarginUsd(panel) / panel.retailUsd) * 1000) / 10;
}

export function labInvoiceTemplateId(panelId: string): string {
  return `lab-panel-${panelId}`;
}

export function labPanelAccessMedicalCode(
  panelId: string,
  sexAtBirth: string,
): AccessMedicalPanelCode | undefined {
  return accessMedicalPanelForHgOrder(panelId, sexAtBirth)?.code;
}

export function labPanelAccessMedicalLabel(
  panelId: string,
  sexAtBirth: string,
): string | undefined {
  const aml = accessMedicalPanelForHgOrder(panelId, sexAtBirth);
  if (!aml) return undefined;
  return `Access Medical ${aml.code} — ${aml.name}`;
}
