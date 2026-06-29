/**
 * Access Medical Labs — hormone & advanced panels (accessmedlab.com).
 * Blood panels: drawn in-office at Hello Gorgeous → shipped to AML (24–48 hr results).
 * Saliva NextGen panels: kit shipped to patient after NP approval.
 *
 * Panel markers sourced from:
 * https://accessmedlab.com/physician-tests/hormone-panel
 *
 * Wholesale USD = estimates until provider portal pricing is exported — update via
 * `data/access-medical-lab-catalog.json` when account login is available.
 */

export type AccessMedicalSpecimen = "blood" | "saliva";

export type AccessMedicalPanelCode =
  | "778"
  | "779"
  | "3778"
  | "3779"
  | "S57"
  | "S59"
  | "S51"
  | "S71"
  | "S75"
  | "S84"
  | "4350";

export type AccessMedicalAudience = "men" | "women" | "both";

export type AccessMedicalPanel = {
  code: AccessMedicalPanelCode;
  name: string;
  shortName: string;
  specimen: AccessMedicalSpecimen;
  audience: AccessMedicalAudience;
  /** Estimated physician wholesale — replace with portal export */
  wholesaleUsdEstimate: number;
  turnaround: string;
  markers: string[];
  description: string;
  learnHref: string;
};

export const ACCESS_MEDICAL_LAB_META = {
  name: "Access Medical Labs",
  tagline: "We didn't invent the lab test — we simply perfected it.",
  portalUrl: "https://accessmedlab.com",
  hormonePanelUrl: "https://accessmedlab.com/physician-tests/hormone-panel",
  phone: "(866) 720-8386",
  location: "Jupiter, FL · CAP-accredited · High-complexity CLIA",
  bloodDrawNote:
    "Blood hormone panels are collected at the provider office (Hello Gorgeous Oswego in-house draw), then sent to Access Medical Labs — results typically within 24–48 hours.",
  salivaNote:
    "Saliva NextGen panels ship as a collection kit after your NP approves the order — results typically within 48 hours.",
} as const;

const HORMONE_PAGE = ACCESS_MEDICAL_LAB_META.hormonePanelUrl;

export const ACCESS_MEDICAL_PANELS: AccessMedicalPanel[] = [
  {
    code: "778",
    name: "Comprehensive Male Panel",
    shortName: "Comprehensive Male",
    specimen: "blood",
    audience: "men",
    wholesaleUsdEstimate: 105,
    turnaround: "24–48 hours",
    markers: [
      "CBC w/ Diff",
      "Comprehensive Metabolic Panel",
      "Lipid Panel",
      "T3, Free · T4, Free · TSH",
      "PSA, Total",
      "DHEA-Sulfate",
      "Testosterone, Free & Total",
      "SHBG",
      "Estradiol",
      "LH · FSH",
      "IGF-1",
      "CRP, hs",
      "Ferritin",
    ],
    description: "Core male hormone + metabolic baseline before TRT or wellness optimization.",
    learnHref: HORMONE_PAGE,
  },
  {
    code: "779",
    name: "Comprehensive Female Panel",
    shortName: "Comprehensive Female",
    specimen: "blood",
    audience: "women",
    wholesaleUsdEstimate: 105,
    turnaround: "24–48 hours",
    markers: [
      "CBC w/ Diff",
      "Comprehensive Metabolic Panel",
      "Lipid Panel",
      "T3, Free · T4, Free · TSH",
      "DHEA-Sulfate",
      "Testosterone, Free & Total",
      "SHBG",
      "Estradiol",
      "LH · FSH",
      "IGF-1",
      "CRP, hs",
      "Ferritin",
    ],
    description: "Core female hormone + metabolic baseline before BHRT or perimenopause workup.",
    learnHref: HORMONE_PAGE,
  },
  {
    code: "3778",
    name: "Comprehensive Male Panel Plus",
    shortName: "Male Plus",
    specimen: "blood",
    audience: "men",
    wholesaleUsdEstimate: 155,
    turnaround: "24–48 hours",
    markers: [
      "Everything in Comprehensive Male (778)",
      "DHT · Estrone · Progesterone · Cortisol",
      "IGF-BP3 · Vitamin D, 25-OH · Hemoglobin A1C",
    ],
    description: "Expanded male panel with adrenal, vitamin D, and glycemic markers.",
    learnHref: HORMONE_PAGE,
  },
  {
    code: "3779",
    name: "Comprehensive Female Panel Plus",
    shortName: "Female Plus",
    specimen: "blood",
    audience: "women",
    wholesaleUsdEstimate: 155,
    turnaround: "24–48 hours",
    markers: [
      "Everything in Comprehensive Female (779)",
      "DHT · Estrone · Progesterone · Cortisol · Estriol",
      "IGF-BP3 · Vitamin D, 25-OH · Hemoglobin A1C",
    ],
    description: "Expanded female panel — our flagship comprehensive blood work.",
    learnHref: HORMONE_PAGE,
  },
  {
    code: "S71",
    name: "NextGen Andropause Panel",
    shortName: "Andropause (saliva)",
    specimen: "saliva",
    audience: "men",
    wholesaleUsdEstimate: 95,
    turnaround: "48 hours",
    markers: ["Testosterone", "DHEA", "Melatonin", "DHT", "Cortisol"],
    description: "Saliva andropause screen — kit shipped to you after NP approval.",
    learnHref: HORMONE_PAGE,
  },
  {
    code: "S75",
    name: "NextGen Menopause Panel",
    shortName: "Menopause (saliva)",
    specimen: "saliva",
    audience: "women",
    wholesaleUsdEstimate: 95,
    turnaround: "48 hours",
    markers: [
      "Estradiol · Estriol · Estrone · Progesterone · Testosterone",
      "DHEA · Cortisol · Melatonin · Androstenedione · 17-OH Progesterone",
    ],
    description: "Saliva menopause panel — at-home collection kit.",
    learnHref: HORMONE_PAGE,
  },
  {
    code: "S51",
    name: "NextGen Adrenal Panel",
    shortName: "Adrenal (saliva)",
    specimen: "saliva",
    audience: "both",
    wholesaleUsdEstimate: 110,
    turnaround: "48 hours",
    markers: [
      "Cortisol AM · Noon · Evening · Night",
      "DHEA · 17-OH Progesterone",
    ],
    description: "Four-point cortisol rhythm — four saliva samples in one day.",
    learnHref: HORMONE_PAGE,
  },
  {
    code: "S84",
    name: "Female EvaluatoR Panel",
    shortName: "Cycle mapping (saliva)",
    specimen: "saliva",
    audience: "women",
    wholesaleUsdEstimate: 175,
    turnaround: "48 hours",
    markers: [
      "Estradiol ×11 over 28 days",
      "Progesterone ×11 over 28 days",
      "DHEA · Testosterone",
    ],
    description: "Cycle-based hormone mapping across a full menstrual month.",
    learnHref: HORMONE_PAGE,
  },
];

