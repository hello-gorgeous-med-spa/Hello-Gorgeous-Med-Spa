import type { KnowledgeEntry } from "../types";

export const IV_THERAPY: readonly KnowledgeEntry[] = [
  {
    id: "iv.iv-therapy-basics",
    topic: "IV therapy — education-first overview",
    category: "iv-therapy",
    explanation:
      "IV therapy is a clinician-guided service that typically involves screening and selecting an appropriate formulation based on safety considerations. Educationally, the focus is on hydration/wellness support, comfort, and clear expectations—not quick-fix promises.",
    whatItHelpsWith: ["Understanding screening and safety framing", "Expectation setting (time, comfort, oversight)"],
    whoItsFor: ["People exploring hydration and wellness support options", "People who want a safety-first approach"],
    whoItsNotFor: ["Anyone seeking individualized medical advice online", "Anyone with urgent symptoms (seek urgent care)"],
    commonQuestions: ["How long does it take?", "Is it safe?", "How do I prepare?"],
    safetyNotes: [
      "No diagnosis or prescribing online.",
      "Screening is required; eligibility depends on health history and clinician evaluation.",
    ],
    escalationTriggers: ["chest pain", "shortness of breath", "fainting", "severe allergic symptoms"],
    relatedTopics: ["safety.general-safety", "expectations.program-based-care"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
] as const;

