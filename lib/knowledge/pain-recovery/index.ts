import type { KnowledgeEntry } from "../types";

export const PAIN_RECOVERY: readonly KnowledgeEntry[] = [
  {
    id: "pain-recovery.prp-joints-basics",
    topic: "PRP joint injections — education-first overview",
    category: "pain-recovery",
    explanation:
      "PRP joint injections are discussed as a clinician-led regenerative option in certain contexts. Educationally, the key is that joint pain requires medical evaluation; online content can’t diagnose or determine appropriateness.",
    whatItHelpsWith: ["Understanding that evaluation is required", "Knowing what questions to ask in a consult"],
    whoItsFor: ["People exploring education about PRP joint options"],
    whoItsNotFor: ["Anyone seeking diagnosis or treatment advice online", "Anyone with urgent symptoms—seek care"],
    commonQuestions: ["Is PRP right for my joint pain?", "What happens in a consult?", "How is safety handled?"],
    safetyNotes: ["No diagnosis online.", "Appropriateness requires medical evaluation."],
    escalationTriggers: ["severe pain", "fever", "redness spreading", "loss of function", "chest pain", "shortness of breath"],
    relatedTopics: ["safety.general-safety", "expectations.program-based-care"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
] as const;

