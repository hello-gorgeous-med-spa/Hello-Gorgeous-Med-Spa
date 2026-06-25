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

export type WarmLeadNurtureStage = "24h" | "72h";

export function warmLeadNurtureMessage(
  firstName: string,
  track: WarmLeadSmsTrack,
  stage: WarmLeadNurtureStage,
): string {
  const name = firstName.trim() || "there";
  const book = `${BASE()}/book?utm_source=sms&utm_medium=auto&utm_campaign=warm_nurture_${stage}`;
  const phone = SITE.phone;

  if (stage === "24h") {
    if (track === "glp1") {
      return `Hi ${name}, following up on your GLP-1 inquiry at Hello Gorgeous Oswego. Ready to book your NP consult? ${book} Questions? ${phone} Reply STOP to opt out.`;
    }
    if (track === "peptide") {
      const guides = `${BASE()}/peptides?utm_source=sms&utm_medium=auto&utm_campaign=warm_nurture_${stage}`;
      return `Hi ${name}, following up on your peptide inquiry at Hello Gorgeous. Free goal guide: ${guides} · Book $49 consult: ${book} Call ${phone} Reply STOP to opt out.`;
    }
    return `Hi ${name}, Hello Gorgeous Oswego — still interested in our RX programs? Book: ${book} or call ${phone}. Reply STOP to opt out.`;
  }

  // 72h
  if (track === "glp1") {
    const hub = `${BASE()}/glp-1-weight-loss-oswego?utm_source=sms&utm_medium=auto&utm_campaign=warm_nurture_72h`;
    return `${name}, last check-in from Hello Gorgeous re: GLP-1 — published pricing & NP oversight: ${hub} Book this week: ${book} ${phone} Reply STOP to opt out.`;
  }
  if (track === "peptide") {
    const guides = `${BASE()}/peptides?utm_source=sms&utm_medium=auto&utm_campaign=warm_nurture_72h`;
    return `${name}, still exploring peptides? Download our free guides (no signup): ${guides} · $49 NP consult: ${book} Hello Gorgeous ${phone} Reply STOP to opt out.`;
  }
  return `${name}, Hello Gorgeous Oswego — we haven't heard back on your RX inquiry. Book when ready: ${book} ${phone} Reply STOP to opt out.`;
}
