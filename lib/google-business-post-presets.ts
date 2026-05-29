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
