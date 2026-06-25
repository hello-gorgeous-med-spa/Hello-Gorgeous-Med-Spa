// ============================================================
// WIN-BACK AGENT
// Autonomous agent that contacts lapsed clients (90+ days)
// Runs weekly via cron, sends SMS with $25 off offer
// ============================================================

import { runSquareLapsedSmsBlast, type LapsedSmsBlastResult } from "@/lib/marketing/square-lapsed-sms-blast";

const CAMPAIGN_ID = "lapsed_winback_v1";

const WINBACK_MESSAGE = (firstName: string) =>
  `${firstName}, it's been a while! 💕 We'd love to see you — enjoy $25 off your next visit at Hello Gorgeous. Book before it expires: hellogorgeousmedspa.com/book`;

export type WinbackResult = LapsedSmsBlastResult;

export async function runWinbackAgent(options?: {
  dryRun?: boolean;
  maxBatch?: number;
}): Promise<WinbackResult> {
  return runSquareLapsedSmsBlast({
    campaignId: CAMPAIGN_ID,
    messageForFirstName: WINBACK_MESSAGE,
    dryRun: options?.dryRun,
    maxBatch: options?.maxBatch,
  });
}
