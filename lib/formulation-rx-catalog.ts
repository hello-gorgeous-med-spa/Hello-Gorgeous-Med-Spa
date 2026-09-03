/**
 * Formulation Rx Catalog Integration
 * 
 * Patient pricing catalog from Formulation Rx with 4,974 products.
 * Updated: September 2026
 * 
 * Categories:
 * - Weight Management (88 products) - Semaglutide, Tirzepatide, etc.
 * - Hormone Therapy (349 products) - Bi-Est, Testosterone, DHEA, etc.
 * - Sexual Health (244 products) - PT-141, TriMix, etc.
 * - Peptide (23 products) - Sermorelin, Tesamorelin, etc.
 * - Anti-Aging (47 products) - NAD+, GHK-Cu, Rapamycin, etc.
 * - Hair Loss (47 products) - Dutasteride, Finasteride, etc.
 * - Injectable Nutrients (22 products) - B12, Biotin, Glutathione, etc.
 * - Dermatology (12 products)
 * - Wellness (24 products)
 * - IV Therapy (9 products)
 * - Retail Generic (3,961 products)
 */

export interface FormulationRxProduct {
  sku: string;
  product: string;
  strength: string;
  category: string;
  patient_price: number;
}

export const FORMULATION_RX_CATEGORIES = [
  'Weight Management',
  'Hormone Therapy',
  'Sexual Health',
  'Peptide',
  'Anti-Aging',
  'Hair Loss',
  'Injectable Nutrients',
  'Dermatology',
  'Wellness',
  'IV Therapy',
  'Pain Management',
  'Retail Generic',
] as const;

export type FormulationRxCategory = typeof FORMULATION_RX_CATEGORIES[number];

/**
 * Calculate REGEN RX retail price from wholesale
 * Formula: (wholesale * 2.5) + $25 shipping
 */
export function calculateRetailPrice(wholesalePrice: number): number {
  return Math.round(wholesalePrice * 2.5 + 25);
}

/**
 * Calculate profit margin
 */
export function calculateMargin(wholesalePrice: number, retailPrice?: number): {
  retail: number;
  profit: number;
  marginPercent: number;
} {
  const retail = retailPrice ?? calculateRetailPrice(wholesalePrice);
  const profit = retail - wholesalePrice;
  const marginPercent = Math.round((profit / retail) * 100);
  return { retail, profit, marginPercent };
}

