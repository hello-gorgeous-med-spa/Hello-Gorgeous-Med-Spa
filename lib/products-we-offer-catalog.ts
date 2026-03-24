/**
 * Aggregated compounded product families available through Hello Gorgeous’s prescribing workflow
 * and 503A pharmacy partners (e.g. Olympia). Not an exhaustive SKU list — no pricing.
 *
 * takeHome: typically dispensed for self-administration or home use after provider approval & teaching.
 * inClinic: typically prepared, drawn, or administered in-office — or restricted/clinical workflows.
 */

export type ProductCategoryBlock = {
  id: string;
  title: string;
  blurb?: string;
  /** Patient take-home / self-use (oral, topical, some self-injection after training) */
  takeHome: string[];
  /** Provider-administered, IV/IM in-office, or higher-touch dispensing */
  inClinic: string[];
};

export const PRODUCTS_OFFER_INTRO = {
  headline: "Products we offer",
  sub:
    "Below is an organized view of compounded medication families we may prescribe as part of your personalized plan. What you receive depends on your visit, labs, and medical judgment — not everything is appropriate for every patient.",
  bullets: [
    "All items require a prescription and active relationship with our clinical team.",
    "We do not list prices here; your provider discusses cost and alternatives at consultation.",
    "Cold-chain, controlled, and injectable products follow pharmacy and Illinois regulations.",
    "Formulations and strengths are individualized — the pharmacy directory has the full formulary.",
  ],
};

