import { SITE } from './seo';

// ============================================================
// LOCATION-BASED SEO CONFIGURATION
// Central config for all location landing pages
// ============================================================

export const SERVICE_AREAS = [
  { city: 'Oswego', slug: 'oswego', distance: '0 min', directions: 'We\'re located right in downtown Oswego!' },
  { city: 'Naperville', slug: 'naperville', distance: '15 min', directions: 'Head west on Route 34 for about 8 miles' },
  { city: 'Aurora', slug: 'aurora', distance: '10 min', directions: 'Head south on Route 30 toward Oswego' },
  { city: 'Plainfield', slug: 'plainfield', distance: '12 min', directions: 'Take Route 126 East to Route 34' },
  { city: 'Yorkville', slug: 'yorkville', distance: '8 min', directions: 'Head north on Route 47/Route 71' },
  { city: 'Montgomery', slug: 'montgomery', distance: '10 min', directions: 'Head south via Route 30' },
] as const;

export type ServiceArea = typeof SERVICE_AREAS[number];

export interface ServiceConfig {
  slug: string;
  name: string;
  shortName: string;
  priceDisplay: string;
  description: string;
  heroImage: string;
  keywords: string[];
  treatmentAreas?: { area: string; detail: string }[];
  benefits: { icon: string; title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
}

export const TOP_SERVICES: ServiceConfig[] = [
  {
    slug: 'dermal-fillers',
    name: 'Dermal Fillers',
    shortName: 'Fillers',
    priceDisplay: 'From $500',
    description: 'Restore volume, enhance contours, and achieve natural-looking results with premium dermal fillers.',
    heroImage: '/images/services/hg-dermal-fillers.png',
    keywords: ['dermal fillers', 'juvederm', 'restylane', 'cheek filler', 'jawline filler', 'facial fillers', 'hyaluronic acid filler'],
    treatmentAreas: [
      { area: 'Cheeks', detail: 'Restore youthful volume' },
      { area: 'Jawline', detail: 'Define and contour' },
      { area: 'Under Eyes', detail: 'Reduce hollow appearance' },
      { area: 'Nasolabial Folds', detail: 'Smooth smile lines' },
      { area: 'Marionette Lines', detail: 'Lift corners of mouth' },
      { area: 'Chin', detail: 'Balance facial profile' },
    ],
    benefits: [
      { icon: '✨', title: 'Immediate Results', desc: 'See volume and contouring right away' },
      { icon: '⏰', title: 'Long-Lasting', desc: 'Results typically last 6-18 months' },
      { icon: '🎯', title: 'Customizable', desc: 'Tailored to your unique facial structure' },
      { icon: '↩️', title: 'Reversible', desc: 'HA fillers can be dissolved if needed' },
    ],
    faqs: [
      { question: 'How long do dermal fillers last?', answer: 'Depending on the filler type and treatment area, results typically last 6-18 months. Lip fillers may need touch-ups sooner, while cheek fillers can last over a year.' },
      { question: 'Is there downtime after fillers?', answer: 'Most clients return to normal activities immediately. Some swelling and bruising is normal and typically resolves within 3-7 days.' },
      { question: 'What brands of fillers do you use?', answer: 'We use premium FDA-approved fillers including Juvederm, Restylane, Revanesse, and RHA collection, selected based on your specific goals.' },
      { question: 'Can fillers be reversed?', answer: 'Yes! Hyaluronic acid fillers can be dissolved with an enzyme called hyaluronidase if needed.' },
    ],
  },
  {
    slug: 'lip-filler',
    name: 'Lip Filler',
    shortName: 'Lip Filler',
    priceDisplay: 'From $450',
    description: 'Enhance your lips with natural-looking volume, definition, and hydration using premium lip fillers.',
    heroImage: '/images/services/hg-lips-filler.png',
    keywords: ['lip filler', 'lip injections', 'lip augmentation', 'lip enhancement', 'juvederm lips', 'natural lip filler'],
    treatmentAreas: [
      { area: 'Full Lips', detail: 'Overall volume enhancement' },
      { area: 'Lip Border', detail: 'Define the vermillion border' },
      { area: 'Cupid\'s Bow', detail: 'Enhance the upper lip shape' },
      { area: 'Lip Flip', detail: 'Botox for subtle upper lip' },
      { area: 'Smoker Lines', detail: 'Smooth vertical lip lines' },
      { area: 'Hydration', detail: 'Restore moisture and plumpness' },
    ],
    benefits: [
      { icon: '💋', title: 'Natural Results', desc: 'Soft, kissable lips that look real' },
      { icon: '🎨', title: 'Customized', desc: 'Tailored to your desired look' },
      { icon: '⚡', title: 'Quick Treatment', desc: '15-30 minutes, minimal downtime' },
      { icon: '💧', title: 'Hydrating', desc: 'HA fillers attract moisture' },
    ],
    faqs: [
      { question: 'How long does lip filler last?', answer: 'Lip filler typically lasts 6-12 months depending on your metabolism, the product used, and how much filler is injected.' },
      { question: 'Will lip filler look natural?', answer: 'Yes! We specialize in natural-looking results. We enhance your lips while maintaining your unique features and avoiding the "overdone" look.' },
      { question: 'How much swelling should I expect?', answer: 'Swelling is normal for 2-3 days after lip filler, with final results visible at 2 weeks. Ice and arnica can help minimize swelling.' },
      { question: 'Can I get lip filler for the first time?', answer: 'Absolutely! We love working with first-time clients. We start conservatively and can always add more at a follow-up appointment.' },
    ],
  },
  {
    slug: 'weight-loss',
    name: 'Medical Weight Loss',
    shortName: 'Weight Loss',
    priceDisplay: 'From $350/mo',
    description: 'Achieve sustainable weight loss with GLP-1 medications like Semaglutide and Tirzepatide, supervised by medical professionals.',
    heroImage: '/images/services/hg-weight-loss.png',
    keywords: ['weight loss', 'semaglutide', 'tirzepatide', 'ozempic', 'wegovy', 'mounjaro', 'glp-1', 'medical weight loss', 'weight loss clinic', 'weight loss injections'],
    benefits: [
      { icon: '💉', title: 'GLP-1 Medications', desc: 'Semaglutide & Tirzepatide available' },
      { icon: '👩‍⚕️', title: 'Medical Supervision', desc: 'Provider-guided throughout' },
      { icon: '📊', title: 'Progress Tracking', desc: 'Regular check-ins and adjustments' },
      { icon: '🎯', title: 'Sustainable Results', desc: 'Lifestyle support for long-term success' },
    ],
    faqs: [
      { question: 'What is Semaglutide?', answer: 'Semaglutide is a GLP-1 medication that reduces appetite and helps regulate blood sugar. It\'s the same active ingredient in Ozempic and Wegovy, used for weight management.' },
      { question: 'How much weight can I lose?', answer: 'Results vary, but many clients lose 15-20% of their body weight over 6-12 months. We\'ll set realistic goals based on your individual situation.' },
      { question: 'Do I need to come in for injections?', answer: 'We teach you to self-inject at home with easy-to-use pens. You\'ll have regular check-ins with our providers to monitor progress and adjust dosing.' },
      { question: 'What are the side effects?', answer: 'Common side effects include nausea, which usually improves over time. We start with low doses and gradually increase to minimize side effects.' },
    ],
  },
  {
    slug: 'microneedling',
    name: 'RF Microneedling',
    shortName: 'Microneedling',
    priceDisplay: 'From $350',
    description: 'Transform your skin with RF microneedling — reduce wrinkles, scars, and pores while boosting collagen production.',
    heroImage: '/images/services/hg-microneedling.png',
    keywords: ['microneedling', 'rf microneedling', 'radiofrequency microneedling', 'morpheus8', 'skin tightening', 'collagen induction', 'acne scars', 'wrinkle treatment'],
    treatmentAreas: [
      { area: 'Face', detail: 'Wrinkles, pores, texture' },
      { area: 'Neck', detail: 'Tightening and lines' },
      { area: 'Acne Scars', detail: 'Reduce scar appearance' },
      { area: 'Stretch Marks', detail: 'Improve skin texture' },
      { area: 'Under Eyes', detail: 'Reduce crepey skin' },
      { area: 'Jawline', detail: 'Tighten and define' },
    ],
    benefits: [
      { icon: '🔥', title: 'RF Technology', desc: 'Deeper collagen stimulation with radiofrequency' },
      { icon: '✨', title: 'Skin Renewal', desc: 'Triggers natural healing response' },
      { icon: '📉', title: 'Minimal Downtime', desc: '2-3 days of redness typical' },
      { icon: '🎯', title: 'All Skin Types', desc: 'Safe for most skin tones' },
    ],
    faqs: [
      { question: 'How many sessions do I need?', answer: 'Most clients see best results with 3-4 treatments spaced 4-6 weeks apart, followed by maintenance sessions 1-2 times per year.' },
      { question: 'Does microneedling hurt?', answer: 'We apply numbing cream before treatment, so most clients feel only mild pressure. Comfort is a priority!' },
      { question: 'What\'s the downtime?', answer: 'Expect 2-3 days of redness similar to a sunburn. Most clients return to normal activities the next day with makeup.' },
      { question: 'When will I see results?', answer: 'You\'ll notice improvement in skin texture within 1-2 weeks, with continued improvement over 3-6 months as collagen rebuilds.' },
    ],
  },
  {
    slug: 'laser-hair-removal',
    name: 'Laser Hair Removal',
    shortName: 'Laser Hair',
    priceDisplay: 'From $75',
    description: 'Say goodbye to shaving and waxing with professional laser hair removal for smooth, hair-free skin.',
    heroImage: '/images/services/hg-laser-device.png',
    keywords: ['laser hair removal', 'permanent hair removal', 'hair removal', 'laser hair', 'bikini laser', 'underarm laser', 'leg laser', 'facial hair removal'],
    treatmentAreas: [
      { area: 'Underarms', detail: 'Quick and effective' },
      { area: 'Bikini/Brazilian', detail: 'Smooth and confident' },
      { area: 'Legs', detail: 'Full or partial' },
      { area: 'Face', detail: 'Upper lip, chin, sideburns' },
      { area: 'Arms', detail: 'Full or forearms' },
      { area: 'Back/Chest', detail: 'Large area treatment' },
    ],
    benefits: [
      { icon: '⚡', title: 'Fast Sessions', desc: 'Small areas take just minutes' },
      { icon: '💰', title: 'Cost Effective', desc: 'Save money vs. lifetime of waxing' },
      { icon: '🎯', title: 'Precision', desc: 'Targets hair without skin damage' },
      { icon: '✨', title: 'Smooth Skin', desc: 'No more razor burn or ingrown hairs' },
    ],
    faqs: [
      { question: 'How many sessions do I need?', answer: 'Most areas require 6-8 sessions spaced 4-6 weeks apart. Hair grows in cycles, so multiple sessions catch hair in the active growth phase.' },
      { question: 'Does laser hair removal hurt?', answer: 'Most clients describe it as a rubber band snap. We can adjust settings for comfort and some areas are more sensitive than others.' },
      { question: 'Is it permanent?', answer: 'Laser hair removal provides permanent hair REDUCTION. Most clients see 80-90% reduction after completing their sessions, with occasional touch-ups.' },
      { question: 'Can all skin tones be treated?', answer: 'Our laser is safe for most skin tones. We\'ll evaluate your skin and hair type during consultation to ensure safe, effective treatment.' },
    ],
  },
  {
    slug: 'ipl-photofacial',
    name: 'IPL Photofacial',
    shortName: 'IPL',
    priceDisplay: 'From $250',
    description: 'Target sun damage, redness, and pigmentation with IPL (Intense Pulsed Light) for clearer, more even skin tone.',
    heroImage: '/images/services/hg-laser-device.png',
    keywords: ['ipl photofacial', 'ipl treatment', 'photofacial', 'sun damage treatment', 'brown spots', 'rosacea treatment', 'skin rejuvenation', 'age spots'],
    treatmentAreas: [
      { area: 'Sun Spots', detail: 'Fade brown spots' },
      { area: 'Redness/Rosacea', detail: 'Reduce facial redness' },
      { area: 'Age Spots', detail: 'Even skin tone' },
      { area: 'Broken Capillaries', detail: 'Reduce visible vessels' },
      { area: 'Freckles', detail: 'Lighten pigmentation' },
      { area: 'Hands/Chest', detail: 'Treat sun damage' },
    ],
    benefits: [
      { icon: '☀️', title: 'Sun Damage', desc: 'Reverse years of sun exposure' },
      { icon: '🎨', title: 'Even Tone', desc: 'Reduce discoloration and spots' },
      { icon: '💫', title: 'Collagen Boost', desc: 'Stimulates skin renewal' },
      { icon: '⏰', title: 'Quick Recovery', desc: 'Minimal downtime needed' },
    ],
    faqs: [
      { question: 'What does IPL treat?', answer: 'IPL effectively treats sun spots, age spots, redness, rosacea, broken capillaries, and uneven skin tone. It\'s excellent for reversing sun damage.' },
      { question: 'How many treatments do I need?', answer: 'Most clients need 3-5 treatments spaced 3-4 weeks apart for optimal results. Maintenance treatments can be done annually.' },
      { question: 'What\'s the downtime?', answer: 'Brown spots may darken initially before flaking off over 7-10 days. Redness typically subsides within 24 hours. Most clients return to normal activities same day.' },
      { question: 'Can I do IPL in summer?', answer: 'We recommend avoiding IPL if you have a tan or plan significant sun exposure. Best results come when you can avoid sun for 2 weeks before and after.' },
    ],
  },
  {
    slug: 'co2-laser',
    name: 'CO₂ Fractional Laser',
    shortName: 'CO₂ Laser',
    priceDisplay: 'From $800',
    description: 'The gold standard in skin resurfacing — dramatically improve wrinkles, scars, and texture with our InMode Solaria CO₂ fractional laser.',
    heroImage: '/images/services/hg-laser-device.png',
    keywords: ['co2 laser', 'fractional co2', 'co2 laser resurfacing', 'skin resurfacing', 'laser skin treatment', 'wrinkle treatment', 'scar treatment', 'solaria laser', 'inmode solaria'],
    treatmentAreas: [
      { area: 'Deep Wrinkles', detail: 'Dramatic improvement' },
      { area: 'Acne Scars', detail: 'Resurface and smooth' },
      { area: 'Sun Damage', detail: 'Reverse years of damage' },
      { area: 'Skin Texture', detail: 'Smoother, refined skin' },
      { area: 'Fine Lines', detail: 'Around eyes and mouth' },
      { area: 'Tone', detail: 'Even out pigmentation' },
    ],
    benefits: [
      { icon: '🏆', title: 'Gold Standard', desc: 'Most effective resurfacing treatment' },
      { icon: '🔬', title: 'Fractional Tech', desc: 'Faster healing than traditional CO₂' },
      { icon: '📈', title: 'Dramatic Results', desc: 'Significant improvement in one treatment' },
      { icon: '✨', title: 'Collagen Remodel', desc: 'Continues improving for months' },
    ],
    faqs: [
      { question: 'What is CO₂ fractional laser?', answer: 'CO₂ laser creates tiny columns of treatment in the skin, triggering dramatic collagen remodeling. It\'s the most effective treatment for deep wrinkles, scars, and significant sun damage.' },
      { question: 'What\'s the downtime?', answer: 'Plan for 5-7 days of downtime. Your skin will be red and may peel as it heals. Most clients take a week off work. The results are worth it!' },
      { question: 'How many treatments do I need?', answer: 'Many clients see dramatic results from just 1-2 treatments. For severe scarring or damage, 2-3 sessions may be recommended.' },
      { question: 'Is CO₂ laser painful?', answer: 'We use numbing cream and cooling during treatment. You\'ll feel heat and some discomfort, but it\'s very tolerable. We prioritize your comfort.' },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceConfig | undefined {
  return TOP_SERVICES.find(s => s.slug === slug);
}

export function generateLocationKeywords(service: ServiceConfig, city: string): string[] {
  const cityLower = city.toLowerCase();
  return [
    ...service.keywords.map(k => `${k} ${cityLower}`),
    ...service.keywords.map(k => `${k} ${cityLower} il`),
    `${service.shortName.toLowerCase()} near ${cityLower}`,
    `best ${service.shortName.toLowerCase()} ${cityLower}`,
    `${service.shortName.toLowerCase()} near me`,
  ];
}

export function generateServiceSchema(service: ServiceConfig, city: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: service.name,
    alternateName: service.keywords.slice(0, 5),
    description: service.description,
    procedureType: 'Cosmetic',
    provider: {
      '@type': 'MedicalBusiness',
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.address.streetAddress,
        addressLocality: SITE.address.addressLocality,
        addressRegion: SITE.address.addressRegion,
        postalCode: SITE.address.postalCode,
      },
      areaServed: {
        '@type': 'City',
        name: `${city}, IL`,
      },
    },
  };
}
