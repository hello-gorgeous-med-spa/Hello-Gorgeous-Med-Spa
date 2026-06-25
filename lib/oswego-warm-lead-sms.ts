/**
 * One-tap follow-up SMS for warm RX leads (Oswego command center).
 */

import { SITE } from "@/lib/seo";

const BASE = () => process.env.NEXT_PUBLIC_APP_URL || SITE.url;

export type WarmLeadSmsTrack = "peptide" | "glp1" | "unknown";

export function warmLeadSmsMessage(
  firstName: string,
  track: WarmLeadSmsTrack,
): string {
  const name = firstName.trim() || "there";
  const book = `${BASE()}/book?utm_source=sms&utm_medium=staff&utm_campaign=warm_lead`;
  const phone = SITE.phone;

  if (track === "glp1") {
    const screener = `${BASE()}/quiz/glp-1-readiness?utm_source=sms&utm_medium=staff&utm_campaign=warm_lead`;
    const hub = `${BASE()}/glp-1-weight-loss-oswego?utm_source=sms&utm_medium=staff&utm_campaign=warm_lead`;
    return `Hi ${name}, Ryan's team at Hello Gorgeous here re: your GLP-1 weight loss inquiry. Book your NP consult: ${book} · 2-min screener: ${screener} · Pricing: ${hub} Questions? Call ${phone} — reply STOP to opt out.`;
  }

  if (track === "peptide") {
    const request = `${BASE()}/peptide-request?utm_source=sms&utm_medium=staff&utm_campaign=warm_lead`;
    return `Hi ${name}, Ryan's team at Hello Gorgeous here re: your peptide protocol inquiry. Continue your secure intake or book: ${book} · ${request} Questions? ${phone} — reply STOP to opt out.`;
  }

  return `Hi ${name}, Hello Gorgeous Med Spa in Oswego — thanks for reaching out about our RX programs. Book a consult: ${book} or call ${phone}. Reply STOP to opt out.`;
}

export function firstNameFromPatient(patientName: string): string {
  const part = patientName.trim().split(/\s+/)[0];
  return part && part !== "Unknown" ? part : "there";
}
