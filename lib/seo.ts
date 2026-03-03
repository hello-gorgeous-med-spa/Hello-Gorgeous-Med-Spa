import type { Metadata } from "next";

export type FAQ = { question: string; answer: string };

export type Service = {
  slug: string;
  name: string;
  category: string;
  short: string;
  heroTitle: string;
  heroSubtitle: string;
  faqs: FAQ[];
};

/** NAP (Name, Address, Phone) - single source of truth. Must match Google Business Profile exactly. */
export const SITE = {
  name: "Hello Gorgeous Med Spa",
  url: "https://www.hellogorgeousmedspa.com",
  description:
    "Luxury medical aesthetics in Oswego, IL. Botox/Dysport, dermal fillers, weight loss (GLP‑1), hormone therapy, PRF/PRP, and more.",
  phone: "630-636-6193",
  /** Toll-free via Square - replace with your number when ready */
  tollFree: "833-474-3998",
  email: "hellogorgeousskin@yahoo.com",
  address: {
    streetAddress: "74 W. Washington Street",
    addressLocality: "Oswego",
    addressRegion: "IL",
    postalCode: "60543",
    addressCountry: "US",
  },
  geo: { latitude: 41.6828, longitude: -88.3515 },
  serviceAreas: ["Oswego, IL", "Naperville, IL", "Aurora, IL", "Plainfield, IL", "Yorkville, IL", "Sugar Grove, IL", "Montgomery, IL", "Kendall County, IL", "Kane County, IL"],
  googleBusinessUrl: "https://www.google.com/maps/place/Hello+Gorgeous+Med+Spa/@41.6828,-88.3515,17z",
  /** Direct link to leave a Google review. */
  googleReviewUrl: "https://g.page/r/CYQOWmT_HcwQEBM/review",
  priceRange: "$$$" as const,
  /** AggregateRating - only injected when both set. Update from GBP or manually. */
  reviewRating: "4.9",
  reviewCount: "47",
  /** Social — update here when you change handles; footer and other components use these. */
  social: {
    instagram: "https://www.instagram.com/hello.gorgeous2026/",
    facebook: "https://www.facebook.com/HelloGorgeousOswego",
    tiktok: "https://www.tiktok.com/@daniellealcala12",
  },
} as const;

export const HOME_FAQS: readonly FAQ[] = [
  // Location & Access
  {
    question: "Where is Hello Gorgeous Med Spa located?",
    answer:
      "Hello Gorgeous Med Spa is located at 74 W. Washington Street in Oswego, IL 60543. We serve clients from Naperville, Aurora, Plainfield, Yorkville, Montgomery, Sugar Grove, and throughout Kendall and Kane Counties.",
  },
  {
    question: "What are Hello Gorgeous Med Spa hours of operation?",
    answer:
      "We are open Monday through Friday 9am-6pm, with Saturday appointments available by request. We offer same-day appointments when available. Call (630) 636-6193 to check availability.",
  },
  {
    question: "Does Hello Gorgeous Med Spa serve Naperville, Aurora, and Plainfield?",
    answer:
      "Yes. We welcome clients from Naperville, Plainfield, Aurora, Yorkville, Montgomery, and surrounding areas. Oswego is conveniently located with easy access from I-88 and Route 34, typically 15-20 minutes from most western suburbs.",
  },
  // Botox & Injectables
  {
    question: "How much does Botox cost at Hello Gorgeous Med Spa?",
    answer:
      "Botox is $10 per unit at Hello Gorgeous Med Spa. Most clients need 20-60 units depending on treatment areas. Forehead typically requires 10-20 units, crow's feet 10-15 units per side, and frown lines (11s) 15-25 units. We offer free consultations to provide exact pricing.",
  },
  {
    question: "What is the difference between Botox, Dysport, and Jeuveau?",
    answer:
      "Botox, Dysport, and Jeuveau are all FDA-approved neuromodulators that relax muscles to reduce wrinkles. Dysport may spread more and work faster (2-3 days vs 5-7 days). Jeuveau is often called Newtox and may be priced competitively. Results last 3-4 months for all three. Our injectors help you choose based on your goals.",
  },
  {
    question: "How long does Botox last?",
    answer:
      "Botox typically lasts 3-4 months. Results may last longer with regular treatments as muscles become trained to relax. First-time clients often see results for 2-3 months initially, extending with subsequent treatments.",
  },
  // Dermal Fillers
  {
    question: "What dermal fillers does Hello Gorgeous Med Spa offer?",
    answer:
      "We offer Juvederm, Restylane, RHA, Sculptra, and Radiesse fillers. Each is suited for different concerns: Juvederm for lips and cheeks, Restylane for under-eyes and lips, RHA for dynamic areas, Sculptra for collagen stimulation, and Radiesse for cheeks and hands. Prices start at $600 per syringe.",
  },
  {
    question: "How long do lip fillers last?",
    answer:
      "Lip fillers typically last 6-12 months depending on the product used, your metabolism, and the amount injected. Juvederm Ultra lasts 6-9 months, while Juvederm Volbella can last up to 12 months. We recommend touch-ups every 6-9 months to maintain results.",
  },
  // Weight Loss
  {
    question: "Does Hello Gorgeous Med Spa offer Semaglutide or Tirzepatide for weight loss?",
    answer:
      "Yes. We offer compounded Semaglutide and Tirzepatide (similar to Ozempic, Wegovy, and Mounjaro) for medical weight loss. Our program includes medication, weekly check-ins, and nutritional guidance. Most patients lose 15-20% of body weight. Pricing starts at $350/month for Semaglutide.",
  },
  {
    question: "What is the difference between Semaglutide and Tirzepatide for weight loss?",
    answer:
      "Both are GLP-1 medications for weight loss. Semaglutide (like Ozempic/Wegovy) targets one hormone receptor, while Tirzepatide (like Mounjaro/Zepbound) targets two, potentially leading to greater weight loss (up to 22% vs 15% body weight). Tirzepatide may have fewer GI side effects for some patients. We help determine which is best for you.",
  },
  // Morpheus8 & Quantum RF
  {
    question: "What is Morpheus8 and does Hello Gorgeous Med Spa offer it?",
    answer:
      "Yes, we offer Morpheus8. It is an FDA-cleared RF (radiofrequency) microneedling treatment that penetrates up to 8mm deep to tighten skin, reduce fat, and stimulate collagen. It treats face, neck, and body concerns including jowls, acne scars, stretch marks, and loose skin. Results develop over 3-6 months with 1-3 treatments recommended.",
  },
  {
    question: "What is Quantum RF and how is it different from Morpheus8?",
    answer:
      "Quantum RF is a minimally invasive treatment that delivers radiofrequency energy beneath the skin (subdermal) for surgical-like skin tightening without surgery. While Morpheus8 uses microneedles from the surface, Quantum RF works from inside for more dramatic results on loose skin, especially chin/neck, arms, abdomen, and buttocks. Hello Gorgeous Med Spa is one of the first in the area to offer Quantum RF.",
  },
  // Solaria CO2
  {
    question: "What is Solaria CO2 laser treatment?",
    answer:
      "Solaria CO2 is a fractional laser that resurfaces skin to treat wrinkles, acne scars, sun damage, and uneven texture. It is the gold standard for skin rejuvenation with dramatic results from one treatment. Downtime is 5-7 days. Hello Gorgeous Med Spa is one of few practices in the western suburbs offering this advanced technology.",
  },
  // Hormone Therapy
  {
    question: "Does Hello Gorgeous Med Spa offer hormone replacement therapy?",
    answer:
      "Yes. We offer BioTE hormone pellet therapy for both men and women. Pellets are inserted every 3-6 months and provide steady hormone levels. We treat symptoms of menopause, andropause, fatigue, weight gain, low libido, and mood changes. Lab work and consultation required first.",
  },
  // IV Therapy
  {
    question: "What IV therapy treatments does Hello Gorgeous Med Spa offer?",
    answer:
      "We offer various IV vitamin drips including Myers Cocktail, immune boost, energy, hydration, and custom blends. IV therapy delivers vitamins and minerals directly to your bloodstream for maximum absorption. Great for fatigue, hangovers, immune support, and overall wellness. Sessions take 30-60 minutes.",
  },
  // Consultations & Booking
  {
    question: "Does Hello Gorgeous Med Spa offer free consultations?",
    answer:
      "Yes. We offer complimentary consultations for most services including Botox, fillers, weight loss, and skin treatments. During your consultation, we assess your concerns, discuss options, and provide transparent pricing. Book online or call (630) 636-6193.",
  },
  {
    question: "How do I book an appointment at Hello Gorgeous Med Spa?",
    answer:
      "You can book online at hellogorgeousmedspa.com/book, call (630) 636-6193, or text us. We offer same-day appointments when available. First-time clients receive a free vitamin injection (B12, D3, Biotin, or Glutathione) valued at up to $65.",
  },
  // Pricing & Payment
  {
    question: "Does Hello Gorgeous Med Spa offer financing or payment plans?",
    answer:
      "Yes. We accept Cherry, Affirm, and CareCredit financing with plans from 0% APR for qualified applicants. You can apply in minutes and get approved for treatments. We also accept HSA/FSA cards, all major credit cards, and cash.",
  },
  {
    question: "Does Hello Gorgeous Med Spa have a membership or loyalty program?",
    answer:
      "Yes. Our VIP membership is $49/month and includes 15% off all services, priority booking, exclusive promotions, and monthly perks. We also participate in Alle (Allergan) and Aspire (Galderma) rewards programs where you earn points on Botox, Juvederm, Dysport, and more.",
  },
  // Safety & Credentials
  {
    question: "Who performs treatments at Hello Gorgeous Med Spa?",
    answer:
      "Treatments are performed by Danielle Alcala (Lead Injector and Owner) and Ryan Kent, FNP-BC (Medical Director). Both are licensed, certified, and have extensive training in aesthetic medicine. Ryan has full prescriptive authority for medical treatments including weight loss and hormone therapy.",
  },
  {
    question: "Is Hello Gorgeous Med Spa licensed and safe?",
    answer:
      "Yes. Hello Gorgeous Med Spa is a fully licensed medical spa in Illinois. We use only FDA-approved products from authorized distributors. Our Medical Director oversees all treatments. We maintain strict safety protocols and use medical-grade equipment. We are 5-star rated on Google with 47+ reviews.",
  },
  // New Client
  {
    question: "What should I expect as a new client at Hello Gorgeous Med Spa?",
    answer:
      "New clients receive a warm welcome, thorough consultation, and personalized treatment plan. We take time to understand your goals and explain all options. First-time clients also receive a complimentary vitamin injection ($35-65 value). No pressure, just honest recommendations for your aesthetic journey.",
  },
] as const;

