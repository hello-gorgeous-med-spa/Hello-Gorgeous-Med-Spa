import type { ScienceExplainerContent } from "./skin-101-types";

const INFOGRAPHIC = "/images/education/skin-layers-injection-depth-reference.png";

export const SKIN_LAYERS_GUIDE: ScienceExplainerContent = {
  slug: "skin-layers",
  seriesLabel: "Science Explainer Series",
  heroAccent: "Skin Layers",
  metaTitle:
    "5 Layers of Skin & Injection Depth Guide | Botox, Filler, Morpheus8 | Hello Gorgeous Oswego IL",
  metaDescription:
    "Learn the five facial layers — epidermis to periosteum — and where Botox, fillers, microneedling, Morpheus8 Burst, and RF lipo actually work. Depth reference from Hello Gorgeous Med Spa.",
  title: "The 5 Layers of Your Skin",
  subtitle: "Injection & treatment depth reference",
  intro:
    "Understanding depth is everything — the right layer means the right result. Here is a plain-language map of where common med spa treatments work, from the skin surface down to bone.",
  hashtags: ["SkinLayers", "InjectionDepth", "Botox", "Morpheus8", "KnowBeforeYouGo"],
  disclaimer:
    "Depth ranges are general educational references — your provider chooses the exact plane based on anatomy, product, and your goals. This is not a treatment plan.",
  stats: [
    { value: "5", label: "Layers from skin surface to deep support" },
    { value: "0–14+ mm", label: "Typical depth range for aesthetic treatments" },
  ],
  featuredImage: {
    src: INFOGRAPHIC,
    alt: "Hello Gorgeous infographic — five skin layers and injection treatment depth reference",
  },
  sections: [
    {
      id: "layers",
      navLabel: "Five layers",
      type: "actives",
      heading: "The Five Layers — Surface to Deep",
      subheading: "What lives where, and what providers talk about at each depth",
      stripe: "white",
      cards: [
        {
          category: "Layer 1 · 0.05–1.5 mm",
          title: "Epidermis",
          bullets: [
            "Skin surface — UV damage & pigmentation live here",
            "Chemical peels, exfoliation, topical actives (retinol, vitamin C)",
          ],
          bestFor: "Texture, tone, brightness",
          frequency: "Topical & light resurfacing zone",
          accent: "pink",
        },
        {
          category: "Layer 2 · 1.5–5 mm",
          title: "Dermis",
          bullets: [
            "Collagen, elastin & hyaluronic acid matrix",
            "Botox at neuromuscular junction, microneedling & RF, superficial fillers",
          ],
          bestFor: "Wrinkles, collagen, early volume",
          frequency: "Most injectable & RF microneedling work",
          accent: "teal",
        },
        {
          category: "Layer 3 · 5–14 mm",
          title: "Subcutaneous Fat",
          bullets: [
            "Fat compartments & facial volume",
            "Deep filler plane (cheeks, jaw), RF lipo, Sculptra & biostimulators",
          ],
          bestFor: "Volume loss, contour, body fat",
          frequency: "Deep filler & contouring zone",
          accent: "gold",
        },
        {
          category: "Layer 4 · 8–14 mm",
          title: "SMAS",
          bullets: [
            "Superficial musculo-aponeurotic system — surgical facelift plane",
            "Morpheus8 Burst (to 8 mm), Ultherapy / HIFU for deeper lift",
          ],
          bestFor: "Skin tightening & lift",
          frequency: "Energy device remodeling depth",
          accent: "pink",
        },
        {
          category: "Layer 5 · 14 mm+",
          title: "Periosteum / Deep Fascia",
          bullets: [
            "Bone covering & deep structural support",
            "Supraperiosteal filler (chin, jaw), structural cheek & jaw definition",
          ],
          bestFor: "Profile & bone-adjacent structure",
          frequency: "Deep structural filler plane",
          accent: "teal",
        },
      ],
    },
    {
      id: "treatments",
      navLabel: "Where treatments work",
      type: "actives",
      heading: "Where Treatments Work",
      subheading: "Match the treatment to the layer — not all injectables or devices go to the same depth",
      stripe: "rose",
      cards: [
        {
          category: "2–5 mm",
          title: "Botox & Neurotoxins",
          bullets: ["Targets muscle movement at the neuromuscular junction", "Forehead, frown, crow's feet & more"],
          bestFor: "Dynamic lines",
          frequency: "Dermis / muscle interface",
          accent: "pink",
        },
        {
          category: "1.5–4 mm",
          title: "Microneedling & RF",
          bullets: ["Stimulates collagen in the dermis", "Classic microneedling & RF microneedling"],
          bestFor: "Texture, pores, early tightening",
          frequency: "Dermal remodeling",
          accent: "teal",
        },
        {
          category: "2–14 mm",
          title: "Dermal Filler",
          bullets: ["Adds volume & structure at multiple planes", "Superficial to deep — product & area dependent"],
          bestFor: "Lips, cheeks, jaw, under-eye (provider-selected)",
          frequency: "Layer varies by technique",
          accent: "gold",
        },
        {
          category: "0.5–8 mm",
          title: "Morpheus8 Burst",
          bullets: ["Reaches SMAS-level remodeling", "Deep RF microneedling — Hello Gorgeous Trifecta platform"],
          bestFor: "Skin tightening & texture",
          frequency: "Up to 8 mm depth",
          accent: "pink",
        },
        {
          category: "5–14 mm",
          title: "RF Lipo & Body RF",
          bullets: ["Targets fat compartments", "Quantum RF subdermal contouring at Hello Gorgeous"],
          bestFor: "Body contour & submental fat",
          frequency: "Subcutaneous fat layer",
          accent: "teal",
        },
        {
          category: "14 mm+",
          title: "Structural Filler (Chin/Jaw)",
          bullets: ["Supraperiosteal placement for profile definition", "Chin projection & jawline structure"],
          bestFor: "Profile sculpting",
          frequency: "Bone-adjacent plane",
          accent: "gold",
        },
      ],
    },
    {
      id: "depth-matters",
      navLabel: "Why depth matters",
      type: "callout",
      heading: "Understanding Depth Is Everything",
      body: "The right layer = the right result. Too superficial and filler can look bumpy or blue-tinged; too deep and you may not get the lift or smoothing you wanted. That is why medical oversight, product choice, and technique all matter — and why a consult comes before any injection or energy treatment.",
      variant: "tip",
      stripe: "white",
    },
  ],
  closingTitle: "How We Think About It at Hello Gorgeous",
  closingBody:
    "We will always explain where we are treating and why — Botox at $10/unit with an NP on site, Morpheus8 Burst and Quantum RF on the InMode Trifecta, and fillers chosen for your anatomy, not a one-size template. Still family-owned, still honest, still in your corner.",
};
