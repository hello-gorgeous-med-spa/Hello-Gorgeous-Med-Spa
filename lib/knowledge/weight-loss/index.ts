import type { KnowledgeEntry } from "../types";

export const WEIGHT_LOSS: readonly KnowledgeEntry[] = [
  {
    id: "weight-loss.metabolic-care-basics",
    topic: "Weight loss & metabolic care — education-first overview",
    category: "weight-loss",
    explanation:
      "Educationally, metabolic/weight care is about safe screening, realistic expectations, and ongoing monitoring. Some people explore medication-supported plans; individualized decisions require a medical consultation and evaluation.",
    whatItHelpsWith: [
      "Understanding what a consult typically covers (education)",
      "Setting expectations for screening and monitoring",
      "Reducing confusion before booking",
    ],
    whoItsFor: [
      "People looking for education on clinician-guided weight care",
      "People who want safety-first, non-judgmental guidance",
    ],
    whoItsNotFor: [
      "Anyone seeking prescriptions online",
      "Anyone seeking individualized eligibility decisions online",
      "Anyone with urgent symptoms (seek urgent care)",
    ],
    commonQuestions: [
      "What happens in a weight loss consultation?",
      "Do I need labs?",
      "What questions should I ask?",
      "How do GLP‑1 medications work (high-level)?",
    ],
    safetyNotes: [
      "No prescribing, dosing, or protocols online.",
      "Eligibility depends on history, medications, and clinician evaluation.",
      "Seek urgent care for severe symptoms.",
    ],
    escalationTriggers: ["chest pain", "shortness of breath", "severe abdominal pain", "pregnant", "breastfeeding"],
    relatedTopics: ["comparisons.glp1-sema-vs-tirz-vs-reta", "safety.general-safety", "expectations.program-based-care"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
  {
    id: "comparisons.glp1-sema-vs-tirz-vs-reta",
    topic: "Semaglutide vs Tirzepatide vs Retatrutide — education-only comparison",
    category: "comparisons",
    explanation:
      "These names refer to medications people discuss in metabolic/weight contexts. Educationally, the most important differentiators are safety screening, monitoring, and whether something is appropriate and available in your clinical context. We do not choose or recommend a medication online.",
    whatItHelpsWith: ["Understanding that selection is clinical", "Knowing what questions to ask in consult"],
    whoItsFor: ["People trying to understand terms they’ve heard", "People who want a calm, non-sales overview"],
    whoItsNotFor: ["Anyone seeking a prescription, dosing, or approval online"],
    commonQuestions: ["Which is better?", "Is one stronger?", "Is retatrutide available?"],
    safetyNotes: [
      "No prescribing or dosing online.",
      "Some options may be investigational or not appropriate for everyone.",
      "Clinician evaluation is required.",
    ],
    escalationTriggers: ["pregnant", "breastfeeding", "severe symptoms", "allergic reaction"],
    relatedTopics: ["weight-loss.metabolic-care-basics", "safety.general-safety"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
] as const;

