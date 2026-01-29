import type { KnowledgeEntry } from "../types";

export const INJECTABLES: readonly KnowledgeEntry[] = [
  {
    id: "injectables.botox-basics",
    topic: "Botox / Dysport / Jeuveau (neuromodulators) — basics",
    category: "injectables",
    explanation:
      "Neuromodulators are prescription medications used in-office to temporarily relax specific facial muscles. Educationally, they’re often explored to soften expression lines while keeping you looking like you. Technique, anatomy, and expectation setting matter more than brand hype.",
    whatItHelpsWith: [
      "Softening expression lines (education)",
      "A refreshed look without changing identity (education)",
      "Building a maintenance mindset (education)",
    ],
    whoItsFor: [
      "People who want subtle, natural-looking softening of expression lines",
      "People who prefer a consult-first, safety-first approach",
      "People who want clear expectations and gradual change",
    ],
    whoItsNotFor: [
      "Anyone seeking individualized dosing or unit recommendations online",
      "Anyone seeking medical clearance online (requires consult)",
      "Anyone with urgent symptoms (seek urgent/emergency care)",
    ],
    commonQuestions: [
      "Botox vs Dysport vs Jeuveau — what’s the difference?",
      "When do results kick in?",
      "How long do results last?",
      "Will I look frozen?",
    ],
    safetyNotes: [
      "This is educational only—no diagnosis, prescriptions, or individualized medical advice.",
      "Eligibility depends on medical history, medications, and goals—confirmed in consult.",
      "If severe symptoms occur (breathing difficulty, vision changes, severe swelling), seek urgent/emergency care.",
    ],
    escalationTriggers: [
      "pregnant",
      "breastfeeding",
      "neuromuscular",
      "blood thinner",
      "allergic reaction",
      "trouble breathing",
      "vision changes",
      "severe headache",
    ],
    relatedTopics: ["injectables.botox-vs-dysport-vs-jeuveau", "expectations.neuromodulator-timeline", "safety.general-safety"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
  {
    id: "injectables.botox-vs-dysport-vs-jeuveau",
    topic: "Botox vs Dysport vs Jeuveau — how they differ (high-level)",
    category: "comparisons",
    explanation:
      "All three are neuromodulators used for similar goals. Differences are often discussed at a high level as formulation/brand differences and how an individual responds. Educationally, what matters most is assessment, technique, and expectation setting—not chasing a brand.",
    whatItHelpsWith: ["Understanding categories without over-focusing on brand", "Setting expectations before booking"],
    whoItsFor: ["People comparing neuromodulator options", "People who want a calm, non-sales explanation"],
    whoItsNotFor: ["Anyone seeking a recommendation for their face online", "Anyone seeking dosing/units online"],
    commonQuestions: ["Which is best?", "Do they last different lengths?", "Do they kick in faster?"],
    safetyNotes: [
      "We don’t recommend a specific product for you online; selection is made in consult.",
      "No dosing/units/protocols here.",
    ],
    escalationTriggers: ["complication", "allergy", "pregnant", "breastfeeding", "vision"],
    relatedTopics: ["injectables.botox-basics", "expectations.neuromodulator-timeline", "safety.general-safety"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
  {
    id: "injectables.filler-basics",
    topic: "Dermal fillers — basics",
    category: "injectables",
    explanation:
      "Dermal fillers are in-office injectable products often used to support facial balance—restoring volume, refining contour, or enhancing features. Education-first framing focuses on harmony and proportion, not ‘more.’ Early swelling can distort the look; final assessment happens after settling.",
    whatItHelpsWith: ["Facial balance concepts (education)", "Volume/contour support (education)", "Expectation setting about swelling and settling"],
    whoItsFor: ["People who want subtle enhancement and facial harmony", "People who prefer consult-first planning"],
    whoItsNotFor: ["Anyone seeking a specific product/volume plan online", "Anyone with urgent post-procedure symptoms (seek care)"],
    commonQuestions: ["How long does swelling last?", "Can it look natural?", "How long do fillers last?", "Can filler be dissolved?"],
    safetyNotes: [
      "This is educational only. Individualized planning requires in-person assessment.",
      "Certain symptoms after filler can be urgent (vision changes, severe pain, skin color changes). Seek urgent care and contact your provider.",
    ],
    escalationTriggers: ["vision", "skin blanching", "dusky", "severe pain", "trouble breathing", "hives", "fever"],
    relatedTopics: ["aftercare.filler-swelling-bruising", "safety.post-treatment-red-flags", "expectations.filler-timeline"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
] as const;

