/**
 * Peptide Education Module Content
 * Full educational content for each learning module.
 * Client-facing, evidence-aware, consult-first, no dosing, no outcome guarantees.
 */

export interface ModuleSection {
  heading: string;
  content: string[];
}

export interface ModuleContent {
  slug: string;
  moduleNumber: string;
  title: string;
  subtitle: string;
  readTime: string;
  heroDescription: string;
  objectives: string[];
  sections: ModuleSection[];
  keyTakeaways: string[];
  nextModuleSlug: string | null;
  prevModuleSlug: string | null;
}

export const MODULE_CONTENT: Record<string, ModuleContent> = {
  "peptide-basics": {
    slug: "peptide-basics",
    moduleNumber: "01",
    title: "Peptide Basics",
    subtitle: "What a peptide actually is — and isn't",
    readTime: "6 min",
    heroDescription:
      "Before you can evaluate any peptide claim, you need to know what the word means. This module covers the building blocks, how peptides differ from proteins, and why sequence matters more than you might think.",
    objectives: [
      "Define what a peptide is at the molecular level",
      "Understand how peptides differ from proteins and hormones",
      "Learn why the sequence of amino acids determines function",
      "Recognize why synthetic peptides require verification",
    ],
    sections: [
      {
        heading: "The building blocks: amino acids",
        content: [
          "Your body uses twenty standard amino acids as molecular building blocks. Each one has a distinct chemical structure — some are hydrophobic (water-avoiding), some are charged, some are bulky, some are compact. These properties determine how molecules fold and what they can bind to.",
          "Think of amino acids like letters in an alphabet. Just as twenty-six letters can form every word in a language, twenty amino acids can form every peptide and protein in your body. The order matters enormously: rearrange the letters in 'stop' and you get 'pots' — same components, different meaning.",
          "When amino acids link together, they form a peptide bond — a specific type of chemical connection. String together a few amino acids and you have a peptide. String together many more and it folds into a protein. The dividing line is roughly 50 amino acids, though the term 'peptide' is sometimes stretched to include slightly longer chains.",
        ],
      },
      {
        heading: "Peptides vs. proteins vs. hormones",
        content: [
          "A peptide is a short chain — typically 2 to 50 amino acids linked by peptide bonds. Peptides are small enough that they generally do not fold into complex three-dimensional shapes the way proteins do. Their smallness is both their limitation and their advantage: they can fit into receptors that larger molecules cannot reach.",
          "A protein is a much longer chain — often hundreds or thousands of amino acids — that folds into intricate structures. Enzymes, antibodies, and structural proteins like collagen are all proteins. When you digest protein from food, your body breaks it down into amino acids and small peptides, then uses those to build its own molecules.",
          "A hormone is a signaling molecule, but not all hormones are peptides. Insulin is a peptide hormone. Testosterone is a steroid hormone (derived from cholesterol, not amino acids). Thyroid hormones are modified amino acids. The term 'peptide therapy' refers specifically to using peptide-based signaling molecules.",
          "Understanding these distinctions matters because marketing often blurs them. A 'peptide cream' is not the same thing as injected insulin. A 'growth hormone secretagogue' is a peptide that tells your pituitary to release growth hormone — it is not growth hormone itself. Knowing what category you are dealing with shapes what questions you should ask.",
        ],
      },
      {
        heading: "Why sequence determines everything",
        content: [
          "If you change even one amino acid in a peptide's sequence, you may get a molecule with completely different properties. The peptide might bind to a different receptor, trigger a different signaling cascade, or have no activity at all.",
          "This is why peptide identity verification matters. A vial labeled 'BPC-157' should contain a specific 15-amino-acid sequence. If the manufacturer made an error at position 8, you have a different molecule — one that may do nothing, or something unintended. Mass spectrometry can verify that the sequence matches what is claimed, but not every supplier performs this testing.",
          "The precision required to synthesize peptides is also why compounding matters. A licensed compounding pharmacy operating under FDA oversight follows standardized procedures. An overseas supplier selling 'research chemicals' may not. The molecule's name is only as reliable as the verification behind it.",
        ],
      },
      {
        heading: "How your body already uses peptides",
        content: [
          "You produce thousands of peptides naturally. Insulin regulates blood sugar. Oxytocin influences bonding and social behavior. Ghrelin signals hunger. GLP-1 tells your brain you are full and slows gastric emptying. These are not supplements — they are endogenous signaling molecules your cells already recognize.",
          "Therapeutic peptides work by mimicking, enhancing, or modulating these existing pathways. Semaglutide is a modified GLP-1 that lasts longer in the bloodstream. Ipamorelin triggers growth hormone release through a pathway your pituitary already uses. The goal is not to introduce something foreign but to adjust the volume on a signal your body already understands.",
          "This is why peptide therapy is not magic. It is pharmacology — predictable effects based on known receptor interactions. And like all pharmacology, it comes with trade-offs: benefits, side effects, contraindications, and individual variation. Understanding the basics helps you weigh those trade-offs honestly.",
        ],
      },
    ],
    keyTakeaways: [
      "A peptide is a short chain of amino acids (roughly 2–50) linked by peptide bonds",
      "The amino acid sequence determines the peptide's function — change one letter and you may change everything",
      "Peptides differ from proteins (longer, folded) and from steroid hormones (different chemistry entirely)",
      "Your body already makes thousands of peptides; therapeutic peptides work through existing pathways",
      "Verification matters because a mislabeled vial contains a different molecule",
    ],
    nextModuleSlug: "peptides-and-your-body",
    prevModuleSlug: null,
  },

  "peptides-and-your-body": {
    slug: "peptides-and-your-body",
    moduleNumber: "02",
    title: "Peptides & Your Body",
    subtitle: "The peptides you already make and what they regulate",
    readTime: "7 min",
    heroDescription:
      "Your body runs on peptide signals. This module introduces the endogenous peptides that regulate hunger, sleep, growth, repair, and more — the same pathways that therapeutic peptides target.",
    objectives: [
      "Identify major endogenous peptide systems",
      "Understand how peptides regulate metabolism, appetite, and energy",
      "Learn about growth hormone and its secretagogues",
      "Recognize the role of peptides in tissue repair and immune function",
    ],
    sections: [
      {
        heading: "Metabolic peptides: hunger, fullness, and blood sugar",
        content: [
          "Your appetite is not a single switch — it is a conversation between multiple peptide signals. Ghrelin, made primarily in the stomach, rises before meals and tells your brain you are hungry. GLP-1 (glucagon-like peptide-1), released from the gut after eating, tells your brain you are full and slows gastric emptying so nutrients absorb gradually.",
          "Insulin, the most famous metabolic peptide, moves glucose from your bloodstream into cells. When insulin signaling is impaired, blood sugar stays elevated — the core problem in type 2 diabetes. GLP-1 also helps insulin work more effectively, which is why GLP-1 agonists like semaglutide are used for both weight management and diabetes.",
          "Leptin, produced by fat cells, signals long-term energy stores to the brain. High leptin should suppress appetite, but in obesity the brain often becomes leptin-resistant — it stops 'hearing' the signal. Understanding these interlocking systems helps explain why weight regulation is more complex than calories in, calories out.",
          "Peptide therapies targeting metabolism do not override these systems. They amplify or extend existing signals. Semaglutide is a modified GLP-1 that resists breakdown longer than the natural version. It does not invent satiety — it turns up the volume on a signal you already have.",
        ],
      },
      {
        heading: "Growth hormone and its secretagogues",
        content: [
          "Growth hormone (GH) is a protein hormone released by your pituitary gland, primarily during deep sleep. It promotes tissue repair, muscle protein synthesis, and fat mobilization. GH declines with age — a process sometimes called somatopause.",
          "Rather than replacing GH directly (which requires injections of the large protein molecule and carries distinct risks), some peptide therapies stimulate your pituitary to release more of your own GH. These are called growth hormone secretagogues. They work through two pathways: GHRH (growth hormone-releasing hormone) receptors and ghrelin receptors.",
          "Ipamorelin is a selective ghrelin-receptor agonist that triggers GH pulses without strongly affecting cortisol or prolactin. Tesamorelin is a GHRH analog approved for reducing visceral fat in HIV-associated lipodystrophy. CJC-1295 is a modified GHRH that extends the signal duration.",
          "The appeal is that your pituitary still controls the feedback loop — you are not injecting supraphysiological doses of GH itself. But these peptides still require monitoring. IGF-1 levels, glucose tolerance, and other markers should be checked, and certain conditions (active cancer, for example) are absolute contraindications.",
        ],
      },
      {
        heading: "Repair and recovery peptides",
        content: [
          "Your body has sophisticated repair mechanisms that rely on signaling peptides. When you injure tissue, local cells release growth factors and cytokines that recruit immune cells, stimulate blood vessel formation, and promote collagen deposition. These are the normal stages of healing.",
          "BPC-157 (Body Protection Compound-157) is a synthetic peptide derived from a protein found in gastric juice. Rodent studies show accelerated healing of tendons, ligaments, muscle, and gut lining. The mechanism appears to involve growth factor upregulation and angiogenesis. However, no completed human efficacy trials exist. The animal data is intriguing; the human data is absent.",
          "TB-500 is a fragment of thymosin beta-4, a protein involved in cell migration and tissue repair. Animal studies suggest benefits for wound healing and cardiac repair after injury. It is also on the World Anti-Doping Agency prohibited list due to potential performance-enhancing effects. Again, human clinical data is limited.",
          "The gap between animal promise and human evidence is where most repair peptides sit. That does not mean they are worthless — it means the honest answer is 'we do not know yet.' A provider who tells you otherwise is selling harder than the data supports.",
        ],
      },
      {
        heading: "Immune and antimicrobial peptides",
        content: [
          "Your immune system uses peptides constantly. Thymosin alpha-1 is a thymic peptide that modulates T-cell function and has been studied in chronic hepatitis B and as an immune adjuvant. Defensins are antimicrobial peptides that punch holes in bacterial membranes.",
          "LL-37, a human cathelicidin, has both antimicrobial and immunomodulatory properties. Research suggests roles in wound healing, infection control, and even mood regulation through gut-brain pathways. Some clinics offer LL-37 for chronic infections or immune support, though clinical trial data remains limited.",
          "The immune peptide space is complex because the immune system itself is complex. Boosting one arm may suppress another. What helps in one context (fighting an infection) may hurt in another (autoimmune flare). This is why immune-modulating peptides require careful patient selection and monitoring — not blanket recommendations.",
        ],
      },
      {
        heading: "Sleep, mood, and neurological peptides",
        content: [
          "Delta-sleep-inducing peptide (DSIP) was identified decades ago and associated with slow-wave sleep. Research interest has waxed and waned; some studies suggest stress-protective and sleep-promoting effects, but the data is inconsistent and the mechanism unclear.",
          "Semax and Selank are synthetic peptides developed in Russia and studied for cognitive and anxiolytic effects. They modulate BDNF (brain-derived neurotrophic factor) and neurotransmitter systems. Published research exists, but much of it is in Russian-language journals with limited replication elsewhere.",
          "Oxytocin, the 'bonding hormone,' is a peptide that influences social behavior, trust, and stress response. Intranasal oxytocin has been studied in autism spectrum disorder and social anxiety with mixed results. It is not a simple feel-good molecule — context and baseline state matter.",
          "The brain is the most complex organ, and neurological peptides reflect that complexity. Claims of cognitive enhancement or mood transformation should be met with the question: in what population, at what dose, with what controls? Often the answer is uncertain.",
        ],
      },
    ],
    keyTakeaways: [
      "Appetite is regulated by multiple peptides (ghrelin, GLP-1, leptin, insulin) — not a single on/off switch",
      "Growth hormone secretagogues stimulate your pituitary to release GH, rather than replacing it directly",
      "Repair peptides like BPC-157 show promise in animal studies but lack human efficacy trials",
      "Immune peptides are powerful but context-dependent — boosting one pathway may affect others",
      "Neurological peptides are the least understood; brain complexity demands humility about claims",
    ],
    nextModuleSlug: "how-peptides-work",
    prevModuleSlug: "peptide-basics",
  },

  "how-peptides-work": {
    slug: "how-peptides-work",
    moduleNumber: "03",
    title: "How Peptides Work",
    subtitle: "Receptor binding, signal cascades, and delivery",
    readTime: "8 min",
    heroDescription:
      "A peptide does nothing until it binds to something. This module explains how peptides interact with receptors, trigger signaling cascades, and why route of administration determines whether a peptide works at all.",
    objectives: [
      "Understand receptor binding and signal transduction",
      "Learn about peptide half-life and why it matters",
      "Know why most peptides cannot be taken orally",
      "Recognize the difference between local and systemic effects",
    ],
    sections: [
      {
        heading: "Receptors: the locks peptides fit",
        content: [
          "A receptor is a protein on (or inside) a cell that recognizes a specific molecule. When the molecule binds, the receptor changes shape and triggers a response inside the cell. Think of it as a lock and key — the peptide is the key, the receptor is the lock, and the cellular response is the door opening.",
          "Peptide receptors are often G-protein-coupled receptors (GPCRs) embedded in the cell membrane. When a peptide binds to the extracellular side, the receptor activates a G-protein on the intracellular side, which then triggers a cascade of molecular events: enzymes are activated, second messengers are produced, genes are turned on or off.",
          "The specificity of this interaction is why sequence matters. A peptide that differs by one amino acid may not fit the receptor at all — or it may fit a different receptor entirely. This is also why peptides tend to be more selective than small-molecule drugs: they have more contact points with the receptor, making off-target binding less likely.",
          "Some receptors become less responsive after repeated stimulation — a process called desensitization or downregulation. This is one reason peptide protocols often include cycling or rest periods. Continuous stimulation can lead to diminishing returns.",
        ],
      },
      {
        heading: "Signal cascades: from binding to effect",
        content: [
          "Receptor binding is just the beginning. The signal must be amplified and translated into a cellular response. This happens through signaling cascades — chains of molecular events where each step activates the next.",
          "For example, when GLP-1 binds its receptor on a pancreatic beta cell, the receptor activates adenylyl cyclase, which produces cyclic AMP (cAMP), which activates protein kinase A, which phosphorylates proteins involved in insulin secretion. The result: more insulin is released. Each step amplifies the signal — a few molecules of peptide lead to a large cellular response.",
          "Different receptors use different cascades. Some activate phospholipase C and release calcium. Some activate MAP kinase pathways involved in cell growth. Some inhibit rather than activate. The peptide determines which receptor is engaged; the receptor determines which cascade fires.",
          "This cascade logic explains both therapeutic effects and side effects. A peptide that activates a receptor in one tissue may activate the same receptor in another tissue where you did not want it. Understanding off-target effects requires knowing where the receptor is expressed throughout the body.",
        ],
      },
      {
        heading: "Half-life: how long a peptide lasts",
        content: [
          "Half-life is the time it takes for half of a peptide to be cleared from the bloodstream. Native GLP-1 has a half-life of about 2 minutes — enzymes called DPP-4 break it down almost immediately. That is why natural GLP-1 works locally (gut to brain signaling) but cannot be used as a drug directly.",
          "Semaglutide, a modified GLP-1, has a half-life of about one week. The modifications — an amino acid substitution and a fatty acid chain that binds to albumin — protect it from enzymatic breakdown and allow weekly dosing. Tirzepatide, a dual GIP/GLP-1 agonist, has similar modifications.",
          "Half-life determines dosing frequency and affects side effect profiles. A short-acting peptide produces a spike and then clears; a long-acting peptide maintains steady levels. Neither is inherently better — it depends on what you are trying to achieve and how the body tolerates sustained receptor activation.",
          "Some peptides are designed to be short-acting precisely because continuous stimulation is undesirable. Ipamorelin pulses growth hormone release and then clears, mimicking the natural pattern. Continuous GH elevation, by contrast, carries different risks.",
        ],
      },
      {
        heading: "Why most peptides cannot be swallowed",
        content: [
          "Your digestive system is designed to break down proteins and peptides into amino acids. If you swallow a peptide, stomach acid and digestive enzymes will degrade it before it reaches the bloodstream. This is why most peptide therapies are injected.",
          "Some peptides can be delivered sublingually (under the tongue) or buccally (inside the cheek), where they absorb through mucous membranes before swallowing. Absorption is often incomplete, and bioavailability varies. Nasal sprays work similarly — oxytocin and some other peptides are delivered this way.",
          "Oral semaglutide exists because of a clever workaround: it is co-formulated with an absorption enhancer (SNAC) that temporarily opens tight junctions in the stomach lining and protects the peptide from degradation. Even so, oral bioavailability is about 1% — you need a much larger dose than injectable, and it must be taken on an empty stomach with minimal water.",
          "Topical peptides — in creams and serums — are a special case. The skin is a barrier. Small peptides may penetrate the outer layer; larger ones typically do not. Copper peptides (GHK-Cu) have some evidence for topical efficacy in wound healing and skin appearance. Claims that other peptides 'absorb deeply' should be met with requests for penetration data.",
        ],
      },
      {
        heading: "Local vs. systemic effects",
        content: [
          "Where you inject a peptide affects what happens next. Subcutaneous injection (under the skin) releases the peptide slowly into the bloodstream for systemic distribution. Intramuscular injection may absorb faster. Some peptides are injected locally — into a joint or near an injury site — with the goal of concentrating effects in that area.",
          "Systemic effects mean the peptide circulates throughout the body and can act wherever its receptor is expressed. GLP-1 agonists affect the gut, pancreas, brain, and potentially heart and kidneys. You cannot restrict the effect to one organ.",
          "Local injection attempts to concentrate the peptide where it is needed. BPC-157, for example, is sometimes injected near tendons or into joints. Whether it stays local or redistributes systemically is debated. Peptides are small and diffuse; assuming strict localization may be optimistic.",
          "The distinction matters for both efficacy and safety. Systemic peptides produce systemic effects — and systemic side effects. Local approaches may reduce systemic exposure but also reduce total dose reaching the target. There are trade-offs either way.",
        ],
      },
    ],
    keyTakeaways: [
      "Peptides work by binding to receptors, which trigger intracellular signaling cascades",
      "Half-life determines how long a peptide stays active — short-acting vs. long-acting have different use cases",
      "Most peptides cannot survive digestion and must be injected; oral versions require special formulation",
      "Systemic injection means effects throughout the body; local injection may concentrate effects but does not guarantee localization",
      "Receptor desensitization is real — continuous stimulation can reduce responsiveness over time",
    ],
    nextModuleSlug: "reading-the-evidence",
    prevModuleSlug: "peptides-and-your-body",
  },

  "reading-the-evidence": {
    slug: "reading-the-evidence",
    moduleNumber: "04",
    title: "Reading the Evidence",
    subtitle: "What clinical trials actually show — and what they don't",
    readTime: "9 min",
    heroDescription:
      "Most peptide claims you see online come from studies that do not mean what the headline suggests. This module teaches you to evaluate evidence: study design, effect size, statistical significance, and why tier matters.",
    objectives: [
      "Distinguish between study types and what each can prove",
      "Understand effect size vs. statistical significance",
      "Learn to spot cherry-picked data and overstated claims",
      "Apply the five-tier evidence framework to real examples",
    ],
    sections: [
      {
        heading: "The hierarchy of evidence",
        content: [
          "Not all studies are created equal. A randomized controlled trial (RCT) in humans provides stronger evidence than an observational study, which provides stronger evidence than an animal study, which provides stronger evidence than a cell-culture experiment. This hierarchy exists because each level addresses different sources of bias.",
          "Cell-culture studies (in vitro) show that a molecule can have an effect on isolated cells. They do not show that the molecule will reach those cells in a living organism, survive metabolism, or produce the same effect in the context of a whole body.",
          "Animal studies show effects in living organisms, but animals are not humans. Rodent metabolism, receptor distribution, and disease models differ from ours. Many drugs that work beautifully in mice fail in human trials. The translation gap is real.",
          "Human studies vary in design. Observational studies watch what happens without intervening — useful for generating hypotheses but cannot prove causation. Open-label trials give everyone the treatment and measure outcomes — better, but placebo effects and observer bias can inflate results. Randomized, placebo-controlled, double-blind trials are the gold standard: participants are randomly assigned to treatment or placebo, and neither they nor the investigators know who got what until the end.",
        ],
      },
      {
        heading: "Our five-tier system",
        content: [
          "We use a five-tier system to label every claim on our peptide briefs. Tier 1 is the strongest: large randomized controlled trials or meta-analyses of multiple trials. Semaglutide weight loss is Tier 1 — backed by the STEP trial program with thousands of participants.",
          "Tier 2 includes smaller RCTs or phase 2 trials. The evidence is human and controlled, but sample sizes are limited or follow-up is short. PT-141 for sexual dysfunction is Tier 2 — FDA-approved based on controlled trials, but smaller than the semaglutide dataset.",
          "Tier 3 is observational or open-label human data. There are real people involved, but no proper control group. You cannot be sure whether the observed effect is from the treatment or from placebo response, natural variation, or co-interventions.",
          "Tier 4 is animal studies. BPC-157 tendon healing claims are Tier 4 — the rodent data is consistent and interesting, but no completed human efficacy trials exist. Quoting animal data as if it applies to you is a category error.",
          "Tier 5 is cell-culture or mechanistic studies. Copper peptide gene-expression claims are often Tier 5 — the dramatic effects are in cell lines, not in human skin. Tier 5 is where hype is born: impressive-sounding mechanisms that have not been tested in organisms.",
        ],
      },
      {
        heading: "Effect size vs. statistical significance",
        content: [
          "Statistical significance tells you whether an observed difference is likely to be real (not due to chance). It does not tell you whether the difference matters. A study can show a statistically significant effect that is clinically trivial.",
          "Effect size tells you how large the difference is. If a peptide lowers a biomarker by 0.5% with p < 0.05, it is statistically significant but probably useless. If it lowers the biomarker by 30%, that is a different story.",
          "The semaglutide STEP trials reported average weight loss of about 15% of body weight over 68 weeks. That is a large effect size. The statistical significance (p < 0.001) confirms it is not due to chance. Both matter.",
          "Be suspicious of claims that emphasize p-values without reporting effect sizes. 'Significantly increased collagen synthesis' means nothing without knowing by how much and in what context. A 5% increase in a petri dish is not the same as visible skin improvement in humans.",
        ],
      },
      {
        heading: "Reading between the headlines",
        content: [
          "Peptide marketing often cherry-picks the most favorable data point from the most favorable study. One technique is to quote animal studies as if they were human trials. Another is to report relative risk reduction without absolute numbers.",
          "If a peptide reduces some risk by 50% (relative), but the baseline risk was 2%, the absolute reduction is 1% (from 2% to 1%). The 50% sounds dramatic; the 1% is what actually happened. Both are technically true; one is more informative.",
          "Watch for surrogate endpoints. A study might show that a peptide raises GH levels or increases a biomarker. But the question that matters is: does it produce the outcome you care about? Higher GH does not automatically mean more muscle or less fat. Biomarkers are not the same as results.",
          "Also watch for selective reporting. If a study measured 20 outcomes and only the one favorable result gets published, that is a red flag. Pre-registration — where researchers declare their endpoints before running the trial — reduces this problem. Most peptide studies are not pre-registered.",
        ],
      },
      {
        heading: "Applying this to your decisions",
        content: [
          "When you see a peptide claim, ask: what tier is the evidence? If the answer is Tier 4 or 5, the honest summary is 'promising but unproven in humans.' That does not mean you should never consider it — it means you should know what you are buying.",
          "Ask about the population studied. A trial in obese adults with diabetes may not apply to lean athletes. A study in postmenopausal women may not apply to young men. Extrapolating across populations adds uncertainty.",
          "Ask about side effects. Every intervention has trade-offs. A study reporting only benefits is incomplete. The absence of reported side effects often means they were not systematically collected, not that they do not exist.",
          "Finally, remember that you are not obligated to have an opinion. If the evidence is genuinely uncertain, 'I do not know yet' is a reasonable position. The goal of evidence literacy is not to have all the answers — it is to ask better questions.",
        ],
      },
    ],
    keyTakeaways: [
      "Study design matters: RCTs > observational > animal > cell culture",
      "Statistical significance tells you an effect is real; effect size tells you if it matters",
      "Be wary of relative risk without absolute numbers, surrogate endpoints, and selective reporting",
      "Tier 4 and 5 evidence is hypothesis-generating, not proof of efficacy in humans",
      "'I don't know yet' is an honest answer when evidence is genuinely uncertain",
    ],
    nextModuleSlug: "from-reading-to-a-plan",
    prevModuleSlug: "how-peptides-work",
  },

  "from-reading-to-a-plan": {
    slug: "from-reading-to-a-plan",
    moduleNumber: "05",
    title: "From Reading to a Plan",
    subtitle: "How we turn labs, history, and goals into a protocol",
    readTime: "6 min",
    heroDescription:
      "You have learned the science. Now: how does that translate into an actual treatment plan? This module explains what our providers screen for, why we say no sometimes, and what a responsible consultation looks like.",
    objectives: [
      "Understand what labs and history we review before prescribing",
      "Know the contraindications that disqualify candidates",
      "Learn how goals and expectations shape protocol design",
      "Recognize what ongoing monitoring involves",
    ],
    sections: [
      {
        heading: "The intake: more than a questionnaire",
        content: [
          "Before any peptide is prescribed, we need context. A questionnaire tells us what you are hoping to achieve, but it does not tell us whether that goal is realistic, safe, or best addressed with peptides at all.",
          "We review your medical history: current diagnoses, past conditions, surgeries, allergies. Some conditions are absolute contraindications — active cancer, for example, rules out growth hormone secretagogues because GH can promote tumor growth. Other conditions require caution and monitoring.",
          "We review your medications. Drug interactions matter. Some peptides affect the same pathways as your existing prescriptions. GLP-1 agonists slow gastric emptying, which can alter absorption of oral medications. We need to know what you are taking before we add anything.",
          "We review your goals and expectations. If you are hoping a peptide will produce results that the evidence does not support, we will tell you. If your goals are realistic but a simpler intervention would work, we may recommend that first. Peptide therapy is not always the answer, and an honest provider will say so.",
        ],
      },
      {
        heading: "Baseline labs: what we measure and why",
        content: [
          "Lab work establishes your baseline and identifies contraindications. For metabolic peptides like GLP-1 agonists, we check fasting glucose, HbA1c, lipid panel, and kidney function. We need to know where you are starting to measure whether the treatment is working.",
          "For growth hormone secretagogues, we check IGF-1 (which reflects GH activity), fasting glucose (since GH can impair insulin sensitivity), and sometimes a full hormone panel. Elevated IGF-1 at baseline suggests you may not need additional GH stimulation — and that further elevation could be risky.",
          "For hormone optimization, we run comprehensive panels: total and free testosterone, estradiol, SHBG, LH, FSH, thyroid function, cortisol. Hormone symptoms are nonspecific; you cannot guess what is low from how you feel. Labs tell us what is actually happening.",
          "We also screen for conditions that contraindicate treatment. Personal or family history of medullary thyroid carcinoma rules out GLP-1 agonists. History of pancreatitis requires extra caution. These are not arbitrary rules — they come from adverse events observed in trials and clinical practice.",
        ],
      },
      {
        heading: "The reasons we say no",
        content: [
          "Sometimes the answer is no. That is not a judgment of you — it is a judgment of whether a treatment is safe and appropriate given your specific situation.",
          "Absolute contraindications are non-negotiable. Active malignancy, pregnancy, breastfeeding, certain genetic conditions — these are lines we do not cross. The risk-benefit calculation does not favor the treatment, regardless of how much you want it.",
          "Relative contraindications require case-by-case judgment. A history of eating disorder may mean GLP-1 agonists are inappropriate, or it may mean we proceed with close psychiatric monitoring. Unstable cardiac conditions may require clearance from a cardiologist before we prescribe something that affects heart rate.",
          "Sometimes the answer is 'not yet.' If your labs suggest a reversible underlying issue — thyroid dysfunction, vitamin deficiency, sleep apnea — addressing that first may resolve your symptoms without peptides. We do not prescribe hormones to fix a sleep problem.",
          "And sometimes the answer is 'not here.' If you want a peptide we do not carry because the evidence does not support it, or you want to use something we consider unsafe, we will explain why and decline. You are free to seek care elsewhere; we are not obligated to provide treatments we believe are inappropriate.",
        ],
      },
      {
        heading: "Building the protocol",
        content: [
          "If you are a candidate, we design a protocol based on your goals, your baseline, and the evidence. This includes the peptide (or combination), the dose, the frequency, the route of administration, and the duration.",
          "Dosing is individualized. We do not publish standard doses because they do not exist — or rather, they are starting points that get adjusted based on response and tolerability. Someone with severe nausea on GLP-1 may need a slower titration. Someone with robust GH response may need a lower secretagogue dose.",
          "We define what success looks like. Weight loss protocols have target ranges. Hormone optimization has target levels. Without clear endpoints, you cannot tell whether the treatment is working — and neither can we.",
          "We also define stopping rules. What side effects warrant dose reduction? What adverse events mean we stop entirely? What timeline do we give the treatment before concluding it is not working? These decisions are made upfront, not improvised later.",
        ],
      },
      {
        heading: "Monitoring: the work does not end at the prescription",
        content: [
          "Peptide therapy is not fire-and-forget. We schedule follow-up labs to track response: metabolic markers, hormone levels, safety parameters. The timeline depends on the treatment — some require monthly monitoring initially, others quarterly.",
          "We track subjective response too. Are you feeling better? Are side effects tolerable? Are you actually using the medication as prescribed? Non-adherence is common; if you are not taking it, we need to know why.",
          "We adjust based on data. If labs show inadequate response, we may increase the dose. If side effects are limiting, we may decrease it or try an alternative. If you hit your goal, we discuss maintenance, tapering, or discontinuation.",
          "The relationship is ongoing. You are not buying a vial and disappearing — you are entering a medical relationship with accountability on both sides. We prescribe responsibly; you use responsibly and report honestly. That is how peptide therapy works safely.",
        ],
      },
    ],
    keyTakeaways: [
      "Intake includes history, medications, and goals — context determines candidacy",
      "Labs establish your baseline and screen for contraindications before treatment",
      "Some conditions are absolute nos; others require case-by-case judgment",
      "Protocols are individualized with defined endpoints and stopping rules",
      "Monitoring is ongoing — peptide therapy is a relationship, not a transaction",
    ],
    nextModuleSlug: null,
    prevModuleSlug: "reading-the-evidence",
  },
};

export const MODULE_SLUGS = [
  "peptide-basics",
  "peptides-and-your-body",
  "how-peptides-work",
  "reading-the-evidence",
  "from-reading-to-a-plan",
] as const;

export type ModuleSlug = (typeof MODULE_SLUGS)[number];

export function getModuleBySlug(slug: string): ModuleContent | undefined {
  return MODULE_CONTENT[slug];
}

export function getAllModuleSlugs(): string[] {
  return [...MODULE_SLUGS];
}
