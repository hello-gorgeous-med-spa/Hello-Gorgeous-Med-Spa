/**
 * GBP (Google Business Profile) landing page URL mapping.
 * Each slug maps to a service key in lib/seo.ts SERVICES and a location label.
 * Used for /botox-oswego-il/, /lip-filler-oswego-il/, etc.
 */
export const GBP_SERVICE_SLUGS = [
  "botox-oswego-il",
  "lip-filler-oswego-il",
  "microneedling-oswego-il",
  "prf-hair-restoration-oswego-il",
  "hormone-therapy-oswego-il",
  "weight-loss-oswego-il",
  "iv-therapy-oswego-il",
  // Optional: other cities for same services (expand as needed)
  "botox-naperville-il",
  "lip-filler-naperville-il",
  "weight-loss-naperville-il",
  "botox-aurora-il",
  "weight-loss-aurora-il",
  "dermal-fillers-aurora-il",
  "lip-filler-aurora-il",
  "botox-plainfield-il",
  "weight-loss-plainfield-il",
  "botox-montgomery-il",
  "lip-filler-montgomery-il",
  "weight-loss-montgomery-il",
  "botox-yorkville-il",
  "lip-filler-yorkville-il",
  "weight-loss-yorkville-il",
  "botox-sugar-grove-il",
  "lip-filler-sugar-grove-il",
  "weight-loss-sugar-grove-il",
  "botox-ottawa-il",
  "lip-filler-ottawa-il",
  "weight-loss-ottawa-il",
  "botox-sandwich-il",
  "lip-filler-sandwich-il",
  "weight-loss-sandwich-il",
  "botox-bolingbrook-il",
  "lip-filler-bolingbrook-il",
  "weight-loss-bolingbrook-il",
] as const;

export type GbpServiceSlug = (typeof GBP_SERVICE_SLUGS)[number];

/** Map GBP URL slug -> { serviceSlug (from SERVICES), cityLabel } */
export const GBP_SLUG_TO_SERVICE: Record<
  string,
  { serviceSlug: string; cityLabel: string }
