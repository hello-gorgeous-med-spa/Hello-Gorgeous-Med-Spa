import type { ScienceExplainerContent } from "./skin-101-types";

const INFOGRAPHIC = "/images/education/abdominal-lymphatic-drainage-reference.png";

export const LYMPHATIC_DRAINAGE_GUIDE: ScienceExplainerContent = {
  slug: "lymphatic-drainage",
  seriesLabel: "Science Explainer Series",
  heroAccent: "Lymphatic Drainage",
  metaTitle: "Abdominal Lymphatic Drainage Guide | Direction & Node Map | Hello Gorgeous Oswego IL",
  metaDescription:
    "Learn abdominal lymphatic drainage by quadrant — thoracic duct, axillary nodes, and inguinal groin pathways. Direction reference from Hello Gorgeous Med Spa in Oswego, IL.",
  title: "Abdominal Lymphatic Drainage",
  subtitle: "Four quadrants — four directions",
  intro:
    "Lymph doesn't drain in random circles. On the abdomen, each quadrant sweeps toward specific node groups — axillary (armpit), inguinal (groin), or up through the thoracic duct. Here is the map.",
  hashtags: ["LymphaticDrainage", "AbdominalMassage", "DePuff", "SkinScience"],
  disclaimer:
    "Lymphatic drainage is gentle, but it isn't for everyone. Skip it if you have an active infection, fever, a blood clot or DVT, untreated cancer, or heart or kidney conditions — check with your physician first if any of those apply to you.",
  stats: [
    { value: "4", label: "Abdominal quadrants — each with its own sweep direction" },
    { value: "Nickel", label: "Weight of pressure — move skin, not muscle" },
  ],
  featuredImage: {
    src: INFOGRAPHIC,
    alt: "Abdominal lymphatic drainage direction map — quadrants, thoracic duct, axillary and inguinal nodes",
  },
  pdfPath: "/handouts/education/lymphatic-drainage-guide.pdf",
  sections: [
    {
      id: "technique",
      navLabel: "Pressure & color",
      type: "prose",
      heading: "How to Know You're Doing It Right",
      body: "Pressure should be light enough that you're moving skin, not muscle — if you can feel muscle underneath your fingers, you're pressing too hard. Your skin should stay its normal color throughout; if you see flushing or redness, you've shifted from lymphatic (fluid) work into circulatory (blood flow) work, which is a different technique entirely.",
      stripe: "white",
    },
    {
      id: "thoracic",
      navLabel: "Thoracic duct",
      type: "callout",
      heading: "Thoracic Duct — Center Line",
      body: "Green arrows up through the center of the abdomen toward the sternum. This is the main upward drainage pathway — fluid moves up the midline toward the thoracic duct under the sternum before it can leave the trunk.",
      variant: "info",
      stripe: "rose",
    },
    {
      id: "quadrants",
      navLabel: "Four quadrants",
      type: "actives",
      heading: "The Four Quadrants",
      subheading: "Imagine a cross through your navel — each section drains a different direction",
      stripe: "white",
      cards: [
        {
          category: "Quadrant 1 · Upper right",
          title: "Sweep Up & In",
          bullets: [
            "Sweep up and in toward the midline, then upward",
            "Directs fluid toward the right axillary lymph nodes (right armpit)",
          ],
          bestFor: "Upper abdomen, right side",
          frequency: "Light, repeated strokes",
          accent: "gold",
        },
        {
          category: "Quadrant 2 · Upper left",
          title: "Sweep Up & In",
          bullets: [
            "Sweep up and in toward the midline, then upward",
            "Directs fluid toward the left axillary lymph nodes (left armpit)",
          ],
          bestFor: "Upper abdomen, left side",
          frequency: "Light, repeated strokes",
          accent: "teal",
        },
        {
          category: "Quadrant 3 · Lower right",
          title: "Sweep Down & Out",
          bullets: [
            "Sweep down and out toward the right groin",
            "Directs fluid toward the right inguinal lymph nodes",
          ],
          bestFor: "Lower abdomen, right side",
          frequency: "Light, repeated strokes",
          accent: "pink",
        },
        {
          category: "Quadrant 4 · Lower left",
          title: "Sweep Down & Out",
          bullets: [
            "Sweep down and out toward the left groin",
            "Directs fluid toward the left inguinal lymph nodes",
          ],
          bestFor: "Lower abdomen, left side",
          frequency: "Light, repeated strokes",
          accent: "gold",
        },
      ],
    },
    {
      id: "legend",
      navLabel: "Direction key",
      type: "bullets",
      heading: "Direction Legend",
      bullets: [
        "Green — up to thoracic duct (under sternum)",
        "Yellow / blue — toward axillary lymph nodes (armpits)",
        "Purple / orange — toward inguinal lymph nodes (groin)",
      ],
      stripe: "rose",
    },
    {
      id: "timing",
      navLabel: "After treatments",
      type: "timing",
      heading: "General Timing by Treatment",
      subheading:
        "When lymphatic work helps your results — and when to wait. Timing depends on what you had done; ask your provider before you book body or facial massage.",
      stripe: "white",
      rows: [
        {
          treatment: "Body RF / Contouring",
          guidance: "Follow your provider's aftercare — often wait until redness or sensitivity resolves",
          why: "Skin and subcutaneous tissue need time to settle after heat-based devices",
        },
        {
          treatment: "Dermal Filler (body or face)",
          guidance: "Light drainage on non-injected areas may be fine within days; ask about treated zones",
          why: "Filler is still settling into its final shape for several weeks",
        },
        {
          treatment: "Microneedling / Laser",
          guidance: "Wait until visible redness and downtime have resolved",
          why: "Barrier is temporarily compromised right after treatment",
        },
        {
          treatment: "Post-surgical / Lipo",
          guidance: "Only with explicit clearance from your surgeon or med spa provider",
          why: "Surgical planes and healing timelines vary widely",
        },
      ],
    },
    {
      id: "facial-pdf",
      navLabel: "Facial guide",
      type: "callout",
      heading: "Facial Lymphatic Drainage Too?",
      body: "Neck-first facial technique is a different map — collarbone → neck → face. Our downloadable PDF covers that step-by-step for de-puffing the face after injectables and facials.",
      variant: "tip",
      stripe: "rose",
    },
  ],
  closingTitle: "How We Think About It at Hello Gorgeous",
  closingBody:
    "Direction matters as much as pressure — pushing fluid the wrong way is like sending traffic into a closed exit. We are happy to walk you through what is safe for your body, your treatments, and your timeline. Still family-owned, still honest, still in your corner.",
};
