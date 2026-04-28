/**
 * Dedicated FAQ page copy — aligns with ai_concierge_knowledge bulk inserts.
 * @see `/faq`
 */
import type { FAQ } from "@/lib/seo";

export type FAQPageSection = {
  slug: string;
  title: string;
  summary?: string;
  items: FAQ[];
};

/** Flatten all Q&As for FAQPage structured data */
export function flattenFaqPageItems(sections: readonly FAQPageSection[]): FAQ[] {
  return sections.flatMap((s) => s.items);
}

export const MED_SPA_FAQ_SECTIONS: readonly FAQPageSection[] = [
  {
    slug: "business-information",
    title: "Business information",
    summary: "Phone, booking, consultations, and who we serve in Oswego and the western suburbs.",
    items: [
      {
        question: "What's your phone number?",
        answer:
          "Our main number is 630-636-6193. That's the best way to reach us!",
      },
      {
        question: "Do you serve areas besides Oswego?",
        answer:
          "Absolutely! While we're based in Oswego, we serve clients from Naperville, Aurora, Plainfield, and all across Kendall County. We're very accessible from the western Chicago suburbs.",
      },
      {
        question: "Do you have same-day appointments?",
        answer:
          "Yes! When our schedule allows, we often have same-day and next-day availability. Let me connect you with Dani to see what's available today!",
      },
      {
        question: "How do I book an appointment?",
        answer:
          "I can collect your information right now and Dani will text you within 10 minutes to confirm your appointment time. Or you can book online at hellogorgeousmedspa.com.",
      },
      {
        question: "Do I need a consultation first?",
        answer:
          "For most services, yes! Ryan Kent, our medical director, or Dani will meet with you first to make sure the treatment is right for you and create a customized plan. Consultations are free and there's no pressure.",
      },
    ],
  },
  {
    slug: "morpheus8-burst",
    title: "Morpheus8 Burst",
    items: [
      {
        question: "What areas can you treat with Morpheus8?",
        answer:
          "We offer Morpheus8 Burst for face, neck, and body! For the face and neck, it's incredible for tightening and anti-aging. For the body, we can treat areas like the abdomen, thighs, and arms — anywhere you want tighter skin or improved texture.",
      },
      {
        question: "Does Morpheus8 hurt?",
        answer:
          "Most clients say it's very tolerable! We use numbing cream before the treatment, so you'll feel pressure and some warmth, but it shouldn't be painful. Everyone's different, but our team makes sure you're comfortable throughout.",
      },
      {
        question: "How long until I see results from Morpheus8?",
        answer:
          "You'll start seeing improvements in about 2–3 weeks, but the real magic happens over 3–6 months as your collagen continues to rebuild. The results can last 1–2 years or more with proper skincare!",
      },
      {
        question: "How many Morpheus8 treatments do I need?",
        answer:
          "Most people see great results with 1–3 sessions spaced about 4–6 weeks apart. When Dani confirms your appointment, she'll talk through a customized treatment plan based on your specific goals.",
      },
      {
        question: "What's the downtime for Morpheus8?",
        answer:
          "You'll have some redness and swelling for 1–3 days — kind of like a moderate sunburn. Most people can go back to work the next day, but you'll want to avoid makeup for 24 hours and stay out of the sun.",
      },
    ],
  },
  {
    slug: "quantum-rf-solaria-co2",
    title: "Quantum RF & Solaria CO₂",
    items: [
      {
        question: "What is Quantum RF?",
        answer:
          "Quantum RF is our radiofrequency body contouring device! It uses RF energy to heat fat cells and tighten skin — without surgery, needles, or downtime. It's perfect for targeting stubborn areas like the abdomen, love handles, thighs, or arms.",
      },
      {
        question: "How does Quantum RF work?",
        answer:
          "The RF energy penetrates deep to heat fat cells, which causes them to shrink. At the same time, it stimulates collagen production in the skin, so you get both fat reduction AND skin tightening. Double benefit!",
      },
      {
        question: "Is Quantum RF the same as CoolSculpting?",
        answer:
          "No — they work differently! CoolSculpting freezes fat cells, while Quantum RF uses heat. Many people find Quantum RF more comfortable, and you get the added bonus of skin tightening, which CoolSculpting doesn't offer.",
      },
      {
        question: "What is Solaria CO₂?",
        answer:
          "Solaria is our fractional CO₂ laser — the gold standard for skin resurfacing! It treats sun damage, age spots, fine lines, acne scars, and uneven texture by removing damaged skin layers and triggering collagen renewal.",
      },
      {
        question: "Does CO₂ laser hurt?",
        answer:
          "We use numbing cream and most clients tolerate it very well. You'll feel some heat and tingling, but it's manageable. After the treatment, your skin will feel like a sunburn for a few days.",
      },
      {
        question: "What's the downtime for CO₂ laser?",
        answer:
          "Plan for about 5–7 days of healing. Your skin will be red, tight, and peeling during that time. It's more downtime than Morpheus8, but the results are dramatic! Dani will walk you through exactly what to expect.",
      },
      {
        question: "Can I combine Morpheus8, Quantum RF, and CO₂?",
        answer:
          "Yes! We actually have VIP packages that combine all three — we call it the InMode Trifecta. It gives you the ultimate skin tightening, resurfacing, and contouring results.",
      },
    ],
  },
  {
    slug: "injectables",
    title: "Injectables — Botox & fillers",
    items: [
      {
        question: "What's the difference between Botox, Dysport, and Jeuveau?",
        answer:
          "They're all neuromodulators — they work the same way by relaxing muscles that cause wrinkles. Botox is the most well-known, Dysport spreads a bit more (great for larger areas), and Jeuveau is newer and often a bit less expensive. They all last about 3–4 months.",
      },
      {
        question: "What areas can you treat with Botox?",
        answer:
          'The most common areas are the "elevens" between your eyebrows, forehead lines, and crow\'s feet around the eyes. We can also do lip flips, brow lifts, and even treat excessive sweating. Dani will assess your facial anatomy and recommend what works best.',
      },
      {
        question: "Does Botox hurt?",
        answer:
          "It's a very tiny needle and most people say it feels like a quick pinch — super fast! The whole appointment usually takes 10–15 minutes.",
      },
      {
        question: "How long does Botox last?",
        answer:
          "Typically 3–4 months. When you start to see movement coming back, that's your cue to schedule your next appointment!",
      },
      {
        question: "When will I see Botox results?",
        answer:
          "You'll start noticing results in about 3–5 days, with full results by 10–14 days. It's not instant, but it's worth the wait!",
      },
      {
        question: "Can I look frozen or overdone with Botox?",
        answer:
          "Not here! Dani's philosophy is natural enhancement — she wants you to look like a refreshed version of yourself, not frozen. She's very skilled at keeping your natural expressions while smoothing wrinkles.",
      },
      {
        question: "What are fillers?",
        answer:
          "Fillers are injectable gels (usually made of hyaluronic acid) that add volume, plump lips, fill in deep lines, and restore youthful contours. They're different from Botox — Botox relaxes muscles, fillers add volume.",
      },
      {
        question: "What areas can you treat with filler?",
        answer:
          "Lips, cheeks, under-eyes, nasolabial folds (lines from nose to mouth), marionette lines (from mouth to chin), and jawline for definition. We customize to your goals!",
      },
      {
        question: "How long do fillers last?",
        answer:
          "It depends on the type and area! Lip fillers typically last 6–12 months. Cheek and under-eye fillers can last 12–18 months or longer. Dani will explain which products last longest for your specific needs.",
      },
      {
        question: "Will my lips look fake or overdone?",
        answer:
          'Only if you want them to! Dani specializes in natural-looking results. She\'ll work with your natural lip shape and proportions. Many clients say "No one can tell I got filler — they just think I look great!"',
      },
      {
        question: "Can filler be dissolved if I don't like it?",
        answer:
          "Yes! Hyaluronic acid fillers can be dissolved with an enzyme if needed. That's one of the safety benefits of using high-quality HA fillers.",
      },
      {
        question: "Do you do Botox parties?",
        answer:
          "Yes! We love hosting Botox parties — they're so much fun! You can bring friends, get special pricing, and enjoy a relaxed atmosphere. Call us to schedule your party!",
      },
    ],
  },
  {
    slug: "weight-loss-wellness",
    title: "Weight loss & wellness",
    items: [
      {
        question: "Do you offer medical weight loss?",
        answer:
          "Yes! We offer GLP-1 medications like semaglutide and tirzepatide — the same medications you've probably heard about. These are prescription medications that help with appetite control and weight loss, supervised by Ryan Kent, our medical director.",
      },
      {
        question: "How does GLP-1 weight loss work?",
        answer:
          "GLP-1 medications work by mimicking a hormone your body naturally produces that helps regulate appetite and blood sugar. You feel fuller longer, eat less, and lose weight gradually and sustainably.",
      },
      {
        question: "What's included in your weight loss program?",
        answer:
          "You'll have an initial consultation with Ryan to make sure you're a good candidate. Then you'll get your medication (weekly injections you do at home), regular check-ins, and support throughout your journey. Some clients have lost 30+ pounds!",
      },
      {
        question: "Do I qualify for GLP-1 weight loss?",
        answer:
          "Ryan will determine that during your consultation! Generally, you need to have a BMI over a certain threshold or weight-related health conditions. If you qualify, it can be life-changing.",
      },
      {
        question: "Is GLP-1 safe?",
        answer:
          "Yes, when prescribed and monitored by a medical professional like Ryan! He'll review your full medical history, check for contraindications, and monitor you throughout the program.",
      },
      {
        question: "What is IV therapy?",
        answer:
          "IV therapy delivers vitamins, minerals, and hydration directly into your bloodstream for 100% absorption. We offer different formulas for energy, immune support, recovery, hydration, or beauty!",
      },
      {
        question: "How long does IV therapy take?",
        answer:
          "Usually 30–45 minutes. You'll relax in a comfortable chair while the IV drips — many clients use it as \"me time\" to catch up on their phone or just chill!",
      },
    ],
  },
  {
    slug: "hormone-therapy-peptides",
    title: "Hormone therapy & peptides",
    items: [
      {
        question: "What is BHRT?",
        answer:
          "BHRT is bioidentical hormone replacement therapy — it uses hormones that are chemically identical to what your body naturally produces to restore hormonal balance. It's used for menopause symptoms, low energy, mood changes, and overall wellness.",
      },
      {
        question: "What's Hello Gorgeous RX?",
        answer:
          "Hello Gorgeous RX is our prescription and wellness division! It's where we offer hormone therapy, medical weight loss, peptide therapy, and prescription dermatology. Ryan Kent oversees all medical programs.",
      },
      {
        question: "What symptoms does BHRT help with?",
        answer:
          "Common symptoms we treat include hot flashes, night sweats, low energy, brain fog, mood swings, weight gain, low libido, and sleep issues. Basically, all the things hormones affect as we age!",
      },
      {
        question: "Do you offer hormone therapy for men too?",
        answer:
          "Yes! We offer TRT (testosterone replacement therapy) for men. Low testosterone can cause fatigue, weight gain, low libido, and muscle loss. Ryan can evaluate if TRT is right for you.",
      },
      {
        question: "Can I do virtual consultations for hormone therapy?",
        answer:
          "Yes! We offer telehealth consultations for Hello Gorgeous RX programs. You can meet virtually with Ryan and get your prescriptions mailed directly to you (Illinois residents only).",
      },
      {
        question: "What is peptide therapy?",
        answer:
          "Peptides are chains of amino acids that signal your body to do specific things — like produce collagen, burn fat, improve sleep, or boost immunity. We offer medical-grade peptides prescribed by Ryan.",
      },
    ],
  },
  {
    slug: "additional-treatments",
    title: "Additional treatments",
    items: [
      {
        question: "What types of facials do you offer?",
        answer:
          "We offer customized facials tailored to your skin type and concerns — whether that's acne, anti-aging, hydration, or brightening. We also have specialty facials like PRP facials and hydrafacials.",
      },
      {
        question: "What's a PRP facial?",
        answer:
          "PRP stands for Platelet-Rich Plasma — we draw a small amount of your blood, spin it to concentrate your growth factors, and then apply it to your skin. It's incredibly rejuvenating and uses your body's natural healing power!",
      },
      {
        question: "Do you do laser hair removal?",
        answer:
          "Yes! We use medical-grade lasers for permanent hair reduction on any area — face, underarms, bikini, legs, back, you name it.",
      },
      {
        question: "How many laser hair removal sessions do I need?",
        answer:
          "Most people need 6–8 sessions spaced about 4–6 weeks apart for best results. Hair grows in cycles, so multiple treatments ensure you catch all the hair.",
      },
      {
        question: "What are trigger point injections?",
        answer:
          "These are injections directly into muscle knots to release tension and relieve pain. They're great for chronic muscle pain, tension headaches, or fibromyalgia. The relief is almost immediate!",
      },
    ],
  },
  {
    slug: "pricing-payment",
    title: "Pricing & payment",
    items: [
      {
        question: "Do you have package deals?",
        answer:
          "Yes! We offer VIP packages that combine multiple treatments for better value. For example, our InMode Trifecta package combines Morpheus8, Quantum RF, and CO₂ for comprehensive rejuvenation at a discounted rate.",
      },
      {
        question: "Are consultations free?",
        answer:
          "Yes! Your initial consultation with Ryan or Dani is complimentary. We want to make sure the treatment is right for you before you invest.",
      },
      {
        question: "What's CareCredit?",
        answer:
          "CareCredit is a healthcare credit card that offers interest-free financing for 6, 12, or 18 months depending on the amount. You can apply in minutes and use it for any of our services.",
      },
      {
        question: "What's Cherry financing?",
        answer:
          "Cherry is a financing option that lets you pay over time. You can apply in seconds right from your phone and get approved for monthly payments that fit your budget.",
      },
      {
        question: "Can I use HSA or FSA?",
        answer:
          "Some treatments may be HSA/FSA eligible if they're medically necessary (like trigger point injections or certain hormone treatments). Check with your plan administrator!",
      },
    ],
  },
  {
    slug: "policies",
    title: "Policies & restrictions",
    items: [
      {
        question: "What if I need to reschedule?",
        answer:
          "Just call or text us as soon as you know! As long as it's at least 24 hours before your appointment, we're happy to find a new time that works better for you.",
      },
      {
        question: "Can I get Botox or fillers if I'm pregnant or nursing?",
        answer:
          "Unfortunately no — we don't perform injectable treatments during pregnancy or while breastfeeding for safety reasons. We'd love to see you after!",
      },
      {
        question: "Are there age restrictions?",
        answer:
          "For injectables and most medical treatments, you must be 18+. For certain treatments like laser hair removal or facials, we may treat minors with parental consent.",
      },
    ],
  },
  {
    slug: "staff-credentials",
    title: "Staff & credentials",
    items: [
      {
        question: "Who is Ryan Kent?",
        answer:
          "Ryan Kent is our medical director and a board-certified Family Nurse Practitioner (FNP-BC) with full prescriptive authority in Illinois. He oversees all medical treatments and he's on-site 7 days a week!",
      },
      {
        question: 'What does "full prescriptive authority" mean?',
        answer:
          "It means Ryan can prescribe medications independently without needing a physician to oversee him. He's fully qualified to manage your medical weight loss, hormone therapy, and prescription treatments.",
      },
      {
        question: "Who is Danielle?",
        answer:
          "Danielle (Dani) is the founder and owner of Hello Gorgeous! She's a licensed esthetician, phlebotomist, and is currently in nursing school. She started this spa 10 years ago because of her own struggle with severe acne.",
      },
      {
        question: "Why did Dani start Hello Gorgeous?",
        answer:
          'Dani struggled with severe acne starting at age 12, and that personal journey led her to aesthetics — she wanted to help others the way she wished someone had helped her. Her aunt (who raised her) used to say "hello gorgeous" and that became the spa\'s name!',
      },
      {
        question: "How long has Hello Gorgeous been in business?",
        answer:
          "We've been serving Oswego and the surrounding communities for 10 years! Dani has invested over $500,000 in equipment and training to bring you the best technology available.",
      },
    ],
  },
  {
    slug: "about-hello-gorgeous",
    title: "What makes Hello Gorgeous different",
    items: [
      {
        question: "What makes Hello Gorgeous different from other med spas?",
        answer:
          "We're family-owned and operated — Dani is still here every day. We're not a corporate chain. Plus, we're the ONLY med spa in the Oswego/Naperville/Aurora area with all THREE InMode devices (Morpheus8 Burst, Quantum RF, and Solaria CO₂)!",
      },
      {
        question: "Do you have a medical director on-site?",
        answer:
          "Yes! Ryan Kent is on-site 7 days a week, which is rare for med spas. You have full medical oversight and safety for every treatment.",
      },
      {
        question: "Have you won any awards?",
        answer:
          "Yes! Hello Gorgeous has been voted #1 Best Med Spa in Oswego, Best Skincare Clinic, Best Medical Weight Loss, and Best Facial Treatments. We also have 4.9 stars on Google!",
      },
      {
        question: "Why does having all three InMode devices matter?",
        answer:
          "Because you can get comprehensive treatment all in one place! Tightening (Morpheus8), contouring (Quantum RF), and resurfacing (CO₂) work synergistically. We're the only spa in the area with all three!",
      },
    ],
  },
  {
    slug: "concerns",
    title: "Common concerns",
    items: [
      {
        question: "Is this safe?",
        answer:
          "Absolutely! All of our treatments are performed or overseen by licensed medical professionals. Ryan Kent, our medical director, is on-site 7 days a week. We use FDA-approved devices and products.",
      },
      {
        question: "I've heard horror stories about Botox and fillers...",
        answer:
          "We hear you! That's why technique and experience matter so much. Dani has been doing injectables for years and prioritizes natural results. We'll never over-inject or make you look \"done.\"",
      },
      {
        question: "I have a low pain tolerance.",
        answer:
          "We totally understand! Let Dani know during your consultation. We can adjust numbing cream timing, take breaks during treatment, and go at your pace. Your comfort matters to us.",
      },
      {
        question: "This seems expensive.",
        answer:
          "Quality aesthetic treatments are an investment! That's why we offer financing through CareCredit and Cherry so you can pay over time. We also have package deals that give you better value.",
      },
      {
        question: "Will you pressure me to buy more?",
        answer:
          "Never! Dani's approach is education and empowerment — she'll explain your options, recommend what she truly believes will work, and let YOU decide. We want clients who are excited and confident!",
      },
    ],
  },
  {
    slug: "results-expectations",
    title: "Results & expectations",
    items: [
      {
        question: "Is this a permanent solution?",
        answer:
          "Most aesthetic treatments require maintenance — that's just the reality of aging. However, treatments like Morpheus8 and CO₂ create long-lasting collagen remodeling. With proper skincare, you can extend your results significantly.",
      },
      {
        question: "Can I just do one treatment and see how I like it?",
        answer:
          "Absolutely! You're never pressured to commit to a full package upfront. Many clients start with one treatment, see how they like it, and then decide to continue.",
      },
    ],
  },
];
