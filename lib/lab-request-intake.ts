/**
 * Hello Gorgeous — lab panel request intake (pay first → requisition → results review).
 */

import type { IntakeFormField } from "@/lib/hgos/intake-forms";
import {
  labDrawOptionById,
  labInvoiceTemplateId,
  labPanelById,
  type LabDrawOptionId,
  type LabPanel,
} from "@/lib/lab-panel-catalog";

export const LAB_REQUEST_INTAKE_SLUG = "lab-panel-request";

export const LAB_REQUEST_DISCLAIMER =
  "Educational ordering only — not a diagnosis. Your NP confirms the panel is appropriate before any requisition is released.";

export type LabRequestSelection = {
  panelId: string;
  drawOptionId: LabDrawOptionId;
};

const CONTACT_FIELDS: IntakeFormField[] = [
  { id: "first_name", type: "text", label: "First name", required: true, placeholder: "Jane" },
  { id: "last_name", type: "text", label: "Last name", required: true, placeholder: "Doe" },
  { id: "email", type: "text", label: "Email", required: true, placeholder: "you@email.com" },
  {
    id: "phone",
    type: "phone",
    label: "Mobile phone",
    required: true,
    placeholder: "(630) 555-1234",
    helpText: "For requisition delivery and result notifications.",
  },
  { id: "dob", type: "date", label: "Date of birth", required: true },
  { id: "zip", type: "text", label: "ZIP code", required: true, placeholder: "60543" },
];

export const LAB_REQUEST_FIELDS: IntakeFormField[] = [
  ...CONTACT_FIELDS,
  {
    id: "sex_at_birth",
    type: "select",
    label: "Sex assigned at birth",
    required: true,
    options: ["Female", "Male"],
    helpText: "Used to order clinically appropriate markers (e.g. PSA).",
  },
  {
    id: "lab_goals",
    type: "textarea",
    label: "What are you hoping to learn from these labs?",
    required: true,
    placeholder: "Energy, weight loss, hormone symptoms, annual wellness, etc.",
  },
  {
    id: "fasting_ack",
    type: "checkbox",
    label:
      "I understand fasting may be required (typically 8–12 hours, water only) and morning draws are best for hormones.",
    required: true,
  },
  {
    id: "consent_payment_labs",
    type: "checkbox",
    label:
      "I understand payment is collected now, my NP reviews this order before the requisition is sent, and results are reviewed at follow-up — not auto-released as treatment advice.",
    required: true,
  },
];

export function parseLabRequestSelection(searchParams: {
  panel?: string;
  draw?: string;
}): LabRequestSelection | null {
  const panelId = searchParams.panel?.trim();
  const drawRaw = searchParams.draw?.trim() as LabDrawOptionId | undefined;
  if (!panelId) return null;
  const panel = labPanelById(panelId);
  if (!panel) return null;
  const drawOptionId = drawRaw && labDrawOptionById(drawRaw) ? drawRaw : "in-office";
  return { panelId, drawOptionId };
}

export type LabPanelQuote = {
  panel: LabPanel;
  drawOptionId: LabDrawOptionId;
  totalUsd: number;
  lineLabel: string;
  invoiceTemplateId: string;
};

export function computeLabPanelQuote(
  panelId: string,
  drawOptionId: LabDrawOptionId = "in-office",
): LabPanelQuote | null {
  const panel = labPanelById(panelId);
  if (!panel) return null;
  const draw = labDrawOptionById(drawOptionId);
  return {
    panel,
    drawOptionId,
    totalUsd: panel.retailUsd,
    lineLabel: `${panel.name} · ${draw?.shortLabel ?? "Quest / LabCorp"}`,
    invoiceTemplateId: labInvoiceTemplateId(panelId),
  };
}
