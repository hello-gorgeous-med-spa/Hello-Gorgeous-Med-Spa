#!/usr/bin/env node
/**
 * Publish Marissa’s New Services flyer to Google Business Profile.
 * Image must be live on SITE_URL first (deploy before running).
 *
 *   node scripts/publish-marissa-gbp-now.mjs
 */

const SITE_URL = (process.env.SITE_URL || "https://www.hellogorgeousmedspa.com").replace(/\/$/, "");

const message = `✨ Marissa’s New Services — Hello Gorgeous Med Spa, Oswego IL

Marissa Murray · Licensed Esthetician · Certified Lash Artist

👁 Full set eyelash extensions — ONLY $89
Beginning August 1st — book ahead with Marissa

⚡ Laser hair removal — ANY listed area ONLY $59
Now through the end of the month
Face · Neck/Chin · Underarm · Upper legs · Lower legs · Back · Bikini · Brazilian

Also featuring dermaplaning & Hydra Spa Infusion

BOOK NOW WITH MARISSA
74 W Washington St, Oswego
(630) 636-6193`;

async function main() {
  const imageUrl = `${SITE_URL}/images/marketing/marissa-new-services-flyer.jpg`;
  const link = `${SITE_URL}/oswego-specials?utm_source=google&utm_medium=gbp_post&utm_campaign=marissa_new_services`;

  // Confirm image is publicly reachable before GBP fetch
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

  console.log("Publishing Marissa’s New Services to Google Business Profile…");
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
