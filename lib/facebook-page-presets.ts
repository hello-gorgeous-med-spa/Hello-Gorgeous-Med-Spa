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

Book a consult: we’ll tell you honestly if you’re a candidate.`,
  linkPath: withUtm("/services/weight-loss-therapy"),
  imagePath: "/images/homepage-services/compounded-tirzepatide-weight-loss.png",
  defaultChannels: ["facebook", "instagram"],
};

export const FACEBOOK_PAGE_PRESET_GLOW_EVENT: FacebookPagePreset = {
  id: "glow-social",
  label: "The Glow Social — event",
  blurb: "VIP night — link to RSVP page.",
  message: `🥂 THE GLOW SOCIAL — FREE VIP night at Hello Gorgeous / Freddie’s Off The Chain, Oswego.

Trifecta demos, bites & bubbly, raffle, guest vitamin shot. RSVP on our site — spots limited.`,
  linkPath: withUtm("/events/the-glow-social"),
  imagePath: "/images/events/glow-social-win-big-may-14.png",
  defaultChannels: ["facebook", "instagram"],
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
  FACEBOOK_PAGE_PRESET_OUR_PROMISE,
  FACEBOOK_PAGE_PRESET_SOLARIA,
  FACEBOOK_PAGE_PRESET_QUANTUM,
  FACEBOOK_PAGE_PRESET_MORPHEUS8,
  FACEBOOK_PAGE_PRESET_IPL,
  FACEBOOK_PAGE_PRESET_BOOK,
  FACEBOOK_PAGE_PRESET_WEIGHT,
  FACEBOOK_PAGE_PRESET_GLOW_EVENT,
];

/** Recommended Mon→Sun order when you “queue a week” (rotate start day as you like). */
export const SUGGESTED_WEEK_PRESET_IDS: string[] = [
  "solaria-899",
  "quantum-contour-live",
  "morpheus8-burst",
  "ipl-photofacial",
  "book-consult",
  "weight-loss",
  "glow-social",
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
