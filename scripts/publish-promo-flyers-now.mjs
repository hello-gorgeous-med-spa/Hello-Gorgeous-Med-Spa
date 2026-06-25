#!/usr/bin/env node
/**
 * Publish promo flyers to Facebook & Google Business.
 * Images must be live on SITE_URL first (deploy before running).
 *
 *   node scripts/publish-promo-flyers-now.mjs --only=signature-treatment-menu
 *   node scripts/publish-promo-flyers-now.mjs
 */

const SITE_URL = (process.env.SITE_URL || "https://www.hellogorgeousmedspa.com").replace(/\/$/, "");

const ALL_POSTS = [
  {
    id: "lip-filler-promo",
    label: "Lip Filler",
    message: `💋 Lip Filler at Hello Gorgeous — Enhance. Hydrate. Elevate.

✨ Natural shape & volume · $450 / 1 syringe · $399 each for 2

Book on Fresha — Oswego · NP on site 7 days a week.`,
    link: `${SITE_URL}/lip-filler-oswego`,
    imagePath: "/images/promo/lip-filler-promo-flyer.png",
  },
  {
    id: "solaria-co2-promo",
    label: "Solaria CO2",
    message: `✨ Solaria CO₂ — gold-standard skin resurfacing at Hello Gorgeous Oswego.

Renew · Rejuvenate · Reveal radiance · $899 full resurfacing

Book your free consultation on Fresha.`,
    link: `${SITE_URL}/solaria-co2-oswego`,
    imagePath: "/images/promo/solaria-co2-promo-flyer.png",
  },
  {
    id: "peak-performance-profile",
    label: "Peak Performance Profile — $199 lab panel",
    message: `🔬 Peak Performance Profile — $199 Cash Pay | Hello Gorgeous Med Spa · Oswego, IL

Wellness lab panel for energy, hormones, metabolism & heart health — results typically in 24 hours. No insurance required.

✓ Hormone snapshot · metabolic check · energy + thyroid markers
For women + men who want real data behind wellness, weight, hormones & performance.

Ryan Kent, FNP-BC · serving Naperville, Aurora & Plainfield.
Book your lab panel — link below.`,
    link: `${SITE_URL}/app?utm_source=social&utm_medium=peak_performance_profile&utm_campaign=lab_panel_199`,
    imagePath: "/images/promo/peak-performance-profile-flyer.png",
  },
  {
    id: "signature-treatment-menu",
    label: "Signature Treatment Menu",
    message: `✨ Signature Treatment Menu at Hello Gorgeous Med Spa — Oswego, IL

💉 First-time Botox $10/unit
💋 Lip filler $450 (2 syringes $399 each)
⚡ Quantum RF — chin/neck $2,400 · abdomen $3,999
🔥 Morpheus8 Burst — 3 for $1,999
✨ Solaria CO₂ full resurfacing — $899
👑 Trifecta: Morpheus8 + Quantum RF + FREE Solaria CO₂

Family-owned · NP on site 7 days a week.
Beautifully you. Confidently gorgeous.

Book on Fresha — link below.`,
    link: `${SITE_URL}/specials`,
    imagePath: "/images/promo/signature-treatment-menu-poster.png",
  },
];

async function postViaApi({ label, message, link, imagePath }) {
  const imageUrl = `${SITE_URL}${imagePath}`;
  const res = await fetch(`${SITE_URL}/api/social/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      channels: ["facebook", "google"],
      link,
      imageUrl,
    }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function main() {
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const onlyId = onlyArg?.split("=")[1];
  const posts = onlyId ? ALL_POSTS.filter((p) => p.id === onlyId) : ALL_POSTS;

  if (posts.length === 0) {
    console.error(`No posts matched --only=${onlyId}`);
    process.exit(1);
  }

  console.log(`Publishing ${posts.length} promo(s) → Facebook + Google`);
  console.log(`Site: ${SITE_URL}\n`);

  for (const post of posts) {
    console.log(`— ${post.label}`);
    const { ok, status, data } = await postViaApi(post);
    if (!ok) {
      console.log(`  ✗ HTTP ${status}`, JSON.stringify(data, null, 2));
      continue;
    }
    const fb = data.results?.facebook;
    const g = data.results?.google;
    console.log(`  Facebook:`, fb?.ok ? `✓ ${fb.id || "posted"}` : `✗ ${fb?.error || "skipped"}`);
    console.log(`  Google:  `, g?.ok ? `✓ ${g.id || "posted"}` : `✗ ${g?.error || "skipped"}`);
    console.log("");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