/** Hello Gorgeous retail panel → Access Medical blood codes by sex */
export const HG_TO_ACCESS_MEDICAL_BLOOD: Record<
  string,
  { male: AccessMedicalPanelCode; female: AccessMedicalPanelCode }
> = {
  "peak-performance": { male: "778", female: "779" },
  "hormone-baseline": { male: "778", female: "779" },
  "glp1-metabolic": { male: "778", female: "779" },
  "comprehensive-wellness": { male: "3778", female: "3779" },
  "follow-up-monitoring": { male: "778", female: "779" },
};

export function accessMedicalPanelByCode(
  code: string,
): AccessMedicalPanel | undefined {
  return ACCESS_MEDICAL_PANELS.find((p) => p.code === code);
}

export function accessMedicalPanelForHgOrder(
  hgPanelId: string,
  sexAtBirth: string,
): AccessMedicalPanel | undefined {
  const map = HG_TO_ACCESS_MEDICAL_BLOOD[hgPanelId];
  if (!map) return undefined;
  const isMale = /^m/i.test(sexAtBirth.trim());
  const code = isMale ? map.male : map.female;
  return accessMedicalPanelByCode(code);
}

export function accessMedicalOrderLine(
  hgPanelId: string,
  sexAtBirth: string,
): string | undefined {
  const aml = accessMedicalPanelForHgOrder(hgPanelId, sexAtBirth);
  if (!aml) return undefined;
  return `Access Medical Labs ${aml.code} — ${aml.name}`;
}

export function accessMedicalPanelsForAudience(
  audience: AccessMedicalAudience,
): AccessMedicalPanel[] {
  return ACCESS_MEDICAL_PANELS.filter(
    (p) => p.audience === audience || p.audience === "both",
  );
}

/** Retail multiplier target on AML wholesale (before draw logistics). */
export const ACCESS_MEDICAL_RETAIL_MULTIPLIER = 2.5;

export function accessMedicalSuggestedRetailUsd(wholesaleUsd: number): number {
  return Math.round(wholesaleUsd * ACCESS_MEDICAL_RETAIL_MULTIPLIER);
}

export function accessMedicalMarginUsd(
  retailUsd: number,
  wholesaleUsd: number,
): number {
  return retailUsd - wholesaleUsd;
}
