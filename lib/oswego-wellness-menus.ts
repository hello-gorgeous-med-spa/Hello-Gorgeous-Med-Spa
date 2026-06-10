import { buildOswegoMenu } from "@/lib/oswego-injectable-menus";

const WELLNESS_SECONDARY = { label: "Full wellness menu", href: "/services/wellness" };

export const GLP1_WEIGHT_LOSS_OSWEGO_MENU = buildOswegoMenu("glp-1-weight-loss-oswego", {
  eyebrow: "Oswego, IL · NP-supervised medical weight loss",
  titleBefore: "Medical Weight Loss —",
  titleAccent: "From $299/month",
  secondaryCta: WELLNESS_SECONDARY,
  pricingTitle: "Weight loss program pricing",
  pricingHighlights: [
    "Semaglutide from $299/month all-inclusive",
    "Tirzepatide from $399/month all-inclusive",
    "Medication + monthly NP check-in + support included",
    "No insurance required · HSA/FSA receipts available",
    "Intake visit & labs quoted separately — full transparency",
  ],
  pricingRows: [
    { label: "Semaglutide program", price: "From $299/mo", href: "/semaglutide-oswego", note: "Medication + check-ins included" },
    { label: "Tirzepatide program", price: "From $399/mo", href: "/tirzepatide-oswego", note: "Dual-action GLP-1 + GIP" },
    { label: "Initial intake & labs", price: "Consult", note: "Quoted before any commitment" },
    { label: "Free consultation", price: "$0", note: "Honest candidacy assessment" },
  ],
  pricingBadge: "FROM $299/MO",
  howItWorksHighlights: [
    "Mimics your natural fullness hormone — eat less without feeling deprived",
    "Weekly self-injection — tiny needle, we teach you how",
    "Slows gastric emptying & quiets food noise",
    "FDA-approved family (Wegovy, Ozempic, Mounjaro, Zepbound)",
    "Pharmacy-sourced from licensed US compounders only",
  ],
  howItWorksLinks: [
    { label: "Semaglutide — the established option", price: "Compare →", href: "/semaglutide-oswego" },
    { label: "Tirzepatide — the stronger dual-action option", price: "Compare →", href: "/tirzepatide-oswego" },
  ],
  howItWorksLearnMore: "/semaglutide-oswego",
  careGuideHref: "/pre-post-care/weight-loss",
  treatmentTime: "Monthly visits",
  whyRows: [
    { label: "Free consultation", price: "Always", note: "We're honest if GLP-1 isn't right for you" },
    { label: "Monthly check-ins", price: "Included", note: "Dose adjustments & side-effect management" },
    { label: "Medication source", price: "US pharmacies", note: "Licensed 503A/503B — never gray-market" },
  ],
  whatToExpectDescription:
    "Free consult, comprehensive medical intake, prescription with injection training, then monthly check-ins for weight, dose titration, and side-effect management — the part most programs skip.",
  relatedDescription:
    "Weight loss works best as part of a bigger plan — hormones, peptides, and body contouring each play a role for the right client.",
  relatedHighlights: [
    "Semaglutide vs tirzepatide compared at your consult",
    "Peptide therapy for recovery & metabolic support",
    "Quantum RF body contouring once weight stabilizes",
    "BioTE hormone therapy when hormones are the blocker",
  ],
});

