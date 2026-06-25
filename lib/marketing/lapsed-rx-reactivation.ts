/**
 * Oswego lapsed-client reactivation — staff one-click from command center.
 * RX-focused message (GLP-1 + peptides), separate campaign ID from weekly winback.
 */

import { SITE } from "@/lib/seo";
import {
  previewLapsedBlast,
  runSquareLapsedSmsBlast,
  type LapsedSmsBlastResult,
} from "@/lib/marketing/square-lapsed-sms-blast";

export const LAPSED_RX_CAMPAIGN_ID = "lapsed_rx_oswego_v1";

const BASE = () => process.env.NEXT_PUBLIC_APP_URL || SITE.url;

export function lapsedRxReactivationMessage(firstName: string): string {
  const name = firstName.trim() || "Friend";
  const book = `${BASE()}/book?utm_source=sms&utm_medium=staff&utm_campaign=lapsed_rx`;
  const peptides = `${BASE()}/peptides?utm_source=sms&utm_medium=staff&utm_campaign=lapsed_rx`;
  return `${name}, we miss you at Hello Gorgeous! GLP-1 from $249/mo · peptide consult $49 · free guides: ${peptides} Book: ${book} Reply STOP to opt out.`;
}

export async function runLapsedRxReactivation(options?: {
  dryRun?: boolean;
  maxBatch?: number;
}): Promise<LapsedSmsBlastResult> {
  return runSquareLapsedSmsBlast({
    campaignId: LAPSED_RX_CAMPAIGN_ID,
    messageForFirstName: lapsedRxReactivationMessage,
    dryRun: options?.dryRun,
    maxBatch: options?.maxBatch ?? 50,
  });
}

export async function previewLapsedRxReactivation() {
  return previewLapsedBlast(LAPSED_RX_CAMPAIGN_ID);
}
