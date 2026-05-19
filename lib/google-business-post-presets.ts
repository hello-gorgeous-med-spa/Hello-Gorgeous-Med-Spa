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

/** Past event presets removed (Glow Social / VIP Device Night @ Freddie's — May 2026). Add new presets here. */
export const GBP_POST_PRESETS: GbpPostPreset[] = [];
