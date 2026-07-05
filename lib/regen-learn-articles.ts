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

export const WHAT_ARE_PEPTIDES_ARTICLE: RegenLearnArticle = {
  slug: "what-are-peptides",
  path: "/rx/learn/what-are-peptides",
  category: "Peptides & Recovery",
  categoryPath: "/rx/peptides",
  title: "What are peptides?",
  subtitle:
    "Understanding peptide therapy, common uses, and how RE GEN delivers provider-supervised protocols in Illinois",
  metaTitle: "What Are Peptides? | RE GEN Peptide Education | Hello Gorgeous Med Spa",
  metaDescription:
    "Learn what peptides are, how peptide therapy works, common wellness and recovery uses, safety considerations, and how RE GEN delivers NP-supervised peptide protocols across Illinois.",
  keywords: [
    "what are peptides",
    "peptide therapy Illinois",
    "BPC-157 peptide",
    "sermorelin peptide",
    "NAD+ peptide Oswego",
    "RE GEN peptides",
    "Hello Gorgeous peptide therapy",
    "compounded peptides Illinois",
    "recovery peptides",
  ],
  updated: "2026-07-04",
  readTime: "7 min",
  reviewedBy: "Ryan Kent, FNP-BC",
  heroImage: "/images/rx-care/peptide-molecule-hero.png",
  heroImageAlt: "RE GEN peptide therapy — molecular science illustration",
  intro: [
    "Peptides are short chains of amino acids — the building blocks of proteins. In the body, they act as signaling molecules that help coordinate repair, metabolism, hormone release, and other cellular processes.",
    "In medical and wellness settings, certain peptides are compounded into injectable or other prescription forms when a provider determines they may support specific goals — such as recovery, energy, body composition, or sexual health. This guide explains the basics so you can have an informed conversation before starting a RE GEN intake.",
  ],
  toc: [
    { id: "basics", label: "Peptide basics" },
    { id: "how-they-work", label: "How peptide therapy works" },
    { id: "common-uses", label: "Common wellness uses" },
    { id: "examples", label: "Peptides you may hear about" },
    { id: "safety", label: "Safety & provider oversight" },
    { id: "compounded", label: "Compounded vs. brand-name" },
    { id: "candidates", label: "Who may benefit" },
    { id: "regen", label: "How RE GEN delivers peptide care" },
    { id: "takeaways", label: "Key takeaways" },
    { id: "faq", label: "Frequently asked questions" },
  ],
  sections: [
    {
      id: "basics",
      title: "What are peptides, in plain language?",
      paragraphs: [
        "Think of peptides as short instruction notes your cells use to communicate. Proteins are longer chains; peptides are smaller fragments — often just a few to a few dozen amino acids — that can bind to receptors and trigger specific responses.",
        "Because different peptides have different sequences, each one may influence a different pathway. That is why peptide therapy is not one-size-fits-all — your provider matches options to your history, goals, and lab work when appropriate.",
      ],
    },
    {
      id: "how-they-work",
      title: "How does peptide therapy work?",
      paragraphs: [
        "Peptide therapy uses prescription formulations — commonly subcutaneous injections — to deliver a specific peptide at a dose and schedule chosen by your provider. The peptide may mimic or support natural signals involved in healing, hormone regulation, metabolism, or other processes.",
        "Results vary by individual, peptide, dose, and adherence. Peptide therapy is not a substitute for sleep, nutrition, movement, or treating underlying medical conditions. RE GEN programs emphasize provider review before any prescription ships.",
      ],
    },
    {
      id: "common-uses",
      title: "What are peptides used for in wellness care?",
      paragraphs: [
        "Providers may discuss peptides when patients are interested in recovery support, metabolic health, growth-hormone axis support, cellular energy, skin health, sexual wellness, or performance — always after reviewing medical history and contraindications.",
        "At Hello Gorgeous Med Spa, peptide conversations often connect to broader regenerative and optimization goals. Your nurse practitioner helps determine whether a peptide protocol is appropriate or whether another pathway — such as hormones, weight management, or in-spa treatments — is a better fit.",
      ],
      bullets: [
        "Recovery & tissue support (e.g., musculoskeletal complaints)",
        "Growth hormone axis support (e.g., sermorelin-class protocols)",
        "Cellular energy & longevity (e.g., NAD+)",
        "Sexual health (e.g., PT-141 / bremelanotide-class options)",
        "Skin & antioxidant support (e.g., GHK-Cu, glutathione)",
      ],
    },
    {
      id: "examples",
      title: "Peptides you may hear about",
      paragraphs: [
        "Marketing and social media mention many peptide names. Below are categories patients often ask about — not recommendations. Only a licensed provider can determine what is safe and appropriate for you.",
      ],
      subsections: [
        {
          title: "Recovery & repair",
          paragraphs: [
            "BPC-157 and TB-500 (thymosin beta-4 fragment) are frequently discussed for musculoskeletal recovery. Evidence in humans is still evolving; RE GEN uses them only when a provider determines medical appropriateness.",
          ],
        },
        {
          title: "Growth hormone support",
          paragraphs: [
            "Sermorelin and CJC-1295 / ipamorelin combinations aim to support natural growth hormone release rather than replacing it directly. Labs and follow-up help guide titration.",
          ],
        },
        {
          title: "Energy & metabolism",
          paragraphs: [
            "NAD+ supports cellular energy pathways. AOD-9604 and similar peptides are sometimes discussed for body-composition goals — always alongside lifestyle changes and, when relevant, weight-management programs.",
          ],
        },
      ],
    },
    {
      id: "safety",
      title: "Safety, side effects, and oversight",
      paragraphs: [
        "Peptides are prescription medications when used therapeutically. Side effects depend on the specific peptide and may include injection-site reactions, flushing, headache, nausea, or changes in appetite or sleep. Serious risks exist for some populations — pregnancy, certain cancers, uncontrolled chronic conditions, or drug interactions.",
        "RE GEN requires a health intake and nurse practitioner review before dispensing. We do not sell peptides without a prescription, and we do not guarantee specific outcomes.",
      ],
    },
    {
      id: "compounded",
      title: "Compounded peptides vs. brand-name products",
      paragraphs: [
        "Many peptides used in optimization care are compounded by US-licensed pharmacies rather than purchased as FDA-approved brand-name drugs. Compounded products are prepared for an individual patient per provider order.",
        "RE GEN lists transparent monthly pricing for common protocols during intake. HSA/FSA cards are often accepted; confirm with your plan administrator.",
      ],
    },
    {
      id: "candidates",
      title: "Who may be a candidate?",
      paragraphs: [
        "Candidacy depends on your health history, medications, goals, and labs. Peptide therapy may not be appropriate if you are pregnant, have certain active malignancies, or have conditions that make injections or specific pathways unsafe.",
        "If peptides are not the right fit, your provider may recommend alternatives — including in-spa FlowWave shockwave for musculoskeletal complaints, hormone therapy, GLP-1 weight management, or other RE GEN pathways.",
      ],
    },
    {
      id: "regen",
      title: "How RE GEN delivers peptide care",
      paragraphs: [
        "Start at hellogorgeousmedspa.com/rx/peptides to browse protocols and pricing. Complete the online intake, and Ryan Kent, FNP-BC reviews your information. When approved, medication ships from a US compounding pharmacy with flat-rate Illinois shipping.",
        "You can also visit Hello Gorgeous Med Spa in Oswego for in-person consults, labs, and coordination with other services — including peptide injections administered on site when appropriate.",
      ],
    },
  ],
  keyTakeaways: [
    "Peptides are short amino-acid chains that act as signaling molecules in the body.",
    "Peptide therapy uses prescription formulations matched to individual goals — not generic wellness shots.",
    "Safety depends on the specific peptide, your health history, and ongoing provider oversight.",
    "RE GEN offers NP-supervised peptide protocols with transparent pricing and Illinois telehealth delivery.",
  ],
  faqs: [
    {
      q: "Are peptides the same as steroids?",
      a: "No. Peptides are short chains of amino acids that signal specific pathways. Anabolic steroids are a different class of hormones with distinct risks and regulations. Your provider explains what a recommended peptide does and how it differs from other options.",
    },
    {
      q: "Do I need labs before starting peptides?",
      a: "It depends on the protocol. Growth-hormone-axis peptides and hormone-adjacent programs often benefit from baseline labs. Your NP will tell you what is recommended during intake review.",
    },
    {
      q: "How are RE GEN peptides shipped?",
      a: "Approved prescriptions ship from US-licensed compounding pharmacies to your door across Illinois. RE GEN uses flat $30 shipping on most programs; syringes and supplies are included where applicable.",
    },
    {
      q: "Can I get peptides in person at Hello Gorgeous?",
      a: "Yes. Oswego clients can book in-spa visits for consults, labs, and peptide injections when clinically appropriate, in addition to RE GEN mail-order protocols.",
    },
    {
      q: "What peptides does RE GEN offer?",
      a: "The catalog includes recovery, metabolic, GH-support, NAD+, sexual health, and wellness options — with pricing shown during intake. Visit /rx/peptides for the current menu.",
    },
  ],
  relatedLinks: [
    {
      label: "RE GEN Peptide programs",
      href: "/rx/peptides",
      description: "Browse protocols and transparent pricing",
    },
    {
      label: "Peptide therapy in Oswego",
      href: "/services/peptides",
      description: "In-spa peptide care at Hello Gorgeous",
    },
    {
      label: "What is GLP-1?",
      href: "/rx/learn/what-is-glp-1",
      description: "Weight-management education",
    },
    {
      label: "RE GEN safety information",
      href: "/rx/safety",
      description: "Treatment warnings and consent",
    },
  ],
  cta: {
    title: "Talk to a provider about peptide therapy",
    body: "RE GEN peptide programs include NP review, telehealth when required, and medication shipped across Illinois — starting with a short online intake.",
    href: "/rx/peptides",
    label: "Explore peptide programs",
    secondaryHref: "/rx",
    secondaryLabel: "Browse RE GEN",
  },
};

