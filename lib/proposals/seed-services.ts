export type SeedService = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description?: string;
};

export const HELLO_GORGEOUS_SERVICES: SeedService[] = [
  { id: "morpheus8-face", name: "Morpheus8 Burst - Face", category: "InMode Trifecta", price: 800, unit: "per session", description: "RF microneedling for face rejuvenation." },
  { id: "morpheus8-neck", name: "Morpheus8 Burst - Neck", category: "InMode Trifecta", price: 600, unit: "per session" },
  { id: "morpheus8-body", name: "Morpheus8 Burst - Body", category: "InMode Trifecta", price: 1200, unit: "per session" },
  { id: "quantum-rf", name: "Quantum RF Lipo", category: "InMode Trifecta", price: 900, unit: "per session", description: "Body contouring and skin tightening." },
  { id: "solaria-co2-full", name: "Solaria CO2 - Full Face", category: "InMode Trifecta", price: 1200, unit: "per session", description: "Laser resurfacing and rejuvenation." },
  { id: "solaria-co2-partial", name: "Solaria CO2 - Partial Face", category: "InMode Trifecta", price: 800, unit: "per session" },
  { id: "botox", name: "Botox", category: "Injectables", price: 12, unit: "per unit" },
  { id: "dysport", name: "Dysport", category: "Injectables", price: 10, unit: "per unit" },
  { id: "dermal-filler", name: "Dermal Filler", category: "Injectables", price: 650, unit: "per syringe" },
  { id: "lip-filler", name: "Lip Filler", category: "Injectables", price: 650, unit: "per syringe" },
  { id: "glp1-semaglutide", name: "GLP-1 Weight Loss (Semaglutide)", category: "Body & Wellness", price: 299, unit: "per month" },
  { id: "glp1-tirzepatide", name: "GLP-1 Weight Loss (Tirzepatide)", category: "Body & Wellness", price: 399, unit: "per month" },
  { id: "hormone-therapy", name: "Hormone Therapy (BHRT/TRT)", category: "Body & Wellness", price: 250, unit: "per month" },
  { id: "prp-facial", name: "PRP / PRF Facial", category: "Regenerative", price: 400, unit: "per session" },
  { id: "ez-prf-gel", name: "EZ PRF Gel", category: "Regenerative", price: 500, unit: "per session" },
  { id: "hydrafacial", name: "HydraFacial", category: "Skin & Face", price: 200, unit: "per session" },
  { id: "ipl-photofacial", name: "IPL Photofacial", category: "Skin & Face", price: 300, unit: "per session" },
];
