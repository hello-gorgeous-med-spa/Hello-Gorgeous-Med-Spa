/**
 * Copy + paths for Google Business Profile local posts via /api/social/post.
 * Client builds absolute image/link URLs with window.location.origin so preview deploys work.
 */

export type GbpPostPreset = {
  id: string;
  label: string;
  message: string;
  /** Path + query only, e.g. /book?utm=... */
  linkPath: `/${string}`;
  imagePath: `/${string}`;
};

export const GBP_POST_PRESETS: GbpPostPreset[] = [
  {
    id: "botox-10-unit",
    label: "Botox $10/unit (Oswego)",
    message: `💉 Botox in Oswego — $10/unit at Hello Gorgeous Med Spa

Honest, published pricing — same price for everyone, no membership required.

Ryan Kent, FNP-BC on site 7 days a week · 10+ years of injecting experience · same-day appointments often available.

Botox · Dysport · Jeuveau. Free consultation, every time — we won't talk you into units you don't need.

#1 Best Med Spa in Oswego. Serving Naperville, Aurora & Plainfield. Book below.`,
    linkPath: "/botox-oswego?utm_source=google&utm_medium=gbp_post&utm_campaign=botox_10unit",
    imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
  },
  {
    id: "botox-authentic",
    label: "Botox — authentic product, real NP",
    message: `🛡️ Real Botox. Real nurse practitioner. Real pricing.

At Hello Gorgeous we use only authentic, FDA-approved product from licensed distributors — and Ryan Kent, FNP-BC oversees every protocol on site.

No revolving door of providers. No mystery pricing. No upsell pressure. Just $10/unit Botox done right in downtown Oswego.

Free consult — book below.`,
    linkPath: "/botox-oswego?utm_source=google&utm_medium=gbp_post&utm_campaign=botox_authentic",
    imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
  },
  {
    id: "botox-vs-dysport",
    label: "Botox vs Dysport vs Jeuveau",
    message: `🤔 Botox, Dysport, or Jeuveau — which is right for you?

All three relax the muscles that cause expression lines. The difference is in onset, spread & feel — and we carry all three so we can match you to the best one.

Botox $10/unit · Dysport $14/unit · Jeuveau $11/unit. Ryan Kent, FNP-BC, Oswego IL.

Free consult to figure out your plan — book below.`,
    linkPath: "/botox-oswego?utm_source=google&utm_medium=gbp_post&utm_campaign=botox_compare",
    imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
  },
  {
    id: "peptide-49-consult",
    label: "Peptide therapy — $49 consult (Oswego)",
    message: `🧬 Peptide therapy at Hello Gorgeous Med Spa — Oswego, IL

BPC-157 · Sermorelin · GHK-Cu · Tesamorelin · PT-141 · NAD+ · glutathione & more.

Prescribed & supervised by Ryan Kent, FNP-BC — licensed US pharmacies only. Not internet research peptides.

$49 peptide consultation · medication priced separately after your plan.

Serving Naperville, Aurora, Plainfield & Kendall County. Book below.`,
    linkPath: "/peptide-therapy-oswego?utm_source=google&utm_medium=gbp_post&utm_campaign=peptide_49",
    imagePath: "/images/homepage-services/peptide-therapy-active-lifestyle.png",
  },
  {
    id: "injection-menu",
    label: "Injection Menu — peptides & vitamin shots",
    message: `💉 The Hello Gorgeous Injection Menu

Peptide therapies & vitamin wellness shots — tailored to you.

PT-141 · BPC-157 · Sermorelin · NAD+ · B12 · biotin · MIC & more.

Ryan Kent, FNP-BC guides every protocol. See the menu & book your consult.`,
    linkPath: "/injection-menu?utm_source=google&utm_medium=gbp_post&utm_campaign=injection_menu",
    imagePath: "/images/promo/injection-menu-poster.png",
  },
  {
    id: "peptide-bpc157",
    label: "BPC-157 — recovery peptide",
    message: `🩹 BPC-157 at Hello Gorgeous — Oswego, IL

Supports recovery, gut health & tissue repair. One of our most-requested peptides.

Medical evaluation + pharmacy-sourced Rx · Ryan Kent, FNP-BC.

$49 peptide consult — book below.`,
    linkPath: "/peptides/bpc-157?utm_source=google&utm_medium=gbp_post&utm_campaign=bpc157",
    imagePath: "/images/homepage-services/peptide-therapy-active-lifestyle.png",
  },
  {
    id: "quantum-rf-launch",
    label: "Quantum RF launch — neck & abdomen packages",
    message: `⚡ NEW — InMode Quantum RF body contouring at Hello Gorgeous Med Spa, Oswego IL

Lipo-level results without surgery or an operating room.

Neck package $2,499 · Abdomen $3,999
Each includes FREE Morpheus8 Burst

1 session · local anesthesia · 5–7 day recovery
Ryan Kent, FNP-BC · Cherry financing available

Free consultation — book below.`,
    linkPath: "/quantum-rf-oswego-il",
    imagePath: "/images/promo/quantum-rf-launch-flyer.png",
  },
  {
    id: "brow-pmu",
    label: "Brow PMU — permanent makeup (nano, powder, ombré, combo)",
    message: `✨ Permanent Makeup brows at Hello Gorgeous Med Spa — Oswego, IL

Nano hair strokes · Powder · Ombré · Combo brows, each mapped to your face by Danielle Alcala under medical supervision.

Natural-looking, long-lasting, and color-matched with Tina Davies pigments. Wake up with brows you love — no more daily pencil.

Free consult + brow mapping. Serving Naperville, Aurora & Plainfield. Book below.`,
    linkPath: "/microblading-brow-pmu-oswego-il",
    imagePath: "/images/brow/danielle-alcala-brow-pmu-portfolio-before-after.png",
  },
];
