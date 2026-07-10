/** HG_DEV_011 — Single source of truth for the Peptides & Wellness education hub. */

export type PeptideTier = "patient" | "prescription" | "education";
export type PeptideCategory =
  | "Weight Health"
  | "Aesthetics"
  | "Energy & Wellness"
  | "Hormone Support"
  | "Recovery & Healing";

export type PeptideContentCard = { category: string; title: string; bullets: string[] };
export type PeptideCallout = { title: string; body: string };
export type PeptideExpectationRow = { claim: string; honest: string };
export type PeptideFaq = { question: string; answer: string };

export interface PeptideTopic {
  slug: string;
  name: string;
  tagline: string;
  category: PeptideCategory;
  tier: PeptideTier;
  accent: string;
  published: boolean;
  order: number;
  series: string;
  metaTitle?: string;
  metaDescription?: string;
  pills: string[];
  intro: string;
  cardsHeading?: string;
  hero?: { title: string; body: string; stats?: { value: string; label: string }[] };
  cards?: PeptideContentCard[];
  duo?: { title: string; body: string }[];
  callouts?: PeptideCallout[];
  expectationsTable?: PeptideExpectationRow[];
  faqs?: PeptideFaq[];
  handoutFilename?: string;
}

export const PEPTIDE_CATEGORIES: PeptideCategory[] = [
  "Weight Health",
  "Aesthetics",
  "Energy & Wellness",
  "Hormone Support",
  "Recovery & Healing",
];

