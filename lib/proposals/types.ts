import type { ProposalOption } from "@/lib/proposals/utils";

export type ProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "declined" | "expired";

export type ProposalPaymentStatus = "unpaid" | "pending" | "deposit_paid" | "paid" | "refunded";

export type ProposalPaymentKind = "deposit" | "full";

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
  client_id?: string | null;
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
  payment_status?: ProposalPaymentStatus;
  payment_kind?: ProposalPaymentKind | null;
  payment_option_name?: string | null;
  payment_amount_usd?: number | null;
  payment_url?: string | null;
  square_payment_link_id?: string | null;
  square_order_id?: string | null;
  square_payment_id?: string | null;
  paid_at?: string | null;
  ledger_id?: string | null;
  accepted_option?: string | null;
  accepted_at?: string | null;
  declined_at?: string | null;
};
