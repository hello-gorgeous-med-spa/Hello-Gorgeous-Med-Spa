import { SITE } from "@/lib/seo";

export interface TreatmentCondition {
  label: string;
}

export interface TreatmentArea {
  area: string;
  description: string;
  icon: string;
}

export interface TreatmentFAQ {
  question: string;
  answer: string;
}

export interface TreatmentConfig {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  accentColor: string;
  conditions: TreatmentCondition[];
  areas: TreatmentArea[];
  faqs: TreatmentFAQ[];
  howItWorks: string[];
  benefits: string[];
  recovery: string[];
  vipPrice?: string;
  regularPrice?: string;
  vipLabel?: string;
  vipPackage?: string;
  technologyLabel?: string;
  technologyDescription?: string;
  technologyPoints?: string[];
}

export const treatments: Record<string, TreatmentConfig> = {
  morpheus8Burst: {
    slug: "morpheus8-burst-oswego-il",
    name: "Morpheus8 Burst",
    tagline: "The Deepest RF Microneedling Available",
    description:
      "Advanced RF microneedling technology designed to tighten skin, reduce wrinkles, and improve skin texture with deeper collagen remodeling than any other device on the market.",
    heroImage: "/treatments/morpheus8-burst.jpg",
    accentColor: "#E91E8C",
    technologyLabel: "Burst Technology",
    technologyDescription:
      "Unlike standard Morpheus8 which treats one depth at a time (up to 4mm), Burst delivers radiofrequency energy at THREE depths simultaneously — penetrating up to 8mm. This multi-level approach creates a more comprehensive collagen response throughout the tissue.",
    technologyPoints: [
      "3 simultaneous depths in a single pulse (standard = 1 depth)",
      "8mm penetration (standard = 4mm maximum)",
      "Multi-level collagen stimulation for dramatic tightening",
      "Fewer sessions needed vs. standard RF microneedling",
      "Precision-controlled energy delivery at each depth",
    ],
    conditions: [
      { label: "Loose and sagging skin" },
      { label: "Fine lines and wrinkles" },
      { label: "Acne scars" },
      { label: "Jowls and jawline laxity" },
      { label: "Neck laxity" },
      { label: "Crepey skin" },
      { label: "Enlarged pores" },
      { label: "Uneven skin texture" },
      { label: "Post-weight loss loose skin" },
    ],
    areas: [
      { area: "Face", description: "Full face tightening, wrinkle reduction, and pore refinement.", icon: "👩" },
      { area: "Jawline & Jowls", description: "Non-surgical jawline contouring and jowl tightening.", icon: "💎" },
      { area: "Neck", description: "Tighten loose neck skin and reduce horizontal lines.", icon: "🦢" },
      { area: "Abdomen", description: "Skin tightening after weight loss or pregnancy.", icon: "✨" },
      { area: "Arms", description: "Reduce crepey skin on upper arms.", icon: "💪" },
    ],
    howItWorks: [
      "A topical numbing cream is applied for 20–30 minutes",
      "The Morpheus8 Burst handpiece delivers RF energy at 3 depths simultaneously",
      "Micro-pins create controlled micro-injuries while RF heats deep tissue",
      "Your body responds by producing new collagen and elastin over 3–6 months",
    ],
    benefits: [
      "Deepest RF penetration available (8mm)",
      "Tightens skin without surgery",
      "Stimulates long-term collagen production",
      "Fewer sessions than standard treatments",
      "Minimal downtime (3–5 days)",
      "Safe for all skin types",
    ],
    recovery: [
      "Day 1–2: Redness and mild swelling",
      "Day 3–5: Micro-crusting and light peeling",
      "Day 7: Makeup-ready, visibly smoother skin",
      "Months 1–6: Continued tightening as collagen remodels",
    ],
    faqs: [
      {
        question: "What makes Morpheus8 Burst different from standard Morpheus8?",
        answer:
          "Standard Morpheus8 treats one depth at a time, up to 4mm. Burst delivers RF energy at three depths simultaneously, penetrating up to 8mm. This means double the depth, triple the coverage, and dramatically better results in fewer sessions.",
      },
      {
        question: "How many sessions do I need?",
        answer:
          "Most clients see significant improvement after 1–2 sessions. For optimal results, 2–3 sessions spaced 4–6 weeks apart are typically recommended. Your provider will create a customized plan during your consultation.",
      },
      {
        question: "Is Morpheus8 Burst painful?",
        answer:
          "A topical numbing cream is applied 20–30 minutes before treatment. Most clients describe the sensation as warmth with mild prickling. Comfort levels are very manageable.",
      },
      {
        question: "What is the downtime?",
        answer:
          "Expect 3–5 days of redness and mild swelling. Most clients return to normal activities within 3 days and can wear makeup by day 5–7. Results continue improving for 3–6 months.",
      },
      {
        question: "Can Morpheus8 Burst help with loose skin after weight loss?",
        answer:
          "Yes. Burst technology is particularly effective for post-weight loss skin tightening because it reaches deeper tissue layers. Combined with Solaria CO₂ and QuantumRF (our InMode Trifecta), it provides comprehensive skin restoration.",
      },
      {
        question: "Is Morpheus8 Burst safe for darker skin tones?",
        answer:
          "Yes. Unlike many laser treatments, RF microneedling is safe for all skin types (Fitzpatrick I–VI) because the energy is delivered beneath the skin surface.",
      },
    ],
    vipPrice: "$1,499",
    regularPrice: "$2,000",
    vipLabel: "Trifecta Launch Special",
    vipPackage: "Full Face + Neck Treatment",
  },

  quantumRF: {
    slug: "quantum-rf-oswego-il",
    name: "QuantumRF",
    tagline: "Surgical-Level Skin Tightening Without Surgery",
    description:
      "QuantumRF delivers powerful subdermal radiofrequency energy to tighten loose skin, contour the body, and stimulate collagen production — all without incisions, anesthesia, or extended downtime.",
    heroImage: "/treatments/quantumrf.jpg",
    accentColor: "#00BFFF",
    technologyLabel: "Subdermal RF Technology",
    technologyDescription:
      "QuantumRF works beneath the skin surface, delivering controlled radiofrequency energy to the subdermal layer. This internal approach creates tissue contraction and collagen stimulation that rivals surgical results — without a single incision.",
    technologyPoints: [
      "Subdermal energy delivery targets the deepest tissue layers",
      "Internal tissue contraction mimics surgical lifting",
      "No incisions, no general anesthesia required",
      "Real-time temperature monitoring ensures safety",
      "Stimulates new collagen for months after treatment",
    ],
    conditions: [
      { label: "Loose facial skin" },
      { label: "Sagging neck and jowls" },
      { label: "Post-weight loss loose skin" },
      { label: "Body contouring" },
      { label: "Arm laxity" },
      { label: "Abdominal skin looseness" },
      { label: "Thigh laxity" },
      { label: "Submental fullness (double chin)" },
    ],
    areas: [
      { area: "Face & Jawline", description: "Non-surgical facelift effect with subdermal tightening.", icon: "👩" },
      { area: "Neck & Submental", description: "Tighten neck skin and reduce double chin without surgery.", icon: "🦢" },
      { area: "Abdomen", description: "Contour and tighten abdominal skin after weight loss.", icon: "✨" },
      { area: "Arms", description: "Reduce sagging upper arm skin (bat wings).", icon: "💪" },
      { area: "Thighs", description: "Inner and outer thigh skin tightening.", icon: "🦵" },
    ],
    howItWorks: [
      "Local anesthesia is applied to the treatment area",
      "A small probe delivers RF energy beneath the skin surface",
      "Real-time temperature monitoring ensures precise, safe energy delivery",
      "Internal tissue contracts immediately while collagen remodeling continues for months",
    ],
    benefits: [
      "Surgical-level results without surgery",
      "No general anesthesia required",
      "Immediate tissue contraction",
      "Long-term collagen stimulation (3–6 months)",
      "Minimal scarring — tiny entry points only",
      "Quick recovery compared to surgical alternatives",
    ],
    recovery: [
      "Day 1–3: Mild swelling and tenderness",
      "Day 3–7: Compression garment recommended for body areas",
      "Week 2: Most normal activities resumed",
      "Months 1–6: Progressive tightening as collagen rebuilds",
    ],
    faqs: [
      {
        question: "What is QuantumRF?",
        answer:
          "QuantumRF is a subdermal radiofrequency device that delivers energy beneath the skin to tighten tissue, contour the body, and stimulate collagen — all without traditional surgery.",
      },
      {
        question: "How is QuantumRF different from external RF treatments?",
        answer:
          "External RF (like Thermage or Exilis) heats from the outside in, limiting how deep the energy can reach. QuantumRF works from the inside out, delivering energy directly to the subdermal layer for significantly more dramatic tightening.",
      },
      {
        question: "Is QuantumRF a replacement for a facelift?",
        answer:
          "For mild to moderate laxity, QuantumRF can deliver results comparable to early-stage surgical lifting. For severe laxity, it can significantly improve the area but may not fully replace surgery. Your provider will assess your candidacy during consultation.",
      },
      {
        question: "How many treatments do I need?",
        answer:
          "Most areas require only 1 treatment. Some patients opt for a second session 3–6 months later for additional tightening. Results continue improving for up to 6 months as collagen rebuilds.",
      },
      {
        question: "What is the downtime?",
        answer:
          "Expect 3–7 days of swelling and tenderness. Body areas may require a compression garment for 1–2 weeks. Most clients return to desk work within 2–3 days.",
      },
      {
        question: "Can QuantumRF help after GLP-1 weight loss?",
        answer:
          "Absolutely. QuantumRF is one of the best non-surgical options for tightening loose skin after significant weight loss from Semaglutide, Tirzepatide, or other GLP-1 medications. Combined with Morpheus8 Burst and Solaria (our InMode Trifecta), it provides comprehensive body contouring.",
      },
    ],
    vipPrice: "$2,495",
    regularPrice: "$3,500",
    vipLabel: "Trifecta Launch Special",
    vipPackage: "Face + Neck Subdermal Treatment",
  },
};
