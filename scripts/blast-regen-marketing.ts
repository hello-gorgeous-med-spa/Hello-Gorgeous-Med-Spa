#!/usr/bin/env npx tsx
/**
 * RE GEN marketing blast to opted-in clients (email + SMS).
 *
 *   npx tsx scripts/blast-regen-marketing.ts --dry-run
 *   npx tsx scripts/blast-regen-marketing.ts --send --max=50
 *   npx tsx scripts/blast-regen-marketing.ts --send --email-only
 */

import { runRegenMarketingBlast } from "../lib/marketing/regen-client-blast";

async function main() {
  const send = process.argv.includes("--send");
  const dryRun = !send || process.argv.includes("--dry-run");
  const emailOnly = process.argv.includes("--email-only");
  const smsOnly = process.argv.includes("--sms-only");
  const maxArg = process.argv.find((a) => a.startsWith("--max="));
  const maxRecipients = maxArg ? Number(maxArg.split("=")[1]) : 200;

  if (send && !process.argv.includes("--i-understand-marketing-blast")) {
    console.error("Live send requires: --send --i-understand-marketing-blast");
    console.error("Preview first: npx tsx scripts/blast-regen-marketing.ts --dry-run");
    process.exit(1);
  }

  console.log(`RE GEN marketing blast ${dryRun ? "[DRY RUN]" : "[LIVE SEND]"}`);
  console.log(`Max recipients: ${maxRecipients}`);
  console.log(`Mode: ${emailOnly ? "email only" : smsOnly ? "sms only" : "email + sms (opt-in)"}\n`);

  const result = await runRegenMarketingBlast({
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
