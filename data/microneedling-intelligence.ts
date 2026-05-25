/** Hello Gorgeous — Microneedling Intelligence (internal chairside decision support). */

export const MICRONEEDLING_INTELLIGENCE_PATH = "/education/microneedling-intelligence";

export type FitzpatrickType = "I" | "II" | "III" | "IV" | "V" | "VI";

export type SkinUndertone = "cool" | "neutral" | "warm" | "olive";

export type MicroneedlingConcern =
  | "acne_scars"
  | "texture"
  | "pores"
  | "fine_lines"
  | "pigmentation"
  | "laxity"
  | "stretch_marks"
  | "dullness"
  | "oiliness";

export type TreatmentArea =
  | "face"
  | "neck"
  | "decolletage"
  | "hands"
  | "body";

export type ExperienceLevel = "first_time" | "returning" | "maintenance";

export type MicroneedlingTierId = "good" | "better" | "best";

export type DeviceTrack = "classic_pen" | "rf_morpheus8";

export type MicroneedlingIntake = {
  fitzpatrick: FitzpatrickType;
  undertone: SkinUndertone;
  concerns: MicroneedlingConcern[];
  areas: TreatmentArea[];
  experience: ExperienceLevel;
  /** Optional vision-detected notes merged server-side */
  vision_notes?: string[];
};

export type MicroneedlingTier = {
  id: MicroneedlingTierId;
  label: string;
  name: string;
  price: string;
  serum: string;
  serumDetail: string;
  depth: string;
  sessions: string;
  idealFor: string;
};

export type MicroneedlingOffer = {
  id: string;
  title: string;
  rationale: string;
  priceHint?: string;
};

export type MicroneedlingPlan = {
  /** Primary tier recommendation */
  recommended_tier: MicroneedlingTierId;
  tier: MicroneedlingTier;
  /** Device path */
  device_track: DeviceTrack;
  device_rationale: string;
  /** Serum / booster to use during treatment */
  serum_protocol: string;
  depth_guidance: string;
  session_plan: string;
  /** What to say / offer */
  offers: MicroneedlingOffer[];
  /** Chairside watch-fors from Fitz + undertone logic (adapted from pigment cheat sheet) */
  watch_fors: string[];
  /** Pre-correct / adjust intensity */
  intensity_direction: "conservative" | "standard" | "aggressive_ok";
  intensity_note: string;
  /** Contraindication screening reminders */
  screen_before_treating: string[];
  /** Client-facing summary (educational) */
  client_summary: string;
  /** Provider note */
  provider_note: string;
  confidence_message: string;
};

export const MICRONEEDLING_TIERS: Record<MicroneedlingTierId, MicroneedlingTier> = {
  good: {
    id: "good",
    label: "GOOD",
    name: "Classic Microneedling",
    price: "$199/session",
    serum: "Hyaluronic Acid",
    serumDetail: "Deep hydration — plumps, supports barrier recovery post-microchannels",
    depth: "Up to 3mm · texture & maintenance",
    sessions: "4–6 sessions · 4–6 weeks apart",
    idealFor: "First-timers, maintenance, mild texture & pore refinement",
  },
  better: {
    id: "better",
    label: "BETTER",
    name: "PDRN Regeneration",
    price: "$349/session",
    serum: "PDRN (salmon DNA) + AnteAGE Growth Factors",
    serumDetail: "Cellular repair, collagen synthesis, accelerated healing — scar & anti-aging workhorse",
    sessions: "3–4 sessions · 4–6 weeks apart",
    depth: "Precision depth · scar-focused passes",
    idealFor: "Acne scars, moderate aging, barrier repair, visible regeneration",
  },
  best: {
    id: "best",
    label: "BEST",
    name: "Baby Tox Luxe",
    price: "$499/session",
    serum: "Allergan Botox dilute + AnteAGE BioSomes",
    serumDetail: "Micro-dose neuromodulator + stem-cell signaling — glass skin, pore refinement, fine lines",
    sessions: "Every 3–4 months · maintenance cadence",
    depth: "Superficial precision · fine-line zones",
    idealFor: "Fine lines, pore appearance, oil control, event-ready glow",
  },
};

