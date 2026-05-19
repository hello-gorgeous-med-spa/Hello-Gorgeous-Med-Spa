#!/usr/bin/env node
/**
 * Publish lip filler + Solaria CO2 promo flyers to Facebook & Google Business.
 * Images must be live on SITE_URL first (deploy before running).
 *
 *   node --env-file=.env.local scripts/publish-promo-flyers-now.mjs
 *   SITE_URL=https://www.hellogorgeousmedspa.com node --env-file=.env.local scripts/publish-promo-flyers-now.mjs
 */

const SITE_URL = (process.env.SITE_URL || "https://www.hellogorgeousmedspa.com").replace(/\/$/, "");

const POSTS = [
  {
    label: "Lip Filler",
    message: `💋 Lip Filler at Hello Gorgeous — Enhance. Hydrate. Elevate.

✨ Natural shape & volume
💧 Softer, smoother lips
✨ Subtle, confidence-boosting results
⏱ Quick treatment · minimal downtime

$450 for 1 syringe · $399 each when you book 2 syringes

Family-owned med spa in Oswego · NP on site 7 days a week.
Beautifully you. Confidently gorgeous. Book your lip filler today!`,
    link: `${SITE_URL}/lip-filler-oswego`,
    imagePath: "/images/promo/lip-filler-promo-flyer.png",
  },
  {
    label: "Solaria CO2",
    message: `✨ Solaria CO₂ at Hello Gorgeous — gold-standard fractional skin resurfacing.

Renew · Rejuvenate · Reveal radiance

Treats fine lines, texture, sun damage, acne scars & pores — with personalized depth and medical oversight.

The only Solaria CO₂ in the western Chicago suburbs (Oswego · Naperville · Aurora · Plainfield).

Book your free consultation — link below.`,
    link: `${SITE_URL}/solaria-co2-oswego`,
    imagePath: "/images/promo/solaria-co2-promo-flyer.png",
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
  console.log(`Publishing ${POSTS.length} promo flyers → Facebook + Google`);
  console.log(`Site: ${SITE_URL}\n`);

  for (const post of POSTS) {
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
