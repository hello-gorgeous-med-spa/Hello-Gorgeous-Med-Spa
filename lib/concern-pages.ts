export type ConcernFaq = { question: string; answer: string };

export type ConcernPageData = {
  slug: string;
  title: string;
  concernOverview: string;
  treatmentApproaches: string[];
  optionsComparison: string;
  combinationRecommendations: string;
  localIntent: string;
  serviceLinks: { label: string; href: string }[];
  faqs: ConcernFaq[];
};

export const CONCERN_PAGES: ConcernPageData[] = [
  {
    slug: "turkey-neck",
    title: "Turkey Neck",
    concernOverview:
      "Turkey-neck concerns usually involve neck skin laxity, banding visibility, and reduced jaw-neck definition.",
    treatmentApproaches: [
      "RF microneedling for texture + mild tightening support",
      "Subdermal RF contouring for deeper neck/jawline contraction in selected candidates",
      "Staged plans with lower-face balancing when indicated",
    ],
    optionsComparison:
      "Mild-to-moderate neck laxity may respond to non-surgical options; advanced tissue excess may still require surgical consultation.",
    combinationRecommendations:
      "Combination planning often targets both neck tissue quality and jawline contour for balanced outcome.",
    localIntent:
      "Turkey-neck treatment consults in Oswego for patients near Naperville, Aurora, Plainfield, and Yorkville.",
    serviceLinks: [
      { label: "Quantum RF", href: "/services/quantum-rf" },
      { label: "Morpheus8", href: "/services/morpheus8" },
      { label: "Facelift vs Quantum RF", href: "/compare/quantum-rf-vs-facelift" },
    ],
    faqs: [
      { question: "Can turkey neck improve without surgery?", answer: "Some patients see meaningful improvement with non-surgical plans, but candidacy depends on severity." },
      { question: "How long to see neck changes?", answer: "Initial changes may appear in weeks, with continued remodeling over months." },
      { question: "Is downtime expected?", answer: "Yes, downtime varies by treatment depth and modality." },
    ],
  },
  {
    slug: "jowls",
    title: "Jowls",
    concernOverview:
      "Jowling usually reflects lower-face tissue descent, skin laxity, and contour blurring around the jawline.",
    treatmentApproaches: [
      "RF microneedling for texture + tightening support",
      "Subdermal RF contouring for structural contraction in selected candidates",
      "Injectable support when volume balance contributes to the look",
    ],
    optionsComparison:
      "Non-surgical options may improve mild-to-moderate jowling. Advanced tissue descent may still require surgical consultation.",
    combinationRecommendations:
      "Combination planning often pairs contour-focused devices with selective injectables for definition and balance.",
    localIntent:
      "Patients searching jowl treatment near Oswego, Naperville, Aurora, and Plainfield often start with a candidacy consult.",
    serviceLinks: [
      { label: "Morpheus8", href: "/services/morpheus8" },
      { label: "Quantum RF", href: "/services/quantum-rf" },
      { label: "Dermal Fillers", href: "/services/dermal-fillers" },
    ],
    faqs: [
      { question: "Can jowls be treated without surgery?", answer: "In many mild-to-moderate cases, non-surgical options may improve contour. Consultation determines fit." },
      { question: "How soon do results show?", answer: "Early change may appear in weeks, with fuller remodeling over months depending on treatment type." },
      { question: "Do combination plans work better?", answer: "They can, when anatomy requires both structural and surface-level support." },
    ],
  },
  {
    slug: "acne-scars",
    title: "Acne Scars",
    concernOverview:
      "Acne scarring can include textural depressions, uneven tone, and persistent skin roughness.",
    treatmentApproaches: [
      "RF microneedling for collagen stimulation",
      "CO2 resurfacing for higher-impact texture revision",
      "Staged protocols based on scar depth and healing tolerance",
    ],
    optionsComparison:
      "Lower-downtime options may require more sessions; higher-intensity resurfacing may produce stronger change with more recovery.",
    combinationRecommendations:
      "Combination protocols are often sequenced rather than stacked to balance efficacy and healing.",
    localIntent:
      "Acne-scar treatment support in Oswego for nearby Naperville, Aurora, Yorkville, and Montgomery patients.",
    serviceLinks: [
      { label: "Morpheus8", href: "/services/morpheus8" },
      { label: "Solaria CO2", href: "/services/solaria-co2" },
      { label: "Book Consultation", href: "/book" },
    ],
    faqs: [
      { question: "Can deep acne scars improve?", answer: "Many scars may improve, but degree varies by scar type, skin response, and treatment depth." },
      { question: "How many treatments are needed?", answer: "Plan length depends on scar severity and modality selected." },
      { question: "Is downtime required?", answer: "Some approaches have minimal downtime, while CO2 resurfacing requires planned recovery." },
    ],
  },
  {
    slug: "skin-tightening",
    title: "Skin Tightening",
    concernOverview:
      "Skin tightening concerns typically involve laxity in face, neck, or body zones after aging or weight changes.",
    treatmentApproaches: [
      "RF microneedling for texture + tightening support",
      "Subdermal RF for deeper contour tightening",
      "Resurfacing when skin quality is a major contributor",
    ],
    optionsComparison:
      "Treatment selection depends on whether the primary issue is surface texture, deeper laxity, or both.",
    combinationRecommendations:
      "Combination plans are common when patients need both contour correction and visible texture refinement.",
    localIntent:
      "Skin-tightening consults are available in Oswego for patients from Naperville, Aurora, Plainfield, and Yorkville.",
    serviceLinks: [
      { label: "Morpheus8", href: "/services/morpheus8" },
      { label: "Quantum RF", href: "/services/quantum-rf" },
      { label: "Solaria CO2", href: "/services/solaria-co2" },
    ],
    faqs: [
      { question: "What is best for loose skin?", answer: "Best treatment depends on laxity depth, skin quality, and downtime goals." },
      { question: "Do non-surgical options work?", answer: "They may help significantly in selected patients; severe excess skin may still require surgical evaluation." },
      { question: "How long do improvements last?", answer: "Maintenance and durability vary by treatment type and lifestyle factors." },
    ],
  },
  {
    slug: "weight-loss",
    title: "Weight Loss",
    concernOverview:
      "Weight-loss concerns include appetite regulation, body-composition progress, and long-term maintenance.",
    treatmentApproaches: [
      "Clinically supervised GLP-1 pathways",
      "Structured lifestyle + nutrition support",
      "Follow-up adjustments for tolerance and progress",
    ],
    optionsComparison:
      "Lifestyle-only and medication-assisted pathways both work for selected patients; candidacy determines strategy.",
    combinationRecommendations:
      "When skin or contour concerns appear during weight loss, staged device support can be discussed.",
    localIntent:
      "Medical weight-loss support in Oswego for nearby Naperville, Aurora, Plainfield, Yorkville, and Montgomery areas.",
    serviceLinks: [
      { label: "Weight Loss Service", href: "/services/weight-loss" },
      { label: "GLP-1 Comparison", href: "/compare/glp1-vs-traditional-weight-loss" },
      { label: "Quantum RF", href: "/services/quantum-rf" },
    ],
    faqs: [
      { question: "Who qualifies for GLP-1 treatment?", answer: "Eligibility depends on medical history, goals, and provider assessment." },
      { question: "How quickly do patients lose weight?", answer: "Rate varies by adherence, metabolism, and treatment plan." },
      { question: "Is this a long-term strategy?", answer: "Most sustainable plans include long-term follow-up and maintenance planning." },
    ],
  },
  {
    slug: "neck-tightening",
    title: "Neck Tightening",
    concernOverview:
      "Neck concerns often include crepey texture, submental fullness, and reduced jaw-neck definition.",
    treatmentApproaches: [
      "RF microneedling for neck texture and mild laxity",
      "Subdermal RF for deeper contour support",
      "Combination planning with lower-face balancing",
    ],
    optionsComparison:
      "Surface-only treatments and deeper contour treatments target different layers; treatment match matters more than device labels.",
    combinationRecommendations:
      "Combination plans may include neck-focused RF plus jawline balancing treatments when indicated.",
    localIntent:
      "Neck-tightening consults in Oswego commonly serve Naperville, Aurora, Plainfield, and Yorkville patients.",
    serviceLinks: [
      { label: "Quantum RF", href: "/services/quantum-rf" },
      { label: "Morpheus8", href: "/services/morpheus8" },
      { label: "Book Consultation", href: "/book" },
    ],
    faqs: [
      { question: "How long does neck tightening take to show?", answer: "Initial changes may appear in weeks with ongoing remodeling over months." },
      { question: "Is downtime expected?", answer: "Some downtime is typically expected and varies by treatment depth and modality." },
      { question: "Can neck and jawline be treated together?", answer: "Yes, many protocols consider both areas for balanced contour." },
    ],
  },
  {
    slug: "sagging-skin",
    title: "Sagging Skin",
    concernOverview:
      "Sagging skin may follow aging, pregnancy, or major weight change and can affect face and body areas differently.",
    treatmentApproaches: [
      "Layer-specific RF protocols for tightening",
      "Texture-focused resurfacing where needed",
      "Staged treatment plans for realistic, gradual improvement",
    ],
    optionsComparison:
      "Not all laxity responds equally. Mild-to-moderate concerns may improve non-surgically; advanced excess skin may require surgery referral.",
    combinationRecommendations:
      "Combination protocols are often recommended when patients need both contour lift and skin quality improvement.",
    localIntent:
      "Sagging-skin treatment planning available in Oswego for surrounding Fox Valley communities.",
    serviceLinks: [
      { label: "Morpheus8", href: "/services/morpheus8" },
      { label: "Quantum RF", href: "/services/quantum-rf" },
      { label: "Solaria CO2", href: "/services/solaria-co2" },
    ],
    faqs: [
      { question: "Can sagging skin improve without surgery?", answer: "It may improve in selected cases. Severity and tissue quality determine likely response." },
      { question: "Are combination treatments common?", answer: "Yes, many plans combine tightening and texture support in staged protocols." },
      { question: "How do I know what I need?", answer: "A consultation maps concern depth, candidacy, and treatment sequence." },
    ],
  },
];

export function getConcernBySlug(slug: string): ConcernPageData | undefined {
  return CONCERN_PAGES.find((c) => c.slug === slug);
}
