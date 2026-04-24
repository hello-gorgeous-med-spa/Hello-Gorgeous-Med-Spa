/** Pipeline status for cl_quantum_cases (matches DB check constraint). */
export const CL_QUANTUM_STATUSES = [
  "new_inquiry",
  "needs_review",
  "candidate",
  "not_candidate",
  "scheduled",
  "intake_sent",
  "consent_signed",
  "treated",
  "followup_needed",
  "completed",
] as const;

export type ClQuantumStatus = (typeof CL_QUANTUM_STATUSES)[number];

export const CL_STATUS_LABEL: Record<ClQuantumStatus, string> = {
  new_inquiry: "New inquiry",
  needs_review: "Needs review",
  candidate: "Candidate",
  not_candidate: "Not a candidate",
  scheduled: "Scheduled",
  intake_sent: "Intake sent",
  consent_signed: "Consent signed",
  treated: "Treated",
  followup_needed: "Follow-up needed",
  completed: "Completed",
};

export function isClQuantumStatus(s: string): s is ClQuantumStatus {
  return (CL_QUANTUM_STATUSES as readonly string[]).includes(s);
}
