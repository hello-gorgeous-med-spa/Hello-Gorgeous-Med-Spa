/**
 * REGEN — prescription & regenerative medicine division of Hello Gorgeous Med Spa.
 */

export const REGEN_BRAND = {
  name: "RE GEN",
  legalLine: "by Hello Gorgeous Med Spa",
  fullName: "RE GEN by Hello Gorgeous Med Spa",
  tagline: "Renew. Rebalance. Regenerate.",
  taglineLong: "Medical weight loss, peptides & hormones — NP-directed, shipped to your door",
  pink: "#E6007E",
  pinkSoft: "#FFF0F7",
} as const;

export const REGEN_LOGO = {
  primary: "/images/regen/brand/regen-logo-primary.png",
  alt: "REGEN by Hello Gorgeous Med Spa — regenerative medicine and prescription care",
  width: 1024,
  height: 576,
} as const;

/** Canonical marketing photography & social crops (Jul 2026 refresh). */
export const REGEN_MARKETING = {
  ogImage: "/images/regen/regen-og-image.jpg",
  providerHero: "/images/regen/regen-provider-hero.jpg",
  flyerServices: "/images/regen/regen-flyer-services.jpg",
  brandBanner: "/images/regen/regen-brand-banner.jpg",
  logoRevealVideo: "/videos/regen/regen-logo-reveal.mp4",
} as const;

/** Fallback preview art until category shoots are delivered. */
export const REGEN_PREVIEW_FALLBACKS = {
  "weight-loss": "/images/gentlemens-club/tirzepatide-weight-loss.png",
  labs: "/images/promo/peak-performance-profile-flyer.png",
  hormones: "/images/shop-rx/hrt/estrogen-biest.png",
  peptides: "/images/shop-rx/new-peptide-protocol.png",
  "sexual-health": "/images/shop-rx/pt-141.png",
  testosterone: "/images/shop-rx/hrt/testosterone-trt.png",
  "hair-skin": "/images/shop-rx/ghk-cu.png",
  wellness: "/images/homepage-services/iv-therapy-immunity-infusion.png",
} as const;