/** Homepage testimonials - used for Review schema and Testimonials component */
export const HOME_TESTIMONIALS = [
  { name: "Sarah M.", location: "Naperville, IL", rating: 5, text: "Danielle is amazing! She took her time to explain everything and made me feel so comfortable for my first Botox experience. The results are so natural - I look refreshed, not frozen!", service: "Botox" },
  { name: "Jennifer K.", location: "Oswego, IL", rating: 5, text: "Best med spa experience I've ever had. The team really listens to what you want. My lip filler looks incredible and I've gotten so many compliments!", service: "Dermal Fillers" },
  { name: "Michelle R.", location: "Aurora, IL", rating: 5, text: "I hosted a Botox party with Hello Gorgeous and it was SO much fun! Great prices, professional service, and my friends are already asking when we're doing it again.", service: "Botox Party" },
  { name: "Amanda T.", location: "Plainfield, IL", rating: 5, text: "The weight loss program has been life-changing. Down 30 lbs and feeling better than I have in years. Ryan and Danielle genuinely care about your health journey.", service: "Weight Loss" },
] as const;

export const SERVICES: readonly Service[] = [
  {
    slug: "botox-dysport-jeuveau",
    name: "Botox, Dysport & Jeuveau",
    category: "Injectables",
    short:
      "Smooth fine lines and soften expression wrinkles with natural-looking results.",
    heroTitle: "Botox, Dysport & Jeuveau in Oswego, IL",
    heroSubtitle:
      "A precision approach to a refreshed look—subtle, balanced, and tailored to your face.",
    faqs: [
      {
        question: "How long does Botox/Dysport last?",
        answer:
          "Most clients see results for about 3–4 months, depending on metabolism, dosage, and treatment area.",
      },
      {
        question: "When will I see results?",
        answer:
          "You may start noticing changes in a few days, with full results typically visible around 10–14 days.",
      },
      {
        question: "Will I look frozen?",
        answer:
          "Our goal is natural movement and a refreshed look. Dosing and placement are customized to you.",
      },
    ],
  },
  {
    slug: "dermal-fillers",
    name: "Dermal Fillers",
    category: "Injectables",
    short: "Restore volume, refine contours, and enhance facial harmony.",
    heroTitle: "Dermal Fillers in Oswego, IL",
    heroSubtitle:
      "Strategic volume where you need it—cheeks, lips, jawline, and beyond.",
    faqs: [
      {
        question: "How long do fillers last?",
        answer: "Longevity varies by product and area, commonly 6–18 months.",
      },
      {
        question: "Is there downtime?",
        answer:
          "Many people return to normal activities quickly. Swelling or bruising can occur and usually resolves within days.",
      },
      {
        question: "Can fillers be reversed?",
        answer:
          "Some hyaluronic acid fillers can be dissolved if needed. We’ll discuss options during your consult.",
      },
    ],
  },
  {
    slug: "lip-filler",
    name: "Lip Filler",
    category: "Injectables",
    short: "Soft, balanced lip enhancement designed for your facial harmony.",
    heroTitle: "Lip Filler in Oswego, IL",
    heroSubtitle:
      "A tailored approach to shape, hydration, and proportion—subtle and refined.",
    faqs: [
      {
        question: "How long does lip filler last?",
        answer: "Longevity varies by product and metabolism, often 6–12+ months.",
      },
      {
        question: "How much swelling should I expect?",
        answer:
          "Swelling is common for the first 24–72 hours and gradually improves over the first week.",
      },
      {
        question: "Can lips look natural?",
        answer:
          "Yes—natural results come from conservative dosing, thoughtful technique, and facial balance.",
      },
    ],
  },
  {
    slug: "weight-loss-therapy",
    name: "Weight Loss Therapy",
    category: "Wellness",
    short:
      "Provider-guided weight management with GLP‑1 support and lifestyle coaching.",
    heroTitle: "Weight Loss Therapy in Oswego, IL",
    heroSubtitle:
      "A medical approach to sustainable weight loss—progress tracking, guidance, and support.",
    faqs: [
      {
        question: "Who is a candidate for GLP‑1 therapy?",
        answer:
          "Eligibility depends on your health history and goals. We’ll evaluate candidacy during a medical consult.",
      },
      {
        question: "How quickly will I lose weight?",
        answer:
          "Results vary. Safe, sustainable progress is the goal—your plan is individualized.",
      },
      {
        question: "Do I need labs?",
        answer:
          "Often yes. We may recommend baseline labs and periodic monitoring depending on your plan.",
      },
    ],
  },
  {
    slug: "biote-hormone-therapy",
    name: "BioTE Hormone Therapy",
    category: "Wellness",
    short:
      "Personalized hormone optimization designed around your symptoms and labs.",
    heroTitle: "BioTE Hormone Therapy in Oswego, IL",
    heroSubtitle:
      "Feel like yourself again—energy, mood, sleep, and overall wellbeing support.",
    faqs: [
      {
        question: "What symptoms can hormone therapy help?",
        answer:
          "Common concerns include fatigue, sleep issues, mood changes, weight gain around the mid-section, inability to lose weight despite diet and exercise, decreased muscle strength, joint discomfort, and reduced libido. We’ll assess your situation in depth.",
      },
      {
        question: "Is lab work required?",
        answer:
          "Yes. In-office labs (metabolic panel, thyroid, hormones, vitamins, lipids, A1C) guide safe, personalized dosing. Results typically within 36 hours.",
      },
      {
        question: "How long until I feel results?",
        answer:
          "Many notice improvements within 2–4 weeks. Full optimization can take several months depending on your starting levels and protocol.",
      },
      {
        question: "What formulations do you offer?",
        answer:
          "We offer BioTE bioidentical hormone pellets (sustained release), plus Olympia compounded options when appropriate—including testosterone (creams, injectables), estradiol, progesterone, and Biest in various strengths. Your provider will recommend the best delivery method for you.",
      },
      {
        question: "What are the most common prescriptions?",
        answer:
          "For women: Biest (estradiol/estriol blend), progesterone, testosterone pellets or cream. For men: testosterone pellets or testosterone cypionate. We also prescribe anastrozole when indicated to support hormone balance.",
      },
      {
        question: "What are contraindications for hormone therapy?",
        answer:
          "Absolute contraindications include: active or history of breast/endometrial/prostate cancer, untreated venous thromboembolism, stroke or coronary event within 6 months, active liver disease, unexplained vaginal bleeding, and pregnancy or breastfeeding. We screen thoroughly before treatment.",
      },
      {
        question: "What lab results might delay or prevent treatment?",
        answer:
          "Red flags include elevated PSA (men), markedly elevated hemoglobin/hematocrit (polycythemia risk), severely abnormal liver function, active cardiovascular concerns, or certain clotting disorders. We review all labs and discuss next steps before initiating therapy.",
      },
      {
        question: "Do you work with Olympia Pharmacy?",
        answer:
          "Yes. When compounded medications are part of your plan, we work with trusted partners like Olympia for customized formulations including creams, capsules, and injectables.",
      },
    ],
  },
  {
    slug: "trt-replacement-therapy",
    name: "TRT Replacement Therapy",
    category: "Wellness",
    short:
      "Clinician-guided TRT evaluation and ongoing monitoring with a safety-first approach.",
    heroTitle: "TRT Replacement Therapy in Oswego, IL",
    heroSubtitle:
      "Focused on symptoms, lab data, and conservative, clinician-led decision-making.",
    faqs: [
      {
        question: "Is TRT right for me?",
        answer:
          "Eligibility depends on medical history, symptoms, and lab evaluation. A consultation is required for individualized guidance.",
      },
      {
        question: "Do I need labs?",
        answer:
          "Yes—lab work is typically required to evaluate candidacy and for ongoing monitoring.",
      },
      {
        question: "How often are follow-ups?",
        answer:
          "Follow-up cadence varies by plan and response; monitoring is part of a safe protocol.",
      },
    ],
  },
  {
    slug: "sermorelin-growth-peptide",
    name: "Sermorelin Growth Peptide",
    category: "Wellness",
    short:
      "Educational overview and clinician-guided evaluation for peptide-based wellness support.",
    heroTitle: "Sermorelin Growth Peptide in Oswego, IL",
    heroSubtitle:
      "Discuss goals, safety considerations, and next steps with a clinician.",
    faqs: [
      {
        question: "Is this a prescription therapy?",
        answer:
          "Peptide therapies may require medical evaluation and may be prescription-based depending on your plan and jurisdiction.",
      },
      {
        question: "Can you tell me what dose I need?",
        answer:
          "No—dosing is individualized and requires clinician oversight and monitoring.",
      },
      {
        question: "What’s the first step?",
        answer:
          "Book a consultation to discuss goals, history, and whether labs are needed.",
      },
    ],
  },
  {
    slug: "iv-therapy",
    name: "IV Therapy",
    category: "Wellness",
    short: "Hydration and wellness support with clinician-guided IV options.",
    heroTitle: "IV Therapy in Oswego, IL",
    heroSubtitle:
      "Support energy, hydration, and recovery with a safety-first approach.",
    faqs: [
      {
        question: "Is IV therapy safe?",
        answer:
          "IV therapy is generally well-tolerated but requires screening and oversight. We’ll review your history before treatment.",
      },
      {
        question: "How long does it take?",
        answer:
          "Many IV sessions take around 30–60 minutes, depending on the formulation and plan.",
      },
      {
        question: "Do I need to prepare?",
        answer:
          "Hydration and a light meal can help. We’ll provide individualized pre-visit guidance.",
      },
    ],
  },
  {
    slug: "vitamin-injections",
    name: "Vitamin Injections",
    category: "Wellness",
    short: "Wellness support injections with clinician screening and guidance.",
    heroTitle: "Vitamin Injections in Oswego, IL",
    heroSubtitle:
      "A quick, clinician-guided option for targeted wellness support.",
    faqs: [
      {
        question: "Which injection should I choose?",
        answer:
          "Selection depends on goals and medical history. We’ll review options during your visit.",
      },
      {
        question: "How often can I get injections?",
        answer:
          "Frequency varies based on the specific injection and your plan.",
      },
      {
        question: "Is screening required?",
        answer:
          "Yes—screening helps ensure safety and appropriate use.",
      },
    ],
  },
  {
    slug: "rf-microneedling",
    name: "RF Microneedling",
    category: "Aesthetics",
    short: "Texture, pores, and firmness support with RF-assisted microneedling.",
    heroTitle: "RF Microneedling in Oswego, IL",
    heroSubtitle:
      "A modern collagen-stimulating treatment designed for smoother, firmer-looking skin.",
    faqs: [
      {
        question: "How many sessions do I need?",
        answer:
          "Many protocols recommend a series; exact timing depends on goals and skin response.",
      },
      {
        question: "Is there downtime?",
        answer:
          "Redness and mild swelling are common. Downtime varies, often a few days depending on settings and skin sensitivity.",
      },
      {
        question: "Who is a good candidate?",
        answer:
          "Candidacy depends on skin type, goals, and history. A consult helps personalize a plan.",
      },
    ],
  },
  {
    slug: "chemical-peels",
    name: "Chemical Peels",
    category: "Aesthetics",
    short: "Brighten, refine texture, and support clearer-looking skin.",
    heroTitle: "Chemical Peels in Oswego, IL",
    heroSubtitle:
      "A controlled exfoliation approach to support glow, tone, and texture.",
    faqs: [
      {
        question: "Will I peel?",
        answer:
          "It depends on the peel depth. Some peels cause little to no visible peeling; others do.",
      },
      {
        question: "How should I prepare?",
        answer:
          "We’ll advise on skincare prep and any products to pause ahead of time based on your plan.",
      },
      {
        question: "How often can I do peels?",
        answer:
          "Frequency varies by peel type and goals. Your provider will recommend a schedule.",
      },
    ],
  },
  {
    slug: "hydra-facial",
    name: "Hydra Facial",
    category: "Aesthetics",
    short: "Hydration-forward facial treatment to support glow and clarity.",
    heroTitle: "Hydra Facial in Oswego, IL",
    heroSubtitle:
      "A premium facial experience designed for refreshed, radiant-looking skin.",
    faqs: [
      {
        question: "Is there downtime?",
        answer:
          "Most people return to normal activities right away. Mild redness can occur.",
      },
      {
        question: "How often should I get facials?",
        answer:
          "Many clients choose monthly maintenance, but schedules vary by goals and skin needs.",
      },
      {
        question: "Can I combine this with other treatments?",
        answer:
          "Often yes—timing depends on your plan. We’ll recommend a safe sequence.",
      },
    ],
  },
  {
    slug: "geneo-facial",
    name: "Geneo Facial",
    category: "Aesthetics",
    short: "Facial technology designed to support glow, tone, and skin quality.",
    heroTitle: "Geneo Facial in Oswego, IL",
    heroSubtitle:
      "A modern facial approach for refreshed-looking skin with a luxury experience.",
    faqs: [
      {
        question: "What results can I expect?",
        answer:
          "Many people notice a glow and refreshed look quickly; longer-term improvement depends on maintenance and skincare plan.",
      },
      {
        question: "Is there downtime?",
        answer:
          "Typically minimal. Mild redness can occur depending on sensitivity.",
      },
      {
        question: "How many treatments do I need?",
        answer:
          "Some clients do one for an event; others follow a series for ongoing goals.",
      },
    ],
  },
  {
    slug: "ipl-photofacial",
    name: "IPL Photofacial",
    category: "Aesthetics",
    short: "Target sun damage and redness with light-based skin support.",
    heroTitle: "IPL Photofacial in Oswego, IL",
    heroSubtitle:
      "A light-based approach designed to support clearer, more even-looking skin.",
    faqs: [
      {
        question: "How many sessions are typical?",
        answer:
          "Many people do a series for best results. Your provider will recommend based on goals and skin response.",
      },
      {
        question: "Do I need to avoid sun exposure?",
        answer:
          "Yes—sun avoidance and sunscreen are important before and after treatment.",
      },
      {
        question: "Is IPL right for every skin tone?",
        answer:
          "Candidacy depends on skin tone and history. A consult is required to confirm the safest option.",
      },
    ],
  },
  {
    slug: "laser-hair-removal",
    name: "Laser Hair Removal",
    category: "Aesthetics",
    short: "Reduce unwanted hair with a series-based laser approach.",
    heroTitle: "Laser Hair Removal in Oswego, IL",
    heroSubtitle:
      "A modern, series-based plan designed for smoother skin and reduced regrowth.",
    faqs: [
      {
        question: "How many sessions do I need?",
        answer:
          "Hair grows in cycles; most people need multiple sessions for best reduction.",
      },
      {
        question: "Is it painful?",
        answer:
          "Sensation varies. Many describe it as a quick snap. We’ll review comfort strategies.",
      },
      {
        question: "Can I do it on all skin tones?",
        answer:
          "Candidacy depends on skin tone, hair color, and device settings. We’ll evaluate during consult.",
      },
    ],
  },
  {
    slug: "kybella",
    name: "Kybella",
    category: "Aesthetics",
    short: "Non-surgical support for submental fullness (double chin).",
    heroTitle: "Kybella in Oswego, IL",
    heroSubtitle:
      "A clinician-guided approach to treat submental fullness with an individualized plan.",
    faqs: [
      {
        question: "How many treatments are needed?",
        answer:
          "Some clients need multiple sessions. Exact number depends on goals and anatomy.",
      },
      {
        question: "Is there downtime?",
        answer:
          "Swelling is common after treatment and can last days to weeks. We’ll review what to expect.",
      },
      {
        question: "Who is a candidate?",
        answer:
          "Candidacy depends on anatomy and goals. A consultation is required.",
      },
    ],
  },
  {
    slug: "salmon-dna-glass-facial",
    name: "Salmon DNA Glass Facial",
    category: "Aesthetics",
    short: "A glow-forward facial concept designed for a ‘glass skin’ look.",
    heroTitle: "Salmon DNA Glass Facial in Oswego, IL",
    heroSubtitle:
      "Premium skincare-focused glow support with a luxury experience.",
    faqs: [
      {
        question: "Is this right for sensitive skin?",
        answer:
          "Candidacy varies. We’ll review your skin history and goals to recommend the safest option.",
      },
      {
        question: "Is there downtime?",
        answer:
          "Typically minimal, though sensitivity can vary by individual and protocol.",
      },
      {
        question: "How often should I do it?",
        answer:
          "Frequency depends on goals and response. We’ll recommend a schedule during consult.",
      },
    ],
  },
  {
    slug: "alle-botox-rewards",
    name: "Allē Botox Rewards",
    category: "Programs",
    short: "Learn about Allē rewards and how to use them at your visit.",
    heroTitle: "Allē Botox Rewards in Oswego, IL",
    heroSubtitle:
      "A simple overview of rewards, eligibility, and how to apply benefits.",
    faqs: [
      {
        question: "Do you guarantee rewards coverage?",
        answer:
          "No—rewards are managed by the program provider. We can help explain typical steps and what to bring.",
      },
      {
        question: "How do I prepare?",
        answer:
          "Bring your account details/app and ask us any questions during check-in or consult.",
      },
      {
        question: "Can you enroll me?",
        answer:
          "Enrollment is typically completed by the patient through the program. We can guide you on where to start.",
      },
    ],
  },
  {
    slug: "ez-prf-gel",
    name: "EZ PRF Gel",
    category: "Regenerative",
    short:
      "Regenerative aesthetics support using your body’s own growth factors in a gel format.",
    heroTitle: "EZ PRF Gel in Oswego, IL",
    heroSubtitle:
      "A clinician-guided regenerative option designed for natural-looking rejuvenation.",
    faqs: [
      {
        question: "Is EZ PRF Gel the same as filler?",
        answer:
          "It’s different—PRF is derived from your own blood components. Your provider will explain how it’s used and what to expect.",
      },
      {
        question: "How many sessions are needed?",
        answer:
          "Protocols vary. Many people benefit from a series; we’ll recommend a plan during consult.",
      },
      {
        question: "Is there downtime?",
        answer:
          "Some swelling or bruising is possible. Downtime varies by area and treatment plan.",
      },
    ],
  },
  {
    slug: "prp",
    name: "PRP",
    category: "Regenerative",
    short: "Platelet-rich plasma treatments for targeted regenerative support.",
    heroTitle: "PRP in Oswego, IL",
    heroSubtitle:
      "Harness your body’s own growth factors for skin, hair, or targeted areas.",
    faqs: [
      {
        question: "What areas can PRP treat?",
        answer:
          "Common uses include skin rejuvenation and other targeted protocols depending on your goals and eligibility.",
      },
      {
        question: "How long until results show?",
        answer:
          "Regenerative treatments can take time; improvement is often gradual over weeks to months.",
      },
      {
        question: "Is PRP safe?",
        answer:
          "It uses your own blood-derived components and is generally well-tolerated. We’ll review contraindications and risks.",
      },
    ],
  },
  {
    slug: "prp-facial",
    name: "PRP Facial",
    category: "Regenerative",
    short: "Skin revitalization using PRP to support tone, texture, and glow.",
    heroTitle: "PRP Facial in Oswego, IL",
    heroSubtitle:
      "A regenerative facial approach designed to support brighter, healthier-looking skin.",
    faqs: [
      {
        question: "What’s the downtime?",
        answer:
          "Mild redness is common. Downtime varies depending on the technique used and your skin sensitivity.",
      },
      {
        question: "How many treatments are recommended?",
        answer:
          "Many people do a series for best results, then maintenance. We’ll tailor a plan to your goals.",
      },
      {
        question: "Can PRP be combined with other treatments?",
        answer:
          "Often yes, depending on your plan. We’ll advise on timing and sequencing.",
      },
    ],
  },
  {
    slug: "prp-joint-injections",
    name: "PRP Joint Injections",
    category: "Regenerative",
    short: "PRP-based regenerative support for targeted joint-focused protocols.",
    heroTitle: "PRP Joint Injections in Oswego, IL",
    heroSubtitle:
      "Clinician-led evaluation and education for regenerative joint support options.",
    faqs: [
      {
        question: "Is PRP a medical treatment?",
        answer:
          "Yes—PRP protocols involve medical evaluation. An in-person consult is required to determine appropriateness.",
      },
      {
        question: "Will this diagnose my condition?",
        answer:
          "No—this page is educational. Diagnosis requires clinician evaluation and appropriate workup.",
      },
      {
        question: "What’s the first step?",
        answer:
          "Book a consultation to discuss symptoms, history, and whether PRP is appropriate.",
      },
    ],
  },
  {
    slug: "lash-spa",
    name: "Lash Spa",
    category: "Aesthetics",
    short: "Lash extensions, fills, perm, and tint for lush, defined lashes.",
    heroTitle: "Lash Spa in Oswego, IL",
    heroSubtitle:
      "Full set, fill, lash perm and tint, and mini fill—premium lash services for every look.",
    faqs: [
      {
        question: "How long does a full set last?",
        answer:
          "With proper care, a full set typically lasts 2–3 weeks before a fill is recommended. Results vary based on your natural lash cycle and aftercare.",
      },
      {
        question: "What’s the difference between a fill and a mini fill?",
        answer:
          "A fill replenishes lashes grown out since your last appointment (typically 2–3 weeks). A mini fill is a lighter touch-up for minor gaps between full fills.",
      },
      {
        question: "Does lash perm and tint damage my lashes?",
        answer:
          "When done correctly by our trained specialists, lash perm and tint enhance your natural lashes without damage. We use quality products and gentle techniques.",
      },
    ],
  },
  {
    slug: "prf-prp",
    name: "PRF / PRP",
    category: "Regenerative",
    short:
      "Harness your body’s own growth factors for skin and hair rejuvenation.",
    heroTitle: "PRF/PRP Treatments in Oswego, IL",
    heroSubtitle:
      "Regenerative aesthetics for brighter skin, improved texture, and targeted areas.",
    faqs: [
      {
        question: "What’s the difference between PRP and PRF?",
        answer:
          "Both use your own blood components; PRF is often processed differently and may release growth factors over a longer period.",
      },
      {
        question: "How many sessions will I need?",
        answer:
          "Many protocols recommend a series for best outcomes. We’ll create a plan based on your goals.",
      },
      {
        question: "Is it safe?",
        answer:
          "Because it uses your own blood-derived components, it’s generally well-tolerated. We’ll review risks and contraindications.",
      },
    ],
  },
] as const;

