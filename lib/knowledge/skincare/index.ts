import type { KnowledgeEntry } from "../types";

export const SKINCARE: readonly KnowledgeEntry[] = [
  {
    id: "skincare.skin-barrier",
    topic: "Skin barrier — why it matters (education)",
    category: "skincare",
    explanation:
      "The skin barrier is your skin’s protective function. Educationally, many ‘sensitivity’ and ‘irritation’ issues are about barrier disruption. Consistency, gentle routines, and avoiding over-treatment can support comfort and outcomes.",
    whatItHelpsWith: ["Reducing irritation (education)", "Understanding why product selection matters", "Setting expectations for gradual improvement"],
    whoItsFor: ["People with sensitivity, dryness, or irritation concerns", "People starting a new skincare routine"],
    whoItsNotFor: ["Anyone needing diagnosis of a rash or infection online"],
    commonQuestions: ["Why does my skin sting with products?", "How do I avoid overdoing actives?", "What should I ask in consult?"],
    safetyNotes: ["We can’t diagnose skin conditions online.", "Seek medical care for severe/worsening symptoms or signs of infection."],
    escalationTriggers: ["severe swelling", "hives", "trouble breathing", "fever", "pus", "worsening spreading redness"],
    relatedTopics: ["skincare.microneedling-basics", "skincare.chemical-peel-basics", "aftercare.general-aftercare"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
  {
    id: "skincare.microneedling-basics",
    topic: "Microneedling (and RF microneedling) — basics",
    category: "skincare",
    explanation:
      "Microneedling is a procedure that creates controlled micro-injuries to support skin renewal. RF microneedling adds energy that can support collagen remodeling. Educationally, results are gradual and often discussed as part of a series, not an instant change.",
    whatItHelpsWith: ["Texture and pores (education)", "Skin quality over time (education)", "Expectation-setting about gradual change"],
    whoItsFor: ["People exploring skin texture/tone support", "People who want education-first timelines"],
    whoItsNotFor: ["Anyone seeking a guarantee of results", "Anyone needing individualized protocol selection online"],
    commonQuestions: ["How much downtime is typical?", "How many sessions do people do?", "When do results show?"],
    safetyNotes: ["Candidacy varies by skin type and history; consult required.", "Infection signs or severe symptoms require medical attention."],
    escalationTriggers: ["fever", "pus", "worsening redness spreading", "severe pain"],
    relatedTopics: ["aftercare.microneedling-aftercare", "expectations.gradual-skin-timelines"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
  {
    id: "skincare.chemical-peel-basics",
    topic: "Chemical peels — basics",
    category: "skincare",
    explanation:
      "A chemical peel is a controlled exfoliation that supports skin tone and texture goals. Educationally, peel depth matters: some peels have little visible peeling; others have more downtime. Prep and aftercare support safety and comfort.",
    whatItHelpsWith: ["Tone/texture goals (education)", "Glow/clarity (education)", "Expectation setting about peeling and downtime"],
    whoItsFor: ["People exploring skin refresh options", "People who want education-first expectations"],
    whoItsNotFor: ["Anyone seeking a ‘best peel for me’ selection online"],
    commonQuestions: ["Will I peel?", "How do I prepare?", "How often can I do it?"],
    safetyNotes: ["Individual recommendations require consult.", "Severe reactions or infection signs require medical care."],
    escalationTriggers: ["severe swelling", "hives", "trouble breathing", "fever", "pus"],
    relatedTopics: ["aftercare.general-aftercare", "skincare.skin-barrier"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
] as const;

