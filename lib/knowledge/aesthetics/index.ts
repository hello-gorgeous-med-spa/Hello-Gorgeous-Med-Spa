import type { KnowledgeEntry } from "../types";

export const AESTHETICS: readonly KnowledgeEntry[] = [
  {
    id: "aesthetics.facial-balance",
    topic: "Facial balance — what it means (education)",
    category: "aesthetics",
    explanation:
      "Facial balance is an educational way to talk about proportions and harmony. The intent is usually subtle refinement—supporting how features relate to each other—rather than ‘bigger’ or ‘more.’",
    whatItHelpsWith: ["Understanding the goal of natural-looking aesthetics", "Reducing fear of ‘overdone’ outcomes (education)"],
    whoItsFor: ["People who want subtle, proportion-focused changes", "People unsure what to ask for"],
    whoItsNotFor: ["Anyone seeking a guaranteed outcome or a specific injection plan online"],
    commonQuestions: ["How do you keep results natural?", "What does ‘balancing’ mean for lips/cheeks/jaw?"],
    safetyNotes: ["Planning is individualized and requires an in-person consult.", "No promises or guarantees online."],
    escalationTriggers: ["complication", "infection", "vision", "severe pain"],
    relatedTopics: ["injectables.filler-basics", "expectations.filler-timeline", "safety.general-safety"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
] as const;

