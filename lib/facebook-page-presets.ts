/**
 * Ready-to-post copy for Facebook Page (and optional Google) via /api/social/post.
 * Build absolute URLs on the client with `window.location.origin` (or your live domain in cron).
 */

import { MEMBERSHIPS_SHOWCASE_FACEBOOK_MESSAGE } from "@/lib/monthly-memberships-marketing";

export type FacebookPagePreset = {
  id: string;
  label: string;
  /** One line for the agent UI */
  blurb: string;
  message: string;
  /** Path + query on your site, always starting with `/` */
  linkPath: string;
  imagePath?: `/${string}`;
  /** When user opens in “Post to Social” */
  defaultChannels: ("facebook" | "instagram" | "google")[];
};

const UTM_FB = "utm_source=facebook&utm_medium=page_post&utm_campaign=hg_social_agent";

function withUtm(path: string): string {
  const [beforeHash, hash] = path.split("#");
  const sep = beforeHash.includes("?") ? "&" : "?";
  const withQs = `${beforeHash}${sep}${UTM_FB}`;
  return hash ? `${withQs}#${hash}` : withQs;
}

export const FACEBOOK_PAGE_PRESET_BOOK: FacebookPagePreset = {
  id: "book-consult",
  label: "Book a consult",
  blurb: "Soft CTA — free consult, downtown Oswego.",
  message: `Ready for a change you can see? Book a free consult at Hello Gorgeous Med Spa — downtown Oswego. Medical-grade skin, body, and injectables with a team that actually listens.

Call (630) 636-6193 or book online — link below.`,
  linkPath: withUtm("/book"),
  imagePath: "/images/homepage-services/morpheus8-burst-verified-provider.png",
  defaultChannels: ["facebook", "instagram"],
};

export const FACEBOOK_PAGE_PRESET_SOLARIA: FacebookPagePreset = {
  id: "solaria-899",
  label: "Solaria CO₂ — $899 full face",
  blurb: "Fractional laser resurfacing + launch special.",
  message: `✨ InMode Solaria CO₂ fractional laser — gold-standard skin resurfacing for texture, fine lines, sun damage, and acne scarring.

Launch special: $899 full face (consult required). Real results — not hype.

Oswego · serving Naperville, Aurora, Plainfield & the Fox Valley.`,
  linkPath: withUtm("/services/solaria-co2"),
  imagePath: "/images/solaria/solaria-co2-full-face-before-after.png",
  defaultChannels: ["facebook", "instagram"],
};

export const FACEBOOK_PAGE_PRESET_QUANTUM: FacebookPagePreset = {
  id: "quantum-contour-live",
  label: "Contour Lift / Quantum RF — live",
  blurb: "Model Days + Ryan’s direct line.",
  message: `🔥 Quantum RF is LIVE — Hello Gorgeous Contour Lift™.

Model Days May 4 & May 12 · limited spots · Quantum RF + Morpheus8 Body Deep bundled. Save up to $1,000 vs package pricing.

Text or call Ryan Kent to claim your spot: 217-741-8359
Main office: (630) 636-6193`,
  linkPath: withUtm("/services/quantum-rf#contour-lift-model-days"),
  imagePath: "/images/quantum-rf/hello-gorgeous-contour-lift-model-days-flyer-2026.jpg",
  defaultChannels: ["facebook", "instagram"],
};

export const FACEBOOK_PAGE_PRESET_MORPHEUS8: FacebookPagePreset = {
  id: "morpheus8-burst",
  label: "Morpheus8 Burst + Deep",
  blurb: "RF microneedling — face & body.",
  message: `⚡ Morpheus8 Burst + Deep — the newest InMode RF microneedling. Multi-depth energy in one pass; reaches deeper for crepey neck, arms, thighs & more.

Free consult determines your plan. Hello Gorgeous Med Spa — Oswego.`,
  linkPath: withUtm("/services/morpheus8"),
  imagePath: "/images/morpheus8/morpheus8-burst-deep-thighs-skin-tightening-before-after.png",
  defaultChannels: ["facebook", "instagram"],
};

