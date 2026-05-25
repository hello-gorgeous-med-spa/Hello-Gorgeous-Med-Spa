/** Hello Gorgeous — Brow Mapping Intelligence (internal PMU chairside). */

export const BROW_MAPPING_PATH = "/admin/tools/brow-mapping";
export const BROW_INTAKE_PATH = "/forms/brow-intake";

export type FitzpatrickType = "I" | "II" | "III" | "IV" | "V" | "VI";
export type SkinUndertone = "cool" | "neutral" | "warm" | "olive";
export type PigmentDirection = "warm" | "neutral" | "cool-lean" | "olive-ash";
export type BrowTechnique = "microblading" | "nano" | "powder" | "combo";
export type BrowStylePreviewId = "mapping-only" | "individual-strokes" | "ombre" | "hybrid";

export type BrowShapeId =
  | "arch"
  | "soft-arch"
  | "high-arch"
  | "round"
  | "round-arch"
  | "upward"
  | "straight";

export type TinaDaviesPigmentId =
  | "blonde"
  | "soft-brown"
  | "medium-brown"
  | "bombshell"
  | "dark-brown"
  | "espresso"
  | "ash-brown"
  | "warm-brown"
  | "golden-sunrise";

export type TinaDaviesPigment = {
  id: TinaDaviesPigmentId;
  name: string;
  line: string;
  hex: string;
  use: string;
};

export type BrowMappingPoint = { x: number; y: number };

export type BrowSideMap = {
  head: BrowMappingPoint;
  arch: BrowMappingPoint;
  tail: BrowMappingPoint;
};

export type BrowMappingGeometry = {
  midlineTop: BrowMappingPoint;
  midlineBottom: BrowMappingPoint;
  baselineY: number;
  left: BrowSideMap;
  right: BrowSideMap;
};

export type AsymmetryFinding = {
  id: string;
  severity: "mild" | "moderate" | "note";
  title: string;
  detail: string;
  adjust: string;
};

export type PigmentRecommendation = {
  direction: PigmentDirection;
  directionLabel: string;
  startingFamily: string;
  modifiers: string[];
  healWatch: string;
  brandNotes: string;
};

export type BrowMappingPlan = {
  geometry: BrowMappingGeometry;
  asymmetry: AsymmetryFinding[];
  pigment: PigmentRecommendation;
  technique: BrowTechnique;
  technique_rationale: string;
  shape_guidance: string;
  offers: { title: string; detail: string }[];
  client_script: string;
  provider_checklist: string[];
  confidence_message: string;
};

export type BrowMappingIntake = {
  fitzpatrick: FitzpatrickType;
  undertone: SkinUndertone;
  naturalHair: "blonde" | "light_brown" | "medium_brown" | "dark_brown" | "black";
  oilySkin: boolean;
  existingPmu: boolean;
  goalShape: "soft" | "structured" | "fluffy" | "lifted";
  stylePreview: BrowStylePreviewId;
  browShape: BrowShapeId;
  tinaPigmentId: TinaDaviesPigmentId;
};

export const FITZPATRICK_OPTIONS: { value: FitzpatrickType; label: string }[] = [
  { value: "I", label: "Type I — Very fair" },
  { value: "II", label: "Type II — Fair" },
  { value: "III", label: "Type III — Medium" },
  { value: "IV", label: "Type IV — Medium-tan" },
  { value: "V", label: "Type V — Deep" },
  { value: "VI", label: "Type VI — Deepest" },
];

export const UNDERTONE_OPTIONS: { value: SkinUndertone; label: string }[] = [
  { value: "cool", label: "Cool / pink" },
  { value: "neutral", label: "Neutral" },
  { value: "warm", label: "Warm / golden" },
  { value: "olive", label: "Olive / green" },
];

export const HAIR_OPTIONS: { value: BrowMappingIntake["naturalHair"]; label: string }[] = [
  { value: "blonde", label: "Blonde / light" },
  { value: "light_brown", label: "Light brown" },
  { value: "medium_brown", label: "Medium brunette" },
  { value: "dark_brown", label: "Dark brown" },
  { value: "black", label: "Black" },
];

