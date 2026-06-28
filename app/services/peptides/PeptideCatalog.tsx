"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = ["All", "Fat Loss", "Recovery", "Brain Health", "Sexual Health"] as const;
type Category = (typeof CATEGORIES)[number];

interface Peptide {
  name: string;
  tagline: string;
  category: Exclude<Category, "All">;
  overview: string;
  benefits: { icon: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  highlight: string;
}

const PEPTIDES: Peptide[] = [
  {
    name: "Tesamorelin / Ipamorelin",
    tagline: "Targeted fat loss — especially visceral abdominal fat — while preserving muscle and improving sleep.",
    category: "Fat Loss",
    overview:
      "This combination pairs Tesamorelin, a growth hormone-releasing hormone (GHRH) analog clinically proven to reduce visceral fat, with Ipamorelin, a selective growth hormone-releasing peptide. Together they stimulate your body's natural GH release to burn stubborn fat — especially around the midsection — while simultaneously improving sleep quality, muscle recovery, and energy.",
    benefits: [
      { icon: "🔥", title: "Reduces Visceral & Abdominal Fat", desc: "Clinically shown to target stubborn belly fat without affecting lean mass." },
      { icon: "💪", title: "Preserves & Supports Lean Muscle", desc: "Promotes muscle integrity while in a caloric deficit or fat-loss phase." },
      { icon: "😴", title: "Improves Sleep Quality & Recovery", desc: "Ipamorelin boosts nighttime GH pulses for deeper, more restorative sleep." },
      { icon: "⚡", title: "Increases Energy & Metabolism", desc: "Patients often notice improved stamina and metabolic efficiency." },
      { icon: "🧠", title: "Enhances Mental Clarity", desc: "Better sleep and hormonal balance contribute to sharper focus." },
    ],
    faqs: [
      { q: "How is this different from just using Ipamorelin alone?", a: "Tesamorelin adds targeted visceral fat reduction — a clinically validated effect. The combination gives you both fat-loss specificity and enhanced GH pulse frequency." },
      { q: "How long before I see results?", a: "Most patients notice improved sleep within 1–2 weeks. Body composition changes are typically visible within 8–12 weeks." },
      { q: "Is it safe long-term?", a: "Yes. Both peptides have strong safety records when used under medical supervision. They support your body's natural GH rhythms rather than replacing them synthetically." },
      { q: "Can I combine this with other peptides?", a: "Absolutely. It pairs well with BPC-157 or MOTS-C for enhanced recovery and metabolic support." },
    ],
    highlight: "Tesamorelin and Ipamorelin work together to burn fat, build resilience, and help you wake up feeling restored — without synthetic hormones.",
  },
  {
    name: "MOTS-C",
    tagline: "Mitochondrial peptide that acts as a metabolic master switch — boosting fat burning and insulin sensitivity.",
    category: "Fat Loss",
    overview:
      "MOTS-C is a mitochondrial-derived peptide that regulates metabolism at the cellular level. It activates AMPK — often called the body's 'metabolic master switch' — which promotes fat oxidation, improves insulin sensitivity, and enhances cellular energy efficiency. Unlike traditional weight loss compounds, MOTS-C works from the inside out at the mitochondrial level.",
    benefits: [
      { icon: "🔥", title: "Activates Fat Burning Pathways", desc: "Triggers AMPK to increase fatty acid oxidation and reduce fat storage." },
      { icon: "💉", title: "Improves Insulin Sensitivity", desc: "Helps regulate blood sugar and reduce metabolic dysfunction." },
      { icon: "⚡", title: "Boosts Cellular Energy Production", desc: "Enhances mitochondrial efficiency for better stamina and less fatigue." },
      { icon: "🛡️", title: "Anti-Aging & Longevity Support", desc: "Linked to healthspan benefits and protection against age-related metabolic decline." },
      { icon: "🏋️", title: "Supports Exercise Performance", desc: "Improves endurance and recovery by optimizing energy metabolism." },
    ],
    faqs: [
      { q: "What makes MOTS-C unique compared to other fat loss peptides?", a: "MOTS-C works at the mitochondrial level — it's not just a hormone signal but a cellular energy regulator. It addresses the root metabolic dysfunction rather than appetite alone." },
      { q: "Is this safe to use with GLP-1 medications?", a: "Yes. MOTS-C complements semaglutide or tirzepatide by addressing metabolic efficiency while those medications manage appetite." },
      { q: "How quickly does it work?", a: "Metabolic improvements are often noticed within 4–8 weeks. Energy and exercise performance may improve sooner." },
      { q: "Who is the best candidate?", a: "Those with metabolic resistance, insulin sensitivity concerns, or anyone wanting to enhance the results of their weight loss protocol." },
    ],
    highlight: "MOTS-C resets your metabolism at the cellular level — making your body a more efficient fat-burning machine from the inside out.",
  },
  {
    name: "Semaglutide",
    tagline: "GLP-1 receptor agonist that dramatically reduces appetite, curbs cravings, and supports sustainable fat loss.",
    category: "Fat Loss",
    overview:
      "Semaglutide is a GLP-1 receptor agonist that mimics the body's natural hunger-regulating hormone. It slows gastric emptying, reduces appetite signals in the brain, and helps eliminate food noise — making it significantly easier to maintain a caloric deficit. Clinical trials have shown 15%+ total body weight loss with consistent use and medical guidance.",
    benefits: [
      { icon: "🧠", title: "Reduces Appetite & Food Noise", desc: "Targets brain receptors that control hunger, dramatically reducing cravings." },
      { icon: "🩸", title: "Improves Blood Sugar Regulation", desc: "Helps stabilize glucose levels, especially beneficial for prediabetics." },
      { icon: "🔥", title: "Promotes Steady Fat Loss", desc: "Clinical trials show 15%+ total body weight reduction over 68 weeks." },
      { icon: "❤️", title: "Cardiovascular Benefits", desc: "Shown to reduce risk of major cardiovascular events in high-risk patients." },
      { icon: "⚖️", title: "Sustainable Weight Management", desc: "Helps reset hunger setpoints for long-term weight maintenance." },
    ],
    faqs: [
      { q: "How is semaglutide different from older weight loss medications?", a: "It works on the brain's hunger center — not just metabolism or stimulation. This makes it highly effective for those who struggle with emotional eating or persistent cravings." },
      { q: "Will I feel sick on semaglutide?", a: "Some nausea is common early on, especially as doses increase. Slow titration and dietary guidance minimize this. Most patients adjust within 2–4 weeks." },
      { q: "How long do I need to stay on it?", a: "Duration depends on your goals. Many patients use it for 6–12 months, then transition to maintenance. Your provider will guide you." },
      { q: "Can it help with diabetes?", a: "Yes — semaglutide was originally developed for type 2 diabetes and is highly effective for blood sugar management alongside weight loss." },
    ],
    highlight: "Semaglutide quiets the constant hunger and food thoughts — so you can finally make progress that sticks.",
  },
  {
    name: "Tirzepatide",
    tagline: "Dual GLP-1/GIP agonist offering superior fat loss, better appetite control, and improved insulin function.",
    category: "Fat Loss",
    overview:
      "Tirzepatide activates both GLP-1 and GIP receptors — two complementary hormones that regulate appetite, insulin secretion, and fat metabolism. This dual-action makes it more effective than single-agonist therapies for many patients, with clinical trials showing up to 22% total body weight loss. It's especially effective for those needing greater appetite control and faster metabolic results.",
    benefits: [
      { icon: "🔥", title: "Superior Fat Loss vs. GLP-1 Alone", desc: "Dual hormone activation delivers greater weight reduction than semaglutide for many patients." },
      { icon: "🧠", title: "Powerful Appetite & Craving Control", desc: "GIP + GLP-1 synergy crushes cravings and dramatically reduces food noise." },
      { icon: "💉", title: "Improves Insulin Sensitivity", desc: "Helps reverse insulin resistance and supports healthy glucose metabolism." },
      { icon: "❤️", title: "Cardiovascular & Metabolic Benefits", desc: "Studied for broad cardiometabolic improvements beyond weight loss." },
      { icon: "⚡", title: "Faster Results for Many Patients", desc: "Many see appetite changes within 1–2 weeks with continued improvement." },
    ],
    faqs: [
      { q: "How is this different from Semaglutide?", a: "Tirzepatide activates two hormone receptors (GLP-1 and GIP), making it more effective for many patients — especially those needing greater appetite control and faster results." },
      { q: "Will I feel less hungry right away?", a: "Many do within the first 1–2 weeks. Satiety continues to improve as your body adjusts." },
      { q: "Can this help with diabetes or prediabetes?", a: "Yes — Tirzepatide improves insulin sensitivity and helps manage blood sugar in patients with metabolic concerns." },
      { q: "Is it safe long-term?", a: "Yes. It has been studied extensively for safety and efficacy in both weight loss and diabetic populations. Always use under clinical supervision." },
    ],
    highlight: "Tirzepatide offers next-level weight loss support by targeting two key hormones — helping you curb cravings, support healthy insulin function, and achieve lasting results.",
  },
  {
    name: "Retatrutide",
    tagline: "Triple-action peptide delivering dramatic fat loss, appetite control, and metabolic health by targeting GLP-1, GIP, and glucagon.",
    category: "Fat Loss",
    overview:
      "Retatrutide is a cutting-edge triple agonist peptide that targets GLP-1, GIP, and glucagon receptors — three key hormones involved in appetite, metabolism, and fat burning. This unique mechanism delivers unmatched results in weight loss, blood sugar control, and metabolic function. Early clinical studies have shown greater fat loss than semaglutide or tirzepatide, making Retatrutide a promising next-generation solution for patients seeking powerful, multi-pathway support.",
    benefits: [
      { icon: "🔥", title: "Unmatched Fat Loss Potential", desc: "Triple-pathway activation leads to superior body fat reduction vs. GLP-1 alone." },
      { icon: "🥢", title: "Crushes Cravings & Increases Satiety", desc: "Dramatically reduces appetite and helps eliminate food noise." },
      { icon: "💉", title: "Improves Insulin Sensitivity & Blood Sugar", desc: "Helps reverse insulin resistance and improve glycemic control." },
      { icon: "⚡", title: "Enhances Metabolic Rate & Energy Output", desc: "Glucagon receptor activation may increase calorie burn — a unique edge over other peptides." },
      { icon: "🧠", title: "Supports Focus, Mood, and Motivation", desc: "Patients often report better clarity, energy, and emotional stability while on protocol." },
    ],
    faqs: [
      { q: "How is Retatrutide different from Tirzepatide?", a: "While Tirzepatide activates GLP-1 and GIP, Retatrutide adds a third target — the glucagon receptor, which may help increase fat burning and energy expenditure for even greater weight loss and metabolic benefits." },
      { q: "Is it safe and FDA-approved?", a: "Retatrutide is currently in advanced clinical trials and may not yet be widely available. Early data shows a strong safety profile, but it should only be used under medical supervision in clinical or research-based protocols." },
      { q: "Can I switch from another peptide?", a: "Yes. Many patients transition from GLP-1 or dual agonist therapies to Retatrutide if they need stronger appetite control, better metabolic improvements, or have hit a fat loss plateau." },
      { q: "What kind of results can I expect?", a: "Clinical trials have reported 15–24% total body weight loss over time, often with improved energy, focus, and metabolic labs — when combined with professional guidance and lifestyle support." },
    ],
    highlight: "Retatrutide surpasses Tirzepatide and Semaglutide with next-level weight loss support by targeting three key hormones — delivering superior craving control, enhanced insulin function, and transformative, lasting results.",
  },
  {
    name: "CJC-1295 / Ipamorelin",
    tagline: "Stimulates natural growth hormone release to support muscle recovery, deeper sleep, improved energy, and healthy aging.",
    category: "Recovery",
    overview:
      "This powerful peptide duo combines CJC-1295, a Growth Hormone-Releasing Hormone (GHRH) analog, with Ipamorelin, a selective Growth Hormone-Releasing Peptide (GHRP). Together, they stimulate your pituitary gland to naturally produce and release growth hormone in a safe, sustained way. CJC-1295 increases the amplitude (strength) of GH pulses, while Ipamorelin increases the frequency. This synergy promotes deep recovery, lean muscle support, improved sleep, and cellular repair — all without the unwanted side effects of synthetic HGH.",
    benefits: [
      { icon: "😴", title: "Deeper, More Restorative Sleep", desc: "Improves nighttime GH pulses and helps reset your circadian rhythm." },
      { icon: "💪", title: "Faster Recovery & Lean Muscle Support", desc: "Enhances tissue repair and muscle preservation during workouts or injury." },
      { icon: "🔬", title: "Cellular Repair & Anti-Aging Support", desc: "Promotes collagen production, reduces inflammation, and supports longevity." },
      { icon: "⚡", title: "Boosts Energy & Mental Clarity", desc: "Patients often report better daytime energy, focus, and mood stability." },
      { icon: "🌿", title: "Natural GH Support Without Suppression", desc: "Works with your body's rhythm instead of replacing hormones synthetically." },
    ],
    faqs: [
      { q: "Will this build muscle or burn fat like HGH?", a: "It helps your body release more of its own growth hormone, which supports fat loss and muscle recovery — but it works gradually and safely, not like synthetic HGH." },
      { q: "How long does it take to feel the effects?", a: "Many report better sleep within 1–2 weeks. Recovery and physique improvements typically show over 6–8 weeks." },
      { q: "Is this safe for long-term use?", a: "Yes. Because it supports your body's natural GH rhythms, it's ideal for long-term optimization with medical guidance." },
      { q: "Can I take this with other peptides?", a: "Definitely. It pairs well with both fat loss and repair-focused peptides like BPC-157 or MOTS-C." },
    ],
    highlight: "CJC-1295 and Ipamorelin help your body heal, recover, and recharge — making it easier to train harder, sleep deeper, and feel stronger with age.",
  },
  {
    name: "Sermorelin",
    tagline: "Naturally stimulates your body's own growth hormone to support recovery, sleep, fat loss, and healthy aging.",
    category: "Recovery",
    overview:
      "Sermorelin is a synthetic version of Growth Hormone-Releasing Hormone (GHRH), designed to help your body restore optimal levels of growth hormone over time. It works by stimulating the pituitary gland — triggering the same natural process your body uses to release growth hormone, especially during deep sleep. Unlike synthetic HGH, Sermorelin doesn't override your body's rhythm. Instead, it supports a gentle, long-term approach to hormone optimization, helping you feel more energized, youthful, and resilient as you age.",
    benefits: [
      { icon: "😴", title: "Improves Sleep & Recovery", desc: "Boosts nighttime GH release, supporting restful sleep and tissue repair." },
      { icon: "💪", title: "Preserves Lean Muscle Mass", desc: "Helps maintain muscle while cutting or during periods of stress or aging." },
      { icon: "🔥", title: "Enhances Fat Metabolism", desc: "Supports healthy body composition, especially in midsection fat." },
      { icon: "🔬", title: "Supports Healthy Aging & Cellular Repair", desc: "Stimulates collagen, improves skin texture, and reduces inflammation markers." },
      { icon: "🧠", title: "Improves Mood, Energy, and Mental Sharpness", desc: "Patients often report better cognitive function and emotional resilience." },
    ],
    faqs: [
      { q: "Is this a form of HGH?", a: "No. Sermorelin is not growth hormone — it helps your body produce its own GH, naturally and in rhythm with your biological cycles." },
      { q: "When will I start to feel results?", a: "Many notice improved sleep within the first 1–2 weeks. Body composition and energy changes typically occur within 6–12 weeks." },
      { q: "How is this different from CJC-1295?", a: "Both are GHRH analogs. Sermorelin has a shorter half-life, which mimics the body's natural hormone rhythm more closely and is often preferred for first-time peptide users." },
      { q: "Is it safe long-term?", a: "Yes. It works with your body's natural hormone regulation, making it a gentle and sustainable therapy when monitored by a provider." },
    ],
    highlight: "Sermorelin is a safe and natural way to support energy, recovery, and healthy aging — by helping your body do what it was designed to do.",
  },
  {
    name: "BPC-157",
    tagline: "Promotes rapid healing, reduces inflammation, and supports joint, gut, and soft tissue repair.",
    category: "Recovery",
    overview:
      "BPC-157 (Body Protection Compound) is a synthetic peptide derived from a naturally occurring protein in the stomach. It's widely studied for its accelerated healing capabilities — especially in soft tissues like muscles, tendons, ligaments, and the gastrointestinal lining. Unlike most recovery agents that treat symptoms, BPC-157 works at the cellular level, increasing blood flow and triggering the regeneration of damaged tissue. It's often used by athletes, post-surgical patients, and anyone experiencing chronic joint or gut inflammation.",
    benefits: [
      { icon: "🔧", title: "Accelerates Healing of Soft Tissue & Joints", desc: "Promotes faster repair of tendons, ligaments, muscles, and connective tissue." },
      { icon: "🔥", title: "Reduces Inflammation & Pain", desc: "Helps calm inflammation in joints, gut, and injuries for faster comfort and recovery." },
      { icon: "🦴", title: "Supports Joint Health & Mobility", desc: "Improves collagen organization and tissue integrity for healthier movement." },
      { icon: "🌿", title: "Improves Gut Health", desc: "Repairs intestinal lining, aiding conditions like IBS, leaky gut, or digestive inflammation." },
      { icon: "🩺", title: "Enhances Post-Surgical or Injury Recovery", desc: "Speeds recovery from surgeries, strains, or overuse injuries." },
    ],
    faqs: [
      { q: "What kind of injuries does BPC-157 help with?", a: "Everything from minor muscle strains and joint pain to chronic tendonitis or post-op healing. It's especially useful for soft tissue repair." },
      { q: "How does it help the gut?", a: "BPC-157 helps rebuild the intestinal lining and reduce inflammation, which can benefit those with digestive issues or gut-related fatigue." },
      { q: "Can I combine BPC-157 with other peptides?", a: "Yes — it pairs well with TB-500 or CJC-1295 for enhanced healing and recovery support." },
      { q: "Is this safe for long-term use?", a: "Yes. It has a strong safety profile and is non-toxic, making it suitable for both short-term injury recovery and long-term gut or joint health." },
    ],
    highlight: "BPC-157 helps your body heal from the inside out — restoring tissue, reducing inflammation, and getting you back to full strength, faster.",
  },
  {
    name: "BPC-157 / TB-500 Combo",
    tagline: "A powerful healing duo that accelerates recovery, reduces inflammation, and supports joint, muscle, and tissue repair.",
    category: "Recovery",
    overview:
      "This combo pairs two of the most trusted regenerative peptides: BPC-157, known for its gut and soft tissue healing, and TB-500 (Thymosin Beta-4), a peptide that promotes cell migration, blood vessel growth, and recovery at a systemic level. Together, they offer a comprehensive repair protocol that works both locally (injured or inflamed areas) and throughout the body. Whether you're bouncing back from an injury, managing chronic joint pain, or recovering from surgery, this combination helps restore mobility, reduce pain, and speed up healing.",
    benefits: [
      { icon: "🔧", title: "Accelerates Full-Body Healing", desc: "Stimulates cell regeneration, collagen synthesis, and tissue repair systemically." },
      { icon: "🔥", title: "Reduces Inflammation & Discomfort", desc: "Soothes inflamed joints, tendons, muscles, and the gut lining." },
      { icon: "🤸", title: "Improves Flexibility & Mobility", desc: "Supports improved range of motion and recovery after physical stress." },
      { icon: "🩺", title: "Ideal for Injury, Surgery, or Overuse Recovery", desc: "Speeds up healing time and reduces scar tissue formation." },
      { icon: "🌿", title: "Supports Gut and Connective Tissue Health", desc: "BPC-157 protects the gut lining while TB-500 enhances soft tissue recovery." },
    ],
    faqs: [
      { q: "How is this different from BPC-157 alone?", a: "TB-500 works on a systemic level, while BPC-157 targets specific tissues (gut, joints, muscles). Together, they provide enhanced, whole-body recovery." },
      { q: "How fast does it work?", a: "Many report noticeable improvements in joint pain, flexibility, and recovery within 1–2 weeks. Deeper tissue healing continues with consistent use." },
      { q: "Can I use this combo after surgery?", a: "Yes — it's commonly used to support surgical recovery, reduce scar formation, and improve healing outcomes. Always consult your provider." },
      { q: "Is this safe long-term?", a: "Yes. Both peptides have strong safety profiles and are commonly used under medical supervision for ongoing recovery and inflammation control." },
    ],
    highlight: "BPC-157 and TB-500 together create the most complete healing protocol — addressing both local damage and systemic recovery for faster, fuller results.",
  },
  {
    name: "BPC-157 / TB-500 / KPV / GHK-Cu Combo",
    tagline: "A comprehensive healing and anti-inflammatory protocol supporting tissue repair, gut health, immune balance, and skin regeneration.",
    category: "Recovery",
    overview:
      "This four-peptide blend is designed for deep, full-body restoration. It combines BPC-157 for targeted soft tissue healing and gut repair, TB-500 for systemic regeneration, joint and muscle recovery, KPV — a potent anti-inflammatory peptide that helps calm immune over-activation, and GHK-Cu — a copper-binding peptide known for promoting skin healing, collagen production, and anti-aging. Together, this combo addresses not only injury recovery but inflammation, immune dysfunction, gut integrity, and skin regeneration — making it one of the most complete healing stacks available.",
    benefits: [
      { icon: "🔧", title: "Advanced Tissue & Joint Repair", desc: "Promotes healing in tendons, ligaments, muscle, and skin with enhanced cell regeneration." },
      { icon: "🔥", title: "Full-Body Inflammation Control", desc: "KPV and BPC-157 help modulate inflammatory pathways systemically." },
      { icon: "🌿", title: "Gut Lining Protection & Repair", desc: "Supports digestive tract health, leaky gut repair, and nutrient absorption." },
      { icon: "💎", title: "Skin Rejuvenation & Collagen Boost", desc: "GHK-Cu improves elasticity, texture, and wound healing." },
      { icon: "🛡️", title: "Immune Regulation & Recovery", desc: "Calms overactive immune responses and promotes balance for those with chronic inflammation." },
    ],
    faqs: [
      { q: "What makes this different from the BPC-157 / TB-500 combo?", a: "This stack adds KPV for enhanced inflammation control and GHK-Cu for skin, collagen, and anti-aging support — making it a total healing protocol." },
      { q: "Can it help with gut and skin issues too?", a: "Yes. BPC-157 supports the gut lining, while KPV reduces gut inflammation. GHK-Cu stimulates collagen and tissue repair, improving skin tone and healing." },
      { q: "Is this overkill if I just have joint pain?", a: "If joint pain is your only concern, the BPC-157 / TB-500 combo may be enough. This advanced stack is best for multi-system healing and longstanding inflammation." },
      { q: "Is it safe for long-term use?", a: "Yes, especially when guided by your medical provider. Each peptide has a strong safety profile when dosed appropriately." },
    ],
    highlight: "The most comprehensive recovery stack available — addressing tissue repair, inflammation, gut health, and skin regeneration all at once.",
  },
  {
    name: "IGF-1 LR3",
    tagline: "Promotes lean muscle growth, speeds recovery, and supports anti-aging through enhanced cellular growth and repair.",
    category: "Recovery",
    overview:
      "IGF-1 LR3 is a modified version of insulin-like growth factor-1, a peptide naturally produced in the liver in response to growth hormone. It plays a crucial role in muscle development, cell repair, and regeneration — acting as one of the primary mediators of growth hormone's benefits. The 'LR3' (Long Arg3) version has been altered for a longer half-life and greater bioavailability, making it more potent and effective than naturally occurring IGF-1. It's commonly used to enhance muscle gains, support tissue repair, and improve body composition — particularly in those seeking performance or aesthetic improvement.",
    benefits: [
      { icon: "💪", title: "Stimulates Lean Muscle Growth", desc: "Increases protein synthesis and muscle cell development." },
      { icon: "🔧", title: "Speeds Recovery After Workouts or Injury", desc: "Promotes faster tissue repair, ideal for active individuals or athletes." },
      { icon: "🔬", title: "Supports Anti-Aging & Cellular Regeneration", desc: "Helps maintain healthy function and structure at the cellular level." },
      { icon: "🔥", title: "Improves Fat Metabolism & Body Composition", desc: "Encourages muscle gain while supporting fat loss through improved nutrient partitioning." },
      { icon: "🧠", title: "May Support Cognitive and Neurological Health", desc: "Emerging research shows potential benefits in brain plasticity and repair." },
    ],
    faqs: [
      { q: "How does IGF-1 LR3 differ from growth hormone peptides like CJC/Ipamorelin?", a: "GH peptides stimulate your body to release growth hormone. IGF-1 LR3 is the next step downstream, acting as the hormone that directly causes tissue growth and repair." },
      { q: "Is this only for athletes or bodybuilders?", a: "Not at all — while popular among performance-focused users, IGF-1 LR3 also supports healthy aging, joint repair, and recovery for a broad range of patients." },
      { q: "How quickly will I see results?", a: "Many notice faster recovery and improved training performance within 2–4 weeks. Muscle growth and body composition changes appear over 8–12 weeks with consistent training." },
      { q: "Is it safe for long-term use?", a: "IGF-1 LR3 should be cycled and monitored by a provider. It's effective when used correctly but should be part of a medically guided protocol due to its potent growth-stimulating effects." },
    ],
    highlight: "IGF-1 LR3 outperforms traditional growth hormone therapies with advanced muscle-building support by amplifying anabolic effects, accelerating recovery, and delivering transformative strength and tissue repair.",
  },
  {
    name: "Semax / Selank Combo",
    tagline: "A brain-boosting duo that enhances focus, reduces anxiety, sharpens memory, and supports long-term cognitive health.",
    category: "Brain Health",
    overview:
      "Semax and Selank are nootropic peptides developed in neuroscience and psychiatric research to promote mental clarity, emotional balance, and neurological resilience. Semax is best known for its ability to increase focus, learning, and neuroplasticity, while Selank is prized for its calming, anxiolytic effects — without sedation. Together, they work synergistically to boost brain performance while reducing the stress and mental fatigue that often accompany a high-paced lifestyle. Whether you're optimizing for work, recovery, or mental well-being, this combo helps you stay sharp and centered.",
    benefits: [
      { icon: "🧠", title: "Improves Focus & Mental Clarity", desc: "Helps you stay clear-headed and productive without the crash of stimulants." },
      { icon: "😌", title: "Reduces Anxiety & Stress Response", desc: "Selank supports GABA pathways, calming the nervous system naturally." },
      { icon: "💡", title: "Boosts Memory, Learning & Neuroplasticity", desc: "Supports better information retention and mental performance." },
      { icon: "🛡️", title: "Supports Brain Health & Recovery", desc: "Promotes blood flow to the brain and helps protect against cognitive decline." },
      { icon: "⚖️", title: "Stabilizes Mood Without Sedation", desc: "Improves emotional resilience and stress tolerance while staying alert." },
    ],
    faqs: [
      { q: "Is this like taking Adderall or caffeine?", a: "Not at all. These peptides enhance focus and reduce anxiety naturally — without the crash, jitteriness, or dependency associated with stimulants." },
      { q: "Will it make me sleepy or wired?", a: "No. Most users report a calm, clear, and balanced focus — not stimulation or sedation." },
      { q: "Can I use this daily?", a: "Yes. Many patients use it during high-stress periods, travel, or work-heavy seasons. Always consult with your provider for long-term protocols." },
      { q: "Does it help with recovery from burnout or brain fog?", a: "Absolutely. It supports brain circulation, neurotransmitter balance, and neuroprotection — all of which can help you bounce back faster." },
    ],
    highlight: "Semax and Selank help you think clearly, stay calm, and show up as your best self — mentally sharp, emotionally steady, and neurologically supported.",
  },
  {
    name: "NAD+",
    tagline: "Boosts brain function, cellular energy, and longevity by restoring one of the body's most vital coenzymes.",
    category: "Brain Health",
    overview:
      "NAD+ (Nicotinamide Adenine Dinucleotide) is a critical molecule found in every cell of the body. It helps power your metabolism, repair DNA, and protect against cellular aging. But as we age — or experience chronic stress, poor sleep, or inflammation — NAD+ levels naturally decline. Supplementing with NAD+ can help restore mitochondrial function, improve cognitive performance, increase natural energy, and support healthy aging. It's often used for brain fog, burnout, post-COVID recovery, and age-related fatigue.",
    benefits: [
      { icon: "⚡", title: "Increases Cellular Energy & Mitochondrial Health", desc: "Recharges your body's energy systems for better stamina and recovery." },
      { icon: "🧠", title: "Improves Focus, Memory & Mental Clarity", desc: "Helps restore sharpness, alertness, and productivity — especially during fatigue." },
      { icon: "🔬", title: "Supports DNA Repair & Longevity Pathways", desc: "Activates sirtuins and other anti-aging pathways linked to extended healthspan." },
      { icon: "🛡️", title: "Reduces Inflammation & Oxidative Stress", desc: "Helps protect cells from damage and supports healthy immune function." },
      { icon: "😌", title: "Combats Burnout & Brain Fog", desc: "Many users report feeling clearer, calmer, and more energized after NAD+ support." },
    ],
    faqs: [
      { q: "Is NAD+ a vitamin or a peptide?", a: "NAD+ is technically a coenzyme — not a peptide — but it's often grouped with peptide therapy due to its powerful regenerative and cellular effects." },
      { q: "Will I feel a difference right away?", a: "Many patients notice a difference in energy and focus within 1–2 weeks. Others experience a more gradual improvement in brain function, stamina, and mood." },
      { q: "How is NAD+ administered?", a: "NAD+ is typically administered via injections or IV for best absorption and impact. Your provider will recommend the best method for your goals." },
      { q: "Can it really help with aging?", a: "Yes. NAD+ supports DNA repair, mitochondrial function, and metabolic efficiency — all of which are central to aging well and feeling younger, longer." },
    ],
    highlight: "NAD+ is the cellular fuel your body has been running low on — restoring it supports sharper thinking, deeper energy, and a stronger foundation for healthy aging.",
  },
  {
    name: "PT-141 (Bremelanotide)",
    tagline: "Enhances libido, arousal, and sexual satisfaction by targeting the brain's arousal centers — not just blood flow.",
    category: "Sexual Health",
    overview:
      "PT-141 is a synthetic peptide originally developed to treat sexual dysfunction. Unlike medications like Viagra or Cialis, which act on blood vessels, PT-141 works directly in the brain by stimulating melanocortin receptors responsible for desire and arousal. This means it doesn't just improve performance — it revives desire, increases responsiveness, and enhances the mind-body connection during intimacy. It's effective for both men and women and is especially helpful when sexual challenges are tied to stress, fatigue, or low libido rather than mechanical function.",
    benefits: [
      { icon: "❤️", title: "Boosts Sexual Desire & Libido", desc: "Increases natural feelings of arousal and readiness in both men and women." },
      { icon: "🔥", title: "Enhances Arousal & Sensitivity", desc: "Improves responsiveness and physical sensation." },
      { icon: "🧠", title: "Works on the Brain, Not Just the Body", desc: "Stimulates the central nervous system for deeper, more natural engagement." },
      { icon: "💞", title: "Improves Intimacy & Satisfaction", desc: "Often enhances emotional connection and confidence in sexual experiences." },
      { icon: "✅", title: "Effective for Stress-Related or Low-Libido Cases", desc: "Useful when performance challenges stem from fatigue, burnout, or low mood." },
    ],
    faqs: [
      { q: "Is this only for men?", a: "Not at all — PT-141 is used successfully by both men and women to improve desire, arousal, and satisfaction." },
      { q: "How fast does it work?", a: "Effects are typically felt within 1–4 hours after dosing and can last for 6–12 hours depending on the individual." },
      { q: "Is this safe to use regularly?", a: "Yes. PT-141 is well tolerated and can be used as needed or as part of a regular sexual wellness protocol under medical supervision." },
      { q: "Can I combine this with other therapies?", a: "Yes. PT-141 can complement hormone therapy or PDE5 inhibitors for those needing both desire and performance support." },
    ],
    highlight: "PT-141 helps reignite desire and enhance intimacy — by working with your brain and body to create a more connected, fulfilling experience.",
  },
];

export function PeptideCatalog() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [expandedPeptide, setExpandedPeptide] = useState<string | null>(null);
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, number | null>>({});

