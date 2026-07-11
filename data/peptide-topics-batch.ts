/**
 * Batch peptide education topics — HG peptide landing page expansion.
 * Merged into PEPTIDE_TOPICS in data/peptides.ts.
 */

import type { PeptideTopic } from "@/data/peptides";

const SERIES = "Hello Gorgeous · Wellness Science Series";

function rx(partial: Omit<PeptideTopic, "tier" | "published" | "series">): PeptideTopic {
  return { tier: "prescription", published: true, series: SERIES, ...partial };
}

export const BATCH_PEPTIDE_TOPICS: PeptideTopic[] = [
  rx({
    slug: "tb-500",
    name: "TB-500",
    tagline: "Thymosin Beta-4 fragment for tissue repair, mobility & recovery — Hello Gorgeous RX™",
    category: "Recovery & Healing",
    accent: "#2563eb",
    order: 3,
    metaTitle: "TB-500 Peptide Therapy Oswego IL | Hello Gorgeous Med Spa",
    metaDescription:
      "TB-500 (Thymosin Beta-4) peptide education in Oswego, IL — tissue repair, flexibility & recovery. NP-led Hello Gorgeous RX™ · Naperville, Aurora & Fox Valley.",
    pills: ["#TB500", "#ThymosinBeta4", "#Recovery", "#Mobility", "#PrescriptionOnly"],
    intro:
      "TB-500 is a synthetic fragment of Thymosin Beta-4 — an actin-binding peptide your body uses in tissue repair and cell migration. At Hello Gorgeous it's one of the most-requested recovery peptides, often paired with BPC-157 when soft-tissue healing and mobility are the goal. Prescription-only through our NP-led RX program.",
    hero: {
      title: "The mobility & repair peptide",
      body:
        "Thymosin Beta-4 is naturally present in many tissues. The TB-500 fragment is studied for angiogenesis (new blood supply), actin regulation, and faster recovery from training or injury. Unlike BPC-157's gut-origin repair story, TB-500 is often framed around connective tissue, flexibility, and whole-body recovery signaling.",
      stats: [
        { value: "Actin", label: "Supports cell migration — a core step in tissue remodeling" },
        { value: "Stack", label: "Often paired with BPC-157 in recovery blends" },
      ],
    },
    cardsHeading: "Where the research is pointing",
    cards: [
      {
        category: "Discussed for",
        title: "Soft-tissue recovery",
        bullets: ["Muscle, tendon & ligament repair", "Post-training soreness goals", "Often in defined cycles"],
      },
      {
        category: "Discussed for",
        title: "Mobility & flexibility",
        bullets: ["Range-of-motion conversations", "Scar-tissue & adhesion support", "Active clients & athletes"],
      },
      {
        category: "Discussed for",
        title: "Blood supply",
        bullets: ["Angiogenesis research", "Nutrient delivery to healing sites", "Complements BPC pathways"],
      },
      {
        category: "Discussed for",
        title: "The Wolverine stack",
        bullets: ["BPC-157 + TB-500 combo", "Dual-pathway repair signal", "Popular at Hello Gorgeous"],
      },
    ],
    duo: [
      {
        title: "TB-500 vs BPC-157",
        body:
          "Both support recovery — through different mechanisms. BPC-157 is often discussed for gut lining and localized repair; TB-500 for actin-driven migration and flexibility. Many protocols combine them when a stronger combined signal makes clinical sense.",
      },
      {
        title: "How Hello Gorgeous prescribes it",
        body:
          "Ryan Kent, FNP-BC reviews your injury history, cancer screening, and goals before any peptide Rx. TB-500 is sourced through licensed compounding pharmacies — never gray-market research vials.",
      },
    ],
    callouts: [
      {
        title: "Honest timelines",
        body:
          "Recovery peptides are not overnight fixes. Many clients evaluate progress over several weeks to months, cycle by cycle, alongside rest, rehab, and nutrition.",
      },
      {
        title: "Not FDA-approved as finished products",
        body:
          "TB-500 is a compounded prescription peptide dispensed under medical supervision. We explain regulatory status clearly at every consult.",
      },
    ],
    expectationsTable: [
      {
        claim: "Faster tissue repair",
        honest: "Explored for soft-tissue recovery — individual response varies; we never guarantee specific outcomes.",
      },
      {
        claim: "Better mobility",
        honest: "Flexibility and range-of-motion goals are common reasons clients ask — paired with appropriate rehab when indicated.",
      },
      {
        claim: "Wolverine stack",
        honest: "BPC-157 + TB-500 is our most-requested recovery duo — prescribed only when your NP agrees the risk–benefit fits.",
      },
      {
        claim: "NP-led sourcing",
        honest: "Hello Gorgeous RX™ — screening, Rx, pharmacy fulfillment, and follow-up in one medical lane.",
      },
    ],
    faqs: [
      {
        question: "What is TB-500?",
        answer:
          "TB-500 is a research peptide fragment related to Thymosin Beta-4, studied for tissue repair, cell migration, and recovery. It requires provider evaluation and prescription through a licensed compounding pharmacy.",
      },
      {
        question: "Why combine TB-500 with BPC-157?",
        answer:
          "They act on complementary repair pathways — BPC-157 for gut and localized healing signals, TB-500 for actin-driven migration and flexibility. Together they're often called the Wolverine stack in clinical practice.",
      },
      {
        question: "Where can I get TB-500 near Oswego?",
        answer:
          "Hello Gorgeous Med Spa in downtown Oswego serves Naperville, Aurora, Plainfield, Yorkville, and the Fox Valley. Start a peptide request online or book a consult to begin.",
      },
      {
        question: "How is TB-500 injected?",
        answer:
          "Typically subcutaneous injection on a protocol your provider sets — including timing, cycle length, and storage guidance at your appointment.",
      },
      {
        question: "Is TB-500 FDA approved?",
        answer:
          "No — not as a finished wellness product. It is compounded under medical supervision after NP evaluation.",
      },
    ],
  }),

  rx({
    slug: "recovery-blend",
    name: "Recovery Blend",
    tagline: "BPC-157, GHK-Cu, KPV & TB-500 — advanced multi-peptide repair — Hello Gorgeous RX™",
    category: "Recovery & Healing",
    accent: "#1d4ed8",
    order: 4,
    metaTitle: "Recovery Blend Peptide Stack Oswego IL | Hello Gorgeous Med Spa",
    metaDescription:
      "Advanced recovery blend — BPC-157, GHK-Cu, KPV & TB-500 — NP-led peptide therapy in Oswego, IL. Hello Gorgeous RX™ education & consult.",
    pills: ["#RecoveryBlend", "#BPC157", "#TB500", "#GHKCu", "#KPV"],
    intro:
      "Our Recovery Blend combines four peptides in one vial — BPC-157 and TB-500 for repair signaling, GHK-Cu for collagen and skin remodeling support, and KPV for anti-inflammatory pathway conversations. It's the all-in-one option when clients want comprehensive recovery without juggling multiple vials.",
    hero: {
      title: "Four pathways, one protocol",
      body:
        "Each peptide in this blend targets a different part of the repair story: angiogenesis and gut-origin repair (BPC-157), actin-driven migration (TB-500), copper-peptide remodeling (GHK-Cu), and inflammatory modulation (KPV). Under NP supervision, the blend simplifies advanced recovery for appropriate candidates.",
      stats: [
        { value: "4-in-1", label: "BPC · TB-500 · GHK-Cu · KPV in one compounded vial" },
        { value: "Premium", label: "For clients who want the full repair stack" },
      ],
    },
    cards: [
      {
        category: "Component",
        title: "BPC-157",
        bullets: ["Tissue & gut repair signaling", "Tendon/ligament conversations", "Foundation of the blend"],
      },
      {
        category: "Component",
        title: "TB-500",
        bullets: ["Mobility & migration support", "Pairs with BPC synergistically", "Wolverine-stack DNA"],
      },
      {
        category: "Component",
        title: "GHK-Cu",
        bullets: ["Collagen & skin remodeling", "Copper peptide support", "Inside-out repair"],
      },
      {
        category: "Component",
        title: "KPV",
        bullets: ["Anti-inflammatory fragment", "Calms localized inflammation", "Completes the quartet"],
      },
    ],
    duo: [
      {
        title: "Who asks for the Recovery Blend",
        body:
          "Active clients post-injury, athletes between seasons, or anyone whose provider recommends a stronger combined signal than BPC or TB alone — always after full medical screening.",
      },
      {
        title: "Blends vs singles",
        body:
          "Singles let us titrate one peptide at a time; blends simplify compliance when you've already tried singles or need the full stack. Your NP helps you choose the right lane.",
      },
    ],
    callouts: [
      {
        title: "Also known as KLOW-style stacks",
        body:
          "Similar to premium 4-in-1 recovery stacks in the peptide world — we prescribe through Hello Gorgeous RX™ with pharmacy sourcing you can trust.",
      },
    ],
    expectationsTable: [
      {
        claim: "Comprehensive repair",
        honest: "Four mechanisms in one vial — convenience without skipping medical oversight.",
      },
      {
        claim: "Skin + tissue",
        honest: "GHK-Cu adds aesthetic remodeling support alongside structural recovery peptides.",
      },
      {
        claim: "Not DIY",
        honest: "Prescription-only — NP consult, screening, and follow-up required.",
      },
    ],
    faqs: [
      {
        question: "What is in the Recovery Blend?",
        answer:
          "BPC-157, TB-500, GHK-Cu, and KPV — four peptides compounded together for advanced recovery protocols when clinically appropriate.",
      },
      {
        question: "How is this different from BPC-157 alone?",
        answer:
          "BPC-157 is one part of the repair story. The blend adds TB-500 for migration/flexibility, GHK-Cu for collagen support, and KPV for inflammatory modulation.",
      },
      {
        question: "Can I request this online?",
        answer:
          "Yes — start a Hello Gorgeous RX™ peptide request. NP review and telehealth consult are required before any prescription ships.",
      },
    ],
  }),

  rx({
    slug: "heal-blend",
    name: "HEAL Blend",
    tagline: "BPC-157, KPV & TB-500 — targeted healing trio — Hello Gorgeous RX™ · Oswego",
    category: "Recovery & Healing",
    accent: "#1e40af",
    order: 5,
    metaTitle: "HEAL Blend Peptide Therapy Oswego IL | Hello Gorgeous Med Spa",
    metaDescription:
      "HEAL Blend — BPC-157, KPV & TB-500 peptide stack for recovery. NP-led Hello Gorgeous RX™ in Oswego, IL serving Fox Valley.",
    pills: ["#HEALBlend", "#BPC157", "#KPV", "#TB500", "#Recovery"],
    intro:
      "The HEAL Blend combines BPC-157, KPV, and TB-500 — three peptides focused on tissue repair, inflammatory calm, and mobility. It's a step up from the classic BPC + TB Wolverine stack, with KPV added for anti-inflammatory pathway support.",
    hero: {
      title: "Repair, calm, mobilize",
      body:
        "BPC-157 drives repair signaling, TB-500 supports actin-driven cell migration and flexibility, and KPV (a melanocortin fragment) is studied for inflammatory modulation. Together they form a focused healing trio prescribed under NP supervision.",
      stats: [
        { value: "3 peptides", label: "BPC-157 · KPV · TB-500" },
        { value: "Recovery", label: "Soft tissue, gut & inflammation goals" },
      ],
    },
    cards: [
      {
        category: "Role",
        title: "BPC-157",
        bullets: ["Core repair peptide", "Gut & soft-tissue support", "Angiogenesis research"],
      },
      {
        category: "Role",
        title: "TB-500",
        bullets: ["Migration & flexibility", "Connective tissue", "Synergy with BPC"],
      },
      {
        category: "Role",
        title: "KPV",
        bullets: ["Anti-inflammatory signaling", "Calms localized inflammation", "Completes the trio"],
      },
      {
        category: "Clinical",
        title: "When it's considered",
        bullets: ["Post-injury recovery", "Defined peptide cycles", "After NP screening"],
      },
    ],
    duo: [
      {
        title: "HEAL vs Recovery Blend",
        body:
          "HEAL is the BPC + KPV + TB trio without GHK-Cu. Recovery Blend adds copper-peptide skin remodeling. Your provider matches the blend to your goals and history.",
      },
      {
        title: "Medical oversight",
        body:
          "All Hello Gorgeous peptide blends require NP evaluation, cancer screening when indicated, and pharmacy fulfillment through licensed 503A partners.",
      },
    ],
    expectationsTable: [
      {
        claim: "Multi-pathway healing",
        honest: "Three complementary signals in one vial — simpler than stacking singles yourself.",
      },
      {
        claim: "Inflammation support",
        honest: "KPV adds an anti-inflammatory conversation to classic BPC/TB repair.",
      },
      {
        claim: "Prescription-only",
        honest: "Not available without Hello Gorgeous RX™ medical review.",
      },
    ],
    faqs: [
      {
        question: "What peptides are in the HEAL Blend?",
        answer: "BPC-157, KPV, and TB-500 — compounded together for recovery-focused protocols.",
      },
      {
        question: "Is HEAL the same as the Wolverine stack?",
        answer:
          "The Wolverine stack is BPC + TB. HEAL adds KPV for inflammatory pathway support — a step up when your provider recommends it.",
      },
      {
        question: "How do I start?",
        answer: "Book a consult or start a peptide request at Hello Gorgeous — we'll match the right blend after screening.",
      },
    ],
  }),

  rx({
    slug: "cjc-1295",
    name: "CJC-1295",
    tagline: "Long-acting GHRH analog for growth-hormone axis support — Hello Gorgeous RX™",
    category: "Hormone Support",
    accent: "#4f46e5",
    order: 4,
    metaTitle: "CJC-1295 Peptide Therapy Oswego IL | Hello Gorgeous Med Spa",
    metaDescription:
      "CJC-1295 GHRH analog — GH axis education in Oswego, IL. Often paired with ipamorelin. NP-led Hello Gorgeous RX™.",
    pills: ["#CJC1295", "#GHRH", "#GrowthHormone", "#PrescriptionOnly"],
    intro:
      "CJC-1295 is a long-acting growth-hormone-releasing hormone (GHRH) analog that amplifies the upstream signal asking your pituitary to release GH. In clinical practice it's rarely used alone — it's most often paired with a GH secretagogue like ipamorelin for a stronger, more naturalistic pulse.",
    hero: {
      title: "The upstream GH signal",
      body:
        "Where sermorelin is a shorter-acting GHRH option, CJC-1295 (including DAC-modified forms in some protocols) provides a longer-acting GHRH signal. It doesn't replace growth hormone — it asks your pituitary to release your own GH in pulses, preserving feedback loops when clinically appropriate.",
      stats: [
        { value: "GHRH", label: "Mimics hypothalamic growth-hormone-releasing hormone" },
        { value: "Pair", label: "Usually stacked with ipamorelin, not solo" },
      ],
    },
    cards: [
      {
        category: "Mechanism",
        title: "GHRH analog",
        bullets: ["Upstream pituitary signal", "Pulsatile GH release", "Not direct HGH replacement"],
      },
      {
        category: "Discussed for",
        title: "Sleep & recovery",
        bullets: ["Overnight GH rhythm", "Bedtime dosing common", "Recovery from training"],
      },
      {
        category: "Discussed for",
        title: "Body composition",
        bullets: ["Lean mass over months", "Works with training", "Individual results vary"],
      },
      {
        category: "Clinical",
        title: "Stack context",
        bullets: ["Paired with ipamorelin", "See combined stack page", "NP matches protocol"],
      },
    ],
    duo: [
      {
        title: "CJC-1295 alone vs with ipamorelin",
        body:
          "GHRH analogs and GHRPs hit different receptors. CJC alone turns up the GHRH signal; adding ipamorelin opens a second release pathway. That's why most clients discussing CJC are really discussing the combined stack.",
      },
      {
        title: "vs sermorelin",
        body:
          "Sermorelin is often the gentler entry point. CJC-1295 is typically the next step when a stronger GHRH signal is the goal — usually alongside a GHRP.",
      },
    ],
    callouts: [
      {
        title: "Read the full stack guide",
        body:
          "Most CJC protocols at Hello Gorgeous include ipamorelin. See our CJC-1295 / Ipamorelin page for the complete dual-pathway education.",
      },
    ],
    expectationsTable: [
      {
        claim: "Natural GH pulse",
        honest: "Prompts your pituitary — does not add HGH from outside.",
      },
      {
        claim: "Usually stacked",
        honest: "Prescribed with ipamorelin in most GH protocols at our clinic.",
      },
      {
        claim: "NP-led",
        honest: "Labs, history, and cancer screening when indicated before any Rx.",
      },
    ],
    faqs: [
      {
        question: "What is CJC-1295?",
        answer:
          "A long-acting GHRH analog that amplifies the signal for your pituitary to release growth hormone in pulses. Prescription-only through compounding pharmacies.",
      },
      {
        question: "Do I need ipamorelin with CJC-1295?",
        answer:
          "Most clinical protocols pair them for complementary GH axis signaling. Your NP determines whether the stack, sermorelin, or another option fits you.",
      },
      {
        question: "How is this different from HGH?",
        answer:
          "Direct HGH bypasses pituitary regulation. CJC-1295 works upstream to support your body's own pulsatile release.",
      },
    ],
  }),

  rx({
    slug: "ipamorelin",
    name: "Ipamorelin",
    tagline: "Selective GH secretagogue for a clean growth-hormone pulse — Hello Gorgeous RX™",
    category: "Hormone Support",
    accent: "#6366f1",
    order: 5,
    metaTitle: "Ipamorelin Peptide Therapy Oswego IL | Hello Gorgeous Med Spa",
    metaDescription:
      "Ipamorelin GH secretagogue education — selective GH pulse, sleep & recovery. NP-led Hello Gorgeous RX™ Oswego, IL.",
    pills: ["#Ipamorelin", "#GHRP", "#GrowthHormone", "#SleepRecovery"],
    intro:
      "Ipamorelin is a growth hormone secretagogue (GHRP) that triggers a selective GH pulse through the ghrelin receptor at the pituitary — a separate pathway from GHRH analogs like CJC-1295 or sermorelin. It's often chosen for its selectivity profile in research and is commonly dosed near bedtime.",
    hero: {
      title: "The selective GHRP",
      body:
        "Older GHRPs could raise cortisol and prolactin alongside GH. Ipamorelin is frequently described in published reports as more selective — supporting a GH pulse while keeping other hormone shifts minimal. In practice it's almost always paired with a GHRH analog like CJC-1295 for a stronger combined signal.",
      stats: [
        { value: "GHRP", label: "Ghrelin-receptor pathway at the pituitary" },
        { value: "Selective", label: "Minimal cortisol/prolactin vs older secretagogues" },
      ],
    },
    cards: [
      {
        category: "Mechanism",
        title: "Ghrelin receptor",
        bullets: ["Separate from GHRH pathway", "Selective GH pulse", "Feedback loops intact"],
      },
      {
        category: "Discussed for",
        title: "Sleep alignment",
        bullets: ["Bedtime dosing common", "Matches overnight GH release", "Recovery conversations"],
      },
      {
        category: "Discussed for",
        title: "Body composition",
        bullets: ["Lean mass over time", "With training & nutrition", "No outcome guarantees"],
      },
      {
        category: "Clinical",
        title: "Stack partner",
        bullets: ["Paired with CJC-1295", "Also with tesamorelin in some protocols", "NP individualized plan"],
      },
    ],
    duo: [
      {
        title: "Why ipamorelin is paired, not solo",
        body:
          "GHRH + GHRP together produce a stronger, more naturalistic pulse than either alone. That's the logic behind the CJC / ipamorelin stack — our most-requested GH protocol.",
      },
      {
        title: "Ipamorelin vs older GHRPs",
        body:
          "Selectivity matters in clinical conversations. Ipamorelin is often preferred when clinicians want GH support without the broader hormonal noise associated with some older secretagogues.",
      },
    ],
    callouts: [
      {
        title: "Full stack education",
        body: "See CJC-1295 / Ipamorelin for the complete dual-pathway guide, FAQs, and request flow.",
      },
    ],
    expectationsTable: [
      {
        claim: "Clean GH pulse",
        honest: "Selective secretagogue framing — individual response varies.",
      },
      {
        claim: "Sleep & recovery",
        honest: "Often explored with bedtime dosing under provider guidance.",
      },
      {
        claim: "Stacked in practice",
        honest: "Rarely prescribed alone — combined with GHRH analog when GH support is the goal.",
      },
    ],
    faqs: [
      {
        question: "What is ipamorelin?",
        answer:
          "A selective GH secretagogue (GHRP) that triggers growth hormone release through the ghrelin receptor. Prescription-only under NP supervision.",
      },
      {
        question: "Why pair ipamorelin with CJC-1295?",
        answer:
          "They act on complementary parts of the GH axis — together producing a stronger naturalistic pulse than either peptide alone.",
      },
      {
        question: "Is ipamorelin FDA approved?",
        answer: "No — as a finished wellness product. Compounded under medical supervision after evaluation.",
      },
    ],
  }),

  rx({
    slug: "biotin",
    name: "Biotin",
    tagline: "Hair, skin & nail support — prescription wellness at Hello Gorgeous RX™",
    category: "Aesthetics",
    accent: "#db2777",
    order: 2,
    metaTitle: "Biotin Peptide & Vitamin Therapy Oswego IL | Hello Gorgeous Med Spa",
    metaDescription:
      "Biotin for hair, skin & nail support — Hello Gorgeous RX™ in Oswego, IL. NP-led wellness protocols · Fox Valley.",
    pills: ["#Biotin", "#HairSkinNails", "#Wellness", "#HelloGorgeousRX"],
    intro:
      "Biotin (vitamin B7) is a cofactor in keratin production — the protein that structures hair, skin, and nails. While deficiency is uncommon, supplemental biotin is one of the most-requested aesthetic wellness supports in our clinic, especially for clients exploring hair thinning or brittle nail concerns alongside a full medical workup.",
    hero: {
      title: "The beauty vitamin",
      body:
        "Biotin supports enzymes that build keratin and metabolize fats and amino acids. Hello Gorgeous may include biotin in injectable wellness protocols, topical hair formulations, or oral supplements when your NP determines it's appropriate — always as part of a broader plan, not a standalone miracle pill.",
      stats: [
        { value: "B7", label: "Water-soluble vitamin · keratin cofactor" },
        { value: "Aesthetic", label: "Hair, skin & nail wellness conversations" },
      ],
    },
    cards: [
      {
        category: "Discussed for",
        title: "Hair support",
        bullets: ["Thinning & breakage goals", "Often in combo protocols", "Labs when indicated"],
      },
      {
        category: "Discussed for",
        title: "Nail strength",
        bullets: ["Brittle nail conversations", "Keratin pathway support", "Gradual timelines"],
      },
      {
        category: "Discussed for",
        title: "Skin health",
        bullets: ["Part of glow protocols", "With glutathione or GHK-Cu", "Inside-out approach"],
      },
      {
        category: "Clinical",
        title: "Whole picture",
        bullets: ["Thyroid & iron checked when needed", "Not a substitute for diagnosis", "NP-led plan"],
      },
    ],
    duo: [
      {
        title: "Biotin in hair protocols",
        body:
          "We often discuss biotin alongside PRF hair restoration, GHK-Cu, or minoxidil-compounded topicals — matching the lane to your scalp exam and history.",
      },
      {
        title: "Lab note",
        body:
          "High-dose biotin can interfere with some lab tests. Tell your providers and lab what you're taking — we cover this at consult.",
      },
    ],
    expectationsTable: [
      {
        claim: "Thicker hair",
        honest: "Gradual support over months — best when deficiency or protocol fit is confirmed.",
      },
      {
        claim: "Stronger nails",
        honest: "Common aesthetic goal — individual response varies.",
      },
      {
        claim: "Medical screening",
        honest: "We rule out thyroid, iron, and hormonal causes of hair loss before blaming biotin alone.",
      },
    ],
    faqs: [
      {
        question: "What is biotin used for at Hello Gorgeous?",
        answer:
          "Hair, skin, and nail wellness support as part of NP-supervised protocols — injectable, oral, or compounded topical forms when appropriate.",
      },
      {
        question: "How long until I see results?",
        answer:
          "Hair and nail changes typically take several months. We set honest expectations and reassess at follow-up.",
      },
      {
        question: "Can biotin interfere with labs?",
        answer: "Yes — high doses can affect certain blood tests. We discuss timing and disclosure with your care team.",
      },
    ],
  }),

  rx({
    slug: "k-glow",
    name: "K-Glow",
    tagline: "Radiance & skin wellness peptide blend — Hello Gorgeous RX™ · Oswego",
    category: "Aesthetics",
    accent: "#ec4899",
    order: 3,
    metaTitle: "K-Glow Peptide Blend Oswego IL | Hello Gorgeous Med Spa",
    metaDescription:
      "K-Glow radiance peptide blend — skin wellness under NP supervision. Hello Gorgeous RX™ Oswego, IL.",
    pills: ["#KGlow", "#SkinGlow", "#PeptideBlend", "#Aesthetics"],
    intro:
      "K-Glow is a compounded radiance blend formulated for clients who want inside-out skin wellness support alongside in-office aesthetics. It combines peptide and wellness ingredients selected for glow, clarity, and collagen-pathway conversations — prescribed only after NP evaluation.",
    hero: {
      title: "Inside-out radiance",
      body:
        "Topicals and lasers work from the outside; peptide wellness protocols can complement them from within. K-Glow is our blended approach for clients building a comprehensive skin plan — always paired with realistic timelines and in-office options like HydraFacial, Morpheus8, or GHK-Cu when appropriate.",
      stats: [
        { value: "Blend", label: "Multi-ingredient radiance protocol" },
        { value: "Complement", label: "Pairs with med-spa skin treatments" },
      ],
    },
    cards: [
      {
        category: "Goal",
        title: "Skin clarity",
        bullets: ["Glow & tone conversations", "Antioxidant pathway support", "Gradual improvement"],
      },
      {
        category: "Goal",
        title: "Collagen support",
        bullets: ["Remodeling conversations", "With GHK-Cu or copper peptides", "Months, not days"],
      },
      {
        category: "Goal",
        title: "Wellness synergy",
        bullets: ["Glutathione adjacency", "NAD+ energy support", "Holistic skin plan"],
      },
      {
        category: "Clinical",
        title: "NP oversight",
        bullets: ["Screening before Rx", "Compounding pharmacy sourcing", "Follow-up built in"],
      },
    ],
    duo: [
      {
        title: "K-Glow + in-office aesthetics",
        body:
          "Hello Gorgeous is both med spa and RX clinic — we can coordinate injectable glow support with Morpheus8, Solaria CO₂, or facials under one NP-directed team.",
      },
      {
        title: "Honest expectations",
        body:
          "No peptide replaces sunscreen, retinoids, or professional skin assessment. K-Glow is a supportive tool in a broader plan.",
      },
    ],
    expectationsTable: [
      {
        claim: "Brighter skin",
        honest: "Explored over weeks to months — varies by baseline, protocol, and lifestyle.",
      },
      {
        claim: "Blend convenience",
        honest: "One vial vs stacking singles — when your provider agrees it's the right fit.",
      },
      {
        claim: "Prescription-only",
        honest: "Hello Gorgeous RX™ — not OTC supplement claims.",
      },
    ],
    faqs: [
      {
        question: "What is K-Glow?",
        answer:
          "A compounded radiance blend for skin wellness support under NP supervision — ingredients matched to your goals at consult.",
      },
      {
        question: "Can I use K-Glow with Botox or fillers?",
        answer:
          "Often yes — we coordinate timing with your aesthetic treatments. Tell us everything you're doing at your consult.",
      },
      {
        question: "How do I request K-Glow?",
        answer: "Start a Hello Gorgeous RX™ peptide request or book a $49 consult to discuss skin goals.",
      },
    ],
  }),

  rx({
    slug: "aod-9604",
    name: "AOD-9604",
    tagline: "Metabolic peptide fragment for body composition — Hello Gorgeous RX™",
    category: "Weight Health",
    accent: "#059669",
    order: 5,
    metaTitle: "AOD-9604 Peptide Therapy Oswego IL | Hello Gorgeous Med Spa",
    metaDescription:
      "AOD-9604 metabolic peptide education — body composition support in Oswego, IL. NP-led Hello Gorgeous RX™ · Fox Valley.",
    pills: ["#AOD9604", "#Metabolic", "#BodyComposition", "#PrescriptionOnly"],
    intro:
      "AOD-9604 is a fragment of human growth hormone studied for metabolic and body-composition effects without the full GH signal. Clients exploring it often want a peptide lane adjacent to GLP-1 programs — always under NP supervision with honest evidence limits.",
    hero: {
      title: "The metabolic fragment",
      body:
        "AOD-9604 (Advanced Obesity Drug 9604) is a modified fragment of the GH molecule studied for fat metabolism and lean-mass conversations — without stimulating IGF-1 or full GH axis effects the way secretagogues do. Human evidence is still building; we frame it as a supportive tool, not a replacement for GLP-1 when that's the better fit.",
      stats: [
        { value: "Fragment", label: "GH-derived peptide · metabolic research focus" },
        { value: "Adjunct", label: "Often discussed alongside training & nutrition" },
      ],
    },
    cards: [
      {
        category: "Discussed for",
        title: "Fat metabolism",
        bullets: ["Body composition goals", "Metabolic signaling research", "Not a GLP-1 duplicate"],
      },
      {
        category: "Discussed for",
        title: "Lean mass",
        bullets: ["Preservation conversations", "With resistance training", "Gradual timelines"],
      },
      {
        category: "Discussed for",
        title: "Stack context",
        bullets: ["May pair with wellness peptides", "Individualized by NP", "Cycle-based protocols"],
      },
      {
        category: "Evidence",
        title: "Honest limits",
        bullets: ["Human data still evolving", "No outcome guarantees", "Medical screening required"],
      },
    ],
    duo: [
      {
        title: "AOD vs GLP-1",
        body:
          "GLP-1 agonists (semaglutide, tirzepatide) are our primary medical weight-loss lane with the strongest evidence. AOD-9604 is a different mechanism — we discuss whether it belongs in your picture at consult.",
      },
      {
        title: "Lifestyle still matters",
        body:
          "Peptides don't replace protein intake, resistance training, or sleep. AOD conversations always include the fundamentals.",
      },
    ],
    expectationsTable: [
      {
        claim: "Fat loss support",
        honest: "Explored for metabolic goals — slower and more subtle than GLP-1 for most clients.",
      },
      {
        claim: "Body composition",
        honest: "Lean-mass conversations over months with training and nutrition.",
      },
      {
        claim: "NP-led only",
        honest: "Prescription peptide — not research-grade internet product.",
      },
    ],
    faqs: [
      {
        question: "What is AOD-9604?",
        answer:
          "A GH fragment peptide studied for metabolic and body-composition effects. Prescription-only through compounding pharmacies after NP evaluation.",
      },
      {
        question: "Is AOD-9604 a weight-loss drug?",
        answer:
          "It's discussed for body composition — not a substitute for GLP-1 programs when those are clinically appropriate. Your NP helps you choose the right lane.",
      },
      {
        question: "How is AOD-9604 used?",
        answer: "Typically subcutaneous injection on an individualized protocol set by your provider.",
      },
    ],
  }),

  rx({
    slug: "mots-c",
    name: "MOTS-c",
    tagline: "Mitochondrial peptide for metabolic & energy signaling — Hello Gorgeous RX™",
    category: "Energy & Wellness",
    accent: "#d97706",
    order: 4,
    metaTitle: "MOTS-c Peptide Therapy Oswego IL | Hello Gorgeous Med Spa",
    metaDescription:
      "MOTS-c mitochondrial peptide — metabolic & energy education in Oswego, IL. Hello Gorgeous RX™ NP-led protocols.",
    pills: ["#MOTSc", "#Mitochondria", "#Metabolic", "#Longevity"],
    intro:
      "MOTS-c is a mitochondrial-derived peptide studied for metabolic health, insulin sensitivity, and exercise capacity. It signals from the mitochondria — your cells' energy factories — making it a conversation starter for clients focused on metabolic resilience and healthy aging.",
    hero: {
      title: "Signal from the mitochondria",
      body:
        "Unlike peptides that act at the pituitary or gut, MOTS-c originates from mitochondrial DNA and is researched for how cells handle energy and stress. At Hello Gorgeous it's discussed for metabolic wellness, training recovery, and longevity-adjacent goals — with clear limits on human evidence.",
      stats: [
        { value: "Mitochondrial", label: "Peptide encoded in mitochondrial DNA" },
        { value: "Metabolic", label: "Insulin sensitivity & exercise research" },
      ],
    },
    cards: [
      {
        category: "Discussed for",
        title: "Metabolic health",
        bullets: ["Insulin sensitivity research", "Energy utilization", "Metabolic syndrome adjacency"],
      },
      {
        category: "Discussed for",
        title: "Exercise capacity",
        bullets: ["Endurance conversations", "Recovery from training", "Active aging goals"],
      },
      {
        category: "Discussed for",
        title: "Longevity science",
        bullets: ["Cellular stress response", "Emerging human data", "Supportive, not curative"],
      },
      {
        category: "Clinical",
        title: "NP screening",
        bullets: ["Cancer history review", "Diabetes considerations", "Individualized dosing"],
      },
    ],
    duo: [
      {
        title: "MOTS-c vs NAD+",
        body:
          "Both touch cellular energy — differently. NAD+ is a coenzyme supplement; MOTS-c is a signaling peptide. Some clients explore both; your NP helps prioritize.",
      },
      {
        title: "Evidence honesty",
        body:
          "Much MOTS-c data is preclinical or early-phase. We never oversell — education and appropriate candidacy come first.",
      },
    ],
    expectationsTable: [
      {
        claim: "Metabolic support",
        honest: "Research-stage peptide — explored when goals and history align.",
      },
      {
        claim: "Energy & training",
        honest: "May complement NAD+ and lifestyle optimization — individual response varies.",
      },
      {
        claim: "Medical oversight",
        honest: "Hello Gorgeous RX™ prescription lane only.",
      },
    ],
    faqs: [
      {
        question: "What is MOTS-c?",
        answer:
          "A mitochondrial-derived peptide studied for metabolic health and exercise capacity. Prescription-only under NP supervision.",
      },
      {
        question: "How is MOTS-c different from NAD+?",
        answer:
          "NAD+ replenishes a cellular coenzyme; MOTS-c is a signaling peptide from mitochondrial DNA. Mechanisms and protocols differ.",
      },
      {
        question: "Is MOTS-c FDA approved?",
        answer: "No — compounded research peptide dispensed after medical evaluation.",
      },
    ],
  }),

  rx({
    slug: "selank",
    name: "Selank",
    tagline: "Calm, focus & stress resilience — nasal peptide at Hello Gorgeous RX™",
    category: "Energy & Wellness",
    accent: "#7c3aed",
    order: 5,
    metaTitle: "Selank Peptide Nasal Spray Oswego IL | Hello Gorgeous Med Spa",
    metaDescription:
      "Selank anxiolytic peptide — calm without sedation, NP-led in Oswego, IL. Hello Gorgeous RX™ cognitive wellness.",
    pills: ["#Selank", "#Calm", "#Focus", "#NasalPeptide"],
    intro:
      "Selank is a synthetic peptide derived from tuftsin, studied for anxiolytic (calming) effects without typical sedative downsides. Delivered as a nasal spray in many protocols, it's discussed for stress resilience, focus, and mood support — always with psychiatric history screening.",
    hero: {
      title: "Calm without the fog",
      body:
        "Selank is researched as a non-sedating anxiolytic peptide — supporting calm and mental clarity rather than knocking you out. Intranasal delivery bypasses the gut, a practical route for this small peptide. Hello Gorgeous prescribes it only after full history review, including medications and mood disorders.",
      stats: [
        { value: "Nasal", label: "Intranasal spray delivery in many protocols" },
        { value: "Anxiolytic", label: "Calm & stress-resilience research focus" },
      ],
    },
    cards: [
      {
        category: "Discussed for",
        title: "Stress & calm",
        bullets: ["Daily stress resilience", "Non-sedating framing", "Workday-friendly goals"],
      },
      {
        category: "Discussed for",
        title: "Focus",
        bullets: ["Mental clarity adjacency", "Pairs with Semax in some protocols", "Cognitive wellness lane"],
      },
      {
        category: "Discussed for",
        title: "Mood support",
        bullets: ["BDNF pathway research", "Not an SSRI replacement", "Screened carefully"],
      },
      {
        category: "Clinical",
        title: "Safety screening",
        bullets: ["Psychiatric history review", "Medication interactions", "NP-only prescribing"],
      },
    ],
    duo: [
      {
        title: "Selank vs Semax",
        body:
          "Selank leans calming and stress resilience; Semax leans focus and mental energy. Some clients rotate or combine under provider guidance — never self-experiment.",
      },
      {
        title: "Not a substitute for care",
        body:
          "Peptides don't replace therapy, SSRIs, or psychiatric treatment when those are indicated. We coordinate with your broader care team when needed.",
      },
    ],
    expectationsTable: [
      {
        claim: "Daily calm",
        honest: "Gradual support — not instant Xanax-like sedation.",
      },
      {
        claim: "Focus benefit",
        honest: "Some clients explore Selank + Semax together for calm focus.",
      },
      {
        claim: "Prescription nasal spray",
        honest: "Compounded and dispensed through Hello Gorgeous RX™.",
      },
    ],
    faqs: [
      {
        question: "What is Selank?",
        answer:
          "A synthetic anxiolytic peptide, often delivered as a nasal spray, studied for calm and stress resilience without sedation.",
      },
      {
        question: "How do I use Selank?",
        answer: "Typically intranasal spray on a protocol your NP sets — technique reviewed at consult.",
      },
      {
        question: "Can Selank replace my anxiety medication?",
        answer:
          "No — never stop prescribed psychiatric meds without your prescriber. Selank is discussed as adjunctive wellness only when appropriate.",
      },
    ],
  }),

  rx({
    slug: "semax",
    name: "Semax",
    tagline: "Focus, mental energy & neuroprotection — nasal peptide at Hello Gorgeous RX™",
    category: "Energy & Wellness",
    accent: "#8b5cf6",
    order: 6,
    metaTitle: "Semax Nootropic Peptide Oswego IL | Hello Gorgeous Med Spa",
    metaDescription:
      "Semax nootropic peptide — focus & mental performance. NP-led Hello Gorgeous RX™ in Oswego, IL.",
    pills: ["#Semax", "#Focus", "#Nootropic", "#NasalPeptide"],
    intro:
      "Semax is a synthetic nootropic peptide based on an ACTH fragment, studied for focus, mental energy, and neuroprotective pathways including BDNF. Used as a nasal spray in many protocols, it's popular with clients seeking cognitive edge without stimulant jitter.",
    hero: {
      title: "The focus peptide",
      body:
        "Developed in Russian clinical research, Semax is discussed for attention, memory support, and mental stamina. Intranasal delivery is common. At Hello Gorgeous it's a prescription wellness conversation — screened against ADHD meds, stimulants, and psychiatric history.",
      stats: [
        { value: "Nootropic", label: "Cognition & focus research peptide" },
        { value: "BDNF", label: "Neuroplasticity pathway conversations" },
      ],
    },
    cards: [
      {
        category: "Discussed for",
        title: "Focus & clarity",
        bullets: ["Workday performance", "Mental energy without caffeine", "Gradual effect"],
      },
      {
        category: "Discussed for",
        title: "Memory support",
        bullets: ["Learning & recall research", "Not a study drug replacement", "Honest evidence limits"],
      },
      {
        category: "Discussed for",
        title: "Neuroprotection",
        bullets: ["BDNF signaling research", "Brain health adjacency", "Emerging human data"],
      },
      {
        category: "Clinical",
        title: "Pairing",
        bullets: ["Often discussed with Selank", "Medication review required", "NP individualized plan"],
      },
    ],
    duo: [
      {
        title: "Semax vs stimulants",
        body:
          "Semax isn't Adderall — it's a peptide signaling conversation with subtler, gradual effects. We screen for stimulant and ADHD medication interactions.",
      },
      {
        title: "Semax + Selank",
        body:
          "Calm focus is the goal when both are discussed — Selank for stress buffer, Semax for mental drive. Your provider sets whether one or both fit.",
      },
    ],
    expectationsTable: [
      {
        claim: "Sharper focus",
        honest: "Subtle, gradual — not instant pharmaceutical stimulation.",
      },
      {
        claim: "Nasal delivery",
        honest: "Convenient route — technique reviewed at your appointment.",
      },
      {
        claim: "Rx only",
        honest: "Hello Gorgeous RX™ — screened and compounded professionally.",
      },
    ],
    faqs: [
      {
        question: "What is Semax?",
        answer:
          "A nootropic peptide studied for focus, mental energy, and neuroprotection — often as a nasal spray under provider supervision.",
      },
      {
        question: "How is Semax different from Selank?",
        answer:
          "Semax leans focus and mental energy; Selank leans calm and stress resilience. Some protocols discuss both.",
      },
      {
        question: "Can I use Semax with ADHD medication?",
        answer: "Tell your NP all medications — interactions must be reviewed before any prescription.",
      },
    ],
  }),

  rx({
    slug: "epithalon",
    name: "Epithalon",
    tagline: "Longevity & circadian peptide — Hello Gorgeous RX™ · Oswego",
    category: "Energy & Wellness",
    accent: "#b45309",
    order: 7,
    metaTitle: "Epithalon Peptide Therapy Oswego IL | Hello Gorgeous Med Spa",
    metaDescription:
      "Epithalon longevity peptide — sleep, circadian rhythm & cellular aging education. Hello Gorgeous RX™ Oswego, IL.",
    pills: ["#Epithalon", "#Longevity", "#Sleep", "#Circadian"],
    intro:
      "Epithalon (Epitalon) is a synthetic tetrapeptide studied for pineal gland signaling, sleep-wake rhythm, and telomerase-related longevity research. Clients exploring it often sit in the healthy-aging and sleep-optimization lane — with clear acknowledgment that human evidence is limited.",
    hero: {
      title: "The pineal & circadian peptide",
      body:
        "Epithalon is researched for its interaction with melatonin pathways and cellular aging signals. Short cyclic protocols are common in the literature. Hello Gorgeous discusses it for longevity-curious clients who've exhausted basics — sleep hygiene, NAD+, and labs — and want an NP-guided next step.",
      stats: [
        { value: "Tetrapeptide", label: "Four amino acids · pineal research focus" },
        { value: "Cycles", label: "Often run in short defined protocols" },
      ],
    },
    cards: [
      {
        category: "Discussed for",
        title: "Sleep rhythm",
        bullets: ["Circadian support research", "Melatonin pathway adjacency", "Not a sleeping pill"],
      },
      {
        category: "Discussed for",
        title: "Longevity science",
        bullets: ["Telomerase research", "Cellular aging conversations", "Early human data"],
      },
      {
        category: "Discussed for",
        title: "Antioxidant support",
        bullets: ["Oxidative stress pathways", "Complements NAD+ goals", "Supportive framing"],
      },
      {
        category: "Clinical",
        title: "Candidate fit",
        bullets: ["Cancer screening", "Realistic expectations", "Cycle-based follow-up"],
      },
    ],
    duo: [
      {
        title: "Epithalon vs NAD+",
        body:
          "NAD+ supports mitochondrial energy; Epithalon is discussed for pineal/circadian and longevity pathways. Some clients explore both in sequenced protocols.",
      },
      {
        title: "Evidence limits",
        body:
          "Much Epithalon data is preclinical. We educate honestly — it's for informed clients under medical supervision, not anti-aging hype.",
      },
    ],
    expectationsTable: [
      {
        claim: "Better sleep rhythm",
        honest: "Explored for circadian support — not sedative sleep meds.",
      },
      {
        claim: "Healthy aging",
        honest: "Longevity research peptide with limited human trials — no guarantees.",
      },
      {
        claim: "Short cycles",
        honest: "Protocols often run in defined cycles with NP check-ins.",
      },
    ],
    faqs: [
      {
        question: "What is Epithalon?",
        answer:
          "A synthetic tetrapeptide studied for pineal gland signaling, sleep-wake rhythm, and longevity pathways. Prescription-only after NP evaluation.",
      },
      {
        question: "How is Epithalon used?",
        answer: "Typically subcutaneous injection in short cycles — exact protocol set by your provider.",
      },
      {
        question: "Is Epithalon proven to extend life?",
        answer:
          "No — human longevity claims are not established. We discuss research honestly without overpromising.",
      },
    ],
  }),

  rx({
    slug: "amino-blend",
    name: "Amino Blend",
    tagline: "Recovery & performance amino support — Hello Gorgeous RX™ injectable",
    category: "Recovery & Healing",
    accent: "#0284c7",
    order: 6,
    metaTitle: "Amino Blend Injectable Oswego IL | Hello Gorgeous Med Spa",
    metaDescription:
      "Amino Blend injectable — recovery & performance amino acid support. Hello Gorgeous RX™ Oswego, IL.",
    pills: ["#AminoBlend", "#Recovery", "#Performance", "#Injectable"],
    intro:
      "Our Amino Blend injectable combines essential amino acids used to support recovery, muscle protein synthesis, and performance goals — especially for active clients who want more than oral supplements. Prescribed under NP supervision as part of Hello Gorgeous RX™ wellness protocols.",
    hero: {
      title: "Building blocks for recovery",
      body:
        "Amino acids are the raw materials for muscle repair and protein synthesis. Injectable blends deliver them directly when oral absorption or timing is a concern — often discussed alongside peptide recovery stacks or weight-loss programs to preserve lean mass.",
      stats: [
        { value: "EAAs", label: "Essential amino acid building blocks" },
        { value: "IM / SC", label: "Injectable delivery · provider-guided" },
      ],
    },
    cards: [
      {
        category: "Discussed for",
        title: "Muscle recovery",
        bullets: ["Post-training repair", "Protein synthesis support", "Active lifestyle clients"],
      },
      {
        category: "Discussed for",
        title: "Lean mass preservation",
        bullets: ["During weight loss", "With GLP-1 programs", "Protein-sparing conversations"],
      },
      {
        category: "Discussed for",
        title: "Performance",
        bullets: ["Endurance & strength adjacency", "Not a steroid alternative", "Training still required"],
      },
      {
        category: "Clinical",
        title: "Protocol fit",
        bullets: ["Kidney history screened", "Dose individualized", "Part of broader plan"],
      },
    ],
    duo: [
      {
        title: "Amino Blend vs oral protein",
        body:
          "Food and whey still come first. Injectables are discussed when compliance, absorption, or protocol timing makes them a useful adjunct — not a replacement for meals.",
      },
      {
        title: "Pairs with peptides",
        body:
          "Often considered alongside BPC-157 or recovery blends for clients rebuilding after injury or heavy training blocks.",
      },
    ],
    expectationsTable: [
      {
        claim: "Faster recovery",
        honest: "Supports amino availability — training and sleep still drive results.",
      },
      {
        claim: "Lean mass on GLP-1",
        honest: "Discussed to support protein status during weight loss — individualized.",
      },
      {
        claim: "NP-supervised",
        honest: "Prescription injectable — not gym-counter supplement.",
      },
    ],
    faqs: [
      {
        question: "What is the Amino Blend?",
        answer:
          "An injectable essential amino acid formulation prescribed for recovery and performance support under NP supervision.",
      },
      {
        question: "How is it administered?",
        answer: "Typically intramuscular or subcutaneous injection — technique and schedule set by your provider.",
      },
      {
        question: "Do I still need to eat protein?",
        answer: "Yes — injectables supplement a protein-adequate diet, they don't replace it.",
      },
    ],
  }),
];
