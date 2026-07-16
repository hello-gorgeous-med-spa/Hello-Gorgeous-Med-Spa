import { BOOKING_URL } from "@/lib/flows";
import { buildOswegoMenu } from "@/lib/oswego-injectable-menus";
import { GLP1_PROGRAM, GLP1_PROGRAM_CONSULT_USD } from "@/lib/glp1-program-pricing";

const WELLNESS_SECONDARY = { label: "Full wellness menu", href: "/services/wellness" };
const { injectable: GLP1_INJ, oral: GLP1_ORAL, pharmacyRx: GLP1_RX } = GLP1_PROGRAM;

export const GLP1_WEIGHT_LOSS_OSWEGO_MENU = buildOswegoMenu("glp-1-weight-loss-oswego", {
  eyebrow: "Oswego, IL · NP-supervised medical weight loss",
  titleBefore: "Medical Weight Loss —",
  titleAccent: `From $${GLP1_INJ.monthlyFromUsd}/month`,
  secondaryCta: WELLNESS_SECONDARY,
  pricingTitle: "Weight loss program pricing",
  pricingHighlights: [
    `$${GLP1_PROGRAM_CONSULT_USD} NP consult — credited toward first month of injectables if you enroll`,
    `Semaglutide injectable from $${GLP1_INJ.semaglutideFromUsd}/month all-inclusive`,
    `Tirzepatide injectable from $${GLP1_INJ.tirzepatideStarterUsd}/month (${GLP1_INJ.pendingNote})`,
    `3-month prepay from $${GLP1_INJ.threeMonthFromUsd} · high-dose from $${GLP1_INJ.threeMonthHighDoseFromUsd}`,
    GLP1_PROGRAM.followUpIncluded,
    "No insurance required · HSA/FSA receipts available",
  ],
  pricingRows: [
    {
      label: "New patient consult (in-person)",
      price: `$${GLP1_PROGRAM_CONSULT_USD}`,
      note: "Credited to month 1 injectables if you start",
    },
    {
      label: "Semaglutide injectable",
      price: `From $${GLP1_INJ.semaglutideFromUsd}/mo`,
      href: "/semaglutide-oswego",
      note: "Medication + supplies + monthly check-in",
    },
    {
      label: "Tirzepatide injectable",
      price: `From $${GLP1_INJ.tirzepatideStarterUsd}/mo`,
      href: "/tirzepatide-oswego",
      note: `Standard $${GLP1_INJ.tirzepatideStandardUsd} · advanced $${GLP1_INJ.tirzepatideAdvancedUsd}`,
    },
    {
      label: "3-month injectable prepay",
      price: `From $${GLP1_INJ.threeMonthFromUsd}`,
      note: GLP1_INJ.pendingNote,
    },
    {
      label: "Oral GLP-1 (home delivery)",
      price: `$${GLP1_ORAL.monthlyFromUsd}–$${GLP1_ORAL.monthlyToUsd}/mo`,
      note: GLP1_ORAL.note,
    },
    {
      label: "Pharmacy Rx evaluation",
      price: `$${GLP1_RX.monthlyEvalUsd}/mo`,
      note: "Rx only — med cost at pharmacy separate",
    },
  ],
  pricingBadge: `FROM $${GLP1_INJ.monthlyFromUsd}/MO`,
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
    {
      label: "New patient consult",
      price: `$${GLP1_PROGRAM_CONSULT_USD}`,
      note: "Credited to first month injectables if you enroll",
    },
    { label: "Monthly check-ins", price: "Included", note: "In-person or Square telehealth" },
    { label: "Medication source", price: "US pharmacies", note: "Licensed 503A/503B — never gray-market" },
  ],
  whatToExpectDescription:
    `$${GLP1_PROGRAM_CONSULT_USD} consult, comprehensive medical intake, prescription with injection training, then included monthly check-ins for weight, dose titration, and side-effect management.`,
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
  titleAccent: `From $${GLP1_INJ.semaglutideFromUsd}/month`,
  secondaryCta: { label: "Weight loss program menu", href: "/glp-1-weight-loss-oswego" },
  pricingTitle: "Semaglutide pricing",
  pricingHighlights: [
    `From $${GLP1_INJ.semaglutideFromUsd}/month — medication, supplies & check-ins included`,
    `Consult $${GLP1_PROGRAM_CONSULT_USD} — credited to month 1 if you start`,
    "Same active ingredient as Wegovy & Ozempic",
    "Average 12–15% body weight loss over 12 months in trials",
    "No insurance required · no hidden fees",
  ],
  pricingRows: [
    { label: "Semaglutide injectable", price: `From $${GLP1_INJ.semaglutideFromUsd}/mo`, note: "All-inclusive monthly" },
    {
      label: "Tirzepatide alternative",
      price: `From $${GLP1_INJ.tirzepatideStarterUsd}/mo`,
      href: "/tirzepatide-oswego",
      note: "Stronger average results",
    },
    {
      label: "New patient consult",
      price: `$${GLP1_PROGRAM_CONSULT_USD}`,
      note: "Credited to first month injectables",
    },
  ],
  pricingBadge: `$${GLP1_INJ.semaglutideFromUsd}/MO`,
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
    { label: "New patient consult", price: `$${GLP1_PROGRAM_CONSULT_USD}`, note: "Credited if you enroll" },
    { label: "Monthly check-ins", price: "Included", note: "Most programs skip this — we don't" },
    { label: "Medication source", price: "US pharmacies", note: "FDA-regulated compounders only" },
  ],
  whatToExpectDescription:
    `$${GLP1_PROGRAM_CONSULT_USD} consult, medical intake with labs if indicated, prescription and injection training, then included monthly check-ins to track weight, adjust dose, and plan maintenance.`,
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
  titleAccent: `From $${GLP1_INJ.tirzepatideStarterUsd}/month`,
  secondaryCta: { label: "Weight loss program menu", href: "/glp-1-weight-loss-oswego" },
  pricingTitle: "Tirzepatide pricing",
  pricingHighlights: [
    `Starter from $${GLP1_INJ.tirzepatideStarterUsd}/mo · standard $${GLP1_INJ.tirzepatideStandardUsd} · advanced $${GLP1_INJ.tirzepatideAdvancedUsd}`,
    `Consult $${GLP1_PROGRAM_CONSULT_USD} — credited to month 1 if you start`,
    "Same active ingredient as Mounjaro & Zepbound",
    "Average 15–22% body weight loss over 12 months at higher doses",
    "3-month prepay from $" + GLP1_INJ.threeMonthFromUsd,
  ],
  pricingRows: [
    { label: "Tirzepatide starter", price: `From $${GLP1_INJ.tirzepatideStarterUsd}/mo`, note: "Medication + supplies + check-in" },
    { label: "Standard / advanced tiers", price: `$${GLP1_INJ.tirzepatideStandardUsd}–$${GLP1_INJ.tirzepatideAdvancedUsd}/mo`, note: "Based on weekly dose" },
    { label: "Semaglutide alternative", price: `From $${GLP1_INJ.semaglutideFromUsd}/mo`, href: "/semaglutide-oswego", note: "Lower cost option" },
    { label: "New patient consult", price: `$${GLP1_PROGRAM_CONSULT_USD}`, note: "Credited to first month injectables" },
  ],
  pricingBadge: `$${GLP1_INJ.tirzepatideStarterUsd}/MO`,
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
    { label: "New patient consult", price: `$${GLP1_PROGRAM_CONSULT_USD}`, note: "Credited if you enroll" },
    { label: "Monthly check-ins", price: "Included", note: "Weight, side effects, dose titration" },
    { label: "Medication source", price: "US pharmacies", note: "FDA-regulated compounders only" },
  ],
  whatToExpectDescription:
    `$${GLP1_PROGRAM_CONSULT_USD} consult to weigh tirzepatide vs semaglutide, medical intake, injection training, then included monthly check-ins with dose titration and maintenance planning.`,
  relatedDescription:
    "Tirzepatide leads on average results, but the right choice depends on your history, tolerance, and budget — we map it at consult.",
  relatedHighlights: [
    `Semaglutide from $${GLP1_INJ.semaglutideFromUsd}/mo if budget leads`,
    "Full program menu compares both side by side",
    "Peptide therapy stacks for energy & recovery",
    "HSA/FSA-compatible receipts available",
  ],
});

