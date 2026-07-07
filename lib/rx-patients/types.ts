/** HGRX-020 / HGRX-023 — RX Ops patient chart (EHR-lite). */

export type RxPatientSummary = {
  id: string;
  name: string;
  initials: string;
  email: string | null;
  phone: string | null;
  state: string | null;
  since: string;
  rxActive: boolean;
  duplicateOf?: string | null;
};

export type RxPatientRefillPlan = {
  id: string;
  medication: string;
  status: string;
  cadence: string;
  nextRefill: string;
  pharmacy: string | null;
};

export type RxPatientOrder = {
  id: string;
  kind: string;
  label: string;
  status: string;
  date: string;
  amountUsd: number | null;
};

export type RxPatientNote = {
  id: string;
  title: string;
  body: string;
  noteType: string;
  createdAt: string;
  author: string | null;
};

export type RxPatientMessageThread = {
  id: string;
  intakeRef: string;
  lastPreview: string | null;
  unreadStaff: number;
};

export type RxPatientDetail = {
  id: string;
  name: string;
  initials: string;
  email: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  sex: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  allergies: string | null;
  medications: string | null;
  conditions: string | null;
  internalNotes: string | null;
  since: string;
  activePlans: RxPatientRefillPlan[];
  orders: RxPatientOrder[];
  notes: RxPatientNote[];
  messageThreads: RxPatientMessageThread[];
  duplicateCandidates: Array<{ id: string; name: string; email: string | null }>;
};