export function pageMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = new URL(path, SITE.url).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${title} | ${SITE.name}`,
      description,
      siteName: SITE.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
    },
  };
}

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    alternateName: "Hello Gorgeous Medspa",
    url: SITE.url,
    description: SITE.description,
    telephone: SITE.phone,
    email: SITE.email,
    image: {
      "@type": "ImageObject",
      url: `${SITE.url}/images/logo-full.png`,
      width: 600,
      height: 600,
    },
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/images/logo-full.png`,
      width: 600,
      height: 600,
    },
    priceRange: SITE.priceRange,
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card, Cherry Financing",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    areaServed: [
      { "@type": "City", name: "Oswego", containedInPlace: { "@type": "State", name: "Illinois" } },
      { "@type": "City", name: "Naperville", containedInPlace: { "@type": "State", name: "Illinois" } },
      { "@type": "City", name: "Aurora", containedInPlace: { "@type": "State", name: "Illinois" } },
      { "@type": "City", name: "Plainfield", containedInPlace: { "@type": "State", name: "Illinois" } },
      { "@type": "City", name: "Yorkville", containedInPlace: { "@type": "State", name: "Illinois" } },
    ],
    hasMap: "https://www.google.com/maps/place/74+W+Washington+St,+Oswego,+IL+60543",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    sameAs: [
      SITE.googleBusinessUrl,
      SITE.social.facebook,
      SITE.social.instagram,
      SITE.social.tiktok,
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE.reviewRating,
      reviewCount: SITE.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
          worstRating: "1",
        },
        author: {
          "@type": "Person",
          name: "Sarah M.",
        },
        reviewBody: "Best Botox experience! Danielle is amazing and made me feel so comfortable. Natural results that everyone compliments.",
        datePublished: "2025-01-15",
      },
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
          worstRating: "1",
        },
        author: {
          "@type": "Person",
          name: "Jennifer K.",
        },
        reviewBody: "The weight loss program changed my life. Down 30 lbs and feeling incredible. The team is so supportive!",
        datePublished: "2025-02-01",
      },
    ],
    medicalSpecialty: "Dermatology",
  };
}

