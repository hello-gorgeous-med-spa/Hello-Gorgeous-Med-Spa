/** Hello Gorgeous — internal PMU digital practice studio (mapping, strokes, shading). */

export const PMU_PRACTICE_PATH = "/education/pmu-practice";

export type PmuBrushCategory = "mapping" | "outline" | "strokes" | "shading" | "tools";

export type PmuBrushId =
  | "mapping-solid"
  | "mapping-sketch"
  | "mapping-dotted"
  | "outline"
  | "microblading"
  | "nano"
  | "nano-fine"
  | "shading-whip"
  | "shading-pendulum"
  | "eraser";

export type PmuBrush = {
  id: PmuBrushId;
  category: PmuBrushCategory;
  label: string;
  description: string;
  size: number;
  opacity: number;
};

export type PmuPigment = {
  id: string;
  name: string;
  hex: string;
  use: string;
};

export type PmuTemplateId = "front-face" | "brow-closeup" | "blank-canvas";

export type PmuTemplate = {
  id: PmuTemplateId;
  label: string;
  description: string;
};

export type PmuWorkflowStep = {
  step: number;
  title: string;
  hint: string;
  brushIds: PmuBrushId[];
};

export const PMU_BRUSHES: PmuBrush[] = [
  {
    id: "mapping-solid",
    category: "mapping",
    label: "Mapping [solid]",
    description: "Clean geometric guide lines for head, arch, and tail.",
    size: 2.5,
    opacity: 0.95,
  },
  {
    id: "mapping-sketch",
    category: "mapping",
    label: "Mapping [sketch]",
    description: "Soft pencil-like mapping for shape exploration.",
    size: 2,
    opacity: 0.55,
  },
  {
    id: "mapping-dotted",
    category: "mapping",
    label: "Mapping [dotted]",
    description: "Dashed symmetry guides — easy to erase mentally before strokes.",
    size: 2,
    opacity: 0.85,
  },
  {
    id: "outline",
    category: "outline",
    label: "Outline",
    description: "Crisp brow boundary before filling hair strokes.",
    size: 1.2,
    opacity: 1,
  },
  {
    id: "microblading",
    category: "strokes",
    label: "Microblading",
    description: "Curved hair strokes — follow spine direction, stagger overlaps.",
    size: 1.4,
    opacity: 0.92,
  },
  {
    id: "nano",
    category: "strokes",
    label: "Nano",
    description: "Finer machine-style strokes for dense fill.",
    size: 0.9,
    opacity: 0.88,
  },
  {
    id: "nano-fine",
    category: "strokes",
    label: "Nano [fine]",
    description: "Ultra-fine detail strokes for tail and sparse zones.",
    size: 0.55,
    opacity: 0.82,
  },
  {
    id: "shading-whip",
    category: "shading",
    label: "1RL [whip]",
    description: "Stippled whip-shading — build density with short flicks.",
    size: 1.1,
    opacity: 0.35,
  },
  {
    id: "shading-pendulum",
    category: "shading",
    label: "Shading [pendulum]",
    description: "Soft powder effect — wider pendulum motion, lighter passes.",
    size: 2.4,
    opacity: 0.18,
  },
  {
    id: "eraser",
    category: "tools",
    label: "Clean-up eraser",
    description: "Remove mapping lines or strokes outside the design.",
    size: 14,
    opacity: 1,
  },
];

export const PMU_PIGMENTS: PmuPigment[] = [
  { id: "darkest-brown", name: "Darkest Brown", hex: "#2a1a0e", use: "Deep cool brunette, Fitz III–IV" },
  { id: "espresso", name: "Espresso", hex: "#3d2914", use: "Rich brown, most common starting point" },
  { id: "brunette", name: "Brunette", hex: "#5c4033", use: "Medium warm brown, Fitz II–III" },
  { id: "taupe", name: "Taupe", hex: "#8b7355", use: "Ash neutralizer, mature or gray hair" },
  { id: "fudge", name: "Fudge", hex: "#6b4423", use: "Warm chocolate, red undertone clients" },
  { id: "forest-brown", name: "Forest Brown", hex: "#4a5d3a", use: "Olive / green undertone balance" },
  { id: "burnt-sienna", name: "Burnt Sienna", hex: "#8b4513", use: "Warm modifier — use sparingly" },
  { id: "golden-sunrise", name: "Golden Sunrise", hex: "#c4956a", use: "Light warm highlight modifier" },
];

export const PMU_TEMPLATES: PmuTemplate[] = [
  {
    id: "front-face",
    label: "Front face model",
    description: "Full-face mapping practice — head, arch, tail geometry.",
  },
  {
    id: "brow-closeup",
    label: "Brow close-up",
    description: "Zoomed brow zone for stroke density and spine drills.",
  },
  {
    id: "blank-canvas",
    label: "Blank worksheet",
    description: "Empty grid for freehand shape and stroke repetition.",
  },
];

export const PMU_WORKFLOW: PmuWorkflowStep[] = [
  {
    step: 1,
    title: "Setup",
    hint: "Pick a template, choose mapping solid, enable symmetry guides.",
    brushIds: ["mapping-solid", "mapping-dotted"],
  },
  {
    step: 2,
    title: "Mapping",
    hint: "Mark head, arch, tail. Outline the brow body before strokes.",
    brushIds: ["mapping-solid", "mapping-sketch", "outline"],
  },
  {
    step: 3,
    title: "Strokes",
    hint: "Low → medium → high spine. Stagger overlaps; never parallel rails.",
    brushIds: ["microblading", "nano", "nano-fine"],
  },
  {
    step: 4,
    title: "Shading / combo",
    hint: "Add powder density in sparse zones or build a combo brow.",
    brushIds: ["shading-whip", "shading-pendulum"],
  },
  {
    step: 5,
    title: "Model review",
    hint: "Toggle guides off, check symmetry, export your practice sheet.",
    brushIds: ["eraser"],
  },
];

export const PMU_BRUSH_BY_ID = Object.fromEntries(PMU_BRUSHES.map((b) => [b.id, b])) as Record<
  PmuBrushId,
  PmuBrush
>;
