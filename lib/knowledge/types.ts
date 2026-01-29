export interface KnowledgeEntry {
  id: string;
  topic: string;
  category: string;
  explanation: string;
  whatItHelpsWith: string[];
  whoItsFor: string[];
  whoItsNotFor: string[];
  commonQuestions: string[];
  safetyNotes: string[];
  escalationTriggers: string[];
  relatedTopics: string[];
  updatedAt: string; // ISO timestamp
  version: number; // increment when entry changes
}

export type KnowledgeDomain =
  | "aesthetics"
  | "injectables"
  | "weight-loss"
  | "hormones"
  | "skincare"
  | "iv-therapy"
  | "hair-restoration"
  | "pain-recovery"
  | "aftercare"
  | "safety"
  | "comparisons"
  | "expectations";

