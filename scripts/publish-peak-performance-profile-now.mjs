#!/usr/bin/env node
/**
 * Publish Peak Performance Profile ($199 lab panel) to Facebook + Google Business.
 * Deploy first so the image is live at SITE_URL.
 *
 *   node scripts/publish-peak-performance-profile-now.mjs
 */

const SITE_URL = (process.env.SITE_URL || "https://www.hellogorgeousmedspa.com").replace(/\/$/, "");
const IMAGE_PATH = "/images/promo/peak-performance-profile-flyer.png";
const LINK = `${SITE_URL}/app?utm_source=social&utm_medium=peak_performance_profile&utm_campaign=lab_panel_199`;

const FACEBOOK_MESSAGE = `🔬 Peak Performance Profile — $199 Cash Pay | Hello Gorgeous Med Spa · Oswego, IL

A wellness lab panel for energy, hormones, metabolism & heart health — results typically in 24 hours. No insurance required.

✓ Hormone snapshot — estrogen, progesterone, testosterone, FSH, LH, SHBG, DHEA-S
✓ Metabolic check — A1C, lipids, kidney/liver markers & chemistry panel
✓ Energy + thyroid — TSH, Vitamin B12 & CBC markers

For women + men who want real data behind wellness, weight, hormones & performance.

Ryan Kent, FNP-BC on site 7 days a week · serving Naperville, Aurora & Plainfield.

👉 Book your lab panel: hellogorgeousmedspa.com/app`;

const GOOGLE_MESSAGE = `🔬 Peak Performance Profile — $199 cash pay | Hello Gorgeous Med Spa · Oswego, IL

Wellness lab panel for energy, hormones, metabolism & heart health. Results typically in 24 hours — no insurance required.

Includes hormone snapshot (estradiol, progesterone, testosterone, FSH, LH, SHBG, DHEA-S), metabolic check (A1C, lipids, kidney/liver), energy + thyroid (TSH, B12, CBC).

For women & men who want real data behind wellness, weight, hormones & performance.

Ryan Kent, FNP-BC · downtown Oswego · Naperville, Aurora & Plainfield.

Book: hellogorgeousmedspa.com/app`;

async function post({ label, message, channels }) {
  const imageUrl = `${SITE_URL}${IMAGE_PATH}`;
  console.log(`Publishing → ${label} (${channels.join(", ")})…`);

  const res = await fetch(`${SITE_URL}/api/social/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, channels, link: LINK, imageUrl }),
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
  console.log(`Image: ${SITE_URL}${IMAGE_PATH}`);
  console.log(`Link: ${LINK}\n`);

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
