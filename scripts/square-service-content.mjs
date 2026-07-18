// SEO descriptions + name cleanups for all 130 Square Appointments services.
// Each entry is keyed by current service name (post Phase 1 dedup/rename).
// `n` = optional new name (only set when name needs cleanup).
// `d` = description (120-220 chars, SEO-optimized, locally relevant).

export const SERVICE_CONTENT = {
  // ===== BOTOX =====
  "Botox /Jeuveau/Dysport": {
    n: "Botox / Jeuveau / Dysport",
    d: "All three are FDA-approved botulinum toxin type A injectables that temporarily relax targeted muscles to smooth dynamic wrinkles (frown lines, forehead creases, crow's feet). Botox: the OG, most studied, 5-7 day onset, 3-4 month duration. Dysport: faster onset (2-3 days), spreads more — good for forehead. Jeuveau: similar to Botox at competitive pricing. Administered by licensed injectors at Hello Gorgeous Med Spa, Oswego.",
  },
  "BOTOX SPECIAL $10/unit( New Clients Only)": {
    n: "Botox — New Client Special ($10/unit)",
    d: "First-time Botox client? $10/unit on your initial visit at Hello Gorgeous Med Spa, Oswego. Natural results, free 15-minute consult included. Same-week appointments.",
  },
  "GlowTox Facial ( Our Signature)": {
    n: "GlowTox Facial — Signature (Hydra + Dermaplaning + Baby Tox)",
    d: "Glow + Smooth: our signature dermaplaning facial combines hydration, smoothing, and BabyTox magic. BabyTox uses a smaller, more superficial dose of botulinum toxin to deliver natural-looking results — improves skin tone, texture, and fine lines without significantly altering facial movement. Hydra + Dermaplaning + Baby Tox in one 60-minute session.",
  },
  "BABY TOX W/ MICRONEEDLING": {
    n: "Baby Tox + Microneedling",
    d: "Ready to achieve a glowing, photo-finished face in days? Micro-Tox microneedling delivers visible results in 24-48 hours after a single session. Unique alternative to classic Botox: smaller superficial doses target the upper layers of skin (not muscle) for natural-looking results, minimal downtime, instant hydration. Improves tone, texture, and fine lines without altering facial movement.",
  },
  "Lip Flip Special": {
    d: "Pout perfection for less! The Lip Flip is a quick, subtle way to enhance your smile using Botox. Just a few units give your upper lip a fuller, lifted appearance — no filler needed. Limited-time $99 special. Get that effortlessly plump look in minutes at Hello Gorgeous Med Spa, Oswego.",
  },
  "Lip Flip": {
    d: "Quick neurotoxin treatment that subtly flips the upper lip outward for a fuller look. No filler, no downtime, lasts 6–8 weeks.",
  },

  // ===== DERMAL FILLERS =====
  "Per Syringe": {
    n: "Dermal Filler — Per Syringe",
    d: "Restore volume, define cheeks, plump lips, or smooth nasolabial folds with hyaluronic acid filler. Priced per syringe; consultation included.",
  },
  "Lip Dissolver (Hylanex)": {
    d: "Dissolve unwanted hyaluronic acid lip filler with Hylenex. Reverses past filler safely — typically one session resolves most cases.",
  },
  "(Hylanex) lip dissolver": {
    n: "Lip Dissolver (Hylenex) — alt",
    d: "Dissolve unwanted hyaluronic acid lip filler with Hylenex. Reverses past filler safely. (Note: duplicate listing — please archive after review.)",
  },
  "Lip Filler — 0.5ml": {
    d: "Half-syringe of HA lip filler for subtle volume and definition. Ideal for first-timers or mid-cycle touch-ups.",
  },
  "Lip Filler — 1ml": {
    d: "Full syringe of HA lip filler for noticeable volume, shape, and hydration. Lasts 9–12 months on average.",
  },

  // ===== PROCEDURES (PREMIUM) =====
  "The Trifecta": {
    d: "Our flagship rejuvenation: Morpheus8 RF microneedling + Solaria CO₂ laser + AnteAGE growth factors in a single 60-minute session. Maximum results, one visit.",
  },
  "Morpheus8 Burst x3 Package": {
    d: "Three Morpheus8 Burst RF microneedling sessions, prepaid and discounted. Up to 8mm penetration for skin tightening, jowls, neck, and acne scars.",
  },
  "Morpheus8 + CO₂ Combo — Most Popular": {
    d: "Our most-booked combo: Morpheus8 RF microneedling stacked with Solaria CO₂ laser for skin tightening + resurfacing in one appointment.",
  },
  "Quantum RF Lipo — Abdomen": {
    d: "Non-surgical fat reduction and skin tightening on the abdomen using radiofrequency. 75-minute session, no downtime, results visible in 4–6 weeks.",
  },
  "MOMMY MAKEOVER": {
    n: "Mommy Makeover",
    d: "Six rejuvenating treatments in one transformative package, all for one low price: PRP Microneedling (collagen facial therapy), IV Therapy (vitamin infusion), 40 units of Botox (wrinkle relaxer), 3 Laser Hair Removal sessions, IPL Photofacial (skin tone correction), and Vitamin B shot (energy boost). All these treatments — one ultimate makeover. Compare to $1,500+ if purchased separately.",
  },
  "Morpheus8 Burst — Buy One Area, Get One 50% Off": {
    d: "Treat two areas of skin tightening or scar revision in one visit — second area is 50% off. Common pairings: face + neck, abdomen + flanks.",
  },
  "Morpheus8 Burst Full Face + Free Neck — VIP Model Special": {
    d: "VIP Model pricing: full-face Morpheus8 with the neck included free. Limited availability — for clients who allow before/after photos.",
  },

  // ===== ANTEAGE SKIN REGENERATION =====
  "AnteAGE MD + CO₂ Combo": {
    d: "AnteAGE MD stem cell growth factors layered with Solaria CO₂ laser resurfacing. Triggers maximum collagen response and accelerates healing.",
  },
  "AnteAGE Exosome Treatment": {
    d: "Cutting-edge exosome therapy that delivers signaling proteins for cellular regeneration. Reduces inflammation, accelerates healing, anti-ages from the inside out.",
  },
  "Hair Restoration with Exosome Injections": {
    d: "AnteAGE MDX® Biosome Hair Solution — professional regenerative scalp treatment at Hello Gorgeous Med Spa in Oswego, IL. Our AnteAGE MDX® protocol uses growth factors and biosomes/exosomes formulated to support follicle signaling pathways involved in hair development (including WNT upregulation), combined with caffeine for follicle stimulation and azelaic acid for DHT-aware support. Delivered via scalp micro-injections or microneedling under NP supervision — not a retail OTC serum. Treatment packages include an at-home aftercare kit. From $499 per session; series of 3+ sessions recommended for density goals at the crown, temples, or part line. Results develop gradually and vary by pattern of thinning, hormones, and adherence. Medical evaluation required. Convenient for Naperville, Aurora, Plainfield, Yorkville & Montgomery. Book online or call (630) 636-6193.",
  },
  "ANTEAGE Microneedling with Exosomes & Biosomes( Best Results)": {
    n: "AnteAGE Microneedling — Exosomes + Biosomes (Best Results)",
    d: "Top-tier AnteAGE microneedling: exosomes + biosomes drive deep regeneration for fine lines, scars, tone, and texture. Our most-requested anti-aging service.",
  },
  "AnteAGE MD Microneedling Treatment": {
    d: "Microneedling paired with AnteAGE MD growth factors for advanced collagen induction. Treats fine lines, acne scars, and uneven texture.",
  },
  "ANTEAGE Microneedling with Stem Cell Growth Cells (Better Results)": {
    n: "AnteAGE Microneedling — Stem Cell Growth Factors (Better Results)",
    d: "Microneedling enhanced with bone marrow-derived stem cell growth factors. Mid-tier AnteAGE option — more potent than HA, gentler than exosomes.",
  },
  "AnteAGE MD Scalp Treatment": {
    d: "AnteAGE MD® scalp treatment in Oswego — targeted growth-factor protocol for thinning hair and scalp health. Entry regenerative tier (or bridge between MDX Biosome/Exosome series). Stimulates follicles, supports density goals, minimal social downtime. From $350 · series of 3–6 sessions typical. Book at Hello Gorgeous Med Spa for Naperville, Aurora & Plainfield clients. Not a cure for all hair loss — candidacy confirmed at consult.",
  },
  "AnteAGE MD Facial": {
    d: "60-minute facial featuring AnteAGE MD stem cell growth factors. Calms inflammation, brightens complexion, accelerates skin renewal. Zero downtime.",
  },
  "Anteage IPL PhotoFacial with  Stem Cell Growth Factors": {
    n: "AnteAGE IPL PhotoFacial + Stem Cell Growth Factors",
    d: "IPL photofacial that targets sun spots, redness, and broken capillaries — paired with AnteAGE growth factors to accelerate healing and amplify results.",
  },
  "ANTEAGE Microneedling with Hylauranic Acid (Good Results)": {
    n: "AnteAGE Microneedling — Hyaluronic Acid (Good Results)",
    d: "Entry-level AnteAGE microneedling with hyaluronic acid for hydration and subtle collagen boost. Great starter for first-time microneedling clients.",
  },
  "Anteage Growth Factor UnderEye Mesotherapy Treatment": {
    n: "AnteAGE UnderEye Growth Factor Mesotherapy",
    d: "Targeted under-eye mesotherapy using AnteAGE growth factors. Reduces dark circles, fine lines, and crepiness. 4-session protocol.",
  },
  "AnteAGE Home Care Consultation": {
    d: "Complimentary consult to build your AnteAGE home regimen — products that match your in-spa treatment plan. 30 minutes, no obligation.",
  },

  // ===== HORMONE THERAPY =====
  "Pellet Therapy — Men": {
    d: "Feeling tired, foggy, or like your body isn't responding the way it used to? You're not alone. Hello Gorgeous Med Spa's BioTE bioidentical pellet therapy gives men a personalized hormone optimization plan. Initial package includes consult, labs, and first pellet. Maintenance: $700 male / $400 female.",
  },
  "Pellet Therapy — Women": {
    d: "Feeling tired, foggy, moody, or like your body isn't responding the way it used to? You're not alone — and you don't have to guess. Hello Gorgeous Med Spa's BioTE bioidentical pellet therapy personalizes hormone optimization based on your symptoms + lab results. Improvements often reported in energy, sleep, mood, libido.",
  },
  "Hormone Lab Panel — Women": {
    d: "Comprehensive 17-marker female hormone lab panel — estrogen, progesterone, testosterone, thyroid (TSH, T3, T4, TPO), cortisol, vitamin D, CBC. Required before starting BioTE hormone therapy at Hello Gorgeous, Oswego.",
  },
  "17 Hormone panel -Results within 36 hours": {
    n: "Hormone Panel (17 Markers) — 36-Hour Results",
    d: "Think of this hormone panel as your roadmap. 17 markers including key sex hormones, FSH (menopause transition), thyroid (TSH, T3, T4, TPO), and CBC. Results in 36 hours. Required for BioTE hormone therapy at Hello Gorgeous Med Spa.",
  },

  // ===== WEIGHT LOSS INJECTIONS =====
  "Tirzepatide (Zepbound/Mounjaro) - 90 Day Program": {
    n: "Tirzepatide 90-Day Program (Zepbound/Mounjaro alternative)",
    d: "Three-month tirzepatide weight loss program with NP supervision, monthly check-ins, and at-home injections. Most clients lose 15–22% of body weight.",
  },
  "Retatrutide GLP-1 Weight loss is here!!!  Power Triple action agonist - Month 3 - 4 ml for 4 weeks": {
    n: "Retatrutide — Month 3 (4 ml × 4 weeks)",
    d: "Retatrutide is a triple-agonist GLP-1/GIP/glucagon medication for weight loss. Month 3 dose: 4 ml weekly for four weeks. NP-supervised.",
  },
  "Weight Loss Package — 3 Months": {
    d: "Three-month medical weight loss package: weekly injection (semaglutide or tirzepatide), monthly check-ins, body composition tracking. 15-minute appointments.",
  },
  "Retatrutide GLP-1 Weight loss is here!!!  Power Triple action agonist - (2 Month) 2 and 4 ml": {
    n: "Retatrutide — 2-Month Plan (2 ml + 4 ml)",
    d: "Two-month retatrutide protocol: 2 ml first month, 4 ml second month. Triple-agonist GLP-1/GIP/glucagon weight loss. NP-supervised.",
  },
  "Retatrutide GLP-1 Weight loss is here!!!  Power Triple action agonist": {
    n: "Retatrutide — Monthly Dose",
    d: "Retatrutide monthly injection. Triple-agonist GLP-1/GIP/glucagon weight loss medication, the newest class beyond semaglutide and tirzepatide.",
  },
  "Tirzepatide — Tier 3 (Maintenance)": {
    d: "Maintenance-level tirzepatide weekly injection at higher dose for clients past initial weight loss phase. NP-supervised, monthly check-ins.",
  },
  "Tirzepatide — Tier 2 (Standard)": {
    d: "Standard-tier tirzepatide weekly injection — for clients in active weight loss after the initial titration phase. Includes monthly NP check-in.",
  },
  "Tirzepatide — Tier 1 (Starter)": {
    d: "Entry-tier tirzepatide injection at the starter dose. Best for clients beginning weight loss therapy. Includes initial NP consult.",
  },
  "Tirzepatide — Initial Consult + First Injection": {
    d: "Your first tirzepatide visit: NP consultation, weight + vitals, baseline labs, and your first weekly injection administered in-office.",
  },
  "Semaglutide — Initial Consult + First Injection": {
    d: "Your first semaglutide visit: NP consultation, weight + vitals, baseline labs, and your first weekly injection administered in-office.",
  },
  "Tirzepatide — Monthly Maintenance": {
    d: "Monthly tirzepatide check-in + injection refill for established clients. 15-minute visit, vitals, dose adjustment as needed.",
  },
  "Semaglutide — Monthly Maintenance": {
    d: "Monthly semaglutide check-in + injection refill for established clients. 15-minute visit, vitals, dose adjustment as needed.",
  },
  "MEDICAL WEIGHT MANAGEMENT PROGRAM": {
    n: "Medical Weight Management Program",
    d: "Hello Gorgeous Med Spa Medical Weight Management Program — powered by RX Pharmacy Compounds. Targets fat, cravings, and low energy with our $249 special. Includes Naltrexone (oral capsules, nightly), Sermorelin (subcutaneous injections), and Lipo-Trim SL (oral spray, daily). Boosts metabolism + fat-burning, curbs cravings, improves energy + mental focus, supports better sleep + hormone function.",
  },
  "Weight Loss Consultation": {
    d: "Free 30-minute consultation to discuss medical weight loss options — semaglutide, tirzepatide, retatrutide, or program packages. No obligation.",
  },

  // ===== PRP INJECTIONS =====
  "PRP — Hair Restoration": {
    d: "Platelet-rich plasma scalp injections that wake dormant hair follicles and reduce shedding. 3-session series; results visible by month 3–4.",
  },
  "PRP — Joint / Body": {
    d: "PRP injections for joint pain, tendon recovery, or sports injuries. Uses your own concentrated platelets to accelerate healing naturally.",
  },
  "PRP Facial — Full (Vampire Facial)": {
    d: "The classic Vampire Facial: microneedling + your own platelet-rich plasma applied topically and massaged in. Tightens, brightens, accelerates collagen.",
  },
  "Platelet-Rich Fibrin (PRF) Injection for Hair Loss": {
    d: "Next-gen alternative to PRP — Platelet-Rich Fibrin uses a slower spin to retain growth factors longer. Direct scalp injection for hair restoration.",
  },
  "PRP Facial — Express": {
    d: "Express version of the Vampire Facial: PRP applied topically with light microchanneling. 60-minute glow boost, less downtime than the full version.",
  },
  "PRP TOPICAL  W/ MICRONEEDLING": {
    n: "PRP Topical + Microneedling",
    d: "Microneedling with PRP applied topically (not injected) for collagen stimulation, glow, and skin renewal. Less invasive than the Vampire Facial.",
  },

  // ===== SKIN SPA =====
  "Solaria CO₂ Laser": {
    d: "Full-face fractional CO₂ laser resurfacing for fine lines, sun damage, scarring, and texture. The gold standard in skin renewal — 7-day downtime.",
  },
  "Solaria CO₂ Laser — Neck Only": {
    d: "Targeted CO₂ laser resurfacing for the neck — addresses crepiness, sun damage, and tech-neck lines. Often paired with Morpheus8 for best results.",
  },
  "Solaria CO₂ Laser — Under Eye": {
    d: "Precise CO₂ laser treatment for under-eye fine lines, crepiness, and dark circles. Minimal downtime, dramatic skin renewal.",
  },
  "Microneedling with PRP": {
    d: "Microneedling enhanced with your own PRP for collagen stimulation, scar revision, and glow. The original Vampire Facial protocol.",
  },
  "Microneedling": {
    d: "Collagen-induction therapy using sterile micro-needles to trigger your skin's natural renewal. Treats acne scars, fine lines, pores, and texture.",
  },
  "VAMP SALMON DNA RED CARPET GLASS SKIN FACIAL W/ MICRONEEDLING/IPL PHOTOFACIAL/OR CHEMICAL PEEL": {
    n: "Salmon DNA Glass Skin Facial (Red Carpet)",
    d: "Uneven tone, dark spots, dull complexion? VAMP Salmon DNA Treatment — often called the 'Glass Skin Facial' in Korean skincare — offers a next-level approach to a glowing, photo-finished complexion in days. Choice of microneedling, IPL photofacial, or chemical peel as add-on. Premium glass-skin protocol at Hello Gorgeous Med Spa.",
  },
  "VI Peel": {
    d: "Medical-grade chemical peel that resurfaces skin, fades pigmentation, and stimulates collagen. 7-day peeling cycle reveals smoother, brighter skin.",
  },
  "2-in-1 Hydra Pen Micro-channeling & Hydra Facial": {
    d: "Combines Hydra Pen microchanneling for product penetration with a HydraFacial cleanse-and-hydrate. Two treatments, one 60-minute session.",
  },
  "Photofacials (IPL)": {
    d: "Intense Pulsed Light (IPL) photofacial that targets sun spots, redness, broken capillaries, and rosacea. Even tone in 3–5 sessions.",
  },
  "Hydra Peel Facial - w/Dermaplanning": {
    n: "Hydra Peel Facial + Dermaplaning",
    d: "Hydrating peel facial paired with dermaplaning to remove peach fuzz and dead skin. Glow + smooth texture, perfect pre-event treatment.",
  },
  "Diamond Glow Facial": {
    d: "DiamondGlow patented exfoliation, extraction, and infusion in one device. Custom serums for your skin concerns. Instant glow, zero downtime.",
  },
  "Nano Needling": {
    d: "Gentler alternative to traditional microneedling — nano-cones (not needles) deliver active serums for hydration and brightening. Safe for all skin types.",
  },
  "Signature Facial": {
    d: "Our signature 60-minute facial: deep cleanse, exfoliation, customized mask, and serums tailored to your skin. The perfect monthly maintenance.",
  },
  "GLOW 2 FACIAL (GENEO)": {
    n: "Geneo Glow Facial",
    d: "Geneo OxyGeneo facial: bubbling exfoliation + nutrient infusion + lymphatic massage. Instant glow with zero irritation. Great for sensitive skin.",
  },
  "Chemical Peel Facial": {
    d: "Custom chemical peel facial — glycolic, lactic, or salicylic — to resurface, brighten, and smooth. Adjusted to your skin type and goals.",
  },
  "Dermaplanning Facial (Our Most Popular)": {
    n: "Dermaplaning Facial — Most Popular",
    d: "Our most-booked facial: dermaplaning removes peach fuzz + dead skin, followed by customized mask. Skin instantly smoother, makeup glides on perfectly.",
  },
  "Hydra Peel Facial - Hydra Feel Facial - No Add-Ons": {
    n: "Hydra Peel Facial — Standard",
    d: "Standalone hydra-peel facial without add-ons: cleanse, exfoliate, hydrate, and glow. Perfect pre-event quick refresh.",
  },
  "High Frequency Acne Facial": {
    d: "Targeted facial for active breakouts using high-frequency current to kill bacteria and reduce inflammation. Customized for acne-prone skin.",
  },
  "Oxygen Facial": {
    d: "Pressurized oxygen + serum infusion for instant plumping, glow, and lift. No downtime, perfect 'red-carpet' treatment before an event.",
  },

  // ===== IV DRIPS =====
  "IV Drip — NAD+": {
    d: "NAD+ infusion for cellular energy, mental clarity, and anti-aging at the mitochondrial level. 3-hour drip; benefits felt within 24–48 hours.",
  },
  "MYER'S COCKTAIL": {
    n: "IV Drip — Myers' Cocktail (60min)",
    d: "Classic Myers' Cocktail: B-vitamins, magnesium, calcium, and vitamin C. The original wellness IV — supports immunity, energy, and recovery.",
  },
  "IV Drip — Immunity Boost": {
    d: "High-dose vitamin C, zinc, and B-complex IV for immune support. Ideal at the first sign of a cold or for travel prep.",
  },
  "IV Drip — Beauty Glow": {
    d: "Beauty IV with biotin, glutathione, and B-vitamins for skin, hair, and nail support. Antioxidant-rich; clients often book before events.",
  },
  "IV Drip — Energy & Performance": {
    d: "Athletic-recovery IV with B-vitamins, amino acids, and electrolytes for energy and performance. Great for athletes and busy professionals.",
  },
  "IV BEAUTY": {
    n: "IV Drip — Beauty (60min)",
    d: "Beauty-focused IV with antioxidants, biotin, and B-vitamins. 60-minute session for inside-out skin support.",
  },
  "IV Drip — Myers Cocktail": {
    n: "IV Drip — Myers' Cocktail (45min)",
    d: "Express version of the classic Myers' Cocktail: B-vitamins, magnesium, vitamin C in a 45-minute drip. Wellness staple.",
  },
  "IV Drip — Hangover Recovery": {
    d: "Hangover relief IV: hydration, electrolytes, anti-nausea, vitamin B-complex. Feel functional in 30–45 minutes.",
  },
  "IV MIGRANE": {
    n: "IV Drip — Migraine Relief",
    d: "Migraine relief IV with magnesium, B-vitamins, and anti-nausea support. Often resolves migraine symptoms within an hour.",
  },
  "Intro Offer": {
    n: "IV Drip — Intro Offer",
    d: "First-time IV client? Try any standard wellness drip at intro pricing. Hydration + B-vitamins + your choice of one booster shot.",
  },
  "B-Lean IV Kit": {
    n: "IV Drip — B-Lean (Weight Loss Support)",
    d: "Weight-loss-support IV with B-vitamins, MIC, and L-carnitine to boost metabolism and energy. Pairs well with our GLP-1 program.",
  },
  "REBOOT (HANGOVER)  IV THERAPY": {
    n: "IV Drip — Reboot (Hangover Recovery)",
    d: "Premium hangover IV: full hydration, B-complex, anti-nausea, anti-inflammatory, and electrolytes. The 'reboot' option after a long night.",
  },
  "IV JET LAG": {
    n: "IV Drip — Jet Lag Recovery",
    d: "Jet lag recovery IV with hydration, B-vitamins, and amino acids. Resets your system quickly after long travel.",
  },

  // ===== VITAMIN INJECTIONS =====
  "MIC/Lipo-B Injection": {
    d: "MIC + Lipo-B injection (methionine, inositol, choline + B12) to support fat metabolism and energy. 10-minute appointment; weekly use recommended.",
  },
  "Glutathione Injection": {
    d: "Glutathione injection for skin brightening, antioxidant support, and detox. Often paired with weight loss or beauty IV protocols.",
  },
  "B12 Injection": {
    d: "Vitamin B12 (methylcobalamin) injection for energy, mood, and nerve health. 10-minute appointment; great as a weekly boost.",
  },
  "B-Complex Injection": {
    d: "Full B-complex injection (B1, B2, B3, B5, B6, B12) for energy, mood, and metabolism support. 10-minute appointment.",
  },
  "Vitamin Injection Bar — Choose Your Shot": {
    d: "Pick from our menu: BCAA (muscle repair), L-Carnitine (fat → energy), Glutathione (antioxidant, anti-inflammatory), Magnesium Sulfate (cramps + muscle), NAD+ (cellular energy + recovery), CoQ10 (oxygen use, tissue repair), Taurine (electrolytes), B12 / B-Complex (energy + nervous system), Vitamin C (collagen + healing). Walk-in friendly, 10-minute visit.",
  },
  "VITAMIN INJECTIONS": {
    n: "Vitamin Injections (Alt)",
    d: "Choose from our vitamin injection menu: BCAA, L-Carnitine, Glutathione, Magnesium Sulfate, NAD+, CoQ10, Taurine, B12, B-Complex, or Vitamin C. 10-minute walk-in visit. (Note: alternate listing — see also Vitamin Injection Bar.)",
  },

  // ===== TRIGGER POINT =====
  "Trigger Point Injection — Multiple Sites": {
    d: "Trigger point injections in multiple muscle areas for chronic muscle tension and pain. NP-administered with lidocaine + anti-inflammatory.",
  },
  "Trigger Point Injection — Single Site": {
    d: "Single trigger point injection for localized muscle pain or tension. NP-administered, 20-minute appointment.",
  },

  // ===== LASER HAIR REMOVAL =====
  "Professional Brazilian Laser Hair Removal": {
    d: "Professional-grade Brazilian laser hair removal — full or partial. Permanent reduction in hair growth over 6–8 sessions. Safe for most skin tones.",
  },
  "Laser Hair Removal - Legs or Arms": {
    n: "Laser Hair Removal — Legs or Arms",
    d: "Laser hair removal for full legs or full arms. Permanent hair reduction over 6–8 sessions, spaced 4–6 weeks apart.",
  },
  "Laser Hair Removal - Brazilian": {
    n: "Laser Hair Removal — Brazilian",
    d: "Brazilian laser hair removal — bikini line + intimate area. Permanent reduction in 6–8 sessions. Quick, in-and-out 30-minute appointment.",
  },
  "Laser Hair Removal - Underarm": {
    n: "Laser Hair Removal — Underarm",
    d: "Underarm laser hair removal — fast 15-minute appointment. Permanent hair reduction over 6–8 sessions. Goodbye razor burn.",
  },
  "Laser Hair Removal - Upper Lip or Chin": {
    n: "Laser Hair Removal — Upper Lip or Chin",
    d: "Quick laser hair removal for upper lip or chin. 15-minute session, permanent reduction over 6–8 visits.",
  },
  "Laser Hair Removal Consultation": {
    d: "Free consultation to map a custom laser hair removal plan based on your skin tone, hair density, and goals. 30 minutes, no obligation.",
  },

  // ===== LASH SPA (lean menu — Jul 2026) =====
  "Hybrid Lash Extensions — Full Set": {
    d: "Hybrid lash extensions full set — mix of classic + volume for natural-with-drama fullness. Most popular style. $150 · 90 minutes. Hello Gorgeous Med Spa · Oswego.",
  },
  "Classic Lash Extensions — Full Set": {
    d: "Classic one-to-one lash extensions — natural, mascara-look fullness. Perfect for first-timers. $120 · 90 minutes.",
  },
  "Volume Lash Extensions — Full Set": {
    d: "Volume lash extensions full set — multiple ultra-light lashes per natural lash for soft, fluffy fullness. $200 · 2-hour application.",
  },
  "Lash Fill": {
    d: "Lash extension fill (classic, hybrid, or volume). Restores fall-out and refreshes your look. $75 · 60 minutes. Book every 2–3 weeks.",
  },
  "Hybrid Lash Fill": {
    n: "Lash Fill",
    d: "Lash extension fill (classic, hybrid, or volume). Restores fall-out and refreshes your look. $75 · 60 minutes.",
  },
  "Lash Mini Fill": {
    d: "Quick mini fill for small gaps (typically within 7 days of your set). $40 · 30 minutes.",
  },
  "Lash Mini Fill (within 7 days)": {
    n: "Lash Mini Fill",
    d: "Quick mini fill for small gaps (typically within 7 days of your set). $40 · 30 minutes.",
  },
  "Lash Removal": {
    d: "Professional removal of eyelash extensions with professional remover (no pulling). Protects natural lashes. $40 · 30 minutes.",
  },
  "Lash Lift & Tint": {
    d: "Classic lash lift + tint — curls and darkens your natural lashes for a mascara-look that lasts 6–8 weeks. No extensions. $89 · 60 minutes. Hello Gorgeous Med Spa · Oswego.",
  },
  "Korean Lash Lift & Tint": {
    d: "Korean lash lift + tint — premium lift technique for a softer, lifted natural-lash look with tint. Longer-lasting curl than a standard lift. $129 · 75 minutes. Hello Gorgeous Med Spa · Oswego.",
  },

  // ===== BROW SPA =====
  "Brow Lamination & Tint": {
    d: "Brow lamination for fluffy, lifted brows + tint for color and definition. The trendy look that lasts 6–8 weeks.",
  },
  "Brow Lamination with Wax & Shape - With Tint": {
    n: "Brow Lamination + Wax/Shape + Tint",
    d: "Full brow service: lamination for lift, professional wax + shape, and tint for color. 60-minute brow transformation.",
  },
  "Brow Lamination": {
    d: "Brow lamination only — fluffy, groomed brows that stay set for 6–8 weeks. Adds volume to sparse brows.",
  },
  "Brow Lamination with Wax & Shape - Without Tint": {
    n: "Brow Lamination + Wax/Shape (No Tint)",
    d: "Brow lamination paired with professional wax + shape (no tint added). For natural brow color who just want the lifted look.",
  },
  "Brow Henna Shaping & Wax": {
    d: "Brow henna for tinted skin + hair + wax shaping. Henna stains the skin too, creating a fuller-looking brow shape that lasts 1–2 weeks.",
  },
  "Brow Tint": {
    d: "Brow tint only — adds depth and color to natural brows. 20-minute appointment, lasts 3–4 weeks.",
  },
  "Brow Wax & Shape": {
    d: "Professional brow waxing + shaping. Clean lines, balanced arches, removes strays. Quick 15-minute appointment.",
  },
  "Brow Shaping/Wax": {
    n: "Brow Shaping + Wax (alt)",
    d: "Brow waxing and shaping — clean, defined arches. Note: alternate listing of our standard brow wax service.",
  },

  // ===== MEDICAL CONSULTATIONS =====
  "Medical Visit with Ryan Kent, APRN , FNP": {
    n: "Medical Visit — Ryan Kent, FNP-BC",
    d: "Clinical visit with our Medical Director Ryan Kent, FNP-BC. For complex medical questions, lab review, or treatment planning.",
  },
  "Consultation": {
    d: "Free 15-minute consultation to discuss any service, your goals, or treatment options. No pressure, no obligation.",
  },

  // ===== MISCELLANEOUS / RECATEGORIZED =====
  "Multi-Site Session": {
    cat: "Trigger Point Injections",
    d: "Targeted relief in 15-20 minutes as we address multiple trigger points. This focused session helps ease muscle tension and discomfort, leaving you feeling refreshed and more comfortable in no time.",
  },
  "Intro Offer": {
    cat: "Trigger Point Injections",
    n: "Trigger Point Injection — Intro Offer",
    d: "Targeted trigger point relief in just 10 minutes — ideal for newcomers or clients with specific tension points. Quick session helps you feel relaxed and refreshed. Perfect first-time experience.",
  },

  // ===== PHASE 2.1 GAP FILL — bare live items not previously in source =====
  "Tirzepatide": {
    d: "Tirzepatide is a GLP-1 + GIP dual-agonist (the same molecule as Mounjaro and Zepbound) for medically supervised weight loss. Compounded option at Hello Gorgeous Med Spa, Oswego — labs, dosing, and weekly support included.",
  },
  "Retatrutide": {
    d: "Retatrutide is a triple-action GLP-1 / GIP / glucagon agonist — the next generation of weight-loss therapy, with 24%+ average loss in trials. Compounded and physician-supervised at Hello Gorgeous Med Spa, Oswego.",
  },
  "Vitamin Injection": {
    d: "Quick IM vitamin injection for energy, immunity, or recovery. Choose your shot at the Vitamin Bar — B12, MIC, glutathione, biotin, vitamin D, and more. Walk-in friendly at Hello Gorgeous Med Spa, Oswego.",
  },
  "Neuromodulator": {
    d: "Neuromodulator (Botox, Dysport, or Jeuveau) — FDA-approved injectables that relax targeted muscles to soften forehead lines, frown lines, and crow's feet. Pricing per unit; consult included at Hello Gorgeous Med Spa, Oswego.",
  },
  "Quantum RF, Morpheous 8 x3 package, and Solaria CO2": {
    d: "Three-modality bundle: Quantum RF for fat reduction, Morpheus8 (×3) for deep RF microneedling tightening, and Solaria CO₂ for skin resurfacing. Full contouring + resurfacing protocol at Hello Gorgeous Med Spa, Oswego.",
  },

  // ===== FRESHA CSV GAP FILL (2026-07-11) =====
  "Yearly Refresher": {
    cat: "Brow Spa",
    d: "Annual microblading refresh to restore color, shape, and definition. Keeps your brows vibrant between full sessions. Includes mapping, numbing, and touch-up artistry at Hello Gorgeous Med Spa, Oswego.",
  },
  "Microblading Fine Line, Shade, or Powder": {
    cat: "Brow Spa",
    d: "Custom microblading — choose fine line, powder, or combo shading for natural, face-framing brows. Consultation, mapping, numbing, and same-day procedure with licensed artists at Hello Gorgeous Med Spa.",
  },
  "MICROBLADING CONSULTATION  - Free": {
    n: "Microblading Consultation — Free",
    cat: "Brow Spa",
    d: "Complimentary 15-minute microblading consult: shape design, color match, health history, and candidacy review. No obligation — plan your brow transformation at Hello Gorgeous Med Spa, Oswego.",
  },
  "The Dani, Fix Me Facial": {
    n: "The Dani, Fix Me Trifecta",
    cat: "Exclusive Model Specials",
    d: "Three-visit anti-aging correction plan: IPL for pigment and redness, Morpheus8 for collagen and tightening, and CO₂ resurfacing for texture and wrinkles. The signature Hello Gorgeous trifecta — not a basic facial.",
  },
  "Quantum RF Lipo Neck": {
    n: "Quantum RF Lipo — Neck",
    cat: "Exclusive Model Specials",
    d: "Minimally invasive Quantum RF radiofrequency lipolysis for neck tightening and contouring. Medical-grade body sculpting with clinical oversight at Hello Gorgeous Med Spa, Oswego.",
  },
  "Quantum RF Lipo Neck  - Knees": {
    n: "Quantum RF Lipo — Knees",
    cat: "Exclusive Model Specials",
    d: "Quantum RF body contouring focused on knee-area skin laxity and definition. RF-assisted tightening with minimal downtime at Hello Gorgeous Med Spa.",
  },
  "Quantum RF Lipo Neck  - Arms": {
    n: "Quantum RF Lipo — Arms",
    cat: "Exclusive Model Specials",
    d: "Arm contouring with Quantum RF — targets stubborn fat and loose skin on upper arms. Physician-supervised InMode protocol at Hello Gorgeous Med Spa, Oswego.",
  },
  "Quantum RF Lipo Neck  - Abdomen": {
    n: "Quantum RF Lipo — Abdomen (Full)",
    cat: "Exclusive Model Specials",
    d: "Full-abdomen Quantum RF lipo and skin tightening — advanced body contouring for the midsection. Comprehensive RF-assisted treatment at Hello Gorgeous Med Spa.",
  },
  "Peptide Therapy Consultation (Over 50 + Available)": {
    n: "Peptide Therapy Consultation",
    cat: "Bioidentical Hormone Therapy (BHRT)",
    d: "Peptide therapy consult with our NP team — review goals, labs, and candidacy for growth-factor and recovery peptides. Personalized wellness roadmap at Hello Gorgeous Med Spa, Oswego.",
  },
  "4-Week Tirzepatide Program": {
    cat: "Weight Loss Injections",
    d: "Four-week compounded tirzepatide starter program with medical evaluation, dosing, and weekly support. GLP-1/GIP dual-agonist weight management supervised by Ryan Kent, FNP-BC.",
  },
  "Korean Lash Lift New Now Available": {
    n: "Korean Lash Lift",
    cat: "Lash Spa",
    d: "Korean-style lash lift — deeply conditioned, lifted lashes from root to tip with a wide-eyed curl. Lasts 6–8 weeks; no extensions required. Now available at Hello Gorgeous Med Spa.",
  },
  "Wax - Lip and Chin": {
    n: "Wax — Lip & Chin",
    cat: "Brow Spa",
    d: "Quick lip and chin wax for smooth, hair-free skin. 10-minute add-on or standalone service at Hello Gorgeous Med Spa, Oswego.",
  },
  "GLOW2FACIAL (GENEO)": {
    n: "Geneo Glow2 Facial",
    cat: "Skin Spa",
    d: "Geneo Glow2Facial — advanced oxigenating facial that exfoliates, infuses nutrients, and leaves skin radiant. Non-invasive glow treatment at Hello Gorgeous Med Spa.",
  },
  "Photofacials (IPL)": {
    cat: "Skin Spa",
    d: "IPL photofacial for sun spots, redness, broken capillaries, and uneven tone. Non-invasive light therapy with minimal downtime at Hello Gorgeous Med Spa, Oswego.",
  },
  "High Frequency Acne Facial": {
    cat: "Skin Spa",
    d: "High-frequency acne facial — antibacterial oxygenation and deep cleansing to calm breakouts and prevent new blemishes. Ideal for acne-prone skin at Hello Gorgeous Med Spa.",
  },
  "Hydra Facial w/ Dermaplanning": {
    n: "HydraFacial + Dermaplaning",
    cat: "Skin Spa",
    d: "HydraFacial paired with dermaplaning for instant smoothness, deep hydration, and a glass-skin glow. Exfoliation + infusion in one visit at Hello Gorgeous Med Spa.",
  },
  "Laser Hair Removal - Legs or Arms per session": {
    n: "Laser Hair Removal — Legs or Arms",
    cat: "Body Spa",
    d: "Single-session laser hair removal for legs or arms. Medical-grade Class 4 laser; 3–6 sessions recommended for lasting reduction. Hello Gorgeous Med Spa, Oswego.",
  },
  "Laser Hair Removal - Underarm per session": {
    n: "Laser Hair Removal — Underarms",
    cat: "Body Spa",
    d: "Underarm laser hair removal — quick 15-minute session. Permanent hair reduction over a series of treatments at Hello Gorgeous Med Spa.",
  },
  "Laser Hair Removal - Upper Lip or Chin per session": {
    n: "Laser Hair Removal — Upper Lip or Chin",
    cat: "Body Spa",
    d: "Laser hair removal for upper lip or chin — fast, precise, permanent reduction over 3–6 sessions. Medical-grade laser at Hello Gorgeous Med Spa, Oswego.",
  },
  "Laser Hair Removal - Bikini per session": {
    n: "Laser Hair Removal — Bikini",
    cat: "Body Spa",
    d: "Bikini-line laser hair removal per session. Smooth, long-lasting results with our medical-grade laser platform.",
  },
  "Laser Hair Removal - Brazilian per session": {
    n: "Laser Hair Removal — Brazilian (Single Session)",
    cat: "Body Spa",
    d: "Single-session Brazilian laser hair removal. Part of a 3–6 session series for permanent reduction — medical-grade laser, NP-supervised at Hello Gorgeous Med Spa.",
  },
  "Laser Hair Removal Consultation  - Laser Hair Consultation  - Free": {
    n: "Laser Hair Removal Consultation — Free",
    cat: "Body Spa",
    d: "Free laser hair removal consult: Fitzpatrick skin typing, contraindications, treatment plan, and pricing. 30 minutes, no obligation at Hello Gorgeous Med Spa.",
  },
};
