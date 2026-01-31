// ============================================================
// HELLO GORGEOUS OS - SERVICES SEED DATA
// Imported from Fresha export 2026-01-30
// ============================================================

import type { ServiceCategory, Service } from '../types';

// ============================================================
// SERVICE CATEGORIES
// ============================================================

export const SERVICE_CATEGORIES: Omit<ServiceCategory, 'id' | 'createdAt'>[] = [
  {
    name: 'Bioidentical Hormone Therapy (BHRT)',
    slug: 'bhrt',
    description: 'BioTE hormone optimization for energy, mood, and vitality',
    icon: '⚖️',
    displayOrder: 1,
    isActive: true,
  },
  {
    name: 'Weight Loss Program',
    slug: 'weight-loss',
    description: 'GLP-1 medications and medical weight management',
    icon: '⚡',
    displayOrder: 2,
    isActive: true,
  },
  {
    name: 'Botox & Neuromodulators',
    slug: 'botox',
    description: 'Botox, Dysport, Jeuveau for wrinkle relaxation',
    icon: '💉',
    displayOrder: 3,
    isActive: true,
  },
  {
    name: 'Dermal Fillers',
    slug: 'fillers',
    description: 'Hyaluronic acid fillers for volume and contouring',
    icon: '💋',
    displayOrder: 4,
    isActive: true,
  },
  {
    name: 'Skin Regeneration (AnteAGE)',
    slug: 'anteage',
    description: 'Stem cell growth factors, exosomes, and microneedling',
    icon: '🧬',
    displayOrder: 5,
    isActive: true,
  },
  {
    name: 'Facials & Skin Spa',
    slug: 'facials',
    description: 'Hydrafacials, dermaplaning, chemical peels, and more',
    icon: '✨',
    displayOrder: 6,
    isActive: true,
  },
  {
    name: 'PRP & PRF Treatments',
    slug: 'prp',
    description: 'Platelet-rich plasma for skin, hair, and joint rejuvenation',
    icon: '🩸',
    displayOrder: 7,
    isActive: true,
  },
  {
    name: 'IV Therapy & Vitamin Injections',
    slug: 'iv-therapy',
    description: 'IV drips and vitamin shots for wellness and recovery',
    icon: '💧',
    displayOrder: 8,
    isActive: true,
  },
  {
    name: 'Trigger Point Injections',
    slug: 'trigger-point',
    description: 'Pain relief and muscle tension treatment',
    icon: '🎯',
    displayOrder: 9,
    isActive: true,
  },
  {
    name: 'Lash Services',
    slug: 'lash',
    description: 'Eyelash extensions, lifts, and fills',
    icon: '👁️',
    displayOrder: 10,
    isActive: true,
  },
  {
    name: 'Brow Services',
    slug: 'brow',
    description: 'Brow shaping, lamination, and henna',
    icon: '🤨',
    displayOrder: 11,
    isActive: true,
  },
  {
    name: 'Laser Hair Removal',
    slug: 'laser-hair',
    description: 'Permanent hair reduction for all skin types',
    icon: '⚡',
    displayOrder: 12,
    isActive: true,
  },
  {
    name: 'Medical Consultations',
    slug: 'consultations',
    description: 'Medical evaluations and treatment planning',
    icon: '🩺',
    displayOrder: 13,
    isActive: true,
  },
];

// ============================================================
// SERVICES
// ============================================================

type ServiceSeed = Omit<Service, 'id' | 'createdAt' | 'updatedAt'> & {
  categorySlug: string;
  freshaServiceId?: string;
};

