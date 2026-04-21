/**
 * The Glow Social — May 14, 2026 · Freddie's Off the Chain, Oswego
 * Update dates, copy, and flyer path here; landing page and schema read from this file.
 */

export const THE_GLOW_SOCIAL = {
  slugPath: "/events/the-glow-social",
  title: "The Glow Social",
  headline: "Hello, Gorgeous — The Glow Social",
  subhead: "An evening of glow, glam & gratitude",
  tagline: "Get ready for summer · Beauty, bites & bubbly — FREE to attend, RSVP required",
  /** ISO 8601 — Central Time */
  startDateIso: "2026-05-14T17:00:00-05:00",
  endDateIso: "2026-05-14T20:00:00-05:00",
  display: {
    dateLine: "Thursday, May 14, 2026",
    timeLine: "5:00 – 8:00 PM",
  },
  venue: {
    name: "Freddie's Off the Chain",
    streetAddress: "11 S Madison St",
    addressLocality: "Oswego",
    addressRegion: "IL",
    postalCode: "60543",
    mapsQuery: "Freddie's Off the Chain 11 S Madison St Oswego IL",
  },
  hostsNote:
    "A heartfelt collaboration with Freddie's Off the Chain — proudly hosted by Mona & Adrian Herrada.",
  costNote: "FREE to attend · RSVP required · appetizers provided · cash bar (21+ to drink)",
  foodBar: "Appetizers provided by Freddie's · Off The Chain & cash bar available.",
  flyerPdfPath: "/docs/events/the-glow-social-may-14-2026-flyer.pdf",
  experiences: [
    {
      title: "Solaria CO₂ laser",
      body: "Resurfacing for tone, texture, scarring & sun damage — learn how it fits your plan.",
    },
    {
      title: "Morpheus8 Burst",
      body: "RF microneedling up to 8mm — tightening, smoothing, face, neck & body.",
    },
    {
      title: "Quantum RF",
      body: "Non-surgical body sculpting & skin tightening — real fat reduction conversation with our team.",
    },
    {
      title: "Weight loss & wellness",
      body: "GLP-1s, peptides, BHRT, TRT, NAD+, IV therapy — 1-on-1 with Ryan Kent, FNP-BC (qualification rules apply).",
    },
  ],
  eventHighlights: [
    "Live demos & education — not a sales pitch, a real night out with your med spa team",
    "Free consults & summer-ready treatment planning",
    "The Trifecta story: Solaria + Morpheus8 Burst + Quantum RF",
  ],
  everyGuest: {
    title: "Every guest",
    detail: "FREE vitamin injection on site — choose B12, B-Complex, or MIC fat burner (administered by our medical team).",
  },
  raffleGrandPrizes: [
    "1st — Winner's choice: Morpheus8 Burst OR Solaria CO₂ (per event rules; medical evaluation required)",
    "2nd — 1 month FREE medical weight loss — semaglutide or tirzepatide upon qualification",
    "3rd — 20 units FREE Botox — administered by Ryan Kent, FNP-BC (candidacy required)",
  ],
  bonusEntries: [
    "+1 Follow us on Facebook",
    "+2 Leave a Google review",
    "+1 Every $100 spent at Hello Gorgeous until event day",
    "+1 Tag us in an Instagram/Facebook story",
    "+2 Bring a friend (RSVP with their name)",
    "+1 RSVP early — bonus entry for reserving your spot ahead of time",
  ],
} as const;

export function theGlowSocialMapsUrl(): string {
  const q = encodeURIComponent(THE_GLOW_SOCIAL.venue.mapsQuery);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
