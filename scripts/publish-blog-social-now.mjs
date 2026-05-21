#!/usr/bin/env node
/**
 * Publish a blog article to Facebook + Google (production API).
 *
 *   node scripts/publish-blog-social-now.mjs --slug=aesthetic-injectables-anteage-pearl-oswego-il
 */

const SITE_URL = (process.env.SITE_URL || "https://www.hellogorgeousmedspa.com").replace(/\/$/, "");

const POSTS = {
  "quantum-rf-knees-jen-before-after": {
    label: "Quantum RF knees — Jen before/after",
    channels: ["facebook", "google"],
    message: `✨ REAL Quantum RF results — thighs & knees at Hello Gorgeous Med Spa, Oswego IL

Subdermal RF contouring — tighter skin, smoother texture, less laxity above the knees. No surgery. No extended downtime.

👩‍⚕️ Ryan Kent, FNP-BC on site 7 days a week
📍 Only western suburbs practice with Quantum RF + full InMode Trifecta

Individual results vary. Free consultation — link below 👇`,
    link: `${SITE_URL}/quantum-rf-oswego-il`,
    imagePath: "/gallery/quantum-rf-client-results/jen-knees-before-after.png",
  },
  "founder-letter-morpheus8-solaria-oswego-il": {
    label: "Founder's letter — Morpheus8 & Solaria",
    channels: ["facebook", "google"],
    message: `💌 NEW: A letter from Danielle — founder of Hello Gorgeous Med Spa, Oswego IL

Why she invested $500K+ in Morpheus8 Burst & Solaria CO₂ (not the TikTok trend of the month):

🧬 Morpheus8 — rebuild collagen from underneath (up to 8mm depth)
✨ Solaria CO₂ — gold-standard surface resurfacing
👩‍⚕️ Ryan Kent FNP-BC on site 7 days · honest consults · no pressure

Read the full founder's letter 👇`,
    link: `${SITE_URL}/blog/founder-letter-morpheus8-solaria-oswego-il`,
    imagePath: "/images/blog/founder-letter-morpheus-solaria-1.png",
  },
  "founder-letter-morpheus8-solaria-fb-short": {
    label: "Founder's letter — Facebook short",
    channels: ["facebook"],
    skipImage: true,
    message: `Letter from Dani: why Hello Gorgeous invested in Morpheus8 + Solaria CO₂ — not hype. Oswego med spa. Read 👇`,
    link: `${SITE_URL}/blog/founder-letter-morpheus8-solaria-oswego-il`,
  },
  "what-makes-hello-gorgeous-different-oswego-il": {
    label: "What makes HG different",
    channels: ["facebook", "google"],
    skipImage: true,
    message: `What makes Hello Gorgeous different in Oswego?

✓ ONLY western suburbs med spa with ALL 3 InMode devices — Morpheus8 · Solaria CO₂ · Quantum RF
✓ Ryan Kent FNP-BC on site 7 DAYS a week
✓ Open 7 days · same-day appointments
✓ Family-owned 10+ years — Dani still in the chair

Read the full story 👇`,
    link: `${SITE_URL}/blog/what-makes-hello-gorgeous-different-oswego-il`,
    imagePath: "/images/home/morpheus8-burst-verified-provider-inmode.png",
  },
  "salmon-dna-sculptra-ipl-oswego-il-med-spa-guide": {
    label: "Salmon DNA · Sculptra · IPL Oswego guide",
    channels: ["facebook", "google"],
    message: `🔍 Searching for salmon DNA, Sculptra, or IPL in Oswego?

Hello Gorgeous Med Spa has offered advanced skin & injectables in the Fox Valley for 10+ YEARS — here's what we actually provide:

🧬 Salmon DNA / PDRN Glass Facial (Red Carpet glow)
💎 Sculptra & biostimulator collagen treatments
💡 Lumecca IPL photofacial — sun spots & redness

Plus Morpheus8 · Solaria CO₂ · Quantum RF under one roof.

Read the full Oswego guide 👇`,
    link: `${SITE_URL}/blog/salmon-dna-sculptra-ipl-oswego-il-med-spa-guide`,
    imagePath: "/images/ipl-photofacial/ipl-photofacial-zemits-treatment-hero.png",
  },
  "salmon-dna-sculptra-ipl-oswego-fb-short": {
    label: "Comparison guide — Facebook (short)",
    channels: ["facebook"],
    skipImage: true,
    message: `Salmon DNA, Sculptra & Lumecca IPL in Oswego — all at Hello Gorgeous Med Spa.

10+ years in the Fox Valley. Full guide on our site 👇`,
    link: `${SITE_URL}/blog/salmon-dna-sculptra-ipl-oswego-il-med-spa-guide`,
  },
  "gbp-sculptra-oswego": {
    label: "Google Business — Sculptra Oswego",
    channels: ["google"],
    message: `💎 Sculptra & biostimulator treatments in Oswego, IL

Build collagen gradually — temples, cheeks, jawline & skin quality over time (not instant filler).

✓ Hello Gorgeous Med Spa — 10+ years downtown Oswego
✓ Ryan Kent, FNP-BC on site 7 days a week
✓ Free consultation

📍 74 W Washington St, Oswego
📞 630-636-6193`,
    link: `${SITE_URL}/sculptra-oswego-il`,
    imagePath: "/images/services/hg-dermal-fillers.png",
  },
  "gbp-salmon-dna-oswego": {
    label: "Google Business — Salmon DNA facial",
    channels: ["google"],
    message: `🧬 Salmon DNA Glass Facial / PDRN in Oswego, IL

Red Carpet glow protocol — repair, hydration & event-ready radiance.

Optional add-ons: microneedling · Lumecca IPL · chemical peel
Also: AnteAGE P.E.A.R.L. regenerative treatments

Hello Gorgeous Med Spa · Oswego · Naperville · Aurora area
Free consult — link below`,
    link: `${SITE_URL}/salmon-dna-oswego-il`,
    imagePath: "/images/homepage-services/anteage-md-brightening.png",
  },
  "gbp-lumecca-ipl-oswego": {
    label: "Google Business — Lumecca IPL",
    channels: ["google"],
    message: `💡 Lumecca IPL Photofacial — Oswego, IL

Fade sun spots, age spots, redness & rosacea. Results often visible in 7–10 days.

From $250 · Hello Gorgeous Med Spa
Serving Oswego, Naperville, Aurora & the Fox Valley — 10+ years

Book free consultation 👇`,
    link: `${SITE_URL}/ipl-photofacial-oswego-il`,
    imagePath: "/images/ipl-photofacial/ipl-photofacial-zemits-treatment-hero.png",
  },
  "we-arent-just-a-botox-clinic-hello-gorgeous-oswego-il": {
    label: "HG identity — founder's letter",
    message: `✨ A note from Danielle, founder of Hello Gorgeous Med Spa — Oswego, IL

We aren't just a Botox clinic.

We specialize in YOUR health — not selling syringes.

💗 We don't want your money. We want your smile.
👩‍⚕️ Ryan Kent, FNP-BC on site 7 days a week
🔬 $500K+ in Morpheus8 · Solaria CO₂ · Quantum RF technology

Give us 10 minutes. No pressure. Just a real conversation.

Read the full founder's letter 👇`,
    link: `${SITE_URL}/blog/we-arent-just-a-botox-clinic-hello-gorgeous-oswego-il`,
    imagePath: "/images/team/danielle.png",
  },
  "male-female-practitioners-med-spa-advantage-oswego-il": {
    label: "Male & female practitioners advantage",
    message: `At Hello Gorgeous Med Spa in Oswego, IL — you do not just get one perspective. You get a team.

👩 Danielle Alcala-Glazier — aesthetics, skin, the client experience you can relate to
👨 Ryan Kent, FNP-BC — medical director on site 7 days a week, structure, symmetry & clinical care

More comfort. Smarter plans. Better balance for men & women.

Read why our male + female provider team is a real advantage 👇`,
    link: `${SITE_URL}/blog/male-female-practitioners-med-spa-advantage-oswego-il`,
    imagePath: "/images/providers/ryan-kent-clinic.jpg",
  },
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

async function postViaApi({ message, link, imagePath, channels, skipImage }) {
  const body = {
    message,
    channels: channels ?? ["facebook", "google"],
    link,
  };
  if (imagePath && !skipImage) {
    body.imageUrl = `${SITE_URL}${imagePath}`;
  }
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
  const slug = slugArg?.split("=")[1];
  if (!slug || !POSTS[slug]) {
    console.error("Usage: node scripts/publish-blog-social-now.mjs --slug=<known-slug>");
    console.error("Known:", Object.keys(POSTS).join(", "));
    process.exit(1);
  }

  const post = POSTS[slug];
  console.log(`Publishing: ${post.label}`);
  console.log(`Site: ${SITE_URL}\n`);

  const { ok, status, data } = await postViaApi({
    message: post.message,
    link: post.link,
    imagePath: post.imagePath,
    channels: post.channels,
    skipImage: post.skipImage,
  });
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
