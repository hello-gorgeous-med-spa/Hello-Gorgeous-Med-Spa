/**
 * FlowWave — shockwave therapy brand tokens (nav + marketing shell).
 * Device marketing uses STEMWAVE™; public route is FlowWave FOCUS.
 */

export const FLOWWAVE_BRAND = {
  name: "FlowWave",
  product: "FlowWave FOCUS",
  stemwaveMark: "STEMWAVE",
  descriptor: "Shockwave Therapy",
  tagline: "Focused relief. Faster recovery.",
  pink: "#FF2D8E",
  pinkDeep: "#E6007E",
  blue: "#1A5F8A",
} as const;

export const FLOWWAVE_LOGO = {
  /** Full STEMWAVE™ shockwave therapy banner (Jul 2026). */
  primary: "/images/flowwave/brand/stemwave-shockwave-banner.png",
  navAlt: "STEMWAVE shockwave therapy by Hello Gorgeous Med Spa",
  width: 1024,
  height: 341,
} as const;
