export type HubFaq = { question: string; answer: string };

export type TreatmentHubData = {
  slug: "morpheus8" | "quantum-rf" | "solaria-co2" | "weight-loss";
  title: string;
  summary: string;
  serviceUrl: string;
  recovery: string;
  downtime: string;
  treatmentAreas: string[];
  pricingValue: string;
  beforeAfterEducation: string;
  providerCommentary: string;
  localIntent: string;
  comparisons: { label: string; href: string }[];
  relatedTreatments: { label: string; href: string }[];
  videos: { title: string; embedUrl: string; transcriptExcerpt: string }[];
  faqs: HubFaq[];
};

export const TREATMENT_HUBS: Record<TreatmentHubData["slug"], TreatmentHubData> = {
  "morpheus8": {
    slug: "morpheus8",
    title: "Morpheus8 Hub",
    summary:
      "Your central guide to Morpheus8 at Hello Gorgeous: candidacy, downtime, treatment areas, comparisons, and booking.",
    serviceUrl: "/services/morpheus8",
    recovery: "Typical recovery includes redness, swelling, and texture sensitivity. Most patients return to normal routine quickly with aftercare.",
    downtime: "Usually measured in a few social days depending on treatment depth and area.",
    treatmentAreas: ["Face", "Neck", "Jawline", "Abdomen", "Arms", "Thighs"],
    pricingValue: "Value depends on depth strategy and treatment zones; consultation confirms scope and package fit.",
    beforeAfterEducation:
      "Early changes often appear as swelling settles; collagen remodeling may continue over 3-6 months.",
    providerCommentary:
      "We use Morpheus8 when patients need more than surface texture improvement and we tailor depth to anatomy.",
    localIntent:
      "Morpheus8 in Oswego, IL for patients from Naperville, Aurora, Plainfield, Yorkville, and Montgomery.",
    comparisons: [
      { label: "Morpheus8 vs RF Microneedling", href: "/compare/morpheus8-vs-rf-microneedling" },
      { label: "Morpheus8 vs Solaria context", href: "/services/solaria-co2" },
    ],
    relatedTreatments: [
      { label: "Quantum RF", href: "/services/quantum-rf" },
      { label: "Solaria CO2", href: "/services/solaria-co2" },
    ],
    videos: [
      {
        title: "Morpheus8 provider walkthrough",
        embedUrl: "https://www.youtube.com/embed/Tfr5nlG2dDA?rel=0",
        transcriptExcerpt: "Depth selection and staged treatment planning are individualized for each patient.",
      },
    ],
    faqs: [
      { question: "How many sessions are typical?", answer: "Many plans involve a series, but session count depends on concern severity and response." },
      { question: "When do results peak?", answer: "Results usually evolve over months as collagen remodeling continues." },
      { question: "Can Morpheus8 be combined with other treatments?", answer: "Yes, combination planning is common when texture and contour goals both exist." },
    ],
  },
  "quantum-rf": {
    slug: "quantum-rf",
    title: "Quantum RF Hub",
    summary:
      "A complete Quantum RF education center covering candidacy, contour goals, recovery, comparisons, and related procedures.",
    serviceUrl: "/services/quantum-rf",
    recovery: "Recovery commonly includes swelling and bruising; timeline depends on treatment zone and protocol.",
    downtime: "Often less than full surgery but still a meaningful medical recovery period.",
    treatmentAreas: ["Jawline", "Neck", "Arms", "Abdomen", "Knees", "Thighs"],
    pricingValue: "Investment reflects treatment zone and complexity. Consultation determines realistic treatment path.",
    beforeAfterEducation:
      "Early contour can be masked by swelling; final refinement typically settles over 3-6 months.",
    providerCommentary:
      "Quantum RF is used when structural tightening is needed and surface-only options are unlikely to reach the goal.",
    localIntent:
      "Quantum RF near Naperville and Aurora, performed at Hello Gorgeous in Oswego, IL.",
    comparisons: [
      { label: "Quantum RF vs Facelift", href: "/compare/quantum-rf-vs-facelift" },
      { label: "Quantum RF details", href: "/quantum-rf-oswego-il" },
    ],
    relatedTreatments: [
      { label: "Morpheus8", href: "/services/morpheus8" },
      { label: "Weight Loss Program", href: "/services/weight-loss" },
    ],
    videos: [
      {
        title: "Quantum RF clinical overview",
        embedUrl: "https://www.youtube.com/embed/loJOgWGCkK8?rel=0",
        transcriptExcerpt: "Subdermal RF targets deeper tissue where contour and tightening changes are made.",
      },
    ],
    faqs: [
      { question: "Is Quantum RF surgery?", answer: "It is minimally invasive, not a full excisional surgery." },
      { question: "Who is a candidate?", answer: "Candidates are determined by laxity severity, anatomy, and goals after consultation." },
      { question: "Can it be paired with Morpheus8?", answer: "Yes, staged planning is common when both contour and surface refinement are needed." },
    ],
  },
  "solaria-co2": {
    slug: "solaria-co2",
    title: "Solaria CO2 Hub",
    summary:
      "Everything about Solaria CO2 resurfacing in one place: candidacy, downtime, recovery, comparisons, and booking.",
    serviceUrl: "/services/solaria-co2",
    recovery: "Visible recovery is expected with peeling/redness phases and progressive healing milestones.",
    downtime: "Planned social downtime is typical for CO2 resurfacing.",
    treatmentAreas: ["Face", "Neck", "Perioral", "Acne-scar zones", "Texture-focused regions"],
    pricingValue: "Pricing depends on treatment scope and depth strategy; consult confirms plan and candidacy.",
    beforeAfterEducation:
      "Early texture change is often visible after peeling, with continued collagen remodeling in following months.",
    providerCommentary:
      "We use Solaria for higher-impact resurfacing and prioritize strict aftercare because healing quality drives outcomes.",
    localIntent:
      "Solaria CO2 laser resurfacing near Plainfield, Yorkville, and Montgomery, available in Oswego, IL.",
    comparisons: [
      { label: "Solaria CO2 vs Traditional CO2", href: "/compare/solaria-co2-vs-traditional-co2" },
      { label: "Solaria treatment page", href: "/services/solaria-co2" },
    ],
    relatedTreatments: [
      { label: "Morpheus8", href: "/services/morpheus8" },
      { label: "Dermal Fillers", href: "/services/dermal-fillers" },
    ],
    videos: [
      {
        title: "Solaria candidacy and recovery briefing",
        embedUrl: "https://www.youtube.com/embed/VSif40VosRc?rel=0",
        transcriptExcerpt: "Recovery planning and realistic expectations are critical for high-impact resurfacing.",
      },
    ],
    faqs: [
      { question: "Is downtime required?", answer: "Yes, most patients should plan visible recovery time." },
      { question: "Who is best suited for Solaria?", answer: "Patients with texture, scar, and tone concerns who accept downtime." },
      { question: "Can Solaria be combined with other services?", answer: "Yes, staged sequencing is often recommended after healing checkpoints." },
    ],
  },
  "weight-loss": {
    slug: "weight-loss",
    title: "Weight Loss Hub",
    summary:
      "Central weight-loss resource for GLP-1 education, candidacy funnels, comparison guides, and combination support.",
    serviceUrl: "/services/weight-loss",
    recovery: "GLP-1 plans require ongoing clinical follow-up and adaptation rather than one-time treatment recovery.",
    downtime: "No procedural downtime, but medication adjustment periods and symptom management are expected.",
    treatmentAreas: ["Appetite regulation", "Body composition goals", "Metabolic support", "Long-term maintenance"],
    pricingValue: "Value is tied to medical oversight, adherence support, and sustainable outcomes over time.",
    beforeAfterEducation:
      "Early changes are often appetite/behavioral; body-composition outcomes usually become clearer over sustained follow-up.",
    providerCommentary:
      "We treat weight loss as medical care, not a quick-fix program; follow-up and behavior strategy remain central.",
    localIntent:
      "GLP-1 weight-loss clinic support for Oswego, Naperville, Aurora, Plainfield, and surrounding communities.",
    comparisons: [
      { label: "GLP-1 vs Traditional Programs", href: "/compare/glp1-vs-traditional-weight-loss" },
      { label: "Weight-loss service page", href: "/services/weight-loss" },
    ],
    relatedTreatments: [
      { label: "Quantum RF for contour support", href: "/services/quantum-rf" },
      { label: "Morpheus8 for skin support", href: "/services/morpheus8" },
    ],
    videos: [
      {
        title: "GLP-1 provider Q&A",
        embedUrl: "https://www.youtube.com/embed/loJOgWGCkK8?rel=0",
        transcriptExcerpt: "Medication plans are adjusted over time and paired with nutrition/activity support.",
      },
    ],
    faqs: [
      { question: "Who is a candidate?", answer: "Candidacy is based on clinical history, goals, and risk profile." },
      { question: "How quickly do results appear?", answer: "Response timing varies; sustainable progress is usually measured over months." },
      { question: "Can body contour treatments be added later?", answer: "Yes, contour or tightening options may be staged when appropriate." },
    ],
  },
};

export const TREATMENT_HUB_SLUGS = Object.keys(TREATMENT_HUBS) as TreatmentHubData["slug"][];
