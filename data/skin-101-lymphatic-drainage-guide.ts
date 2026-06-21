import type { ScienceExplainerContent } from "./skin-101-types";

export const LYMPHATIC_DRAINAGE_GUIDE: ScienceExplainerContent = {
  slug: "lymphatic-drainage",
  seriesLabel: "Science Explainer Series",
  heroAccent: "Lymphatic Drainage",
  metaTitle: "Facial Lymphatic Drainage Guide | De-Puff Technique Explained | Hello Gorgeous Oswego IL",
  metaDescription:
    "Learn facial lymphatic drainage the right way — why neck comes first, how much pressure to use, and when it's safe after Botox, filler, microneedling, and lasers. Oswego, IL.",
  title: "Facial Lymphatic Drainage",
  subtitle: "The de-puffing technique — done right",
  intro:
    "The technique everyone's doing on social media — here's the actual anatomy behind it, the direction that matters most, and why most people get step one wrong.",
  hashtags: ["LymphaticDrainage", "FacialMassage", "DePuff", "SkinScience"],
  disclaimer:
    "Lymphatic drainage is gentle, but it isn't for everyone. Skip it if you have an active infection, fever, a blood clot or DVT, untreated cancer, or heart or kidney conditions — check with your physician first if any of those apply to you.",
  stats: [
    { value: "Step 1", label: "Always open collarbone & neck nodes first" },
    { value: "Nickel", label: "Weight of pressure — vessels sit just under skin" },
  ],
  pdfPath: "/handouts/education/lymphatic-drainage-guide.pdf",
  sections: [
    {
      id: "mistake",
      navLabel: "#1 mistake",
      type: "callout",
      heading: "The #1 Mistake Almost Everyone Makes",
      body: "Skipping the neck. Your face's lymph vessels all funnel down through nodes near your ears and jaw, then down your neck to your collarbones before that fluid can actually leave the area. If you only massage your face and never clear the neck and collarbone first, you're pushing fluid into a pathway that's already backed up — like pushing more water into a clogged drain.",
      variant: "warning",
      stripe: "white",
    },
    {
      id: "technique",
      navLabel: "Doing it right",
      type: "prose",
      heading: "How to Know You're Doing It Right",
      body: "Pressure should be light enough that you're moving skin, not muscle — if you can feel muscle underneath your fingers, you're pressing too hard. Your skin should stay its normal color throughout; if you see flushing or redness, you've shifted from lymphatic (fluid) work into circulatory (blood flow) work, which is a different technique entirely.",
      stripe: "rose",
    },
    {
      id: "order",
      navLabel: "The order",
      type: "steps",
      heading: "The Order That Actually Works",
      subheading: "Collarbone → Neck → Face",
      stripe: "white",
      steps: [
        {
          step: 1,
          title: "Collarbone",
          bullets: [
            "Gentle circles above each collarbone",
            "Opens the main drainage exit point",
            "10–15 circles, light pressure",
          ],
        },
        {
          step: 2,
          title: "Neck",
          bullets: [
            "Fingers below ears, stroke down to collarbone",
            "Clears the cervical nodes that drain the whole face",
            "10 strokes, each side",
          ],
        },
        {
          step: 3,
          title: "Face",
          bullets: [
            "Forehead & cheeks: center outward",
            "Under-eyes: inner corner toward temples",
            "Always finish by sweeping back down to the neck",
          ],
        },
      ],
    },
    {
      id: "timing",
      navLabel: "After treatments",
      type: "timing",
      heading: "General Timing by Treatment",
      subheading:
        "When lymphatic drainage helps your results — and when to wait. Timing depends on what you had done, so when in doubt, ask before you book.",
      stripe: "rose",
      rows: [
        {
          treatment: "Dermal Filler",
          guidance:
            "Light facial drainage on non-injected areas is often fine within days; ask your injector about the treated area specifically",
          why: "Filler is still settling into its final shape for several weeks",
        },
        {
          treatment: "Botox / Tox",
          guidance:
            "Providers commonly advise waiting roughly 3–14 days before facial drainage near treated areas — ranges vary, so ask yours",
          why: "Pressure too soon could theoretically encourage product migration before it binds",
        },
        {
          treatment: "Microneedling",
          guidance: "Wait until visible redness/downtime has resolved, typically a few days",
          why: "Skin barrier is temporarily compromised right after treatment",
        },
        {
          treatment: "Laser / RF Treatments",
          guidance:
            "Follow your provider's specific aftercare — often a longer window than filler or tox",
          why: "Healing timeline varies more by device and settings used",
        },
        {
          treatment: "Sculptra",
          guidance:
            "Massage is part of the protocol, not something to avoid — follow your provider's specific instructions",
          why: "Sculptra uniquely requires massage to distribute evenly",
        },
      ],
    },
    {
      id: "golden-rule",
      navLabel: "Golden rule",
      type: "callout",
      heading: "The Golden Rule for Combining Treatments",
      body: "Always tell every provider about everything you've recently had done — injectables, lasers, peels, massage. Timing conflicts between treatments are the most common avoidable mistake, and your provider can only plan around what they know about.",
      variant: "tip",
      stripe: "white",
    },
    {
      id: "benefits",
      navLabel: "What it helps",
      type: "actives",
      heading: "What It Can Help With Post-Treatment",
      stripe: "rose",
      cards: [
        {
          category: "Common benefit",
          title: "Less Swelling",
          bullets: [
            "Helps move post-procedure fluid along",
            "May reduce the \"puffy\" period after injectables",
          ],
          bestFor: "Post-injectable comfort",
          frequency: "When your provider clears timing",
          accent: "pink",
        },
        {
          category: "Common benefit",
          title: "Even Settling",
          bullets: [
            "Can help minimize asymmetric swelling",
            "Supports more even-looking results",
          ],
          bestFor: "Supportive aftercare",
          frequency: "Per provider guidance",
          accent: "teal",
        },
        {
          category: "Common benefit",
          title: "Comfort",
          bullets: ["Gentle, relaxing technique", "Often paired with facials as an add-on"],
          bestFor: "Facial relaxation",
          frequency: "Add-on to facials",
          accent: "gold",
        },
      ],
    },
  ],
  closingTitle: "How We Think About It at Hello Gorgeous",
  closingBody:
    "Lymphatic drainage is a genuinely useful tool — for de-puffing, for comfort, and as supportive aftercare once timing is right. But \"right after every treatment\" isn't always the answer, and we'd rather walk you through the real timeline than rush you into something that could work against your results. Still family-owned, still honest, still in your corner.",
};
