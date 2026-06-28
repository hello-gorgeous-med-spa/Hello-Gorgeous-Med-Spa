/**
 * Patient SMS after RX intake submit — next-step nudge with status tracker link.
 */

import { isGlp1FormSlug } from "@/lib/glp1-form-alert";
import { isPeptideFormSlug } from "@/lib/peptide-form-alert";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { SITE } from "@/lib/seo";

function firstName(signerName: string | null): string {
  const trimmed = String(signerName || "").trim();
  if (!trimmed) return "there";
  return trimmed.split(/\s+/)[0] || "there";
}

function medicationLabel(slug: string, responses: Record<string, unknown>): string {
  if (slug.includes("glp1")) {
    const med = String(responses.medication || "GLP-1").trim();
    return med || "GLP-1";
  }
  const peptides = responses.selected_peptides;
  if (Array.isArray(peptides) && peptides.length) {
    return peptides.slice(0, 2).join(", ");
  }
  return "peptide protocol";
}

function nextStepLine(slug: string): string {
  const isRefill = slug.includes("refill");
  if (isPeptideFormSlug(slug)) {
    if (isRefill) {
      return "Next: complete payment if due — Ryan Kent, FNP-BC reviews before anything ships.";
    }
    return `Next: pay your $${PEPTIDE_CONSULT_FEE_USD} consult, then book telehealth with Ryan Kent, FNP-BC.`;
  }
  if (isGlp1FormSlug(slug)) {
    if (isRefill) {
      return "Next: complete payment — clinical review before your refill ships.";
    }
    return "Next: complete checkout and book telehealth if your plan requires it.";
  }
  return "Next: follow the link to complete your next step.";
}

export async function notifyPatientRxIntakeSubmitted(opts: {
  phone: string | null | undefined;
  signerName: string | null;
  slug: string;
  ref: string;
  token: string;
  responses: Record<string, unknown>;
}): Promise<{ ok: boolean; error?: string }> {
  const phone = String(opts.phone || "").trim();
  if (!phone) return { ok: false, error: "No phone on file" };

  const statusUrl = `${SITE.url}/rx/status?token=${encodeURIComponent(opts.token)}`;
  const med = medicationLabel(opts.slug, opts.responses);

  const message = [
    `Hi ${firstName(opts.signerName)}! ${SITE.name} got your ${med} request (Ref ${opts.ref}).`,
    nextStepLine(opts.slug),
    `Track your steps: ${statusUrl}`,
    "Questions? Call 630-636-6193. Reply STOP to opt out.",
  ].join(" ");

  const result = await sendSms(phone, message);
  return result.success ? { ok: true } : { ok: false, error: result.error };
}
