#!/usr/bin/env npx tsx
/**
 * FlowWave marketing blast to opted-in clients (email + SMS).
 *
 *   npx tsx scripts/blast-flowwave-marketing.ts --dry-run
 *   npx tsx scripts/blast-flowwave-marketing.ts --send --i-understand-marketing-blast --max=50
 */

import { runFlowwaveMarketingBlast } from "../lib/marketing/flowwave-client-blast";

async function main() {
  const send = process.argv.includes("--send");
  const dryRun = !send || process.argv.includes("--dry-run");
  const emailOnly = process.argv.includes("--email-only");
  const smsOnly = process.argv.includes("--sms-only");
  const maxArg = process.argv.find((a) => a.startsWith("--max="));
  const maxRecipients = maxArg ? Number(maxArg.split("=")[1]) : 200;

  if (send && !process.argv.includes("--i-understand-marketing-blast")) {
    console.error("Live send requires: --send --i-understand-marketing-blast");
    process.exit(1);
  }

  console.log(`FlowWave marketing blast ${dryRun ? "[DRY RUN]" : "[LIVE SEND]"}`);

  const result = await runFlowwaveMarketingBlast({
    dryRun,
    maxRecipients,
    emailOnly,
    smsOnly,
  });

  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
