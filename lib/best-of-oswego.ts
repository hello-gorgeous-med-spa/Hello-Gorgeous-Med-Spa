/**
 * Best of Oswego Rankings — Single source of truth
 * Displayed across the site. Update categories here when new awards are won.
 */
export const BEST_OF_OSWEGO = {
  /** Primary headline for hero/header */
  primary: "Best Med Spa in Oswego",
  /** Full list of rankings for badges and trust strips */
  rankings: [
    { label: "Best Med Spa in Oswego", rank: 1 },
    { label: "Best Skincare Clinic in Oswego", rank: 1 },
    { label: "Best Medical Weight Loss in Oswego", rank: 1 },
    { label: "Best Facial Treatments in Oswego", rank: 1 },
  ] as const,
  /** Short badge text for compact spaces */
  badgeShort: "Best of Oswego",
  /** Year for display */
  year: "2025",
} as const;

/**
 * Key differentiators — NP on site, full authority, latest technology.
 * Used for SEO, schema, trust strips, and marketing. Focus on our strengths only.
 */
export const DIFFERENTIATORS = {
  /** Full authority nurse practitioner on site as owner */
  npOnSite: "Full-authority nurse practitioner on site as owner",
  /** Latest technology — Class 4 lasers */
  class4Lasers: "Class 4 medical lasers",
  /** Only Oswego-area med spa with this tech stack */
  exclusiveTech:
    "Only Oswego-area med spa with Quantum RF, Morpheus8 Burst, and Solaria CO2",
  /** NEWEST Morpheus8 — critical for being picked first. Use everywhere. */
  morpheus8Newest:
    "Newest Morpheus8 Burst — deepest RF at 8mm for face AND body. Only med spa in Oswego, Naperville, Aurora, Plainfield with this technology.",
  /** Short tagline for trust strips */
  tagline: "#1 Med Spa · Morpheus8 Burst Face & Body · Quantum RF · Solaria CO2",
} as const;
