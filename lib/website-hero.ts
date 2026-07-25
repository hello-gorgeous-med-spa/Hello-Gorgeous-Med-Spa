/** Cinematic website hero — Solaria, Quantum RF, Morpheus8 + stills */

export type WebsiteHeroSegment =
  | {
      type: "video";
      src: string;
      poster?: string;
      eyebrow: string;
      title: string;
      titleEm?: string;
      sub: string;
    }
  | {
      type: "image";
      src: string;
      eyebrow: string;
      title: string;
      titleEm?: string;
      sub: string;
      durationMs?: number;
      objectPosition?: string;
    };

export const WEBSITE_HERO_SEGMENTS: WebsiteHeroSegment[] = [
  {
    type: "video",
    src: "/videos/website-hero/solaria.mp4",
    poster: "/images/website-hero/solaria-poster.jpg",
    eyebrow: "Advanced Technology",
    title: "Solaria",
    titleEm: "CO₂ Laser",
    sub: "Ablative resurfacing for tone, texture & true glow.",
  },
  {
    type: "video",
    src: "/videos/website-hero/quantum-rf.mp4",
    poster: "/images/website-hero/quantum-poster.jpg",
    eyebrow: "InMode Quantum RF",
    title: "Contour &",
    titleEm: "tighten.",
    sub: "Precision radiofrequency for face and body — results that look like you.",
  },
  {
    type: "video",
    src: "/videos/website-hero/jen-lips.mp4",
    poster: "/images/website-hero/jen-poster.jpg",
    eyebrow: "Lip Filler",
    title: "In expert",
    titleEm: "hands.",
    sub: "Natural, balanced lips — placed with care at Hello Gorgeous.",
  },
  {
    type: "video",
    src: "/videos/website-hero/morpheus8.mp4",
    poster: "/images/website-hero/quantum-poster.jpg",
    eyebrow: "Morpheus8 Burst",
    title: "Remodel",
    titleEm: "from within.",
    sub: "RF microneedling for firmer skin and refined texture.",
  },
  {
    type: "image",
    src: "/images/website-hero/room-solaria.jpg",
    eyebrow: "The Experience",
    title: "Care with",
    titleEm: "intention.",
    sub: "Hands-on medical treatments in our Oswego suite.",
    durationMs: 4800,
    objectPosition: "center 30%",
  },
  {
    type: "image",
    src: "/images/website-hero/glow-hydra.jpg",
    eyebrow: "Signature Facials",
    title: "Real medicine.",
    titleEm: "Real glow.",
    sub: "",
    durationMs: 4500,
    objectPosition: "right center",
  },
  {
    type: "image",
    src: "/images/website-hero/lashes.jpg",
    eyebrow: "Lashes & Lifts",
    title: "Wake up",
    titleEm: "gorgeous.",
    sub: "",
    durationMs: 4500,
    objectPosition: "center 10%",
  },
];

export const WEBSITE_HERO_PHONE_DISPLAY = "(630) 636-6193";
export const WEBSITE_HERO_PHONE_HREF = "tel:6306366193";
