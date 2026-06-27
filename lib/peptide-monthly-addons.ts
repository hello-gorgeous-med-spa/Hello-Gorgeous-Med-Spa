/**
 * Monthly peptide add-ons — stack with GLP-1 refills or standalone protocols.
 * PDFs from Olympia / Hello Gorgeous patient education (2025–2026).
 */

export type PeptideMonthlyAddonId =
  | "nad-plus"
  | "sermorelin"
  | "nad-sermorelin-liquid-bundle"
  | "nad-sermorelin-rdt-combo";

export type PeptidePatientPdf = {
  id: string;
  title: string;
  filename: string;
  description: string;
};

export type PeptideMonthlyAddon = {
  id: PeptideMonthlyAddonId;
  label: string;
  shortLabel: string;
  monthlyUsd: number;
  invoiceTemplateId: string;
  lineLabel: string;
  note: string;
  /** Shown under the option on the refill form */
  description?: string;
  group?: "individual" | "bundle";
  /** Patient PDFs to offer after selection */
  pdfIds: string[];
};

export const PEPTIDE_PATIENT_PDFS: PeptidePatientPdf[] = [
  {
    id: "nad-sermorelin-bundle-info",
    title: "NAD+ & Sermorelin Bundle — Info Sheet (2026)",
    filename: "nad-sermorelin-bundle-info-2026.pdf",
    description: "Bundle overview, ingredients, storage & precautions.",
  },
  {
    id: "nad-sermorelin-dosing",
    title: "NAD+ & Sermorelin — Recommended Dosing Guide",
    filename: "nad-sermorelin-recommended-dosing-guide.pdf",
    description: "Week-by-week subcutaneous dosing for the injectable bundle protocol.",
  },
  {
    id: "nad-plus-dosing-chart",
    title: "NAD+ Dosing Chart (IV · IM · Sub-Q)",
    filename: "nad-plus-dosing-chart-july-2025.pdf",
    description: "NAD+ infusion and injection dosing reference — July 2025.",
  },
  {
    id: "sermorelin-insert",
    title: "Sermorelin Info Insert Card",
    filename: "sermorelin-info-insert-card.pdf",
    description: "0.9 mg/mL aqueous formula — storage, handling & injection.",
  },
];

const PDF_BY_ID = new Map(PEPTIDE_PATIENT_PDFS.map((p) => [p.id, p]));

export const PEPTIDE_PATIENT_PDF_PATH = "/handouts/peptide-therapy/pdf";

/** NAD+ & Sermorelin bundle — both formats (liquid injectable or NAD liquid + Sermorelin RDT). */
export const NAD_SERMORELIN_BUNDLE_MONTHLY_USD = 350;

/** @deprecated Use NAD_SERMORELIN_BUNDLE_MONTHLY_USD */
export const NAD_SERMORELIN_LIQUID_BUNDLE_MONTHLY_USD = NAD_SERMORELIN_BUNDLE_MONTHLY_USD;

/** @deprecated Use NAD_SERMORELIN_BUNDLE_MONTHLY_USD */
export const NAD_SERMORELIN_RDT_COMBO_MONTHLY_USD = NAD_SERMORELIN_BUNDLE_MONTHLY_USD;

export function peptidePatientPdfHref(filename: string): string {
  return `${PEPTIDE_PATIENT_PDF_PATH}/${filename}`;
}

export function getPeptidePatientPdf(id: string): PeptidePatientPdf | undefined {
  return PDF_BY_ID.get(id);
}

export function peptidePatientPdfsForAddon(addonId: PeptideMonthlyAddonId): PeptidePatientPdf[] {
  const addon = PEPTIDE_MONTHLY_ADDONS.find((a) => a.id === addonId);
  if (!addon) return [];
  return addon.pdfIds.map((id) => PDF_BY_ID.get(id)).filter(Boolean) as PeptidePatientPdf[];
}