export const SERVICES: ServiceSeed[] = [
  // ============================================================
  // BHRT - HORMONE THERAPY
  // ============================================================
  {
    categorySlug: 'bhrt',
    name: 'BioTE Pellet Therapy - Women (Initial)',
    slug: 'pellet-therapy-women',
    description: `Feeling tired, foggy, moody, or like your body isn't responding the way it used to? You're not alone — and you don't have to guess.

At Hello Gorgeous Med Spa, our BioTE lab panel gives us a clear starting point so we can personalize your hormone optimization plan based on your symptoms + your results.

✨ Many patients report improvements in energy, sleep, mood/clarity, and libido.

Initial Package includes: consult + labs + first pellet insertion.`,
    shortDescription: 'Complete hormone optimization package with labs and first pellet insertion',
    priceCents: 65000,
    priceDisplay: '$650',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 15,
    depositRequired: true,
    depositAmountCents: 15000,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false, // Labs included in service
    requiresTelehealthClearance: false,
    minimumAge: 21,
    contraindications: ['pregnancy', 'breast cancer', 'prostate cancer'],
    maxAdvanceBookingDays: 90,
    minAdvanceBookingHours: 48,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 1,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: 'harmony',
    freshaServiceId: '22598044',
  },
  {
    categorySlug: 'bhrt',
    name: 'BioTE Pellet Therapy - Men (Initial)',
    slug: 'pellet-therapy-men',
    description: `Feeling tired, foggy, moody, or like your body isn't responding the way it used to? You're not alone — and you don't have to guess.

At Hello Gorgeous Med Spa, our BioTE lab panel gives us a clear starting point so we can personalize your hormone optimization plan based on your symptoms + your results.

✨ Many patients report improvements in energy, sleep, mood/clarity, and libido.

Initial Package includes: consult + labs + first pellet insertion.`,
    shortDescription: 'Complete hormone optimization package with labs and first pellet insertion',
    priceCents: 90000,
    priceDisplay: '$900',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 15,
    depositRequired: true,
    depositAmountCents: 20000,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 21,
    contraindications: ['prostate cancer'],
    maxAdvanceBookingDays: 90,
    minAdvanceBookingHours: 48,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 2,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: 'harmony',
    freshaServiceId: '22598044',
  },
  {
    categorySlug: 'bhrt',
    name: '17 Hormone Panel - Lab Work',
    slug: 'hormone-panel-labs',
    description: `Think of this hormone panel as your roadmap.

We're not guessing—we're getting a clear snapshot of what your hormones are doing right now and how your body is functioning overall. That way, if we move forward with BioTE, we can personalize your plan for the best results and the safest experience.

What we're checking:
• Key hormones (testosterone + estradiol)
• FSH (menopause transition indicator)
• Thyroid markers (TSH, T3, T4)
• CBC (overall health markers)

Results within 36 hours.`,
    shortDescription: 'Comprehensive hormone panel with 36-hour results',
    priceCents: 24900,
    priceDisplay: '$249',
    priceType: 'fixed',
    durationMinutes: 30,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: [],
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 3,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: 'harmony',
    freshaServiceId: '19675764',
  },

  // ============================================================
  // WEIGHT LOSS
  // ============================================================
  {
    categorySlug: 'weight-loss',
    name: 'Retatrutide GLP-1 (Triple Agonist)',
    slug: 'retatrutide-glp1',
    description: `Experience the latest in weight management with this innovative triple action hormone receptor agonist GLP-1 Peptide.

The latest and greatest and most potent weight loss drug on the market is now available at Hello Gorgeous. Ryan Kent is happy to consult free of charge and discuss your options.`,
    shortDescription: 'The most potent GLP-1 triple action weight loss medication',
    priceCents: 55000,
    priceDisplay: 'From $550',
    priceType: 'starting_at',
    durationMinutes: 20,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: true,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['thyroid cancer', 'pancreatitis', 'MEN2'],
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 1,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: 'ryan',
    freshaServiceId: '22135540',
  },
  {
    categorySlug: 'weight-loss',
    name: 'Semaglutide (Wegovy/Ozempic)',
    slug: 'semaglutide',
    description: `Weekly GLP-1 injection for sustainable weight loss.

Dosage Titration:
• Week 1-4: 0.25 mg once weekly
• Week 5-8: 0.5 mg once weekly
• Week 9-12: 1.0 mg once weekly
• Week 13+: Increase up to 2.4 mg weekly as tolerated`,
    shortDescription: 'FDA-approved weekly GLP-1 injection for weight loss',
    priceCents: 40000,
    priceDisplay: 'From $400',
    priceType: 'starting_at',
    durationMinutes: 15,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: true,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['thyroid cancer', 'pancreatitis', 'MEN2'],
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 2,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: 'ryan',
    freshaServiceId: '19613503',
  },
  {
    categorySlug: 'weight-loss',
    name: 'Semaglutide 90-Day Program',
    slug: 'semaglutide-90-day',
    description: `Save $200 with our 90-day Semaglutide program.

Includes medication, weekly check-ins, and support throughout your weight loss journey.`,
    shortDescription: '90-day weight loss program - Save $200',
    priceCents: 99900,
    priceDisplay: '$999',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: true,
    depositAmountCents: 25000,
    depositType: 'fixed',
    requiresConsult: true,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['thyroid cancer', 'pancreatitis', 'MEN2'],
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 3,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: 'ryan',
    freshaServiceId: '19613503',
  },
  {
    categorySlug: 'weight-loss',
    name: 'Tirzepatide (Zepbound/Mounjaro)',
    slug: 'tirzepatide',
    description: `During your consultation with Ryan Kent, APRN we will provide:

Medical Evaluation
• Review medical history
• Check baseline blood work if needed

Medication Selection & Dosage Titration

Administration Guidelines
• Inject subcutaneously (abdomen, thigh, or upper arm)
• Rotate injection sites to prevent irritation
• Take consistently on the same day each week`,
    shortDescription: 'Dual GLP-1/GIP agonist for powerful weight loss',
    priceCents: 45000,
    priceDisplay: 'From $450',
    priceType: 'starting_at',
    durationMinutes: 15,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: true,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['thyroid cancer', 'pancreatitis', 'MEN2'],
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 4,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: 'ryan',
    freshaServiceId: '19613488',
  },
  {
    categorySlug: 'weight-loss',
    name: 'Tirzepatide 90-Day Program',
    slug: 'tirzepatide-90-day',
    description: `Complete 90-day Tirzepatide weight loss program.

Includes medication, medical evaluations, and ongoing support.`,
    shortDescription: '90-day Tirzepatide program',
    priceCents: 115000,
    priceDisplay: 'From $1,150',
    priceType: 'starting_at',
    durationMinutes: 20,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: true,
    depositAmountCents: 30000,
    depositType: 'fixed',
    requiresConsult: true,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['thyroid cancer', 'pancreatitis', 'MEN2'],
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 5,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: 'ryan',
    freshaServiceId: '19613488',
  },
  {
    categorySlug: 'weight-loss',
    name: 'Medical Weight Management Program',
    slug: 'medical-weight-management',
    description: `🏋️‍♀️ Medical Weight Management Program
Powered by RX Pharmacy Compounds

We offer:
✅ Naltrexone (oral capsules, nightly)
✅ Sermorelin (subcutaneous injections)
✅ Lipo-Trim SL (oral spray, daily)

Benefits:
• Boost metabolism & fat-burning
• Curb cravings & suppress appetite
• Improve energy & mental focus
• Support better sleep & hormone function`,
    shortDescription: 'Non-GLP-1 weight loss program with multiple therapies',
    priceCents: 29500,
    priceDisplay: '$295',
    priceType: 'fixed',
    durationMinutes: 30,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: true,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: [],
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 6,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: 'ryan',
    freshaServiceId: '20005590',
  },

  // ============================================================
  // BOTOX & NEUROMODULATORS
  // ============================================================
  {
    categorySlug: 'botox',
    name: 'Botox/Jeuveau/Dysport',
    slug: 'botox-per-unit',
    description: `💉 Botox, Jeuveau, and Dysport — What They Are

All three are botulinum toxin type A injectables that temporarily relax targeted muscles to smooth dynamic wrinkles (like frown lines, forehead creases, and crow's feet). They're FDA-approved, safe, and work in very similar ways.

🔎 Botox (onabotulinumtoxinA)
The OG — first FDA-approved, most studied brand.
Onset: ~5–7 days to see results.
Duration: 3–4 months (sometimes up to 6).

🔎 Dysport (abobotulinumtoxinA)
Onset: Faster — often 2–3 days.
Spread: Tends to diffuse more → good for large areas like the forehead.
Duration: ~3–4 months.`,
    shortDescription: 'Wrinkle relaxing injections - $12 per unit',
    priceCents: 1200,
    priceDisplay: '$12/unit',
    priceType: 'per_unit',
    durationMinutes: 30,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['pregnancy', 'breastfeeding', 'neuromuscular disease'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 1,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: 'beau-tox',
    freshaServiceId: '20075569',
  },
  {
    categorySlug: 'botox',
    name: 'Botox Special - New Clients Only',
    slug: 'botox-new-client-special',
    description: `$10/unit for NEW clients only!

Ryan Kent, FPA, APRN, FNP-C is accepting patients. We will lock you in at this rate for 1 year if scheduled now.`,
    shortDescription: 'New client special - $10 per unit',
    priceCents: 1000,
    priceDisplay: '$10/unit',
    priceType: 'per_unit',
    durationMinutes: 30,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['pregnancy', 'breastfeeding', 'neuromuscular disease'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 2,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: 'beau-tox',
    freshaServiceId: '19769499',
  },
  {
    categorySlug: 'botox',
    name: 'Lip Flip Special',
    slug: 'lip-flip',
    description: `💋 Pout Perfection for Less!

Introducing the Lip Flip – a quick, subtle way to enhance your smile using Botox!

Just a few units give your upper lip a fuller, lifted appearance… no filler needed!

Get that effortlessly plump look in minutes.`,
    shortDescription: 'Subtle lip enhancement using Botox - no filler needed',
    priceCents: 9900,
    priceDisplay: '$99',
    priceType: 'fixed',
    durationMinutes: 30,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['pregnancy', 'breastfeeding'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 3,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: 'beau-tox',
    freshaServiceId: '19819621',
  },

  // ============================================================
  // DERMAL FILLERS
  // ============================================================
  {
    categorySlug: 'fillers',
    name: 'Dermal Filler - Per Syringe',
    slug: 'filler-per-syringe',
    description: `Revanesse® Versa™+ is an FDA approved hyaluronic acid dermal filler for moderate to severe facial wrinkles and folds.

Revanesse® Lips™+ is FDA approved for lip augmentation in patients 22 years of age or older.

Revanesse utilizes only high-molecular weight HA which has been shown to be anti-inflammatory with one of the lowest swell factors of any FDA approved dermal filler.`,
    shortDescription: 'Premium hyaluronic acid filler - per syringe',
    priceCents: 59900,
    priceDisplay: '$599',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 15,
    depositRequired: true,
    depositAmountCents: 10000,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 22,
    contraindications: ['pregnancy', 'breastfeeding', 'autoimmune disease'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 1,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: 'filla-grace',
    freshaServiceId: '20173670',
  },
  {
    categorySlug: 'fillers',
    name: 'Dermal Filler - 2 Syringe Special',
    slug: 'filler-2-syringe-special',
    description: `Special promotion: 2 syringes of premium Revanesse filler.

Save when you purchase 2 syringes together!`,
    shortDescription: '2 syringes special - Save $300',
    priceCents: 89800,
    priceDisplay: '$898',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 15,
    depositRequired: true,
    depositAmountCents: 15000,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 22,
    contraindications: ['pregnancy', 'breastfeeding', 'autoimmune disease'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 2,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: 'filla-grace',
    freshaServiceId: '20173799',
  },
  {
    categorySlug: 'fillers',
    name: 'Hyaluronidase (Filler Dissolver)',
    slug: 'hyaluronidase-dissolver',
    description: `Hylanex lip/filler dissolver for correcting or removing unwanted filler.`,
    shortDescription: 'Dissolve unwanted filler',
    priceCents: 25000,
    priceDisplay: 'From $250',
    priceType: 'starting_at',
    durationMinutes: 30,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['allergy to hyaluronidase'],
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 3,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: 'filla-grace',
    freshaServiceId: '21304175',
  },

  // ============================================================
  // ANTEAGE - SKIN REGENERATION
  // ============================================================
  {
    categorySlug: 'anteage',
    name: 'AnteAGE Microneedling with Exosomes (Best Results)',
    slug: 'anteage-microneedling-exosomes',
    description: `✨ THE FUTURE OF SKIN REGENERATION IS HERE

Microneedling + AnteAGE® Exosomes

🧬 What are Exosomes?
Tiny powerhouse messengers derived from stem cells, clinically designed to boost healing, improve cell communication, and supercharge collagen production.

💉 When combined with Microneedling, you get:
🔹 Dramatically reduced redness & downtime
🔹 Firmer, smoother, more radiant skin
🔹 Faster recovery, visible glow in days
🔹 Enhanced skin texture & tone`,
    shortDescription: 'Premium microneedling with exosomes - best results',
    priceCents: 49900,
    priceDisplay: '$499',
    priceType: 'fixed',
    durationMinutes: 45,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 15,
    depositRequired: true,
    depositAmountCents: 10000,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['active acne', 'eczema', 'psoriasis', 'rosacea flare'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 1,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: 'peppi',
    freshaServiceId: '20288732',
  },
  {
    categorySlug: 'anteage',
    name: 'AnteAGE Microneedling with Stem Cell Growth Factors (Better Results)',
    slug: 'anteage-microneedling-growth-factors',
    description: `"This is based on regenerative medicine. AnteAGE uses growth factors from stem cells to 'coach' your skin cells to act younger, repair faster, and produce more collagen."

"It's like giving your skin a supercharged healing signal."

"You'll see better results with less inflammation."`,
    shortDescription: 'Microneedling with stem cell growth factors',
    priceCents: 39900,
    priceDisplay: '$399',
    priceType: 'fixed',
    durationMinutes: 45,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 15,
    depositRequired: true,
    depositAmountCents: 10000,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['active acne', 'eczema', 'psoriasis', 'rosacea flare'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 2,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: 'peppi',
    freshaServiceId: '20288418',
  },
  {
    categorySlug: 'anteage',
    name: 'AnteAGE Microneedling with Hyaluronic Acid (Good Results)',
    slug: 'anteage-microneedling-ha',
    description: `"Boost Your Microneedling with AnteAGE + HA"

"Stem cell growth factors speed up healing, HA hydrates deep. It's science-backed beauty."

"This combo boosts collagen, fades fine lines, and leaves you GLOWING ✨"`,
    shortDescription: 'Microneedling with hyaluronic acid',
    priceCents: 24900,
    priceDisplay: '$249',
    priceType: 'fixed',
    durationMinutes: 45,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 15,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['active acne', 'eczema', 'psoriasis', 'rosacea flare'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 3,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: 'peppi',
    freshaServiceId: '20288406',
  },
  {
    categorySlug: 'anteage',
    name: 'AnteAGE Under-Eye Mesotherapy',
    slug: 'anteage-under-eye',
    description: `🌸 AnteAGE® Under-Eye Mesotherapy
Targeted Rejuvenation Using Stem Cell Growth Factors

A minimally invasive under-eye treatment using AnteAGE MD Growth Factor Solution, designed specifically for delicate periorbital skin.

Reduces:
• Dark circles
• Fine lines & wrinkles
• Puffiness
• Skin laxity & crepey texture`,
    shortDescription: 'Under-eye rejuvenation with growth factors',
    priceCents: 19900,
    priceDisplay: '$199',
    priceType: 'fixed',
    durationMinutes: 30,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: [],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 4,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: 'peppi',
    freshaServiceId: '20398054',
  },
  {
    categorySlug: 'anteage',
    name: 'Hair Restoration with Exosome Injections',
    slug: 'hair-restoration-exosomes',
    description: `AnteAGE MDX Hair Exosomes

Our groundbreaking AnteAGE MDX® Exosome Hair Solution takes hair health to the next level.

Our unique approach results in exosomes specifically targeted to upregulate WNT signaling – a crucial signaling pathway involved with hair follicle development.

Combined with caffeine for follicle stimulation and azelaic acid to counteract DHT.

Treatment includes at-home Aftercare Kit.`,
    shortDescription: 'Advanced hair restoration with exosomes + aftercare kit',
    priceCents: 49900,
    priceDisplay: '$499',
    priceType: 'fixed',
    durationMinutes: 45,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: true,
    depositAmountCents: 10000,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: [],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 5,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: 'peppi',
    freshaServiceId: '20288748',
  },

  // ============================================================
  // FACIALS & SKIN SPA
  // ============================================================
  {
    categorySlug: 'facials',
    name: 'Glass Glow Facial (Signature)',
    slug: 'glass-glow-facial',
    description: `✨ Glow + Smooth: Dermaplaning Facial with BabyTox Microchanneling & Hydra

This advanced facial combines two powerhouse treatments.
Combines Hydration + Smoothing + BabyTox magic.

"Baby Botox" is a cosmetic procedure using a smaller dose of botulinum toxin injected into the skin to achieve a smoother appearance with subtle, natural-looking results.

Benefits:
• Smaller Dose than traditional Botox
• Superficial Injections targeting skin surface
• Natural-looking results without "frozen" look`,
    shortDescription: 'Our signature facial - Hydra + Dermaplaning + BabyTox',
    priceCents: 34900,
    priceDisplay: '$349',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: true,
    depositAmountCents: 7500,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['pregnancy', 'breastfeeding'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 1,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: 'beau-tox',
    freshaServiceId: '19876062',
  },
  {
    categorySlug: 'facials',
    name: 'IPL Photofacial',
    slug: 'ipl-photofacial',
    description: `An IPL Photofacial is a non-invasive skin treatment using Intense Pulsed Light technology to improve the color, texture, and clarity of the skin.

What IPL Treats:
• Brown spots (sun damage, freckles, age spots)
• Redness (rosacea, broken capillaries)
• Uneven skin tone
• Fine lines and large pores
• Acne-related redness

How It Works:
High-intensity pulses of light penetrate the skin and are absorbed by pigment and blood vessels. The body naturally removes treated areas over 7–14 days.

No downtime!`,
    shortDescription: 'Light therapy for sun damage, redness & uneven tone',
    priceCents: 16900,
    priceDisplay: '$169',
    priceType: 'fixed',
    durationMinutes: 30,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['pregnancy', 'recent sun exposure', 'taking photosensitizing medications'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 2,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '12690608',
  },
  {
    categorySlug: 'facials',
    name: 'Dermaplaning Facial',
    slug: 'dermaplaning-facial',
    description: `Our most popular facial!

Dermaplaning removes dead skin cells and peach fuzz using a sterile surgical blade, revealing smooth, glowing skin.

Perfect for all skin types.`,
    shortDescription: 'Our most popular facial - smooth, glowing results',
    priceCents: 7500,
    priceDisplay: '$75',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: false,
    requiresConsent: false,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: null,
    contraindications: ['active acne'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 3,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '15425400',
  },
  {
    categorySlug: 'facials',
    name: 'Glow2Facial (GENEO)',
    slug: 'glow2facial-geneo',
    description: `The Geneo Glow2Facial is an advanced, non-invasive facial treatment combining three technologies:

1. Exfoliation - Removes dead skin cells
2. Oxygenation - Stimulates oxygen delivery via the "Bohr effect"
3. Infusion - Delivers targeted serums (hyaluronic acid, antioxidants, vitamins)

No downtime, instant glow!`,
    shortDescription: '3-in-1 facial - exfoliate, oxygenate, infuse',
    priceCents: 9900,
    priceDisplay: '$99',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: false,
    requiresConsent: false,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: null,
    contraindications: [],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 4,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '16859488',
  },
  {
    categorySlug: 'facials',
    name: 'Chemical Peel Facial',
    slug: 'chemical-peel',
    description: `Dermalogica Pro Power Peels — customizable, layered treatments.

Benefits:
• Improve skin texture and tone
• Brighten dull skin
• Reduce fine lines
• Fade hyperpigmentation
• Clear breakouts

Formulas include:
• Lactic Acid (brightens and hydrates)
• Salicylic Acid (clears oily skin)
• Glycolic Acid (resurfaces fine lines)
• Mandelic Acid (gentle for sensitive skin)

Light tingling sensation. We also offer Skin Script RX and VI Peel.`,
    shortDescription: 'Customizable professional peel',
    priceCents: 8000,
    priceDisplay: '$80',
    priceType: 'fixed',
    durationMinutes: 45,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: null,
    contraindications: ['active acne', 'eczema', 'recent sun exposure'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 5,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '17181397',
  },
  {
    categorySlug: 'facials',
    name: 'Hydra Peel Facial',
    slug: 'hydra-peel-facial',
    description: `Hydra Peel combines cleansing, exfoliation, extraction, hydration and antioxidant protection simultaneously.

Targets:
• Fine lines and wrinkles
• Congested and enlarged pores
• Oily or acne-prone skin
• Hyperpigmentation and brown spots

Effects:
• Rejuvenates sun damaged skin
• Extracts blackheads and whiteheads
• Reduces acne and superficial scars

No discomfort or downtime.`,
    shortDescription: 'Deep hydration facial with no downtime',
    priceCents: 7500,
    priceDisplay: '$75',
    priceType: 'fixed',
    durationMinutes: 45,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: false,
    requiresConsent: false,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: null,
    contraindications: [],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 6,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '5574183',
  },
  {
    categorySlug: 'facials',
    name: '2-in-1 Hydra Pen & Hydrafacial',
    slug: 'hydra-pen-hydrafacial',
    description: `Microneedling and HydraFacial combined!

HydraFacial treats the skin from the outside in, while microneedling treats the skin from the inside out.

Benefits:
• Acne scarring improvement
• Enlarged pores reduction
• Fine lines smoothing
• Glowing, no-downtime results`,
    shortDescription: 'Microneedling + Hydrafacial combo',
    priceCents: 16900,
    priceDisplay: '$169',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: null,
    contraindications: ['active acne'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 7,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '12702263',
  },

  // ============================================================
  // IV THERAPY & VITAMINS
  // ============================================================
  {
    categorySlug: 'iv-therapy',
    name: 'Vitamin Injection',
    slug: 'vitamin-injection',
    description: `Choose from our vitamin injection menu:

• BCAA - Promotes muscle repair
• L-Carnitine - Converts fat to energy
• Glutathione - Powerful antioxidant
• Magnesium - Eases cramps
• NAD+ - Cellular energy
• CoQ10 - Tissue repair
• Taurine - Electrolyte balance
• Vitamin B12/B-Complex - Energy boost
• Vitamin C - Collagen production`,
    shortDescription: 'Quick vitamin boost - $25',
    priceCents: 2500,
    priceDisplay: '$25',
    priceType: 'fixed',
    durationMinutes: 10,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: false,
    requiresConsent: false,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: null,
    contraindications: [],
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 2,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 1,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '20012913',
  },
  {
    categorySlug: 'iv-therapy',
    name: 'Myers\' Cocktail IV',
    slug: 'myers-cocktail-iv',
    description: `The Myers' Cocktail, named after Dr. John Myers, includes Magnesium, Calcium, B Complex, and additional B6, B5, and B12.

Known for effectiveness against:
• Fatigue
• Stress
• Anxiety`,
    shortDescription: 'Classic IV for energy, stress & anxiety',
    priceCents: 19900,
    priceDisplay: '$199',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: [],
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 2,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '19734077',
  },
  {
    categorySlug: 'iv-therapy',
    name: 'Reboot (Hangover) IV',
    slug: 'reboot-hangover-iv',
    description: `Replenish your body and combat hangover-related symptoms:
• Dehydration
• Headache
• Nausea

Premium-quality compounds designed to replenish fluids for optimal wellness.`,
    shortDescription: 'Hangover recovery IV',
    priceCents: 14900,
    priceDisplay: '$149',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 21,
    contraindications: [],
    maxAdvanceBookingDays: 7,
    minAdvanceBookingHours: 2,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 3,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '19734101',
  },
  {
    categorySlug: 'iv-therapy',
    name: 'Beauty IV',
    slug: 'beauty-iv',
    description: `Designed to bring out radiance and natural glow.

Benefits:
• Fortifies hair, skin and nails
• Reduces wrinkles
• Quenches tired skin`,
    shortDescription: 'IV for hair, skin & nail health',
    priceCents: 18900,
    priceDisplay: '$189',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: [],
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 4,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '19734094',
  },
  {
    categorySlug: 'iv-therapy',
    name: 'B-Lean IV',
    slug: 'b-lean-iv',
    description: `Designed to help burn fat and boost metabolism.

Benefits:
• Helps convert fat into energy
• Enhances athletic performance
• Improves overall mood
• Boosts your metabolism`,
    shortDescription: 'Metabolism boosting IV',
    priceCents: 14900,
    priceDisplay: '$149',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: [],
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 5,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '19734057',
  },

  // ============================================================
  // PRP/PRF
  // ============================================================
  {
    categorySlug: 'prp',
    name: 'PRP Vampire Facial',
    slug: 'prp-vampire-facial',
    description: `The process involves drawing your own blood and running it through a centrifuge to draw out the plasma. The PRP is then either rubbed onto the surface after microneedling or injected under the skin.

Benefits:
• Removes blemishes and signs of aging
• Naturally revitalizes your face
• Refreshes crow's feet and scarring
• Vibrant, healthy radiance`,
    shortDescription: 'PRP facial for natural rejuvenation',
    priceCents: 29900,
    priceDisplay: '$299',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: true,
    depositAmountCents: 7500,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['blood disorders', 'on blood thinners'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 1,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '19687957',
  },
  {
    categorySlug: 'prp',
    name: 'PRF Hair Restoration',
    slug: 'prf-hair-restoration',
    description: `Hair thinning? PRF Hair Restoration is here to help you regrow naturally — no surgery, no chemicals, just your body doing the work 💉✨

Benefits:
✅ Boosts hair growth
✅ Uses your own healing platelets
✅ Safe & all-natural

Say goodbye to hair loss and hello to confidence!`,
    shortDescription: 'Natural hair regrowth with your own platelets',
    priceCents: 39800,
    priceDisplay: '$398',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: true,
    depositAmountCents: 10000,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['blood disorders', 'on blood thinners'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 2,
    isFeatured: true,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '19704876',
  },

  // ============================================================
  // LASER HAIR REMOVAL
  // ============================================================
  {
    categorySlug: 'laser-hair',
    name: 'Laser Hair Removal - Brazilian',
    slug: 'laser-brazilian',
    description: '3-6 sessions recommended for permanent results',
    shortDescription: 'Brazilian laser hair removal',
    priceCents: 12900,
    priceDisplay: '$129',
    priceType: 'fixed',
    durationMinutes: 30,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['pregnancy', 'recent sun exposure'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 1,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '12690395',
  },
  {
    categorySlug: 'laser-hair',
    name: 'Laser Hair Removal - Legs or Arms',
    slug: 'laser-legs-arms',
    description: '3-6 sessions recommended for permanent results',
    shortDescription: 'Full legs or arms laser treatment',
    priceCents: 14900,
    priceDisplay: '$149',
    priceType: 'fixed',
    durationMinutes: 30,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['pregnancy', 'recent sun exposure'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 2,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '16774915',
  },
  {
    categorySlug: 'laser-hair',
    name: 'Laser Hair Removal - Underarm',
    slug: 'laser-underarm',
    description: '3-6 sessions recommended for permanent results',
    shortDescription: 'Underarm laser treatment',
    priceCents: 7900,
    priceDisplay: '$79',
    priceType: 'fixed',
    durationMinutes: 15,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['pregnancy', 'recent sun exposure'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 3,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '16774835',
  },
  {
    categorySlug: 'laser-hair',
    name: 'Laser Hair Removal - Upper Lip or Chin',
    slug: 'laser-lip-chin',
    description: '3-6 sessions recommended for permanent results',
    shortDescription: 'Upper lip or chin laser treatment',
    priceCents: 5900,
    priceDisplay: '$59',
    priceType: 'fixed',
    durationMinutes: 15,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: true,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: 18,
    contraindications: ['pregnancy', 'recent sun exposure'],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 4,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '12690149',
  },

  // ============================================================
  // LASH SERVICES
  // ============================================================
  {
    categorySlug: 'lash',
    name: 'Classic Lash Full Set',
    slug: 'lash-classic-full',
    description: `Indulge in the essence of true beauty at Hello Gorgeous!

Our meticulous lash extensions are handcrafted with love, offering you the opportunity to enhance the length and volume of your own lashes.

Pre-Appointment Tips:
• Clean your lashes
• Arrive on time
• Avoid caffeine
• Get ready to relax

24-hour cancellation notice required.`,
    shortDescription: 'Classic eyelash extension full set',
    priceCents: 12000,
    priceDisplay: '$120',
    priceType: 'fixed',
    durationMinutes: 90,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: true,
    depositAmountCents: 2500,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: false,
    requiresConsent: false,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: null,
    contraindications: [],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 1,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '5138218',
  },
  {
    categorySlug: 'lash',
    name: 'Hybrid Lash Full Set',
    slug: 'lash-hybrid-full',
    description: 'Mix of classic and volume lashes for a fuller look.',
    shortDescription: 'Hybrid eyelash extension full set',
    priceCents: 15000,
    priceDisplay: '$150',
    priceType: 'fixed',
    durationMinutes: 90,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: true,
    depositAmountCents: 2500,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: false,
    requiresConsent: false,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: null,
    contraindications: [],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 2,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '5138218',
  },
  {
    categorySlug: 'lash',
    name: 'Volume Lash Full Set',
    slug: 'lash-volume-full',
    description: 'Dramatic, full volume lash extensions.',
    shortDescription: 'Volume eyelash extension full set',
    priceCents: 17500,
    priceDisplay: '$175',
    priceType: 'fixed',
    durationMinutes: 120,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: true,
    depositAmountCents: 2500,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: false,
    requiresConsent: false,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: null,
    contraindications: [],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 3,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '5138218',
  },
  {
    categorySlug: 'lash',
    name: 'Lash Lift with Tint',
    slug: 'lash-lift-tint',
    description: 'Natural lash lift and tint for a mascara-free look.',
    shortDescription: 'Lift and tint your natural lashes',
    priceCents: 7500,
    priceDisplay: '$75',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: false,
    requiresConsent: false,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: null,
    contraindications: [],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 4,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '11911801',
  },

  // ============================================================
  // BROW SERVICES
  // ============================================================
  {
    categorySlug: 'brow',
    name: 'Brow Shaping & Wax',
    slug: 'brow-wax',
    description: 'Professional brow shaping and waxing.',
    shortDescription: 'Brow shaping and wax',
    priceCents: 2000,
    priceDisplay: '$20',
    priceType: 'fixed',
    durationMinutes: 15,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: false,
    requiresConsent: false,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: null,
    contraindications: [],
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 2,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 1,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '1666231',
  },
  {
    categorySlug: 'brow',
    name: 'Brow Lamination with Tint',
    slug: 'brow-lamination-tint',
    description: `Brow Lamination perms the eyebrows so they look fuller and straight.

Benefits:
• Thin eyebrows look fuller
• Full eyebrows look straighter
• Unruly curly eyebrows become manageable`,
    shortDescription: 'Brow lamination with tint',
    priceCents: 8500,
    priceDisplay: '$85',
    priceType: 'fixed',
    durationMinutes: 60,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: false,
    requiresConsent: false,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: null,
    contraindications: [],
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 2,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '12762799',
  },

  // ============================================================
  // CONSULTATIONS
  // ============================================================
  {
    categorySlug: 'consultations',
    name: 'Free Consultation',
    slug: 'free-consultation',
    description: `Skin Type: We will go over the Fitzpatrick skin type classification and discuss contraindications.

Treatment Sessions: We'll discuss how many sessions are needed for optimal results.

Pre- and Post-Treatment Care: Proper patient education for optimal outcomes.

We'll put together a treatment plan to target your needs.`,
    shortDescription: 'Free consultation with our team',
    priceCents: 0,
    priceDisplay: 'FREE',
    priceType: 'fixed',
    durationMinutes: 15,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: false,
    requiresConsent: false,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: null,
    contraindications: [],
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 1,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: null,
    freshaServiceId: '12690626',
  },
  {
    categorySlug: 'consultations',
    name: 'Medical Visit with Ryan Kent, APRN',
    slug: 'medical-visit-ryan',
    description: `Experience personalized, professional care from a trusted medical provider.

Meet with Ryan Kent, APRN, FNP, for a thorough medical visit tailored to your needs. This service offers a supportive environment where your wellness and beauty concerns are addressed with expertise and attention.`,
    shortDescription: 'Medical evaluation with Ryan Kent, APRN',
    priceCents: 4900,
    priceDisplay: '$49',
    priceType: 'fixed',
    durationMinutes: 15,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    depositRequired: false,
    depositAmountCents: null,
    depositType: 'fixed',
    requiresConsult: false,
    requiresIntake: true,
    requiresConsent: false,
    requiresLabs: false,
    requiresTelehealthClearance: false,
    minimumAge: null,
    contraindications: [],
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 24,
    allowOnlineBooking: true,
    addonServiceIds: [],
    relatedServiceIds: [],
    imageUrl: null,
    displayOrder: 2,
    isFeatured: false,
    isActive: true,
    primaryPersonaId: 'ryan',
    freshaServiceId: '19910965',
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get services by category slug
 */
export function getServicesByCategory(categorySlug: string): ServiceSeed[] {
  return SERVICES.filter(s => s.categorySlug === categorySlug);
}

/**
 * Get featured services
 */
export function getFeaturedServices(): ServiceSeed[] {
  return SERVICES.filter(s => s.isFeatured);
}

/**
 * Get services requiring consent
 */
export function getServicesRequiringConsent(): ServiceSeed[] {
  return SERVICES.filter(s => s.requiresConsent);
}

/**
 * Get services requiring consult
 */
export function getServicesRequiringConsult(): ServiceSeed[] {
  return SERVICES.filter(s => s.requiresConsult);
}

// ============================================================
// STATISTICS
// ============================================================

export const SERVICE_STATS = {
  totalServices: SERVICES.length,
  totalCategories: SERVICE_CATEGORIES.length,
  featuredServices: SERVICES.filter(s => s.isFeatured).length,
  servicesRequiringConsult: SERVICES.filter(s => s.requiresConsult).length,
  servicesRequiringDeposit: SERVICES.filter(s => s.depositRequired).length,
  averagePrice: Math.round(SERVICES.reduce((sum, s) => sum + s.priceCents, 0) / SERVICES.length / 100),
};
