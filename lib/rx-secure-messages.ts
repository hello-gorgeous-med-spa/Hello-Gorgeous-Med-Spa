/**
 * Hello Gorgeous RX™ — secure patient ↔ staff messaging threads.
 */

export type RxMessageSender = "patient" | "staff";

export type RxMessageThread = {
  id: string;
  submissionId: string | null;
  intakeRef: string;
  patientEmail: string;
  patientName: string | null;
  patientPhone: string | null;
  track: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  unreadStaff: number;
  unreadPatient: number;
  lastPreview: string | null;
};

export type RxSecureMessage = {
  id: string;
  threadId: string;
  senderType: RxMessageSender;
  body: string;
  sentBy: string | null;
  readAt: string | null;
  createdAt: string;
};

export const RX_MESSAGES_PATH = "/rx/messages";

export function rxMessagesHref(intakeRef?: string, email?: string): string {
  const params = new URLSearchParams();
  if (intakeRef?.trim()) params.set("ref", intakeRef.trim().toUpperCase());
  if (email?.trim()) params.set("email", email.trim());
  const q = params.toString();
  return q ? `${RX_MESSAGES_PATH}?${q}` : RX_MESSAGES_PATH;
}

export function normalizeIntakeRef(ref: string): string {
  return ref.trim().toUpperCase().slice(0, 8);
}

export function normalizePatientEmail(email: string): string {
  return email.trim().toLowerCase();
}