> = {
  "botox-oswego-il": { serviceSlug: "botox-dysport-jeuveau", cityLabel: "Oswego, IL" },
  "lip-filler-oswego-il": { serviceSlug: "lip-filler", cityLabel: "Oswego, IL" },
  "microneedling-oswego-il": { serviceSlug: "rf-microneedling", cityLabel: "Oswego, IL" },
  "prf-hair-restoration-oswego-il": { serviceSlug: "prf-prp", cityLabel: "Oswego, IL" },
  "hormone-therapy-oswego-il": { serviceSlug: "biote-hormone-therapy", cityLabel: "Oswego, IL" },
  "weight-loss-oswego-il": { serviceSlug: "weight-loss-therapy", cityLabel: "Oswego, IL" },
  "iv-therapy-oswego-il": { serviceSlug: "iv-therapy", cityLabel: "Oswego, IL" },
  "botox-naperville-il": { serviceSlug: "botox-dysport-jeuveau", cityLabel: "Naperville, IL" },
  "lip-filler-naperville-il": { serviceSlug: "lip-filler", cityLabel: "Naperville, IL" },
  "weight-loss-naperville-il": { serviceSlug: "weight-loss-therapy", cityLabel: "Naperville, IL" },
  "botox-aurora-il": { serviceSlug: "botox-dysport-jeuveau", cityLabel: "Aurora, IL" },
  "weight-loss-aurora-il": { serviceSlug: "weight-loss-therapy", cityLabel: "Aurora, IL" },
  "dermal-fillers-aurora-il": { serviceSlug: "dermal-fillers", cityLabel: "Aurora, IL" },
  "lip-filler-aurora-il": { serviceSlug: "lip-filler", cityLabel: "Aurora, IL" },
  "botox-plainfield-il": { serviceSlug: "botox-dysport-jeuveau", cityLabel: "Plainfield, IL" },
  "weight-loss-plainfield-il": { serviceSlug: "weight-loss-therapy", cityLabel: "Plainfield, IL" },
  "botox-montgomery-il": { serviceSlug: "botox-dysport-jeuveau", cityLabel: "Montgomery, IL" },
  "lip-filler-montgomery-il": { serviceSlug: "lip-filler", cityLabel: "Montgomery, IL" },
  "weight-loss-montgomery-il": { serviceSlug: "weight-loss-therapy", cityLabel: "Montgomery, IL" },
  "botox-yorkville-il": { serviceSlug: "botox-dysport-jeuveau", cityLabel: "Yorkville, IL" },
  "lip-filler-yorkville-il": { serviceSlug: "lip-filler", cityLabel: "Yorkville, IL" },
  "weight-loss-yorkville-il": { serviceSlug: "weight-loss-therapy", cityLabel: "Yorkville, IL" },
  "botox-sugar-grove-il": { serviceSlug: "botox-dysport-jeuveau", cityLabel: "Sugar Grove, IL" },
  "lip-filler-sugar-grove-il": { serviceSlug: "lip-filler", cityLabel: "Sugar Grove, IL" },
  "weight-loss-sugar-grove-il": { serviceSlug: "weight-loss-therapy", cityLabel: "Sugar Grove, IL" },
  "botox-ottawa-il": { serviceSlug: "botox-dysport-jeuveau", cityLabel: "Ottawa, IL" },
  "lip-filler-ottawa-il": { serviceSlug: "lip-filler", cityLabel: "Ottawa, IL" },
  "weight-loss-ottawa-il": { serviceSlug: "weight-loss-therapy", cityLabel: "Ottawa, IL" },
  "botox-sandwich-il": { serviceSlug: "botox-dysport-jeuveau", cityLabel: "Sandwich, IL" },
  "lip-filler-sandwich-il": { serviceSlug: "lip-filler", cityLabel: "Sandwich, IL" },
  "weight-loss-sandwich-il": { serviceSlug: "weight-loss-therapy", cityLabel: "Sandwich, IL" },
  "botox-bolingbrook-il": { serviceSlug: "botox-dysport-jeuveau", cityLabel: "Bolingbrook, IL" },
  "lip-filler-bolingbrook-il": { serviceSlug: "lip-filler", cityLabel: "Bolingbrook, IL" },
  "weight-loss-bolingbrook-il": { serviceSlug: "weight-loss-therapy", cityLabel: "Bolingbrook, IL" },
};

/** Med-spa location page slugs (e.g. /med-spa-oswego-il/) */
export const MED_SPA_LOCATION_SLUGS = [
  "med-spa-oswego-il",
  "med-spa-naperville-il",
  "med-spa-aurora-il",
  "med-spa-plainfield-il",
  "med-spa-yorkville-il",
  "med-spa-montgomery-il",
  "med-spa-sugar-grove-il",
  "med-spa-ottawa-il",
  "med-spa-sandwich-il",
  "med-spa-bolingbrook-il",
] as const;

export type MedSpaLocationSlug = (typeof MED_SPA_LOCATION_SLUGS)[number];

/** Map med-spa slug -> city label and existing hub path */
export const MED_SPA_SLUG_TO_CITY: Record<string, { cityLabel: string; hubPath: string }> = {
  "med-spa-oswego-il": { cityLabel: "Oswego, IL", hubPath: "/oswego-il" },
  "med-spa-naperville-il": { cityLabel: "Naperville, IL", hubPath: "/naperville-il" },
  "med-spa-aurora-il": { cityLabel: "Aurora, IL", hubPath: "/aurora-il" },
  "med-spa-plainfield-il": { cityLabel: "Plainfield, IL", hubPath: "/plainfield-il" },
  "med-spa-yorkville-il": { cityLabel: "Yorkville, IL", hubPath: "/yorkville-il" },
  "med-spa-montgomery-il": { cityLabel: "Montgomery, IL", hubPath: "/montgomery-il" },
  "med-spa-sugar-grove-il": { cityLabel: "Sugar Grove, IL", hubPath: "/sugar-grove-il" },
  "med-spa-ottawa-il": { cityLabel: "Ottawa, IL", hubPath: "/oswego-il" },
  "med-spa-sandwich-il": { cityLabel: "Sandwich, IL", hubPath: "/oswego-il" },
  "med-spa-bolingbrook-il": { cityLabel: "Bolingbrook, IL", hubPath: "/oswego-il" },
};
