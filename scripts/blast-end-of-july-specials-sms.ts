#!/usr/bin/env npx tsx
/**
 * End-of-July specials SMS blast to Text Studio opt-ins.
 *
 *   npx tsx scripts/blast-end-of-july-specials-sms.ts --dry-run
 *   npx tsx scripts/blast-end-of-july-specials-sms.ts --send --i-understand-marketing-blast
 *   npx tsx scripts/blast-end-of-july-specials-sms.ts --send --i-understand-marketing-blast --max=50
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const MESSAGE = [
  "Hello Gorgeous: END OF JULY — book by 7/31!",
  "40 units + 20 FREE · Laser any area $59 · HydraFacial BOGO $99 (Marissa).",
  "MD oversight · FNP-BC on site.",
  "Book: hellogorgeousmedspa.com/book?ref=july31",
  "Reply STOP to opt out.",
].join(" ");

async function main() {
  const send = process.argv.includes("--send");
  const dryRun = !send || process.argv.includes("--dry-run");
  const maxArg = process.argv.find((a) => a.startsWith("--max="));
  const maxRecipients = maxArg ? Number(maxArg.split("=")[1]) : Infinity;

  if (send && !process.argv.includes("--i-understand-marketing-blast")) {
    console.error("Live send requires: --send --i-understand-marketing-blast");
    process.exit(1);
  }

  const { sendSMS } = await import("../lib/hgos/sms-marketing");
  const { getTwilioSmsConfig } = await import("../lib/hgos/twilio-config");
  const { createAdminSupabaseClient } = await import("../lib/hgos/supabase");
  const { fetchSmsStudioRecipients } = await import("../lib/sms-studio");

  console.log(dryRun ? "[DRY RUN]" : "[LIVE SEND]");
  console.log("Message chars:", MESSAGE.length);
  console.log(MESSAGE);
  console.log("---");

  const admin = createAdminSupabaseClient();
  if (!admin) {
    console.error("Supabase not configured");
    process.exit(1);
  }

  const twilio = getTwilioSmsConfig();
  if (!twilio && !dryRun) {
    console.error("Twilio not configured");
    process.exit(1);
  }

  let recipients = await fetchSmsStudioRecipients(admin);
  const totalOptIn = recipients.length;
  if (Number.isFinite(maxRecipients)) {
    recipients = recipients.slice(0, maxRecipients as number);
  }

  console.log(`Opt-ins available: ${totalOptIn}`);
  console.log(`Will ${dryRun ? "preview" : "send"} to: ${recipients.length}`);

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < recipients.length; i++) {
    const r = recipients[i];
    if (dryRun) {
      sent++;
      continue;
    }
    try {
      const res = await sendSMS({ to: r.phoneE164, body: MESSAGE }, twilio!);
      if (res.success) sent++;
      else {
        failed++;
        if (res.error) errors.push(`${r.phoneE164}: ${res.error}`);
      }
    } catch (e) {
      failed++;
      errors.push(e instanceof Error ? e.message : String(e));
    }
    if ((i + 1) % 25 === 0) {
      console.log(`Progress ${i + 1}/${recipients.length} · sent ${sent} · failed ${failed}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  console.log(
    JSON.stringify(
      {
        ok: sent > 0 || dryRun,
        dryRun,
        totalOptIn,
        targeted: recipients.length,
        sent,
        failed,
        errors: errors.slice(0, 25),
      },
      null,
      2,
    ),
  );
  if (!dryRun && sent === 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
