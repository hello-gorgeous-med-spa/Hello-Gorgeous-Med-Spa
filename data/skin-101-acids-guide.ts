import type { ScienceExplainerContent } from "./skin-101-types";

const INFOGRAPHIC = "/images/education/skincare-acids-reference.png";

export const SKINCARE_ACIDS_GUIDE: ScienceExplainerContent = {
  slug: "skincare-acids",
  seriesLabel: "Science Explainer Series",
  heroAccent: "Skincare Acids",
  metaTitle: "Skincare Acids Guide | AHA, BHA & Vitamin C Explained | Hello Gorgeous Oswego IL",
  metaDescription:
    "Learn what lactic, glycolic, mandelic, hyaluronic, azelaic, salicylic, and vitamin C actually do — strengths, pairings, and routine tips from Hello Gorgeous Med Spa in Oswego, IL.",
  title: "The Skincare Acids Guide",
  subtitle: "Seven acids, seven jobs",
  intro:
    "A plain-language breakdown of what each active actually does, who it's best for, and how they're typically used — so you can ask for the right thing by name.",
  hashtags: ["SkincareAcids", "KnowYourActives", "AHA", "BHA", "AntioxidantSkincare"],
  disclaimer:
    "Acids are active ingredients — they change your skin, which means they can also irritate it if you move too fast. Strengths, frequencies, and pairings below are general starting points, not a personalized plan. Patch test anything new, and check with your provider before combining several actives at once.",
  stats: [
    { value: "7", label: "Actives covered in this guide" },
    { value: "2–3×", label: "Typical starting frequency per week" },
  ],
  featuredImage: {
    src: INFOGRAPHIC,
    alt: "Skincare acids guide — lactic, glycolic, mandelic, hyaluronic, azelaic, salicylic, and vitamin C with benefits and best-for labels",
  },
  pdfPath: "/handouts/education/skincare-acids-guide.pdf",
  sections: [
    {
      id: "aha-bha",
      navLabel: "AHA vs BHA",
      type: "prose",
      heading: "AHA vs. BHA, In Plain English",
      body: "AHAs (lactic, glycolic, mandelic) are water-soluble and work on the skin's surface — great for texture, tone, and brightness. BHA (salicylic acid) is oil-soluble, so it can actually get inside the pore to clear out oil and debris. That's why oily, acne-prone skin usually reaches for a BHA, while dry or sun-damaged skin usually starts with an AHA.",
      stripe: "white",
    },
    {
      id: "gentle-exfoliants",
      navLabel: "Gentle AHAs",
      type: "actives",
      heading: "The Gentle Exfoliants (AHAs)",
      subheading: "From gentlest to most potent",
      stripe: "rose",
      cards: [
        {
          category: "AHA · 5–10%",
          title: "Lactic Acid",
          bullets: ["Gentle exfoliation, brightening", "Good first acid for sensitive or dry skin"],
          bestFor: "Keratosis pilaris",
          frequency: "2–3×/week, PM",
          accent: "pink",
        },
        {
          category: "AHA · 5–10%",
          title: "Glycolic Acid",
          bullets: [
            "Renews skin, boosts glow",
            "Smallest AHA molecule — most potent, most irritating",
          ],
          bestFor: "Dark spots",
          frequency: "2–3×/week, PM",
          accent: "gold",
        },
        {
          category: "AHA · up to 10%",
          title: "Mandelic Acid",
          bullets: ["Gentle exfoliation, evens tone", "Safest AHA for deeper skin tones"],
          bestFor: "Sensitive skin",
          frequency: "2–4×/week, AM or PM",
          accent: "teal",
        },
      ],
    },
    {
      id: "hydration-pores",
      navLabel: "Hydration & pores",
      type: "actives",
      heading: "Hydration, Calming & Pore Care",
      stripe: "white",
      cards: [
        {
          category: "Humectant",
          title: "Hyaluronic Acid",
          bullets: ["Deep hydration, plumps skin", "Apply to damp skin, seal with moisturizer"],
          bestFor: "Dry, dehydrated skin",
          frequency: "Daily, AM + PM",
          accent: "teal",
        },
        {
          category: "10–20%",
          title: "Azelaic Acid",
          bullets: ["Reduces redness, evens tone", "One of the few actives safe for daily use"],
          bestFor: "Rosacea",
          frequency: "2–3×/week → daily",
          accent: "pink",
        },
        {
          category: "BHA · 0.5–2%",
          title: "Salicylic Acid",
          bullets: ["Unclogs pores, controls oil", "Oil-soluble — cleans inside the pore"],
          bestFor: "Acne-prone skin",
          frequency: "3–5×/week, PM",
          accent: "gold",
        },
      ],
    },
    {
      id: "vitamin-c",
      navLabel: "Vitamin C",
      type: "callout",
      heading: "The One That Doesn't Follow the Rules",
      body: "Vitamin C (ascorbic acid) is an antioxidant, not an exfoliant. At 10–20%, used daily in the morning under SPF, it helps fight free-radical damage and boosts your sunscreen's protection — which is why it's the one acid on this list that belongs in your AM routine, not your PM one. Save the exfoliating acids for night.",
      variant: "info",
      stripe: "rose",
    },
    {
      id: "pairing",
      navLabel: "Pairing guide",
      type: "pairing",
      heading: "What Pairs Well — And What Doesn't",
      subheading: "The combinations that work together, the ones that cancel each other out, and how to build a routine that doesn't fight itself.",
      stripe: "white",
      rows: [
        {
          name: "Lactic Acid",
          pairsWell: "Hyaluronic acid, moisturizer after",
          avoid: "Other AHAs/BHAs same night, retinol same night",
        },
        {
          name: "Glycolic Acid",
          pairsWell: "Hyaluronic acid, niacinamide (alternate nights)",
          avoid: "Vitamin C same session, retinol same night",
        },
        {
          name: "Mandelic Acid",
          pairsWell: "Salicylic acid (alternate days), hyaluronic acid",
          avoid: "Other AHAs same session, physical scrubs",
        },
        {
          name: "Hyaluronic Acid",
          pairsWell: "Everything — layers under any acid",
          avoid: "Nothing — universally compatible",
        },
        {
          name: "Azelaic Acid",
          pairsWell: "Vitamin C (AM), hyaluronic acid, niacinamide",
          avoid: "Salicylic acid same session",
        },
        {
          name: "Salicylic Acid",
          pairsWell: "Hyaluronic acid, niacinamide",
          avoid: "Vitamin C same session, retinol same night",
        },
        {
          name: "Vitamin C",
          pairsWell: "Vitamin E, ferulic acid, SPF over top",
          avoid: "AHAs/BHAs same session — destabilizes it",
        },
      ],
    },
    {
      id: "routine",
      navLabel: "Build a routine",
      type: "steps",
      heading: "Build a Routine That Doesn't Fight Itself",
      stripe: "rose",
      steps: [
        {
          step: 1,
          title: "Start Slow",
          bullets: [
            "One new acid at a time",
            "2–3×/week for the first month",
            "Watch for redness or peeling",
          ],
        },
        {
          step: 2,
          title: "Separate AM/PM",
          bullets: [
            "Vitamin C + SPF in the morning",
            "Exfoliating acids at night",
            "Hyaluronic acid fits either",
          ],
        },
        {
          step: 3,
          title: "Always Moisturize",
          bullets: [
            "Acids work best on a hydrated barrier",
            "Seal actives with a moisturizer",
            "Don't skip SPF the next day",
          ],
        },
      ],
    },
    {
      id: "sensitive",
      navLabel: "Sensitive skin",
      type: "bullets",
      heading: "If Your Skin Is Sensitive",
      intro:
        "Start with mandelic acid or azelaic acid — both are gentler entry points with lower irritation potential, and azelaic acid is one of the few actives that can build up to daily use.",
      bullets: [
        "Persistent redness, burning, or peeling that doesn't settle within a few days isn't \"purging\" — pause and check in with your provider before continuing.",
      ],
      stripe: "white",
    },
  ],
  closingTitle: "How We Think About It at Hello Gorgeous",
  closingBody:
    "Acids are powerful, but more isn't better — the right acid, at the right strength, used consistently, beats a five-step routine that irritates your skin. If you're not sure where to start, that's exactly what a consult is for. Still family-owned, still honest, still in your corner.",
};