export const FACEBOOK_PAGE_PRESET_IPL: FacebookPagePreset = {
  id: "ipl-photofacial",
  label: "IPL Photofacial — now booking",
  blurb: "Sun spots, redness, rosacea.",
  message: `💡 IPL Photofacial is NOW BOOKING at Hello Gorgeous.

Fade sun spots, redness, and broken capillaries — often visible improvement within days. From $250 · series bundled.

Oswego · Naperville · Aurora · Plainfield.`,
  linkPath: withUtm("/services/ipl-photofacial"),
  imagePath: "/images/ipl-photofacial/ipl-photofacial-zemits-treatment-hero.png",
  defaultChannels: ["facebook", "instagram"],
};

export const FACEBOOK_PAGE_PRESET_WEIGHT: FacebookPagePreset = {
  id: "weight-loss",
  label: "Medical weight loss",
  blurb: "GLP-1 & provider-guided programs.",
  message: `Medical weight loss with real clinical oversight — not a fad app. Hello Gorgeous partners with you on GLP-1 and sustainable habits.

Book a consult: we'll tell you honestly if you're a candidate.`,
  linkPath: withUtm("/services/weight-loss-therapy"),
  imagePath: "/images/homepage-services/compounded-tirzepatide-weight-loss.png",
  defaultChannels: ["facebook", "instagram"],
};

export const FACEBOOK_PAGE_PRESET_SIGNATURE_MENU: FacebookPagePreset = {
  id: "signature-treatment-menu",
  label: "Signature Treatment Menu",
  blurb: "Full menu poster — Botox, filler, InMode Trifecta.",
  message: `✨ Our Signature Treatment Menu is live at Hello Gorgeous Oswego.

Botox $10/unit (first-time) · Lip filler $450 · Morpheus8 Burst 3×$1,999 · Solaria CO₂ $899 · Quantum RF · Trifecta package with FREE CO₂.

NP on site 7 days a week. Book on Fresha 👇`,
  linkPath: withUtm("/specials"),
  imagePath: "/images/promo/signature-treatment-menu-poster.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_PEPTIDE_49: FacebookPagePreset = {
  id: "peptide-49-consult",
  label: "Peptide therapy — $49 consult",
  blurb: "Oswego's full peptide menu · Ryan Kent FNP-BC.",
  message: `🧬 Peptide therapy is BOOMING — and Hello Gorgeous has it ALL.

BPC-157 · Sermorelin · GHK-Cu · Tesamorelin · PT-141 · NAD+ · glutathione · GLP-1 when appropriate.

Not internet vials. Prescribed & supervised by Ryan Kent, FNP-BC — pharmacy-sourced, medical-grade.

$49 peptide consultation (medication priced separately). Oswego · Naperville · Aurora · Plainfield.

Book below 👇`,
  linkPath: withUtm("/peptide-therapy-oswego"),
  imagePath: "/images/homepage-services/peptide-therapy-active-lifestyle.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_INJECTION_MENU: FacebookPagePreset = {
  id: "peptide-injection-menu",
  label: "Injection Menu — peptides & vitamin shots",
  blurb: "In-spa menu poster + PDF download.",
  message: `💉 The Hello Gorgeous Injection Menu is live.

Signature peptide therapies + vitamin wellness shots — PT-141, BPC-157, Sermorelin, NAD+, B12, biotin, MIC & more.

Choose what feels right — your provider guides you. Ryan Kent, FNP-BC on every Rx protocol.

See the full menu & book your $49 consult 👇`,
  linkPath: withUtm("/injection-menu"),
  imagePath: "/images/promo/injection-menu-poster.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_PEPTIDE_BPC157: FacebookPagePreset = {
  id: "peptide-bpc157",
  label: "BPC-157 — recovery & gut support",
  blurb: "Most-requested healing peptide.",
  message: `🩹 BPC-157 at Hello Gorgeous — for recovery, gut health & tissue repair.

Clients ask for it after workouts, injuries, or when they want support healing from the inside out. Prescribed by Ryan Kent, FNP-BC — not sold over the counter.

Learn how it works + book your $49 peptide consult (Oswego, IL).`,
  linkPath: withUtm("/peptides/bpc-157"),
  imagePath: "/images/homepage-services/peptide-therapy-active-lifestyle.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_PEPTIDE_SERMORELIN: FacebookPagePreset = {
  id: "peptide-sermorelin",
  label: "Sermorelin — sleep, recovery, lean tone",
  blurb: "Natural GH support peptide.",
  message: `⚡ Sermorelin — supports your body's own growth hormone for better sleep, recovery & lean tone.

One of our most popular wellness peptides. Medical evaluation + pharmacy-sourced Rx only at Hello Gorgeous.

Ryan Kent, FNP-BC · downtown Oswego · serving the western suburbs.

$49 peptide consult — link below 👇`,
  linkPath: withUtm("/peptides/sermorelin"),
  imagePath: "/images/nad-plus/peptide-science-hero.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_PEPTIDE_NAPERVILLE: FacebookPagePreset = {
  id: "peptide-naperville",
  label: "Peptide therapy near Naperville",
  blurb: "Geo post — full peptide clinic ~15 min away.",
  message: `📍 Naperville — peptide therapy is closer than you think.

Hello Gorgeous in downtown Oswego (~15 min) offers one of the most complete peptide menus in the western suburbs: BPC-157, Sermorelin, GHK-Cu, PT-141, NAD+ & more.

Ryan Kent, FNP-BC prescribes every protocol. $49 consult. Book below 👇`,
  linkPath: withUtm("/peptide-therapy-naperville-il"),
  imagePath: "/images/promo/injection-menu-poster.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_PEPTIDE_BLOG: FacebookPagePreset = {
  id: "peptide-top6-blog",
  label: "Top 6 peptides guide (blog)",
  blurb: "Education post — BPC-157, Sermorelin, NAD+…",
  message: `Which peptide is right for YOU? 🤔

We broke down the 6 most-requested peptides at Hello Gorgeous — what each one does, who it's for, and how our $49 consult works.

BPC-157 · Sermorelin · GHK-Cu · Tesamorelin · PT-141 · NAD+

Read the guide (Oswego, IL) 👇`,
  linkPath: withUtm("/blog/top-peptides-bpc157-sermorelin-ghk-cu-pt141-nad-49-consult-oswego-il"),
  imagePath: "/images/homepage-services/peptide-therapy-active-lifestyle.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_FIND_YOUR_PEPTIDE: FacebookPagePreset = {
  id: "find-your-peptide-guide",
  label: "Find Your Peptide — goal matcher",
  blurb: "Interactive guide — match goals to BPC-157, Sermorelin, NAD+ & more.",
  message: `Which peptide is right for YOU? 🤔

We just published our goal-based peptide guide — free on our site:

✨ Skin & anti-aging → GHK-Cu, NAD+, Glutathione
🏃 Recovery → BPC-157, TB-500
⚡ Energy & longevity → NAD+, Sermorelin
⚖️ Body composition → Tesamorelin, Tirzepatide
💫 Intimacy → PT-141

Nine goal categories · 12+ peptide profiles · NP-led $49 consult in downtown Oswego.

Not sure where to start? This is it 👇`,
  linkPath: withUtm("/skin-101/find-your-peptide"),
  imagePath: "/images/peptides/peptide-cheat-sheet-full.png",
  defaultChannels: ["facebook", "google"],
};

