#!/usr/bin/env node
/**
 * Publish RE GEN campaign posts to Facebook, Instagram, and Google Business.
 *
 *   node scripts/publish-regen-social-now.mjs --slug=regen-launch
 *   node scripts/publish-regen-social-now.mjs --slug=regen-trust --channels=google,facebook
 */

const SITE_URL = (process.env.SITE_URL || "https://www.hellogorgeousmedspa.com").replace(/\/$/, "");
const RX_URL = `${SITE_URL}/rx`;

const POSTS = {
  "regen-launch": {
    label: "RE GEN launch — Google + Facebook + Instagram",
    channels: ["google", "facebook", "instagram"],
    message: `Introducing RE GEN — prescription weight loss, peptides & hormones, delivered to your door in Illinois. 💊✨

No waiting rooms. No endless appointments. Just real prescriptions from real providers at Hello Gorgeous Med Spa, shipped from US pharmacies.

→ GLP-1 weight loss from $125/mo
→ Peptide protocols $175–$200/mo
→ NAD+ $150 / 10-week supply
→ TRT & HRT — provider-guided

Start your 5-minute intake today 👇

Ryan Kent, FNP-BC · Danielle Alcala, RN-S · Oswego, IL

#ReGen #HelloGorgeous #WeightLoss #Semaglutide #Tirzepatide #Peptides #HormoneTherapy #TeleHealth #Illinois #OswegoIL`,
    link: RX_URL,
    imagePath: "/promo-kit/regen-social-provider.jpg",
  },
  "regen-trust": {
    label: "RE GEN trust — Google + Facebook",
    channels: ["google", "facebook"],
    message: `Your health deserves more than a sketchy website. 🩺

RE GEN is the prescription arm of Hello Gorgeous Med Spa — a real clinic in Oswego, IL with providers you can call.

✓ Board-certified nurse practitioners on site
✓ US-licensed compounding pharmacies
✓ Transparent pricing — no hidden fees
✓ Real support: (630) 636-6193

Medical weight loss · peptides · hormones — gorgeous, delivered.

Start your intake 👇`,
    link: RX_URL,
    imagePath: "/images/regen/regen-brand-banner.jpg",
  },
  "regen-weight-loss": {
    label: "RE GEN GLP-1 — Google + Facebook + Instagram",
    channels: ["google", "facebook", "instagram"],
    message: `Tired of diets that don't work? 💪

RE GEN offers NP-directed GLP-1 programs — compounded semaglutide & tirzepatide with transparent pricing from $125/mo.

✓ Online intake (5 min)
✓ Provider review by Ryan Kent, FNP-BC
✓ Shipped to your door across Illinois
✓ Flat $30 shipping

Start your weight loss intake 👇`,
    link: `${RX_URL}/weight-loss`,
    imagePath: "/brochure/assets/glp-weight-loss.png",
  },
};

async function postViaApi({ message, link, imagePath, channels }) {
  const body = { message, channels, link };
  if (imagePath) body.imageUrl = `${SITE_URL}${imagePath}`;
  const res = await fetch(`${SITE_URL}/api/social/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function main() {
  const slugArg = process.argv.find((a) => a.startsWith("--slug="));
  const channelsArg = process.argv.find((a) => a.startsWith("--channels="));
  const slug = slugArg?.split("=")[1];
  const channelOverride = channelsArg?.split("=")[1]?.split(",").filter(Boolean);

  if (!slug || !POSTS[slug]) {
    console.error("Usage: node scripts/publish-regen-social-now.mjs --slug=<slug>");
    console.error("Known:", Object.keys(POSTS).join(", "));
    process.exit(1);
  }

  const post = POSTS[slug];
  const channels = channelOverride ?? post.channels;
  console.log(`Publishing: ${post.label}`);
  console.log(`Channels: ${channels.join(", ")}`);
  console.log(`Site: ${SITE_URL}\n`);

  const { ok, status, data } = await postViaApi({
    message: post.message,
    link: post.link,
    imagePath: post.imagePath,
    channels,
  });
  if (!ok) {
    console.error(`✗ HTTP ${status}`, JSON.stringify(data, null, 2));
    process.exit(1);
  }
  for (const ch of channels) {
    const r = data.results?.[ch];
    console.log(`${ch}:`, r?.ok ? `✓ ${r.id || r.url || "posted"}` : `✗ ${r?.error || "skipped"}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