export const PEPTIDE_TOPICS: PeptideTopic[] = [
  {
    slug: "peptides-101",
    name: "Peptides 101",
    tagline: "Start here — what peptides are and why the category matters",
    category: "Energy & Wellness",
    tier: "education",
    accent: "#D4537E",
    published: true,
    order: 1,
    series: "Hello Gorgeous · Patient Education Series",
    metaTitle: "Peptides 101 — Patient Education | Hello Gorgeous Oswego",
    metaDescription:
      "Plain-language guide to what peptides are, how they work, and why regulatory status matters. Education only from Hello Gorgeous Med Spa in Oswego, IL.",
    pills: ["#WhatArePeptides", "#HowTheyWork", "#TheCategories", "#SmartQuestions", "#KnowBeforeYouGo"],
    intro:
      "A plain-language guide to what peptides actually are, how they work in the body, and why this category of science is getting so much attention. Education only — no treatment claims.",
    hero: {
      title: "What is a peptide?",
      body:
        "A peptide is a short chain of amino acids — the same building blocks that make up proteins, just smaller. Where a protein might be hundreds of amino acids long, a peptide is usually only a handful (roughly 2–50). Your body makes thousands of them naturally; they act as messengers, telling cells what to do.",
      stats: [
        {
          value: "2–50",
          label: "Amino acids in a typical peptide — smaller and more targeted than most proteins",
        },
        {
          value: "3 tiers",
          label: "FDA-approved · cosmetic/topical · research-use-only — status varies enormously",
        },
      ],
    },
    duo: [
      {
        title: "Why people are talking",
        body:
          "Because peptides are so specific, researchers study them as signals rather than blunt instruments. The interest in wellness and aesthetics comes from this precision — the idea that a small, targeted molecule could support a single pathway. The science is active and evolving, which is exactly why education matters before anything else.",
      },
      {
        title: "The most important thing to understand",
        body:
          "\"Peptide\" is a category, not a single product — and the regulatory status varies enormously from one to the next. A few are FDA-approved medications. Some are common in cosmetics. Many are research compounds only. This page explains the science; it does not recommend, prescribe, or endorse any specific use.",
      },
    ],
    cardsHeading: "How they work — four core ideas",
    cards: [
      {
        category: "Mechanism",
        title: "Signaling",
        bullets: [
          "Peptides bind to receptors on cells",
          "That binding sends an instruction",
          "Think \"key fitting a lock,\" not a sledgehammer",
        ],
      },
      {
        category: "Mechanism",
        title: "Specificity",
        bullets: [
          "Each peptide tends to target one pathway",
          "Narrow focus = the research appeal",
          "Less \"everything everywhere\" than some drugs",
        ],
      },
      {
        category: "Mechanism",
        title: "Fragility",
        bullets: [
          "Stomach enzymes break them down",
          "That's why oral peptides are tricky",
          "Stability and delivery are major hurdles",
        ],
      },
      {
        category: "Mechanism",
        title: "Natural origin",
        bullets: [
          "Insulin is a peptide. So is collagen-related signaling",
          "The body produces them constantly",
          "Synthetic versions mimic these signals",
        ],
      },
    ],
    callouts: [
      {
        title: "Green flags ✓",
        body:
          "Licensed pharmacy sourcing · prescription required · clear medical supervision · honest about what's known and unknown · willing to put answers in writing · realistic expectations.",
      },
      {
        title: "Red flags ✕",
        body:
          "\"Trust us\" instead of documentation · pressure to decide fast · miracle promises · no prescription or supervision · \"research-use-only\" products offered for personal use · vague sourcing.",
      },
      {
        title: "A note on GLP-1s",
        body:
          "The GLP-1 class (the family behind well-known FDA-approved weight and diabetes medications) is technically peptide-based — which is why you'll sometimes see it grouped here. But FDA-approved GLP-1 medications are an entirely different regulatory world from research peptides, and the two should never be treated as the same thing.",
      },
      {
        title: "The Hello Gorgeous philosophy",
        body:
          "We'd rather give you honest information than a quick sale. Peptide science is genuinely exciting — and it's also young, and full of products that haven't earned the safety record approved medications have. Knowing the difference is how you stay both hopeful and protected.",
      },
    ],
    expectationsTable: [
      {
        claim: "\"All peptides are the same thing\"",
        honest:
          "They're not. Status ranges from FDA-approved medications to cosmetic topicals to research-only compounds — each with a different safety and oversight story.",
      },
      {
        claim: "\"If it's online, it's legit\"",
        honest:
          "Many products sold for \"research\" aren't made or labeled for people. Quality and oversight vary wildly between sellers.",
      },
      {
        claim: "\"My friend said it worked — so will I\"",
        honest:
          "Individual responses vary, and anecdote isn't evidence. Ask what human research actually shows and what's still unknown.",
      },
      {
        claim: "\"No need for a provider\"",
        honest:
          "For anything beyond cosmetic skincare, medical oversight, sourcing, and follow-up matter. A trustworthy provider welcomes your questions.",
      },
    ],
    handoutFilename: "peptides-101-educational-cheat-sheet.html",
  },
  {
    slug: "copper-peptides",
    name: "Copper Peptides",
    tagline: "GHK-Cu in skincare — collagen science for maturing skin",
    category: "Aesthetics",
    tier: "patient",
    accent: "#b87333",
    published: true,
    order: 1,
    series: "Hello Gorgeous · Skincare Science Series",
    metaDescription:
      "Learn about GHK-Cu copper peptides for firmness, texture, and post-treatment skin support. Education from Hello Gorgeous Med Spa in Oswego, IL.",
    pills: ["#GHKCu", "#CopperPeptide", "#CollagenScience", "#SkinBarrier", "#PostTreatmentGlow"],
    intro:
      "The story behind GHK-Cu — one of the most studied ingredients in skincare science — and why it keeps showing up in serums, post-treatment care, and the conversation about aging skin.",
    hero: {
      title: "So what is it, really?",
      body:
        "GHK-Cu (you'll see it on ingredient labels as Copper Tripeptide-1) is a tiny peptide made of just three amino acids bound to a copper ion. Your body already makes it — first discovered in human blood plasma in 1973, where it helps signal skin to repair and renew. Natural levels drop steeply with age, which is right when skin starts to show it.",
      stats: [
        {
          value: "1973",
          label: "First isolated from human plasma — over five decades of research behind it",
        },
        {
          value: "~60%",
          label: "Estimated drop in natural copper-peptide signaling from young adulthood toward age 60",
        },
      ],
    },
    cardsHeading: "What the research explores",
    cards: [
      {
        category: "Studied for",
        title: "Collagen",
        bullets: [
          "Signals fibroblasts (your collagen-makers)",
          "Linked to collagen & elastin synthesis",
          "The firmness conversation starts here",
        ],
      },
      {
        category: "Studied for",
        title: "Barrier",
        bullets: [
          "Supports the skin's protective barrier",
          "Researched for texture & hydration",
          "Why it feels \"smoothing\"",
        ],
      },
      {
        category: "Studied for",
        title: "Healing",
        bullets: [
          "Decades of wound-healing research",
          "Studied for calming irritated skin",
          "Part of why it pairs with treatments",
        ],
      },
      {
        category: "Studied for",
        title: "Antioxidant",
        bullets: [
          "Researched for antioxidant activity",
          "Helps the \"tired, dull\" conversation",
          "Supports overall skin resilience",
        ],
      },
    ],
    duo: [
      {
        title: "What's well-established ✓",
        body:
          "Topical GHK-Cu in quality skincare has a long, well-studied track record for the appearance of firmness, texture, and post-treatment comfort. This is the lane with the strongest, safest evidence — and the one we love for at-home care.",
      },
      {
        title: "What deserves caution",
        body:
          "You'll see GHK-Cu marketed in injectable and \"research\" forms online. Those are an entirely different regulatory and safety category from cosmetic topicals — not something to DIY. If you're curious about injectable protocols, that's a conversation for a licensed clinician, not a website cart.",
      },
    ],
    callouts: [
      {
        title: "Why the science nerds love it",
        body:
          "GHK-Cu isn't a one-trick ingredient. Gene-expression studies have shown it influences a remarkably wide range of skin-remodeling pathways — unusual for such a small molecule, and a big reason it's one of the most-cited peptides in dermatology research.",
      },
      {
        title: "How we think about it at Hello Gorgeous",
        body:
          "We love copper peptides because the science is genuinely there — not because they're trendy. We'd rather walk you through what an ingredient actually does than sell you a miracle. If you want help fitting GHK-Cu into your routine, or pairing it with your treatment plan, that's exactly what we're here for in Oswego.",
      },
    ],
    expectationsTable: [
      {
        claim: "\"Overnight transformation\"",
        honest:
          "Skincare results are gradual and personal — topical actives are usually a \"weeks, consistently\" story, not overnight.",
      },
      {
        claim: "\"More is better\"",
        honest:
          "A well-formulated product used as directed beats overdoing it. More copper peptide isn't automatically more result.",
      },
      {
        claim: "\"Replaces sunscreen\"",
        honest:
          "Nothing in skincare replaces sunscreen — it's still the single most proven anti-aging step.",
      },
      {
        claim: "\"Injectable = stronger serum\"",
        honest:
          "Different regulatory category, different risk profile. Topical is the everyday lane; injectable is provider-led only.",
      },
    ],
    handoutFilename: "copper-peptides-and-your-skin.html",
  },
  {
    slug: "ghk-cu-injectable",
    name: "GHK-Cu",
    tagline: "Skin firmness, collagen, hair & texture — prescribed at Hello Gorgeous",
    category: "Aesthetics",
    tier: "prescription",
    accent: "#a85d2e",
    published: true,
    order: 1,
    series: "Hello Gorgeous · Science Explainer Series",
    metaDescription:
      "GHK-Cu peptide therapy in Oswego, IL — collagen, skin firmness, hair support & texture. Hello Gorgeous RX™ NP-led consults. Naperville, Aurora, Plainfield.",
    pills: ["#GHKCu", "#Collagen", "#SkinRenewal", "#HairSupport", "#HelloGorgeousRX"],
    intro:
      "GHK-Cu is the copper peptide behind firmer skin, smoother texture, and the collagen conversation — available at Hello Gorgeous through Hello Gorgeous RX™ when your provider determines it's right for your goals.",
    hero: {
      title: "What GHK-Cu does for you",
      body:
        "GHK-Cu signals collagen and elastin pathways, supports wound healing and skin-barrier repair, and is widely discussed for hair follicle health. Many clients pair it with in-office treatments like Morpheus8 or RF microneedling for inside-and-out remodeling.",
      stats: [
        {
          value: "Skin",
          label: "Firmer texture, crepey improvement & post-acne scarring conversations",
        },
        {
          value: "Hair",
          label: "Often explored for shedding, thinning & scalp support protocols",
        },
      ],
    },
    cardsHeading: "How it helps",
    cards: [
      {
        category: "Studied for",
        title: "Collagen",
        bullets: [
          "Signals collagen & elastin pathways",
          "The firmness conversation",
          "Decades of skin research",
        ],
      },
      {
        category: "Studied for",
        title: "Repair",
        bullets: [
          "Long wound-healing history",
          "Tissue-repair pathways",
          "Why it interests aesthetics",
        ],
      },
      {
        category: "Studied for",
        title: "Skin quality",
        bullets: [
          "Texture & tone research",
          "Antioxidant activity",
          "The \"skin renewal\" angle",
        ],
      },
      {
        category: "Studied for",
        title: "Regeneration",
        bullets: [
          "Gene-expression research",
          "Broad remodeling pathways",
          "A multifunctional peptide",
        ],
      },
    ],
    duo: [
      {
        title: "Pairs beautifully with in-office treatments",
        body:
          "Clients who want maximum remodeling often combine GHK-Cu protocols with Morpheus8 Burst, Quantum RF, or Solaria CO2 — your NP builds one coordinated plan instead of disconnected treatments.",
      },
      {
        title: "How we prescribe it",
        body:
          "Through Hello Gorgeous RX™ with licensed pharmacy sourcing, proper screening, and follow-up. Your $49 consultation is where we match skin and hair goals to the right peptide — or tell you honestly if something else fits better.",
      },
    ],
    callouts: [
      {
        title: "Best for",
        body:
          "Crepey skin, texture concerns, post-acne scarring, hair shedding, or anyone who wants injectable skin support alongside their aesthetic treatments.",
      },
      {
        title: "What to expect",
        body:
          "Results are gradual — think weeks to months, not overnight. We'll set realistic timelines at your consult and monitor your progress.",
      },
    ],
    expectationsTable: [
      {
        claim: "Firmer, smoother skin texture",
        honest:
          "GHK-Cu supports collagen signaling — many clients notice improved texture over a series of weeks when combined with good skincare and in-office treatments.",
      },
      {
        claim: "Hair & scalp support",
        honest:
          "Often discussed for thinning or shedding — your provider may pair it with PRF or other hair protocols when appropriate.",
      },
      {
        claim: "Works with Morpheus8 & lasers",
        honest:
          "A popular stack at Hello Gorgeous for clients who want inside-and-out remodeling under one clinical team.",
      },
      {
        claim: "Prescription oversight",
        honest:
          "Sourced through vetted compounding partners — never \"research use only\" products from the internet.",
      },
    ],
    handoutFilename: "ghk-cu-injectable.html",
  },
  {
    slug: "bpc-157",
    name: "BPC-157",
    tagline: "Recovery, gut support & tissue repair — NP-led at Hello Gorgeous",
    category: "Recovery & Healing",
    tier: "prescription",
    accent: "#2b5fa5",
    published: true,
    order: 2,
    series: "Hello Gorgeous · Patient Education Series",
    metaDescription:
      "BPC-157 peptide therapy in Oswego, IL — recovery, gut support & tissue repair. Hello Gorgeous RX™ NP-led. $49 consult. Naperville, Aurora, Plainfield.",
    pills: ["#BPC157", "#Recovery", "#GutHealth", "#TissueRepair", "#HelloGorgeousRX"],
    intro:
      "BPC-157 is one of the most requested peptides at Hello Gorgeous — especially for recovery, gut lining support, and soft-tissue healing. We prescribe it through Hello Gorgeous RX™ when your NP determines it's clinically appropriate for your goals.",
    hero: {
      title: "What BPC-157 does",
      body:
        "BPC-157 (Body Protection Compound) is a peptide studied for tissue repair, tendon and ligament recovery, gut mucosal support, and anti-inflammatory pathways. Clients in Oswego and the Fox Valley often ask about it after injuries, surgeries, intense training, or chronic gut discomfort.",
      stats: [
        {
          value: "Recovery",
          label: "Workout recovery, strains, post-procedure healing conversations",
        },
        {
          value: "Gut support",
          label: "Often explored for GI lining & gut–muscle axis goals",
        },
      ],
    },
    cardsHeading: "How it helps",
    cards: [
      {
        category: "Recovery",
        title: "Tissue repair",
        bullets: [
          "Tendon, ligament & muscle support",
          "Popular after strains & overuse",
          "May pair with rehab & rest protocols",
        ],
      },
      {
        category: "Recovery",
        title: "Gut lining",
        bullets: [
          "GI mucosal-support conversations",
          "Tied to stomach-protein origin",
          "Screened for your full history",
        ],
      },
      {
        category: "Recovery",
        title: "Inflammation",
        bullets: [
          "Anti-inflammatory pathway support",
          "Post-workout soreness goals",
          "Part of HEAL-style blends",
        ],
      },
      {
        category: "Recovery",
        title: "Healing timeline",
        bullets: [
          "Often used in defined protocols",
          "Follow-up built into your plan",
          "Individual response varies",
        ],
      },
    ],
    duo: [
      {
        title: "Who it's for",
        body:
          "Athletes, weekend warriors, post-surgical clients, anyone with nagging soft-tissue issues, or clients working on gut recovery — when your provider says the risk–benefit makes sense for you.",
      },
      {
        title: "How Hello Gorgeous does it right",
        body:
          "Prescription-only through Hello Gorgeous RX™, vetted compounding pharmacy sourcing, NP oversight, and a plan that fits your full picture — not a random vial from the internet.",
      },
    ],
    callouts: [
      {
        title: "Often combined with",
        body:
          "TB-500 (Thymosin Beta-4) in recovery-focused HEAL blends, PRF hair protocols, or Morpheus8/RF when skin and tissue goals overlap.",
      },
      {
        title: "Start with a $49 consult",
        body:
          "We'll review your injury history, medications, and goals — then tell you honestly if BPC-157 fits, or if another path is better.",
      },
    ],
    expectationsTable: [
      {
        claim: "Faster workout recovery",
        honest:
          "Many active clients explore BPC-157 for between-session repair — your NP sets dose and duration based on your sport, injury, and timeline.",
      },
      {
        claim: "Gut discomfort support",
        honest:
          "Discussed for mucosal lining goals when clinically appropriate — always with full medical history review.",
      },
      {
        claim: "Post-procedure healing",
        honest:
          "Sometimes considered after Morpheus8, laser, or surgical procedures when your provider coordinates timing and safety.",
      },
      {
        claim: "Legitimate sourcing",
        honest:
          "Prescribed through licensed 503A partners — never \"research only\" gray-market products.",
      },
    ],
    handoutFilename: "bpc-157-what-to-know.html",
  },
  {
    slug: "pt-141",
    name: "PT-141",
    tagline: "Libido & arousal support for men and women — Hello Gorgeous RX™",
    category: "Energy & Wellness",
    tier: "prescription",
    accent: "#c2185b",
    published: true,
    order: 3,
    series: "Hello Gorgeous · Wellness Science Series",
    metaDescription:
      "PT-141 (bremelanotide) in Oswego, IL — libido and arousal support. Hello Gorgeous RX™ NP-led. Naperville, Aurora, Plainfield.",
    pills: ["#PT141", "#Bremelanotide", "#Libido", "#SexualWellness", "#HelloGorgeousRX"],
    intro:
      "PT-141 (bremelanotide) works on central pathways — not the same mechanism as Viagra or Cialis — and is one of the most asked-about peptides for libido and arousal in both men and women at Hello Gorgeous.",
    hero: {
      title: "What PT-141 does",
      body:
        "PT-141 activates melanocortin receptors in the brain to support sexual desire and arousal. It's FDA-approved as Vyleesi for a specific indication in women, and is also prescribed in optimization protocols for men and women when clinically appropriate.",
      stats: [
        {
          value: "Desire",
          label: "Supports libido when desire — not just mechanics — is the gap",
        },
        {
          value: "Both",
          label: "Discussed for men and women under full hormonal evaluation",
        },
      ],
    },
    cardsHeading: "How it helps",
    cards: [
      {
        category: "Wellness",
        title: "Libido",
        bullets: [
          "Central arousal pathway",
          "Different from PDE5 meds",
          "Works on desire signaling",
        ],
      },
      {
        category: "Wellness",
        title: "For women",
        bullets: [
          "FDA-approved form exists (Vyleesi)",
          "Hypoactive desire conversations",
          "Part of holistic sexual wellness",
        ],
      },
      {
        category: "Wellness",
        title: "For men",
        bullets: [
          "Explored when libido is low",
          "May complement other therapies",
          "Always with medical screening",
        ],
      },
      {
        category: "Wellness",
        title: "Your plan",
        bullets: [
          "Full hormone & med review",
          "Stress & relationship factors",
          "Personalized dosing if prescribed",
        ],
      },
    ],
    duo: [
      {
        title: "Not a replacement for relationship work",
        body:
          "PT-141 can support physiology — but we still talk about sleep, stress, hormones, thyroid, and medications. Sexual wellness is whole-person care at Hello Gorgeous.",
      },
      {
        title: "How we prescribe it",
        body:
          "Through Hello Gorgeous RX™ after evaluation — never bought online. Your $49 consult is the right starting point if libido is your primary goal.",
      },
    ],
    callouts: [
      {
        title: "Best for",
        body:
          "Clients who have desire/arousal concerns that aren't fully solved by traditional ED medications — or women exploring hypoactive sexual desire with NP guidance.",
      },
      {
        title: "What to expect",
        body:
          "Onset and response vary by person. We'll discuss timing, nausea management, and realistic expectations at your visit.",
      },
    ],
    expectationsTable: [
      {
        claim: "Supports libido & arousal",
        honest:
          "Works on brain pathways for desire — many clients appreciate that it's not \"just a blood-flow pill.\"",
      },
      {
        claim: "For men and women",
        honest:
          "Protocols differ by sex and health history — your NP personalizes after full evaluation.",
      },
      {
        claim: "Part of hormone wellness",
        honest:
          "Often discussed alongside thyroid, testosterone, estrogen, and stress management — not in isolation.",
      },
      {
        claim: "Prescription only",
        honest:
          "Sourced through licensed pharmacy partners with follow-up built in.",
      },
    ],
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    tagline: "Cellular energy science — what NAD+ actually is",
    category: "Energy & Wellness",
    tier: "patient",
    accent: "#1fa890",
    published: true,
    order: 2,
    series: "Hello Gorgeous · Wellness Science Series",
    metaDescription:
      "Learn what NAD+ is, why wellness clinics discuss it, and how to set realistic expectations. Patient education from Hello Gorgeous Oswego.",
    pills: ["#NADplus", "#CellularEnergy", "#Mitochondria", "#HealthyAging", "#WellnessScience"],
    intro:
      "The molecule behind the \"cellular energy\" conversation — what NAD+ actually is, why it's everywhere in wellness right now, and how to think about it like a smart, informed human.",
    hero: {
      title: "So what is it, really?",
      body:
        "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme found in every living cell in your body. Think of it as a helper molecule your cells can't run without — it's central to turning the food you eat into usable energy (ATP), and it plays a role in DNA repair and cellular signaling. Research shows natural NAD+ levels decline as we age, which is part of the \"why am I more tired and slower to bounce back\" story.",
      stats: [
        {
          value: "Every cell",
          label: "NAD+ is found in all living cells — it's foundational, not exotic",
        },
        {
          value: "↓ With age",
          label: "Levels are understood to decline over time, which fuels the longevity research interest",
        },
      ],
    },
    cardsHeading: "What the research explores",
    cards: [
      {
        category: "Studied for",
        title: "Energy",
        bullets: [
          "Helps convert nutrients into ATP",
          "Central to mitochondrial function",
          "The \"cellular fuel\" conversation",
        ],
      },
      {
        category: "Studied for",
        title: "Repair",
        bullets: [
          "Involved in DNA repair pathways",
          "Researched for cellular maintenance",
          "Part of the \"healthy aging\" interest",
        ],
      },
      {
        category: "Studied for",
        title: "Brain",
        bullets: [
          "Studied for focus & mental clarity",
          "Researched for neuroprotection",
          "Why people mention \"fog lifting\"",
        ],
      },
      {
        category: "Studied for",
        title: "Longevity",
        bullets: [
          "Activates sirtuins (longevity proteins)",
          "A focus in longevity medicine",
          "The \"aging well\" research lane",
        ],
      },
    ],
    duo: [
      {
        title: "IV & injectable forms",
        body:
          "Delivered directly so levels rise quickly. This is the form most associated with wellness clinics. Because it's administered, it's a medical service — meaning it should always involve a qualified provider, proper screening, and the right setting. Not a DIY situation.",
      },
      {
        title: "Oral precursors (NMN / NR)",
        body:
          "Supplements like nicotinamide riboside are \"precursors\" — building blocks the body converts toward NAD+. Convenient, but they travel through digestion first. Quality and regulation vary widely between brands, so this is a read-the-label category.",
      },
    ],
    callouts: [
      {
        title: "The simplest way to picture it",
        body:
          "Imagine your cells are tiny engines and NAD+ is the spark that helps them run. You can't see it or feel it directly — but when levels are healthy, the whole system tends to hum along better. The wellness interest is all about supporting that spark as we get older.",
      },
      {
        title: "How we think about it at Hello Gorgeous",
        body:
          "We're genuinely excited about cellular-wellness science — and we're just as committed to being straight with you about what's known and what isn't. If NAD+ is something you're curious about, the right first step is a real conversation about your goals, your health history, and whether it even makes sense for you.",
      },
    ],
    expectationsTable: [
      {
        claim: "\"Instant energy boost\"",
        honest:
          "Some people report feeling refreshed; responses are individual and not guaranteed. It's a support tool, not a switch.",
      },
      {
        claim: "\"Reverses aging\"",
        honest:
          "The research is about supporting cellular processes — not turning back a clock. Be skeptical of anything that promises that.",
      },
      {
        claim: "\"Works for everyone\"",
        honest:
          "It doesn't. Results vary, and the fundamentals (sleep, nutrition, movement) still matter most.",
      },
      {
        claim: "\"More is better\"",
        honest:
          "No. Administered too fast, NAD+ infusions can feel uncomfortable — which is exactly why setting and supervision matter.",
      },
    ],
    handoutFilename: "nad-plus-cellular-energy.html",
  },
  {
    slug: "methyl-b12",
    name: "Methyl B12",
    tagline: "Energy & wellness shots — the active form of B12",
    category: "Energy & Wellness",
    tier: "patient",
    accent: "#d99021",
    published: true,
    order: 3,
    series: "Hello Gorgeous · Wellness Science Series",
    metaDescription:
      "What methyl B12 is, who tends to benefit from injections, and honest expectations. Wellness education from Hello Gorgeous Med Spa Oswego.",
    pills: ["#MethylB12", "#Methylcobalamin", "#EnergySupport", "#NerveHealth", "#WellnessShot"],
    intro:
      "One of the most popular wellness shots there is — and one of the most well-understood. Here's what methylated B12 actually does, who tends to benefit, and how to think about it clearly.",
    hero: {
      title: "So what is it, really?",
      body:
        "Vitamin B12 is an essential nutrient your body needs for energy metabolism, healthy nerves, red blood cell formation, and DNA synthesis. Methylcobalamin (\"methyl B12\") is the active, ready-to-use form — your body can put it to work immediately without having to convert it first. That's why it's a favorite for injections: delivered into the muscle, it skips the digestive system entirely for reliable absorption.",
      stats: [
        {
          value: "Active form",
          label: "Methylcobalamin is ready to use — no conversion step required",
        },
        {
          value: "~1 in 10",
          label: "Adults over 60 are estimated to be low in B12 — and many younger adults too",
        },
      ],
    },
    cardsHeading: "What B12 supports in the body",
    cards: [
      {
        category: "Supports",
        title: "Energy",
        bullets: [
          "Key role in energy metabolism",
          "Helps turn food into usable fuel",
          "The classic \"why am I so tired\" check",
        ],
      },
      {
        category: "Supports",
        title: "Nerves",
        bullets: [
          "Essential for healthy nerve function",
          "Supports the protective nerve coating",
          "Tied to the \"tingling/numbness\" story",
        ],
      },
      {
        category: "Supports",
        title: "Mood & focus",
        bullets: [
          "Involved in neurotransmitter production",
          "Linked to mental clarity",
          "Why people mention \"less foggy\"",
        ],
      },
      {
        category: "Supports",
        title: "Blood & cells",
        bullets: [
          "Needed for red blood cell formation",
          "Part of healthy DNA synthesis",
          "Deficiency is linked to anemia",
        ],
      },
    ],
    duo: [
      {
        title: "Injection (IM)",
        body:
          "A quick intramuscular shot, the form most associated with med spas and wellness clinics. Bypasses digestion for dependable absorption — popular with people who want a simple, reliable B12 boost. Always given by a trained provider.",
      },
      {
        title: "Oral & sublingual",
        body:
          "Tablets, capsules, and under-the-tongue forms are convenient and widely available. They work for many people — though absorption can vary, especially for those with gut or absorption issues, which is part of why some prefer the shot.",
      },
    ],
    callouts: [
      {
        title: "Why \"methylated\" matters to some people",
        body:
          "Most B12 supplements use cyanocobalamin, which your body has to convert into the active form first. Methylcobalamin is already in that active form — which is appealing for people whose bodies don't convert as efficiently. Both forms work; methyl B12 just skips a step.",
      },
      {
        title: "How we think about it at Hello Gorgeous",
        body:
          "We love B12 because it's simple, safe, and genuinely helpful for the right person — and we'd always rather help you figure out if you're that person than just sell you a shot. Curious whether it makes sense for you? Let's talk about your energy, your goals, and whether a quick level check is worth doing first.",
      },
    ],
    expectationsTable: [
      {
        claim: "\"B12 melts fat\"",
        honest:
          "B12 itself isn't a weight-loss drug. It can support energy and metabolism if you're low, but it's not a fat burner on its own.",
      },
      {
        claim: "\"Instant energy for everyone\"",
        honest:
          "The lift is most noticeable in people who were actually deficient. If your levels are already good, you may not feel a dramatic change.",
      },
      {
        claim: "\"Replaces a healthy diet\"",
        honest: "Nope. It's a supplement to good nutrition, sleep, and movement — not a substitute for them.",
      },
      {
        claim: "\"You can't get too much\"",
        honest:
          "B12 is water-soluble and generally very safe, but dosing and frequency still deserve a provider's input — especially with other conditions.",
      },
    ],
    handoutFilename: "methyl-b12-and-your-energy.html",
  },
  {
    slug: "glutathione",
    name: "Glutathione",
    tagline: "The master antioxidant & the glow conversation",
    category: "Aesthetics",
    tier: "patient",
    accent: "#1f9d55",
    published: true,
    order: 2,
    series: "Hello Gorgeous · Wellness Science Series",
    metaDescription:
      "What glutathione is, why wellness clinics discuss it for glow and detox support, and realistic expectations. Hello Gorgeous Oswego.",
    pills: ["#Glutathione", "#MasterAntioxidant", "#SkinGlow", "#DetoxSupport", "#WellnessIV"],
    intro:
      "The body's \"master antioxidant\" — and a wellness favorite for detox support and skin brightening. Here's what it actually does and how to think about it clearly.",
    hero: {
      title: "So what is it, really?",
      body:
        "Glutathione is often called the body's \"master antioxidant.\" It's a small molecule (made of three amino acids) that your cells produce naturally, where it helps neutralize free radicals, support detox pathways in the liver, and protect cells from oxidative stress. In wellness settings it's offered as an IV or injection — and in skincare circles it's known for the \"brightening / glow\" conversation.",
      stats: [
        {
          value: "Master antioxidant",
          label: "A naturally produced molecule central to the body's antioxidant defense",
        },
        {
          value: "↓ With age & stress",
          label: "Levels can dip with age, stress, and lifestyle — the wellness interest",
        },
      ],
    },
    cardsHeading: "What it's known for",
    cards: [
      {
        category: "Known for",
        title: "Antioxidant",
        bullets: [
          "Neutralizes free radicals",
          "Supports cellular defense",
          "The core of its reputation",
        ],
      },
      {
        category: "Known for",
        title: "Skin glow",
        bullets: [
          "Popular for brightness & glow",
          "Tied to even-tone conversations",
          "The aesthetic angle",
        ],
      },
      {
        category: "Known for",
        title: "Detox support",
        bullets: [
          "Supports liver detox pathways",
          "A natural part of the system",
          "Why it pairs with wellness IVs",
        ],
      },
      {
        category: "Known for",
        title: "Recovery",
        bullets: [
          "Studied for oxidative-stress recovery",
          "Often in \"reset\" IV menus",
          "A wellness mainstay",
        ],
      },
    ],
    duo: [
      {
        title: "IV & injection",
        body:
          "The forms most associated with wellness clinics, delivered for high absorption. Because they're administered, they're a provider-led service — proper screening and a qualified hand always apply.",
      },
      {
        title: "Oral & topical",
        body:
          "Capsules and serums are widely available and convenient. Oral absorption is debated (the molecule is fragile), and topical works on the surface — both are gentler, lower-key options.",
      },
    ],
    callouts: [
      {
        title: "The skin-glow conversation, honestly",
        body:
          "Glutathione is hugely popular for skin brightening, especially in IV form. The honest version: evidence is strongest as an antioxidant, the brightening effect is more modest and gradual than social media suggests, and results vary. It's a \"support\" ingredient, not a magic switch.",
      },
      {
        title: "How we think about it at Hello Gorgeous",
        body:
          "We love helping Oswego clients understand what's realistic — glow support, antioxidant science, and the fundamentals still matter. If glutathione is on your radar, let's talk about your goals and whether it's a fit for your wellness plan.",
      },
    ],
    expectationsTable: [
      {
        claim: "\"Instant glow transformation\"",
        honest:
          "Any brightening effect tends to be gradual and individual — not an overnight filter.",
      },
      {
        claim: "\"Full-body detox in one IV\"",
        honest:
          "Your liver already detoxes constantly. Glutathione supports antioxidant pathways — it doesn't replace healthy habits.",
      },
      {
        claim: "\"Works the same orally and IV\"",
        honest:
          "Delivery route matters. Oral absorption is debated; IV bypasses digestion but requires proper medical setting.",
      },
      {
        claim: "\"No screening needed\"",
        honest:
          "Administered therapies deserve history review and provider oversight — especially with medications or health conditions.",
      },
    ],
    handoutFilename: "glutathione-and-the-glow.html",
  },
  {
    slug: "lipo-mic",
    name: "Lipo / MIC",
    tagline: "Lipotropic support shots — what's actually in them",
    category: "Weight Health",
    tier: "patient",
    accent: "#d2691e",
    published: true,
    order: 1,
    series: "Hello Gorgeous · Wellness Science Series",
    metaDescription:
      "Learn what's in Lipo/MIC shots, how lipotropic support works, and honest weight-health expectations. Hello Gorgeous Med Spa Oswego.",
    pills: ["#LipoMIC", "#Lipotropic", "#Methionine", "#Inositol", "#Choline"],
    intro:
      "The popular \"fat-support\" shot — methionine, inositol, choline, and usually B12. Here's what's actually in it, what it does, and honest expectations.",
    hero: {
      title: "So what is it, really?",
      body:
        "Lipo / MIC shots are \"lipotropic\" injections — a blend of compounds that support how the body processes and transports fat. MIC stands for the three classics: Methionine, Inositol, and Choline, usually paired with B12 and sometimes other B vitamins. They're popular as an add-on in weight-management and energy-support routines.",
      stats: [
        {
          value: "M · I · C",
          label: "Methionine, Inositol, Choline — the lipotropic trio, often + B12",
        },
        {
          value: "Add-on role",
          label: "A support shot, most useful alongside a real plan",
        },
      ],
    },
    cardsHeading: "What's in it & why",
    cards: [
      {
        category: "Ingredient",
        title: "Methionine",
        bullets: [
          "An amino acid",
          "Supports fat metabolism",
          "Part of liver/detox pathways",
        ],
      },
      {
        category: "Ingredient",
        title: "Inositol",
        bullets: [
          "A vitamin-like compound",
          "Tied to fat & sugar handling",
          "Supports the metabolic picture",
        ],
      },
      {
        category: "Ingredient",
        title: "Choline",
        bullets: [
          "An essential nutrient",
          "Helps move & process fat",
          "Liver-support role",
        ],
      },
      {
        category: "Ingredient",
        title: "B12 (often added)",
        bullets: [
          "The classic energy partner",
          "Supports metabolism",
          "Why these shots feel energizing",
        ],
      },
    ],
    callouts: [
      {
        title: "What \"lipotropic\" actually means",
        body:
          "\"Lipotropic\" means it helps with the transport and metabolism of fat in the body — it's about supporting your metabolism, not melting fat directly. These shots are a complement to nutrition and movement, not a replacement for them.",
      },
      {
        title: "How we think about it at Hello Gorgeous",
        body:
          "Lipo/MIC can be a sensible add-on when you're already doing the work — nutrition, movement, and a plan you can stick with. We'd rather build that foundation with you in Oswego than sell a shot as a shortcut.",
      },
    ],
    expectationsTable: [
      {
        claim: "\"Fat-melting shot\"",
        honest:
          "It supports fat metabolism — it doesn't dissolve fat on its own. The real work is diet, movement, and consistency.",
      },
      {
        claim: "\"Lose weight without trying\"",
        honest: "No shot replaces the fundamentals. Lipo/MIC is an add-on to a plan, not the plan itself.",
      },
      {
        claim: "\"Works for everyone equally\"",
        honest:
          "Benefit varies, and is often most noticeable as an energy/support boost alongside other efforts.",
      },
      {
        claim: "\"Same as GLP-1 medications\"",
        honest:
          "Completely different category. Lipotropic shots are nutrient support — not appetite-regulating prescription medicines.",
      },
    ],
    handoutFilename: "lipo-mic-and-metabolism.html",
  },
  {
    slug: "semaglutide",
    name: "Semaglutide",
    tagline: "FDA-approved GLP-1 science & honest weight-health expectations",
    category: "Weight Health",
    tier: "patient",
    accent: "#1f9d55",
    published: true,
    order: 2,
    series: "Hello Gorgeous · Wellness Science Series",
    metaDescription:
      "Educational guide to semaglutide — how GLP-1 medications work, titration, and realistic expectations. Hello Gorgeous Med Spa Oswego.",
    pills: ["#Semaglutide", "#GLP1", "#WeightHealth", "#BloodSugar", "#ProviderGuided"],
    intro:
      "An FDA-approved GLP-1 medication that's reshaped the weight-health conversation. Here's what it actually does, how it works, and what honest expectations look like.",
    hero: {
      title: "So what is it, really?",
      body:
        "Semaglutide is the FDA-approved peptide medication behind some of the most well-known weight-management and type 2 diabetes brands. It's a GLP-1 receptor agonist — it mimics a natural gut hormone (GLP-1) your body releases after eating, which helps you feel full sooner, stay full longer, and steady blood sugar. It's typically a once-weekly injection, always prescription and provider-guided.",
      stats: [
        {
          value: "Once weekly",
          label: "Typically a weekly subcutaneous injection, prescribed and monitored",
        },
        {
          value: "FDA-approved",
          label: "An established medication — a real prescription, not a supplement",
        },
      ],
    },
    cardsHeading: "How it helps",
    cards: [
      {
        category: "Mechanism",
        title: "Appetite",
        bullets: [
          "Mimics the GLP-1 hormone",
          "Helps you feel full sooner",
          "Reduces \"food noise\" for many",
        ],
      },
      {
        category: "Mechanism",
        title: "Slows digestion",
        bullets: [
          "Slows how fast the stomach empties",
          "You stay satisfied longer",
          "Smaller portions feel like enough",
        ],
      },
      {
        category: "Mechanism",
        title: "Blood sugar",
        bullets: [
          "Helps steady blood sugar",
          "Origin in diabetes care",
          "Why it's dual-purpose",
        ],
      },
      {
        category: "Mechanism",
        title: "Gradual change",
        bullets: [
          "Started low, increased slowly",
          "Titration reduces side effects",
          "A weeks-to-months journey",
        ],
      },
    ],
    callouts: [
      {
        title: "Why the slow titration matters",
        body:
          "Semaglutide is almost always started at a low dose and stepped up gradually. That's not a delay tactic — it's how the body adjusts and how the most common side effects (nausea, GI upset) are kept manageable. Patience here is part of doing it right.",
      },
      {
        title: "The plan around the medication",
        body:
          "GLP-1 therapy works best alongside protein-forward nutrition, hydration, movement, and follow-up with your provider. The medication is one piece — not the whole strategy.",
      },
    ],
    expectationsTable: [
      {
        claim: "\"Easy weight loss with no effort\"",
        honest:
          "It changes appetite and fullness — you still need habits, protein, and a sustainable plan. Side effects happen and titration matters.",
      },
      {
        claim: "\"Works the same for everyone\"",
        honest:
          "Responses vary. Some people feel dramatic appetite change; others notice gradual shift over weeks.",
      },
      {
        claim: "\"Set it and forget it\"",
        honest:
          "Ongoing monitoring, dose adjustments, and lifestyle support are part of responsible use.",
      },
      {
        claim: "\"Any source is fine if it's cheaper\"",
        honest:
          "FDA-approved medications should come through legitimate pharmacy channels with a prescription — not unverified sellers.",
      },
    ],
    handoutFilename: "semaglutide-and-weight-health.html",
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    tagline: "Dual GLP-1/GIP action — what makes it different",
    category: "Weight Health",
    tier: "patient",
    accent: "#1f8fa8",
    published: true,
    order: 3,
    series: "Hello Gorgeous · Wellness Science Series",
    metaDescription:
      "Learn how tirzepatide works as a dual GLP-1/GIP medication, realistic expectations, and why provider guidance matters. Hello Gorgeous Oswego.",
    pills: ["#Tirzepatide", "#GLP1", "#GIP", "#WeightHealth", "#ProviderGuided"],
    intro:
      "An FDA-approved dual-action GLP-1/GIP medication. Here's what makes it different, how it compares, and what realistic expectations look like.",
    hero: {
      title: "So what is it, really?",
      body:
        "Tirzepatide is an FDA-approved peptide medication that activates two pathways — GLP-1 and GIP — both involved in appetite, fullness, and blood sugar regulation. It's the science behind well-known brand medications for type 2 diabetes and chronic weight management. Like other GLP-1-class drugs, it's a prescription therapy with gradual dose titration and ongoing provider oversight.",
      stats: [
        {
          value: "Dual action",
          label: "Works on GLP-1 and GIP receptors — two related metabolic signals",
        },
        {
          value: "FDA-approved",
          label: "Established prescription medication with labeled indications and monitoring",
        },
      ],
    },
    cardsHeading: "How it helps",
    cards: [
      {
        category: "Mechanism",
        title: "Dual pathways",
        bullets: [
          "Activates GLP-1 and GIP",
          "Broader metabolic signaling",
          "Why it's discussed as \"next gen\"",
        ],
      },
      {
        category: "Mechanism",
        title: "Appetite",
        bullets: [
          "Helps reduce hunger signals",
          "Supports smaller, satisfying portions",
          "Often described as quieter \"food noise\"",
        ],
      },
      {
        category: "Mechanism",
        title: "Blood sugar",
        bullets: [
          "Studied for glycemic control",
          "Rooted in diabetes medicine",
          "Metabolic health is part of the story",
        ],
      },
      {
        category: "Mechanism",
        title: "Titration",
        bullets: [
          "Started low, increased over time",
          "Side-effect management built in",
          "Patience is part of the protocol",
        ],
      },
    ],
    callouts: [
      {
        title: "How it compares in conversation",
        body:
          "Tirzepatide is often compared to single-pathway GLP-1 medications because of its dual mechanism. Which option fits someone is a medical decision based on history, goals, tolerability, and access — not a popularity contest.",
      },
      {
        title: "Safe sourcing still matters",
        body:
          "With compounding restrictions evolving for GLP-1 medications, legitimate prescribing and licensed pharmacy sourcing protect you. If something feels like a gray-market shortcut, ask harder questions.",
      },
    ],
    expectationsTable: [
      {
        claim: "\"Automatically better than every GLP-1\"",
        honest:
          "Dual action is interesting science — individual response, side effects, and clinical fit still determine what's right for you.",
      },
      {
        claim: "\"No lifestyle changes needed\"",
        honest:
          "Medication supports appetite and metabolism; sustainable results still lean on nutrition, protein, movement, and follow-up.",
      },
      {
        claim: "\"Instant results\"",
        honest:
          "Most people experience gradual change over weeks as doses titrate — not overnight transformation.",
      },
      {
        claim: "\"One-size dose for everyone\"",
        honest:
          "Dosing is individualized and adjusted over time with your provider.",
      },
    ],
    handoutFilename: "tirzepatide-and-weight-health.html",
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    tagline: "Pipeline science — what's known before it's available",
    category: "Weight Health",
    tier: "education",
    accent: "#c0436b",
    published: true,
    order: 4,
    series: "Hello Gorgeous · Science Explainer Series",
    metaDescription:
      "Honest education on retatrutide — investigational triple-agonist science, trial status, and why it's not available yet. Hello Gorgeous Oswego.",
    pills: ["#Retatrutide", "#TripleAgonist", "#Pipeline", "#WeightHealth", "#NotAvailableYet"],
    intro:
      "The most talked-about drug in the weight-health pipeline — and one that isn't actually available yet. Here's an honest look at what it is, where it stands, and why caution matters.",
    hero: {
      title: "So what is it?",
      body:
        "Retatrutide is an investigational medication studied as a \"triple agonist\" — meaning it targets three metabolic hormone pathways (GLP-1, GIP, and glucagon-related signaling). Early clinical trial data generated headlines, which is why it's all over social media. Investigational means not approved, not commercially available for prescription use, and not something you should be able to buy.",
      stats: [
        {
          value: "Investigational",
          label: "Still in clinical development — not an approved product you can legitimately obtain",
        },
        {
          value: "Triple pathway",
          label: "Studied as GLP-1 + GIP + glucagon agonism — broader than single-pathway drugs",
        },
      ],
    },
    cardsHeading: "Why it's in the conversation",
    cards: [
      {
        category: "Science",
        title: "Triple agonist",
        bullets: [
          "Targets three related pathways",
          "Different design from current GLP-1s",
          "Why researchers are watching trials",
        ],
      },
      {
        category: "Science",
        title: "Trial data",
        bullets: [
          "Early phase results made news",
          "Still needs larger, longer studies",
          "Headlines ≠ finished approval story",
        ],
      },
      {
        category: "Science",
        title: "Metabolic scope",
        bullets: [
          "Studied for weight & metabolic markers",
          "Part of the obesity-medicine pipeline",
          "Long-term safety still being evaluated",
        ],
      },
      {
        category: "Science",
        title: "Not for sale",
        bullets: [
          "No legitimate retail product yet",
          "Investigational status is the point",
          "Online \"retatrutide\" is a red flag",
        ],
      },
    ],
    callouts: [
      {
        title: "If you see it for sale, pause",
        body:
          "Investigational drugs shouldn't be in consumer hands. Products marketed online as retatrutide are unapproved, unregulated, and impossible to trust for identity, sterility, or dose. That's not a bargain — it's a safety gamble.",
      },
      {
        title: "What's available now — honestly",
        body:
          "If weight health is the goal today, there are FDA-approved GLP-1 and dual-agonist options with established prescribing pathways. Pipeline excitement is real; waiting for science to finish its job is part of being a smart consumer.",
      },
    ],
    expectationsTable: [
      {
        claim: "\"The miracle drug is here\"",
        honest:
          "It's not \"here\" for patients yet — it's in trials. Early data is promising; approval and long-term safety aren't done.",
      },
      {
        claim: "\"Skip the wait — buy it online\"",
        honest:
          "That bypasses every safety system. No licensed prescriber, no legitimate pharmacy, no accountability.",
      },
      {
        claim: "\"Will work better for everyone\"",
        honest:
          "Even if approved someday, individual response will vary — as it does with every metabolic medication.",
      },
      {
        claim: "\"Same as compounded GLP-1s\"",
        honest:
          "Different molecule, different status. Conflating pipeline drugs with current prescriptions creates dangerous confusion.",
      },
    ],
    handoutFilename: "retatrutide-what-to-know.html",
  },
  {
    slug: "sermorelin",
    name: "Sermorelin",
    tagline: "Sleep, energy & natural growth hormone support — Hello Gorgeous RX™",
    category: "Hormone Support",
    tier: "prescription",
    accent: "#8a3fb0",
    published: true,
    order: 1,
    series: "Hello Gorgeous · Wellness Science Series",
    metaDescription:
      "Learn what sermorelin is, how it differs from direct HGH, and why it's a prescription provider conversation. Hello Gorgeous Med Spa Oswego.",
    pills: ["#Sermorelin", "#GrowthHormone", "#HormoneOptimization", "#HealthyAging", "#PrescriptionOnly"],
    intro:
      "A prescription peptide that's become a talking point in hormone-optimization and healthy-aging circles. Here's what it actually is, how it differs from HGH, and why it's a conversation that starts with a provider.",
    hero: {
      title: "So what is it, really?",
      body:
        "Sermorelin is a synthetic peptide that mirrors part of your body's own growth-hormone-releasing hormone (GHRH). Instead of adding growth hormone from the outside, it gently signals your pituitary gland to make more of its own — in the body's natural, pulsing rhythm. It was originally FDA-approved decades ago, and today it's a prescription peptide typically prepared by compounding pharmacies for adults exploring hormone optimization.",
      stats: [
        {
          value: "Your own GH",
          label: "Signals your body to produce its own growth hormone, rather than replacing it",
        },
        {
          value: "℞ only",
          label: "A prescription medication — requires a provider's evaluation and a pharmacy",
        },
      ],
    },
    cardsHeading: "What the conversation usually includes",
    cards: [
      {
        category: "Discussed for",
        title: "Sleep quality",
        bullets: [
          "Often tied to recovery & rest",
          "Part of the \"why am I tired\" workup",
          "Individual responses vary",
        ],
      },
      {
        category: "Discussed for",
        title: "Body composition",
        bullets: [
          "Lean-mass & fat-metabolism interest",
          "Works gradually, not overnight",
          "Lifestyle still matters most",
        ],
      },
      {
        category: "Discussed for",
        title: "Vitality",
        bullets: [
          "Energy & recovery conversations",
          "Explored in optimization programs",
          "Always with labs when appropriate",
        ],
      },
      {
        category: "Discussed for",
        title: "Aging well",
        bullets: [
          "GH axis declines with age",
          "Framed as support, not reversal",
          "Honest timelines are months",
        ],
      },
    ],
    duo: [
      {
        title: "Sermorelin vs. direct HGH",
        body:
          "Sermorelin prompts your pituitary to release your own growth hormone, preserving natural pulsing and feedback loops. Direct HGH adds preformed hormone from the outside, bypassing the body's regulation. That's a meaningful difference — and why sermorelin is often described as a more physiologic approach in optimization conversations.",
      },
      {
        title: "Why labs and history come first",
        body:
          "Anything that touches the growth-hormone axis deserves screening — symptoms, medications, sleep, and lab work when indicated. There's no responsible one-size protocol; it's individualized medical decision-making.",
      },
    ],
    callouts: [
      {
        title: "Prescription-only means oversight",
        body:
          "Sermorelin isn't a wellness trend you grab off a shelf. It requires evaluation, a prescription, licensed pharmacy sourcing, and follow-up. That's the lane that protects you.",
      },
      {
        title: "How we think about it at Hello Gorgeous",
        body:
          "We're happy to explain the science and walk through whether hormone optimization even makes sense for your goals. No pressure, no miracle language — just a straight conversation with our Oswego clinical team.",
      },
    ],
    expectationsTable: [
      {
        claim: "Better sleep & morning energy",
        honest:
          "Many clients explore sermorelin when they're tired despite \"doing everything right\" — response is individual and gradual.",
      },
      {
        claim: "Body composition support",
        honest:
          "Lean mass and fat metabolism conversations over months — paired with training, protein, and sleep hygiene.",
      },
      {
        claim: "Your own growth hormone",
        honest:
          "Signals your pituitary instead of replacing hormone from outside — a more physiologic approach when appropriate.",
      },
      {
        claim: "NP-led monitoring",
        honest:
          "Labs and follow-up when indicated — part of Hello Gorgeous RX™, not a DIY protocol.",
      },
    ],
    handoutFilename: "sermorelin-and-growth-hormone.html",
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    tagline: "Visceral fat & GH axis support — Hello Gorgeous RX™",
    category: "Hormone Support",
    tier: "prescription",
    accent: "#8a3fb0",
    published: true,
    order: 2,
    series: "Hello Gorgeous · Wellness Science Series",
    metaDescription:
      "Educational guide to tesamorelin — GHRH science, how it compares to sermorelin, and prescription expectations. Hello Gorgeous Oswego.",
    pills: ["#Tesamorelin", "#GHRH", "#GrowthHormone", "#VisceralFat", "#PrescriptionOnly"],
    intro:
      "A prescription GHRH peptide best known for visceral-fat research. Here's what it is, how it compares to sermorelin, and why it's a provider conversation.",
    hero: {
      title: "So what is it, really?",
      body:
        "Tesamorelin is a peptide in the same family as sermorelin — a growth-hormone-releasing hormone (GHRH) analog. It signals the pituitary to release the body's own growth hormone. It has an FDA-approved form for a specific medical indication, and is also prepared by compounding pharmacies. Like sermorelin, it's a prescription peptide and a provider-led decision.",
      stats: [
        {
          value: "GHRH analog",
          label: "Signals the body to release its own growth hormone",
        },
        {
          value: "℞ only",
          label: "A prescription peptide — provider evaluation required",
        },
      ],
    },
    cardsHeading: "What it's studied & used for",
    cards: [
      {
        category: "Discussed for",
        title: "Visceral fat",
        bullets: [
          "Best known for visceral fat research",
          "The deep abdominal kind",
          "Its most-studied area",
        ],
      },
      {
        category: "Discussed for",
        title: "Body comp",
        bullets: [
          "Lean-mass & composition goals",
          "Part of optimization talk",
          "Often a targeted choice",
        ],
      },
      {
        category: "Discussed for",
        title: "Metabolic",
        bullets: [
          "Lipid-profile research",
          "Metabolic-health interest",
          "A more specific peptide",
        ],
      },
      {
        category: "Discussed for",
        title: "Vitality",
        bullets: [
          "Sleep & recovery interest",
          "Active-aging conversations",
          "Always provider-guided",
        ],
      },
    ],
    duo: [
      {
        title: "How it differs from sermorelin",
        body:
          "Both are GHRH analogs that prompt your own GH. Tesamorelin is most associated with research on visceral (deep abdominal) fat and tends to be a more targeted, specific choice, while sermorelin is often the broader \"entry\" GH-support peptide. Which (if either) fits you is a clinical call.",
      },
      {
        title: "Safety thinking first",
        body:
          "Any hormone-affecting therapy needs screening and monitoring — especially with other conditions, medications, or cancer history. Favorable design doesn't mean no oversight.",
      },
    ],
    callouts: [
      {
        title: "Not spot reduction",
        body:
          "Visceral-fat research is its claim to fame, but it's gradual, individual, and works alongside lifestyle — not a magic belly-fat melter.",
      },
      {
        title: "How we think about it at Hello Gorgeous",
        body:
          "If body composition and hormone optimization are on your mind, we start with goals, history, and labs — then discuss whether a GHRH peptide belongs in the picture at all.",
      },
    ],
    expectationsTable: [
      {
        claim: "\"Targeted belly-fat melter\"",
        honest:
          "Visceral-fat research is its claim to fame, but it's gradual, individual, and works alongside lifestyle — not spot reduction.",
      },
      {
        claim: "\"Same as HGH\"",
        honest:
          "No — it prompts your own GH, preserving natural rhythm, rather than adding GH directly.",
      },
      {
        claim: "\"Risk-free\"",
        honest:
          "Any hormone-affecting therapy needs screening and monitoring. Favorable design ≠ no oversight.",
      },
      {
        claim: "\"Pick tesamorelin over sermorelin always\"",
        honest:
          "Different profiles and goals. The right choice — if any — is individualized after evaluation.",
      },
    ],
    handoutFilename: "tesamorelin-and-gh-support.html",
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 / Ipamorelin",
    tagline:
      "The GH peptide stack for sleep, recovery & body composition — Hello Gorgeous RX™ · Oswego & Fox Valley",
    category: "Hormone Support",
    tier: "prescription",
    accent: "#3b82f6",
    published: true,
    order: 3,
    series: "Hello Gorgeous · Wellness Science Series",
    metaTitle:
      "CJC-1295 & Ipamorelin Peptide Therapy Oswego IL | Hello Gorgeous Med Spa",
    metaDescription:
      "Medically supervised CJC-1295 / Ipamorelin stack in Oswego, IL — serving Naperville, Aurora, Plainfield & Fox Valley. NP-led GH peptide education, RE GEN catalog & consult.",
    pills: [
      "#CJC1295",
      "#Ipamorelin",
      "#GrowthHormone",
      "#SleepRecovery",
      "#PrescriptionOnly",
    ],
    intro:
      "Two peptides that work on different parts of the same growth-hormone axis — often run together as the most-requested GH stack in our clinic. CJC-1295 amplifies the GHRH signal; ipamorelin triggers a selective GH pulse through a separate receptor. Here's what that means, what the research explores, and why it's an NP conversation — not a DIY protocol.",
    hero: {
      title: "Two pathways, one naturalistic pulse",
      body:
        "CJC-1295 is a long-acting growth-hormone-releasing hormone (GHRH) analog — it mimics the upstream signal from your hypothalamus. Ipamorelin is a growth hormone secretagogue (GHRP) that acts on the ghrelin receptor at the pituitary for a selective GH release. Used together under medical supervision, they aim to support your body's own overnight GH rhythm rather than replacing hormone from the outside. Both are prescription peptides from licensed compounding pharmacies — not FDA-approved as finished retail products.",
      stats: [
        {
          value: "GHRH + GHRP",
          label: "Complementary mechanisms — often stacked for a stronger, more natural pulse",
        },
        {
          value: "℞ only",
          label: "Ryan Kent, FNP-BC · Hello Gorgeous RX™ · Oswego, IL",
        },
      ],
    },
    cardsHeading: "Where the research is pointing",
    cards: [
      {
        category: "Discussed for",
        title: "Sleep & recovery",
        bullets: [
          "Much of GH release happens during deep sleep",
          "Often dosed at bedtime to match the natural cycle",
          "Recovery from training may track with sleep gains",
        ],
      },
      {
        category: "Discussed for",
        title: "Lean body composition",
        bullets: [
          "Gradual shift toward lean mass over months",
          "Works alongside training & protein intake",
          "Individual outcomes vary — no guarantees",
        ],
      },
      {
        category: "Discussed for",
        title: "Energy & well-being",
        bullets: [
          "Explored when GH axis declines with age",
          "Human evidence still building",
          "Supportive tool, not a cure-all",
        ],
      },
      {
        category: "Discussed for",
        title: "Selective GH pulse",
        bullets: [
          "Ipamorelin often chosen for selectivity in research",
          "Minimal cortisol/prolactin shifts vs older GHRPs",
          "Feedback loops stay intact vs direct HGH",
        ],
      },
    ],
    duo: [
      {
        title: "CJC-1295 — the GHRH analog",
        body:
          "CJC-1295 mimics growth hormone-releasing hormone, the upstream signal that asks the pituitary to release growth hormone in pulses. The longer-acting profile (including a DAC variant in some protocols) is why clinicians often pair it with a GHRP rather than using sermorelin alone when a stronger combined signal is the goal.",
      },
      {
        title: "Ipamorelin — the selective secretagogue",
        body:
          "Ipamorelin triggers a GH pulse through the ghrelin receptor — a separate pathway from GHRH. Published reports often describe it as more selective than older GHRPs, with minimal effect on cortisol or prolactin. It's commonly dosed near bedtime because that's when your body naturally releases the most growth hormone.",
      },
      {
        title: "Why the pair is run together",
        body:
          "CJC-1295 turns up the GHRH signal while ipamorelin opens a second release pathway. Research and clinical practice suggest the combination can produce a stronger, more naturalistic GH pulse than either peptide alone — while keeping the body's feedback loops intact, unlike direct HGH replacement.",
      },
      {
        title: "CJC / ipamorelin vs sermorelin vs direct HGH",
        body:
          "Sermorelin is often the gentler GHRH entry point. The CJC / ipamorelin stack is usually the next step when sleep, recovery, and body-composition goals need a stronger combined signal. Direct HGH adds hormone from the outside and bypasses pituitary regulation — a different risk profile and clinical decision entirely. We walk through which lane fits at your consult.",
      },
    ],
    callouts: [
      {
        title: "Honest timelines",
        body:
          "Many clients notice sleep-quality shifts in the first few weeks. Body composition and vitality changes typically take two to three months or longer and are evaluated cycle by cycle. We don't promise specific results — individual response varies.",
      },
      {
        title: "Not FDA-approved as finished products",
        body:
          "Neither CJC-1295 nor ipamorelin is FDA approved as a finished drug product for general wellness use. Both are dispensed through licensed compounding pharmacies under medical supervision after evaluation. We discuss regulatory status openly at every consult.",
      },
      {
        title: "How we think about it at Hello Gorgeous",
        body:
          "Our Oswego team — including Ryan Kent, FNP-BC — starts with goals, history, and labs when indicated. If a GH peptide belongs in the picture, we match the right stack (sermorelin, tesamorelin / ipamorelin, or CJC / ipamorelin) to your situation. Browse the full RE GEN catalog or book a consult to begin.",
      },
    ],
    expectationsTable: [
      {
        claim: "Better sleep & morning energy",
        honest:
          "Often the first thing clients explore — gradual, individual, and paired with sleep hygiene. Many protocols dose at bedtime.",
      },
      {
        claim: "Body composition support",
        honest:
          "Lean-mass and fat-metabolism conversations over months — never overnight. Training and nutrition still matter most.",
      },
      {
        claim: "Your own growth hormone",
        honest:
          "Prompts natural pulsatile release rather than adding HGH from outside — preserving feedback loops when clinically appropriate.",
      },
      {
        claim: "The \"miracle stack\"",
        honest:
          "Active area of clinical interest, not magic. We frame it as a potentially supportive tool with honest evidence limits.",
      },
      {
        claim: "NP-led monitoring",
        honest:
          "Screening, prescription, pharmacy sourcing, and follow-up — part of Hello Gorgeous RX™, not a gray-market protocol.",
      },
    ],
    faqs: [
      {
        question: "What are CJC-1295 and ipamorelin?",
        answer:
          "CJC-1295 is a GHRH analog that amplifies the upstream signal for growth hormone release. Ipamorelin is a selective GH secretagogue (GHRP) that triggers a GH pulse through the ghrelin receptor. They are often prescribed together so both pathways act in complement. Both require a provider evaluation and prescription through a licensed compounding pharmacy.",
      },
      {
        question: "Why are CJC-1295 and ipamorelin used together?",
        answer:
          "They act on two complementary parts of the growth hormone axis — GHRH signaling and ghrelin-receptor signaling at the pituitary. Running them together is intended to produce a stronger, more naturalistic GH pulse than either peptide alone, while keeping the body's feedback loops intact.",
      },
      {
        question: "Where can I get CJC-1295 / ipamorelin near Oswego or Naperville?",
        answer:
          "Hello Gorgeous Med Spa is in Oswego, IL — serving Naperville, Aurora, Plainfield, Yorkville, Montgomery, and the Fox Valley. After an NP consult, eligible patients can access the stack through Hello Gorgeous RX™ and our RE GEN pharmacy catalog. Book online or start a peptide request from our website.",
      },
      {
        question: "How is this different from direct HGH?",
        answer:
          "Direct HGH replacement supplies growth hormone from the outside and bypasses the pituitary's natural regulation. CJC-1295 and ipamorelin ask your pituitary to release your own GH in pulses. The right approach depends on your clinical picture — we discuss both at consultation.",
      },
      {
        question: "Ipamorelin vs sermorelin — which is better?",
        answer:
          "Sermorelin is often a gentler GHRH starting point. Ipamorelin is a GHRP and is usually paired with CJC-1295 (a longer-acting GHRH analog) when a stronger combined signal is the goal. Some patients rotate protocols over time. Your provider matches the option to your goals, tolerability, and history.",
      },
      {
        question: "How are CJC-1295 and ipamorelin injected?",
        answer:
          "Both are typically given as small subcutaneous injections, often nightly before bed to align with the body's natural overnight GH pulse. We provide technique, storage, and timing guidance at your appointment — and dosing is individualized, not one-size-fits-all.",
      },
      {
        question: "How long until I notice changes?",
        answer:
          "Sleep-quality shifts are often reported within the first few weeks. Recovery, body composition, and well-being changes usually take longer — commonly two to three months or more — and are reassessed each cycle. Individual outcomes vary; we do not guarantee specific results.",
      },
      {
        question: "Are CJC-1295 and ipamorelin FDA approved?",
        answer:
          "No. Neither is FDA approved as a finished drug product for general wellness. Both are compounded prescription medications dispensed under medical supervision. We explain regulatory status clearly and never overstate what these peptides can do.",
      },
      {
        question: "Can I order CJC / ipamorelin online from Hello Gorgeous?",
        answer:
          "You can browse the RE GEN catalog and start a peptide request online, but prescription peptides require NP review, medical screening, and an approved care plan before pharmacy fulfillment. That's the lane that keeps you safe.",
      },
    ],
  },
  {
    slug: "test-topic",
    name: "Test Topic",
    tagline: "Unpublished placeholder for acceptance criteria",
    category: "Energy & Wellness",
    tier: "education",
    accent: "#D4537E",
    published: false,
    order: 99,
    series: "Hello Gorgeous · Internal QA",
    pills: ["#TestOnly"],
    intro: "This topic exists only for HG_DEV_011 acceptance verification and should not appear on the public hub.",
  },
];
