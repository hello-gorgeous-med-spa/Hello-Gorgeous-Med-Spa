/**
 * Phase 4 — unique local copy for primary city hub pages (`/{city}-il`).
 */

import type { PrimaryCitySlug } from "@/lib/city-seo-tier";

export type CityHubProfile = {
  slug: `${PrimaryCitySlug}-il`;
  name: string;
  county: string;
  driveTime: string;
  primaryRoute: string;
  heroSubline: string;
  /** City-specific paragraph — not shared template filler. */
  localContext: string;
  landmarks: string[];
  nearbyAreas: string[];
  faqDrive: string;
};

export const CITY_HUB_PROFILES: Record<`${PrimaryCitySlug}-il`, CityHubProfile> = {
  "oswego-il": {
    slug: "oswego-il",
    name: "Oswego",
    county: "Kendall County",
    driveTime: "Downtown — walkable from Washington Street",
    primaryRoute: "74 W. Washington St. at the Fox River bridge",
    heroSubline:
      "Your hometown med spa on Washington Street — NP on site seven days with Morpheus8 Burst, Solaria CO₂, and Hello Gorgeous RX under one roof.",
    localContext:
      "Hello Gorgeous is rooted in downtown Oswego: steps from the Fox River, local shops, and the village center clients already know. Kendall County families, teachers, nurses, and remote workers book injectables between errands, grab Morpheus8 consults after school pickup, and start GLP-1 or hormone programs without driving to Naperville or Chicago. We are not a franchise — Dani and Ryan Kent built this clinic for Oswego first, then the Fox Valley.",
    landmarks: ["Fox River", "downtown Washington St.", "village center"],
    nearbyAreas: ["Montgomery", "Yorkville", "Plainfield"],
    faqDrive:
      "We are at 74 W. Washington St. in downtown Oswego — parking on Washington and side streets near the river.",
  },
  "naperville-il": {
    slug: "naperville-il",
    name: "Naperville",
    county: "DuPage & Will counties",
    driveTime: "About 15 minutes",
    primaryRoute: "Route 59 south to Oswego, or Route 34 west through Plainfield",
    heroSubline:
      "Naperville clients skip the Riverwalk traffic for NP-led Botox, fillers, Morpheus8 Burst, and medical weight loss — without the big-city med-spa markup.",
    localContext:
      "Naperville residents often tell us they want clinical depth without the downtown Chicago price tag or assembly-line feel. Our Oswego clinic is a straight shot south on Route 59 or west on Route 34 — close enough for lunch-hour Botox, after-work HydraFacials, or a Saturday Morpheus8 consult. Many Naperville clients pair aesthetics with Ryan Kent's GLP-1 and hormone programs because the same NP team follows you from consult through refills.",
    landmarks: ["Route 59 corridor", "Naperville Riverwalk area", "south Naperville"],
    nearbyAreas: ["Plainfield", "Aurora", "Lisle"],
    faqDrive:
      "Most Naperville clients reach us in about 15 minutes via Route 59 to Oswego or Route 34 west through Plainfield.",
  },
  "aurora-il": {
    slug: "aurora-il",
    name: "Aurora",
    county: "Kane County",
    driveTime: "About 10–15 minutes",
    primaryRoute: "Route 30 south to Oswego, or Route 34 west from east Aurora",
    heroSubline:
      "Aurora and Fox Valley clients come to Oswego for technology other Kane County spas do not carry — Burst-depth RF, Solaria CO₂, QuantumRF, and NP-supervised medical programs.",
    localContext:
      "Aurora is one of our busiest drive markets: east-siders take Route 30 south; west Aurora and North Aurora clients often cut over on Route 34. They choose Hello Gorgeous when they want Burst Morpheus8 (8 mm multi-depth RF), fractional CO₂ resurfacing, or TRT and GLP-1 with an FNP-BC on site — not a rotating injector and a remote medical director. If you have been comparing med spas along Ogden or Route 59, our consult-first Oswego clinic is worth the short drive.",
    landmarks: ["Route 30", "Fox Valley", "east & west Aurora"],
    nearbyAreas: ["Montgomery", "North Aurora", "Batavia"],
    faqDrive:
      "From most of Aurora, plan 10–15 minutes south on Route 30 or west on Route 34 to downtown Oswego.",
  },
  "plainfield-il": {
    slug: "plainfield-il",
    name: "Plainfield",
    county: "Will County",
    driveTime: "About 12–15 minutes",
    primaryRoute: "Route 126 east to Route 34, into downtown Oswego",
    heroSubline:
      "Plainfield families and professionals book us for conservative injectables, teen-safe acne protocols, and GLP-1 programs — one team, one Oswego address.",
    localContext:
      "Plainfield sits perfectly between Naperville sprawl and Kendall County — many clients already drive Route 126 for groceries and school events, so adding a med-spa stop in Oswego is natural. We see a lot of first-time filler and Botox clients from Plainfield who want a nurse practitioner in the room, plus parents pairing skin treatments with weight-loss consults after GLP-1 buzz in their neighborhoods. Downtown Oswego parking is easy compared to big-box strip malls.",
    landmarks: ["Route 126", "Plainfield–Oswego corridor"],
    nearbyAreas: ["Naperville", "Oswego", "Joliet"],
    faqDrive:
      "Take Route 126 east to Route 34 into downtown Oswego — typically 12–15 minutes from central Plainfield.",
  },
  "yorkville-il": {
    slug: "yorkville-il",
    name: "Yorkville",
    county: "Kendall County",
    driveTime: "About 8–10 minutes",
    primaryRoute: "Route 47 / Route 71 north to Route 34, into Oswego",
    heroSubline:
      "Yorkville and Kendall County neighbors choose Hello Gorgeous for the same reason they shop local — trusted providers, advanced devices, and no need to head east for quality care.",
    localContext:
      "Yorkville clients are often surprised how quick the drive is — eight to ten minutes north puts you on Washington Street in Oswego. We are a natural fit for Kendall County residents who want Morpheus8 Burst, laser hair packages, or BioTE and peptide consults without fighting Naperville traffic. Many Yorkville weight-loss clients start with our $49 NP consult and move into Hello Gorgeous RX ship-to-home refills once they are established.",
    landmarks: ["Route 47", "Kendall County", "north Yorkville"],
    nearbyAreas: ["Oswego", "Montgomery", "Sandwich"],
    faqDrive:
      "Head north on Route 47 toward Oswego, connect to Route 34 — about 8–10 minutes from Yorkville.",
  },
  "montgomery-il": {
    slug: "montgomery-il",
    name: "Montgomery",
    county: "Kendall & Kane counties",
    driveTime: "Under 10 minutes",
    primaryRoute: "Route 30 south into downtown Oswego",
    heroSubline:
      "Montgomery is right next door — same-day Botox, fillers, IV Vitamin Bar, and hormone consults with Ryan Kent, FNP-BC, without crossing into Aurora traffic.",
    localContext:
      "Montgomery might be our closest neighbor after Oswego itself. Clients pop over on Route 30 for lunch-break toxin touch-ups, B12 shots, and couples' consults where one partner wants Botox and the other is exploring TRT. Because Montgomery sits on the Kane–Kendall line, we draw both suburban commuters and longtime Fox Valley families who want a med spa that feels personal — not a national chain at the mall.",
    landmarks: ["Route 30", "Montgomery–Oswego border"],
    nearbyAreas: ["Oswego", "Aurora", "Yorkville"],
    faqDrive:
      "Route 30 south into downtown Oswego — usually under 10 minutes from Montgomery.",
  },
};

export function getCityHubProfile(hubSlug: string): CityHubProfile | null {
  return CITY_HUB_PROFILES[hubSlug as keyof typeof CITY_HUB_PROFILES] ?? null;
}
