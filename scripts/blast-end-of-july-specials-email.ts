#!/usr/bin/env npx tsx
/**
 * End-of-July specials EMAIL blast (Resend) to marketing email opt-ins.
 *
 *   npx tsx scripts/blast-end-of-july-specials-email.ts --dry-run
 *   npx tsx scripts/blast-end-of-july-specials-email.ts --send --i-understand-marketing-blast
 *   npx tsx scripts/blast-end-of-july-specials-email.ts --send --i-understand-marketing-blast --max=50
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FLYER = path.join(ROOT, "public/images/marketing/end-of-july-specials-2026.png");
const SITE = "https://www.hellogorgeousmedspa.com";
const BOOK = `${SITE}/book?ref=july31`;
const SUBJECT = "End of July specials — book by the 31st 💕";

function emailHtml(firstName: string, unsubscribeUrl: string): string {
  const name = firstName.trim() || "there";
  return `
<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#111;line-height:1.5">
  <p style="font-size:14px;letter-spacing:.12em;text-transform:uppercase;color:#E6007E;font-weight:700">Hello Gorgeous Med Spa</p>
  <h1 style="font-size:28px;margin:8px 0 4px">End of July Specials</h1>
  <p style="font-size:16px;margin:0 0 16px"><strong>Book by July 31st</strong></p>
  <p>Hi ${name},</p>
  <p>This week only — three offers worth coming in for:</p>
  <ul style="padding-left:18px">
    <li><strong>Injectables:</strong> Book 40 units, get 20 FREE <em>(savings $240)</em></li>
    <li><strong>Laser hair:</strong> Any area <strong>$59</strong></li>
    <li><strong>HydraFacial:</strong> Buy one, get one FREE — <strong>$99</strong> <em>(Marissa only)</em></li>
  </ul>
  <p style="margin:20px 0">
    <img src="cid:julyflyer" alt="End of July Specials — Hello Gorgeous Med Spa" style="width:100%;max-width:560px;height:auto;border-radius:12px;border:2px solid #000" />
  </p>
  <p style="background:#000;color:#fff;padding:14px 16px;border-radius:10px;font-size:14px;text-align:center">
    <strong>MD OVERSIGHT</strong><br/>
    Nurse Practitioner On Site (FNP-BC)<br/>
    <span style="color:#FFB8DC">Come in — we're friendly</span>
  </p>
  <p style="margin:24px 0">
    <a href="${BOOK}" style="display:inline-block;background:#FF2D8E;color:#fff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px">Book today →</a>
  </p>
  <p style="font-size:14px;color:#444">
    Call (630) 636-6193 · Text (630) 881-3398<br/>
    74 W. Washington St, Oswego IL<br/>
    <a href="${BOOK}" style="color:#E6007E">${BOOK}</a>
  </p>
  <p style="font-size:12px;color:#888;margin-top:28px">
    <a href="${unsubscribeUrl}" style="color:#888">Unsubscribe</a>
  </p>
</div>`.trim();
}

async function main() {
  const send = process.argv.includes("--send");
  const dryRun = !send || process.argv.includes("--dry-run");
  const maxArg = process.argv.find((a) => a.startsWith("--max="));
  const maxRecipients = maxArg ? Number(maxArg.split("=")[1]) : Infinity;

  if (send && !process.argv.includes("--i-understand-marketing-blast")) {
    console.error("Live send requires: --send --i-understand-marketing-blast");
    process.exit(1);
  }

  const { createAdminSupabaseClient } = await import("../lib/hgos/supabase");
  const { fetchCampaignRecipients } = await import("../lib/campaign-processor");
  const { getResendFromAddress } = await import("../lib/resend-config");
  const { isDeliverableMarketingEmail } = await import("../lib/email-eligibility");

  const admin = createAdminSupabaseClient();
  if (!admin) {
    console.error("Supabase not configured");
    process.exit(1);
  }

  let recipients = await fetchCampaignRecipients(admin);
  recipients = recipients.filter((r) => isDeliverableMarketingEmail(r.email));
  const total = recipients.length;
  if (Number.isFinite(maxRecipients)) recipients = recipients.slice(0, maxRecipients as number);

  console.log(dryRun ? "[DRY RUN]" : "[LIVE SEND]");
  console.log(`Email opt-ins: ${total} · targeting: ${recipients.length}`);
  console.log(`Subject: ${SUBJECT}`);
  console.log(`Flyer exists: ${fs.existsSync(FLYER)}`);

  if (dryRun) {
    console.log(JSON.stringify({ ok: true, dryRun: true, total, targeted: recipients.length }, null, 2));
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY missing");
    process.exit(1);
  }

  const flyerB64 = fs.readFileSync(FLYER).toString("base64");
  const from = getResendFromAddress();
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < recipients.length; i++) {
    const r = recipients[i];
    const unsubscribeUrl = `${SITE}/unsubscribe?email=${encodeURIComponent(r.email)}`;
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [r.email],
          subject: SUBJECT,
          html: emailHtml(r.firstName, unsubscribeUrl),
          text: `Hi ${r.firstName || "there"},\n\nEnd of July specials — book by July 31!\n\n• Injectables: 40 units + 20 FREE\n• Laser hair: any area $59\n• HydraFacial BOGO $99 (Marissa only)\n\nMD Oversight · FNP-BC on site\nBook: ${BOOK}\nCall (630) 636-6193\n\nUnsubscribe: ${unsubscribeUrl}`,
          attachments: [
            {
              filename: "end-of-july-specials.png",
              content: flyerB64,
              content_id: "julyflyer",
              content_type: "image/png",
            },
          ],
          headers: {
            "List-Unsubscribe": `<${unsubscribeUrl}>`,
          },
        }),
      });
      if (res.ok) sent++;
      else {
        failed++;
        const t = await res.text();
        errors.push(`${r.email}: ${res.status} ${t.slice(0, 120)}`);
      }
    } catch (e) {
      failed++;
      errors.push(`${r.email}: ${e instanceof Error ? e.message : String(e)}`);
    }
    if ((i + 1) % 50 === 0) {
      console.log(`Progress ${i + 1}/${recipients.length} · sent ${sent} · failed ${failed}`);
    }
    await new Promise((r) => setTimeout(r, 80));
  }

  console.log(JSON.stringify({ ok: sent > 0, dryRun: false, total, targeted: recipients.length, sent, failed, errors: errors.slice(0, 20) }, null, 2));
  if (sent === 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
