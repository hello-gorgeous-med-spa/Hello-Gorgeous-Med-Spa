/**
 * Monthly peptide add-ons — stack with GLP-1 refills or standalone protocols.
 * PDFs from Olympia / Hello Gorgeous patient education (2025–2026).
 */

export type PeptideMonthlyAddonId = "nad-plus" | "sermorelin" | "nad-sermorelin-bundle";

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
    description: "Week-by-week subcutaneous dosing for the bundle protocol.",
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

/** Bundle saves vs buying NAD+ + Sermorelin separately ($169 + $149). */
export const NAD_SERMORELIN_BUNDLE_MONTHLY_USD = 289;

export const PEPTIDE_MONTHLY_ADDONS: PeptideMonthlyAddon[] = [
  {
    id: "nad-plus",
    label: "NAD+ injectable protocol — $169/mo",
    shortLabel: "NAD+",
    monthlyUsd: 169,
    invoiceTemplateId: "peptide-nad-plus",
    lineLabel: "NAD+ (injectable protocol) — 1 mo add-on",
    note: "Cellular energy & clarity · sub-Q or IM per your protocol",
    pdfIds: ["nad-plus-dosing-chart", "nad-sermorelin-dosing"],
  },
  {
    id: "sermorelin",
    label: "Sermorelin injectable — $149/mo",
    shortLabel: "Sermorelin",
    monthlyUsd: 149,
    invoiceTemplateId: "peptide-sermorelin",
    lineLabel: "Sermorelin (injectable) — 1 mo add-on",
    note: "Natural GH support · sleep & recovery",
    pdfIds: ["sermorelin-insert", "nad-sermorelin-dosing"],
  },
  {
    id: "nad-sermorelin-bundle",
    label: "NAD+ & Sermorelin Bundle — $289/mo",
    shortLabel: "NAD+ & Sermorelin Bundle",
    monthlyUsd: NAD_SERMORELIN_BUNDLE_MONTHLY_USD,
    invoiceTemplateId: "peptide-nad-sermorelin-bundle",
    lineLabel: "NAD+ & Sermorelin Bundle — 1 mo add-on",
    note: "Cellular energy + GH support · save vs separate protocols",
    pdfIds: [
      "nad-sermorelin-bundle-info",
      "nad-sermorelin-dosing",
      "nad-plus-dosing-chart",
      "sermorelin-insert",
    ],
  },
];

export const GLP1_REFILL_ADDON_FIELD_OPTIONS = [
  "No monthly add-ons",
  ...PEPTIDE_MONTHLY_ADDONS.map((a) => a.label),
];

export function parseGlp1RefillAddonSelection(value: unknown): PeptideMonthlyAddon | null {
  const raw = String(value || "").trim();
  if (!raw || raw === "No monthly add-ons") return null;
  return PEPTIDE_MONTHLY_ADDONS.find((a) => a.label === raw) ?? null;
}

export function formatAddonPriceLabel(monthlyUsd: number): string {
  return `$${monthlyUsd}/mo`;
}
