/**
 * Card grid data for /products-we-offer (tabbed showcase).
 * Badge maps to HG-styled pills — no pricing.
 *
 * Keep copy in sync with `docs/hello-gorgeous-products.html` (standalone reference for designers / drop-in demos).
 */

export type ProductOfferBadge = "rx" | "popular" | "controlled" | "cold";

export type ProductOfferCard = {
  name: string;
  form: string;
  desc: string;
  badge: ProductOfferBadge;
  label: string;
};

export type ProductOfferCategory = {
  id: string;
  navLabel: string;
  eyebrow: string;
  /** e.g. "GLP-1 & " + em("weight loss") + " therapies" */
  titleBefore: string;
  titleEm: string;
  titleAfter: string;
  description: string;
  /** Shown in semibold */
  consultBold: string;
  /** Remainder of consultation bar sentence (often starts with space) */
  consultRest: string;
  cards: ProductOfferCard[];
};

export const PRODUCT_OFFER_CATEGORIES: ProductOfferCategory[] = [
  {
    id: "weight",
    navLabel: "Weight loss",
    eyebrow: "Weight management",
    titleBefore: "GLP-1 & ",
    titleEm: "weight loss",
    titleAfter: " therapies",
    description:
      "Clinically proven GLP-1 medications prescribed and managed in-house. No insurance required — personalized dosing, ongoing support, and real results.",
    consultBold: "All medications are prescribed by our clinical team.",
    consultRest: " Book a consultation to find the right program for you.",
    cards: [
      {
        name: "Semaglutide injection",
        form: "Injectable · Weekly",
        desc: "The active ingredient in Ozempic and Wegovy. Reduces appetite and promotes sustained fat loss.",
        badge: "popular",
        label: "Most popular",
      },
      {
        name: "Tirzepatide injection",
        form: "Injectable · Weekly",
        desc: "Dual GIP/GLP-1 agonist. Shown to produce greater weight loss than semaglutide alone in clinical trials.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Retatrutide injection",
        form: "Injectable · Weekly",
        desc: "Triple hormone agonist — the newest generation of GLP-1 therapy with exceptional early results.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Semaglutide sublingual tablets",
        form: "Tablet · Daily",
        desc: "Dissolving tablets for those who prefer to avoid injections. Convenient and discreet.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Low dose naltrexone (LDN)",
        form: "Capsule · Daily",
        desc: "LDN supports weight loss by reducing inflammation and improving metabolic response. Often combined with GLP-1.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Bupropion / naltrexone SR",
        form: "Capsule · Daily",
        desc: "Combined appetite suppressant and reward pathway modulator. Pharmaceutical-grade combo for metabolic support.",
        badge: "rx",
        label: "Rx",
      },
    ],
  },
  {
    id: "peptides",
    navLabel: "Peptides",
    eyebrow: "Peptide therapy",
    titleBefore: "Targeted ",
    titleEm: "peptide",
    titleAfter: " programs",
    description:
      "Peptides are short chains of amino acids that signal your body to repair, grow, and optimize. From growth hormone support to healing and libido — peptides work at the cellular level.",
    consultBold: "Not sure which peptide is right for you?",
    consultRest: " Our team will guide you to the best option for your goals.",
    cards: [
      {
        name: "Sermorelin injection",
        form: "Injectable · Nightly",
        desc: "Stimulates natural growth hormone release. Improves sleep, recovery, body composition, and skin quality.",
        badge: "cold",
        label: "Cold ship",
      },
      {
        name: "Sermorelin sublingual tablet",
        form: "Tablet · Daily",
        desc: "Non-injectable option for growth hormone support. Convenient for travel and daily compliance.",
        badge: "cold",
        label: "Cold ship",
      },
      {
        name: "Tesamorelin injection",
        form: "Injectable · Daily",
        desc: "FDA-approved growth hormone releasing factor. Clinically proven to reduce visceral fat.",
        badge: "cold",
        label: "Cold ship",
      },
      {
        name: "Pentadeca arginate (PDA)",
        form: "Injectable or Capsule",
        desc: "Next-generation tissue healing peptide. Supports gut health, injury recovery, and inflammation reduction.",
        badge: "cold",
        label: "Cold ship",
      },
      {
        name: "PT-141 (Bremelanotide)",
        form: "Injectable",
        desc: "Centrally acting peptide for sexual arousal in both men and women. Works through the nervous system.",
        badge: "cold",
        label: "Cold ship",
      },
      {
        name: "Thymosin Beta-4",
        form: "Injectable",
        desc: "Powerful healing and anti-inflammatory peptide. Used for injury recovery, chronic inflammation, and tissue repair.",
        badge: "cold",
        label: "Cold ship",
      },
    ],
  },
  {
    id: "hormone",
    navLabel: "Hormone therapy",
    eyebrow: "Hormone therapy",
    titleBefore: "Bioidentical ",
    titleEm: "hormone",
    titleAfter: " optimization",
    description:
      "Restore balance with bioidentical hormone therapy tailored to your labs and symptoms. Testosterone, estrogen, progesterone, and thyroid support — all managed in-house.",
    consultBold: "Hormone therapy starts with labs.",
    consultRest: " Book a consultation and we'll review your bloodwork together.",
    cards: [
      {
        name: "Testosterone cypionate",
        form: "Injectable · Weekly",
        desc: "The gold standard for testosterone replacement therapy. Restores energy, libido, muscle mass, and mood.",
        badge: "controlled",
        label: "Controlled",
      },
      {
        name: "Testosterone cream",
        form: "Topical · Daily",
        desc: "Transdermal testosterone for men and women who prefer non-injectable delivery.",
        badge: "controlled",
        label: "Controlled",
      },
      {
        name: "Progesterone capsules",
        form: "Capsule · Daily",
        desc: "Bioidentical progesterone for hormone balance, sleep, anxiety, and perimenopause support.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Bi-Est estrogen cream",
        form: "Topical · Daily",
        desc: "80/20 or 50/50 blend of estradiol and estriol. Supports bone density, skin, cognition, and symptom relief.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Enclomiphene citrate",
        form: "Capsule · Daily",
        desc: "Increases natural testosterone production without suppressing fertility. Ideal for younger men.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Thyroid (T3/T4) capsules",
        form: "Capsule · Daily",
        desc: "Compounded thyroid with both T3 and T4. Addresses symptoms standard Synthroid may miss.",
        badge: "rx",
        label: "Rx",
      },
    ],
  },
  {
    id: "antiaging",
    navLabel: "Anti-aging",
    eyebrow: "Anti-aging",
    titleBefore: "Longevity & ",
    titleEm: "cellular health",
    titleAfter: "",
    description:
      "NAD+, peptides, methylene blue, rapamycin — the science of aging has advanced rapidly. We offer the most clinically supported longevity protocols available.",
    consultBold: "Longevity starts with a conversation.",
    consultRest: " Let's talk about what your body needs.",
    cards: [
      {
        name: "NAD+ injection",
        form: "Injectable",
        desc: "Nicotinamide adenine dinucleotide — critical for cellular energy, DNA repair, and longevity pathways.",
        badge: "cold",
        label: "Cold ship",
      },
      {
        name: "NAD+ nasal spray",
        form: "Nasal spray · Daily",
        desc: "Fast-absorbing intranasal NAD+ for brain energy, focus, and cognitive longevity.",
        badge: "cold",
        label: "Cold ship",
      },
      {
        name: "Methylene blue capsules",
        form: "Capsule · Daily",
        desc: "Mitochondrial enhancer with neuroprotective and anti-aging properties. Supports memory and energy.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Rapamycin capsules",
        form: "Capsule · Weekly",
        desc: "mTOR inhibitor with growing evidence as a longevity drug. Used in low-dose weekly protocols.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "GHK-Cu sublingual tablet",
        form: "Tablet · Daily",
        desc: "Copper peptide with powerful regenerative, anti-inflammatory, and collagen-stimulating effects.",
        badge: "cold",
        label: "Cold ship",
      },
      {
        name: "5-Amino 1MQ capsules",
        form: "Capsule · Daily",
        desc: "Inhibits NNMT to promote fat burning, NAD+ production, and metabolic anti-aging benefits.",
        badge: "rx",
        label: "Rx",
      },
    ],
  },
  {
    id: "hair",
    navLabel: "Hair loss",
    eyebrow: "Hair loss",
    titleBefore: "Hair restoration ",
    titleEm: "that works",
    titleAfter: "",
    description:
      "From oral minoxidil and finasteride to GHK-Cu peptide topicals and intradermal injections — we offer comprehensive, compounded hair loss protocols for men and women.",
    consultBold: "Hair loss is treatable.",
    consultRest: " Our team will recommend the right protocol based on your pattern and goals.",
    cards: [
      {
        name: "Minoxidil capsules",
        form: "Capsule · Daily",
        desc: "Oral minoxidil for systemic hair regrowth support. More consistent blood levels than topical alone.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Minoxidil / finasteride topical",
        form: "Solution · Daily",
        desc: "Compounded dual-action topical targeting both follicle miniaturization and DHT.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Dutasteride capsules",
        form: "Capsule · Daily",
        desc: "Stronger DHT inhibitor than finasteride. Used for aggressive male pattern hair loss.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "GHK-Cu topical solution",
        form: "Topical · Daily",
        desc: "Copper peptide to stimulate hair follicle activity and reduce scalp inflammation.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Intradermal minoxidil injection",
        form: "Injectable · In-office",
        desc: "Direct scalp injection for targeted follicle stimulation — more potent than topical delivery.",
        badge: "cold",
        label: "Cold ship",
      },
      {
        name: "GHK-Cu / biotin foam",
        form: "Topical foam · Daily",
        desc: "Copper peptide plus biotin in a lightweight foam for daily scalp application.",
        badge: "rx",
        label: "Rx",
      },
    ],
  },
  {
    id: "sexual",
    navLabel: "Sexual health",
    eyebrow: "Sexual health",
    titleBefore: "Confidence & ",
    titleEm: "intimacy",
    titleAfter: " restored",
    description:
      "Discreet, clinician-managed sexual health programs for men and women. From ED treatments to female arousal therapy — we offer compassionate, effective care.",
    consultBold: "Private. Judgment-free. Effective.",
    consultRest: " Start with a confidential consultation.",
    cards: [
      {
        name: "Tadalafil capsules",
        form: "Capsule · Daily or as-needed",
        desc: "Long-acting PDE5 inhibitor. Daily low-dose (5mg) supports vascular health and continuous readiness.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Sildenafil capsules",
        form: "Capsule · As-needed",
        desc: "Fast-acting ED treatment. Compounded in precise doses without the brand-name markup.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "PT-141 / oxytocin nasal spray",
        form: "Nasal spray",
        desc: "Central arousal peptide combined with oxytocin for enhanced intimacy and connection.",
        badge: "cold",
        label: "Cold ship",
      },
      {
        name: "Scream cream",
        form: "Topical · As-needed",
        desc: "Topical cream for female arousal. Sildenafil, arginine, and papaverine applied for enhanced sensation.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Oxytocin sublingual tablets",
        form: "Tablet · As-needed",
        desc: "The bonding hormone. Supports intimacy, trust, and arousal when taken sublingually.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Tadalafil / oxytocin / PT-141 troche",
        form: "Troche · As-needed",
        desc: "Triple-action formula combining vascular, hormonal, and neural pathways for men.",
        badge: "cold",
        label: "Cold ship",
      },
    ],
  },
  {
    id: "wellness",
    navLabel: "Wellness & vitamins",
    eyebrow: "Wellness & vitamins",
    titleBefore: "IV nutrients & ",
    titleEm: "foundational health",
    titleAfter: "",
    description:
      "Glutathione, Myers' Cocktail, B12, lipotropic injections and more — support your immune system, energy, and detox pathways with medical-grade injectable nutrients.",
    consultBold: "Feel better from the inside out.",
    consultRest: " Ask about our vitamin injection add-ons at your next visit.",
    cards: [
      {
        name: "Myers cocktail injection",
        form: "Injectable · In-office",
        desc: "The gold standard IV vitamin protocol — magnesium, B vitamins, vitamin C, and calcium for energy and immunity.",
        badge: "cold",
        label: "Cold ship",
      },
      {
        name: "Glutathione injection",
        form: "Injectable",
        desc: "Master antioxidant for detox, skin brightening, immune support, and cellular protection.",
        badge: "cold",
        label: "Cold ship",
      },
      {
        name: "Methylcobalamin (B12) injection",
        form: "Injectable",
        desc: "Active form of B12 for energy, mood, nerve health, and methylation support.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Lipotropic B injection (MIC + B12)",
        form: "Injectable",
        desc: "Methionine, inositol, choline, and B12 — the classic fat-burning injection stack.",
        badge: "rx",
        label: "Rx",
      },
      {
        name: "Lipotropic Super B",
        form: "Injectable",
        desc: "Full-spectrum lipotropic with L-carnitine, B vitamins, niacin, and methylcobalamin.",
        badge: "cold",
        label: "Cold ship",
      },
      {
        name: "Low dose naltrexone (LDN)",
        form: "Capsule · Nightly",
        desc: "Immune modulator and anti-inflammatory. Used for autoimmune conditions, mood, and overall wellness.",
        badge: "rx",
        label: "Rx",
      },
    ],
  },
];
