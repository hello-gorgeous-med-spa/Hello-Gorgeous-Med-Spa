/**
 * Oswego #1 playbook — goals, GBP fixes, social cadence, ad links.
 * Used by /admin/local-dominance-sprint (Oswego command center).
 */

export const OSWEGO_RX_GOAL_USD = 30_000;
export const OSWEGO_RX_GOAL_LABEL = "Peptide + GLP-1 gross revenue (Jul–Dec 2026)";

export const OSWEGO_RIVAL = {
  name: "HER Aesthetics",
  searchQuery: "HER Aesthetics Medical Spa Oswego IL",
  addressNote: "123 W Washington St — same downtown strip as Hello Gorgeous",
  website: "https://www.heraestheticsmed.com/",
} as const;

export const HG_GOOGLE_PLACE_ID = "ChIJt2xHqd_vDogRhA5aZP8dzBA";

/** From docs/GBP-VISIBILITY-FIXES.md — do once, re-check monthly */
export const GBP_SETUP_CHECKLIST: { id: string; label: string; detail: string }[] = [
  {
    id: "services-list",
    label: "List every service individually in GBP",
    detail:
      "Botox, Dysport, Morpheus8, semaglutide, tirzepatide, peptide therapy, hormone therapy, IV therapy, lip filler, laser hair removal, HydraFacial, etc.",
  },
  {
    id: "appointment-required",
    label: "Set “Appointment required” (not walk-in)",
    detail: "Med spas should not show “appointment not required” — hurts map relevance.",
  },
  {
    id: "description-medspa",
    label: "Description says “medical spa” — not “day spa”",
    detail: "Replace day-spa language with NP-supervised medical spa + memberships + GLP-1.",
  },
  {
    id: "photos-100",
    label: "100+ GBP photos (storefront, Ryan, rooms, Vitamin Bar)",
    detail: "Upload 5 new photos every week until you hit 100+.",
  },
  {
    id: "weekly-posts",
    label: "2–3 GBP posts per week",
    detail: "Use Post to Social → Blast presets or Google Post Campaigns.",
  },
  {
    id: "review-velocity",
    label: "5+ new Google reviews per week",
    detail: "QR at checkout → hellogorgeousmedspa.com/review · respond within 24h.",
  },
  {
    id: "products-memberships",
    label: "Add Products: Glow / Luxe / Platinum + Vitamin Bar tiers",
    detail: "GBP Products tab with prices helps membership + local SEO.",
  },
];

export type WeeklyBlastSlot = {
  day: string;
  theme: string;
  facebookPresetId: string;
  googlePresetId: string;
  adminRoute: string;
};

/** Mon / Wed / Fri — matches shipped blast presets */
export const WEEKLY_SOCIAL_BLAST: WeeklyBlastSlot[] = [
  {
    day: "Monday",
    theme: "Memberships — Glow / Luxe / Platinum",
    facebookPresetId: "blast-memberships",
    googlePresetId: "blast-memberships",
    adminRoute: "/admin/marketing/post-social",
  },
  {
    day: "Wednesday",
    theme: "GLP-1 weight loss — published pricing",
    facebookPresetId: "blast-glp1",
    googlePresetId: "blast-glp1",
    adminRoute: "/admin/marketing/post-social",
  },
  {
    day: "Friday",
    theme: "Peptides + Hello Gorgeous app",
    facebookPresetId: "blast-rx-peptides-app",
    googlePresetId: "blast-wellness-hub",
    adminRoute: "/admin/marketing/social-content-agent",
  },
];

export const AD_LANDING_LINKS = [
  {
    label: "GLP-1 hub (Google/Meta ads)",
    path: "/glp-1-weight-loss-oswego?utm_source=paid&utm_medium=cpc&utm_campaign=glp1_oswego",
  },
  {
    label: "GLP-1 screener",
    path: "/quiz/glp-1-readiness?utm_source=paid&utm_medium=cpc&utm_campaign=glp1_screener",
  },
  {
    label: "Peptide request",
    path: "/peptide-request?utm_source=paid&utm_medium=cpc&utm_campaign=peptide_oswego",
  },
  {
    label: "Memberships",
    path: "/memberships?utm_source=paid&utm_medium=cpc&utm_campaign=memberships_oswego",
  },
  {
    label: "Book consult",
    path: "/book?utm_source=paid&utm_medium=cpc&utm_campaign=book_oswego",
  },
] as const;

/** Track in incognito weekly — from ZERO-BUDGET-SEO-PLAN */
export const OSWEGO_KEYWORD_WATCHLIST = [
  "best med spa oswego",
  "botox oswego",
  "med spa oswego",
  "glp-1 weight loss oswego",
  "semaglutide oswego",
  "peptide therapy oswego",
  "morpheus8 burst oswego",
] as const;

export const NUMBER_ONE_PILLARS = [
  {
    title: "Win Google Maps in Oswego",
    metric: "Map pack top 3 for “med spa Oswego” + beat HER on reviews",
    actions: ["GBP checklist", "5 reviews/week", "weekly posts"],
  },
  {
    title: "Own GLP-1 + peptide intent",
    metric: "$30k RX gross by Dec · 3 paid starts/week",
    actions: ["Warm lead follow-up", "RX invoices same day", "Mon/Wed/Fri social"],
  },
  {
    title: "Convert faster than rivals",
    metric: "Lead → consult booked in 24h · approved → paid same day",
    actions: ["5-min SMS on leads", "Checkout screener QR", "RX Dispatch daily"],
  },
] as const;
