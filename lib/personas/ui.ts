import type { PersonaId } from "./types";

export const PERSONA_UI: Record<
  PersonaId,
  {
    emoji: string;
    tagline: string;
    chatStarters: string[];
    video?: { mp4?: string; webm?: string; poster?: string };
  }
> = {
  peppi: {
    emoji: "🫶",
    tagline: "Friendly education, calm explanations, and what to expect.",
    chatStarters: [
      "I’m new to med spas—where should I start?",
      "What does a consultation look like?",
      "How should I prepare for my first appointment?",
    ],
  },
  "beau-tox": {
    emoji: "💉",
    tagline: "Injectables education with safety-first clarity.",
    chatStarters: [
      "Botox vs Dysport—what’s the difference?",
      "How long do results last and when do they kick in?",
      "What are common side effects and safety considerations?",
    ],
  },
  "filla-grace": {
    emoji: "✨",
    tagline: "Facial harmony, subtle enhancement, elegant results.",
    chatStarters: [
      "What does “facial balancing” mean with fillers?",
      "How long do fillers last and what’s the downtime?",
      "Can fillers look natural—what’s the approach?",
    ],
  },
  founder: {
    emoji: "🖤",
    tagline: "Vision, standards, and patient-first care philosophy.",
    chatStarters: [
      "What makes Hello Gorgeous different?",
      "What’s the experience like from first visit to follow-up?",
      "What services are most popular for first-timers?",
    ],
  },
  ryan: {
    emoji: "🩺",
    tagline: "Clinical authority, safety, and compliance-first education.",
    chatStarters: [
      "What are general safety considerations for injectables?",
      "Who should avoid certain treatments (in general)?",
      "What should I do if I’m unsure about eligibility?",
    ],
  },
};