export const CONCERN_LABELS: Record<MicroneedlingConcern, string> = {
  acne_scars: "Acne scars",
  texture: "Uneven texture",
  pores: "Large pores",
  fine_lines: "Fine lines & wrinkles",
  pigmentation: "Hyperpigmentation / tone",
  laxity: "Skin laxity / sagging",
  stretch_marks: "Stretch marks",
  dullness: "Dull / tired skin",
  oiliness: "Oily / congested skin",
};

export const AREA_LABELS: Record<TreatmentArea, string> = {
  face: "Face",
  neck: "Neck",
  decolletage: "Décolletage",
  hands: "Hands",
  body: "Body",
};

export const FITZPATRICK_OPTIONS: { value: FitzpatrickType; label: string; hint: string }[] = [
  { value: "I", label: "Type I — Very fair", hint: "Always burns, never tans" },
  { value: "II", label: "Type II — Fair", hint: "Usually burns, tans minimally" },
  { value: "III", label: "Type III — Medium", hint: "Sometimes burns, tans gradually" },
  { value: "IV", label: "Type IV — Medium-tan", hint: "Rarely burns, tans easily" },
  { value: "V", label: "Type V — Deep", hint: "Very rarely burns, tans deeply" },
  { value: "VI", label: "Type VI — Deepest", hint: "Never burns, deeply pigmented" },
];

export const UNDERTONE_OPTIONS: { value: SkinUndertone; label: string; healShift: string }[] = [
  { value: "cool", label: "Cool / pink", healShift: "Higher post-inflammatory redness visibility — gentle passes" },
  { value: "neutral", label: "Neutral", healShift: "Most predictable response — standard protocols" },
  { value: "warm", label: "Warm / golden", healShift: "Can pull red during heal — monitor PIH on deeper passes" },
  { value: "olive", label: "Olive / green", healShift: "PIH caution — conservative depth, strong SPF education" },
];

/** Skin + undertone → intensity guidance (philosophy from pigment cheat sheet, applied to microneedling). */
export const SKIN_INTENSITY_MATRIX: {
  fitz: FitzpatrickType[];
  undertone: SkinUndertone[];
  direction: MicroneedlingPlan["intensity_direction"];
  note: string;
}[] = [
  {
    fitz: ["I", "II"],
    undertone: ["cool"],
    direction: "conservative",
    note: "Fair + cool: start lighter depth, fewer passes — redness reads strong; build at session 2.",
  },
  {
    fitz: ["I", "II", "III"],
    undertone: ["neutral"],
    direction: "standard",
    note: "Neutral medium skin: predictable collagen response — match tier to concern severity.",
  },
  {
    fitz: ["III", "IV"],
    undertone: ["warm"],
    direction: "standard",
    note: "Warm medium skin: standard depth OK — watch for prolonged erythema in sun-exposed zones.",
  },
  {
    fitz: ["III", "IV"],
    undertone: ["olive"],
    direction: "conservative",
    note: "Olive undertone: PIH risk on aggressive depth — stagger passes, strict SPF, consider PDRN over heavy stacking.",
  },
  {
    fitz: ["V", "VI"],
    undertone: ["warm", "olive"],
    direction: "conservative",
    note: "Deep Fitz V–VI: highest PIH risk — RF Morpheus8 preferred over aggressive pen depth; patch mindset, document photos.",
  },
];

export const ADDON_OFFERS: MicroneedlingOffer[] = [
  {
    id: "prp",
    title: "PRP / PRF boost",
    rationale: "Faster healing, enhanced collagen — strong for scars & hair when applicable",
    priceHint: "+$250/session",
  },
  {
    id: "package-3",
    title: "3-session series package",
    rationale: "Collagen remodeling needs a series — bundle improves compliance & outcomes",
    priceHint: "Quote at consult",
  },
  {
    id: "post-care-kit",
    title: "Post-care recovery kit",
    rationale: "HA recovery balm + SPF 30+ — reduces PIH risk and supports heal",
  },
  {
    id: "morpheus-upgrade",
    title: "Morpheus8 RF upgrade consult",
    rationale: "When laxity or deep scar remodeling exceeds classic pen outcomes",
  },
  {
    id: "home-peptides",
    title: "At-home peptide support",
    rationale: "Extends results between sessions — pair with regenerative menu",
  },
];