export const FACEBOOK_PAGE_PRESET_FOUNDER_LETTER: FacebookPagePreset = {
  id: "founder-letter",
  label: "Founder's letter — My Jerry Maguire Moment",
  blurb: "Personal, vulnerable founder story — high engagement.",
  message: `💌 A letter from our founder.

There comes a moment in business when you stop pretending everything is easy. After almost 10 years building Hello Gorgeous in Oswego, this is mine.

A truth-telling moment about risk, resilience, boundaries — and the next chapter of Hello Gorgeous.

"Still standing. Still learning. Still growing. Still gorgeous." 💕

To every client who has trusted my hands and walked through my doors — thank you. Read the full letter 👇

— Danielle`,
  linkPath: withUtm("/blog/my-jerry-maguire-moment"),
  imagePath: "/images/team/danielle.png",
  defaultChannels: ["facebook", "instagram"],
};

export const FACEBOOK_PAGE_PRESET_BROW_PMU: FacebookPagePreset = {
  id: "brow-pmu",
  label: "Brow PMU — wake up with perfect brows",
  blurb: "Permanent makeup — nano, powder, ombré, combo.",
  message: `✨ Wake up with perfect brows — Permanent Makeup at Hello Gorgeous, Oswego IL.

Nano hair strokes · Powder · Ombré · Combo brows — each one mapped to YOUR face by Danielle Alcala, under medical supervision.

Natural-looking, long-lasting, and color-matched with Tina Davies pigments. No more daily brow pencil.

Free consult + brow mapping. Book below 👇`,
  linkPath: withUtm("/microblading-brow-pmu-oswego-il"),
  imagePath: "/images/brow/danielle-alcala-brow-pmu-portfolio-before-after.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_BROW_TECHNIQUES: FacebookPagePreset = {
  id: "brow-techniques",
  label: "Which brow is you? — technique guide",
  blurb: "Nano vs powder vs combo vs ombré.",
  message: `Which brow is YOU? 🤔

Nano strokes for crisp, hair-like detail · Powder for a soft makeup finish · Combo for the best of both · Ombré for a gradient.

We map every brow to your bone structure and color-match for a result that actually suits you. Permanent makeup at Hello Gorgeous — Oswego, IL.

Book your brow consult 👇`,
  linkPath: withUtm("/microblading-brow-pmu-oswego-il"),
  imagePath: "/images/brow/powder-nano-brows-before-after-danielle-alcala.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_AURORA: FacebookPagePreset = {
  id: "aurora-med-spa",
  label: "Aurora — med spa near you",
  blurb: "Local geo post for Aurora clients.",
  message: `📍 Aurora — your med spa is closer than you think.

Just ~20 minutes west on Route 30 (minutes from North Aurora & Montgomery), Hello Gorgeous brings medical-grade care to the Fox Valley: Botox $10/unit, fillers, medical weight loss, Morpheus8 Burst & laser — with a full-authority NP on site.

We screen you like a medical practice, because we are one. Free consult — book below 👇`,
  linkPath: withUtm("/aurora-il"),
  imagePath: "/images/homepage-services/morpheus8-burst-verified-provider.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_NAPERVILLE: FacebookPagePreset = {
  id: "naperville-med-spa",
  label: "Naperville — med spa near you",
  blurb: "Local geo post for Naperville clients.",
  message: `📍 Naperville — your med spa is just a short drive away.

About 15 minutes south on Route 59, Hello Gorgeous brings medical-grade care to the western suburbs: Botox $10/unit, fillers, medical weight loss, Morpheus8 Burst & laser — with a full-authority NP on site.

We screen you like a medical practice, because we are one. Free consult — book below 👇`,
  linkPath: withUtm("/naperville-il"),
  imagePath: "/images/homepage-services/morpheus8-burst-verified-provider.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_OSWEGO: FacebookPagePreset = {
  id: "oswego-med-spa",
  label: "Oswego — #1 best med spa",
  blurb: "Hometown post for Oswego clients.",
  message: `📍 Oswego — your hometown med spa.

Voted #1 Best Med Spa in Oswego. Right in downtown at 74 W. Washington St., we offer Botox $10/unit, fillers, medical weight loss, Morpheus8 Burst, Quantum RF & Solaria CO₂ — all under one roof, with a full-authority NP on site.

Free consult — book below 👇`,
  linkPath: withUtm("/best-med-spa-oswego-il"),
  imagePath: "/images/homepage-services/morpheus8-burst-verified-provider.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_MONTGOMERY: FacebookPagePreset = {
  id: "montgomery-med-spa",
  label: "Montgomery — med spa next door",
  blurb: "Local geo post for Montgomery clients.",
  message: `📍 Montgomery — your med spa is right next door.

Less than 10 minutes away in downtown Oswego, Hello Gorgeous brings medical-grade care to the Fox Valley: Botox $10/unit, fillers, medical weight loss, Morpheus8 Burst & laser — with a full-authority NP on site.

We screen you like a medical practice, because we are one. Free consult — book below 👇`,
  linkPath: withUtm("/montgomery-il"),
  imagePath: "/images/homepage-services/morpheus8-burst-verified-provider.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_PLAINFIELD: FacebookPagePreset = {
  id: "plainfield-med-spa",
  label: "Plainfield — med spa near you",
  blurb: "Local geo post for Plainfield clients.",
  message: `📍 Plainfield — your med spa is just a short drive away.

About 15 minutes north on Route 126, Hello Gorgeous brings medical-grade care to Will County: Botox $10/unit, fillers, medical weight loss, Morpheus8 Burst & laser — with a full-authority NP on site.

We screen you like a medical practice, because we are one. Free consult — book below 👇`,
  linkPath: withUtm("/plainfield-il"),
  imagePath: "/images/homepage-services/morpheus8-burst-verified-provider.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_YORKVILLE: FacebookPagePreset = {
  id: "yorkville-med-spa",
  label: "Yorkville — med spa near you",
  blurb: "Local geo post for Yorkville clients.",
  message: `📍 Yorkville — your med spa is just up Route 34.

About 10 minutes east in downtown Oswego, Hello Gorgeous brings medical-grade care to Kendall County: Botox $10/unit, fillers, medical weight loss, Morpheus8 Burst & laser — with a full-authority NP on site.

We screen you like a medical practice, because we are one. Free consult — book below 👇`,
  linkPath: withUtm("/yorkville-il"),
  imagePath: "/images/homepage-services/morpheus8-burst-verified-provider.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_OUR_PROMISE: FacebookPagePreset = {
  id: "our-promise",
  label: "Our Promise — Authenticity",
  blurb: "100% real products, Class IV lasers, $1M+ invested.",
  message: `💕 OUR PROMISE: 100% authentic products. No fakes. No shortcuts. No gray market.

Over $1 million invested in FDA-cleared InMode Class IV medical lasers, genuine Allergan & Galderma products, and pharmacy-grade medications.

Every vial verified. Every device certified. That's the Hello Gorgeous difference.

Read why this matters for YOUR safety — and how to spot a provider who cuts corners. 👇`,
  linkPath: withUtm("/blog/our-promise-authentic-products-class-iv-lasers-oswego-il"),
  imagePath: "/images/badges/allergan-partner-privileges-2026.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_BOTOX_49: FacebookPagePreset = {
  id: "botox-10-unit",
  label: "Botox — $10/unit (Oswego)",
  blurb: "Honest pricing · NP on site · #1 Best Med Spa.",
  message: `💉 Botox in Oswego — $10/unit at Hello Gorgeous.

Honest, published pricing — the same for everyone, no membership required. Botox · Dysport · Jeuveau.

Ryan Kent, FNP-BC on site 7 days a week · 10+ years injecting · same-day often available.

Free consultation, every time — we won't talk you into units you don't need. Serving Naperville, Aurora & Plainfield.

Book below 👇`,
  linkPath: withUtm("/botox-oswego"),
  imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_BOTOX_AUTHENTIC: FacebookPagePreset = {
  id: "botox-authentic",
  label: "Botox — authentic product, real NP",
  blurb: "Trust angle — real product, no shortcuts.",
  message: `🛡️ Real Botox. Real nurse practitioner. Real pricing.

We use only authentic, FDA-approved product from licensed distributors — and Ryan Kent, FNP-BC oversees every protocol on site.

No revolving door of providers. No mystery pricing. No upsell pressure. Just $10/unit Botox done right in downtown Oswego.

Free consult — book below 👇`,
  linkPath: withUtm("/botox-oswego"),
  imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_BOTOX_COMPARE: FacebookPagePreset = {
  id: "botox-vs-dysport",
  label: "Botox vs Dysport vs Jeuveau",
  blurb: "Education post — which neurotoxin is right for you.",
  message: `Botox, Dysport, or Jeuveau — which is right for YOU? 🤔

All three relax the muscles that cause expression lines. The difference is onset, spread & feel — and we carry all three so we can match you to the best one.

Botox $10/unit · Dysport $14/unit · Jeuveau $11/unit. Ryan Kent, FNP-BC, Oswego IL.

Free consult to figure out your plan 👇`,
  linkPath: withUtm("/botox-oswego"),
  imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_BOTOX_NAPERVILLE: FacebookPagePreset = {
  id: "botox-naperville",
  label: "Botox near Naperville",
  blurb: "Geo post — $10/unit, ~15 min from Naperville.",
  message: `📍 Naperville — Botox is closer (and more honest) than you think.

Hello Gorgeous in downtown Oswego (~15 min) does Botox at $10/unit with a licensed NP on site — Botox, Dysport & Jeuveau, free consultation, same-day often available.

No mystery pricing. No upsell. Book below 👇`,
  linkPath: withUtm("/botox-naperville-il"),
  imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_BOTOX_AI: FacebookPagePreset = {
  id: "botox-ai-pick",
  label: "Botox — even AI picks us (social proof)",
  blurb: "Screenshot-style social proof — swap in your AI answer.",
  message: `🤖💕 We asked AI "where do I go for Botox in Oswego, IL?" — and it picked Hello Gorgeous.

Why? Licensed nurse practitioner (Ryan Kent, FNP-BC) · authentic, FDA-approved product · honest $10/unit pricing · natural, refreshed results — not frozen.

When even the internet agrees, you know you're in good hands. 😉

Free consult — book below 👇

📸 Posting tip: attach a screenshot of the AI's answer for extra credibility.`,
  linkPath: withUtm("/botox-oswego"),
  imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_BOTOX_NATURAL: FacebookPagePreset = {
  id: "botox-natural",
  label: "Botox — natural, not frozen",
  blurb: "Facial balance · conservative dosing · looks like you.",
  message: `💕 Botox that looks like YOU — just refreshed.

Looking for Botox in Oswego, IL? At Hello Gorgeous we focus on facial balance, conservative dosing & customized plans — softening fine lines while keeping your expressions beautiful and natural. Never frozen, never overdone.

$10/unit · Ryan Kent, FNP-BC · authentic FDA-approved product · free consult.

Book below 👇`,
  linkPath: withUtm("/botox-oswego"),
  imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_MONTHLY_MEMBERSHIPS: FacebookPagePreset = {
  id: "monthly-memberships-showcase",
  label: "Monthly memberships — all plans incl. Gentlemen's Club",
  blurb: "Vitamin Bar, facial, lash + men's Gentlemen's Club memberships.",
  message: MEMBERSHIPS_SHOWCASE_FACEBOOK_MESSAGE,
  linkPath: withUtm("/monthly-memberships"),
  imagePath: "/images/gentlemens-club/gentlemens-club-hero.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

/** June 2025 FB blast — Mon */
export const FACEBOOK_PAGE_PRESET_BLAST_MEMBERSHIPS: FacebookPagePreset = {
  id: "blast-memberships",
  label: "Blast — Memberships (Glow/Luxe/Platinum)",
  blurb: "Botox savings, monthly credits, Vitamin Bar from $49/mo.",
  message: `Oswego — if you get Botox more than a few times a year, read this. 💗

Hello Gorgeous Memberships — real savings, every month:

🌸 Glow — $79/mo · $1 off EVERY unit (Botox, Dysport, Jeuveau, Xeomin, Daxxify) + monthly vitamin shot
💎 Luxe — $149/mo · $2/unit off + HydraFacial OR Dermaplaning monthly + 15% off services
👑 Platinum — $249/mo · $3/unit off + IV or advanced facial monthly + VIP booking

Vitamin Bar drive-thru memberships from $49/mo ⚡

Credits roll over. Ryan Kent, FNP-BC on site. Downtown Oswego — 74 W Washington St.

Join online 👇
hellogorgeousmedspa.com/memberships

Or get the app: hellogorgeousmedspa.com/app

📞 630-636-6193
Serving Naperville · Aurora · Plainfield · Yorkville`,
  linkPath: "/memberships?utm_source=facebook&utm_medium=organic&utm_campaign=memberships_blast",
  imagePath: "/images/memberships/energy-unlimited.png",
  defaultChannels: ["facebook"],
};

/** June 2025 FB blast — Wed */
export const FACEBOOK_PAGE_PRESET_BLAST_GLP1: FacebookPagePreset = {
  id: "blast-glp1",
  label: "Blast — GLP-1 weight loss (published pricing)",
  blurb: "Semaglutide from $249 · tirzepatide from $299 · $49 consult credited.",
  message: `Medical weight loss in Oswego — with published pricing. No "call for quote." 💗

Hello Gorgeous RX™ GLP-1 programs:

✅ $49 NP consult — credited to month 1 injectables if you enroll
✅ Semaglutide injectable from $249/mo
✅ Tirzepatide injectable from $299/mo
✅ 3-month prepay options
✅ Included monthly check-ins (in-person or telehealth)

Ryan Kent, FNP-BC — on site in Oswego, not a random out-of-state telehealth mill.

Start here 👇
hellogorgeousmedspa.com/glp-1-weight-loss-oswego

Take the screener: hellogorgeousmedspa.com/quiz/glp-1-readiness

📞 630-636-6193 · Book: hellogorgeousmedspa.com/book

*Compounded GLP-1 requires medical evaluation. Not all candidates qualify. Individual results vary.`,
  linkPath: "/glp-1-weight-loss-oswego?utm_source=facebook&utm_medium=organic&utm_campaign=glp1_blast",
  imagePath: "/images/marketing/hello-gorgeous-app-scan-flyer.jpg",
  defaultChannels: ["facebook"],
};

/** June 2025 FB blast — Fri */
export const FACEBOOK_PAGE_PRESET_BLAST_RX_APP: FacebookPagePreset = {
  id: "blast-rx-peptides-app",
  label: "Blast — Peptides + Hello Gorgeous app",
  blurb: "Peptide protocols, secure intake, app for Vitamin Bar & memberships.",
  message: `Peptides + wellness memberships — now easy to start from your phone. 🧬💗

Hello Gorgeous RX™ in Oswego:

🧬 Peptide protocols — BPC-157, sermorelin, recovery stacks & more
🧬 Secure intake online → NP review → real protocol (not "add to cart")
🧬 Peptide Member from $79/mo

📱 Hello Gorgeous app — book, Vitamin Bar, memberships, GLP-1 screener:
hellogorgeousmedspa.com/app

Peptide request 👇
hellogorgeousmedspa.com/peptide-request

Ryan Kent, FNP-BC · 74 W Washington St, Oswego
630-636-6193 · Naperville · Aurora · Plainfield`,
  linkPath: "/hello-gorgeous-rx/start-here?utm_source=facebook&utm_medium=organic&utm_campaign=rx_blast",
  imagePath: "/images/memberships/energy-unlimited.png",
  defaultChannels: ["facebook"],
};

export const FACEBOOK_PAGE_PRESET_NON_SURGICAL_FACELIFT: FacebookPagePreset = {
  id: "non-surgical-facelift",
  label: "Non-Surgical Facelift — Oswego, IL",
  blurb: "Botox + fillers + PDO threads + RF — lift without surgery.",
  message: `✨ Non-Surgical Facelift in Oswego, IL

Our advanced technique combines Botox, dermal fillers, PDO threads & skin-tightening to lift, sculpt & rejuvenate your face — naturally, without surgery.

✓ Lift sagging skin
✓ Restore facial volume
✓ Smooth wrinkles
✓ Stimulate collagen
✓ Minimal downtime

Free consult · Ryan Kent, FNP-BC · downtown Oswego. Book below 👇`,
  linkPath: withUtm("/non-surgical-facelift-oswego-il"),
  imagePath: "/images/morpheus8/morpheus8-burst-deep-jowls-jawline-before-after.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESET_SKIN_101: FacebookPagePreset = {
  id: "skin-101-education",
  label: "Skin 101 — client education hub",
  blurb: "New Science Explainer Series — acids & collagen guides for curious clients.",
  message: `📚 New on our site: Skin 101 — for clients who want to learn before they book.

Two free guides in plain language:

• Skincare Acids — lactic, glycolic, salicylic, vitamin C & what not to mix
• Collagen Types — what microneedling, RF, CO₂ & PRP actually target

No jargon. No pressure. Just honest science from your Oswego med spa.

Hello Gorgeous Med Spa · NP on site 7 days a week · Free consults 👇`,
  linkPath: withUtm("/skin-101"),
  imagePath: "/images/homepage-services/anteage-md-brightening.png",
  defaultChannels: ["facebook", "google"],
};

export const FACEBOOK_PAGE_PRESET_SKIN_BOOSTERS_BLOG: FacebookPagePreset = {
  id: "skin-boosters-prp-prf-pdrn",
  label: "Blog — PRP vs PRF vs PDRN skin boosters",
  blurb: "Education post — compare regenerative boosters; link to full Oswego guide.",
  message: `🧬 Skin boosters explained — PRP vs PRF vs PDRN vs PN

Not sure what the difference is? You are not alone.

• PRP — your platelets (Vampire Facial glow)
• PRF — slow-release fibrin matrix (under-eye, hair)
• PDRN — salmon DNA repair signaling (glass skin)
• PN — longer-chain polynucleotides (structural remodeling)

Hello Gorgeous Med Spa · Oswego, IL · NP on site 7 days a week.

Read the full guide (free consult link inside) 👇`,
  linkPath: withUtm("/blog/prp-vs-prf-vs-pdrn-vs-pn-skin-boosters-oswego-il"),
  imagePath: "/images/homepage-services/anteage-md-brightening.png",
  defaultChannels: ["facebook", "instagram", "google"],
};

export const FACEBOOK_PAGE_PRESETS: FacebookPagePreset[] = [
  FACEBOOK_PAGE_PRESET_BLAST_MEMBERSHIPS,
  FACEBOOK_PAGE_PRESET_BLAST_GLP1,
  FACEBOOK_PAGE_PRESET_BLAST_RX_APP,
  FACEBOOK_PAGE_PRESET_BOTOX_49,
  FACEBOOK_PAGE_PRESET_MONTHLY_MEMBERSHIPS,
  FACEBOOK_PAGE_PRESET_NON_SURGICAL_FACELIFT,
  FACEBOOK_PAGE_PRESET_SKIN_101,
  FACEBOOK_PAGE_PRESET_SKIN_BOOSTERS_BLOG,
  FACEBOOK_PAGE_PRESET_BOTOX_AI,
  FACEBOOK_PAGE_PRESET_BOTOX_NATURAL,
  FACEBOOK_PAGE_PRESET_BOTOX_AUTHENTIC,
  FACEBOOK_PAGE_PRESET_BOTOX_COMPARE,
  FACEBOOK_PAGE_PRESET_BOTOX_NAPERVILLE,
  FACEBOOK_PAGE_PRESET_PEPTIDE_49,
  FACEBOOK_PAGE_PRESET_FIND_YOUR_PEPTIDE,
  FACEBOOK_PAGE_PRESET_INJECTION_MENU,
  FACEBOOK_PAGE_PRESET_PEPTIDE_BPC157,
  FACEBOOK_PAGE_PRESET_PEPTIDE_SERMORELIN,
  FACEBOOK_PAGE_PRESET_PEPTIDE_NAPERVILLE,
  FACEBOOK_PAGE_PRESET_PEPTIDE_BLOG,
  FACEBOOK_PAGE_PRESET_SIGNATURE_MENU,
  FACEBOOK_PAGE_PRESET_OUR_PROMISE,
  FACEBOOK_PAGE_PRESET_SOLARIA,
  FACEBOOK_PAGE_PRESET_QUANTUM,
  FACEBOOK_PAGE_PRESET_MORPHEUS8,
  FACEBOOK_PAGE_PRESET_IPL,
  FACEBOOK_PAGE_PRESET_FOUNDER_LETTER,
  FACEBOOK_PAGE_PRESET_BROW_PMU,
  FACEBOOK_PAGE_PRESET_BROW_TECHNIQUES,
  FACEBOOK_PAGE_PRESET_AURORA,
  FACEBOOK_PAGE_PRESET_NAPERVILLE,
  FACEBOOK_PAGE_PRESET_OSWEGO,
  FACEBOOK_PAGE_PRESET_MONTGOMERY,
  FACEBOOK_PAGE_PRESET_PLAINFIELD,
  FACEBOOK_PAGE_PRESET_YORKVILLE,
  FACEBOOK_PAGE_PRESET_BOOK,
  FACEBOOK_PAGE_PRESET_WEIGHT,
];

/** Default Mon→Sun queue — balanced Botox + peptide for local dominance. */
export const SUGGESTED_WEEK_PRESET_IDS: string[] = [
  "botox-10-unit",
  "peptide-49-consult",
  "botox-vs-dysport",
  "peptide-bpc157",
  "botox-authentic",
  "peptide-naperville",
  "signature-treatment-menu",
];

/** All-peptide 7-day blitz (optional). */
export const SUGGESTED_PEPTIDE_WEEK_PRESET_IDS: string[] = [
  "find-your-peptide-guide",
  "peptide-49-consult",
  "peptide-injection-menu",
  "peptide-bpc157",
  "peptide-sermorelin",
  "peptide-naperville",
  "peptide-top6-blog",
];

/** All-Botox 7-day blitz (optional) — to fight HER / Smooth on neurotoxins. */
export const SUGGESTED_BOTOX_WEEK_PRESET_IDS: string[] = [
  "botox-10-unit",
  "botox-authentic",
  "botox-vs-dysport",
  "botox-naperville",
  "signature-treatment-menu",
  "our-promise",
  "book-consult",
];

export function getFacebookPagePresetById(id: string): FacebookPagePreset | undefined {
  return FACEBOOK_PAGE_PRESETS.find((p) => p.id === id);
}

export type SocialPresetDraft = {
  message: string;
  link: string;
  imageUrl: string;
  channels: ("facebook" | "instagram" | "google")[];
};

/** Call from the browser only — uses `origin` for absolute link + image URLs. */
export function presetToDraft(preset: FacebookPagePreset, origin: string): SocialPresetDraft {
  const base = origin.replace(/\/$/, "");
  const link = `${base}${preset.linkPath.startsWith("/") ? preset.linkPath : `/${preset.linkPath}`}`;
  const imageUrl = preset.imagePath ? `${base}${preset.imagePath}` : "";
  return {
    message: preset.message,
    link,
    imageUrl,
    channels: [...preset.defaultChannels],
  };
}