export const PEPTIDE_MONTHLY_ADDONS: PeptideMonthlyAddon[] = [
  {
    id: "nad-plus",
    label: "NAD+ injectable protocol — $169/mo",
    shortLabel: "NAD+",
    monthlyUsd: 169,
    invoiceTemplateId: "peptide-nad-plus",
    lineLabel: "NAD+ (injectable protocol) — 1 mo add-on",
    note: "Cellular energy & clarity · sub-Q or IM per your protocol",
    group: "individual",
    pdfIds: ["nad-plus-dosing-chart", "nad-sermorelin-dosing"],
  },
  {
    id: "sermorelin",
    label: "Sermorelin injectable — $149/mo",
    shortLabel: "Sermorelin injectable",
    monthlyUsd: 149,
    invoiceTemplateId: "peptide-sermorelin",
    lineLabel: "Sermorelin (injectable) — 1 mo add-on",
    note: "Natural GH support · sleep & recovery",
    group: "individual",
    pdfIds: ["sermorelin-insert", "nad-sermorelin-dosing"],
  },
  {
    id: "nad-sermorelin-liquid-bundle",
    label: `NAD+ & Sermorelin injectable bundle — $${NAD_SERMORELIN_BUNDLE_MONTHLY_USD}/mo`,
    shortLabel: "Liquid injectable bundle",
    monthlyUsd: NAD_SERMORELIN_BUNDLE_MONTHLY_USD,
    invoiceTemplateId: "peptide-nad-sermorelin-liquid-bundle",
    lineLabel: "NAD+ & Sermorelin liquid injectable bundle — 1 mo add-on",
    note: "Olympia liquid NAD 100 mg/mL + Sermorelin 0.9 mg/mL · both 10 mL",
    description:
      "Both medications as subcutaneous injections — NAD+ 100 mg/mL (10 mL) + Sermorelin 0.9 mg/mL (10 mL). Best if you want the full injectable longevity stack.",
    group: "bundle",
    pdfIds: [
      "nad-sermorelin-bundle-info",
      "nad-sermorelin-dosing",
      "nad-plus-dosing-chart",
      "sermorelin-insert",
    ],
  },
  {
    id: "nad-sermorelin-rdt-combo",
    label: `NAD+ liquid + Sermorelin RDT combo — $${NAD_SERMORELIN_BUNDLE_MONTHLY_USD}/mo`,
    shortLabel: "NAD+ liquid + Sermorelin troches",
    monthlyUsd: NAD_SERMORELIN_BUNDLE_MONTHLY_USD,
    invoiceTemplateId: "peptide-nad-sermorelin-rdt-combo",
    lineLabel: "NAD+ liquid + Sermorelin RDT combo — 1 mo add-on",
    note: "NAD+ 100 mg/mL 10 mL + Sermorelin 500 mcg RDT 30-count · needle-free GH support",
    description:
      "NAD+ as a liquid injection + Sermorelin as daily dissolving troches (no Sermorelin needle). Good if you prefer fewer injections.",
    group: "bundle",
    pdfIds: ["nad-sermorelin-bundle-info", "nad-plus-dosing-chart"],
  },
];

export const GLP1_REFILL_ADDON_NONE = "No monthly add-ons";

export const GLP1_REFILL_ADDON_FIELD_OPTIONS = [
  GLP1_REFILL_ADDON_NONE,
  ...PEPTIDE_MONTHLY_ADDONS.map((a) => a.label),
];

export function parseGlp1RefillAddonSelection(value: unknown): PeptideMonthlyAddon | null {
  const raw = String(value || "").trim();
  if (!raw || raw === GLP1_REFILL_ADDON_NONE) return null;
  return PEPTIDE_MONTHLY_ADDONS.find((a) => a.label === raw) ?? null;
}

export function formatAddonPriceLabel(monthlyUsd: number): string {
  return `$${monthlyUsd}/mo`;
}

export function peptideMonthlyAddonsByGroup(): Array<{
  group: "individual" | "bundle";
  title: string;
  addons: PeptideMonthlyAddon[];
}> {
  return [
    {
      group: "individual",
      title: "Individual add-ons",
      addons: PEPTIDE_MONTHLY_ADDONS.filter((a) => a.group === "individual"),
    },
    {
      group: "bundle",
      title: "NAD+ & Sermorelin bundles — choose one format",
      addons: PEPTIDE_MONTHLY_ADDONS.filter((a) => a.group === "bundle"),
    },
  ];
}
