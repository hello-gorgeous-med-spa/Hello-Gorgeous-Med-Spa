/**
 * Ready-to-post copy for Facebook Page (and optional Google) via /api/social/post.
 * Build absolute URLs on the client with `window.location.origin` (or your live domain in cron).
 */

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

export const FACEBOOK_PAGE_PRESETS: FacebookPagePreset[] = [
  FACEBOOK_PAGE_PRESET_PEPTIDE_49,
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

/** Default Mon→Sun queue — peptide-forward for local dominance. */
export const SUGGESTED_WEEK_PRESET_IDS: string[] = [
  "peptide-49-consult",
  "peptide-injection-menu",
  "peptide-bpc157",
  "peptide-sermorelin",
  "peptide-naperville",
  "book-consult",
  "peptide-top6-blog",
];

/** All-peptide 7-day blitz (optional). */
export const SUGGESTED_PEPTIDE_WEEK_PRESET_IDS: string[] = [
  "peptide-49-consult",
  "peptide-injection-menu",
  "peptide-bpc157",
  "peptide-sermorelin",
  "peptide-naperville",
  "peptide-top6-blog",
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
