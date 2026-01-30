export interface PersonaConfig {
  id: string;
  displayName: string;
  role: string;
  tone: string;
  allowedTopics: string[];
  restrictedTopics: string[];
  responseStyleRules: string[];
  escalationRules: string[];
  bookingTriggers: string[];
  disclaimer: string;
}

export type PersonaId =
  | "peppi"
  | "beau-tox"
  | "filla-grace"
  | "harmony"
  | "founder"
  | "ryan";

