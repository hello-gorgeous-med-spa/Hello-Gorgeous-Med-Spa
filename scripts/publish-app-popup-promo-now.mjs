#!/usr/bin/env node
/**
 * Publish Hello Gorgeous app popup promo to Facebook + Google Business.
 * Deploy first so the image is live at SITE_URL.
 *
 *   node scripts/publish-app-popup-promo-now.mjs
 */

const SITE_URL = (process.env.SITE_URL || "https://www.hellogorgeousmedspa.com").replace(/\/$/, "");
const IMAGE_PATH = "/images/marketing/hello-gorgeous-app-popup-promo.png";

const FACEBOOK_MESSAGE = `📱 Get the Hello Gorgeous App — Oswego, IL

Scan the QR · add to your home screen in seconds. No App Store download.

✓ Book Botox, facials, Morpheus8 & more
✓ Build Your IV Bag from $89
✓ Vitamin Bar · deals · gift cards · rewards
✓ Add to home screen — one tap forever

Ryan Kent, FNP-BC on site 7 days a week · serving Naperville, Aurora & Plainfield.

👉 Open the app: hellogorgeousmedspa.com/app`;

const GOOGLE_MESSAGE = `📱 Get the Hello Gorgeous App | Oswego, IL

Your med spa in your pocket — scan our QR and add to your home screen in seconds. No App Store.

✓ Book Botox, facials, Morpheus8 & medical weight loss
✓ Build Your IV Bag from $89
✓ Vitamin Bar · deals · gift cards · HG Rewards
✓ Add to home screen — one tap forever

Ryan Kent, FNP-BC · downtown Oswego at 74 W Washington St · Naperville, Aurora & Plainfield.

Open the app: hellogorgeousmedspa.com/app`;

async function post({ label, message, channels }) {
  const imageUrl = `${SITE_URL}${IMAGE_PATH}`;
  const link = `${SITE_URL}/app?utm_source=social&utm_medium=app_popup_promo&utm_campaign=get_app_jun2026`;

  console.log(`Publishing → ${label} (${channels.join(", ")})…`);

  const res = await fetch(`${SITE_URL}/api/social/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, channels, link, imageUrl }),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error(`  ✗ HTTP ${res.status}`, JSON.stringify(data, null, 2));
    return false;
  }

  for (const ch of channels) {
    const r = data.results?.[ch];
    console.log(`  ${ch}:`, r?.ok ? `✓ ${r.id || "posted"}` : `✗ ${r?.error || "failed"}`);
    if (!r?.ok) return false;
  }
  return true;
}

async function main() {
  console.log(`Site: ${SITE_URL}`);
  console.log(`Image: ${SITE_URL}${IMAGE_PATH}\n`);

  const fbOk = await post({
    label: "Facebook",
    message: FACEBOOK_MESSAGE,
    channels: ["facebook"],
  });
  console.log("");

  const gOk = await post({
    label: "Google Business",
    message: GOOGLE_MESSAGE,
    channels: ["google"],
  });

  if (!fbOk || !gOk) process.exit(1);
  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