export const WHAT_IS_HORMONE_THERAPY_ARTICLE: RegenLearnArticle = {
  slug: "what-is-hormone-therapy",
  path: "/rx/learn/what-is-hormone-therapy",
  category: "Hormones & TRT",
  categoryPath: "/rx/hormones",
  title: "What is hormone therapy?",
  subtitle:
    "Understanding TRT, bioidentical HRT, lab-guided dosing, and how RE GEN delivers NP-supervised hormone care in Illinois",
  metaTitle: "What Is Hormone Therapy? | TRT & HRT Education | RE GEN | Hello Gorgeous",
  metaDescription:
    "Learn what hormone therapy is, how TRT and bioidentical HRT work, who may be a candidate, lab monitoring, and how RE GEN delivers NP-supervised programs in Oswego, IL.",
  keywords: [
    "what is hormone therapy",
    "TRT Illinois",
    "testosterone replacement Oswego",
    "bioidentical HRT",
    "hormone therapy men women",
    "RE GEN hormones",
    "Hello Gorgeous TRT",
    "HRT telehealth Illinois",
  ],
  updated: "2026-07-04",
  readTime: "8 min",
  reviewedBy: "Ryan Kent, FNP-BC",
  heroImage: "/images/regen/banner-h1.jpg",
  heroImageAlt: "RE GEN hormone therapy — TRT and HRT supervised in Oswego, IL",
  intro: [
    "Hormone therapy uses prescription medications to restore or optimize hormone levels when labs and symptoms suggest a deficiency or imbalance. For men, that often means testosterone replacement therapy (TRT). For women, bioidentical hormone replacement (HRT) may support perimenopause and menopause symptoms.",
    "Hormone care is medical — not a one-size-fits-all supplement stack. RE GEN programs at Hello Gorgeous Med Spa pair Illinois telehealth convenience with nurse-practitioner oversight, US compounding pharmacies, and lab-guided titration when appropriate.",
  ],
  toc: [
    { id: "basics", label: "Hormone therapy basics" },
    { id: "trt", label: "Testosterone replacement (TRT)" },
    { id: "womens-hrt", label: "Women's bioidentical HRT" },
    { id: "alternatives", label: "Clomiphene & HCG options" },
    { id: "labs", label: "Labs & monitoring" },
    { id: "candidates", label: "Who may benefit" },
    { id: "risks", label: "Risks & contraindications" },
    { id: "regen", label: "How RE GEN delivers hormone care" },
    { id: "takeaways", label: "Key takeaways" },
    { id: "faq", label: "Frequently asked questions" },
  ],
  sections: [
    {
      id: "basics",
      title: "What is hormone therapy?",
      paragraphs: [
        "Hormones are chemical messengers that influence energy, mood, libido, body composition, sleep, and more. When levels fall outside a healthy range — often due to aging, medical conditions, or stress — some people experience symptoms that affect daily life.",
        "Hormone therapy means using FDA-approved or compounded prescription treatments under provider supervision to address documented imbalances. It is not the same as over-the-counter “booster” products sold online without labs or medical review.",
      ],
    },
    {
      id: "trt",
      title: "Testosterone replacement therapy (TRT) for men",
      paragraphs: [
        "TRT supplies testosterone when your body is not producing enough on its own. Common forms include injectable testosterone cypionate, topical gels or creams, and pellets in some settings. RE GEN offers compounded injectable and topical options with transparent pricing after NP review.",
        "Goals may include improved energy, libido, mood, and body composition — but individual response varies and no outcome is guaranteed. Dosing starts conservatively and adjusts based on symptoms and follow-up labs.",
      ],
      bullets: [
        "Injectable TRT — often weekly or biweekly self-administration after training",
        "Topical TRT — daily application; avoid skin-to-skin transfer to partners/children",
        "Provider titration — dose changes follow labs and how you feel",
      ],
    },
    {
      id: "womens-hrt",
      title: "Bioidentical HRT for women",
      paragraphs: [
        "Women experiencing perimenopause or menopause may discuss estrogen, progesterone, or combination bioidentical formulations when symptoms — such as hot flashes, sleep disruption, mood changes, or vaginal dryness — interfere with quality of life.",
        "Bioidentical means the hormone structure matches what the body produces. Compounded creams, capsules, and troches are common delivery forms. Your NP reviews history, symptoms, and risk factors before recommending a pathway.",
      ],
    },
    {
      id: "alternatives",
      title: "Clomiphene and HCG — fertility-friendly options",
      paragraphs: [
        "Not every man needs direct testosterone. Clomiphene citrate stimulates the pituitary to increase natural testosterone production. Human chorionic gonadotropin (HCG) can help maintain testicular function during or after TRT.",
        "These pathways are sometimes chosen when preserving fertility matters. Your provider explains trade-offs between direct TRT and stimulation-based approaches.",
      ],
    },
    {
      id: "labs",
      title: "Why labs matter",
      paragraphs: [
        "Responsible hormone care starts with baseline labs — typically total and free testosterone, estradiol, CBC, metabolic panel, and lipids for men; a tailored panel for women based on symptoms and history. Follow-up labs guide dose adjustments and safety monitoring.",
        "RE GEN integrates lab orders and review into the program. Skipping labs increases risk — reputable providers will not prescribe blindly.",
      ],
    },
    {
      id: "candidates",
      title: "Who may be a candidate?",
      paragraphs: [
        "Candidacy depends on symptoms, exam, medical history, and lab results — not age alone. Men with consistently low testosterone and compatible symptoms may discuss TRT. Women with menopausal symptoms may discuss HRT when benefits outweigh risks.",
        "Certain conditions — including some cancers, untreated sleep apnea, uncontrolled heart disease, desire for fertility without a fertility plan, or elevated hematocrit — may mean hormone therapy is not appropriate.",
      ],
    },
    {
      id: "risks",
      title: "Risks and what to watch for",
      paragraphs: [
        "TRT can affect red blood cell count, cholesterol, fertility, acne, and mood. Topicals require careful handling. Women on estrogen-containing HRT need individualized risk assessment, especially with a uterus (progesterone is typically required to protect the lining).",
        "Report side effects promptly. RE GEN programs include follow-up touchpoints — you are not left on autopilot after the first shipment.",
      ],
    },
    {
      id: "regen",
      title: "How RE GEN delivers hormone care",
      paragraphs: [
        "Start at hellogorgeousmedspa.com/rx/hormones to review TRT, women's HRT, and related options. Complete the online intake; Ryan Kent, FNP-BC reviews your history and labs plan before any prescription ships.",
        "Medications come from US-licensed compounding pharmacies with flat-rate Illinois shipping. You can also visit Hello Gorgeous in Oswego for in-person consults and lab draws when needed.",
      ],
    },
  ],
  keyTakeaways: [
    "Hormone therapy uses prescription treatments under provider supervision — not unregulated online boosters.",
    "TRT addresses low testosterone in men; bioidentical HRT may help qualifying women with menopause symptoms.",
    "Baseline and follow-up labs are essential for safe titration.",
    "RE GEN pairs NP oversight with Illinois telehealth delivery and transparent program pricing.",
  ],
  faqs: [
    {
      q: "What is the difference between TRT and “testosterone boosters”?",
      a: "TRT is prescription testosterone with medical monitoring. OTC boosters are supplements not equivalent to prescription therapy and are not reviewed by your NP. RE GEN offers prescription TRT programs only after clinical review.",
    },
    {
      q: "Do I need labs before starting TRT?",
      a: "Yes — reputable hormone care requires baseline labs and follow-up monitoring. Your RE GEN intake includes guidance on which labs to order or upload.",
    },
    {
      q: "Does RE GEN treat women for hormones?",
      a: "Yes. RE GEN offers bioidentical HRT pathways for qualifying women, in addition to men's TRT, clomiphene, and HCG options.",
    },
    {
      q: "Can TRT affect fertility?",
      a: "Direct testosterone can suppress sperm production. If fertility is a goal, discuss clomiphene or HCG with your provider before starting classic TRT.",
    },
    {
      q: "How do I start a hormone program with Hello Gorgeous?",
      a: "Visit /rx/hormones, review programs and pricing, then complete checkout and your health intake. A nurse practitioner reviews your information before any prescription ships.",
    },
  ],
  relatedLinks: [
    {
      label: "RE GEN Hormone programs",
      href: "/rx/hormones",
      description: "TRT, HRT, clomiphene & HCG pricing",
    },
    {
      label: "Gentlemen's Club TRT",
      href: "/gentlemens-club",
      description: "Men's optimization membership",
    },
    {
      label: "What are peptides?",
      href: "/rx/learn/what-are-peptides",
      description: "Recovery & optimization education",
    },
    {
      label: "RE GEN safety information",
      href: "/rx/safety",
      description: "Treatment warnings",
    },
  ],
  cta: {
    title: "Talk to a provider about hormone therapy",
    body: "RE GEN hormone programs include NP review, lab guidance, and medication shipped across Illinois — starting with a short online intake.",
    href: "/rx/hormones",
    label: "Explore hormone programs",
    secondaryHref: "/rx",
    secondaryLabel: "Browse RE GEN",
  },
};

export const REGEN_LEARN_ARTICLES: RegenLearnArticle[] = [
  WHAT_IS_GLP1_ARTICLE,
  WHAT_ARE_PEPTIDES_ARTICLE,
  WHAT_IS_HORMONE_THERAPY_ARTICLE,
];

export function getRegenLearnArticle(slug: string): RegenLearnArticle | undefined {
  return REGEN_LEARN_ARTICLES.find((a) => a.slug === slug);
}
