export type ConsultVertical = "weight_loss" | "injectables" | "morpheus8" | "other";

export type ConsultStatus =
  | "open"
  | "screening"
  | "educated"
  | "proposed"
  | "closed"
  | "disqualified";

export type ConsultScreeningResult = {
  qualified: boolean;
  disqualificationReasons: string[];
  providerFlags: string[];
  bmi: number | null;
};

export type ConsultScreening = {
  answers?: Record<string, unknown>;
  result?: ConsultScreeningResult;
  staffOverride?: boolean;
  staffOverrideNote?: string;
  completedAt?: string;
};

export type ConsultEducationProgress = {
  coveredSlideIds?: string[];
  currentSlideId?: string;
  completedAt?: string;
};

export type ConsultRecommendation = {
  pathId?: string;
  pathLabel?: string;
  notes?: string;
  serviceIds?: string[];
};

export type TreatmentConsultRecord = {
  id: string;
  public_id: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_id?: string | null;
  vertical: ConsultVertical;
  status: ConsultStatus;
  concern_tags: string[];
  screening: ConsultScreening;
  education_progress: ConsultEducationProgress;
  recommendation: ConsultRecommendation;
  proposal_id: string | null;
  internal_notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type ConsultSlide = {
  id: string;
  title: string;
  eyebrow?: string;
  body: string;
  bullets?: string[];
  chips?: string[];
  talkingPoints?: string[];
};

export type ConsultProgramPath = {
  id: string;
  label: string;
  summary: string;
  serviceIds: string[];
};

export type ConsultEducationPack = {
  vertical: ConsultVertical;
  title: string;
  slides: ConsultSlide[];
  paths: ConsultProgramPath[];
  concernDefaults: string[];
};

export const CONSULT_VERTICAL_LABELS: Record<ConsultVertical, string> = {
  weight_loss: "Weight loss / GLP-1",
  injectables: "Botox / fillers",
  morpheus8: "Morpheus8 / InMode",
  other: "Other",
};

export const CONSULT_STATUS_LABELS: Record<ConsultStatus, string> = {
  open: "Open",
  screening: "Screening",
  educated: "Educated",
  proposed: "Proposed",
  closed: "Closed",
  disqualified: "Disqualified",
};

export const CONSULT_STEPS = [
  { id: "intake", label: "Intake" },
  { id: "screen", label: "Screen" },
  { id: "educate", label: "Educate" },
  { id: "recommend", label: "Recommend" },
  { id: "propose", label: "Propose" },
] as const;

export type ConsultStepId = (typeof CONSULT_STEPS)[number]["id"];
