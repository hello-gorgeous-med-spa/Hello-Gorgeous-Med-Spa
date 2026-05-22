import { QUANTUM_RF_LAUNCH_SOCIAL } from "@/lib/quantum-rf-launch-promo";
import { SITE } from "@/lib/seo";

export type PromoFlyerSocialPost = {
  id: string;
  label: string;
  message: string;
  link: string;
  imagePath: string;
};

const base = SITE.url;

/** Immediate Facebook + Google posts for May 2026 promo flyers. */
export const PROMO_FLYER_SOCIAL_POSTS: PromoFlyerSocialPost[] = [
  {
    id: "quantum-rf-launch",
    label: "Quantum RF launch — neck & abdomen packages",
    message: QUANTUM_RF_LAUNCH_SOCIAL.facebook.message,
    link: QUANTUM_RF_LAUNCH_SOCIAL.facebook.link,
    imagePath: QUANTUM_RF_LAUNCH_SOCIAL.facebook.imagePath,
  },
  {
    id: "lip-filler-promo",
    label: "Lip Filler — $450 / 2 for $399 each",
    message: `💋 Lip Filler at Hello Gorgeous — Enhance. Hydrate. Elevate.

✨ Natural shape & volume
💧 Softer, smoother lips
✨ Subtle, confidence-boosting results
⏱ Quick treatment · minimal downtime

$450 for 1 syringe · $399 each when you book 2 syringes

Family-owned med spa in Oswego · NP on site 7 days a week.
Beautifully you. Confidently gorgeous. Book your lip filler today!`,
    link: `${base}/lip-filler-oswego`,
    imagePath: "/images/promo/lip-filler-promo-flyer.png",
  },
  {
    id: "solaria-co2-promo",
    label: "Solaria CO2 — Renew. Rejuvenate. Reveal radiance.",
    message: `✨ Solaria CO₂ at Hello Gorgeous — gold-standard fractional skin resurfacing.

Renew · Rejuvenate · Reveal radiance

Treats fine lines, texture, sun damage, acne scars & pores — with personalized depth and medical oversight.

The only Solaria CO₂ in the western Chicago suburbs (Oswego · Naperville · Aurora · Plainfield).

Book your free consultation — link below.`,
    link: `${base}/solaria-co2-oswego`,
    imagePath: "/images/promo/solaria-co2-promo-flyer.png",
  },
  {
    id: "signature-treatment-menu",
    label: "Signature Treatment Menu poster",
    message: `✨ Signature Treatment Menu at Hello Gorgeous Med Spa — Oswego, IL

💉 First-time Botox $10/unit
💋 Lip filler $450 (2 syringes $399 each)
⚡ Quantum RF — neck $2,499 · abdomen $3,999 · FREE Morpheus8 Burst
🔥 Morpheus8 Burst — 3 for $1,999
✨ Solaria CO₂ full resurfacing — $899
👑 Trifecta: Morpheus8 + Quantum RF + FREE Solaria CO₂

Family-owned · NP on site 7 days a week.
Beautifully you. Confidently gorgeous.

Book on Fresha — link below.`,
    link: `${base}/specials`,
    imagePath: "/images/promo/signature-treatment-menu-poster.png",
  },
];
