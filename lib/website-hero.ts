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
    type: "image",
    src: "/images/website-hero/team-hero-vial-cinematic.jpg",
    eyebrow: "This is us",
    title: "Hello",
    titleEm: "Gorgeous",
    sub: "Owner-led care in downtown Oswego — a real team, not a letterhead.",
    durationMs: 5200,
    objectPosition: "center center",
  },
  {
    type: "image",
    src: "/images/website-hero/team-hero-highfive-cinematic.jpg",
    eyebrow: "The team",
    title: "In this",
    titleEm: "together.",
    sub: "Meet us in the studio — licensed, hands-on, and here for you.",
    durationMs: 5200,
    objectPosition: "center center",
  },
  {
    type: "image",
    src: "/images/website-hero/team-hero-four-cinematic.jpg",
    eyebrow: "Hello Gorgeous",
    title: "Four of",
    titleEm: "us.",
    sub: "Danielle, Kristina, and the studio team — ready when you walk in.",
    durationMs: 5200,
    objectPosition: "center center",
  },
  {
    type: "image",
    src: "/images/website-hero/team-hero-group-cinematic.jpg",
    eyebrow: "The whole crew",
    title: "Medical",
    titleEm: "family.",
    sub: "Prescriber, injector, owner, and Medical Director — one practice.",
    durationMs: 5600,
    objectPosition: "center center",
  },
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
