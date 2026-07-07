import type { RxOpsStage, RxOpsRequestKind } from "@/lib/rx-ops/types";

export const RX_OPS_STAGE_COLORS: Record<RxOpsStage, string> = {
  "New request": "#6b7280",
  "Awaiting payment": "#b45309",
  "Awaiting telehealth": "#2563eb",
  "Clinical review": "#FF2D8E",
  Approved: "#3b82f6",
  Shipped: "#0f8a4d",
  Declined: "#b42318",
  "Info requested": "#7c3aed",
};

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function relativeSubmittedLabel(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 0) return "just now";
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type StageInput = {
  kind: RxOpsRequestKind;
  dispatchStatus: string;
  paymentStatus: string | null;
  encounterStatus?: string | null;
  regenStatus?: string | null;
  paid?: boolean;
  intakeComplete?: boolean;
  telehealthRequired?: boolean;
  telehealthComplete?: boolean;
  npApproved?: boolean;
  shipped?: boolean;
};

/** Map legacy pipeline rows → unified ops stage labels. */
export function mapToOpsStage(input: StageInput): RxOpsStage {
  if (input.dispatchStatus === "declined" || input.regenStatus === "cancelled") {
    return "Declined";
  }
  if (input.dispatchStatus === "info_requested") return "Info requested";

  if (input.shipped || input.dispatchStatus === "sent" || input.dispatchStatus === "shipped") {
    return "Shipped";
  }

  if (input.kind === "regen") {
    if (!input.paid || input.regenStatus === "pending_payment") return "Awaiting payment";
    if (!input.intakeComplete) return "Awaiting payment";
    if (input.telehealthComplete === false) return "Awaiting telehealth";
    if (input.npApproved || input.regenStatus === "approved" || input.regenStatus === "ordered") {
      return "Approved";
    }
    if (input.intakeComplete) return "Clinical review";
    return "New request";
  }

  if (input.paymentStatus === "pending" || input.encounterStatus === "awaiting_payment") {
    return "Awaiting payment";
  }

  const paid = input.paymentStatus === "paid" || input.encounterStatus === "paid";
  if (paid && input.telehealthRequired && input.telehealthComplete === false) {
    return "Awaiting telehealth";
  }

  if (input.dispatchStatus === "approved" || input.encounterStatus === "ready_to_ship") {
    return "Approved";
  }

  if (
    input.dispatchStatus === "new" ||
    input.dispatchStatus === "reviewed" ||
    input.dispatchStatus === "intake_pending" ||
    input.dispatchStatus === "intake_complete" ||
    input.dispatchStatus === "telehealth_pending"
  ) {
    if (paid) {
      return "Clinical review";
    }
    return "New request";
  }

  return "New request";
}
