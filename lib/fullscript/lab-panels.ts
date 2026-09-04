/**
 * REGEN RX Lab Panels
 * 
 * Pre-configured lab panels for different treatment categories.
 * These are the panels patients can order through REGEN RX.
 */

export interface LabPanel {
  id: string;
  name: string;
  description: string;
  price: number; // Patient price
  wholesaleCost: number; // Our cost from Fullscript
  requiredFor: string[]; // Treatment categories that require this
  tests: string[]; // List of individual tests included
  turnaroundDays: string;
  fastingRequired: boolean;
  icon: string;
}

export const LAB_PANELS: LabPanel[] = [
  {
    id: 'glp1-panel',
    name: 'GLP-1 Weight Loss Panel',
    description: 'Required baseline labs before starting Semaglutide or Tirzepatide. Checks metabolic health, kidney/liver function, and blood sugar control.',
    price: 149,
    wholesaleCost: 55,
    requiredFor: ['weight-loss', 'semaglutide', 'tirzepatide'],
    tests: [
      'Comprehensive Metabolic Panel (CMP)',
      'Lipid Panel (Cholesterol, Triglycerides, HDL, LDL)',
      'HbA1c (Hemoglobin A1c)',
      'TSH (Thyroid Stimulating Hormone)',
    ],
    turnaroundDays: '2-3',
    fastingRequired: true,
    icon: '📉',
  },
  {
    id: 'womens-hormone-panel',
    name: "Women's Hormone Panel",
    description: 'Comprehensive hormone assessment for women considering HRT. Evaluates estrogen, progesterone, testosterone, and thyroid function.',
    price: 199,
    wholesaleCost: 85,
    requiredFor: ['hormones', 'hrt-women'],
    tests: [
      'Estradiol (E2)',
      'Progesterone',
      'Total Testosterone',
      'Free Testosterone',
      'SHBG (Sex Hormone Binding Globulin)',
      'FSH (Follicle Stimulating Hormone)',
      'LH (Luteinizing Hormone)',
      'TSH',
      'Complete Blood Count (CBC)',
    ],
    turnaroundDays: '3-5',
    fastingRequired: false,
    icon: '♀️',
  },
  {
    id: 'mens-hormone-panel',
    name: "Men's TRT Panel",
    description: 'Complete testosterone and metabolic panel for men considering TRT. Includes PSA screening for prostate health.',
    price: 199,
    wholesaleCost: 90,
    requiredFor: ['hormones', 'hrt-men', 'trt'],
    tests: [
      'Total Testosterone',
      'Free Testosterone',
      'Estradiol (E2)',
      'SHBG (Sex Hormone Binding Globulin)',
      'LH (Luteinizing Hormone)',
      'FSH (Follicle Stimulating Hormone)',
      'PSA (Prostate Specific Antigen)',
      'Complete Blood Count (CBC)',
      'Comprehensive Metabolic Panel (CMP)',
      'Lipid Panel',
    ],
    turnaroundDays: '3-5',
    fastingRequired: true,
    icon: '♂️',
  },
  {
    id: 'comprehensive-wellness',
    name: 'Comprehensive Wellness Panel',
    description: 'Our most thorough panel covering hormones, metabolic health, thyroid, vitamins, and inflammation markers. Ideal for full health optimization.',
    price: 299,
    wholesaleCost: 150,
    requiredFor: [],
    tests: [
      'Comprehensive Metabolic Panel (CMP)',
      'Complete Blood Count (CBC)',
      'Lipid Panel',
      'HbA1c',
      'TSH',
      'Free T3',
      'Free T4',
      'Total Testosterone',
      'Free Testosterone',
      'Estradiol',
      'DHEA-S',
      'Cortisol (AM)',
      'Vitamin D, 25-Hydroxy',
      'Vitamin B12',
      'Ferritin',
      'hs-CRP (Inflammation)',
      'Homocysteine',
    ],
    turnaroundDays: '5-7',
    fastingRequired: true,
    icon: '🧬',
  },
  {
    id: 'peptide-baseline',
    name: 'Peptide Therapy Baseline',
    description: 'Basic panel for peptide therapy monitoring. Checks metabolic function and growth factors.',
    price: 129,
    wholesaleCost: 50,
    requiredFor: ['peptides', 'growth'],
    tests: [
      'Comprehensive Metabolic Panel (CMP)',
      'IGF-1 (Insulin-like Growth Factor)',
      'Fasting Glucose',
      'Fasting Insulin',
    ],
    turnaroundDays: '2-3',
    fastingRequired: true,
    icon: '🧪',
  },
  {
    id: 'thyroid-complete',
    name: 'Complete Thyroid Panel',
    description: 'Full thyroid evaluation including antibodies. For patients with thyroid symptoms or on thyroid medication.',
    price: 149,
    wholesaleCost: 60,
    requiredFor: ['thyroid'],
    tests: [
      'TSH',
      'Free T3',
      'Free T4',
      'Total T3',
      'Total T4',
      'Reverse T3',
      'Thyroid Peroxidase Antibodies (TPO)',
      'Thyroglobulin Antibodies',
    ],
    turnaroundDays: '3-5',
    fastingRequired: false,
    icon: '🦋',
  },
];

/**
 * Get panels required for a treatment category
 */
export function getPanelsForTreatment(treatmentCategory: string): LabPanel[] {
  return LAB_PANELS.filter(panel => 
    panel.requiredFor.includes(treatmentCategory)
  );
}

/**
 * Get a specific panel by ID
 */
export function getPanel(panelId: string): LabPanel | undefined {
  return LAB_PANELS.find(panel => panel.id === panelId);
}

/**
 * Check if a treatment requires labs
 */
export function treatmentRequiresLabs(treatmentCategory: string): boolean {
  return LAB_PANELS.some(panel => panel.requiredFor.includes(treatmentCategory));
}

/**
 * Get all panels (for browsing)
 */
export function getAllPanels(): LabPanel[] {
  return LAB_PANELS;
}

/**
 * Calculate margin for a panel
 */
export function getPanelMargin(panel: LabPanel): number {
  return panel.price - panel.wholesaleCost;
}

/**
 * Treatment categories that require labs before prescribing
 */
export const TREATMENTS_REQUIRING_LABS = [
  'weight-loss',
  'semaglutide', 
  'tirzepatide',
  'hormones',
  'hrt-women',
  'hrt-men',
  'trt',
  'peptides',
  'growth',
];

/**
 * Check if labs are required and not yet completed
 */
export function labsRequired(treatmentCategory: string, hasValidLabs: boolean): boolean {
  if (!TREATMENTS_REQUIRING_LABS.includes(treatmentCategory)) {
    return false;
  }
  return !hasValidLabs;
}
