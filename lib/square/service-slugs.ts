// ============================================================
// SERVICE SLUG MAP — premium SEO landing pages → Square services
// ============================================================
// Each slug used in /book?service=<slug> resolves to a specific Square
// Appointments service via case-insensitive name match. The URL the user
// lands on opens Square's flow with that service preselected.
//
// To add/change a slug:
//   1. Add an entry here
//   2. Use href="/book?service=<slug>" on the matching landing page
//   3. /book picks up the new slug automatically — no other code change
// ============================================================

import "server-only";
import { findServicesByPatterns, getSquareCatalog } from "@/lib/square/catalog";

/**
 * Slug → ordered list of name patterns. The first matching service in
 * Square is used. Order matters — put the most-specific name first.
 */
export const SERVICE_SLUG_MAP: Record<string, string[]> = {
  // Headline injectables
  botox: ["Botox / Jeuveau / Dysport"],
  // RF microneedling — pick the highest-tier AnteAGE option as the headline
  "microneedling-rf": [
    "AnteAGE Microneedling — Exosomes + Biosomes (Best Results)",
    "AnteAGE MD Microneedling Treatment",
    "Microneedling",
  ],
  // GLP-1 / weight loss — first-injection pricing as the entry point
  "weight-loss-therapy": [
    "Tirzepatide — Initial Consult + First Injection",
    "Semaglutide — Initial Consult + First Injection",
    "Medical Weight Management Program",
  ],
  // Morpheus8 — Combo is the headline ($1,499 most popular)
  morpheus8: [
    "Morpheus8 + CO₂ Combo — Most Popular",
    "Morpheus8 Burst x3 Package",
    "Morpheus8 Burst — Buy One Area, Get One 50% Off",
  ],
  // BioTE / Hormone therapy
  "biote-hormone-therapy": [
    "Pellet Therapy — Women",
    "Pellet Therapy — Men",
  ],
  // IPL Photofacial
  "ipl-photofacial": ["Photofacials (IPL)"],
  // Quantum RF Lipo
  "quantum-rf": ["Quantum RF Lipo — Abdomen"],
  // Solaria CO₂
  "solaria-co2": ["Solaria CO₂ Laser"],
};

/**
 * Resolve a slug to a Square service ID via the live catalog. Returns null
 * if the slug isn't mapped or no matching service is found in Square.
 */
export async function resolveServiceIdForSlug(slug: string): Promise<string | null> {
  const patterns = SERVICE_SLUG_MAP[slug];
  if (!patterns || patterns.length === 0) return null;
  try {
    const { services } = await getSquareCatalog();
    for (const pattern of patterns) {
      const matches = findServicesByPatterns(services, [pattern]);
      // Prefer exact name match first, fall back to substring match
      const exact = matches.find((s) => s.name.toLowerCase() === pattern.toLowerCase());
      if (exact) return exact.id;
      if (matches.length > 0) return matches[0].id;
    }
    return null;
  } catch (e) {
    console.warn("[service-slugs] Square catalog lookup failed:", e);
    return null;
  }
}
