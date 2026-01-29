import type { KnowledgeEntry } from "../types";

export const AFTERCARE: readonly KnowledgeEntry[] = [
  {
    id: "aftercare.filler-swelling-bruising",
    topic: "Aftercare: filler swelling & bruising — what’s typical (education)",
    category: "aftercare",
    explanation:
      "After filler, swelling and bruising can happen. Educationally, swelling can be most noticeable in the first 24–72 hours and settle over 1–2 weeks. Early asymmetry is often swelling-related. Final assessment should wait until things settle.",
    whatItHelpsWith: ["Reducing post-treatment anxiety", "Knowing what’s typical vs what needs attention (education)"],
    whoItsFor: ["People who recently had filler and want education about healing timelines"],
    whoItsNotFor: ["Anyone with severe pain, vision changes, breathing symptoms, or skin color changes—seek urgent care"],
    commonQuestions: ["How long will swelling last?", "Is asymmetry normal early on?", "What should I avoid?"],
    safetyNotes: [
      "No diagnosis online.",
      "Red flags after filler include vision changes, severe pain, or skin color changes—seek urgent care and contact your provider.",
    ],
    escalationTriggers: ["vision", "blanch", "dusky", "severe pain", "trouble breathing", "hives", "fever"],
    relatedTopics: ["safety.post-treatment-red-flags", "expectations.filler-timeline"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
  {
    id: "aftercare.general-aftercare",
    topic: "Aftercare basics — why it matters (education)",
    category: "aftercare",
    explanation:
      "Aftercare exists to support comfort and reduce avoidable irritation. Educationally, the safest approach is to follow your provider’s written instructions and contact the clinic if something feels unusual or worsening.",
    whatItHelpsWith: ["Understanding the purpose of aftercare", "Knowing when to contact the clinic (education)"],
    whoItsFor: ["Anyone who wants education about post-treatment support"],
    whoItsNotFor: ["Anyone needing urgent medical care—seek urgent/emergency care if severe symptoms occur"],
    commonQuestions: ["What should I do if I’m worried?", "What symptoms are red flags?", "When should I call?"],
    safetyNotes: ["No diagnosis online.", "If severe or rapidly worsening symptoms occur, seek urgent care."],
    escalationTriggers: ["trouble breathing", "vision", "severe pain", "fever", "pus", "worsening redness spreading"],
    relatedTopics: ["safety.post-treatment-red-flags"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
] as const;

