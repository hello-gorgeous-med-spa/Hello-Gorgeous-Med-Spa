/**
 * Clinical cheat sheets — No Prior Authorization / Hello Gorgeous staff reference PDFs.
 * Hosted under /staff/protocols/cheat-sheets/
 */

export type ClinicalCheatSheetCategory =
  | "injectables"
  | "weight-loss"
  | "hormones"
  | "iv-peptides"
  | "skin-laser"
  | "brows-lashes"
  | "spa-services"
  | "front-desk"
  | "reference";

export type ClinicalCheatSheet = {
  id: string;
  title: string;
  description: string;
  filename: string;
  category: ClinicalCheatSheetCategory;
  href: string;
  thumbnail?: string;
};

export const CLINICAL_CHEAT_SHEET_CATEGORIES: {
  id: ClinicalCheatSheetCategory;
  label: string;
  icon: string;
}[] = [
  { id: "injectables", label: "Injectables", icon: "💉" },
  { id: "weight-loss", label: "Weight Loss & GLP-1", icon: "⚖️" },
  { id: "hormones", label: "Hormones & Pellets", icon: "🧬" },
  { id: "iv-peptides", label: "IV & Peptides", icon: "💊" },
  { id: "skin-laser", label: "Skin & Laser", icon: "✨" },
  { id: "brows-lashes", label: "Brows & Lashes", icon: "👁️" },
  { id: "spa-services", label: "Spa Services", icon: "🧖" },
  { id: "front-desk", label: "Front Desk & Ops", icon: "🛎️" },
  { id: "reference", label: "Reference", icon: "📚" },
];

const CHEAT_SHEET_BASE = "/staff/protocols/cheat-sheets";

function sheet(
  filename: string,
  title: string,
  description: string,
  category: ClinicalCheatSheetCategory,
  thumbnail?: string,
): ClinicalCheatSheet {
  const id = filename.replace(/\.pdf$/i, "");
  return {
    id,
    title,
    description,
    filename,
    category,
    href: `${CHEAT_SHEET_BASE}/${encodeURIComponent(filename)}`,
    thumbnail,
  };
}

