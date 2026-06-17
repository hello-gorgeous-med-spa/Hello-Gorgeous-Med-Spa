import { bookingUrlFor } from "./build";
import {
  SOLARIA_DANI_DEVICE_IMAGE,
  SOLARIA_DECOLLETE_TREATMENT_IMAGE,
  SOLARIA_NECK_LASER_IMAGE,
  SOLARIA_SCANNER_CLOSEUP_IMAGE,
  SOLARIA_TREATMENT_IMAGE,
} from "@/lib/founder-credentials";
import type { ServicePageData } from "./types";

/** HG_DEV_011 Phase 1 — Dani-reviewed copy for uncontested keywords */
export const PHASE1_UNCONTESTED_PAGES: ServicePageData[] = [
  {
    slug: "solaria-co2-oswego",
    serviceName: "Solaria CO2",
    fullServiceName: "Solaria CO2 Laser Resurfacing",
    targetKeyword: "solaria co2 oswego",
    metaTitle: "Solaria CO2 Laser in Oswego, IL",
    metaDescription:
      "Solaria CO2 laser resurfacing in Oswego, IL. The only practice in the western Chicago suburbs with this advanced InMode fractional CO2 technology. Free consultations.",
    h1: "Solaria CO2 Laser Resurfacing in Oswego, IL",
    valueProp: "The most advanced fractional CO2 laser available — and the only one in the western Chicago suburbs.",
    bookingUrl: bookingUrlFor(),
    procedureType: "Laser",
    bodyLocation: "Face, neck, décolleté, hands",
    inModeBadge: "solaria",
    tier: "uncontested",
    heroContent:
      "Solaria CO2 is InMode's flagship fractional CO2 laser — the kind of skin resurfacing technology you used to only find at university medical centers. It rebuilds collagen, evens skin tone, softens deep lines, and resurfaces scars and sun damage in ways no topical product can match. We're the only practice between Aurora, Naperville, and Plainfield offering it.",
    whyBullets: [
      "The only Solaria CO2 in Oswego, Naperville, Aurora, or Plainfield — we made the investment so you don't have to drive into the city",
      "Performed in-office by our medical team with Ryan Kent, FNP-BC overseeing every protocol",
      "Customizable from gentle 'glow' settings to deep resurfacing in one platform — we tailor depth to your skin and goals",
      "Comfortable settings available — we use topical numbing and can adjust intensity to match your tolerance",
      "Verified InMode Provider — backed by manufacturer training and clinical protocols",
    ],
    howItWorksParagraphs: [
      "Solaria CO2 works by delivering precise columns of fractional CO2 laser energy into the skin. Each microcolumn creates a controlled micro-injury surrounded by healthy tissue, which triggers your body's natural collagen and elastin response. The damaged surface skin sloughs off over 5–7 days, and the new skin underneath is smoother, more even in tone, and significantly firmer. Because the laser is fractional, only a percentage of the skin is treated in each session — which is why downtime is dramatically shorter than the full-field CO2 lasers of 15 years ago, while results remain dramatic. Most clients see visible improvement in tone and texture after a single treatment, with continued collagen remodeling for up to 6 months.",
    ],
    whatToExpectSteps: [
      "Free consultation with our team to assess your skin, discuss goals, and confirm Solaria CO2 is the right fit. We never recommend a treatment a client doesn't need.",
      "Pre-treatment: topical numbing applied for 30–45 minutes to maximize comfort. We walk you through every step before we start.",
      "Treatment: the procedure itself takes 20–45 minutes depending on the area treated. You'll feel warmth and pinpoint sensation; most clients describe it as very manageable.",
      "Recovery: 5–7 days of social downtime with redness, mild swelling, and skin sloughing. We send you home with a complete post-care kit and check in throughout your healing.",
      "Follow-up: a complimentary check-in around day 14, with continued improvement visible for 3–6 months as collagen rebuilds.",
    ],
    pricing:
      "Solaria CO2 pricing starts from $1,200 per session and varies by area treated and depth selected. Most clients see ideal results from a single session, though more aggressive resurfacing may benefit from a series. We give you exact pricing at your free consultation — no surprises, no upsells.",
    faqs: [
      {
        q: "What does Solaria CO2 actually treat?",
        a: "Solaria CO2 is most effective for sun damage, fine lines and wrinkles, uneven skin tone and texture, acne scars, surgical scars, enlarged pores, and overall skin laxity. It's a true resurfacing treatment, meaning it works at a deeper level than most other in-office options.",
      },
      {
        q: "How is Solaria CO2 different from Morpheus8 Burst?",
        a: "Both are powerful skin-rejuvenation tools, but they work differently. Morpheus8 Burst uses radiofrequency energy delivered through tiny needles to remodel collagen deep in the skin — it's best for laxity and texture. Solaria CO2 uses laser energy on the surface to resurface and even out tone, sun damage, and scars. Many clients use both as part of a comprehensive plan; we'll help you decide what's right at your consultation.",
      },
      {
        q: "Is Solaria CO2 painful?",
        a: "Most clients tolerate it well with topical numbing applied for 30–45 minutes before treatment. You'll feel warmth and a pinpoint sensation during the procedure, but it's significantly more comfortable than the older full-field CO2 lasers. Comfort settings are customizable.",
      },
      {
        q: "How long is the downtime?",
        a: "Plan for 5–7 days of social downtime. You'll experience redness, mild swelling, and skin sloughing during the first week, with most of the visible recovery resolving by day 7. We send you home with everything you need to heal beautifully.",
      },
      {
        q: "How many treatments will I need?",
        a: "Most clients see significant results from a single Solaria CO2 session. Depending on your goals and the depth selected, some clients benefit from a series of 2–3 sessions spaced 3–4 months apart for more dramatic resurfacing. We'll build a plan tailored to your goals at your consultation.",
      },
      {
        q: "Am I a good candidate for Solaria CO2?",
        a: "Most healthy adults with sun damage, fine lines, scarring, or texture concerns are candidates. We screen carefully for skin tone (Fitzpatrick I–IV typically work best), active skin conditions, history of cold sores, and current medications. The free consultation is where we confirm fit — and we'll be honest if something else would serve you better.",
      },
    ],
    relatedServices: ["morpheus8-burst-oswego", "microneedling-oswego", "chemical-peel-oswego"],
    closingCta:
      "Book a free Solaria CO2 consultation. We'll assess your skin, talk through your goals, and give you a clear plan with exact pricing — no pressure, no surprises.",
    promoFlyerImage: "/images/promo/solaria-co2-promo-flyer.png",
    promoFlyerAlt:
      "Solaria CO2 laser before, during, and after skin resurfacing at Hello Gorgeous Med Spa Oswego — gold standard fractional CO2",
    clinicalPhotos: [
      {
        src: SOLARIA_DANI_DEVICE_IMAGE,
        alt: "Danielle Alcala-Glazier with the Solaria by InMode CO2 laser at Hello Gorgeous Med Spa in Oswego, IL",
      },
      {
        src: SOLARIA_TREATMENT_IMAGE,
        alt: "Solaria CO2 fractional laser resurfacing facial treatment in progress at Hello Gorgeous Med Spa Oswego, IL",
      },
      {
        src: SOLARIA_DECOLLETE_TREATMENT_IMAGE,
        alt: "Solaria CO2 laser resurfacing on décolletage at Hello Gorgeous Med Spa in Oswego, IL — protective eyewear and cooling during treatment",
      },
      {
        src: SOLARIA_NECK_LASER_IMAGE,
        alt: "Solaria CO2 fractional laser treatment on neck and jawline at Hello Gorgeous Med Spa in Oswego, IL",
      },
      {
        src: SOLARIA_SCANNER_CLOSEUP_IMAGE,
        alt: "InMode Solaria CO2 scanner handpiece during fractional laser treatment on décolletage at Hello Gorgeous Med Spa in Oswego, IL",
      },
    ],
  },
  {
    slug: "quantum-rf-oswego",
    serviceName: "Quantum RF",
    fullServiceName: "Quantum RF Lipo & Skin Tightening",
    targetKeyword: "quantum rf oswego",
    metaTitle: "Quantum RF Body Contouring in Oswego, IL",
    metaDescription:
      "Quantum RF body contouring and skin tightening in Oswego, IL. Non-surgical fat reduction and skin tightening in one platform. Only provider in the western suburbs.",
    h1: "Quantum RF Body Contouring in Oswego, IL",
    valueProp:
      "Non-surgical body contouring and skin tightening — the gold-standard alternative to liposuction, only available here.",
    bookingUrl: bookingUrlFor(),
    procedureType: "RF",
    bodyLocation: "Abdomen, flanks, arms, thighs, neck, jawline",
    inModeBadge: "quantum",
    tier: "uncontested",
    heroContent:
      "Quantum RF is InMode's most advanced radiofrequency body contouring platform — designed to reduce stubborn fat and tighten loose skin in a single non-surgical treatment. It's the technology cosmetic surgeons recommend for clients who want real body contouring results without the recovery, scars, or risk of liposuction. We're the only practice in the western Chicago suburbs offering it.",
    whyBullets: [
      "Only Quantum RF in Oswego, Naperville, Aurora, or Plainfield — meaningful body contouring without driving into Chicago",
      "Two technologies in one treatment: fat reduction AND skin tightening (most competitors only do one)",
      "Comfortable, in-office, no surgery, no anesthesia, no significant downtime",
      "Performed under the medical authority of Ryan Kent, FNP-BC — not a chain franchise, not a spa technician",
      "Verified InMode Provider — backed by manufacturer training and protocols",
    ],
    howItWorksParagraphs: [
      "Quantum RF uses dual-zone radiofrequency energy that heats subcutaneous fat to the temperature at which fat cells are destroyed, while simultaneously delivering controlled radiofrequency to the deeper layers of skin to stimulate collagen and tighten tissue. The destroyed fat cells are gradually cleared by your body's lymphatic system over the following weeks, and the collagen remodeling continues for 3–6 months. The result is a slimmer, smoother, firmer contour — without surgery, without significant downtime, and without the loose skin that often follows traditional fat reduction. It's especially effective for the abdomen, flanks, arms, thighs, and jawline.",
    ],
    whatToExpectSteps: [
      "Free body contouring consultation with our team — we assess your goals, your candidacy, and which areas would benefit most. We're honest if you'd be better served by a different option.",
      "Pre-treatment: photographs taken to document baseline, area marked and measured. We walk you through every step.",
      "Treatment: 30–45 minutes per area depending on size. You'll feel warmth and a deep heat sensation — most clients describe it as comfortable, similar to a hot stone massage.",
      "Immediately after: no significant downtime. You can return to normal activities, including work and light exercise, the same day. Mild redness or warmth may persist for a few hours.",
      "Results: visible contour improvement typically begins around week 4 and continues for 3–6 months as fat clearance and collagen remodeling progress. Most clients benefit from a series of 3–4 sessions spaced 4–6 weeks apart for ideal results.",
    ],
    pricing:
      "Quantum RF pricing starts from $800 per area per session. Most clients see ideal results with a series of 3–4 sessions. We offer package pricing that brings the per-session cost down meaningfully — we'll give you exact numbers at your free consultation based on your goals and the areas you want to address.",
    faqs: [
      {
        q: "Is Quantum RF the same as CoolSculpting?",
        a: "No — they work differently and produce different results. CoolSculpting freezes fat cells. Quantum RF heats fat cells AND tightens skin in the same treatment. CoolSculpting can leave loose skin behind once fat is reduced; Quantum RF tightens as it slims. For most clients, especially those over 35, Quantum RF produces a more refined contour.",
      },
      {
        q: "How is Quantum RF different from Morpheus8 Burst?",
        a: "Both are radiofrequency platforms, but they target different layers. Morpheus8 Burst uses microneedling to deliver RF deep into the skin for collagen remodeling and texture. Quantum RF works at a deeper level — into the fat layer — to reduce fat volume while tightening skin. Many clients combine the two for full body contouring.",
      },
      {
        q: "How long until I see results?",
        a: "Most clients begin seeing contour changes around week 4 after their first session, with continued improvement over 3–6 months as the body clears destroyed fat cells and collagen rebuilds. Final results from a full series are typically visible 3–6 months after the last treatment.",
      },
      {
        q: "Is there downtime?",
        a: "No significant downtime. You can return to work, normal activities, and light exercise the same day. Some clients experience mild redness, warmth, or temporary tenderness in the treated area for a few hours after the session.",
      },
      {
        q: "Is Quantum RF safe?",
        a: "Yes — when performed by a trained medical provider, Quantum RF is a well-established, FDA-cleared technology with a strong safety profile. As with any body contouring procedure, candidacy matters. We screen carefully for medical history, current medications, and realistic expectations during your free consultation.",
      },
      {
        q: "Am I a good candidate?",
        a: "Quantum RF works best for clients with localized fat and mild-to-moderate skin laxity who are within a reasonable range of their goal weight. It's not a weight loss treatment — it's a body contouring treatment. We confirm candidacy and set honest expectations at your consultation.",
      },
    ],
    relatedServices: ["morpheus8-burst-oswego", "glp-1-weight-loss-oswego", "solaria-co2-oswego"],
    closingCta:
      "Book your free Quantum RF body contouring consultation. We'll talk through your goals, measure the areas you want to address, and give you a clear plan with exact pricing — no pressure to commit, ever.",
  },
  {
    slug: "peptide-therapy-oswego",
    serviceName: "Peptide Therapy",
    fullServiceName: "Medical Peptide Therapy",
    targetKeyword: "peptide therapy oswego",
    metaTitle: "Peptide Therapy in Oswego, IL",
    metaDescription:
      "Medical peptide therapy in Oswego, IL — BPC-157, Sermorelin, GHK-Cu, NAD+, PT-141 & more. $49 NP consult. Ryan Kent, FNP-BC on site. Naperville, Aurora, Plainfield.",
    h1: "Peptide Therapy in Oswego, IL",
    valueProp:
      "Targeted peptide protocols supervised by a full-authority nurse practitioner — for recovery, performance, skin, sleep, and longevity.",
    bookingUrl: bookingUrlFor(),
    procedureType: "Wellness",
    bodyLocation: "Subcutaneous",
    tier: "uncontested",
    heroContent:
      "Peptide therapy is one of the most promising frontiers in modern wellness medicine. Specific peptides can support recovery, immune function, skin quality, sleep, libido, lean muscle, and metabolic health — but only when prescribed correctly, sourced from reputable compounding pharmacies, and supervised by a qualified medical provider. At Hello Gorgeous, every peptide protocol is overseen by Ryan Kent, FNP-BC, with full medical authority. No internet-bought vials. No guesswork. Just real peptide therapy, done right.",
    whyBullets: [
      "Every protocol prescribed and supervised by Ryan Kent, FNP-BC — not sold over the counter",
      "Peptides sourced exclusively from licensed US compounding pharmacies — never gray-market or research-grade",
      "Customized protocols based on your goals, blood work, and medical history",
      "Ongoing follow-up and dose adjustment included — peptide therapy is a relationship, not a one-time sale",
      "Free consultation to determine if peptide therapy is right for you, with no obligation to start",
    ],
    howItWorksParagraphs: [
      "Peptides are short chains of amino acids that act as signaling molecules in the body — telling specific cells to do specific things. Different peptides have different effects: some support immune function, some accelerate tissue repair, some improve sleep architecture, some encourage growth hormone release, some support skin and collagen. Most are self-administered as small subcutaneous injections (similar to insulin pens), typically several times per week, on a cycle determined by your protocol. Because peptide therapy is medically nuanced — dosing, cycling, and combinations matter — it should always be done under the supervision of a qualified provider who can adjust based on how your body responds.",
    ],
    whatToExpectSteps: [
      "$49 peptide consultation with our medical team. We discuss your goals, medical history, current medications, and whether peptide therapy is appropriate for you.",
      "Labs and screening if indicated — we may recommend baseline blood work to inform protocol design and monitor safety.",
      "Protocol design: Ryan reviews your case and prescribes a specific peptide or combination, with dose, frequency, and cycle clearly outlined.",
      "Education: we teach you exactly how to self-administer, store your peptides correctly, and recognize anything that needs to be flagged.",
      "Ongoing support: follow-up appointments to assess response, adjust dosing, and refresh your protocol as needed. Peptide therapy is iterative — we stay involved.",
    ],
    pricing:
      "Consultation is $49; peptide medications are priced separately based on your personalized protocol. Most monthly plans start around $250–$600 depending on peptide and supply length. We give you complete transparent pricing before any commitment.",
    faqs: [
      {
        q: "What conditions or goals can peptide therapy support?",
        a: "Different peptides target different outcomes. Common areas include accelerated injury or post-workout recovery, immune support, improved sleep quality, growth hormone optimization, skin and hair health, libido and sexual function, weight management support, and longevity. We'll talk through which peptide(s) align with your specific goals at your consultation.",
      },
      {
        q: "Is peptide therapy safe?",
        a: "When prescribed by a qualified medical provider and sourced from a licensed US compounding pharmacy, peptide therapy has a strong safety profile. The risks come from gray-market sources, research-grade peptides sold online, and self-dosing without supervision. We do peptide therapy the medical way — prescription only, pharmacy-sourced, NP-supervised.",
      },
      {
        q: "How do I take peptides?",
        a: "Most peptides are taken as small subcutaneous injections (similar to an insulin pen), usually several times per week. The needle is very small, and most clients tolerate it easily. We teach you exactly how to self-administer during your initial protocol visit.",
      },
      {
        q: "How quickly will I notice results?",
        a: "It varies by peptide and goal. Sleep-supporting peptides may show effects in the first 1–2 weeks. Recovery and immune support often takes 4–6 weeks. Skin, hair, and longevity peptides typically take 8–12 weeks for visible changes. We set honest expectations at your consultation.",
      },
      {
        q: "Do I need blood work before starting?",
        a: "It depends on the peptide and your medical history. For some protocols, baseline blood work helps us dose accurately and monitor safety. For others, it's not necessary. We'll discuss what's right for your case during your consultation.",
      },
      {
        q: "What's the difference between peptides and GLP-1 weight loss medications?",
        a: "Both are technically peptides, but GLP-1 agonists (semaglutide, tirzepatide) are a specific category prescribed for weight management. When we talk about 'peptide therapy' more broadly, we usually mean other peptides used for recovery, performance, skin, sleep, and longevity. We offer both — they're prescribed and tracked separately.",
      },
    ],
    relatedServices: ["glp-1-weight-loss-oswego", "biote-hormone-therapy-oswego", "nad-iv-oswego", "peptide-therapy-naperville-il"],
    closingCta:
      "Curious if peptide therapy is right for you? Book your $49 peptide consultation. We'll listen, ask the right questions, and tell you honestly whether peptides fit your goals — or if something else would serve you better.",
  },
  {
    slug: "nad-iv-oswego",
    serviceName: "NAD+ IV Therapy",
    fullServiceName: "NAD+ Intravenous Therapy",
    targetKeyword: "nad iv oswego",
    metaTitle: "NAD+ IV Therapy in Oswego, IL",
    metaDescription:
      "NAD+ IV therapy in Oswego, IL — supervised by a full-authority nurse practitioner. Cellular energy, mental clarity, longevity support. Free consultations.",
    h1: "NAD+ IV Therapy in Oswego, IL",
    valueProp:
      "The cellular-level wellness infusion the longevity world has been talking about — delivered medically, in-office, under NP supervision.",
    bookingUrl: bookingUrlFor(),
    procedureType: "IV",
    bodyLocation: "Systemic",
    tier: "uncontested",
    heroContent:
      "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme found in every cell of your body — essential for converting nutrients into the energy that powers everything from muscle function to brain clarity to DNA repair. NAD+ levels decline with age, stress, illness, and lifestyle factors, and IV infusion is the most direct way to restore them. Clients report mental clarity, sustained energy, improved sleep, faster recovery, and a general sense of feeling 'tuned up.' Done correctly, NAD+ therapy is one of the most powerful wellness tools available — but it should always be administered by qualified medical staff.",
    whyBullets: [
      "Administered in-office by licensed medical staff with Ryan Kent, FNP-BC overseeing every infusion",
      "Pharmaceutical-grade NAD+ from licensed US compounding pharmacies — no gray-market product",
      "Customized dosing based on your goals, medical history, and how you've tolerated previous infusions",
      "Calm, comfortable infusion suite — not an assembly line",
      "Combinable with vitamin and amino acid add-ons for a personalized protocol",
    ],
    howItWorksParagraphs: [
      "NAD+ is delivered as a slow intravenous drip, typically over 2–4 hours, allowing the body to absorb the coenzyme directly into the bloodstream and distribute it cellularly. Unlike oral supplements (which are largely degraded in digestion) or NAD+ precursors (which require conversion in the body), IV NAD+ provides the most bioavailable form. The infusion rate matters — too fast can cause discomfort, too slow stretches the appointment unnecessarily. Our medical team monitors closely throughout, adjusts the rate as needed, and ensures every client is comfortable from start to finish. Most clients begin with a series of 3–6 infusions over several weeks, followed by maintenance every 1–3 months based on individual response.",
    ],
    whatToExpectSteps: [
      "Free consultation with our medical team to discuss your goals (mental clarity, recovery, longevity, post-illness restoration), review your medical history, and confirm IV NAD+ is appropriate.",
      "On infusion day: arrive hydrated and fed. Wear comfortable clothes. We'll get you set up in our infusion suite with everything you need — a comfortable chair, blanket, water, and entertainment.",
      "Infusion: IV is placed by a licensed clinician. The drip rate is adjusted based on your tolerance. Most clients spend 2–4 hours per infusion. Some feel a warming sensation or mild chest pressure if the rate is too fast — we slow it immediately.",
      "After: you can return to normal activities right after. Most clients feel an immediate sense of clarity and sustained energy in the hours and days following.",
      "Follow-up: we check in after your first infusion to assess response, and we tailor the timing and frequency of subsequent sessions to your individual goals.",
    ],
    pricing:
      "Single NAD+ IV infusions start from $400. Most clients see the strongest results with a starter series (typically 3–6 infusions), and we offer package pricing that brings the per-session cost down meaningfully. Add-ons (B-complex, glutathione, amino acids, magnesium) range from $25–$75 each. Exact pricing and protocol recommended at your consultation.",
    faqs: [
      {
        q: "What does NAD+ actually do?",
        a: "NAD+ is a coenzyme that powers cellular energy production, supports DNA repair, regulates metabolism, and influences how cells respond to stress. Clinically, clients report improved mental clarity, sustained energy, better sleep, faster physical and cognitive recovery, and general 'tuned up' wellness. Research continues to explore its role in longevity and neurodegenerative disease, though most clinical claims today are based on subjective client experience rather than large clinical trials.",
      },
      {
        q: "How long does an NAD+ infusion take?",
        a: "Most infusions take 2–4 hours, depending on the dose and your individual tolerance. Faster infusions can cause discomfort (mild chest pressure, warmth, nausea), so we always adjust the rate to keep you comfortable. Plan to spend the morning or afternoon with us.",
      },
      {
        q: "How does it feel during the infusion?",
        a: "Most clients experience a mild warming sensation or slight pressure as the drip starts. If the rate is too fast, you may feel chest tightness or queasiness — we immediately slow the rate, and the sensation passes quickly. Once we find your comfortable rate, the rest of the session is relaxing.",
      },
      {
        q: "How often should I get NAD+?",
        a: "Most clients start with a series of 3–6 infusions over several weeks to build cellular NAD+ levels meaningfully, then transition to maintenance every 1–3 months based on goals and response. Some clients use NAD+ specifically post-illness or pre/post a demanding period (travel, training, life event) — we tailor frequency to your life.",
      },
      {
        q: "Is NAD+ IV safe?",
        a: "When administered by trained medical staff using pharmaceutical-grade NAD+ from licensed compounding pharmacies, NAD+ IV has a strong safety profile. The most common issue is infusion-rate discomfort, which we manage by adjusting rate in real time. Serious adverse events are rare. We screen carefully for medical history at consultation.",
      },
      {
        q: "Should I combine NAD+ with anything else?",
        a: "Many clients add B-complex, glutathione, magnesium, or amino acid blends to their NAD+ infusion for a comprehensive 'cellular reset' protocol. We help you decide what makes sense based on your goals — not what's most expensive.",
      },
    ],
    relatedServices: ["iv-therapy-oswego", "peptide-therapy-oswego", "biote-hormone-therapy-oswego"],
    closingCta:
      "Curious about NAD+ IV therapy? Book a free consultation with our medical team. We'll listen, talk through your goals, and give you a clear honest recommendation — including telling you if NAD+ isn't the right starting point for you.",
  },
];

export const PHASE1_SLUGS = new Set(PHASE1_UNCONTESTED_PAGES.map((p) => p.slug));