export const GOAL_OPTIONS: { value: BrowMappingIntake["goalShape"]; label: string }[] = [
  { value: "soft", label: "Soft & natural" },
  { value: "structured", label: "Structured / defined" },
  { value: "fluffy", label: "Fluffy / full" },
  { value: "lifted", label: "Lifted arch" },
];

export const BROW_STYLE_PREVIEWS: {
  id: BrowStylePreviewId;
  label: string;
  description: string;
  technique: BrowTechnique;
}[] = [
  {
    id: "mapping-only",
    label: "Mapping only",
    description: "Guides only — head, arch, tail lines",
    technique: "microblading",
  },
  {
    id: "individual-strokes",
    label: "Individual strokes",
    description: "Hair-stroke microblading / nano inside the mapped shape",
    technique: "microblading",
  },
  {
    id: "ombre",
    label: "Ombre / powder",
    description: "Soft powder gradient — light head, deeper tail",
    technique: "powder",
  },
  {
    id: "hybrid",
    label: "Hybrid / combo",
    description: "Strokes through body + powder in tail & sparse zones",
    technique: "combo",
  },
];

export const PIGMENT_DIRECTION_LABELS: Record<PigmentDirection, string> = {
  warm: "Warm it",
  neutral: "Neutral it",
  "cool-lean": "Cool-lean",
  "olive-ash": "Olive / ash modifier",
};

/** Tina Davies I ❤️ INK — chairside preview swatches (verify names with supplier). */
export const TINA_DAVIES_PIGMENTS: TinaDaviesPigment[] = [
  { id: "blonde", name: "Blonde", line: "I ❤️ INK", hex: "#b8956a", use: "Fair · light hair · build at touch-up" },
  { id: "soft-brown", name: "Soft Brown", line: "I ❤️ INK", hex: "#9a7b5a", use: "Fair–medium · soft natural heal" },
  { id: "medium-brown", name: "Medium Brown", line: "I ❤️ INK", hex: "#6b4f3a", use: "HG workhorse · medium brunette" },
  { id: "bombshell", name: "Bombshell", line: "I ❤️ INK", hex: "#5c4033", use: "Light–medium brunette · neutral" },
  { id: "dark-brown", name: "Dark Brown", line: "I ❤️ INK", hex: "#3d2914", use: "Deep brunette · avoid jet" },
  { id: "espresso", name: "Espresso", line: "I ❤️ INK", hex: "#2e1f14", use: "Rich cool-brown base" },
  { id: "ash-brown", name: "Ash Brown", line: "I ❤️ INK", hex: "#5a5348", use: "Olive/warm fade counter · modifier" },
  { id: "warm-brown", name: "Warm Brown", line: "I ❤️ INK", hex: "#7a5230", use: "Fair cool skin · prevents gray heal" },
  { id: "golden-sunrise", name: "Golden Sunrise", line: "Modifier", hex: "#c4956a", use: "Warm modifier — use sparingly" },
];

export const BROW_SHAPES: { id: BrowShapeId; label: string; hint: string }[] = [
  { id: "arch", label: "Arch", hint: "Classic peak on nostril–pupil line" },
  { id: "soft-arch", label: "Soft Arch", hint: "Gentle peak — soft & natural" },
  { id: "high-arch", label: "High Arch", hint: "Dramatic lift at arch point" },
  { id: "round", label: "Round", hint: "Soft curve · minimal angle" },
  { id: "round-arch", label: "Round Arch", hint: "Curved body with defined peak" },
  { id: "upward", label: "Upward", hint: "Tail lifts — open eye effect" },
  { id: "straight", label: "Straight", hint: "Flat baseline · Korean / editorial" },
];

export const TINA_PIGMENT_BY_ID = Object.fromEntries(TINA_DAVIES_PIGMENTS.map((p) => [p.id, p])) as Record<
  TinaDaviesPigmentId,
  TinaDaviesPigment
>;
