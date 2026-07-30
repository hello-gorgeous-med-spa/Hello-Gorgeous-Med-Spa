import type {
  ProposalPaymentStatus,
  ProposalStatus,
  TreatmentProposalRecord,
} from "@/lib/proposals/types";

export type ProposalStatusBadge = {
  key: string;
  label: string;
  className: string;
};

/** Staff-facing chips for list/preview — payment overrides lifecycle when funded. */
export function proposalStatusBadges(
  proposal: Pick<TreatmentProposalRecord, "status" | "payment_status" | "accepted_option">
): ProposalStatusBadge[] {
  const badges: ProposalStatusBadge[] = [];
  const payment = (proposal.payment_status || "unpaid") as ProposalPaymentStatus;
  const status = proposal.status as ProposalStatus;

  if (payment === "paid") {
    badges.push({
      key: "paid",
      label: "Paid",
      className: "border-emerald-700 bg-emerald-600 text-white",
    });
  } else if (payment === "deposit_paid") {
    badges.push({
      key: "deposit",
      label: "Deposit paid",
      className: "border-emerald-800 bg-emerald-50 text-emerald-800",
    });
  } else if (payment === "pending") {
    badges.push({
      key: "pending",
      label: "Payment pending",
      className: "border-amber-700 bg-amber-50 text-amber-900",
    });
  }

  if (status === "declined") {
    badges.push({
      key: "declined",
      label: "Declined",
      className: "border-black/40 bg-black/5 text-black/70",
    });
  } else if (status === "accepted") {
    badges.push({
      key: "accepted",
      label: proposal.accepted_option ? `Accepted · ${proposal.accepted_option}` : "Accepted",
      className: "border-[#E6007E] bg-[#FFF0F7] text-[#E6007E]",
    });
  } else if (status === "sent") {
    badges.push({
      key: "sent",
      label: "Sent",
      className: "border-sky-700 bg-sky-50 text-sky-900",
    });
  } else if (status === "viewed") {
    badges.push({
      key: "viewed",
      label: "Viewed",
      className: "border-violet-700 bg-violet-50 text-violet-900",
    });
  } else if (status === "expired") {
    badges.push({
      key: "expired",
      label: "Expired",
      className: "border-red-700 bg-red-50 text-red-800",
    });
  } else if (status === "draft" && payment === "unpaid") {
    badges.push({
      key: "draft",
      label: "Draft",
      className: "border-black/25 bg-white text-black/70",
    });
  }

  // If we only have payment and no lifecycle badge yet (e.g. paid without accepted), keep payment alone.
  if (!badges.length) {
    badges.push({
      key: "draft",
      label: "Draft",
      className: "border-black/25 bg-white text-black/70",
    });
  }

  return badges;
}