export function mainLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/#localbusiness`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    telephone: SITE.phone,
    email: SITE.email,
    image: `${SITE.url}/images/logo-full.png`,
    priceRange: SITE.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE.reviewRating,
      reviewCount: SITE.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
  };
}

// Enhanced Organization Schema
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#org`,
    name: SITE.name,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/images/logo-full.png`,
      width: 600,
      height: 600,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "English",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: "US",
    },
    sameAs: [
      SITE.googleBusinessUrl,
      SITE.social.facebook,
      SITE.social.instagram,
      SITE.social.tiktok,
    ],
  };
}

export function providerPersonJsonLd(provider: {
  name: string;
  credentials?: string | null;
  description?: string | null;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["Person", "MedicalBusiness"],
    name: provider.name,
    description: provider.description,
    jobTitle: provider.credentials,
    image: provider.image,
    worksFor: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      url: SITE.url,
    },
  };
}

export function providerVideoJsonLd(providerName: string, videos: Array<{ title: string; description?: string | null; video_url?: string | null; thumbnail_url?: string | null }>) {
  return videos
    .filter((video) => video.video_url)
    .map((video) => ({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnail_url,
      uploadDate: new Date().toISOString(),
      contentUrl: video.video_url,
      creator: providerName,
    }));
}

export function providerBeforeAfterJsonLd(
  providerName: string,
  results: Array<{ title: string; before_image_url?: string | null; after_image_url?: string | null; service_tag?: string | null }>
) {
  return results
    .filter((result) => result.before_image_url && result.after_image_url)
    .map((result) => ({
      "@context": "https://schema.org",
      "@type": "MedicalEntity",
      name: result.title,
      provider: providerName,
      procedureType: result.service_tag,
      isBasedOn: [
        {
          "@type": "ImageObject",
          name: `${result.title} - Before`,
          contentUrl: result.before_image_url,
        },
        {
          "@type": "ImageObject",
          name: `${result.title} - After`,
          contentUrl: result.after_image_url,
        },
      ],
    }));
}

// WebSite + SearchAction for sitelinks search box (Google)
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/services?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// Service Schema for individual services (generic)
export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.name,
    description: service.short,
    url: `${SITE.url}/services/${service.slug}`,
    provider: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      address: {
        "@type": "PostalAddress",
        ...SITE.address,
      },
    },
    areaServed: SITE.serviceAreas.map((name) => ({ "@type": "City", name })),
  };
}

/** Service schema for location/treatment pages - includes areaServed + availableChannel per ticket */
export function serviceLocationJsonLd(serviceName: string, cityLabel: string) {
  const cityShort = cityLabel.replace(", IL", "").trim();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    provider: {
      "@type": "MedicalBusiness",
      name: SITE.name,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${cityShort} IL`,
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceLocation: {
        "@type": "Place",
        name: SITE.name,
        address: {
          "@type": "PostalAddress",
          addressLocality: cityShort,
          addressRegion: "IL",
        },
      },
    },
  };
}