export const CLINICAL_CHEAT_SHEETS: ClinicalCheatSheet[] = [
  sheet(
    "botox-clinical-cheat-sheet.pdf",
    "Botox — Clinical",
    "Indications, contraindications, and treatment fundamentals.",
    "injectables",
  ),
  sheet(
    "botox-dosing-zones-cheat-sheet.pdf",
    "Botox — Dosing Zones",
    "Units by facial zone and common starting ranges.",
    "injectables",
  ),
  sheet(
    "dermal-filler-clinical-cheat-sheet.pdf",
    "Dermal Filler — Clinical",
    "Product selection, depth, and safety overview.",
    "injectables",
  ),
  sheet(
    "filler-product-comparison-cheat-sheet.pdf",
    "Filler Product Comparison",
    "Cross-brand HA filler characteristics at a glance.",
    "injectables",
  ),
  sheet(
    "lip-filler-anatomy-cheat-sheet.pdf",
    "Lip Filler Anatomy",
    "Vascular danger zones and injection landmarks.",
    "injectables",
  ),
  sheet(
    "cannula-vs-needle-cheat-sheet.pdf",
    "Cannula vs Needle",
    "When to use each technique for fillers.",
    "injectables",
  ),
  sheet(
    "injection-techniques-cheat-sheet.pdf",
    "Injection Techniques",
    "Angles, depths, and aspiration reminders.",
    "injectables",
  ),
  sheet(
    "vascular-occlusion-protocol-cheat-sheet.pdf",
    "Vascular Occlusion Protocol",
    "Recognition and emergency response steps.",
    "injectables",
  ),
  sheet(
    "glp1-clinical-cheat-sheet.pdf",
    "GLP-1 — Clinical",
    "Program overview, screening, and monitoring.",
    "weight-loss",
    "/staff/protocols/cheat-sheets/thumbnails/glp1-clinical-cheat-sheet.png",
  ),
  sheet(
    "glp1-titration-cheat-sheet.pdf",
    "GLP-1 Titration",
    "Dose escalation schedules and hold rules.",
    "weight-loss",
    "/staff/protocols/cheat-sheets/thumbnails/glp1-titration-cheat-sheet.png",
  ),
  sheet(
    "tirzepatide-vs-semaglutide-cheat-sheet.pdf",
    "Tirzepatide vs Semaglutide",
    "Side-by-side comparison for patient conversations.",
    "weight-loss",
  ),
  sheet(
    "hormone-therapy-clinical-cheat-sheet.pdf",
    "Hormone Therapy — Clinical",
    "HRT/TRT program structure and follow-up.",
    "hormones",
  ),
  sheet(
    "hormone-lab-reference-cheat-sheet.pdf",
    "Hormone Lab Reference",
    "Key labs, ranges, and recheck timing.",
    "hormones",
  ),
  sheet(
    "pellet-therapy-clinical-cheat-sheet.pdf",
    "Pellet Therapy — Clinical",
    "BioTE-style pellet workflow and consent points.",
    "hormones",
  ),
  sheet(
    "pellet-therapy-dosing-cheat-sheet.pdf",
    "Pellet Therapy Dosing",
    "Starting doses and titration reference.",
    "hormones",
  ),
  sheet(
    "trt-men-vs-women-cheat-sheet.pdf",
    "TRT — Men vs Women",
    "Sex-specific protocols and talking points.",
    "hormones",
  ),
  sheet(
    "hello-gorgeous-peptides-101.pdf",
    "Hello Gorgeous Peptides 101",
    "HG-branded peptide primer — goals, popular peptides, and patient conversations.",
    "iv-peptides",
  ),
  sheet(
    "peptide-therapy-clinical-cheat-sheet.pdf",
    "Peptide Therapy — Clinical",
    "Common peptides, goals, and supervision.",
    "iv-peptides",
  ),
  sheet(
    "iv-therapy-clinical-cheat-sheet.pdf",
    "IV Therapy — Clinical",
    "Drip menu, screening, and room workflow.",
    "iv-peptides",
  ),
  sheet(
    "olympia-iv-dosing-guide-cheat-sheet.pdf",
    "Olympia IV Dosing Guide",
    "Olympia wholesale IV formulation reference.",
    "iv-peptides",
  ),
  sheet(
    "ipl-laser-clinical-cheat-sheet.pdf",
    "IPL & Laser — Clinical",
    "Settings, Fitzpatrick considerations, and aftercare.",
    "skin-laser",
  ),
  sheet(
    "laser-wavelength-reference-cheat-sheet.pdf",
    "Laser Wavelength Reference",
    "Wavelength → indication quick lookup.",
    "skin-laser",
  ),
  sheet(
    "chemical-peel-reference-cheat-sheet.pdf",
    "Chemical Peel Reference",
    "Acid depths, downtime, and pairing rules.",
    "skin-laser",
  ),
  sheet(
    "microneedling-depth-cheat-sheet.pdf",
    "Microneedling Depth",
    "Needle depth by concern and device.",
    "skin-laser",
  ),
  sheet(
    "fitzpatrick-classification-cheat-sheet.pdf",
    "Fitzpatrick Classification",
    "Skin typing for laser and peel safety.",
    "skin-laser",
  ),
  sheet(
    "skincare-ingredient-interactions-cheat-sheet.pdf",
    "Skincare Ingredient Interactions",
    "What to pause before/after procedures.",
    "skin-laser",
  ),
  sheet(
    "brow-henna-clinical-cheat-sheet.pdf",
    "Brow Henna — Clinical",
    "Patch test, timing, and aftercare.",
    "brows-lashes",
  ),
  sheet(
    "lash-extensions-clinical-cheat-sheet.pdf",
    "Lash Extensions — Clinical",
    "Isolation, adhesive, and allergy protocol.",
    "brows-lashes",
  ),
  sheet(
    "lash-lift-perm-clinical-cheat-sheet.pdf",
    "Lash Lift & Perm — Clinical",
    "Timing, shield sizing, and contraindications.",
    "brows-lashes",
  ),
  sheet(
    "waxing-clinical-cheat-sheet.pdf",
    "Waxing — Clinical",
    "Skin prep, post-care, and contraindications.",
    "spa-services",
  ),
  sheet(
    "new-patient-intake-cheat-sheet.pdf",
    "New Patient Intake",
    "Front desk checklist from hello to room.",
    "front-desk",
  ),
  sheet(
    "treatment-room-setup-cheat-sheet.pdf",
    "Treatment Room Setup",
    "Turnover checklist between clients.",
    "front-desk",
  ),
  sheet(
    "staff-roles-cheat-sheet.pdf",
    "Staff Roles",
    "Who owns what across front desk, RN, and NP.",
    "front-desk",
  ),
  sheet(
    "membership-pricing-calculator-cheat-sheet.pdf",
    "Membership Pricing Calculator",
    "No Prior Authorization membership math.",
    "front-desk",
  ),
  sheet(
    "retail-pricing-formula-cheat-sheet.pdf",
    "Retail Pricing Formula",
    "Markup and bundle pricing at the counter.",
    "front-desk",
  ),
  sheet(
    "pharmaceutical-reference-cheat-sheet.pdf",
    "Pharmaceutical Reference",
    "Common Rx abbreviations and dispensing notes.",
    "reference",
  ),
];

export function cheatSheetsByCategory(
  category: ClinicalCheatSheetCategory | "all",
): ClinicalCheatSheet[] {
  if (category === "all") return CLINICAL_CHEAT_SHEETS;
  return CLINICAL_CHEAT_SHEETS.filter((s) => s.category === category);
}

export const CLINICAL_CHEAT_SHEETS_PATH = "/staff/protocols?tab=cheat-sheets";
