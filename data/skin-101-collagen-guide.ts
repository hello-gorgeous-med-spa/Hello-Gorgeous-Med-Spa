import type { ScienceExplainerContent } from "./skin-101-types";

export const COLLAGEN_TYPES_GUIDE: ScienceExplainerContent = {
  slug: "collagen-types",
  seriesLabel: "Science Explainer Series",
  heroAccent: "Collagen Science",
  metaTitle: "Collagen Types Explained | What Microneedling & Lasers Actually Target | Oswego IL",
  metaDescription:
    "Type I, III, IV & VII collagen — what each does in your skin, and what microneedling, RF, CO₂, PRP, exosomes, and retinoids actually stimulate. Hello Gorgeous Med Spa Oswego, IL.",
  title: "Not All Collagen Is The Same",
  subtitle: "Know what's behind the marketing claims",
  intro:
    "\"It builds collagen\" gets thrown around a lot — but different collagen types do different jobs in your skin. Here's what each one actually does, and what's behind the marketing claims.",
  hashtags: ["CollagenTypes", "SkinScience", "Microneedling", "KnowTheFacts"],
  disclaimer:
    "Collagen induction treatments — microneedling, RF microneedling, lasers, PRP — build results over months, not days, and what's right for your skin depends on your goals, skin type, and history. This page is educational. It's not a treatment plan; that's what a consult is for.",
  stats: [
    { value: "80–85%", label: "Of skin collagen is Type I — strength & firmness" },
    { value: "10–15%", label: "Is Type III — repair & healing in young skin" },
  ],
  pdfPath: "/handouts/education/collagen-types-guide.pdf",
  sections: [
    {
      id: "two-that-matter",
      navLabel: "Type I & III",
      type: "prose",
      heading: "The Two That Matter Most",
      body: "Type I makes up 80–85% of the collagen in your skin — it's the structural steel beam, responsible for strength and firmness. Type III makes up another 10–15% — think of it as the flexible scaffolding laid down early in healing, abundant in young skin. Together they're why \"boosting collagen\" almost always means boosting these two first.",
      stripe: "white",
    },
    {
      id: "where-they-live",
      navLabel: "Collagen types",
      type: "actives",
      heading: "Where Each Type Lives & What It Does",
      stripe: "rose",
      cards: [
        {
          category: "80–85% of skin collagen",
          title: "Type I",
          bullets: [
            "Strength, structure, firmness",
            "Found in the epidermis and throughout the dermis",
            "Most heavily targeted by anti-aging treatments",
          ],
          bestFor: "Anti-aging & firmness goals",
          frequency: "Primary remodeling target",
          accent: "pink",
        },
        {
          category: "10–15% of skin collagen",
          title: "Type III",
          bullets: [
            "Repair, healing, early regeneration",
            "Found in the dermis, alongside Type I",
            "Abundant in young, elastic skin",
          ],
          bestFor: "Healing & early repair signaling",
          frequency: "Co-stimulated with Type I",
          accent: "teal",
        },
        {
          category: "Basement membrane",
          title: "Type IV",
          bullets: [
            "Skin architecture, cell communication",
            "Forms the junction between epidermis and dermis",
            "Not a fibril — forms a sheet-like network",
          ],
          bestFor: "Structural skin architecture",
          frequency: "Less commonly discussed in marketing",
          accent: "gold",
        },
      ],
    },
    {
      id: "type-vii",
      navLabel: "Type VII",
      type: "callout",
      heading: "The Lesser-Known One: Type VII",
      body: "Found deeper, near the fat layer, Type VII forms anchoring fibrils — the structures that physically attach your skin layers to each other. It's a smaller share of total collagen, but it matters for mechanical stability and skin attachment, which is part of why skin can become more fragile with age even when Type I and III are both present.",
      variant: "info",
      stripe: "white",
    },
    {
      id: "treatments",
      navLabel: "Treatments",
      type: "treatments",
      heading: "What Actually Stimulates What",
      subheading:
        "Microneedling, RF, lasers, PRP, exosomes, retinoids — they all claim to \"build collagen.\" Here's what the research actually supports for each.",
      stripe: "rose",
      rows: [
        {
          name: "Microneedling",
          targets: "Type I + III",
          bullets: [
            "Controlled micro-injury triggers natural repair",
            "3–4 sessions typical, 4–6 weeks apart",
          ],
          downtime: "Minimal downtime",
          evidence: "established",
        },
        {
          name: "RF Microneedling",
          targets: "Type I + III",
          bullets: [
            "Heat + needling for deeper remodeling",
            "Histology confirms Type I/III reorganization",
          ],
          downtime: "1–3 days downtime",
          evidence: "established",
        },
        {
          name: "CO₂ Laser",
          targets: "Type I + III",
          bullets: [
            "Strongest single-session collagen stimulation",
            "Best evidence base of the energy devices",
          ],
          downtime: "5–10 days downtime",
          evidence: "established",
        },
        {
          name: "PRP",
          targets: "Fibroblast signaling",
          bullets: ["Your own platelets, growth factors", "Well-established safety profile", "Often paired with microneedling/RF"],
          downtime: "Minimal to 1–2 days",
          evidence: "established",
        },
        {
          name: "Exosomes",
          targets: "Emerging evidence",
          bullets: [
            "Biologically plausible signaling mechanism",
            "Controlled human trials still limited",
            "Regulatory status varies by region",
          ],
          downtime: "Varies by protocol",
          evidence: "emerging",
        },
        {
          name: "Retinoids",
          targets: "Type I support",
          bullets: [
            "Boosts fibroblast collagen output",
            "Slows breakdown of existing collagen",
            "The only at-home option on this list",
          ],
          downtime: "Adjustment period possible",
          evidence: "established",
        },
      ],
    },
    {
      id: "co2-vs-rf",
      navLabel: "CO₂ vs RF",
      type: "callout",
      heading: "How CO₂ and RF Actually Compare",
      body: "CO₂ laser produces more collagen stimulation per session, but with significantly more downtime (5–10 days vs. 1–3). RF microneedling needs more sessions to get there, but fits into a normal week. Neither is \"better\" — it depends on your downtime tolerance and goals.",
      variant: "tip",
      stripe: "white",
    },
    {
      id: "instant-claims",
      navLabel: "Instant claims",
      type: "bullets",
      heading: "Be Skeptical of \"Instant Collagen\" Claims",
      bullets: [
        "Collagen remodeling takes weeks to months, not days.",
        "Any treatment promising overnight collagen transformation is overselling what the biology actually supports.",
      ],
      stripe: "rose",
    },
  ],
  closingTitle: "How We Think About It at Hello Gorgeous",
  closingBody:
    "Collagen science is genuinely exciting, but it's also genuinely slow — real results come from consistent treatment over months, not a single trendy procedure. We'll always tell you what's well-established versus what's still emerging, so you can choose with clear eyes. Still family-owned, still honest, still in your corner.",
};
