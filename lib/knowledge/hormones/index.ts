import type { KnowledgeEntry } from "../types";

export const HORMONES: readonly KnowledgeEntry[] = [
  {
    id: "hormones.bhrt-basics",
    topic: "Hormone optimization (BHRT) — lab-guided, safety-first overview",
    category: "hormones",
    explanation:
      "Educationally, hormone optimization starts with symptoms + history, then lab evaluation, then a clinician-led plan with monitoring. The safest framing is evaluation-driven and conservative—no guessing and no one-size-fits-all approach.",
    whatItHelpsWith: ["Understanding evaluation and monitoring", "Setting expectations before booking", "Reducing confusion and hype"],
    whoItsFor: [
      "People exploring hormone education and what a consult includes",
      "People who want a clinician-led, lab-guided approach",
    ],
    whoItsNotFor: [
      "Anyone seeking diagnosis or medication changes online",
      "Anyone seeking prescribing or dosing online",
    ],
    commonQuestions: ["Do I need labs?", "How does monitoring work?", "What does ‘protocol’ mean (high-level)?"],
    safetyNotes: [
      "No diagnosis, no prescribing, no individualized medical advice online.",
      "Eligibility and treatment decisions require in-person evaluation and appropriate monitoring.",
    ],
    escalationTriggers: ["pregnant", "breastfeeding", "blood clot", "cancer history", "severe symptoms", "chest pain"],
    relatedTopics: ["expectations.program-based-care", "safety.general-safety"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
  {
    id: "hormones.pellet-protocols",
    topic: "Pellet therapy — why protocols and follow-up matter (education)",
    category: "hormones",
    explanation:
      "Pellet therapy is sometimes discussed as a longer-acting delivery method. Educationally, the key point is that protocols, informed consent, and follow-up monitoring exist to protect safety. Whether it’s appropriate is determined in consultation.",
    whatItHelpsWith: ["Expectation-setting about protocols", "Understanding why follow-up exists", "Reducing oversimplification"],
    whoItsFor: ["People considering pellet therapy education", "People who want to understand safety framing"],
    whoItsNotFor: ["Anyone seeking approval or ‘am I a candidate?’ online"],
    commonQuestions: ["Do pellets mean fewer visits?", "What does monitoring mean?", "Is it right for me?"],
    safetyNotes: ["Individual recommendations require clinician evaluation.", "No dosing or prescribing online."],
    escalationTriggers: ["bleeding", "infection", "severe pain", "pregnant", "breastfeeding"],
    relatedTopics: ["hormones.bhrt-basics", "safety.general-safety"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
  {
    id: "hormones.trt-basics",
    topic: "TRT — evaluation, labs, and monitoring (education)",
    category: "hormones",
    explanation:
      "Educationally, TRT discussions are anchored in symptoms, lab evaluation, and ongoing monitoring. The goal is safety-first decision-making and appropriate follow-up. We don’t provide clearance, dosing, or prescribing online.",
    whatItHelpsWith: ["Understanding the consult process", "Knowing what questions to ask", "Setting expectations about monitoring"],
    whoItsFor: ["People exploring TRT education", "People who want a clinical overview"],
    whoItsNotFor: ["Anyone seeking dosing, protocol, or approval online"],
    commonQuestions: ["Do I need labs?", "How often are follow-ups?", "What safety considerations matter?"],
    safetyNotes: ["No diagnosis/prescribing online.", "Eligibility is individualized and requires clinician evaluation."],
    escalationTriggers: ["chest pain", "shortness of breath", "stroke", "severe headache", "vision loss"],
    relatedTopics: ["hormones.bhrt-basics", "safety.general-safety"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
] as const;

