// ============================================================
// SERVICE SLUG MAP — premium SEO landing pages → Square services
// ============================================================
// Each slug used in /book?service=<slug> resolves to a Square Appointments
// *variation* ID so the guest lands on that SKU, not a blank calendar.
//
// To add/change a slug:
//   1. Add an entry here (most-specific Square name first)
//   2. Use href="/book?service=<slug>" on the matching landing page
// ============================================================

import "server-only";
import { findServicesByPatterns, getSquareCatalog } from "@/lib/square/catalog";

/**
 * Slug → ordered list of name patterns. The first matching *bookable* service
 * in Square is used. Order matters — put the most-specific name first.
 */
export const SERVICE_SLUG_MAP: Record<string, string[]> = {
  botox: ["Botox / Jeuveau / Dysport"],
  "botox-dysport-jeuveau": ["Botox / Jeuveau / Dysport"],
  kybella: ["Kybella"],
  "microneedling-rf": [
    "AnteAGE Microneedling — Exosomes + Biosomes (Best Results)",
    "AnteAGE MD Microneedling Treatment",
    "Microneedling",
  ],
  "weight-loss-therapy": [
    "Tirzepatide — Initial Consult + First Injection",
    "Semaglutide — Initial Consult + First Injection",
    "Medical Weight Management Program",
  ],
  tirzepatide: ["Tirzepatide — Initial Consult + First Injection"],
  semaglutide: ["Semaglutide — Initial Consult + First Injection"],
  morpheus8: [
    "Morpheus8 + CO₂ Combo — Most Popular",
    "Morpheus8 Burst — 3 Session Package",
    "Morpheus8 Burst x3 Package",
  ],
  "biote-hormone-therapy": [
    "Medical Visit with Ryan Kent, FNP-BC",
    "Hormone Lab Panel — Women",
  ],
  "ipl-photofacial": ["Photofacials (IPL)", "IPL Photofacial"],
  "quantum-rf": ["Quantum RF Lipo — Abdomen"],
  "solaria-co2": ["Solaria CO₂ — Face Treatment", "Solaria CO₂ Laser"],
  "dermal-fillers": ["Dermal Filler — Per Syringe", "Filler — 2 Syringes"],
  "lip-filler": ["Lip Filler — 1ml", "Lip Filler — 0.5ml"],
  "iv-therapy": ["IV Drip — Build Your Own Bag", "IV Drip — New Client Intro"],
  "vitamin-injections": ["Vitamin Injection Bar — Choose Your Shot"],
  "laser-hair-removal": ["Laser Hair Removal — Brazilian (Single Session)", "Laser Brazilian — 3-Month Package"],
  "hydra-facial": ["HydraFacial + Dermaplaning Glow Special", "HydraFacial"],
  "chemical-peels": ["Chemical Peel", "VI Peel"],
  prp: ["PRP — Hair Restoration", "Microneedling with PRP"],
  "prp-facial": ["Microneedling with PRP"],
  "lash-spa": ["Hybrid Lash Extensions — Full Set", "Classic Lash Extensions — Full Set"],
  "sermorelin-growth-peptide": ["RE GEN Peptide Consult", "Medical Visit with Ryan Kent, FNP-BC"],
  consultation: ["Consultation", "Medical Visit with Ryan Kent, FNP-BC"],
  flowwave: ["FlowWave Shockwave — Intro First Session (Any Area)", "FlowWave Shockwave — 6-Session Package"],
};

async function firstVariationId(patterns: string[]): Promise<string | null> {
  const { services } = await getSquareCatalog();
  for (const pattern of patterns) {
    const matches = findServicesByPatterns(services, [pattern]);
    const exact = matches.find((s) => s.name.toLowerCase() === pattern.toLowerCase());
    const hit = exact ?? matches[0];
    const variationId = hit?.variations?.[0]?.id;
    if (variationId) return variationId;
  }
  return null;
}

/** @deprecated Use resolveServiceVariationIdForSlug — Square book URLs need variation IDs. */
export async function resolveServiceIdForSlug(slug: string): Promise<string | null> {
  return resolveServiceVariationIdForSlug(slug);
}

/** Resolve a /book?service= slug to a Square Appointments variation ID. */
export async function resolveServiceVariationIdForSlug(slug: string): Promise<string | null> {
  const key = slug.trim().toLowerCase();
  const patterns = SERVICE_SLUG_MAP[key];
  if (!patterns?.length) return null;
  try {
    return await firstVariationId(patterns);
  } catch (e) {
    console.warn("[service-slugs] Square catalog lookup failed:", e);
    return null;
  }
}
