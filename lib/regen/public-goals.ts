/**
 * Public tryregenrx "choose your program" goals.
 * Outcome cards only — no WADA peptide aisle. Legacy query params map here
 * so Stripe's old /start?goal=peptides URL lands on Energy & longevity.
 */

export const REGEN_ENERGY_GOAL = "energy" as const;

const LEGACY_GOAL_TO_PUBLIC: Record<string, string> = {
  peptides: REGEN_ENERGY_GOAL,
  bundles: REGEN_ENERGY_GOAL,
  vitamins: REGEN_ENERGY_GOAL,
  longevity: REGEN_ENERGY_GOAL,
  wellness: REGEN_ENERGY_GOAL,
};

const PROGRAM_TO_GOAL: Record<string, string> = {
  semaglutide: "weight-loss",
  tirzepatide: "weight-loss",
  ed: "sexual-health",
  "libido-women": "sexual-health",
  "hrt-women": "hormones",
  "hrt-men": "hormones",
  nad: REGEN_ENERGY_GOAL,
  "nad-injection": REGEN_ENERGY_GOAL,
  b12: REGEN_ENERGY_GOAL,
  biotin: REGEN_ENERGY_GOAL,
  glutathione: REGEN_ENERGY_GOAL,
  radiance: REGEN_ENERGY_GOAL,
};

export function resolveRegenStartGoal(input: {
  goal?: string | null;
  program?: string | null;
}): string {
  const raw = (input.goal || "").trim();
  if (raw) return LEGACY_GOAL_TO_PUBLIC[raw] || raw;
  const program = input.program || "";
  return PROGRAM_TO_GOAL[program] || "";
}
