/**
 * REGEN RX Informed Consent System
 * 
 * Critical for compliance - every patient MUST sign treatment-specific consent
 * before prescriptions can be issued.
 */

export interface InformedConsent {
  treatmentCategory: TreatmentCategory;
  patientName: string;
  patientEmail: string;
  patientDob: string;
  signedAt: string; // ISO timestamp
  ipAddress: string;
  userAgent: string;
  consentVersion: string;
  acknowledgedRisks: string[];
  acknowledgedAlternatives: boolean;
  acknowledgedNoGuarantees: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export type TreatmentCategory = 
  | 'glp1-weight-loss'
  | 'hormone-therapy'
  | 'peptides'
  | 'sexual-wellness'
  | 'vitamin-injectables'
  | 'prescription-skincare'
  | 'hair-restoration';

export const CONSENT_VERSION = '2026-09-04-v1';

/**
 * Treatment-specific consent content
 * Each category has specific risks, alternatives, and requirements
 */
export const TREATMENT_CONSENTS: Record<TreatmentCategory, {
  title: string;
  description: string;
  risks: string[];
  contraindications: string[];
  alternatives: string[];
  specialInstructions: string[];
  requiresLabs: boolean;
  labsRequired?: string[];
  requiresVideoConsult: boolean;
  refillRequirements: string;
}> = {
  'glp1-weight-loss': {
    title: 'GLP-1 Weight Loss Medication Consent',
    description: 'Semaglutide and Tirzepatide are GLP-1 receptor agonists prescribed for weight management. These are compounded medications prepared by a licensed 503A pharmacy.',
    risks: [
      'Nausea, vomiting, diarrhea, constipation (common, usually temporary)',
      'Injection site reactions (redness, swelling, itching)',
      'Hypoglycemia (low blood sugar), especially if taking diabetes medications',
      'Pancreatitis (inflammation of the pancreas) - SEEK IMMEDIATE CARE if severe abdominal pain',
      'Gallbladder problems including gallstones',
      'Kidney problems including kidney failure in patients with kidney disease',
      'Allergic reactions (rare but serious)',
      'Thyroid tumors including cancer - REPORTED IN ANIMAL STUDIES (medullary thyroid carcinoma)',
      'Changes in vision if you have diabetic retinopathy',
      'Depression or thoughts of self-harm (rare)',
    ],
    contraindications: [
      'Personal or family history of medullary thyroid carcinoma (MTC)',
      'Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)',
      'History of pancreatitis',
      'Pregnancy or planning to become pregnant (stop 2 months before conception)',
      'Breastfeeding',
      'Severe gastrointestinal disease',
      'History of severe allergic reaction to GLP-1 medications',
    ],
    alternatives: [
      'Lifestyle modifications (diet and exercise)',
      'Other FDA-approved weight loss medications',
      'Bariatric surgery consultation',
      'No treatment',
    ],
    specialInstructions: [
      'Start at the lowest dose and increase gradually as directed',
      'Inject subcutaneously in abdomen, thigh, or upper arm',
      'Rotate injection sites',
      'Store medication in refrigerator (36-46°F)',
      'Do not use if medication appears cloudy or contains particles',
      'Report persistent vomiting, severe abdominal pain, or signs of dehydration immediately',
    ],
    requiresLabs: true,
    labsRequired: ['Complete Metabolic Panel (CMP)', 'Lipid Panel', 'HbA1c (if diabetic history)'],
    requiresVideoConsult: false,
    refillRequirements: 'Monthly check-in required. Provider will review progress and side effects before each refill.',
  },

  'hormone-therapy': {
    title: 'Hormone Replacement Therapy (HRT/TRT) Consent',
    description: 'Bioidentical hormone therapy to address hormone imbalances. Includes testosterone, estrogen, progesterone, and related compounds.',
    risks: [
      'Fluid retention and bloating',
      'Mood changes, irritability, or depression',
      'Acne and oily skin',
      'Hair loss or unwanted hair growth',
      'Changes in libido',
      'Blood clots (deep vein thrombosis, pulmonary embolism)',
      'Cardiovascular events (heart attack, stroke) - risk increases with age and other factors',
      'Liver problems (rare with injections/topicals)',
      'Polycythemia (elevated red blood cells) - requires monitoring',
      'Testicular atrophy and reduced sperm production (men on TRT)',
      'Breast tenderness or enlargement',
      'Endometrial changes (women) - requires monitoring',
    ],
    contraindications: [
      'History of hormone-sensitive cancers (breast, prostate, uterine)',
      'Active or recent blood clots',
      'Uncontrolled cardiovascular disease',
      'Severe liver disease',
      'Pregnancy or breastfeeding',
      'Unexplained vaginal bleeding',
      'Untreated sleep apnea (for TRT)',
    ],
    alternatives: [
      'Lifestyle modifications (exercise, sleep, stress management)',
      'Non-hormonal symptom management',
      'Referral to endocrinologist',
      'No treatment',
    ],
    specialInstructions: [
      'Follow dosing instructions exactly as prescribed',
      'Keep all follow-up appointments for lab monitoring',
      'Report breast lumps, chest pain, leg swelling, or shortness of breath immediately',
      'Do not share medication with others',
    ],
    requiresLabs: true,
    labsRequired: [
      'Comprehensive Hormone Panel',
      'Complete Blood Count (CBC)',
      'Comprehensive Metabolic Panel (CMP)',
      'PSA (men over 40)',
    ],
    requiresVideoConsult: true,
    refillRequirements: 'Labs required every 3-6 months. Video consult required before starting and annually thereafter.',
  },

  'peptides': {
    title: 'Peptide Therapy Consent',
    description: 'Peptide therapy including BPC-157, TB-500, Sermorelin, and related compounds for recovery, performance, and wellness.',
    risks: [
      'Injection site reactions (redness, swelling, pain)',
      'Nausea, headache, or fatigue',
      'Water retention',
      'Changes in blood sugar',
      'Joint pain or muscle aches',
      'Dizziness or lightheadedness',
      'Sleep disturbances',
      'Unknown long-term effects (limited human research on some peptides)',
    ],
    contraindications: [
      'Active cancer or history of cancer',
      'Pregnancy or breastfeeding',
      'Uncontrolled diabetes',
      'Active infections',
      'Hypersensitivity to specific peptides',
    ],
    alternatives: [
      'Physical therapy for recovery',
      'Other regenerative therapies',
      'Lifestyle modifications',
      'No treatment',
    ],
    specialInstructions: [
      'Reconstitute and store as directed by pharmacy',
      'Use sterile injection technique',
      'Rotate injection sites',
      'Some peptides require refrigeration',
    ],
    requiresLabs: false,
    requiresVideoConsult: false,
    refillRequirements: 'Provider review required every 3 months.',
  },

  'sexual-wellness': {
    title: 'Sexual Wellness Medication Consent',
    description: 'Medications for erectile dysfunction, female sexual dysfunction, and related conditions including Sildenafil, Tadalafil, and PT-141.',
    risks: [
      'Headache, flushing, nasal congestion',
      'Dizziness or lightheadedness',
      'Visual disturbances (blue tint, sensitivity to light)',
      'Hearing changes (rare)',
      'Priapism (erection lasting >4 hours) - SEEK IMMEDIATE CARE',
      'Drop in blood pressure, especially with nitrates - LIFE THREATENING',
      'Heart attack or stroke (rare, in patients with cardiovascular disease)',
      'Nausea (PT-141)',
    ],
    contraindications: [
      'Use of nitrates (nitroglycerin, isosorbide) - ABSOLUTE CONTRAINDICATION',
      'Use of riociguat or other guanylate cyclase stimulators',
      'Severe cardiovascular disease',
      'Recent heart attack or stroke',
      'Severe liver or kidney disease',
      'Retinitis pigmentosa',
      'History of priapism',
    ],
    alternatives: [
      'Lifestyle modifications (exercise, weight loss, smoking cessation)',
      'Counseling/therapy',
      'Other treatment modalities',
      'No treatment',
    ],
    specialInstructions: [
      'Do NOT take with nitrate medications - can cause fatal drop in blood pressure',
      'Take as directed, not more frequently than prescribed',
      'Seek immediate care for erection lasting more than 4 hours',
      'Avoid grapefruit juice',
    ],
    requiresLabs: false,
    requiresVideoConsult: false,
    refillRequirements: 'Provider review required every 6 months.',
  },

  'vitamin-injectables': {
    title: 'Vitamin Injectable Therapy Consent',
    description: 'Injectable vitamins including B12, Biotin, Glutathione, NAD+, and related compounds for wellness and energy.',
    risks: [
      'Injection site pain, redness, or swelling',
      'Mild nausea or stomach upset',
      'Headache or dizziness',
      'Allergic reactions (rare)',
      'Flushing (NAD+)',
    ],
    contraindications: [
      'Known allergy to specific vitamins or compounds',
      'Certain blood disorders (for some formulations)',
      'Pregnancy (some formulations) - consult provider',
    ],
    alternatives: [
      'Oral vitamin supplements',
      'Dietary modifications',
      'IV vitamin therapy in-clinic',
      'No treatment',
    ],
    specialInstructions: [
      'Follow injection technique instructions',
      'Rotate injection sites',
      'Store as directed',
    ],
    requiresLabs: false,
    requiresVideoConsult: false,
    refillRequirements: 'Provider review required every 6 months.',
  },

  'prescription-skincare': {
    title: 'Prescription Skincare Consent',
    description: 'Prescription topical treatments including Tretinoin, Hydroquinone, and compound formulations for skin concerns.',
    risks: [
      'Skin dryness, peeling, and irritation (especially initially)',
      'Increased sun sensitivity - MUST use sunscreen',
      'Redness and burning',
      'Skin discoloration (with hydroquinone)',
      'Allergic reaction',
      'Temporary worsening of acne (purging period)',
    ],
    contraindications: [
      'Pregnancy or planning pregnancy (tretinoin)',
      'Breastfeeding (some formulations)',
      'Eczema or severely sensitive skin',
      'Active skin infections',
    ],
    alternatives: [
      'Over-the-counter retinoids',
      'In-clinic treatments (peels, lasers)',
      'Other topical treatments',
      'No treatment',
    ],
    specialInstructions: [
      'Apply as directed, usually at night',
      'Use sunscreen SPF 30+ daily - medication increases sun damage risk',
      'Start slowly and increase frequency as tolerated',
      'Avoid waxing treated areas',
    ],
    requiresLabs: false,
    requiresVideoConsult: false,
    refillRequirements: 'Provider review required annually.',
  },

  'hair-restoration': {
    title: 'Hair Restoration Medication Consent',
    description: 'Prescription treatments for hair loss including Finasteride, Minoxidil, and compound formulations.',
    risks: [
      'Sexual side effects (decreased libido, erectile dysfunction) - usually reversible',
      'Depression or mood changes',
      'Breast tenderness or enlargement (rare)',
      'Scalp irritation (topical minoxidil)',
      'Unwanted facial hair growth (minoxidil)',
      'Dizziness or lightheadedness (oral minoxidil)',
      'Initial increased shedding (temporary)',
    ],
    contraindications: [
      'Pregnancy or planning pregnancy - finasteride causes birth defects',
      'Women of childbearing potential (finasteride) - must not handle crushed tablets',
      'Breastfeeding',
      'Hypersensitivity to ingredients',
      'Cardiovascular disease (oral minoxidil)',
    ],
    alternatives: [
      'Topical-only treatments',
      'PRP therapy',
      'Hair transplant consultation',
      'Cosmetic solutions (concealer, hairpieces)',
      'No treatment',
    ],
    specialInstructions: [
      'Pregnant women should not handle finasteride tablets',
      'Results take 3-6 months to appear',
      'Continuous use required to maintain results',
      'Report mood changes or sexual side effects',
    ],
    requiresLabs: false,
    requiresVideoConsult: false,
    refillRequirements: 'Provider review required every 6 months.',
  },
};

/**
 * Map program IDs to treatment categories for consent lookup
 */
export function getTreatmentCategory(programId: string): TreatmentCategory {
  const mapping: Record<string, TreatmentCategory> = {
    // Weight loss
    'semaglutide': 'glp1-weight-loss',
    'tirzepatide': 'glp1-weight-loss',
    'sema-starter': 'glp1-weight-loss',
    'sema-standard': 'glp1-weight-loss',
    'tirz-starter': 'glp1-weight-loss',
    'tirz-standard': 'glp1-weight-loss',
    
    // Hormones
    'hrt-women': 'hormone-therapy',
    'hrt-men': 'hormone-therapy',
    'trt': 'hormone-therapy',
    
    // Peptides
    'bpc-tb': 'peptides',
    'growth': 'peptides',
    'nad': 'peptides',
    
    // Sexual wellness
    'ed': 'sexual-wellness',
    'libido-women': 'sexual-wellness',
    
    // Vitamins
    'b12': 'vitamin-injectables',
    'biotin': 'vitamin-injectables',
    'glutathione': 'vitamin-injectables',
    'nad-injection': 'vitamin-injectables',
    
    // Skincare
    'tretinoin': 'prescription-skincare',
    'tretinoin-ha': 'prescription-skincare',
    'hydroquinone': 'prescription-skincare',
    'ghk-cu': 'prescription-skincare',
    'cleartone': 'prescription-skincare',
    'clarity': 'prescription-skincare',
    'refine-pm': 'prescription-skincare',
    'lumineye': 'prescription-skincare',
    
    // Hair
    'fin-minox-foam': 'hair-restoration',
    'fin-minox-solution': 'hair-restoration',
    'advanced-hair': 'hair-restoration',
    'oral-minox': 'hair-restoration',

    // Goal slugs from /start
    'weight-loss': 'glp1-weight-loss',
    'glp1': 'glp1-weight-loss',
    'hormones': 'hormone-therapy',
    'hrt': 'hormone-therapy',
    'peptides': 'peptides',
    'sexual-health': 'sexual-wellness',
    'vitamins': 'vitamin-injectables',
    'skincare': 'prescription-skincare',
    'hair': 'hair-restoration',
  };
  
  return mapping[programId] || 'peptides'; // Default to peptides as safest catch-all
}

/**
 * Generate consent text for storage/PDF
 */
export function generateConsentDocument(consent: InformedConsent): string {
  const treatmentInfo = TREATMENT_CONSENTS[consent.treatmentCategory];
  
  return `
INFORMED CONSENT FOR TELEHEALTH TREATMENT

REGEN RX - A Telehealth Service of Hello Gorgeous PC
${treatmentInfo.title}

PATIENT INFORMATION:
Name: ${consent.patientName}
Email: ${consent.patientEmail}
Date of Birth: ${consent.patientDob}

DATE OF CONSENT: ${new Date(consent.signedAt).toLocaleString('en-US', { 
    dateStyle: 'full', 
    timeStyle: 'short' 
  })}
CONSENT VERSION: ${consent.consentVersion}

---

TREATMENT DESCRIPTION:
${treatmentInfo.description}

---

RISKS AND POTENTIAL SIDE EFFECTS:
${treatmentInfo.risks.map((r, i) => `${i + 1}. ${r}`).join('\n')}

---

CONTRAINDICATIONS (DO NOT USE IF):
${treatmentInfo.contraindications.map((c, i) => `${i + 1}. ${c}`).join('\n')}

---

ALTERNATIVES TO THIS TREATMENT:
${treatmentInfo.alternatives.map((a, i) => `${i + 1}. ${a}`).join('\n')}

---

SPECIAL INSTRUCTIONS:
${treatmentInfo.specialInstructions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

${treatmentInfo.requiresLabs ? `
---

REQUIRED LABORATORY TESTS:
${(treatmentInfo.labsRequired || []).map((l, i) => `${i + 1}. ${l}`).join('\n')}
` : ''}

---

REFILL REQUIREMENTS:
${treatmentInfo.refillRequirements}

---

EMERGENCY INFORMATION:
- If you experience a MEDICAL EMERGENCY, call 911 immediately
- For urgent concerns about your medication, call REGEN RX: (630) 636-6193
- Do NOT rely on telehealth for emergency medical situations

---

PATIENT ACKNOWLEDGMENT:

By signing below, I acknowledge and agree that:

1. I have read and understand the information provided above
2. I have had the opportunity to ask questions about my treatment
3. I understand the risks, benefits, and alternatives to this treatment
4. I understand that compounded medications are NOT FDA-approved
5. I understand that results are not guaranteed and vary by individual
6. I agree to follow the treatment instructions provided by my provider
7. I agree to report any adverse reactions or concerns to my provider
8. I confirm that I am located in the State of Illinois
9. I confirm that I have provided accurate and complete health information
10. I consent to receive telehealth services for this treatment

${consent.acknowledgedNoGuarantees ? '✓ I understand there are NO GUARANTEES of treatment success\n' : ''}
${consent.acknowledgedAlternatives ? '✓ I have been informed of alternatives to this treatment\n' : ''}

---

ELECTRONIC SIGNATURE:
Patient Name: ${consent.patientName}
Signed: ${new Date(consent.signedAt).toISOString()}
IP Address: ${consent.ipAddress}
User Agent: ${consent.userAgent}

${consent.emergencyContactName ? `
Emergency Contact: ${consent.emergencyContactName}
Emergency Phone: ${consent.emergencyContactPhone}
` : ''}

---

This document constitutes a legally binding informed consent.
A copy has been provided to the patient via email.

REGEN RX | Hello Gorgeous PC
Oswego, Illinois | (630) 636-6193 | tryregenrx.com
  `.trim();
}
