import type { KnowledgeEntry } from "../types";

export const EXPECTATIONS: readonly KnowledgeEntry[] = [
  {
    id: "expectations.neuromodulator-timeline",
    topic: "Expectations: neuromodulator timeline (education)",
    category: "expectations",
    explanation:
      "Educationally, neuromodulator results are not instant. People may notice change over days, with results often more ‘settled’ around ~2 weeks. Longevity varies and maintenance is common.",
    whatItHelpsWith: ["Setting realistic expectations", "Reducing anxiety about day-by-day changes"],
    whoItsFor: ["Anyone exploring neuromodulators", "First-timers who want clarity"],
    whoItsNotFor: ["Anyone seeking individualized timelines or guarantees"],
    commonQuestions: ["When will I see results?", "How long will it last?", "Is it normal to feel nothing at first?"],
    safetyNotes: ["No guarantees; individual response varies.", "Seek urgent care for severe symptoms."],
    escalationTriggers: ["vision", "trouble breathing", "severe headache"],
    relatedTopics: ["injectables.botox-basics", "safety.general-safety"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
  {
    id: "expectations.filler-timeline",
    topic: "Expectations: filler settling timeline (education)",
    category: "expectations",
    explanation:
      "Educationally, swelling can make results look ‘more’ at first. Many people see swelling improve over the first week, with a more representative look around 1–2 weeks. Final assessment is best after settling.",
    whatItHelpsWith: ["Reducing early worry", "Understanding why you shouldn’t judge day 1"],
    whoItsFor: ["People exploring filler education", "People who recently had filler"],
    whoItsNotFor: ["Anyone with red-flag symptoms (seek urgent care)"],
    commonQuestions: ["When is it fully settled?", "Is early unevenness normal?", "When can I evaluate results?"],
    safetyNotes: ["Red flags require urgent care (vision changes, severe pain, skin color changes)."],
    escalationTriggers: ["vision", "blanch", "dusky", "severe pain"],
    relatedTopics: ["injectables.filler-basics", "aftercare.filler-swelling-bruising", "safety.post-treatment-red-flags"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
  {
    id: "expectations.program-based-care",
    topic: "Expectations: program-based care (education)",
    category: "expectations",
    explanation:
      "Educationally, program-based care involves screening, a structured plan, and follow-ups. It’s designed for safety and sustainable progress, not quick fixes. Decisions are individualized and made in consultation.",
    whatItHelpsWith: ["Understanding follow-ups and monitoring", "Reducing frustration about ‘why so many steps?’"],
    whoItsFor: ["People exploring weight, hormone, or wellness programs"],
    whoItsNotFor: ["Anyone seeking prescriptions or protocols online"],
    commonQuestions: ["Why do I need labs?", "How often are follow-ups?", "What does monitoring mean?"],
    safetyNotes: ["No prescribing online.", "Eligibility requires clinician evaluation."],
    escalationTriggers: ["urgent symptoms", "severe symptoms"],
    relatedTopics: ["hormones.bhrt-basics", "weight-loss.metabolic-care-basics", "safety.general-safety"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
  {
    id: "expectations.gradual-skin-timelines",
    topic: "Expectations: gradual skin timelines (education)",
    category: "expectations",
    explanation:
      "Educationally, many skin-quality changes (texture, tone, collagen support) are gradual. It’s normal to see subtle improvements over weeks to months rather than overnight changes. The safest mindset is consistency and realistic expectations.",
    whatItHelpsWith: ["Reducing ‘why isn’t it instant?’ anxiety", "Setting a long-term mindset"],
    whoItsFor: ["People exploring skin treatments and skincare routines"],
    whoItsNotFor: ["Anyone seeking guaranteed outcomes or timelines"],
    commonQuestions: ["When will I see results?", "Why does it take time?", "What can I do between visits?"],
    safetyNotes: ["No guarantees online.", "Follow provider aftercare and seek care for severe symptoms."],
    escalationTriggers: ["infection signs", "fever", "severe pain"],
    relatedTopics: ["skincare.microneedling-basics", "skincare.skin-barrier", "aftercare.general-aftercare"],
    updatedAt: "2026-01-29T00:00:00.000Z",
    version: 1,
  },
] as const;