  const filtered = activeCategory === "All" ? PEPTIDES : PEPTIDES.filter((p) => p.category === activeCategory);

  const categoryColors: Record<string, string> = {
    "Fat Loss": "#d4af37",
    Recovery: "#7eb3c8",
    "Brain Health": "#a78bfa",
    "Sexual Health": "#f9a8d4",
  };

  const togglePeptide = (name: string) => {
    setExpandedPeptide(expandedPeptide === name ? null : name);
    setExpandedFaqs({});
  };

  const toggleFaq = (peptideName: string, idx: number) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [peptideName]: prev[peptideName] === idx ? null : idx,
    }));
  };

  return (
    <>
      <style>{`
        .peptide-page { background: #0a0a0a; min-height: 100vh; color: #fff; font-family: inherit; }
        .peptide-hero { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%); padding: 80px 24px 60px; text-align: center; border-bottom: 1px solid #222; }
        .peptide-hero-eyebrow { font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #d4af37; margin-bottom: 16px; }
        .peptide-hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; letter-spacing: -0.5px; margin: 0 0 16px; line-height: 1.1; }
        .peptide-hero h1 span { color: #d4af37; }
        .peptide-hero p { font-size: 1.1rem; color: #999; max-width: 600px; margin: 0 auto 32px; line-height: 1.7; }
        .peptide-hero-cta { display: inline-block; background: #d4af37; color: #000; font-weight: 700; font-size: 0.9rem; letter-spacing: 1px; text-transform: uppercase; padding: 14px 32px; text-decoration: none; transition: opacity 0.2s; }
        .peptide-hero-cta:hover { opacity: 0.85; }
        .peptide-tabs { display: flex; gap: 8px; padding: 24px; max-width: 900px; margin: 0 auto; flex-wrap: wrap; justify-content: center; }
        .peptide-tab { padding: 10px 20px; border: 1px solid #333; background: transparent; color: #999; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .peptide-tab:hover { border-color: #d4af37; color: #d4af37; }
        .peptide-tab.active { background: #d4af37; border-color: #d4af37; color: #000; font-weight: 700; }
        .peptide-grid { max-width: 900px; margin: 0 auto; padding: 8px 24px 80px; display: flex; flex-direction: column; gap: 2px; }
        .peptide-card { background: #111; border: 1px solid #222; overflow: hidden; transition: border-color 0.2s; }
        .peptide-card:hover { border-color: #333; }
        .peptide-card-header { padding: 28px 32px; cursor: pointer; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .peptide-card-header-left { flex: 1; }
        .peptide-category-badge { display: inline-block; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 3px 10px; margin-bottom: 10px; font-weight: 700; }
        .peptide-card-name { font-size: 1.4rem; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.3px; }
        .peptide-card-tagline { font-size: 0.9rem; color: #777; line-height: 1.5; margin: 0; }
        .peptide-toggle-icon { font-size: 1.2rem; color: #555; flex-shrink: 0; margin-top: 4px; transition: transform 0.3s; }
        .peptide-toggle-icon.open { transform: rotate(180deg); color: #d4af37; }
        .peptide-card-body { padding: 0 32px 32px; border-top: 1px solid #1a1a1a; }
        .peptide-overview { font-size: 0.95rem; color: #aaa; line-height: 1.8; padding-top: 24px; margin-bottom: 28px; }
        .peptide-section-title { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #555; margin-bottom: 16px; font-weight: 700; }
        .peptide-benefits { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; margin-bottom: 32px; }
        .peptide-benefit { background: #0d0d0d; border: 1px solid #1e1e1e; padding: 16px; }
        .peptide-benefit-title { font-size: 0.85rem; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
        .peptide-benefit-desc { font-size: 0.8rem; color: #666; line-height: 1.5; }
        .peptide-faqs { display: flex; flex-direction: column; gap: 2px; margin-bottom: 24px; }
        .peptide-faq { background: #0d0d0d; border: 1px solid #1e1e1e; }
        .peptide-faq-q { padding: 14px 16px; cursor: pointer; font-size: 0.88rem; font-weight: 600; display: flex; justify-content: space-between; align-items: center; gap: 12px; color: #ccc; }
        .peptide-faq-q:hover { color: #fff; }
        .peptide-faq-icon { color: #555; font-size: 1rem; flex-shrink: 0; }
        .peptide-faq-a { padding: 0 16px 14px; font-size: 0.83rem; color: #777; line-height: 1.7; }
        .peptide-highlight { border-left: 3px solid #d4af37; padding: 14px 18px; background: #0d0a00; font-size: 0.85rem; color: #b8966f; line-height: 1.6; font-style: italic; }
        .peptide-cta-bar { text-align: center; margin-top: 60px; padding: 0 24px 80px; }
        .peptide-cta-bar h2 { font-size: 1.8rem; font-weight: 800; margin-bottom: 12px; }
        .peptide-cta-bar p { color: #777; margin-bottom: 28px; font-size: 0.95rem; }
        .peptide-cta-btn { display: inline-block; background: #d4af37; color: #000; font-weight: 700; font-size: 0.9rem; letter-spacing: 1px; text-transform: uppercase; padding: 16px 40px; text-decoration: none; transition: opacity 0.2s; }
        .peptide-cta-btn:hover { opacity: 0.85; }
        .peptide-disclaimer { max-width: 700px; margin: 0 auto; padding: 0 24px 60px; text-align: center; font-size: 0.75rem; color: #444; line-height: 1.7; }
        @media (max-width: 640px) {
          .peptide-card-header { padding: 20px; }
          .peptide-card-body { padding: 0 20px 24px; }
          .peptide-benefits { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="peptide-page">
        <div className="peptide-hero">
          <p className="peptide-hero-eyebrow">Hello Gorgeous Med Spa · Oswego, IL</p>
          <h1>
            Peptide Therapy <span>Catalog</span>
          </h1>
          <p>
            Medically supervised peptide protocols tailored to your goals — fat loss, recovery, brain health, and sexual
            wellness. Every treatment is provider-guided and personalized to your biology.
          </p>
          <Link href="/book" className="peptide-hero-cta">
            Book a Consultation
          </Link>
        </div>

        <div className="peptide-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`peptide-tab${activeCategory === cat ? " active" : ""}`}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedPeptide(null);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="peptide-grid">
          {filtered.map((peptide) => {
            const isOpen = expandedPeptide === peptide.name;
            const catColor = categoryColors[peptide.category] || "#d4af37";
            return (
              <div key={peptide.name} className="peptide-card">
                <div className="peptide-card-header" onClick={() => togglePeptide(peptide.name)}>
                  <div className="peptide-card-header-left">
                    <span
                      className="peptide-category-badge"
                      style={{ background: `${catColor}22`, color: catColor, border: `1px solid ${catColor}44` }}
                    >
                      {peptide.category}
                    </span>
                    <h3 className="peptide-card-name">{peptide.name}</h3>
                    <p className="peptide-card-tagline">{peptide.tagline}</p>
                  </div>
                  <span className={`peptide-toggle-icon${isOpen ? " open" : ""}`}>▾</span>
                </div>

                {isOpen && (
                  <div className="peptide-card-body">
                    <p className="peptide-overview">{peptide.overview}</p>

                    <p className="peptide-section-title">Key Benefits</p>
                    <div className="peptide-benefits">
                      {peptide.benefits.map((b) => (
                        <div key={b.title} className="peptide-benefit">
                          <div className="peptide-benefit-title">
                            <span>{b.icon}</span>
                            {b.title}
                          </div>
                          <p className="peptide-benefit-desc">{b.desc}</p>
                        </div>
                      ))}
                    </div>

                    <p className="peptide-section-title">Frequently Asked Questions</p>
                    <div className="peptide-faqs">
                      {peptide.faqs.map((faq, idx) => {
                        const isExpanded = expandedFaqs[peptide.name] === idx;
                        return (
                          <div key={idx} className="peptide-faq">
                            <div
                              className="peptide-faq-q"
                              onClick={() => toggleFaq(peptide.name, idx)}
                            >
                              <span>{faq.q}</span>
                              <span className="peptide-faq-icon">{isExpanded ? "−" : "+"}</span>
                            </div>
                            {isExpanded && <div className="peptide-faq-a">{faq.a}</div>}
                          </div>
                        );
                      })}
                    </div>

                    <div className="peptide-highlight">{peptide.highlight}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="peptide-cta-bar">
          <h2>Ready to Start Your Protocol?</h2>
          <p>Our team will help you find the right peptide combination for your specific goals and biology.</p>
          <Link href="/book" className="peptide-cta-btn">
            Schedule Your Consultation
          </Link>
        </div>

        <div className="peptide-disclaimer">
          <strong>Medical Disclaimer:</strong> Peptide therapies are prescribed and supervised by licensed medical
          providers. Results vary by individual. These statements have not been evaluated by the FDA. Peptide therapies
          are not intended to diagnose, treat, cure, or prevent any disease. All protocols require a consultation and
          medical evaluation prior to initiation.
        </div>
      </div>
    </>
  );
}
