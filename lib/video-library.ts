export type VideoCategory =
  | "provider-reel"
  | "educational"
  | "faq-clip"
  | "consultation-explainer"
  | "treatment-walkthrough";

export type LibraryVideo = {
  id: string;
  title: string;
  category: VideoCategory;
  service: "morpheus8" | "quantum-rf" | "solaria-co2" | "weight-loss";
  concernTags: string[];
  embedUrl: string;
  summary: string;
  transcript: string;
  relatedServices: { label: string; href: string }[];
};

export const VIDEO_LIBRARY: LibraryVideo[] = [
  {
    id: "morpheus8-provider-walkthrough",
    title: "Morpheus8 Provider Walkthrough",
    category: "treatment-walkthrough",
    service: "morpheus8",
    concernTags: ["skin-tightening", "acne-scars", "sagging-skin"],
    embedUrl: "https://www.youtube.com/embed/Tfr5nlG2dDA?rel=0",
    summary: "Depth planning, candidacy, and realistic timeline expectations for Morpheus8.",
    transcript:
      "Morpheus8 is selected when patients need more than superficial support. We tailor treatment depth and staging by anatomy, concern severity, and tolerance. Results usually evolve over months, not overnight.",
    relatedServices: [
      { label: "Morpheus8 Service Page", href: "/services/morpheus8" },
      { label: "Morpheus8 Hub", href: "/morpheus8" },
    ],
  },
  {
    id: "quantum-rf-clinical-education",
    title: "Quantum RF Clinical Education",
    category: "consultation-explainer",
    service: "quantum-rf",
    concernTags: ["jowls", "neck-tightening", "sagging-skin"],
    embedUrl: "https://www.youtube.com/embed/loJOgWGCkK8?rel=0",
    summary: "Subdermal RF overview for contour-focused patients comparing non-surgical and surgical pathways.",
    transcript:
      "Quantum RF is a minimally invasive contour procedure for selected patients. Swelling can mask early shape changes, and final contour may continue refining over months. Candidacy determines whether this path is appropriate.",
    relatedServices: [
      { label: "Quantum RF Service Page", href: "/services/quantum-rf" },
      { label: "Quantum RF Hub", href: "/quantum-rf" },
    ],
  },
  {
    id: "solaria-co2-recovery-briefing",
    title: "Solaria CO2 Recovery Briefing",
    category: "educational",
    service: "solaria-co2",
    concernTags: ["acne-scars", "skin-tightening"],
    embedUrl: "https://www.youtube.com/embed/VSif40VosRc?rel=0",
    summary: "What to expect from CO2 recovery phases, candidacy, and post-care priorities.",
    transcript:
      "CO2 resurfacing requires planned downtime. We align treatment depth with concern severity and healing profile. The first week focuses on recovery, while final texture changes continue to develop over time.",
    relatedServices: [
      { label: "Solaria CO2 Service Page", href: "/services/solaria-co2" },
      { label: "Solaria CO2 Hub", href: "/solaria-co2" },
    ],
  },
  {
    id: "glp1-provider-qa",
    title: "GLP-1 Provider Q&A",
    category: "faq-clip",
    service: "weight-loss",
    concernTags: ["weight-loss", "sagging-skin"],
    embedUrl: "https://www.youtube.com/embed/loJOgWGCkK8?rel=0",
    summary: "Medication candidacy, realistic progress expectations, and follow-up strategy.",
    transcript:
      "GLP-1 plans require consistent follow-up and dose adjustment. Early appetite changes may appear before visible composition changes. Long-term success depends on adherence and clinical monitoring.",
    relatedServices: [
      { label: "Weight Loss Service Page", href: "/services/weight-loss" },
      { label: "Weight Loss Hub", href: "/weight-loss" },
    ],
  },
];
