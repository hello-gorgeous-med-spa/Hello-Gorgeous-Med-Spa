import type { PersonaId } from "./types";

export const PERSONA_UI: Record<
  PersonaId,
  {
    emoji: string;
    tagline: string;
    specialty: string;
    brands: string[];
    chatStarters: string[];
    video?: { mp4?: string; webm?: string; poster?: string };
  }
> = {
  peppi: {
    emoji: "💊",
    tagline: "Your peptide, supplement & IV therapy expert. Fullscript & Olympia specialist.",
    specialty: "Fullscript + Olympia Pharmacy",
    brands: ["Fullscript", "Olympia Pharmacy"],
    chatStarters: [
      "What peptides do you offer for healing?",
      "Tell me about Semaglutide for weight loss",
      "What's in the Myers Cocktail IV?",
      "Which supplements should I take?",
    ],
  },
  "beau-tox": {
    emoji: "💉",
    tagline: "Neuromodulator expert. Botox, Jeuveau & Dysport specialist.",
    specialty: "Allergan + Evolus + Galderma",
    brands: ["Allergan Botox", "Jeuveau", "Dysport"],
    chatStarters: [
      "Botox vs Jeuveau vs Dysport—which is best?",
      "How does Allē rewards work?",
      "Can I get a lip flip with Botox?",
      "How many units will I need?",
    ],
  },
  "filla-grace": {
    emoji: "✨",
    tagline: "Dermal filler artist. Revanesse specialist for natural beauty.",
    specialty: "Revanesse",
    brands: ["Revanesse Versa+", "Revanesse Lips+", "Revanesse Contour"],
    chatStarters: [
      "What is Revanesse and why do you use it?",
      "I want natural-looking lip filler",
      "What's facial balancing?",
      "How long do Revanesse fillers last?",
    ],
  },
  harmony: {
    emoji: "⚖️",
    tagline: "Hormone optimization guide. Biote BHRT specialist.",
    specialty: "Biote",
    brands: ["Biote Pellets", "Biote Nutraceuticals"],
    chatStarters: [
      "What are the signs of hormone imbalance?",
      "How do Biote pellets work?",
      "Do you offer hormone lab testing?",
      "What's the difference between BHRT and HRT?",
    ],
  },
  founder: {
    emoji: "🖤",
    tagline: "Vision, standards, and patient-first care philosophy.",
    specialty: "Hello Gorgeous Med Spa",
    brands: ["Hello Gorgeous"],
    chatStarters: [
      "What makes Hello Gorgeous different?",
      "What's the experience like from first visit to follow-up?",
      "What services are most popular for first-timers?",
    ],
  },
  ryan: {
    emoji: "🩺",
    tagline: "Clinical authority, safety, and compliance-first education.",
    specialty: "Medical Safety & Telehealth",
    brands: ["Medical Expertise"],
    chatStarters: [
      "What are general safety considerations for injectables?",
      "Who should avoid certain treatments (in general)?",
      "Can I do a telehealth consultation?",
    ],
  },
};
