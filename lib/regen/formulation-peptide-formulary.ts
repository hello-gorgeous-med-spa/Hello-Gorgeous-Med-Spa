/**
 * RE GEN RX peptide legal grid — educational, for Illinois patients.
 * Status is what a licensed 503A pharmacy can lawfully compound today.
 * Confirm live eligibility before any order. A PCAC vote is not a green light.
 */

export const FORMULATION_PEPTIDE_REVIEWED = "July 2026" as const;

export type PeptideLegalStatus = "lawful" | "review" | "none";

export type PeptideLegalRow = {
  names: string;
  status: PeptideLegalStatus;
  statusLabel: string;
  notes: string;
};

export const PEPTIDE_LEGAL_ROWS: PeptideLegalRow[] = [
  {
    names: "Sermorelin, Tesamorelin, PT-141 (Bremelanotide)",
    status: "lawful",
    statusLabel: "Lawful pathway",
    notes:
      "Component of an FDA-approved drug. The finished compound still has to clear the “essentially a copy” rule with a documented, patient-specific clinical difference.",
  },
  {
    names: "Oxytocin, Glutathione, VIP, topical GHK-Cu",
    status: "lawful",
    statusLabel: "Lawful pathway",
    notes:
      "Monograph / 503A bulks-list framework. Route limits can apply — GHK-Cu is eligible for non-injectable (e.g. topical) routes only.",
  },
  {
    names: "BPC-157, TB-500, MOTS-c, KPV, Semax, Epitalon",
    status: "review",
    statusLabel: "Under review",
    notes:
      "No lawful §503A pathway yet. FDA’s Pharmacy Compounding Advisory Committee recommended these for the 503A bulks list (July 2026). Waiting on FDA action and rulemaking — a vote is not a green light.",
  },
  {
    names: "Emideltide (DSIP)",
    status: "none",
    statusLabel: "No pathway",
    notes: "Reviewed by PCAC in July 2026 and not recommended.",
  },
  {
    names: "CJC-1295, Ipamorelin, Thymosin Alpha-1, MK-677, Kisspeptin, GHRP-2/6, Melanotan",
    status: "none",
    statusLabel: "No pathway",
    notes: "Not nominated / safety category. No lawful §503A pathway at this time.",
  },
];

export type FormularyCard = {
  name: string;
  badge: string;
  blurb: string;
  forms: string;
  shopId: "sermorelin" | "tesamorelin" | "pt-141" | "oxytocin" | "glutathione" | "ghk-cu";
};

export const FORMULARY_MAINSTAYS: FormularyCard[] = [
  {
    name: "Sermorelin",
    badge: "Approved-drug-component pathway",
    blurb:
      "A growth-hormone-releasing hormone analog that signals the body’s own GH release rather than replacing it. Our most-requested peptide, in the routes patients actually use.",
    forms: "Injection 1 & 1.5 mg/mL · sublingual troches, RDTs & triturates 0.5 mg · combinations when prescribed",
    shopId: "sermorelin",
  },
  {
    name: "Tesamorelin",
    badge: "Approved-drug-component pathway",
    blurb:
      "A GHRH analog with an FDA-approved reference product — compounded only where a documented, patient-specific clinical difference applies.",
    forms: "Sterile injection 5 mg/mL · single- and multi-vial supplies",
    shopId: "tesamorelin",
  },
  {
    name: "PT-141 (Bremelanotide)",
    badge: "Approved-drug-component pathway",
    blurb:
      "A melanocortin-receptor agonist used in sexual-health protocols. Injectable and needle-free forms when a licensed Illinois clinician decides it is appropriate.",
    forms: "Injection 2 mg/mL · sublingual and nasal combinations",
    shopId: "pt-141",
  },
  {
    name: "Oxytocin",
    badge: "Monograph / approved-drug basis",
    blurb: "Compounded in needle-free troche, sublingual, and nasal forms for clinician-directed protocols.",
    forms: "Troches, sublingual RDTs & nasal spray",
    shopId: "oxytocin",
  },
  {
    name: "Glutathione",
    badge: "Monograph / bulks framework",
    blurb: "The body’s primary antioxidant, compounded in injectable and oral forms for wellness and adjunctive protocols.",
    forms: "Injectable 200 mg/mL · oral troches",
    shopId: "glutathione",
  },
  {
    name: "GHK-Cu (topical)",
    badge: "Eligible — non-injectable routes",
    blurb:
      "The copper tripeptide for skin and scalp — compounded topically, where it has an eligible route. Injectable GHK-Cu is not covered under this pathway.",
    forms: "Topical solution, foam & cream · sublingual triturates",
    shopId: "ghk-cu",
  },
];

export type PcacVote = {
  name: string;
  date: string;
  recommended: boolean;
};

export const PCAC_JULY_2026: PcacVote[] = [
  { name: "BPC-157", date: "Jul 23", recommended: true },
  { name: "KPV", date: "Jul 23", recommended: true },
  { name: "TB-500", date: "Jul 23", recommended: true },
  { name: "MOTS-c", date: "Jul 23", recommended: true },
  { name: "Semax", date: "Jul 24", recommended: true },
  { name: "Epitalon", date: "Jul 24", recommended: true },
  { name: "Emideltide (DSIP)", date: "Jul 24", recommended: false },
];

export const BULK_ELIGIBILITY_GATES = [
  "It has an applicable USP/NF monograph, or",
  "It is a component of an FDA-approved drug, or",
  "It appears on FDA’s 503A bulks list.",
] as const;

export const COPY_RULE_POINTS = [
  "This matters for any peptide that mirrors an approved drug (for example tesamorelin or bremelanotide).",
  "A different strength, form, route, or a removed allergen can establish the clinical difference.",
  "The rationale is documented per patient — not assumed.",
] as const;
