#!/usr/bin/env node
/**
 * Publish Solaria CO₂ $599 fall flyer to Google Business Profile.
 * Image must be live on SITE_URL first (deploy before running).
 *
 *   node scripts/publish-solaria-fall-599-gbp-now.mjs
 */

const SITE_URL = (process.env.SITE_URL || "https://www.hellogorgeousmedspa.com").replace(/\/$/, "");

const message = `Your skin — renewed.

InMode Solaria CO₂ fractional resurfacing at Hello Gorgeous Medical Spa in downtown Oswego.

One treatment designed to help smoother, brighter, firmer-looking skin.

What it targets:
• Fine lines + wrinkles
• Acne scars
• Sun damage + brown spots
• Uneven texture + enlarged pores
• Mild skin laxity

Limited-time fall special: $599
Complimentary recovery serum included
Limited appointments available

Book your consultation
(630) 636-6193

Results vary. Consultation required.
74 W Washington St, Oswego IL`;

async function main() {
  const imageUrl = `${SITE_URL}/images/marketing/solaria-fall-599-2026.png`;
  const link = `${SITE_URL}/services/solaria-co2?utm_source=google&utm_medium=gbp_post&utm_campaign=solaria_fall_599_2026`;

  const imgCheck = await fetch(imageUrl, { method: "HEAD" });
  if (!imgCheck.ok) {
    console.error(`✗ Flyer not live yet (${imgCheck.status}): ${imageUrl}`);
    console.error("Deploy to main first, then re-run this script.");
    process.exit(1);
  }

  const body = {
    message,
    link,
    imageUrl,
    channels: ["google"],
  };

  console.log("Publishing Solaria CO₂ $599 fall special to Google Business Profile…");
  console.log(`Image: ${imageUrl}`);
  console.log(`Link:  ${link}\n`);

  const res = await fetch(`${SITE_URL}/api/social/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("✗ HTTP", res.status, JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const g = data.results?.google;
  console.log("Google:", g?.ok ? `✓ posted ${g.id ?? ""}` : `✗ ${g?.error ?? "failed"}`);
  if (!g?.ok) {
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
