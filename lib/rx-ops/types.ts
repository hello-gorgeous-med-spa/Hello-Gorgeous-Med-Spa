/** Unified RX Ops Console — normalized pipeline stages (HGRX-030). */

export type RxOpsStage =
  | "New request"
  | "Awaiting payment"
  | "Clinical review"
  | "Approved"
  | "Shipped"
  | "Declined"
  | "Info requested";

export type RxOpsRequestKind = "intake" | "clinic" | "regen";

export type RxOpsRequest = {
  id: string;
  kind: RxOpsRequestKind;
  patientName: string;
  initials: string;
  meta: string;
  compound: string;
  product: string;
  reason: string;
  stage: RxOpsStage;
  submittedAt: string;
  submittedLabel: string;
  track: "glp1" | "peptide" | "unknown";
  phone: string | null;
  email: string | null;
  paymentStatus: string | null;
  paymentAmountUsd: number | null;
  intakeRef: string;
  detailHref: string;
  actionHref: string | null;
};

export type RxOpsFormularyRow = {
  id: string;
  product: string;
  compound: string;
  category: string;
  categoryLabel: string;
  spec: string;
  pharmacy: string;
  retail30: number;
  retail90: number;
  coldShip: boolean;
  controlled: boolean;
};

export type RxOpsRefillRow = {
  patientName: string;
  plan: string;
  pharmacy: string;
  cadence: string;
  nextRefill: string;
  nextSoon: boolean;
  price: string | null;
  status: "Active" | "Paused" | "Due";
  reorderHref: string;
};

export type RxOpsPaymentRow = {
  date: string;
  patientName: string;
  forLabel: string;
  method: string;
  amountUsd: number;
  status: string;
};

export type RxOpsMessageThread = {
  id: string;
  patientName: string;
  initials: string;
  preview: string;
  time: string;
  unread: boolean;
  intakeRef: string;
};

export type RxOpsOverviewKpis = {
  requestsToReview: number;
  revenue30dUsd: number | null;
  activeRefillPlans: number;
  totalPatients: number;
  awaitingShipment: number;
  formularySkuCount: number;
};

export type RxOpsConsolePayload = {
  generatedAt: string;
  requests: RxOpsRequest[];
  formulary: RxOpsFormularyRow[];
  refills: RxOpsRefillRow[];
  payments: RxOpsPaymentRow[];
  threads: RxOpsMessageThread[];
  overview: RxOpsOverviewKpis;
  squareConnected: boolean;
};

export type RxOpsRequestDetail = {
  request: RxOpsRequest;
  screening: Array<{ icon: string; ok: boolean; text: string }>;
  intake: Array<{ q: string; a: string }>;
  routing: Array<{
    pharmacy: string;
    priceUsd: number;
    cold: boolean;
    controlled: boolean;
  }>;
  suggestedNote: string;
  npNotes: string | null;
  shipTo: string | null;
};