/** Event schema - future-proof for special events. Toggle via admin CMS. */
export function eventJsonLd(event: {
  name: string;
  startDate: string;
  endDate?: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.startDate,
    ...(event.endDate && { endDate: event.endDate }),
    ...(event.description && { description: event.description }),
    location: {
      "@type": "Place",
      name: SITE.name,
      address: {
        "@type": "PostalAddress",
        ...SITE.address,
      },
    },
  };
}

// Breadcrumb Schema
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Product Schema for Shop
export function productJsonLd(product: {
  name: string;
  description: string;
  price: string;
  image: string;
  brand: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      price: product.price.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: SITE.name,
      },
    },
  };
}

// Local Business Schema for location pages
export function localBusinessJsonLd(city: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: `${SITE.name} - Serving ${city}`,
    url: `${SITE.url}/${city.toLowerCase().replace(/[, ]+/g, "-")}`,
    description: `Hello Gorgeous Med Spa provides Botox, fillers, weight loss, and hormone therapy services to ${city} residents.`,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      ...SITE.address,
    },
    areaServed: {
      "@type": "City",
      name: city,
    },
  };
}

export function faqJsonLd(faqs: ReadonlyArray<FAQ>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Service schema with booking action — helps Google show "Book" in search/local results */
export function bookingServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE.url}/#booking`,
    name: "Consultation & Appointment Booking",
    description: "Book a free consultation or appointment for Botox, fillers, weight loss, hormone therapy, and more at Hello Gorgeous Med Spa in Oswego, IL.",
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: SITE.serviceAreas.map((area) => ({ "@type": "Place", name: area })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Med Spa Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Botox & Injectables" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Weight Loss & GLP-1" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hormone Therapy" } },
      ],
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: { "@type": "EntryPoint", url: `${SITE.url}/book` },
      result: { "@type": "Reservation", name: "Appointment at Hello Gorgeous Med Spa" },
    },
  };
}

