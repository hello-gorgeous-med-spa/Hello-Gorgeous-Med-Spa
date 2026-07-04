/**
 * RE GEN Learn — patient education articles (CVS-style explainers on /rx/learn/*).
 */

export type RegenLearnTocItem = {
  id: string;
  label: string;
};

export type RegenLearnSubsection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type RegenLearnSection = {
  id: string;
  title: string;
  paragraphs: string[];
  subsections?: RegenLearnSubsection[];
  bullets?: string[];
};

export type RegenLearnArticle = {
  slug: string;
  path: string;
  category: string;
  categoryPath: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  updated: string;
  readTime: string;
  reviewedBy: string;
  heroImage: string;
  heroImageAlt: string;
  intro: string[];
  toc: RegenLearnTocItem[];
  sections: RegenLearnSection[];
  keyTakeaways: string[];
  faqs: Array<{ q: string; a: string }>;
  relatedLinks: Array<{ label: string; href: string; description?: string }>;
  cta: {
    title: string;
    body: string;
    href: string;
    label: string;
    secondaryHref?: string;
    secondaryLabel?: string;
  };
};

export const WHAT_IS_GLP1_ARTICLE: RegenLearnArticle = {
  slug: "what-is-glp-1",
  path: "/rx/learn/what-is-glp-1",
  category: "Weight Management",
  categoryPath: "/rx/weight-loss",
  title: "What is GLP-1?",
  subtitle: "Understanding glucagon-like peptide-1 and how GLP-1 medications support weight management",
  metaTitle: "What is GLP-1? | RE GEN Weight Loss Education | Hello Gorgeous Med Spa",
  metaDescription:
    "Learn what GLP-1 is, how GLP-1 receptor agonists work for weight management, common side effects, who may be a candidate, and how RE GEN delivers NP-supervised programs in Oswego, IL.",
  keywords: [
    "what is GLP-1",
    "GLP-1 weight loss",
    "GLP-1 receptor agonist",
    "semaglutide Illinois",
    "tirzepatide Oswego",
    "medical weight loss Oswego IL",
    "RE GEN weight loss",
    "Hello Gorgeous GLP-1",
  ],
  updated: "2026-07-04",
  readTime: "8 min",
  reviewedBy: "Ryan Kent, FNP-BC",
  heroImage: "/images/shop-rx/tirzepatide-glp1.png",
  heroImageAlt: "RE GEN medical weight loss — GLP-1 programs supervised in Oswego, IL",
  intro: [
    "GLP-1 (glucagon-like peptide-1) is a hormone your body releases in response to food. It helps regulate blood sugar, slows digestion, and can reduce appetite. Certain prescription medications mimic GLP-1’s effects to support type 2 diabetes management — and, when medically appropriate, chronic weight management.",
    "Conversations about GLP-1s often mention brand names you may have heard in the news. This guide explains how the hormone works, what the medication class does, who may benefit, and how Hello Gorgeous Med Spa’s RE GEN programs deliver GLP-1 therapy with nurse-practitioner oversight in Oswego, Illinois.",
  ],
  toc: [
    { id: "how-it-works", label: "How GLP-1 medications work" },
    { id: "weight-loss", label: "GLP-1 for weight management" },
    { id: "diabetes", label: "GLP-1 and blood sugar" },
    { id: "effects", label: "Effects on the body" },
    { id: "side-effects", label: "Possible side effects" },
    { id: "types", label: "Types of GLP-1 medications" },
    { id: "candidates", label: "Who may benefit" },
    { id: "contraindications", label: "Who should not take GLP-1s" },
    { id: "stopping", label: "What happens when you stop" },
    { id: "regen", label: "How RE GEN delivers GLP-1 care" },
    { id: "takeaways", label: "Key takeaways" },
    { id: "faq", label: "Frequently asked questions" },
  ],
  sections: [
    {
      id: "how-it-works",
      title: "How do GLP-1 medications work?",
      paragraphs: [
        "GLP-1 receptor agonists are prescription medications that imitate GLP-1 — a hormone produced when you eat. Because different GLP-1-based medicines have different FDA-labeled uses, your provider may recommend one pathway for type 2 diabetes and another for chronic weight management.",
        "At a high level, these medications bind to GLP-1 receptors throughout the body. That can stimulate insulin release when blood sugar is elevated, slow how quickly food leaves the stomach, and send signals to brain regions involved in appetite and fullness.",
      ],
    },
    {
      id: "weight-loss",
      title: "GLP-1 for weight management",
      paragraphs: [
        "For chronic weight management, GLP-1 medications are used alongside a reduced-calorie eating plan and increased physical activity — not as a stand-alone shortcut. Individual results vary; no outcome is guaranteed.",
        "Many patients describe two helpful shifts: feeling satisfied with smaller portions and thinking about food less often. Those changes can make sustainable habits feel more achievable when combined with provider-guided dosing and lifestyle support.",
      ],
      subsections: [
        {
          title: "Dual-pathway options",
          paragraphs: [
            "Tirzepatide activates both GLP-1 and GIP receptors — a dual pathway sometimes discussed alongside single-pathway GLP-1 options like semaglutide. Eligibility, dosing, and medication choice are medical decisions made after your health history and goals are reviewed.",
          ],
        },
      ],
    },
    {
      id: "diabetes",
      title: "GLP-1 and blood sugar regulation",
      paragraphs: [
        "GLP-1 helps trigger insulin release when blood glucose is high. In type 2 diabetes, that insulin response may be impaired. GLP-1 receptor agonists can support the body’s response to elevated blood sugar as part of a broader diabetes care plan supervised by a licensed provider.",
        "If you are exploring GLP-1 therapy primarily for weight management, your RE GEN intake still screens for diabetes-related factors — honest disclosure helps your nurse practitioner choose a safe protocol.",
      ],
    },
    {
      id: "effects",
      title: "Effects of GLP-1 medication on the body",
      paragraphs: [
        "Beyond appetite and digestion, weight loss achieved through lifestyle change plus medication may support improvements in blood pressure and cholesterol markers for some patients — which can matter for long-term cardiovascular health. Your provider may recommend labs and follow-up visits based on your history.",
        "Managing blood sugar and metabolic health can also be relevant to kidney function in some patients with type 2 diabetes and related conditions. Ongoing monitoring is part of responsible prescribing — not optional add-on care.",
      ],
    },
    {
      id: "side-effects",
      title: "GLP-1 medication side effects",
      paragraphs: [
        "Side effects may appear when starting a GLP-1 agonist or after a dose increase. Some improve as your body adjusts. Always report symptoms to your prescribing provider — do not change or stop medication without medical guidance.",
      ],
      bullets: [
        "Nausea",
        "Vomiting",
        "Diarrhea",
        "Constipation",
        "Abdominal discomfort",
      ],
      subsections: [
        {
          title: "When to seek help promptly",
          paragraphs: [
            "Serious reactions — including symptoms suggestive of pancreatitis, severe abdominal pain, persistent vomiting, or vision changes — require urgent medical attention. Your RE GEN provider reviews contraindications and warning signs during intake and telehealth visits.",
          ],
        },
      ],
    },
    {
      id: "types",
      title: "Some types of GLP-1 medications",
      paragraphs: [
        "You may hear brand names in advertising or from friends. Below are common FDA-approved reference products in the United States. RE GEN weight-loss programs use compounded semaglutide and tirzepatide prepared by licensed US pharmacies when medically appropriate — they are not brand-name Ozempic®, Wegovy®, Mounjaro®, or Zepbound®.",
      ],
      bullets: [
        "Semaglutide injections (brand examples: Ozempic®, Wegovy®)",
        "Semaglutide tablets (brand example: Rybelsus®)",
        "Tirzepatide injections (brand examples: Mounjaro®, Zepbound®)",
        "Liraglutide injections (brand examples: Saxenda®, Victoza®)",
        "Dulaglutide injections (brand example: Trulicity®)",
      ],
    },
    {
      id: "candidates",
      title: "Who might benefit from weight-management medication?",
      paragraphs: [
        "Prescription weight-management medications may be considered — with diet and activity changes — for adults who meet clinical criteria such as:",
      ],
      bullets: [
        "Body mass index (BMI) of 30 or higher, or",
        "BMI of 27 or higher with at least one weight-related condition (for example, high blood pressure or type 2 diabetes)",
      ],
      subsections: [
        {
          title: "Illinois patients at Hello Gorgeous",
          paragraphs: [
            "RE GEN serves Illinois residents with online intake, telehealth when required, and medication shipped after Ryan Kent, FNP-BC reviews your chart. In-person visits remain available at our Oswego med spa for patients who prefer face-to-face relationship-based care.",
          ],
        },
      ],
    },
    {
      id: "contraindications",
      title: "Who should not take GLP-1 medications?",
      paragraphs: [
        "GLP-1 receptor agonists are not appropriate for everyone. Your provider will review your personal and family history before prescribing.",
      ],
      bullets: [
        "Personal or family history of medullary thyroid carcinoma (MTC)",
        "Multiple endocrine neoplasia syndrome type 2 (MEN 2)",
        "Known severe allergic reaction to the medication or its ingredients",
        "Pregnancy or breastfeeding — GLP-1 medications are not recommended",
      ],
      subsections: [
        {
          title: "Use extra caution",
          paragraphs: [
            "History of pancreatitis, certain gastrointestinal conditions, or type 1 diabetes (GLP-1 agonists are not insulin substitutes) should be discussed openly during intake. Candid answers protect you — we screen like a medical practice because we are one.",
          ],
        },
      ],
    },
    {
      id: "stopping",
      title: "What can happen when people stop GLP-1 medications?",
      paragraphs: [
        "GLP-1 therapy is often used as ongoing support for chronic weight management. When treatment stops, appetite signals may return and some weight regain is common — especially without sustained nutrition, movement, and follow-up with your provider.",
        "If you are considering pausing or ending therapy, talk with your nurse practitioner about a transition plan rather than stopping abruptly on your own.",
      ],
    },
    {
      id: "regen",
      title: "How RE GEN delivers GLP-1 care",
      paragraphs: [
        "RE GEN is the prescription arm of Hello Gorgeous Med Spa in Oswego, IL — not a anonymous telehealth app. Every GLP-1 protocol is reviewed by Ryan Kent, FNP-BC before medication ships.",
      ],
      bullets: [
        "Browse programs at the RE GEN storefront",
        "Finish your category-aware health intake after payment",
        "Book telehealth when your protocol requires it",
        "NP approval, then licensed pharmacy compounding with flat $30 shipping",
      ],
      subsections: [
        {
          title: "Ready to explore your options?",
          paragraphs: [
            "Start at the RE GEN Weight Loss hub for current program pricing on compounded semaglutide and tirzepatide, or call (630) 636-6193 with questions before you order.",
          ],
        },
      ],
    },
  ],
  keyTakeaways: [
    "GLP-1 is a natural hormone involved in blood sugar regulation, digestion, and appetite signaling.",
    "GLP-1 receptor agonists mimic that hormone and are used for type 2 diabetes and, when labeled and medically appropriate, chronic weight management.",
    "Treatment works best alongside reduced-calorie nutrition and increased activity — not as a substitute for lifestyle change.",
    "Common side effects include nausea, vomiting, diarrhea, and constipation; serious reactions require prompt medical care.",
    "GLP-1 therapy requires ongoing provider oversight; stopping without a plan may lead to weight regain.",
    "RE GEN programs pair Illinois telehealth convenience with local NP supervision at Hello Gorgeous Med Spa.",
  ],
  faqs: [
    {
      q: "Is GLP-1 the same as Ozempic?",
      a: "No. GLP-1 is a hormone; Ozempic® is a brand-name prescription that contains semaglutide, a GLP-1 receptor agonist. RE GEN offers compounded semaglutide and tirzepatide programs reviewed by a nurse practitioner — not brand-name product.",
    },
    {
      q: "What is the difference between Ozempic and Wegovy?",
      a: "Both contain semaglutide but have different FDA-approved uses and dosing schedules. Ozempic® is approved for type 2 diabetes (and certain cardiovascular risk reduction); Wegovy® is approved for chronic weight management with lifestyle changes. Your provider determines what is appropriate for you.",
    },
    {
      q: "What is tirzepatide?",
      a: "Tirzepatide activates GLP-1 and GIP receptors. Brand examples include Mounjaro® (type 2 diabetes) and Zepbound® (chronic weight management). RE GEN offers compounded tirzepatide weight-loss programs with NP titration for eligible Illinois patients.",
    },
    {
      q: "Does RE GEN require insurance?",
      a: "RE GEN weight-loss programs are cash-pay with transparent pricing shown during intake. HSA/FSA cards are often accepted; confirm with your plan administrator.",
    },
    {
      q: "How do I start a GLP-1 program with Hello Gorgeous?",
      a: "Visit hellogorgeousmedspa.com/rx/weight-loss to review programs, then complete checkout and your health intake. A nurse practitioner reviews your information before any prescription ships.",
    },
  ],
  relatedLinks: [
    {
      label: "RE GEN Weight Loss programs",
      href: "/rx/weight-loss",
      description: "Compounded semaglutide & tirzepatide pricing",
    },
    {
      label: "Medical weight loss in Oswego",
      href: "/services/weight-loss",
      description: "In-spa GLP-1 care at Hello Gorgeous",
    },
    {
      label: "GLP-1 side effect support guide",
      href: "/docs/dosing-guides/glp1-side-effects.pdf",
      description: "Patient dosing guide (PDF)",
    },
    {
      label: "Important safety information",
      href: "/rx/safety",
      description: "RE GEN treatment warnings",
    },
  ],
  cta: {
    title: "Talk to a provider about GLP-1 therapy",
    body: "RE GEN weight-loss programs include NP review, telehealth when required, and medication shipped across Illinois — starting with a short online intake.",
    href: "/rx/weight-loss",
    label: "Explore weight loss programs",
    secondaryHref: "/rx",
    secondaryLabel: "Browse RE GEN",
  },
};

export const REGEN_LEARN_ARTICLES: RegenLearnArticle[] = [WHAT_IS_GLP1_ARTICLE];

export function getRegenLearnArticle(slug: string): RegenLearnArticle | undefined {
  return REGEN_LEARN_ARTICLES.find((a) => a.slug === slug);
}
