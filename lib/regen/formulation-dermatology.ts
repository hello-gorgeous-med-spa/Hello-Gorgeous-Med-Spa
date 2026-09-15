export const FORMULATION_DERMATOLOGY_SOURCE = "https://formulationrx.com/dermatology/";

export const DERM_STATS = [
  {
    title: "100+",
    body: "Dermatology and hair-restoration formulations on the shelf — plus custom actives to order.",
  },
  {
    title: "90+",
    body: "Hair-loss formulas across oral capsules, topical solutions, and intradermal injections.",
  },
  {
    title: "10 forms",
    body: "Cream, solution, foam, gel, capsule, sublingual, intradermal, and more.",
  },
] as const;

export type DermCategory = {
  title: string;
  body: string;
  items: string[];
  note: string;
};

export const DERM_CATEGORIES: DermCategory[] = [
  {
    title: "Hyperpigmentation & melasma",
    body: "Tri-agent “Kligman-style” brightening and gentler, hydroquinone-free alternatives — dialed to the strength and tolerance a clinician chooses.",
    items: [
      "Brightening cream — hydroquinone / tretinoin / azelaic / kojic / hydrocortisone",
      "Hydroquinone / tretinoin / fluocinolone / vitamin E / vitamin C",
      "Hydroquinone / kojic / tranexamic / vitamin E",
      "Hydroquinone topical cream — up to 13%",
      "Sensitive (HQ-free) — kojic / niacinamide / tranexamic, anhydrous",
    ],
    note: "Custom HQ 2%–13% · kojic / azelaic / tranexamic blends",
  },
  {
    title: "Acne & rosacea",
    body: "Multi-active topicals that combine what a patient would otherwise apply as three separate products — including non-antibiotic routes.",
    items: [
      "Azelaic acid / tretinoin / niacinamide",
      "Azelaic acid / niacinamide",
      "Niacinamide / metronidazole — rosacea care",
      "Niacinamide / ascorbic acid / sodium hyaluronate",
      "Custom clindamycin, benzoyl peroxide, dapsone & sulfur blends to Rx",
    ],
    note: "Single-compound combinations · non-antibiotic options",
  },
  {
    title: "Hair restoration",
    body: "Formulation’s deepest dermatology category — oral, topical, and intradermal routes so a plan can escalate without switching pharmacies.",
    items: [
      "Minoxidil / finasteride / arginine topical solution",
      "Minoxidil / dutasteride / spironolactone / tretinoin / ketoconazole / hydrocortisone",
      "Latanoprost / dutasteride / L-carnitine topical solution",
      "Intradermal minoxidil (PF) & dutasteride — mesotherapy",
      "Oral hair capsules · GHK-Cu foam & solution",
    ],
    note: "Oral · topical solution · intradermal · foam",
  },
  {
    title: "Procedural & topical anesthesia",
    body: "In-office numbing for laser, microneedling, injectables, and biopsies — strength, size, and penetrating base specified for the chair.",
    items: [
      "BLT cream — benzocaine / lidocaine / tetracaine 20/6/4 and 20/10/10",
      "BLT with DMSO lipodermal cream",
      "Lidocaine / tetracaine anhydrous cream",
      "Benzocaine / lidocaine / tetracaine dental gel",
      "Bulk clinic sizes — 60 g up to 300 g",
    ],
    note: "Penetration-enhancing bases for laser & device work",
  },
  {
    title: "Anti-aging & skin health",
    body: "Prescription-strength renewal and barrier support — retinoids, peptides, and antioxidants in patient-tolerable bases.",
    items: [
      "Estriol / tretinoin / alpha-lipoic acid / hyaluronic acid / vitamin C",
      "Estriol / sodium hyaluronate / ascorbic acid / aloe",
      "GHK-Cu copper-peptide topical solution & foam 0.25%–0.5%",
      "Niacinamide / ascorbic acid / sodium hyaluronate antioxidant cream",
      "Custom tretinoin strengths & combination retinoid regimens",
    ],
    note: "Pharmaceutically elegant · patient-specific strengths",
  },
  {
    title: "Antifungal, wound & everyday derm",
    body: "The compounds a practice reaches for daily — made to Rx, in the vehicle and concentration specified.",
    items: [
      "Antifungals & antiparasitics — ivermectin, plus custom ketoconazole / terbinafine / ciclopirox",
      "Scar management — silicone-based systems",
      "Wound care & barrier compounds",
      "Corticosteroid creams — custom potencies",
      "All-purpose nipple ointment (APNO) & pediatric-friendly bases",
    ],
    note: "If it is compoundable to a valid Rx, Formulation will make it",
  },
];

export const DERM_FORMS = [
  { name: "Creams & anhydrous", detail: "Elegant, tunable bases" },
  { name: "Topical solutions", detail: "Scalp and large areas" },
  { name: "Foams & gels", detail: "Cosmetically light" },
  { name: "Capsules & tablets", detail: "Oral and sublingual" },
  { name: "Intradermal", detail: "Sterile mesotherapy, made in-house" },
] as const;

export const DERM_QUALITY = [
  {
    title: "Milled to elegance",
    body: "Electronic mortar & pestle, ointment mill, and planetary mixer — for smooth, grit-free, uniform creams and solutions.",
  },
  {
    title: "Intradermal, in-house",
    body: "Preservative-free intradermal minoxidil and dutasteride for hair mesotherapy are compounded under Formulation’s sterile process — not outsourced.",
  },
  {
    title: "Potency-tested",
    body: "Sterile formulations are third-party potency- and stability-tested, with certificates of analysis on file.",
  },
] as const;