/** Review schema for testimonials displayed on page. Only inject when testimonials exist. */
export function testimonialsJsonLd(
  testimonials: Array<{ name: string; rating: number; text: string }>
) {
  return testimonials.map((t) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: t.name },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(t.rating),
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: t.text,
  }));
}

// ============================================
// IMAGE SEO SCHEMAS
// ============================================

export type ServiceImage = {
  src: string;
  alt: string;
  title: string;
  service?: string;
  category?: "injectables" | "wellness" | "aesthetics" | "rx" | "regenerative";
};

/** ImageObject schema for individual images - helps Google Images understand and rank your images */
export function imageObjectJsonLd(image: ServiceImage) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: `${SITE.url}${image.src}`,
    url: `${SITE.url}${image.src}`,
    name: image.title,
    description: image.alt,
    caption: image.alt,
    creditText: SITE.name,
    creator: {
      "@type": "Organization",
      name: SITE.name,
    },
    copyrightHolder: {
      "@type": "Organization",
      name: SITE.name,
    },
    acquireLicensePage: `${SITE.url}/contact`,
    license: `${SITE.url}/terms`,
  };
}

/** ImageGallery schema for collections of service images */
export function imageGalleryJsonLd(images: ServiceImage[], galleryName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: galleryName,
    description: `${galleryName} at ${SITE.name} - Professional medical aesthetics in Oswego, IL`,
    provider: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      "@id": `${SITE.url}/#organization`,
    },
    image: images.map((img) => ({
      "@type": "ImageObject",
      contentUrl: `${SITE.url}${img.src}`,
      name: img.title,
      description: img.alt,
    })),
  };
}

