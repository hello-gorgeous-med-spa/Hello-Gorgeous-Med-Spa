/**
 * Fullscript Collections Registry
 * Single source of truth for Peppi supplement guidance.
 * Hello Gorgeous curates these; Peppi references this registry only.
 * No scraping or dynamic Fullscript browsing.
 */

export type FullscriptCollection = {
  id: string;
  title: string;
  supported_goals: string[];
  description: string;
  example_supplements: string[];
  fullscript_url: string;
  peppi_guidance_notes: string;
  priority?: number;
  active: boolean;
};

export const FULLSCRIPT_COLLECTIONS: FullscriptCollection[] = [
  {
    id: "sleep-support",
    title: "Sleep Support",
    supported_goals: ["sleep", "stress", "relaxation", "muscle recovery"],
    description:
      "This collection focuses on nutrients commonly explored to support relaxation, sleep quality, and nighttime recovery.",
    example_supplements: ["Magnesium Glycinate", "L-Theanine", "Glycine"],
    fullscript_url: "https://us.fullscript.com/welcome/dglazier/collections/sleep-support",
    peppi_guidance_notes:
      "Focus on winding down, calming support, and non-habit forming language. Avoid medical sleep claims.",
    priority: 1,
    active: true,
  },
  {
    id: "gut-health",
    title: "Gut Health",
    supported_goals: ["digestion", "bloating", "gut health", "immunity"],
    description:
      "This collection includes supplements often used to support digestive balance and overall gut health.",
    example_supplements: ["Probiotics", "Digestive Enzymes", "L-Glutamine"],
    fullscript_url: "https://us.fullscript.com/welcome/dglazier/collections/gut-health",
    peppi_guidance_notes:
      "Use supportive language only. No diagnosis of IBS, SIBO, etc.",
    priority: 2,
    active: true,
  },
  {
    id: "energy-metabolism",
    title: "Energy & Metabolism",
    supported_goals: ["energy", "fatigue", "metabolism"],
    description:
      "A collection curated for individuals looking to support daily energy and metabolic wellness.",
    example_supplements: ["B-Complex", "CoQ10", "Adaptogens"],
    fullscript_url: "https://us.fullscript.com/welcome/dglazier/collections/energy-metabolism",
    peppi_guidance_notes:
      "Avoid stimulant claims; emphasize daily support and wellness.",
    priority: 3,
    active: true,
  },
  {
    id: "skin-hair-nails",
    title: "Skin, Hair & Nails",
    supported_goals: ["skin", "hair", "nails", "collagen", "beauty"],
    description:
      "Supplements often used to support skin, hair, and nail wellness from within.",
    example_supplements: ["Collagen", "Biotin", "Vitamin C", "Hyaluronic Acid"],
    fullscript_url: "https://us.fullscript.com/welcome/dglazier/collections/skin-hair-nails",
    peppi_guidance_notes:
      "Educational only. No claims about treating conditions; focus on general support.",
    priority: 4,
    active: true,
  },
  {
    id: "immunity",
    title: "Immunity Support",
    supported_goals: ["immunity", "immune support", "wellness"],
    description:
      "A collection for nutrients commonly explored to support a healthy immune response.",
    example_supplements: ["Vitamin D3", "Vitamin C", "Zinc", "Elderberry"],
    fullscript_url: "https://us.fullscript.com/welcome/dglazier/collections/immunity",
    peppi_guidance_notes:
      "Supportive language only. No treatment or prevention claims.",
    priority: 5,
    active: true,
  },
  {
    id: "stress-adaptogens",
    title: "Stress & Adaptogens",
    supported_goals: ["stress", "adaptogens", "calm", "balance"],
    description:
      "Supplements often used to support the body's response to stress and daily balance.",
    example_supplements: ["Ashwagandha", "Rhodiola", "Holy Basil", "L-Theanine"],
    fullscript_url: "https://us.fullscript.com/welcome/dglazier/collections/stress-adaptogens",
    peppi_guidance_notes:
      "Avoid diagnostic language. Emphasize general wellness and coping support.",
    priority: 6,
    active: true,
  },
];

/** Active collections only, sorted by priority. */
export function getActiveCollections(): FullscriptCollection[] {
  return FULLSCRIPT_COLLECTIONS.filter((c) => c.active).sort(
    (a, b) => (a.priority ?? 99) - (b.priority ?? 99)
  );
}

/** Find collection by id. */
export function getCollectionById(id: string): FullscriptCollection | undefined {
  return FULLSCRIPT_COLLECTIONS.find((c) => c.id === id && c.active);
}

/** Match user goal keywords to 1–2 best collections. */
export function matchCollectionsByGoals(goals: string[]): FullscriptCollection[] {
  const normalized = goals.map((g) => g.toLowerCase().trim());
  const scored = getActiveCollections().map((c) => {
    let score = 0;
    for (const goal of c.supported_goals) {
      if (normalized.some((n) => n.includes(goal) || goal.includes(n))) score++;
    }
    return { collection: c, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((s) => s.collection);
}