export const TRT_OSWEGO_MENU = buildOswegoMenu("testosterone-replacement-oswego", {
  eyebrow: "Oswego, IL · NP-supervised men's hormone medicine",
  titleBefore: "TRT in Oswego, IL —",
  titleAccent: "Pellets, Injections or Cream",
  secondaryCta: { label: "BioTE hormone menu", href: "/biote-hormone-therapy-oswego" },
  pricingTitle: "TRT program pricing",
  pricingHighlights: [
    "Weekly injections from $200–$350/month all-inclusive",
    "BioTE pellets $750–$1,200 per insertion (every 4–6 months)",
    "Topical cream programs $150–$300/month",
    "Baseline lab panel ~$250–$450 — we never dose blind",
    "HSA/FSA-compatible receipts · reimbursement docs on request",
  ],
  pricingRows: [
    { label: "Weekly injections", price: "$200–$350/mo", note: "Most cost-effective · steady levels" },
    { label: "BioTE pellets", price: "$750–$1,200", href: "/biote-hormone-therapy-oswego", note: "Set-and-forget for 4–6 months" },
    { label: "Topical cream", price: "$150–$300/mo", note: "Easy to start & stop · daily application" },
    { label: "Baseline labs", price: "$250–$450", note: "Total & free T, estradiol, PSA, hematocrit" },
  ],
  pricingBadge: "MEN'S HEALTH",
  howItWorksHighlights: [
    "Restores testosterone to an age-appropriate clinical level",
    "Three delivery methods — we help you pick what fits your life",
    "Energy, mood, libido, body composition & sleep all in scope",
    "Repeat labs at 6–8 weeks, then every 3–6 months",
    "Fertility implications discussed BEFORE you start",
  ],
  howItWorksLinks: [
    { label: "BioTE pellet therapy in depth", price: "Menu →", href: "/biote-hormone-therapy-oswego" },
    { label: "Peptide therapy — recovery & longevity", price: "Menu →", href: "/peptide-therapy-oswego" },
  ],
  howItWorksLearnMore: "/biote-hormone-therapy-oswego",
  careGuideHref: "/pre-post-care/hormone-therapy",
  treatmentTime: "Labs first",
  whyRows: [
    { label: "Free consultation", price: "Always", note: "Symptoms alone aren't enough — labs decide" },
    { label: "Ongoing monitoring", price: "Included", note: "PSA & hematocrit watched at every interval" },
    { label: "Borderline numbers?", price: "Honest talk", note: "We don't push TRT when it isn't indicated" },
  ],
  whatToExpectDescription:
    "Free consult, comprehensive baseline labs, NP lab review, delivery-method selection based on your lifestyle, then repeat labs at 6–8 weeks and every 3–6 months — medicine, not a marketing funnel.",
  relatedDescription:
    "Low T rarely travels alone — sleep, weight, and recovery often need attention in the same plan. We map the full picture at consult.",
  relatedHighlights: [
    "BioTE pellets when convenience leads",
    "Peptides for recovery & sleep alongside TRT",
    "GLP-1 weight loss when weight is part of the picture",
    "IV therapy for energy & hydration support",
  ],
});

