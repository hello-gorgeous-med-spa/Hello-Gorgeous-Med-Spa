import type { KnowledgeEntry } from "../types";

export const HAIR_RESTORATION: readonly KnowledgeEntry[] = [
  {
    id: "hair.hair-restoration-overview",
    topic: "Hair restoration — education-first overview",
    category: "hair-restoration",
    explanation:
      "Hair goals can have many causes. Educationally, the safest first step is an evaluation to understand history, timelines, and contributing factors. Online content can explain concepts and what questions to ask, but it can’t diagnose.",
    whatItHelpsWith: ["Knowing what to ask", "Understanding that evaluation matters", "Reducing confusion before booking"],
    whoItsFor: ["People exploring hair goals who want education-first guidance"],
    whoItsNotFor: ["Anyone seeking diagnosis or medication advice online"],
    commonQuestions: ["What causes shedding?", "What should I ask in a consult?", "How long do results take (in general)?"],
    safetyNotes: ["No diagnosis online.", "Seek medical care for severe or sudden symptoms."],
    escalationTriggers: ["sudden hair loss", "scalp infection", "fever", "severe symptoms"],
    relatedTopics: ["safety.general-safety", "expectations.gradual-skin-timelines"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
] as const;

