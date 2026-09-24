/**
 * Staff-facing request statuses for the manual REGEN order loop.
 * Product selection never creates a prescription or pharmacy order.
 */

export const REQUEST_STATUS_LABEL: Record<string, string> = {
  pending: "Received",
  received: "Received",
  needs_info: "Needs information / labs / visit",
  needs_labs: "Needs information / labs / visit",
  needs_video: "Needs information / labs / visit",
  in_review: "Under Ryan’s review",
  declined: "Declined",
  approved: "Approved — awaiting payment",
  awaiting_payment: "Approved — awaiting payment",
  paid: "Paid",
  sent_to_pharmacy: "Sent to pharmacy",
  pharmacy_issue: "Pharmacy issue",
  shipped: "Shipped",
};

export function requestStatusLabel(status?: string | null): string {
  const key = String(status || "").trim();
  return REQUEST_STATUS_LABEL[key] || key || "Received";
}