export const PEPTIDE_THERAPY_OSWEGO_MENU = buildOswegoMenu("peptide-therapy-oswego", {
  eyebrow: "Oswego, IL · Prescription peptides, NP-supervised",
  titleBefore: "Peptide Therapy —",
  titleAccent: "$49 Consult",
  primaryCta: { label: "Book $49 Consult", href: BOOKING_URL },
  secondaryCta: WELLNESS_SECONDARY,
  pricingTitle: "Peptide protocol pricing",
  pricingHighlights: [
    "$49 peptide consultation with the medical team",
    "Monthly protocols from $149/mo — published starting rates by peptide",
    "Recovery Blend from $229/mo · BPC-157 from $169/mo · Sermorelin from $149/mo",
    "Licensed US compounding pharmacies only — never research-grade",
    "Complete transparent pricing before any commitment",
  ],
  pricingRows: [
    { label: "Peptide consultation", price: "$49", note: "Goals, history & protocol design" },
    { label: "Monthly protocols", price: "From $149/mo", note: "See full menu on /peptides#peptide-pricing" },
    { label: "Recovery Blend", price: "From $229/mo", note: "BPC · GHK-Cu · KPV · TB-500" },
    { label: "NAD+ IV infusions", price: "From $400", href: "/nad-iv-oswego", note: "Series pricing available" },
    { label: "Full wellness menu", price: "Menu →", href: "/services/wellness" },
  ],
  pricingBadge: "$49 CONSULT",
  howItWorksHighlights: [
    "Short amino-acid chains that signal specific cells",
    "Recovery · sleep · skin · libido · lean muscle · longevity",
    "Small subcutaneous self-injections, several times weekly",
    "Dosing, cycling & combinations set by your NP",
    "Sleep effects in 1–2 weeks · skin & longevity 8–12 weeks",
  ],
  howItWorksLinks: [
    { label: "NAD+ IV — the cellular energy infusion", price: "Learn →", href: "/nad-iv-oswego" },
    { label: "GLP-1s are peptides too — weight loss menu", price: "Menu →", href: "/glp-1-weight-loss-oswego" },
  ],
  howItWorksLearnMore: "/services/wellness",
  careGuideHref: "/pre-post-care",
  treatmentTime: "Self-injected",
  whyRows: [
    { label: "Consultation", price: "$49", note: "Applied honestly — no obligation to start" },
    { label: "Follow-up & dose adjustment", price: "Included", note: "Peptides are iterative — we stay involved" },
    { label: "Sourcing", price: "US pharmacies", note: "No internet vials, no gray market" },
  ],
  whatToExpectDescription:
    "A $49 consult, labs if indicated, a written protocol with dose, frequency and cycle, self-injection training, then follow-ups to adjust as your body responds.",
  relatedDescription:
    "Peptides slot into bigger plans — weight loss, hormones, and IV therapy each cover what peptides alone can't.",
  relatedHighlights: [
    "NAD+ IV for cellular energy & clarity",
    "GLP-1 programs when weight is the primary goal",
    "BioTE / TRT when hormones are the bottleneck",
    "Vitamin Bar shots from $25 for quick boosts",
  ],
});