/** Before/After image pair schema for treatment results */
export function beforeAfterImageJsonLd(
  beforeSrc: string,
  afterSrc: string,
  treatment: string,
  caption?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalEntity",
    name: `${treatment} Before and After Results`,
    description: caption || `${treatment} results at ${SITE.name}`,
    image: [
      {
        "@type": "ImageObject",
        name: `${treatment} - Before Treatment`,
        contentUrl: `${SITE.url}${beforeSrc}`,
      },
      {
        "@type": "ImageObject",
        name: `${treatment} - After Treatment`,
        contentUrl: `${SITE.url}${afterSrc}`,
      },
    ],
    provider: {
      "@type": "MedicalBusiness",
      name: SITE.name,
    },
  };
}

/** WebPage schema with image for key landing pages */
export function webPageJsonLd(page: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE.url}${page.path}#webpage`,
    url: `${SITE.url}${page.path}`,
    name: page.title,
    description: page.description,
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: { "@id": `${SITE.url}/#organization` },
    ...(page.image && {
      primaryImageOfPage: {
        "@type": "ImageObject",
        contentUrl: `${SITE.url}${page.image}`,
      },
    }),
    ...(page.datePublished && { datePublished: page.datePublished }),
    ...(page.dateModified && { dateModified: page.dateModified }),
    inLanguage: "en-US",
    potentialAction: {
      "@type": "ReadAction",
      target: `${SITE.url}${page.path}`,
    },
  };
}

// ============================================
// SERVICE IMAGE CATALOG (for sitemap & schema)
// ============================================

export const SERVICE_IMAGES: ServiceImage[] = [
  // Injectables
  { src: "/images/services/hg-botox-syringes.png", alt: "Botox syringes and vials at Hello Gorgeous Med Spa Oswego IL", title: "Botox Treatment", service: "Botox", category: "injectables" },
  { src: "/images/services/hg-botox-vials.png", alt: "Medical-grade Botox vials for wrinkle treatment at Hello Gorgeous Med Spa", title: "Botox Vials", service: "Botox", category: "injectables" },
  { src: "/images/services/hg-botox-flatlay.png", alt: "Botox treatment flatlay with branded Hello Gorgeous aesthetic supplies", title: "Botox Flatlay", service: "Botox", category: "injectables" },
  { src: "/images/services/hg-lip-hero.png", alt: "Natural-looking lip filler results with Botox lip flip at Hello Gorgeous Med Spa", title: "Lip Enhancement Hero", service: "Lip Filler", category: "injectables" },
  { src: "/images/services/hg-lips-filler.png", alt: "Dermal filler lip enhancement treatment at Hello Gorgeous Med Spa Oswego", title: "Lip Filler Treatment", service: "Lip Filler", category: "injectables" },
  { src: "/images/services/hg-perfect-lips.png", alt: "Perfect natural lip enhancement results at Hello Gorgeous Med Spa", title: "Perfect Lips", service: "Lip Filler", category: "injectables" },
  { src: "/images/services/hg-dermal-fillers.png", alt: "Dermal filler syringes for facial volume restoration at Hello Gorgeous Med Spa", title: "Dermal Fillers", service: "Dermal Fillers", category: "injectables" },
  { src: "/images/services/hg-lip-filler.png", alt: "Lip filler injection treatment at Hello Gorgeous Med Spa Oswego IL", title: "Lip Filler Injection", service: "Lip Filler", category: "injectables" },
  
  // Weight Loss & RX
  { src: "/images/services/hg-weight-loss.png", alt: "Medical weight loss treatment with GLP-1 at Hello Gorgeous Med Spa", title: "Medical Weight Loss", service: "Weight Loss", category: "rx" },
  { src: "/images/services/hg-semaglutide-pen.png", alt: "Semaglutide injection pen for weight loss at Hello Gorgeous Med Spa Oswego", title: "Semaglutide Pen", service: "Semaglutide", category: "rx" },
  { src: "/images/services/hg-glp1-weight-loss-rx.png", alt: "GLP-1 weight loss prescription therapy at Hello Gorgeous Med Spa", title: "GLP-1 Weight Loss RX", service: "Weight Loss", category: "rx" },
  { src: "/images/services/hg-hormone-rx-collection.png", alt: "Hormone replacement therapy prescriptions at Hello Gorgeous Med Spa", title: "Hormone RX Collection", service: "Hormone Therapy", category: "rx" },
  { src: "/images/services/hg-peptides-rx.png", alt: "Peptide therapy BPC-157 Sermorelin at Hello Gorgeous Med Spa Oswego", title: "Peptides RX", service: "Peptide Therapy", category: "rx" },
  { src: "/images/services/hg-sexual-wellness-rx.png", alt: "Sexual wellness prescriptions for men and women at Hello Gorgeous Med Spa", title: "Sexual Wellness RX", service: "Sexual Wellness", category: "rx" },
  { src: "/images/services/hg-prescription-skincare.png", alt: "Prescription-grade skincare tretinoin hydroquinone at Hello Gorgeous Med Spa", title: "Prescription Skincare", service: "RX Skincare", category: "rx" },
  { src: "/images/services/hg-full-rx-authority.png", alt: "Full prescriptive authority Ryan Kent FNP-BC at Hello Gorgeous Med Spa", title: "Full RX Authority", service: "Telehealth", category: "rx" },
  
  // Aesthetics & Skin
  { src: "/images/services/hg-microneedling.png", alt: "RF Microneedling treatment for skin rejuvenation at Hello Gorgeous Med Spa", title: "Microneedling", service: "Microneedling", category: "aesthetics" },
  { src: "/images/services/hg-microneedling-device.png", alt: "Professional microneedling device at Hello Gorgeous Med Spa Oswego", title: "Microneedling Device", service: "Microneedling", category: "aesthetics" },
  { src: "/images/services/hg-chemical-peel.png", alt: "Chemical peel treatment for glowing skin at Hello Gorgeous Med Spa", title: "Chemical Peel", service: "Chemical Peel", category: "aesthetics" },
  { src: "/images/services/hg-hydrafacial.png", alt: "HydraFacial treatment for deep cleansing at Hello Gorgeous Med Spa", title: "HydraFacial", service: "HydraFacial", category: "aesthetics" },
  { src: "/images/services/hg-hydrafacial-serums.png", alt: "HydraFacial serums and boosters at Hello Gorgeous Med Spa Oswego", title: "HydraFacial Serums", service: "HydraFacial", category: "aesthetics" },
  { src: "/images/services/hg-laser-device.png", alt: "Laser treatment device for hair removal and skin at Hello Gorgeous Med Spa", title: "Laser Device", service: "Laser Hair Removal", category: "aesthetics" },
  { src: "/images/services/hg-skincare-collection.png", alt: "Medical-grade skincare collection at Hello Gorgeous Med Spa Oswego", title: "Skincare Collection", service: "Skincare", category: "aesthetics" },
  
  // Regenerative
  { src: "/images/services/hg-prp-prf.png", alt: "PRP PRF regenerative treatment at Hello Gorgeous Med Spa Oswego IL", title: "PRP PRF Treatment", service: "PRP/PRF", category: "regenerative" },
  { src: "/images/services/hg-prp-gold-tubes.png", alt: "PRP gold tubes for platelet-rich plasma therapy at Hello Gorgeous Med Spa", title: "PRP Gold Tubes", service: "PRP", category: "regenerative" },
  { src: "/images/services/hg-biote-pellets.png", alt: "BioTE hormone pellet therapy at Hello Gorgeous Med Spa Oswego", title: "BioTE Pellets", service: "Hormone Therapy", category: "wellness" },
  { src: "/images/services/hg-iv-drip-vitamins.png", alt: "IV vitamin drip therapy for wellness at Hello Gorgeous Med Spa", title: "IV Vitamin Drip", service: "IV Therapy", category: "wellness" },
  
  // Brand & Experience
  { src: "/images/services/hg-consultation-setup.png", alt: "Consultation experience at Hello Gorgeous Med Spa Oswego IL", title: "Consultation Setup", category: "aesthetics" },
  { src: "/images/services/hg-vip-membership-card.png", alt: "VIP membership card for Hello Gorgeous Med Spa exclusive benefits", title: "VIP Membership", category: "aesthetics" },
  { src: "/images/services/hg-gift-card-box.png", alt: "Gift card box for Hello Gorgeous Med Spa treatments", title: "Gift Card", category: "aesthetics" },
];