// Featured products for quick access in the portal
export const FEATURED_PRODUCTS: FormulationRxProduct[] = [
  // Weight Management - GLP-1s
  { sku: '2488', product: 'Semaglutide / B6 (Pyridoxine)', strength: '1mL Vial · 2.5mg/10mg/mL', category: 'Weight Management', patient_price: 75 },
  { sku: '2489', product: 'Semaglutide / B6 (Pyridoxine)', strength: '2mL Vial · 2.5mg/10mg/mL', category: 'Weight Management', patient_price: 125 },
  { sku: '2490', product: 'Semaglutide / B6 (Pyridoxine)', strength: '3mL · 2.5mg/10mg/mL', category: 'Weight Management', patient_price: 165 },
  { sku: '2491', product: 'Semaglutide / B6 (Pyridoxine)', strength: '4mL · 2.5mg/10mg/mL', category: 'Weight Management', patient_price: 200 },
  { sku: '2498', product: 'Tirzepatide / B6 (Pyridoxine)', strength: '1mL Vial · 12.5mg/10mg/mL', category: 'Weight Management', patient_price: 135 },
  { sku: '2499', product: 'Tirzepatide / B6 (Pyridoxine)', strength: '2mL · 12.5mg/10mg/mL', category: 'Weight Management', patient_price: 225 },
  { sku: '2500', product: 'Tirzepatide / B6 (Pyridoxine)', strength: '3mL · 12.5mg/10mg/mL', category: 'Weight Management', patient_price: 315 },
  { sku: '2501', product: 'Tirzepatide / B6 (Pyridoxine)', strength: '4mL · 12.5mg/10mg/mL', category: 'Weight Management', patient_price: 400 },
  
  // Injectable Nutrients
  { sku: '4041', product: 'B12 Methylcobalamin', strength: '10mL · 5mg/mL', category: 'Injectable Nutrients', patient_price: 30 },
  { sku: '4042', product: 'B12 Methylcobalamin', strength: '30mL · 5mg/mL', category: 'Injectable Nutrients', patient_price: 65 },
  { sku: '4039', product: 'Biotin', strength: '10mL · 10mg/mL (High Concentration)', category: 'Injectable Nutrients', patient_price: 57 },
  { sku: '4033', product: 'Glutathione', strength: '30mL · 200mg/mL', category: 'Injectable Nutrients', patient_price: 58 },
  { sku: '4032', product: 'Glutathione', strength: '5mL · 200mg/mL', category: 'Injectable Nutrients', patient_price: 27 },
  { sku: '4031', product: 'Myers Cocktail', strength: '10mL · Mag/Ca/B-complex/Vitamin C premix', category: 'Injectable Nutrients', patient_price: 62 },
  { sku: '4034', product: 'Tri-Immune Boost', strength: '30mL · Ascorbic Acid/Glutathione/Zinc Sulfate', category: 'Injectable Nutrients', patient_price: 65 },
  
  // Anti-Aging / NAD+
  { sku: '3839', product: 'NAD+ Sterile Injection Solution', strength: '10mL vial · 200mg/mL', category: 'Anti-Aging', patient_price: 140 },
  { sku: '3640', product: 'NAD Injectable Solution', strength: '20mL (10 vials) · 50mg/ml', category: 'Anti-Aging', patient_price: 300 },
  { sku: '3122', product: 'NAD+ Acid Resistant Capsules', strength: '30 Capsules · 100mg', category: 'Anti-Aging', patient_price: 137 },
  
  // Peptides
  { sku: '2884', product: 'Sermorelin Injection', strength: '6mL Vial · 1mg/mL', category: 'Peptide', patient_price: 65 },
  { sku: '2885', product: 'Sermorelin Injection', strength: '6mL Vial · 1.5mg/mL', category: 'Peptide', patient_price: 85 },
  { sku: '3502', product: 'PT-141 (Bremelanotide)', strength: '10mL Vial · 2mg/mL', category: 'Peptide', patient_price: 125 },
  { sku: '2896', product: 'Tesamorelin Sterile Injection', strength: '3mL Vial · 5mg/mL', category: 'Peptide', patient_price: 320 },
  { sku: '3812', product: 'Thymosin Beta 4 Acetate', strength: '4mL vial · 2.5mg/mL', category: 'Peptide', patient_price: 80 },
  
  // Hair Loss
  { sku: '3096', product: 'Dutasteride Capsules', strength: '30 Capsules · 2.5mg', category: 'Hair Loss', patient_price: 55 },
  { sku: '3098', product: 'Finasteride / Tretinoin / Fluocinolone', strength: '30mL Topical · 0.25%/0.01%/0.01%', category: 'Hair Loss', patient_price: 60 },
  { sku: '3137', product: 'GHK-Cu/Biotin Topical Foam', strength: '30mL · 0.25%/1%', category: 'Hair Loss', patient_price: 88 },
  
  // Hormone Therapy
  { sku: '2785', product: 'Anastrozole Capsules', strength: '30 Capsules · 0.5mg', category: 'Hormone Therapy', patient_price: 49 },
  { sku: '2575', product: 'Bi-Est (E3/E2) 50/50 Sublingual', strength: '30 Tablets · 1mg', category: 'Hormone Therapy', patient_price: 56 },
];

// API endpoint for Formulation Rx
export const FORMULATION_RX_CONFIG = {
  apiBaseUrl: process.env.FORMUCONNECT_API_URL || 'https://api.formulationrx.com',
  apiKey: process.env.FORMUCONNECT_API_KEY,
  webhookUrl: 'https://tryregenrx.com/api/regen/formuconnect/webhook',
};