export const PEPTIDE_THERAPY_NAPERVILLE_MENU = buildOswegoMenu("peptide-therapy-naperville-il", {
  eyebrow: "Naperville, IL · ~15 min to Oswego · DuPage & Will counties",
  titleBefore: "Peptide Therapy —",
  titleAccent: "$49 Consult",
  primaryCta: { label: "Book $49 Consult", href: BOOKING_URL },
  secondaryCta: { label: "Peptide education hub", href: "/peptides" },
  pricingTitle: "Peptide protocol pricing (Naperville clients)",
  pricingHighlights: [
    "$49 peptide consultation — goals, history & protocol design",
    "Monthly protocols from $149/mo — published starting rates by peptide",
    "Recovery Blend from $229/mo · BPC-157 from $169/mo · Sermorelin from $149/mo",
    "Licensed US compounding pharmacies — never research-grade vials",
    "Clinic in downtown Oswego — ~15 min from south Naperville via Route 59 or Route 34",
  ],
  pricingRows: [
    { label: "Peptide consultation", price: "$49", note: "NP evaluation · no obligation to start" },
    { label: "Monthly protocols", price: "From $149/mo", href: "/peptides#peptide-pricing", note: "Full published menu" },
    { label: "BPC-157 guide", price: "Learn →", href: "/peptides/bpc-157", note: "Recovery & gut support" },
    { label: "Recovery Blend", price: "From $229/mo", note: "BPC · GHK-Cu · KPV · TB-500" },
    { label: "Naperville city hub", price: "Directions →", href: "/naperville-il", note: "Route 59 · Route 34 drive times" },
  ],
  pricingBadge: "$49 CONSULT",
  howItWorksHighlights: [
    "Short amino-acid chains that signal recovery, sleep, skin & metabolism pathways",
    "Self-administered subcutaneous injections — we teach you in office",
    "Ryan Kent, FNP-BC designs dose, frequency & cycle — not a telehealth script mill",
    "503A pharmacy sourcing · RE GEN staff places pharmacy orders after NP approval",
    "Sleep support often 1–2 weeks · skin & longevity typically 8–12 weeks",
  ],
  howItWorksLinks: [
    { label: "Which peptide fits your goal?", price: "Guide →", href: "/blog/which-peptide-is-right-for-you-oswego-il" },
    { label: "GLP-1 weight loss menu", price: "Menu →", href: "/glp-1-weight-loss-oswego" },
    { label: "Full peptide hub", price: "Explore →", href: "/peptides" },
  ],
  howItWorksLearnMore: "/peptides",
  careGuideHref: "/pre-post-care",
  treatmentTime: "Self-injected",
  whyRows: [
    { label: "Consultation", price: "$49", note: "Honest screening — peptides aren't for everyone" },
    { label: "Follow-up & dose adjustment", price: "Included", note: "Peptides are iterative — we stay involved" },
    { label: "Drive from Naperville", price: "~15 min", note: "Route 59 south or Route 34 west" },
  ],
  whatToExpectDescription:
    "Book the $49 consult in Oswego, complete screening and labs if needed, receive a written protocol with dose and cycle, get hands-on injection training, then follow up as your body responds — same NP team many Naperville clients use for Botox, GLP-1, and Morpheus8.",
  relatedDescription:
    "Naperville clients often stack peptides with weight loss, hormones, or skin tightening at the same Oswego clinic — one address, one medical team.",
  relatedHighlights: [
    "GLP-1 programs when weight is the primary goal",
    "BioTE / TRT when hormones are the bottleneck",
    "Morpheus8 Burst & Solaria CO₂ for skin tightening",
    "NAD+ IV for cellular energy between peptide cycles",
  ],
  relatedSectionTitle: "Related treatments for Naperville clients",
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
