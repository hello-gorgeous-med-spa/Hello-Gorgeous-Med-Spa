#!/usr/bin/env node
/**
 * Publish a blog article to Facebook + Google (production API).
 *
 *   node scripts/publish-blog-social-now.mjs --slug=aesthetic-injectables-anteage-pearl-oswego-il
 */

const SITE_URL = (process.env.SITE_URL || "https://www.hellogorgeousmedspa.com").replace(/\/$/, "");

const POSTS = {
  "quantum-rf-launch-google": {
    label: "Quantum RF launch — Google Business",
    channels: ["google"],
    message: `⚡ NEW at Hello Gorgeous — InMode Quantum RF body contouring · Oswego, IL

Lipo-level results. No surgery. No operating room.

Neck package — $2,499 · includes FREE Morpheus8 Burst ($1,200 value)
Abdomen package — $3,999 · includes FREE Morpheus8 Burst ($1,500 value)

✓ Local anesthesia only · 1 session · 5–7 day recovery
✓ Ryan Kent, FNP-BC · Danielle Alcala, RN-S
✓ Cherry financing — as low as 0% APR

Free consultation — link below.`,
    link: `${SITE_URL}/quantum-rf-oswego-il`,
    imagePath: "/images/promo/quantum-rf-launch-flyer.png",
  },
  "quantum-rf-launch-facebook": {
    label: "Quantum RF launch — Facebook",
    channels: ["facebook"],
    message: `✨ The New Standard in Body Contouring — NOW at Hello Gorgeous Med Spa, Oswego IL

Lipo results. No surgery. No operating room.

NOW INTRODUCING · INMODE QUANTUM RF

Neck Quantum RF Package — $2,499
→ Neck tightening + fat reduction + skin contraction
→ FREE Morpheus8 Burst ($1,200 value)

Abdomen Quantum RF Package — $3,999 ⭐ BEST VALUE
→ Abdomen contouring + post-GLP-1 skin laxity
→ FREE Morpheus8 Burst ($1,500 value)

1 session · local anesthesia · 5–7 day recovery · results build up to 6 months

Ryan Kent, FNP-BC & Danielle Alcala, RN-S
Cherry: pay.withcherry.com/hellogorgeous

Book your free consult 👇`,
    link: `${SITE_URL}/quantum-rf-oswego-il`,
    imagePath: "/images/promo/quantum-rf-launch-flyer.png",
  },
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
  "which-peptide-is-right-for-you-oswego-il": {
    label: "Which peptide is right for you — guide",
    channels: ["facebook", "google"],
    message: `🧬 Curious which peptide is for YOU?

Recovery · skin & collagen · body composition · longevity · energy · focus — match your goal to what we actually discuss at Hello Gorgeous Med Spa, Oswego IL.

NP-led Hello Gorgeous RX™ · Ryan Kent FNP-BC on site 7 days a week.

Read the goal-based guide 👇`,
    link: `${SITE_URL}/blog/which-peptide-is-right-for-you-oswego-il`,
    imagePath: "/images/peptides/peptide-cheat-sheet-full.png",
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
  "hello-gorgeous-app-launch-google": {
    label: "Hello Gorgeous app — full launch (Google)",
    channels: ["google"],
    message: `📱 NEW — The Hello Gorgeous client app is live (Oswego, IL)

Your med spa in your pocket — no App Store. Scan our QR or open hellogorgeousmedspa.com/app · Add to Home Screen.

What's inside:
✓ Book — Botox, facials, Morpheus8, weight loss & more
✓ Build Your IV Bag — from $89 · most custom bags $150–$199
✓ Vitamin Bar shots · deals · gift cards · memberships
✓ HG Rewards points · loyalty tiers · birthday perks
✓ GLP-1 screening · peptides · hormones · supplements
✓ Client portal · appointments · documents · referrals

Scan QR: hellogorgeousmedspa.com/get-app
Ryan Kent, FNP-BC · serving Naperville, Aurora & Plainfield.`,
    link: `${SITE_URL}/get-app`,
    imagePath: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
  },
  "hello-gorgeous-app-launch-facebook": {
    label: "Hello Gorgeous app — full launch (Facebook)",
    channels: ["facebook"],
    message: `📱 YOUR med spa. In YOUR pocket. The Hello Gorgeous app is LIVE!

No App Store download — scan our QR or open the link, then Add to Home Screen. One tap forever.

✨ EVERYTHING INSIDE THE APP:
• Book Now — Botox, fillers, facials, Morpheus8, weight loss & more
• 💧 Build Your IV Bag — pick 500 mL ($89) or 1 L ($109), stack B12, glutathione, vitamin C, Tri-Immune & more · live price before you book
• 💉 Vitamin Bar — drive-thru shots, pre-pay in the app
• 🎁 Deals — specials & gift cards
• ⭐ Memberships — monthly wellness plans, billed via Square
• 🏆 HG Rewards — earn points on every visit · loyalty tiers · birthday treats
• ⚖️ GLP-1 weight-loss screening intake
• 🧬 Wellness hub — peptides, hormone optimization, Fullscript supplements
• 👤 Me tab — portal, appointments, documents, referrals & your personal QR at checkout

Ryan Kent, FNP-BC on site 7 days a week · Oswego, IL

👉 Scan QR / get the app: ${SITE_URL}/get-app
👉 Build your IV bag: ${SITE_URL}/app?iv=build
📖 Full guide: ${SITE_URL}/blog/build-your-iv-bag-hello-gorgeous-app-oswego-il`,
    link: `${SITE_URL}/get-app`,
    imagePath: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
  },
  "memberships-showcase-google": {
    label: "Monthly memberships showcase — Google Business",
    channels: ["google"],
    message: `⭐ Monthly memberships at Hello Gorgeous Med Spa — Oswego, IL

Vitamin Bar · facials · lashes · men's wellness — one simple monthly price.

💉 The Glow Pass — $49/mo · 2 shots + member pricing
⚡ Energy Unlimited — $89/mo · 4 shots, mix & match (most popular)
👑 VIP Wellness — $149/mo · weekly shot + Glutathione or NAD+
✨ Glow Facial — $99/mo · HydraFacial + Dermaplaning + Biotin
💕 Lash Fill — $150/mo · 2 fills + 2 Biotin shots
👔 The Gentlemen's Club — from $99/mo · Brotox, hormones, peptides & recovery

Join in the Hello Gorgeous app or see every perk on our site.
Ryan Kent, FNP-BC · serving Naperville, Aurora & Plainfield.`,
    link: `${SITE_URL}/monthly-memberships`,
    imagePath: "/images/memberships/energy-unlimited.png",
  },
  "memberships-showcase-facebook": {
    label: "Monthly memberships showcase — Facebook",
    channels: ["facebook"],
    message: `⭐ YOUR monthly glow — now on membership at Hello Gorgeous Med Spa, Oswego IL

Stop paying full price every visit. Pick the plan that matches your routine:

💉 The Glow Pass — $49/mo
2 Vitamin Bar shots + member pricing on everything

⚡ Energy Unlimited — $89/mo ⭐ MOST POPULAR
4 shots/mo, mix & match · 10% off IV therapy

👑 VIP Wellness — $149/mo
Weekly shot + monthly Glutathione OR NAD+ · VIP drive-thru lane

✨ Glow Facial Membership — $99/mo
HydraFacial + Dermaplaning + Biotin every month · credits roll over

💕 Lash Fill Membership — $150/mo
2 lash fills + 2 Biotin shots · priority booking

👔 THE GENTLEMEN'S CLUB — from $99/mo
Brotox · hormones · peptide therapy · monthly wellness shot · no contracts
The Gentleman $99 · The Distinguished Gentleman $149

Join in the Hello Gorgeous app (Membership tab) or tap the link for full details + flyers 👇

Ryan Kent, FNP-BC on site 7 days a week · Naperville · Aurora · Plainfield`,
    link: `${SITE_URL}/monthly-memberships`,
    imagePath: "/images/memberships/energy-unlimited.png",
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