export const SEMAGLUTIDE_OSWEGO_MENU = buildOswegoMenu("semaglutide-oswego", {
  eyebrow: "Oswego, IL · NP-supervised medical weight loss",
  titleBefore: "Semaglutide in Oswego, IL —",
  titleAccent: "From $299/month",
  secondaryCta: { label: "Weight loss program menu", href: "/glp-1-weight-loss-oswego" },
  pricingTitle: "Semaglutide pricing",
  pricingHighlights: [
    "From $299/month — medication, check-ins & support included",
    "Same active ingredient as Wegovy & Ozempic",
    "Average 12–15% body weight loss over 12 months in trials",
    "No insurance required · no hidden fees",
    "Intake & labs quoted separately at free consult",
  ],
  pricingRows: [
    { label: "Semaglutide program", price: "From $299/mo", note: "All-inclusive monthly" },
    { label: "Tirzepatide alternative", price: "From $399/mo", href: "/tirzepatide-oswego", note: "Stronger average results" },
    { label: "Initial intake & labs", price: "Consult", note: "Quoted before starting" },
  ],
  pricingBadge: "$299/MO",
  howItWorksHighlights: [
    "GLP-1 receptor agonist — mimics your fullness hormone",
    "Weekly self-injection with a tiny insulin-style pen",
    "Reduces hunger & food cravings without deprivation",
    "The most-studied GLP-1 — longest safety record",
    "Dose ramped slowly to minimize side effects",
  ],
  howItWorksLinks: [
    { label: "Full weight loss program menu", price: "Menu →", href: "/glp-1-weight-loss-oswego" },
    { label: "Tirzepatide — dual-action alternative", price: "Compare →", href: "/tirzepatide-oswego" },
  ],
  howItWorksLearnMore: "/glp-1-weight-loss-oswego",
  careGuideHref: "/pre-post-care/weight-loss",
  treatmentTime: "Monthly visits",
  whyRows: [
    { label: "Free consultation", price: "Always", note: "Honest fit assessment first" },
    { label: "Monthly check-ins", price: "Included", note: "Most programs skip this — we don't" },
    { label: "Medication source", price: "US pharmacies", note: "FDA-regulated compounders only" },
  ],
  whatToExpectDescription:
    "Free consult, medical intake with labs if indicated, prescription and injection training, then monthly check-ins to track weight, adjust dose, and plan your long-term maintenance strategy.",
  relatedDescription:
    "Semaglutide is one tool — if it's not the right one, we'll say so and point you to what is.",
  relatedHighlights: [
    "Tirzepatide when stronger results are the priority",
    "Full program menu compares both medications",
    "Peptides for energy & recovery alongside weight loss",
    "Maintenance planning included from day one",
  ],
});

export const TIRZEPATIDE_OSWEGO_MENU = buildOswegoMenu("tirzepatide-oswego", {
  eyebrow: "Oswego, IL · NP-supervised medical weight loss",
  titleBefore: "Tirzepatide in Oswego, IL —",
  titleAccent: "From $399/month",
  secondaryCta: { label: "Weight loss program menu", href: "/glp-1-weight-loss-oswego" },
  pricingTitle: "Tirzepatide pricing",
  pricingHighlights: [
    "From $399/month — medication, check-ins & support included",
    "Same active ingredient as Mounjaro & Zepbound",
    "Average 15–22% body weight loss over 12 months at higher doses",
    "Dual-action GLP-1 + GIP — often stronger than semaglutide",
    "Switching between medications possible if one underperforms",
  ],
  pricingRows: [
    { label: "Tirzepatide program", price: "From $399/mo", note: "All-inclusive monthly" },
    { label: "Semaglutide alternative", price: "From $299/mo", href: "/semaglutide-oswego", note: "Lower cost, longer record" },
    { label: "Initial intake & labs", price: "Consult", note: "Quoted before starting" },
  ],
  pricingBadge: "$399/MO",
  howItWorksHighlights: [
    "Targets BOTH GLP-1 and GIP receptors",
    "GIP adds appetite, fat-metabolism & insulin-sensitivity effects",
    "Weekly self-injection, same as semaglutide",
    "Some clients tolerate it better than semaglutide",
    "Dose titrated conservatively from the start",
  ],
  howItWorksLinks: [
    { label: "Full weight loss program menu", price: "Menu →", href: "/glp-1-weight-loss-oswego" },
    { label: "Semaglutide — the established option", price: "Compare →", href: "/semaglutide-oswego" },
  ],
  howItWorksLearnMore: "/glp-1-weight-loss-oswego",
  careGuideHref: "/pre-post-care/weight-loss",
  treatmentTime: "Monthly visits",
  whyRows: [
    { label: "Free consultation", price: "Always", note: "Sema vs tirz tradeoffs explained honestly" },
    { label: "Monthly check-ins", price: "Included", note: "Weight, side effects, dose titration" },
    { label: "Medication source", price: "US pharmacies", note: "FDA-regulated compounders only" },
  ],
  whatToExpectDescription:
    "Free consult to weigh tirzepatide vs semaglutide for your case, medical intake, injection training, then monthly check-ins with dose titration and long-term maintenance planning.",
  relatedDescription:
    "Tirzepatide leads on average results, but the right choice depends on your history, tolerance, and budget — we map it at consult.",
  relatedHighlights: [
    "Semaglutide at $100/month less if budget leads",
    "Full program menu compares both side by side",
    "Peptide therapy stacks for energy & recovery",
    "HSA/FSA-compatible receipts available",
  ],
});

