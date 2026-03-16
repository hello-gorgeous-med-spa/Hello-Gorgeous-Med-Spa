/**
 * Best of Oswego Rankings — Single source of truth
 * Displayed across the site like Smooth Solutions does.
 * Update categories here when new awards are won.
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
