import type { KnowledgeEntry } from "../types";

export const SAFETY: readonly KnowledgeEntry[] = [
  {
    id: "safety.general-safety",
    topic: "Safety principles — what we can (and can’t) do online",
    category: "safety",
    explanation:
      "Online education can explain concepts, what to expect, and what questions to ask. It cannot replace clinician evaluation. We do not diagnose, prescribe, or provide individualized treatment plans online.",
    whatItHelpsWith: ["Understanding boundaries", "Reducing confusion about medical advice vs education"],
    whoItsFor: ["Anyone using the site’s chat or tools"],
    whoItsNotFor: ["Anyone seeking urgent medical guidance—seek urgent/emergency care when appropriate"],
    commonQuestions: ["Can you tell me if I’m a candidate?", "Can you tell me what dose I need?", "Is this medical advice?"],
    safetyNotes: [
      "No diagnosis, prescribing, dosing, or clearance online.",
      "If uncertain: book a consultation.",
      "If urgent symptoms occur: seek urgent/emergency care.",
    ],
    escalationTriggers: ["urgent", "severe", "trouble breathing", "vision", "chest pain", "stroke"],
    relatedTopics: ["safety.post-treatment-red-flags", "expectations.program-based-care"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
  {
    id: "safety.post-treatment-red-flags",
    topic: "Post-treatment red flags — when to seek urgent care",
    category: "safety",
    explanation:
      "Some symptoms after treatment can be urgent. Educationally, red flags include breathing problems, swelling of tongue/throat, vision changes, severe/worsening pain, fever with infection signs, or skin color changes after filler. When in doubt, contact your provider and seek urgent care if severe.",
    whatItHelpsWith: ["Recognizing when not to self-reassure", "Knowing when to contact clinic vs urgent care"],
    whoItsFor: ["Anyone with post-treatment questions"],
    whoItsNotFor: ["Anyone needing diagnosis—this is education only"],
    commonQuestions: ["Is this normal?", "When should I call?", "What symptoms are urgent?"],
    safetyNotes: [
      "This is educational only—no diagnosis.",
      "If severe or rapidly worsening symptoms occur, seek urgent/emergency care now.",
    ],
    escalationTriggers: ["trouble breathing", "vision", "blanch", "dusky", "necrosis", "severe pain", "fever", "pus"],
    relatedTopics: ["aftercare.general-aftercare", "aftercare.filler-swelling-bruising"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
] as const;