export const BIOTE_HORMONE_OSWEGO_MENU = buildOswegoMenu("biote-hormone-therapy-oswego", {
  eyebrow: "Oswego, IL · BioTE Certified Provider",
  titleBefore: "BioTE Hormone Therapy —",
  titleAccent: "Pellets for Women & Men",
  secondaryCta: WELLNESS_SECONDARY,
  pricingTitle: "BioTE pellet pricing",
  pricingHighlights: [
    "Women's insertion typically $400–$650 per pellet visit",
    "Men's insertion typically $750–$1,200 per pellet visit",
    "Baseline lab panel ~$200–$400 depending on what's ordered",
    "Re-dose every 3–5 months based on labs & symptoms",
    "All costs disclosed before you commit — no surprises",
  ],
  pricingRows: [
    { label: "Women's pellet insertion", price: "$400–$650", note: "Estradiol ± testosterone" },
    { label: "Men's pellet insertion", price: "$750–$1,200", note: "Testosterone" },
    { label: "Baseline lab panel", price: "$200–$400", note: "We never dose blind" },
    { label: "Free consultation", price: "$0", note: "Symptoms & history review" },
  ],
  pricingBadge: "CERTIFIED",
  howItWorksHighlights: [
    "Rice-grain-sized pellets inserted under the skin (upper hip)",
    "Steady hormone release for 3–5 months — no daily peaks & valleys",
    "Bioidentical — molecularly identical to your own hormones",
    "Dose calculated from YOUR labs, symptoms, age & weight",
    "15-minute in-office insertion with local numbing",
  ],
  howItWorksLinks: [
    { label: "TRT for men — pellets, injections or cream", price: "Compare →", href: "/testosterone-replacement-oswego" },
    { label: "Peptide therapy menu", price: "Learn →", href: "/peptide-therapy-oswego" },
  ],
  howItWorksLearnMore: "/testosterone-replacement-oswego",
  careGuideHref: "/pre-post-care/hormone-therapy",
  treatmentTime: "~15 min insertion",
  whyRows: [
    { label: "Free consultation", price: "Always", note: "Honest screening — HRT isn't for everyone" },
    { label: "Follow-up at 4–6 weeks", price: "Included", note: "Repeat labs at 3 months" },
    { label: "Post-insertion restrictions", price: "~5 days", note: "Light limits on bathing & exercise" },
  ],
  whatToExpectDescription:
    "Free consult, comprehensive baseline labs, NP lab review with individualized dose calculation, a 15-minute pellet insertion, then scheduled follow-ups and repeat labs — medicine, not a vending machine.",
  relatedDescription:
    "Hormones touch everything — energy, sleep, libido, mood, body composition. We often pair BioTE with weight loss or peptide programs.",
  relatedHighlights: [
    "TRT delivery options compared: pellets vs injections vs cream",
    "GLP-1 weight loss when weight is the bigger lever",
    "Peptides for recovery, sleep & longevity goals",
    "Repeat labs built into every program",
  ],
});