/** Get images by category for targeted schema injection */
export function getImagesByCategory(category: ServiceImage["category"]) {
  return SERVICE_IMAGES.filter((img) => img.category === category);
}

/** Get images by service name for service page schema */
export function getImagesByService(service: string) {
  return SERVICE_IMAGES.filter(
    (img) => img.service?.toLowerCase() === service.toLowerCase()
  );
}

// ============================================
// AI & VOICE SEARCH OPTIMIZATION
// ============================================

/**
 * SpeakableSpecification schema - helps voice assistants (Alexa, Google Assistant, Siri)
 * read the most relevant content from your page aloud to users
 */
export function speakableJsonLd(page: {
  path: string;
  headline: string;
  speakableText: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE.url}${page.path}#speakable`,
    url: `${SITE.url}${page.path}`,
    name: page.headline,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".speakable-headline", ".speakable-summary"],
    },
    mainEntity: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.city,
        addressRegion: SITE.address.state,
        postalCode: SITE.address.zip,
        addressCountry: "US",
      },
      telephone: SITE.phone,
    },
  };
}

/**
 * Organization schema with comprehensive knowledge graph data
 * Optimized for AI engines like ChatGPT, Perplexity, Google Gemini
 */
export function aiOptimizedOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    alternateName: ["Hello Gorgeous Med Spa", "Hello Gorgeous Oswego", "HG Med Spa"],
    url: SITE.url,
    logo: `${SITE.url}/images/hello-gorgeous-logo.png`,
    image: `${SITE.url}/images/hello-gorgeous-logo.png`,
    description: "Hello Gorgeous Med Spa is a premier medical spa in Oswego, IL offering Botox ($10/unit), dermal fillers, Semaglutide and Tirzepatide weight loss, BioTE hormone therapy, Morpheus8, Quantum RF skin tightening, Solaria CO2 laser, IV therapy, and more. Led by Danielle Alcala and Ryan Kent, FNP-BC.",
    foundingDate: "2022",
    founder: {
      "@type": "Person",
      name: "Danielle Alcala",
      jobTitle: "Owner & Lead Injector",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.6828,
      longitude: -88.3511,
    },
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "$$",
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
    ],
    areaServed: SITE.serviceAreas.map((area) => ({ "@type": "City", name: area })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Med Spa Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Botox", description: "Wrinkle-relaxing injections starting at $10/unit" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dysport", description: "Alternative neuromodulator to Botox" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dermal Fillers", description: "Juvederm, Restylane, RHA for lips, cheeks, and facial contouring" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Lip Filler", description: "Natural lip enhancement with hyaluronic acid fillers" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Semaglutide Weight Loss", description: "GLP-1 medication for medical weight loss, similar to Ozempic/Wegovy" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Tirzepatide Weight Loss", description: "Dual GLP-1/GIP medication for weight loss, similar to Mounjaro/Zepbound" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "BioTE Hormone Therapy", description: "Bioidentical hormone pellet therapy for men and women" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Morpheus8", description: "RF microneedling for skin tightening and collagen stimulation" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Quantum RF", description: "Subdermal radiofrequency for surgical-like skin tightening without surgery" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Solaria CO2 Laser", description: "Fractional CO2 laser for skin resurfacing, wrinkles, and acne scars" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "IV Therapy", description: "Vitamin infusions for energy, immunity, and wellness" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "PRF Hair Restoration", description: "Platelet-rich fibrin treatment for hair growth" } },
      ],
    },
    sameAs: [
      SITE.social.instagram,
      SITE.social.facebook,
      SITE.social.tiktok,
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "47",
      bestRating: "5",
      worstRating: "1",
    },
    knowsAbout: [
      "Botox injections",
      "Dermal fillers",
      "Lip augmentation",
      "Medical weight loss",
      "Semaglutide",
      "Tirzepatide",
      "GLP-1 medications",
      "Hormone replacement therapy",
      "BioTE pellets",
      "RF microneedling",
      "Morpheus8",
      "Quantum RF skin tightening",
      "CO2 laser resurfacing",
      "IV vitamin therapy",
      "Aesthetic medicine",
      "Medical aesthetics",
      "Anti-aging treatments",
      "Facial rejuvenation",
    ],
  };
}