/**
 * Patient-facing RX journey status — intake → telehealth → pay → approve → ship.
 */

import {
  HG_RX_TELEHEALTH_BOOKING_URL,
  RX_MESSAGES_PATH,
} from "@/lib/flows";
import type { RxDispatchRecord, RxDispatchStatus } from "@/lib/rx-dispatch";
import type { RxPaymentLedgerRow } from "@/lib/rx-payment-ledger";
import { rxMessagesHref } from "@/lib/rx-secure-messages";
import { RX_TELEHEALTH_CADENCE_DAYS } from "@/lib/rx-supply-cycle";
import type { RxSubmissionContext } from "@/lib/rx-submission-context";

export const RX_STATUS_PATH = "/rx/status";

export type RxPatientStepStatus = "complete" | "pending" | "action_needed";

export type RxPatientStatusStep = {
  id: "intake" | "telehealth" | "payment" | "approval" | "shipped";
  label: string;
  status: RxPatientStepStatus;
  detail: string;
  href?: string;
  external?: boolean;
};

export type RxPatientStatus = {
  intakeRef: string;
  submissionId: string;
  patientName: string | null;
  track: "glp1" | "peptide" | "unknown";
  qualified: boolean;
  supplyCycle: string | null;
  steps: RxPatientStatusStep[];
  payment: {
    status: string;
    amountUsd: number | null;
    paidAt: string | null;
    lineLabel: string | null;
  } | null;
  dispatchStatus: RxDispatchStatus | null;
};

export function rxStatusHref(intakeRef?: string, email?: string): string {
  return rxStatusHrefWithToken(undefined, intakeRef, email);
}

/** Prefer secure token when available (from intake confirmation). */
export function rxStatusHrefWithToken(
  accessToken?: string,
  intakeRef?: string,
  email?: string,
): string {
  const params = new URLSearchParams();
  if (accessToken?.trim()) {
    params.set("token", accessToken.trim());
  } else {
    if (intakeRef?.trim()) params.set("ref", intakeRef.trim().toUpperCase());
    if (email?.trim()) params.set("email", email.trim());
  }
  const q = params.toString();
  return q ? `${RX_STATUS_PATH}?${q}` : RX_STATUS_PATH;
}

function trackFromSlug(slug: string | null): RxPatientStatus["track"] {
  if (!slug) return "unknown";
  if (slug.startsWith("glp1")) return "glp1";
  if (slug.startsWith("peptide")) return "peptide";
  return "unknown";
}

function paymentStep(ledger: RxPaymentLedgerRow | null): RxPatientStatusStep {
  if (!ledger) {
    return {
      id: "payment",
      label: "Payment",
      status: "action_needed",
      detail: "Pay your invoice when ready — Square checkout from your refill confirmation.",
    };
  }

  if (ledger.payment_status === "paid") {
    return {
      id: "payment",
      label: "Payment",
      status: "complete",
      detail: `$${ledger.amount_usd.toFixed(0)} paid${ledger.paid_at ? ` · ${new Date(ledger.paid_at).toLocaleDateString()}` : ""}`,
    };
  }

  return {
    id: "payment",
    label: "Payment",
    status: "action_needed",
    detail: `$${ledger.amount_usd.toFixed(0)} pending — finish checkout to move your refill forward.`,
    href: ledger.payment_url ?? undefined,
    external: Boolean(ledger.payment_url),
  };
}

function telehealthStep(responses: Record<string, unknown>): RxPatientStatusStep {
  const recentVisit = responses.last_visit_within_12mo === "Yes";
  const doseChange = responses.dose_changes === "Yes";

  if (recentVisit && !doseChange) {
    return {
      id: "telehealth",
      label: "Telehealth check-in",
      status: "complete",
      detail: `On file within the last ${RX_TELEHEALTH_CADENCE_DAYS} days — book sooner only if your dose changes.`,
    };
  }

  return {
    id: "telehealth",
    label: "Telehealth check-in",
    status: "action_needed",
    detail: doseChange
      ? "Dose change reported — book NP telehealth on Fresha before we ship."
      : `Book NP telehealth on Fresha (required every ${RX_TELEHEALTH_CADENCE_DAYS} days).`,
    href: HG_RX_TELEHEALTH_BOOKING_URL,
    external: true,
  };
}

function approvalStep(dispatch: RxDispatchRecord | null): RxPatientStatusStep {
  const status = dispatch?.status ?? "new";
  if (status === "sent") {
    return {
      id: "approval",
      label: "Rx approved",
      status: "complete",
      detail: "Prescription sent to our compounding pharmacy.",
    };
  }
  if (status === "approved") {
    return {
      id: "approval",
      label: "Rx approved",
      status: "complete",
      detail: "Ryan approved your protocol — pharmacy fulfillment in progress.",
    };
  }
  if (status === "reviewed") {
    return {
      id: "approval",
      label: "Clinical review",
      status: "pending",
      detail: "Our team is reviewing your chart — you'll get an update here.",
    };
  }
  return {
    id: "approval",
    label: "Clinical review",
    status: "pending",
    detail: "Submitted — Ryan reviews after telehealth and payment when required.",
  };
}

function shippedStep(dispatch: RxDispatchRecord | null): RxPatientStatusStep {
  if (dispatch?.status === "sent") {
    const tracking = dispatch.staff_notes?.trim();
    return {
      id: "shipped",
      label: "Home delivery",
      status: "complete",
      detail: tracking || "Medication sent to pharmacy for cold-chain shipping to your address.",
    };
  }
  return {
    id: "shipped",
    label: "Home delivery",
    status: "pending",
    detail: "Ships after NP approval and pharmacy processing — usually within a few business days.",
  };
}

export function buildRxPatientStatus(input: {
  submission: RxSubmissionContext;
  ledger: RxPaymentLedgerRow | null;
  dispatch: RxDispatchRecord | null;
}): RxPatientStatus {
  const { submission, ledger, dispatch } = input;
  const responses = submission.responses;
  const qualified = responses.qualified === true;

  const steps: RxPatientStatusStep[] = [
    {
      id: "intake",
      label: "Intake received",
      status: "complete",
      detail: qualified
        ? `Ref ${submission.intakeRef} · ${new Date(submission.submittedAt).toLocaleString()}`
        : `Ref ${submission.intakeRef} · needs clinical review before shipping`,
    },
    telehealthStep(responses),
    paymentStep(ledger),
    approvalStep(dispatch),
    shippedStep(dispatch),
  ];

  return {
    intakeRef: submission.intakeRef,
    submissionId: submission.submissionId,
    patientName: submission.clientName,
    track: trackFromSlug(submission.slug),
    qualified,
    supplyCycle: String(responses.supply_cycle || responses.supplyCycle || "") || null,
    steps,
    payment: ledger
      ? {
          status: ledger.payment_status,
          amountUsd: ledger.amount_usd,
          paidAt: ledger.paid_at,
          lineLabel: ledger.line_label,
        }
      : null,
    dispatchStatus: dispatch?.status ?? null,
  };
}

export function rxStatusQuickLinks(intakeRef: string, email: string) {
  return {
    messages: rxMessagesHref(intakeRef, email),
    telehealth: HG_RX_TELEHEALTH_BOOKING_URL,
    careHub: "/rx/care",
    messagesPath: RX_MESSAGES_PATH,
  };
}
