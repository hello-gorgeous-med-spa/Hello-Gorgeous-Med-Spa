import type { ProposalOption } from "@/lib/proposals/utils";

export type ProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "expired";

export type ProposalMediaKind = "before" | "after" | "pair";

export type ProposalMediaItem = {
  id: string;
  kind: ProposalMediaKind;
  url: string;
  label?: string;
  createdAt: string;
};

export type TreatmentProposalRecord = {
  id: string;
  public_id: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  status: ProposalStatus;
  concerns: string[];
  options: ProposalOption[];
  internal_notes: string | null;
  client_instructions: string | null;
  media: ProposalMediaItem[];
};
