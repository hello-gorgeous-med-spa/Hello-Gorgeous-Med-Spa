/**
 * Peptide Library - "Peptide University" content for REGEN RX
 * What does each peptide actually do?
 */

export interface PeptideInfo {
  id: string;
  name: string;
  category: string;
  oneLiner: string;
  whatItDoes: string;
  benefits: string[];
  idealFor: string;
  clinicianNote: string;
  priceFrom: string;
}

export const PEPTIDE_CATEGORIES = [
  "Weight Loss & Metabolic",
  "Energy & Longevity",
  "Skin & Beauty",
  "Repair & Recovery",
  "Hormone & Vitality",
] as const;

export const PEPTIDE_LIBRARY: PeptideInfo[] = [
  {
    id: "tirz",
    name: "TIRZEPATIDE",
    category: "Weight Loss & Metabolic",
    oneLiner: "Mimics two hunger hormones to quiet food noise and steady blood sugar.",
    whatItDoes: "Dual GIP + GLP-1 receptor activation. Helps your body feel satisfied sooner, slows gastric emptying, and supports insulin sensitivity — so cravings soften and portions naturally shrink.",
    benefits: [
      "Reduces constant food thoughts and late-night cravings",
      "Supports steadier energy without the crash-diet feeling",
      "Pairs with our high-protein, whole-food framework",
    ],
    idealFor: "Clients with persistent hunger and weight that won't budge",
    clinicianNote: "We start conservative and titrate slowly. This is not a race — tolerability > speed.",
    priceFrom: "$399",
  },
  {
    id: "sema",
    name: "SEMAGLUTIDE",
    category: "Weight Loss & Metabolic",
    oneLiner: "The classic single-path GLP-1 that helps you feel full, faster.",
    whatItDoes: "A single GLP-1 pathway that signals fullness to the brain. Often better tolerated for sensitive stomachs and a beautiful entry point for first-time metabolic support.",
    benefits: [
      "Gentle appetite quieting without overstimulation",
      "Easier to pair with travel and social life",
      "Long clinical track record",
    ],
    idealFor: "First-time clients wanting a classic, predictable experience",
    clinicianNote: "Think of this as the little black dress of metabolic peptides — simple, effective, timeless.",
    priceFrom: "$299",
  },
  {
    id: "micro",
    name: "MICRODOSING PROTOCOL",
    category: "Weight Loss & Metabolic",
    oneLiner: "Low-dose, sustainable — designed to avoid the high-dose rollercoaster.",
    whatItDoes: "Instead of chasing the highest dose, we use micro-increments to maintain appetite control while preserving muscle, mood, and metabolism. Education on protein, fiber, and strength is built in.",
    benefits: [
      "Less nausea, more consistency",
      "Focus on fat loss, not just scale loss",
      "Built for long-term maintenance",
    ],
    idealFor: "Clients who tried GLP-1s before and felt wiped out",
    clinicianNote: "Low and slow wins. We want you eating, lifting, and living.",
    priceFrom: "$249",
  },
  {
    id: "nad",
    name: "NAD+",
    category: "Energy & Longevity",
    oneLiner: "Cellular recharge for mitochondria — the reason you feel tired at 3pm.",
    whatItDoes: "NAD+ fuels your mitochondria, the tiny power plants in every cell. Levels naturally dip with age, stress, and poor sleep. This is about clear-headedness and cellular repair, not caffeine.",
    benefits: [
      "Clean mental clarity without jitters",
      "Supports recovery from stress and poor sleep",
      "Foundational for any longevity stack",
    ],
    idealFor: "Founders, moms, night-shift brains running on fumes",
    clinicianNote: "Start with injections, then maintain. Hydrate — your cells will thank you.",
    priceFrom: "$199",
  },
  {
    id: "gluta",
    name: "GLUTATHIONE",
    category: "Energy & Longevity",
    oneLiner: "The master antioxidant that makes skin look like you slept 9 hours.",
    whatItDoes: "Your body's primary detox and brightening molecule. Helps neutralize oxidative stress from pollution, alcohol, and stress while supporting that lit-from-within radiance.",
    benefits: [
      "Supports brighter, more even-looking skin tone",
      "Pairs beautifully with NAD+ for glow + energy",
      "Antioxidant defense from the inside out",
    ],
    idealFor: "Dullness, post-travel fatigue, and city living",
    clinicianNote: "This is a quiet luxury — you don't feel it buzz, you see it in the mirror.",
    priceFrom: "$149",
  },
  {
    id: "motsc",
    name: "MOTS-c",
    category: "Energy & Longevity",
    oneLiner: "Exercise in a molecule — metabolism gets the message to move.",
    whatItDoes: "A mitochondrial peptide that mimics some benefits of exercise at the cellular level — improving how your body uses glucose and fat for fuel, especially when movement is limited.",
    benefits: [
      "Encourages efficient fuel use vs. storage",
      "Supports metabolic flexibility",
      "Great bridge on rest days",
    ],
    idealFor: "Busy schedules that can't always get a full workout in",
    clinicianNote: "It supports movement, it doesn't replace it. Walk + MOTS-c = gorgeous synergy.",
    priceFrom: "$189",
  },
  {
    id: "ghk",
    name: "GHK-Cu",
    category: "Skin & Beauty",
    oneLiner: "Copper peptide that whispers to collagen to firm up.",
    whatItDoes: "GHK-Cu is naturally found in your plasma — it drops with age. It signals fibroblasts to organize collagen and calm redness, without harsh actives.",
    benefits: [
      "Supports firmer, bouncier-looking skin",
      "Helps soften fine lines around eyes and mouth",
      "Calms post-procedure sensitivity",
    ],
    idealFor: "Collagen loss and crepey texture",
    clinicianNote: "Beautiful daily driver. No sting, just support.",
    priceFrom: "$129",
  },
  {
    id: "tret",
    name: "TRETINOIN + GHK-Cu CREAM",
    category: "Skin & Beauty",
    oneLiner: "The gold-standard texture refiner, buffered with copper calm.",
    whatItDoes: "Prescription tretinoin accelerates cell turnover for smoother texture, while GHK-Cu cushions irritation and supports repair — so you get results without the angry peel.",
    benefits: [
      "Refines pores and rough texture",
      "Softens sun spots and fine lines over time",
      "Compounded to be kinder than drugstore tret",
    ],
    idealFor: "Texture, tone, and that glass-skin finish",
    clinicianNote: "Pea-sized, nights only, SPF is non-negotiable, gorgeous.",
    priceFrom: "$149",
  },
  {
    id: "kpv",
    name: "KPV",
    category: "Skin & Beauty",
    oneLiner: "The calm-down peptide for red, reactive, stressed skin.",
    whatItDoes: "A tiny fragment known for quieting inflammatory signals. Think less redness, less reactivity — skin that stops overreacting to everything.",
    benefits: [
      "Helps calm redness and flushing",
      "Supports barrier recovery",
      "Lovely for sensitive and acne-prone",
    ],
    idealFor: "Reactive skin that hates everything new",
    clinicianNote: "KPV is our secret weapon when everything else irritates.",
    priceFrom: "$139",
  },
  {
    id: "bpc",
    name: "BPC-157",
    category: "Repair & Recovery",
    oneLiner: "Gut-derived repair signal your body already knows.",
    whatItDoes: "Isolated from a stomach protein, BPC-157 supports connective tissue and gut lining integrity. Clients choose it for nagging joint, tendon, and gut sensitivities.",
    benefits: [
      "Supports faster bounce-back from strains",
      "Gut-friendly for sensitive stomachs",
      "Foundational for recovery stacks",
    ],
    idealFor: "Old injuries that keep whispering",
    clinicianNote: "Repair needs protein, sleep, and patience — BPC is the assistant, not the whole team.",
    priceFrom: "$189",
  },
  {
    id: "tb",
    name: "TB-500",
    category: "Repair & Recovery",
    oneLiner: "Actin-binding peptide that helps wounds and tissues reorganize.",
    whatItDoes: "TB-500 helps cells migrate and lay down organized tissue. Often used for flexibility, range of motion, and post-workout recovery.",
    benefits: [
      "Supports mobility and flexibility",
      "Helps reduce lingering stiffness",
      "Synergizes with BPC-157",
    ],
    idealFor: "Stiff, achy recovery that lingers",
    clinicianNote: "Movement + hydration makes this shine. Don't sit still, gorgeous.",
    priceFrom: "$189",
  },
  {
    id: "wolverine",
    name: "WOLVERINE STACK",
    category: "Repair & Recovery",
    oneLiner: "BPC-157 + TB-500 together — the synergistic repair duo.",
    whatItDoes: "Why choose one repair pathway? BPC focuses on gut and tendon, TB-500 on actin and mobility. Together they cover more ground — our most requested recovery stack.",
    benefits: [
      "Dual-pathway repair support",
      "Favorite for active lifestyles",
      "One protocol, comprehensive coverage",
    ],
    idealFor: "Athletes, lifters, and anyone healing from overuse",
    clinicianNote: "This is our 'do it all' repair stack. Simple, elegant, effective.",
    priceFrom: "$329",
  },
  {
    id: "serm",
    name: "SERMORELIN",
    category: "Hormone & Vitality",
    oneLiner: "Gentle nudge for your natural nighttime growth hormone pulse.",
    whatItDoes: "Sermorelin encourages your pituitary to release its own GH at night — the time you naturally repair. Supports deeper sleep, recovery, and body composition without exogenous hormones.",
    benefits: [
      "Supports more restorative sleep",
      "Helps maintain lean mass while cutting",
      "Natural rhythm, not replacement",
    ],
    idealFor: "Light sleepers noticing slower recovery after 35",
    clinicianNote: "Take at night, away from food. Let your body do what it already knows.",
    priceFrom: "$199",
  },
  {
    id: "ipa",
    name: "IPAMORELIN",
    category: "Hormone & Vitality",
    oneLiner: "Selective GH pulse without the cortisol or hunger spike.",
    whatItDoes: "Ipamorelin is highly selective for GH release — minimal impact on cortisol, prolactin, or ravenous hunger. Clean pulse, clean exit.",
    benefits: [
      "Clean GH signal with low side-effect chatter",
      "Supports recovery and skin thickness",
      "Pairs beautifully with CJC-1295",
    ],
    idealFor: "Clients wanting GH support without stimulation",
    clinicianNote: "This is the polite peptide — it knocks, doesn't barge in.",
    priceFrom: "$199",
  },
  {
    id: "cjc",
    name: "CJC-1295 + IPAMORELIN",
    category: "Hormone & Vitality",
    oneLiner: "Amplitude + frequency — the classic GH stack that works while you sleep.",
    whatItDoes: "CJC-1295 extends the signal (amplitude), Ipamorelin increases the pulses (frequency). Together, they support overnight repair, deeper sleep, and better mornings.",
    benefits: [
      "Most popular duo for sleep + recovery",
      "Supports firmer skin and lean tissue",
      "Nightly ritual, morning payoff",
    ],
    idealFor: "Anyone over 35 feeling the recovery gap",
    clinicianNote: "Our longest-loved vitality stack — simple, study-backed, gorgeous results over time.",
    priceFrom: "$299",
  },
];

export const PEPTIDE_LIBRARY_HERO = {
  eyebrow: "Peptide University",
  headline: "What does each peptide actually do?",
  subhead: "Tap any peptide to learn how it works, who it's for, and what our clinicians say.",
} as const;
