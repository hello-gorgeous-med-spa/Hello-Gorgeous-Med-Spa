/**
 * Copy + paths for Google Business Profile local posts via /api/social/post.
 * Client builds absolute image/link URLs with window.location.origin so preview deploys work.
 */

export type GbpPostPreset = {
  id: string;
  label: string;
  message: string;
  /** Path + query only, e.g. /events/foo?utm=... */
  linkPath: `/${string}`;
  imagePath: `/${string}`;
};

export const GBP_POST_PRESET_GLOW_SOCIAL_MAY_14: GbpPostPreset = {
  id: "glow-social-may-14",
  label: "The Glow Social — May 14",
  message: `The Glow Social — FREE VIP night Thu May 14, 5–8 PM at Freddie's Off The Chain, Oswego (11 S Madison).

Glow, glam & gratitude: Solaria CO₂, Morpheus8 Burst, Quantum RF demos · free consults · wellness with our NP.

Every guest: FREE vitamin shot (B12, B-Complex, or MIC). Raffle — 3 grand prizes. Bonus entries for reviews & social (rules at check-in).

FREE — RSVP required. Spots limited. Call (630) 636-6193.`,
  linkPath:
    "/events/the-glow-social?utm_source=google_business_profile&utm_medium=api_local_post&utm_campaign=glow_social_may_2026",
  imagePath: "/images/events/glow-social-win-big-may-14.png",
};

export const GBP_POST_PRESET_VIP_DEVICE_NIGHT_MAY_7: GbpPostPreset = {
  id: "vip-device-night-may-7",
  label: "VIP Device Night — May 7",
  message: `VIP Device Night — Thu May 7 from 6 PM at Freddie's Off The Chain, Oswego.

Meet Solaria CO₂, Morpheus8 Burst & Deep, and Quantum RF — tacos, apps & cash bar with your Hello Gorgeous team.

Event Botox pricing for qualified guests, raffles & VIP packages. RSVP encouraged — (630) 636-6193.`,
  linkPath:
    "/events/vip-device-night?utm_source=google_business_profile&utm_medium=api_local_post&utm_campaign=vip_device_night_may_2026",
  imagePath: "/images/morpheus8/morpheus8-face-front.png",
};

export const GBP_POST_PRESETS: GbpPostPreset[] = [
  GBP_POST_PRESET_GLOW_SOCIAL_MAY_14,
  GBP_POST_PRESET_VIP_DEVICE_NIGHT_MAY_7,
];
