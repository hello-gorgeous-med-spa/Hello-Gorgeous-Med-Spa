/**
 * Semaglutide Spring Break Special — $299/month
 * Oversight, screening, and medicine included.
 * Used across landing pages and city-specific SEO.
 */

export const SPRING_BREAK_SPECIAL = {
  price: "$299",
  priceUnit: "/month",
  originalPrice: "$599",
  promoLabel: "Spring Break Special",
  headline: "Get Beach-Ready",
  subheadline: "Semaglutide / Ozempic Medical Weight Loss",
  tagline: "Everything Included — Oversight, Screening & Medicine",
  benefits: [
    { icon: "👩‍⚕️", label: "Medical Oversight", desc: "NP-supervised throughout" },
    { icon: "✅", label: "Screening", desc: "Full eligibility evaluation" },
    { icon: "💉", label: "Medicine Included", desc: "Semaglutide in your monthly price" },
  ],
  cities: [
    { slug: "oswego", name: "Oswego", driveTime: "right here", note: "Located in downtown Oswego" },
    { slug: "naperville", name: "Naperville", driveTime: "15 min", note: "Just 15 minutes south on Route 59" },
    { slug: "aurora", name: "Aurora", driveTime: "20 min", note: "Quick drive east on Route 30" },
    { slug: "plainfield", name: "Plainfield", driveTime: "15 min", note: "15 minutes south on Route 126" },
    { slug: "montgomery", name: "Montgomery", driveTime: "10 min", note: "Right next door" },
    { slug: "yorkville", name: "Yorkville", driveTime: "10 min", note: "10 minutes west on Route 34" },
  ],
  cta: "Book Your Consultation",
  limitedTime: "Limited Time — Spring Break Special",
  keywords: [
    "semaglutide $299",
    "ozempic weight loss",
    "weight loss special",
    "GLP-1 $299",
    "medical weight loss",
    "semaglutide near me",
    "ozempic near me",
  ],
} as const;

export type SpringBreakCity = (typeof SPRING_BREAK_SPECIAL.cities)[number];
