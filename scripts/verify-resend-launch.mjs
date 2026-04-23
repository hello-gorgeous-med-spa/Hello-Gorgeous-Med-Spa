#!/usr/bin/env node
/**
 * Send a test message using the same env as production (Resend + staff inbox).
 * Run locally:  node --env-file=.env.local scripts/verify-resend-launch.mjs
 * Run in CI:   RESEND_API_KEY=... RESEND_FROM_EMAIL=... CONTACT_FORM_TO_EMAIL=... node scripts/verify-resend-launch.mjs
 *
 * Does not print API keys. On success you should see the email in CONTACT_FORM_TO_EMAIL (or SITE default).
 */
const key = process.env.RESEND_API_KEY;
const from =
  process.env.RESEND_FROM_EMAIL ||
  process.env.RESEND_FROM ||
  "Hello Gorgeous <onboarding@resend.dev>";
/* Default matches SITE.email in lib/seo when CONTACT_FORM_TO_EMAIL is unset. */
const to = process.env.CONTACT_FORM_TO_EMAIL || "hellogorgeousskin@yahoo.com";

if (!key) {
  console.error("Missing RESEND_API_KEY");
  process.exit(1);
}

const body = {
  from,
  to: [to],
  subject: `[Resend verify] Hello Gorgeous — ${new Date().toISOString()}`,
  text: [
    "This is a test from scripts/verify-resend-launch.mjs",
    "",
    "If you received this, Resend + From + To are configured correctly for Contour Lift and contact emails.",
    "",
    `From resolved: ${from}`,
    `To: ${to}`,
  ].join("\n"),
};

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  },
  body: JSON.stringify(body),
});

const json = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error("Resend HTTP", res.status);
  console.error("Response:", JSON.stringify(json, null, 2));
  console.error("");
  console.error("Common fixes:");
  console.error("- API key: create at https://resend.com/api-keys (must start with re_)");
  console.error("- FROM: use a verified domain in Resend, e.g. Hello Gorgeous <notify@mail.yourdomain.com>");
  console.error("- onboarding@resend.dev only works for limited test sends; add your real domain in Resend → Domains");
  process.exit(2);
}

console.log("OK — Resend accepted the message. ID:", json.id || json);
console.log("Check inbox for:", to);
process.exit(0);
