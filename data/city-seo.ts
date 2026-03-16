export interface CityConfig {
  slug: string;
  name: string;
  driveTime: string;
  nearbyNote: string;
  population?: string;
}

export const CITIES: CityConfig[] = [
  { slug: "naperville", name: "Naperville", driveTime: "15 minutes", nearbyNote: "Just 15 minutes south on Route 59", population: "150,000+" },
  { slug: "aurora", name: "Aurora", driveTime: "20 minutes", nearbyNote: "A quick 20-minute drive east on Route 30", population: "180,000+" },
  { slug: "plainfield", name: "Plainfield", driveTime: "15 minutes", nearbyNote: "Just 15 minutes south on Route 126", population: "45,000+" },
  { slug: "montgomery", name: "Montgomery", driveTime: "10 minutes", nearbyNote: "Right next door — less than 10 minutes away", population: "20,000+" },
  { slug: "yorkville", name: "Yorkville", driveTime: "10 minutes", nearbyNote: "Just 10 minutes west on Route 34", population: "22,000+" },
];

export interface DeviceConfig {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  accentColor: string;
  detailsPage: string;
  carePage: string;
  benefits: string[];
  conditions: string[];
  uniqueAdvantage: string;
  competitorNote: string;
}

export const DEVICES: DeviceConfig[] = [
  {
    slug: "morpheus8-burst",
    name: "Morpheus8 Burst RF Microneedling",
    shortName: "Morpheus8 Burst",
    tagline: "The Deepest RF Microneedling Available",
    description: "Morpheus8 Burst delivers radiofrequency energy at three depths simultaneously, penetrating up to 8mm — double the standard Morpheus8. This multi-level approach creates comprehensive collagen stimulation for dramatic skin tightening.",
    accentColor: "#E91E8C",
    detailsPage: "/morpheus8-burst-oswego-il",
    carePage: "/pre-post-care/morpheus8-burst",
    benefits: [
      "8mm depth — double the standard 4mm",
      "3 simultaneous depths in every pulse",
      "Fewer sessions needed",
      "Safe for all skin types",
      "Minimal downtime (3–5 days)",
      "Results improve for 3–6 months",
    ],
    conditions: [
      "Loose and sagging skin",
      "Fine lines and wrinkles",
      "Acne scars",
      "Jowls and jawline laxity",
      "Post-weight loss loose skin",
      "Crepey skin and enlarged pores",
    ],
    uniqueAdvantage: "Hello Gorgeous has Morpheus8 Burst — most local providers only have standard Morpheus8 (4mm). That's double the depth and triple the coverage.",
    competitorNote: "No other med spa in the area has Burst technology. Competitors offer standard Morpheus8 at best.",
  },
  {
    slug: "solaria-co2",
    name: "Solaria CO₂ Fractional Laser",
    shortName: "Solaria CO₂",
    tagline: "Gold Standard Skin Resurfacing",
    description: "Solaria is a medical-grade fractional CO₂ laser that removes damaged outer skin layers while stimulating deep collagen and elastin production. It's the most powerful skin resurfacing treatment available — period.",
    accentColor: "#FFD700",
    detailsPage: "/solaria-co2-laser-oswego-il",
    carePage: "/pre-post-care/solaria-co2",
    benefits: [
      "Gold standard in skin resurfacing",
      "Dramatic results in one treatment",
      "Deep collagen stimulation (3–6 months)",
      "Treats surface AND deep tissue",
      "Customizable depth and intensity",
      "Fractional technology for faster healing",
    ],
    conditions: [
      "Deep wrinkles and fine lines",
      "Acne scars",
      "Sun damage and age spots",
      "Uneven skin tone and texture",
      "Skin laxity and crepey skin",
      "Stretch marks and surgical scars",
    ],
    uniqueAdvantage: "No other med spa in Oswego, Naperville, Aurora, or Plainfield has Solaria CO₂. We are the only fractional CO₂ laser provider in the western suburbs.",
    competitorNote: "Competitors have written that you need to go to Naperville or Chicago for 'intensive resurfacing.' That's no longer true.",
  },
  {
    slug: "quantum-rf",
    name: "QuantumRF Subdermal Skin Tightening",
    shortName: "QuantumRF",
    tagline: "Surgical-Level Results Without Surgery",
    description: "QuantumRF delivers radiofrequency energy beneath the skin surface to tighten tissue, contour the body, and stimulate collagen — all without incisions, general anesthesia, or extended downtime.",
    accentColor: "#00BFFF",
    detailsPage: "/quantum-rf-oswego-il",
    carePage: "/pre-post-care/quantum-rf",
    benefits: [
      "Surgical-level tightening without surgery",
      "No general anesthesia required",
      "Immediate tissue contraction",
      "Collagen remodeling for 3–6 months",
      "Treats face AND body",
      "Quick recovery vs. surgical alternatives",
    ],
    conditions: [
      "Loose facial skin and jowls",
      "Neck laxity and double chin",
      "Post-weight loss loose skin",
      "Abdominal skin looseness",
      "Arm and thigh laxity",
      "Body contouring",
    ],
    uniqueAdvantage: "QuantumRF is exclusive to Hello Gorgeous in the entire western Chicago suburbs. No other provider from Naperville to Yorkville offers subdermal RF contouring.",
    competitorNote: "Nobody in the area has QuantumRF. Competitors offer external RF at best, which cannot reach subdermal tissue.",
  },
];

export function getCityDeviceSlug(city: CityConfig, device: DeviceConfig): string {
  return `${device.slug}-${city.slug}-il`;
}