export const PRODUCT_CATEGORIES: ProductCategoryBlock[] = [
  {
    id: "weight-management",
    title: "Weight management",
    blurb: "GLP-1 class therapies and adjuncts; dosing and format are provider-specific.",
    takeHome: [
      "Semaglutide — sublingual triturates & oral formats (when prescribed)",
      "Tirzepatide — sublingual triturates (when prescribed)",
      "Naltrexone (low-dose) — capsules",
      "Bupropion / naltrexone / chromium — sustained-release capsules",
      "Bupropion / phentermine / naltrexone — sustained-release (controlled — provider-managed)",
      "Phentermine / topiramate / chromium — sustained-release (controlled — provider-managed)",
      "AOD-9604 — rapid dissolve tablets; AOD / oxytocin troches; AOD / naltrexone topical (when prescribed)",
    ],
    inClinic: [
      "Semaglutide + B6 — sterile injection (vial packs / MDVs)",
      "Tirzepatide + B6 — sterile injection (vial packs / MDVs)",
      "Retatrutide + B6 — sterile injection (multi-vial kits)",
      "Injectable weight protocols — teaching, supplies, and monitoring in-office",
    ],
  },
  {
    id: "peptide-longevity",
    title: "Peptides & longevity",
    takeHome: [
      "Sermorelin — capsules, sublingual tablets, troches, rapid dissolve (when prescribed)",
      "Sermorelin combinations — DHEA sublingual / troches; oxytocin troches (when prescribed)",
      "BPC-157 / TB-500 — injectable vials (often self-administered after training)",
      "Pentadeca arginate — capsules; sterile vial (use per protocol)",
      "PT-141 (bremelanotide) — sterile vial (protocol-dependent)",
      "SS-31 (elamipretide) — sterile injectable",
      "Thymosin beta-4 acetate — sterile injectable",
      "Tesamorelin — sterile injection",
    ],
    inClinic: [
      "Peptide injections — first doses, technique checks, and monitoring",
      "Cold-chain peptide handling when required by product",
    ],
  },
  {
    id: "anti-aging-metabolic",
    title: "Anti-aging & metabolic support",
    takeHome: [
      "5-Amino-1MQ — capsules; iodide sublingual rapid dissolve; iodide troches (cold-chain where required)",
      "Methylene blue — capsules",
      "Rapamycin — capsules",
      "SLU-PP-332 — vegetable capsules",
      "Tesofensine — capsules",
      "NAD+ — acid-resistant capsules; rapid dissolve tablets; troches; nasal sprays (per protocol)",
      "Anti-aging / hormone-support creams — estriol, DHEA, GHK-Cu, DMAE, tretinoin blends, topical pumps",
      "GHK-Cu — sublingual triturates; biotin / pyridoxine combinations",
      "Oxandrolone — vegetable capsules (controlled — strict provider oversight)",
    ],
    inClinic: [
      "Biotin — sterile injection solution",
      "Levocarnitine — sterile injection",
      "NAD+ — sterile injection / MDVs; high-potency vial kits for IV programs",
    ],
  },
  {
    id: "hormone-therapy",
    title: "Hormone therapy",
    blurb: "Bioidentical and support hormones; many formats are take-home, injectables often taught or given in-office.",
    takeHome: [
      "Bi-Est / estradiol / estriol — creams, vaginal gels, troches, sublingual rapid dissolve, sustained-release capsules",
      "Progesterone — capsules, SR capsules, troches, sublingual rapid dissolve, creams",
      "Testosterone — cream (controlled); sublingual rapid dissolve; troches (controlled, cold-chain)",
      "DHEA — sustained-release capsules; vegetable capsules",
      "Thyroid support — liothyronine (T3), T3/T4 combination capsules & SR vegetable caps",
      "Anastrozole, clomiphene, enclomiphene — capsules",
      "Pregnenolone / chrysin / testosterone combo troches (when prescribed)",
    ],
    inClinic: [
      "Testosterone — cypionate / propionate in oil (controlled); MCT injections; combination vials",
      "Testosterone + anastrozole — injectable",
      "Estradiol hemihydrate — sesame oil injection",
      "Progesterone — grapeseed or sesame oil injection; multi-dose vial kits",
      "Nandrolone decanoate — injectable (controlled)",
      "Gonadorelin — injectable; nasal spray (per protocol)",
    ],
  },
  {
    id: "hair-loss",
    title: "Hair loss",
    takeHome: [
      "Oral minoxidil — capsules",
      "Finasteride / dutasteride — tablets & capsules",
      "Topical solutions & foams — minoxidil, finasteride, dutasteride, latanoprost, melatonin, peptides, multi-ingredient blends",
      "Nutritional combo capsules — minoxidil with vitamins/minerals (when prescribed)",
    ],
    inClinic: [
      "Minoxidil — preservative-free intradermal sterile injection (multiple strengths)",
      "Minoxidil + biotin — intradermal sterile injection",
      "Biotin — intradermal sterile injection",
      "Dutasteride — intradermal sterile oil injection",
    ],
  },
  {
    id: "sexual-health",
    title: "Sexual wellness",
    takeHome: [
      "Sildenafil / tadalafil — capsules, troches, sublingual rapid dissolve",
      "Combination orals — sildenafil or tadalafil with apomorphine, arginine, yohimbine, PT-141, oxytocin (formats vary)",
      "Scream creams — sildenafil / arginine / papaverine (± testosterone) topical",
      "Oxytocin — troches, sublingual tablets, nasal sprays",
    ],
    inClinic: [
      "Alprostadil, Bi-Mix, Tri-Mix, Quad-Mix, Super Tri-Mix — injectable (cold-chain)",
      "Phenylephrine — injectable",
      "PT-141 / oxytocin — nasal spray (protocol-dependent)",
    ],
  },
  {
    id: "dermatology-skin-prep",
    title: "Dermatology & skin prep",
    takeHome: [
      "Brightening / pigment — hydroquinone, tretinoin, kojic acid, tranexamic acid, fluocinolone combos (pumps)",
      "Azelaic acid, niacinamide, metronidazole — topical pumps",
      "Sensitive whitening / kojic acid blends",
    ],
    inClinic: [
      "BLT & numbing creams — benzocaine / lidocaine / tetracaine (multiple strengths & sizes)",
      "Lidocaine / tetracaine anhydrous versatile cream",
      "BLT with DMSO lipodermal cream — for select procedural prep",
    ],
  },
  {
    id: "lipotropic-vitamins",
    title: "Lipotropic, B12 & vitamin injections",
    takeHome: [
      "Glutathione — troches (when prescribed for home use)",
    ],
    inClinic: [
      "Lipotropic injections — A, B, C, MB, Super B, lipotropic MB (methionine, inositol, choline, carnitine, B vitamins)",
      "Glutathione — sterile injectable",
      "Methylcobalamin (B12) — sterile injection",
      "Vitamin D3 — injectable in oil",
      "Leucovorin (folinic acid) — oral suspension",
    ],
  },
  {
    id: "wellness-iv",
    title: "Wellness, IV ingredients & support",
    takeHome: [
      "Ivermectin — vegetable capsules (when clinically appropriate)",
      "Mebendazole — vegetable capsules",
      "Larazotide — vegetable capsules",
      "Leucovorin — vegetable capsules",
      "Spironolactone — tablets",
      "Naltrexone low-dose — additional capsule strengths",
      "Naltrexone / melatonin / oxytocin — troches",
      "Selank acetate — nasal spray (cold-chain)",
      "Ondansetron — tablets (anti-nausea when prescribed)",
    ],
    inClinic: [
      "Myers Cocktail & custom IV nutrient sterile solutions",
      "Magnesium, calcium, taurine, zinc — sterile IV-grade solutions",
      "AMINO MIX — arginine, citrulline, lysine, proline injectable",
      "Vita B mix — B-complex sterile injectable",
      "Lipo B6 — sterile injection",
      "Biotin — sterile injectable (wellness strength)",
    ],
  },
  {
    id: "pain-sedation",
    title: "Pain & sedation (strict oversight)",
    blurb: "Controlled substances — only within legal protocols and prescribing limits.",
    takeHome: [
      "Ketamine — sublingual rapid dissolve & troches (controlled)",
      "Diazepam — vegetable capsules (controlled)",
      "Clonazepam — oral suspension (controlled)",
    ],
    inClinic: [],
  },
  {
    id: "supplies",
    title: "Injection & safety supplies",
    blurb: "Provided when you are on an injectable program; teaching included.",
    takeHome: [
      "Sub-Q injection kits — insulin syringes + alcohol swabs",
      "IM injection kits — 1 mL syringes + swabs",
      "Drawing needles & alcohol swabs",
      "Multi-dose vial access spikes",
      "Sharps containers",
    ],
    inClinic: [],
  },
];

export const PRODUCTS_OFFER_FOOTNOTE =
  "Categories reflect common pharmacy partner formulary families. Availability, shipping (including cold-chain / next-day), and controlled-substance rules change — your provider and pharmacy confirm what applies to you. For research-only browsing of molecules, see our pharmacy partner’s public directory.";
