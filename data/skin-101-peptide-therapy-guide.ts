import type { ScienceExplainerContent } from "./skin-101-types";

export const PEPTIDE_THERAPY_GUIDE: ScienceExplainerContent = {
  slug: "peptide-therapy",
  seriesLabel: "NP-Supervised · Oswego, IL",
  heroAccent: "Peptide Therapy",
  metaTitle: "Peptide Therapy Oswego IL | $49 Consult | BPC-157, Sermorelin, GHK-Cu | Hello Gorgeous",
  metaDescription:
    "NP-supervised peptide therapy in Oswego, IL — BPC-157, Sermorelin, GHK-Cu, PT-141, NAD+ & more from licensed US pharmacies. $49 consult. Never research-grade.",
  title: "Peptide Therapy",
  subtitle: "Targeted protocols — never gray-market",
  intro:
    "Targeted peptide protocols for recovery, sleep, skin, libido, and longevity — prescribed and supervised by a full-authority nurse practitioner. Never research-grade. Never gray-market.",
  hashtags: ["PeptideTherapy", "NoGrayMarket", "RealOversight", "OswegoIL"],
  disclaimer:
    "Peptide therapy requires medical evaluation, prescription, and ongoing supervision. This page is educational overview only — your protocol is individualized at consult.",
  stats: [
    { value: "$49", label: "Peptide consultation with our medical team" },
    { value: "$250–600", label: "Typical monthly protocol, by peptide & supply length" },
  ],
  pdfPath: "/handouts/education/peptide-therapy-guide.pdf",
  sections: [
    {
      id: "what-is",
      navLabel: "What it is",
      type: "prose",
      heading: "What Is Peptide Therapy?",
      body: "Peptides are short chains of amino acids that act as signaling molecules — telling specific cells to do specific things. Most are self-administered as small subcutaneous injections, similar to an insulin pen, on a cycle your provider designs and adjusts as you go.",
      stripe: "white",
    },
    {
      id: "peptides",
      navLabel: "Popular peptides",
      type: "actives",
      heading: "The Peptides Our Clients Request Most",
      stripe: "rose",
      cards: [
        {
          category: "Healing & Recovery",
          title: "BPC-157",
          bullets: ["Recovery, gut support", "Tissue repair research"],
          bestFor: "Recovery goals",
          frequency: "Provider-designed cycle",
          accent: "teal",
        },
        {
          category: "Growth & Anti-Aging",
          title: "Sermorelin",
          bullets: ["Natural GH support", "Sleep, energy, lean mass"],
          bestFor: "Vitality & sleep",
          frequency: "Often nightly protocol",
          accent: "pink",
        },
        {
          category: "Aesthetics",
          title: "GHK-Cu",
          bullets: ["Skin firmness, texture", "Hair & collagen support"],
          bestFor: "Skin & hair signaling",
          frequency: "Injectable or topical — different lanes",
          accent: "gold",
        },
        {
          category: "Sexual Wellness",
          title: "PT-141",
          bullets: ["Libido & arousal support", "For men and women"],
          bestFor: "Sexual wellness goals",
          frequency: "As-needed or cyclic",
          accent: "pink",
        },
        {
          category: "Energy & Wellness",
          title: "NAD+",
          bullets: ["Cellular energy", "Clarity, healthy aging"],
          bestFor: "Energy & longevity",
          frequency: "IV or injectable protocols",
          accent: "teal",
        },
        {
          category: "GH Axis",
          title: "Tesamorelin",
          bullets: ["Visceral fat support", "Body composition"],
          bestFor: "Body composition goals",
          frequency: "Supervised hormone axis support",
          accent: "gold",
        },
      ],
    },
    {
      id: "why-hg",
      navLabel: "Why Hello Gorgeous",
      type: "callout",
      heading: "Every Protocol Prescribed By Ryan Kent, FNP-BC",
      body: "Peptides at Hello Gorgeous are sourced exclusively from licensed US compounding pharmacies — never internet vials, never gray-market, never research-grade. Full prescriptive authority, on site 7 days a week. Family-owned, NP-directed, and here longer than most competitors have been open.",
      variant: "info",
      stripe: "white",
    },
    {
      id: "appointment",
      navLabel: "What to expect",
      type: "steps",
      heading: "What To Expect At Your Appointment",
      stripe: "rose",
      steps: [
        {
          step: 1,
          title: "Consult",
          bullets: [
            "$49 with our medical team",
            "Goals, history, medications",
          ],
        },
        {
          step: 2,
          title: "Labs",
          bullets: ["If indicated for your protocol", "Informs dosing & safety"],
        },
        {
          step: 3,
          title: "Protocol",
          bullets: [
            "Written dose, frequency, cycle",
            "Self-injection training included",
          ],
        },
        {
          step: 4,
          title: "Follow-Up",
          bullets: ["Ongoing dose adjustment", "Included — not a one-time sale"],
        },
      ],
    },
    {
      id: "timing",
      navLabel: "When to expect results",
      type: "bullets",
      heading: "Realistic Timelines",
      intro: "Consistency matters more than speed — your provider sets expectations for your specific protocol.",
      bullets: [
        "Sleep effects: often noticeable in the first 1–2 weeks of a sleep-supporting protocol.",
        "Skin & longevity: typically 8–12 weeks for visible changes.",
      ],
      stripe: "white",
    },
  ],
  closingTitle: "Book Your Consultation",
  closingBody:
    "Curious if peptide therapy is right for you? We'll listen, ask the right questions, and tell you honestly whether peptides fit your goals — or if something else would serve you better. 630-636-6193 · 74 W Washington St, Oswego, IL.",
};
