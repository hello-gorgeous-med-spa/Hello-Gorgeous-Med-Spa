#!/usr/bin/env node
/**
 * Publish a blog article to Facebook + Google (production API).
 *
 *   node scripts/publish-blog-social-now.mjs --slug=aesthetic-injectables-anteage-pearl-oswego-il
 */

const SITE_URL = (process.env.SITE_URL || "https://www.hellogorgeousmedspa.com").replace(/\/$/, "");

const POSTS = {
  "botox-vs-dysport-vs-jeuveau-faq-oswego": {
    label: "Botox vs Dysport vs Jeuveau guide",
    message: `💉 NEW: Choose Your Glow — Botox vs Dysport vs Jeuveau at Hello Gorgeous Med Spa, Oswego IL

✨ Which neurotoxin fits YOUR face?
• Botox — precise, lip flip, masseter, the gold standard
• Dysport — faster onset, softer spread for forehead & 11s
• Jeuveau — modern aesthetic-first option

First-time Botox $10/unit · NP on site 7 days a week · authentic Allergan & Galderma products.

Read the full comparison 👇`,
    link: `${SITE_URL}/blog/botox-vs-dysport-vs-jeuveau-faq-oswego`,
    imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
  },
  "aesthetic-injectables-anteage-pearl-oswego-il": {
    label: "Injectables + AnteAGE P.E.A.R.L. blog",
    message: `✨ NEW on our blog: Your complete guide to injectables & regenerative skin at Hello Gorgeous — Oswego, IL

💉 Botox, Dysport, fillers, tear trough, PRF, Kybella & skin boosters
🧬 Why we built our regenerative menu around AnteAGE®
💎 Now offering AnteAGE P.E.A.R.L. — PDRN + exosomes/biosomes in one fusion treatment (pairs beautifully with RF microneedling)

NP on site 7 days a week · authentic products · medical oversight you can trust.

Read the full article 👇`,
    link: `${SITE_URL}/blog/aesthetic-injectables-anteage-pearl-oswego-il`,
    imagePath: "/images/homepage-services/anteage-md-brightening.png",
  },
};

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
  const slugArg = process.argv.find((a) => a.startsWith("--slug="));
  const slug = slugArg?.split("=")[1];
  if (!slug || !POSTS[slug]) {
    console.error("Usage: node scripts/publish-blog-social-now.mjs --slug=<known-slug>");
    console.error("Known:", Object.keys(POSTS).join(", "));
    process.exit(1);
  }

  const post = POSTS[slug];
  console.log(`Publishing: ${post.label}`);
  console.log(`Site: ${SITE_URL}\n`);

  const { ok, status, data } = await postViaApi(post);
  if (!ok) {
    console.error(`✗ HTTP ${status}`, JSON.stringify(data, null, 2));
    process.exit(1);
  }
  const fb = data.results?.facebook;
  const g = data.results?.google;
  console.log("Facebook:", fb?.ok ? `✓ ${fb.id || "posted"}` : `✗ ${fb?.error || "skipped"}`);
  console.log("Google:  ", g?.ok ? `✓ ${g.id || "posted"}` : `✗ ${g?.error || "skipped"}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
