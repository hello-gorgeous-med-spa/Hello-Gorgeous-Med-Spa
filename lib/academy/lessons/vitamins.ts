/**
 * RE GEN Academy — Vitamins & IV Course Lessons
 * Full training content for modules v1-v7
 */

import type { Lesson } from '../types';

export const vitaminLessons: Record<string, Lesson> = {
  v1: {
    intro: "Before any IV gets started, you need to understand why we're doing it in the first place. This module covers the real science behind IV delivery — and where the honest limits of that argument are.",
    sections: [
      {
        heading: "Why IV instead of a pill",
        paragraphs: [
          "Oral supplements pass through the digestive system and liver before reaching circulation — first-pass metabolism. Some nutrients lose 80-90% of their potency this way. IV delivery bypasses all of that, putting nutrients directly into the bloodstream.",
          "This is the honest version of the bioavailability story. It's real. It matters for certain nutrients. But it's also not magic — and overclaiming here is how practices get in trouble."
        ],
        callout: "The bioavailability advantage is real for certain nutrients. It's not a license to promise anything. \"Directly into your bloodstream\" is accurate. \"Absorbs everything perfectly\" is a claim we can't support."
      },
      {
        heading: "What IV delivery actually buys you",
        paragraphs: [
          "For water-soluble vitamins like B12 and vitamin C, IV delivery means higher peak levels than oral ever achieves. This is measurable. Whether that matters for a given client depends on what they're trying to accomplish.",
          "For hydration, the benefit is speed — a liter of fluid IV hydrates faster than drinking it. For minerals like magnesium, IV delivery means we can give amounts that would cause GI upset orally."
        ],
        bullets: [
          "B vitamins: higher peak blood levels than oral",
          "Vitamin C: much higher achievable levels IV vs oral",
          "Magnesium: therapeutic levels without GI upset",
          "Hydration: faster than drinking, useful for acute needs"
        ]
      },
      {
        heading: "The base fluids we use",
        paragraphs: [
          "Normal saline (0.9% sodium chloride) is isotonic — matched to your blood's salt concentration. Lactated Ringer's adds potassium, calcium, and lactate for a more balanced electrolyte profile. The choice isn't arbitrary — Ryan selects based on the client's needs.",
          "When a client asks why they're getting one versus the other, the honest answer is: \"Ryan chose it based on what he saw in your screen.\" You don't need to justify the clinical decision."
        ],
        script: {
          situation: "Client asks why an IV is better than pills",
          say: "IV delivery bypasses digestion, so more reaches your bloodstream — for some nutrients that difference is meaningful. It's also faster than drinking fluids. Whether it makes sense for you depends on what you're trying to achieve, which is what Ryan evaluates.",
          why: "Honest, accurate, and includes the limit. That's what makes it credible."
        }
      },
      {
        heading: "What hydration can and cannot take credit for",
        paragraphs: [
          "Clients often feel significantly better after a hydration IV. Some of that is the fluid. Some of that is the electrolytes. Some of that is the placebo effect of taking an hour to rest. All of those things are real.",
          "What we can't claim: that hydration cures anything, treats a condition, or replaces medical care for someone who's actually sick."
        ]
      }
    ],
    keyTakeaways: [
      "IV delivery bypasses first-pass metabolism — real advantage for certain nutrients",
      "Normal saline and Lactated Ringer's are chosen based on clinical judgment",
      "Feeling better after an IV is real — we just can't claim it cures anything",
      "The honest bioavailability story builds trust; overselling destroys it"
    ],
    practiceScenario: {
      question: "A client says: \"My friend said IV vitamins are a waste of money because you just pee them out.\"",
      bestAnswer: "Water-soluble vitamins do get excreted when levels are high enough — that's true. The difference is the peak level you achieve, which can matter depending on what you're trying to accomplish. Ryan can talk you through whether it makes sense for your goals.",
      why: "Acknowledges the kernel of truth in the skepticism while explaining the nuance."
    }
  },

  v2: {
    intro: "B12 is our highest-volume injection, and \"which form do you use\" is the most common follow-up question. This module gives you the knowledge to answer it — and to know when B vitamins require caution.",
    sections: [
      {
        heading: "The B complex, one by one",
        paragraphs: [
          "B vitamins are a family of eight water-soluble nutrients, each doing different work. B1 (thiamine) converts carbs to energy. B2 (riboflavin) drives cellular energy production. B3 (niacin) is a precursor to NAD. B5 (pantothenic acid) builds coenzyme A. B6 (pyridoxine) is involved in over 100 enzyme reactions. B7 (biotin) supports metabolism. B9 (folate) is essential for DNA synthesis. B12 (cobalamin) is critical for red cells, nerves, and methylation.",
          "You don't need to memorize all of this. You need to understand that they work together and that deficiency in any of them has consequences."
        ],
        callout: "Riboflavin (B2) turns urine bright yellow. Warn clients before they call us worried. This is normal, not a side effect."
      },
      {
        heading: "Methylcobalamin vs cyanocobalamin",
        paragraphs: [
          "This is the question clients ask by name. Cyanocobalamin is synthetic and requires conversion in the body. Methylcobalamin is already in its methylated form, which some people's bodies process more efficiently — particularly those with certain MTHFR variants.",
          "We use methylcobalamin. That's the answer. Why? It's the pre-methylated form, which means it's one less conversion step for the body to do."
        ],
        script: {
          situation: "Client asks: \"Do you use methylcobalamin or cyanocobalamin?\"",
          say: "We use methylcobalamin — that's the pre-methylated form. Some people's bodies process it more efficiently. It's a detail that matters to a lot of our clients.",
          why: "Answers the question, shows we know our product, demonstrates attention to quality."
        }
      },
      {
        heading: "The two B vitamins that carry real cautions",
        paragraphs: [
          "B6 (pyridoxine): Chronic high-dose intake is associated with peripheral neuropathy — tingling, numbness, nerve damage. This is not theoretical. Never encourage stacking B6 supplements on top of what they're getting here.",
          "Biotin (B7): High-dose biotin interferes with lab immunoassays, including thyroid and troponin tests. A client on high-dose biotin can get a falsely normal TSH or a falsely abnormal cardiac marker. Always ask about biotin before labs."
        ],
        bullets: [
          "B6: chronic high doses → neuropathy risk — don't encourage stacking",
          "Biotin: skews lab results — ask before any blood draw",
          "These aren't scare tactics; they're real clinical issues"
        ],
        escalate: [
          "Client reports taking high-dose B6 supplements long-term",
          "Client mentions numbness or tingling in extremities",
          "Client taking biotin needs lab work"
        ]
      },
      {
        heading: "The MTHFR conversation",
        paragraphs: [
          "Clients increasingly ask about MTHFR variants and methylation. You can explain that some people have genetic variants that affect how they process B vitamins, particularly folate and B12. That's factual.",
          "Interpreting their genetic results or recommending specific interventions based on MTHFR status is Ryan's job, not ours."
        ]
      }
    ],
    keyTakeaways: [
      "B12 is our highest-volume injection — know the methylcobalamin answer",
      "B6 carries real neuropathy risk with chronic high dosing",
      "Biotin skews lab results — always ask before draws",
      "MTHFR questions are valid but interpretation goes to Ryan"
    ],
    practiceScenario: {
      question: "A client scheduled for labs mentions they take a biotin gummy for their hair. What do you do?",
      bestAnswer: "Flag it immediately. Let them know biotin can interfere with lab results, and ask Ryan how he wants to handle it — typically they need to stop biotin several days before the draw. Don't just proceed without addressing it.",
      why: "Biotin interference is a real clinical issue that has led to misdiagnosis. Catching it is part of the job."
    }
  },

  v3: {
    intro: "Glutathione is our most requested aesthetic add-on, and high-dose vitamin C requires a specific safety screen. This module covers both — with the honest language that keeps us out of trouble.",
    sections: [
      {
        heading: "High-dose IV vitamin C",
        paragraphs: [
          "Vitamin C is a water-soluble antioxidant and a required cofactor for collagen synthesis. At oral doses, absorption is limited. IV delivery achieves blood levels that oral never can — sometimes 50-100 times higher.",
          "High-dose IV vitamin C is studied for immune support, collagen formation, and in oncology research. We do not make treatment claims about any of these uses."
        ],
        callout: "Before any high-dose IV vitamin C, we require a G6PD screen. G6PD deficiency is a genetic condition where high-dose C can trigger hemolysis — red blood cell destruction. This screen is not optional and it is not ours to skip."
      },
      {
        heading: "The G6PD screen",
        paragraphs: [
          "G6PD deficiency affects roughly 400 million people worldwide, with higher prevalence in certain populations. A person can have it without knowing. The consequences of giving high-dose C to someone with G6PD deficiency can be serious.",
          "This is why we screen. When a client asks why, the answer is: \"This is a safety protocol we don't skip. It's one of the things that makes us a medical practice.\""
        ],
        escalate: [
          "Client has unknown G6PD status and wants high-dose C",
          "Client has known G6PD deficiency",
          "Any family history of hemolytic reactions"
        ]
      },
      {
        heading: "Glutathione",
        paragraphs: [
          "Glutathione is a tripeptide — three amino acids (glycine, cysteine, glutamate) — made in every cell. It's the body's master antioxidant and plays a key role in detoxification pathways. Clients request it for skin brightening, and that's a real studied use.",
          "The honest framing: glutathione is studied for oxidative stress and skin brightening. Results vary. We cannot promise a specific outcome like \"two shades lighter.\""
        ],
        script: {
          situation: "Client asks: \"Will the glutathione lighten my skin?\"",
          say: "It's studied for skin brightening through its effects on melanin production. Results vary person to person, and I can't promise a specific change. What I can tell you is a lot of our clients add it for that reason.",
          why: "Explains the mechanism, sets honest expectations, doesn't make promises."
        }
      },
      {
        heading: "Antioxidant claims and compliance",
        paragraphs: [
          "\"Antioxidant\" is a category that gets overused in marketing. We can explain what antioxidants do — neutralize reactive oxygen species, support cellular health. We cannot claim they prevent disease, reverse aging, or cure anything.",
          "The line: education about mechanisms is fine. Treatment claims are not."
        ]
      },
      {
        heading: "The glow drip connection",
        paragraphs: [
          "Many clients want glutathione as part of a \"glow drip\" before events. This is a legitimate request. Just make sure expectations are set: they may feel refreshed, their skin may look better, but this is support, not a makeover.",
          "Paired with good skincare and in-office treatments, IV antioxidants make sense as part of a bigger picture."
        ]
      }
    ],
    keyTakeaways: [
      "High-dose IV vitamin C requires G6PD screening — non-negotiable",
      "Glutathione is studied for skin brightening — results vary",
      "Antioxidant claims need to stay educational, not treatment-focused",
      "Set realistic expectations for aesthetic add-ons"
    ],
    practiceScenario: {
      question: "A client wants high-dose vitamin C and says they don't need the G6PD test because they've \"never had problems before.\"",
      bestAnswer: "I understand, but this is a safety screen we do for everyone before high-dose C. You can have G6PD deficiency without knowing it, and the risk is real. It's a simple test and it protects you. Let me get that scheduled.",
      why: "Firm but not judgmental. Explains the why. Doesn't cave to pressure."
    }
  },

  v4: {
    intro: "Magnesium is why a drip feels warm. Calcium affects the heart. Minerals in IV therapy carry real considerations that go beyond the marketing language. This module makes you fluent in that conversation.",
    sections: [
      {
        heading: "Magnesium",
        paragraphs: [
          "Magnesium is a cofactor in hundreds of enzyme systems, involved in muscle and nerve function, energy production, and protein synthesis. It's our most commonly added mineral, and it's the one clients feel during infusion.",
          "The warm, flushed feeling during a magnesium drip is normal and rate-related. If clients aren't warned, they get scared. If they're warned, they describe it as pleasant. Same mineral, opposite experience."
        ],
        callout: "Kidney disease is a hard stop for magnesium IV. The kidneys regulate magnesium excretion. If they're not working properly, magnesium can accumulate to dangerous levels. This is why we screen.",
        script: {
          situation: "Client feels warm and flushed during their drip",
          say: "That warmth is the magnesium — it's totally normal and actually means it's working. Some people really like that feeling. Let me know if it gets uncomfortable and we can slow the rate.",
          why: "Normalizes the sensation, explains the cause, offers adjustment — without making a clinical decision."
        }
      },
      {
        heading: "Calcium",
        paragraphs: [
          "Calcium is critical for muscle contraction, nerve conduction, and bone structure. In IV form, it's rate-sensitive and has cardiac implications. This is strictly provider-territory.",
          "We don't adjust calcium. We don't discuss calcium dosing. If a client asks why calcium is or isn't in their drip, the answer is: \"Ryan set up your formulation based on what he saw in your screen.\""
        ],
        escalate: [
          "Any client cardiac history",
          "Any questions about calcium adjustment",
          "Any symptoms during calcium infusion"
        ]
      },
      {
        heading: "Zinc and copper balance",
        paragraphs: [
          "Zinc is a trace mineral required for immune function, wound healing, and protein synthesis. Clients often request it for immune support. What they don't know: long-term high zinc intake depletes copper.",
          "This is why more isn't always better. Zinc nausea is the classic complaint with rapid infusion. And chronic supplementation without monitoring can create a different problem."
        ],
        bullets: [
          "Zinc: immune function, wound healing — nausea with rapid IV",
          "Selenium: antioxidant, thyroid enzymes — narrow therapeutic window",
          "Balance matters: zinc depletes copper with long-term high intake"
        ]
      },
      {
        heading: "Selenium",
        paragraphs: [
          "Selenium is built into glutathione peroxidase (antioxidant defense) and the deiodinase enzymes that convert thyroid hormones. It's important, but it has a narrow window between enough and too much.",
          "This is not a stack-it-yourself mineral. Selenium dosing requires lab monitoring and clinical judgment."
        ]
      },
      {
        heading: "The migraine, cramp, and recovery drips",
        paragraphs: [
          "Magnesium is studied for migraine and muscle cramps. Many of our recovery drips are built around it. When clients ask why, you can explain the muscle relaxation and nerve function connection.",
          "What you can't do: promise it will stop their migraines or cure their cramps. Those are outcome claims about conditions."
        ]
      }
    ],
    keyTakeaways: [
      "Magnesium causes warmth and flushing — rate-related, warn clients first",
      "Kidney disease is a hard stop for magnesium",
      "Calcium is rate-sensitive and cardiac-relevant — strictly provider territory",
      "Long-term high zinc depletes copper — balance matters"
    ],
    practiceScenario: {
      question: "A client says the magnesium made her feel warm and flushed last time and asks if that's an allergic reaction.",
      bestAnswer: "Note it, tell her it's commonly rate-related — the warmth from magnesium is something a lot of people experience. Don't call it an allergic reaction and don't change the formulation yourself. Flag it for Ryan so he can address it at her next visit.",
      why: "Reassures without diagnosing. Documents appropriately. Doesn't make clinical adjustments."
    }
  },

  v5: {
    intro: "NAD+ is the appointment most likely to generate a complaint — and it has nothing to do with the product. It's about expectations nobody set. This module fixes that.",
    sections: [
      {
        heading: "What NAD+ actually is",
        paragraphs: [
          "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme found in every cell, central to energy transfer. It's a nucleotide — not a vitamin, not a peptide. It gets lumped with peptides in wellness marketing because of what it does, not what it is.",
          "Knowing this distinction makes you sound like the professional you are. When clients call it a peptide, gently correct them: \"It's actually a coenzyme — works differently but often discussed in the same breath.\""
        ],
        callout: "NAD+ is not a peptide. This is the mix-up we're trying to kill. If you remember one thing from this section, remember that."
      },
      {
        heading: "Why the infusion takes so long",
        paragraphs: [
          "Most NAD+ side effects — chest tightness, cramping, nausea — are rate-related. Go too fast, and the client feels terrible. This is why NAD+ infusions take 2-4 hours instead of 30 minutes.",
          "Clients who aren't prepared for this appointment leave unhappy. Clients who are warned describe the same sensations as \"intense but manageable.\" The prep conversation matters more here than anywhere else."
        ],
        script: {
          situation: "Booking an NAD+ appointment",
          say: "Just so you know, this appointment takes about 2-4 hours. It's infused slowly because going faster can cause some uncomfortable sensations. Eat beforehand, bring something to do, and know that we can adjust the rate if needed. Any questions before I book it?",
          why: "Sets expectations completely. Prevents the complaint before it happens."
        }
      },
      {
        heading: "Managing expectations",
        paragraphs: [
          "Some clients expect to feel dramatically different after one NAD+ infusion. Some do. Some don't. The honest answer is: responses vary, and longevity effects aren't something you feel the next day.",
          "The sell isn't immediate results — it's cellular energy support as part of a bigger picture. Clients who understand this are more realistic about what they're buying."
        ],
        bullets: [
          "Eat beforehand — nobody enjoys this on an empty stomach",
          "Bring entertainment — it's a long appointment",
          "Sensations are rate-related — we can slow down if needed",
          "Results vary — this is support, not a magic bullet"
        ]
      },
      {
        heading: "When to slow down or stop",
        paragraphs: [
          "If a client is experiencing significant discomfort during an NAD+ drip, slowing the rate is the first intervention. But that's a clinical adjustment — Ryan's decision, not ours.",
          "Your job is to monitor, document, and communicate. If something seems wrong, don't wait — escalate immediately."
        ],
        escalate: [
          "Significant chest tightness or pain",
          "Severe cramping or nausea not responding to rate changes",
          "Any concerning symptoms the client reports",
          "Client wants to stop the infusion"
        ]
      },
      {
        heading: "The longevity positioning",
        paragraphs: [
          "NAD+ is studied for cellular energy metabolism and longevity pathways. That's the educational framing. It connects to the sirtuin enzymes and DNA repair mechanisms that longevity research focuses on.",
          "What we don't say: that it will extend your life, reverse your age, or cure anything. Those are claims, not education."
        ]
      }
    ],
    keyTakeaways: [
      "NAD+ is a coenzyme, not a peptide or vitamin",
      "Most side effects are rate-related — slow infusion is the solution",
      "Prep conversation is critical — warn them about the experience",
      "This is our most complaint-prone appointment when expectations aren't set"
    ],
    practiceScenario: {
      question: "A client calls after their first NAD+ infusion and says it was awful and they want a refund.",
      bestAnswer: "Start by listening — validate that the experience wasn't what they expected. Ask what specifically was uncomfortable. Then involve Ryan to discuss whether the rate was appropriate and what adjustments might help next time. Don't promise a refund without leadership input, but don't dismiss their experience either.",
      why: "Customer service first, but also clinical documentation. This may be rate-related, which is useful feedback."
    }
  },

  v6: {
    intro: "Fat-soluble vitamins accumulate in ways water-soluble ones don't. Lipotropic injections tie into the weight-loss program. This module covers where the \"more is better\" instinct gets dangerous.",
    sections: [
      {
        heading: "Fat-soluble vs water-soluble",
        paragraphs: [
          "Water-soluble vitamins (B complex, C) are largely excreted when blood levels are high enough. You can't really overdose by drinking too much orange juice. Fat-soluble vitamins (A, D, E, K) accumulate in body tissues.",
          "This is why vitamin D dosing follows labs, and why we don't encourage clients to stack fat-soluble supplements on top of what they're getting here."
        ],
        callout: "\"More is better\" is wrong for fat-soluble vitamins. Toxicity is real. When a client wants to maximize their D3, the answer is: \"Ryan looks at your labs and doses accordingly.\""
      },
      {
        heading: "Vitamin D3",
        paragraphs: [
          "Vitamin D3 (cholecalciferol) functions as a hormone, not just a vitamin. It's involved in calcium regulation, bone health, immune function, and mood. Deficiency is common, especially in northern climates.",
          "But because it's fat-soluble, dosing matters. High-dose D3 without monitoring can lead to hypercalcemia — too much calcium in the blood. This is why labs come first."
        ],
        bullets: [
          "Vitamin D functions as a hormone",
          "Deficiency is common — testing is useful",
          "Dosing follows labs — too much causes real problems",
          "Ryan interprets the results and sets the dose"
        ]
      },
      {
        heading: "Vitamin K2",
        paragraphs: [
          "K2 (menaquinone) directs calcium into bone and away from soft tissue — it's why D and K are often discussed together. They work synergistically for bone health.",
          "Critical warning: K2 interacts with warfarin (blood thinners). Always ask about anticoagulant medications."
        ],
        escalate: [
          "Client is on warfarin or other blood thinners",
          "Questions about K2 dosing with existing heart conditions"
        ]
      },
      {
        heading: "Lipotropic injections",
        paragraphs: [
          "Lipotropics are blends typically containing methionine, inositol, choline, and often B12. They're positioned as fat metabolism support as part of a supervised weight-loss program.",
          "The key word is \"support.\" Lipotropics are not a substitute for a weight-loss program — they're an adjunct to one. If a client is looking for a shortcut, this isn't it."
        ],
        script: {
          situation: "Client asks if the lipo shot will make them lose weight",
          say: "Lipotropics support fat metabolism as part of a program — they're not a shortcut on their own. Combined with the right nutrition and activity, they can help. Ryan can talk you through whether it makes sense for your goals.",
          why: "Honest about what it is and isn't. Routes to proper evaluation."
        }
      },
      {
        heading: "The weight-loss program connection",
        paragraphs: [
          "Clients on GLP-1 programs often want to add lipotropics, vitamin D, B12 — everything. The instinct to optimize is understandable. What we watch for is stacking without oversight.",
          "Everything someone is taking should be documented and reviewed. That's how real supervision works."
        ]
      }
    ],
    keyTakeaways: [
      "Fat-soluble vitamins accumulate — \"more is better\" doesn't apply",
      "Vitamin D dosing follows labs, not guesswork",
      "K2 interacts with blood thinners — always ask",
      "Lipotropics are support, not a shortcut"
    ],
    practiceScenario: {
      question: "A client says: \"I'm already taking 10,000 IU of vitamin D from Amazon. Can you add more in my IV?\"",
      bestAnswer: "That's actually something Ryan needs to look at. High-dose D3 without monitoring can cause problems because it accumulates. Let's get your levels checked so he can dose appropriately — that's how we make sure it's helping, not hurting.",
      why: "Doesn't shame the self-supplementation. Explains the risk. Routes to labs and clinical oversight."
    }
  },

  v7: {
    intro: "This is the module that makes our tagline true: we screen you like a medical practice, because we are one. Understanding delegation, scope, and the screening that happens before anyone sits in a chair.",
    sections: [
      {
        heading: "Standing orders and delegation",
        paragraphs: [
          "An IV infusion is a medical procedure. It happens under Ryan's authority — his standing orders, his protocols, his supervision. The person starting the IV is delegated to do so, not acting independently.",
          "This isn't a technicality. It's what separates us from a wellness lounge. When clients ask who's in charge, the answer is Ryan, even if he's not physically starting the IV."
        ],
        callout: "Every infusion happens under NP authority. Volume, rate, and formulation are clinical decisions. \"Just hydration\" is still a medical order."
      },
      {
        heading: "The screening that happens every visit",
        paragraphs: [
          "Before any IV, certain questions must be asked — every single time. Not just the first visit. Status changes. Medications change. A client who was fine last month may have a new contraindication today.",
          "This is not paperwork. This is safety. The questions that catch the kidney disease, the fever, the new medication — those are what make us a medical practice."
        ],
        bullets: [
          "Kidney disease or dialysis — hard stop for many formulations",
          "Heart failure or fluid restrictions — volume matters",
          "Pregnancy or breastfeeding — stops everything",
          "Feeling unwell today — same-day clinical assessment",
          "New medications since last visit — interactions matter"
        ]
      },
      {
        heading: "Recognizing and escalating reactions",
        paragraphs: [
          "Infusion reactions are rare but real. Knowing what to watch for and how to respond is the most important clinical skill anyone doing IVs needs to have.",
          "Early signs: hives, itching, flushing that seems different from normal. More serious: difficulty breathing, rapid heartbeat, swelling, feeling faint. Any of these = stop the infusion and get Ryan immediately."
        ],
        escalate: [
          "Hives, itching, or unusual rash",
          "Difficulty breathing or throat tightness",
          "Rapid heartbeat or chest pain",
          "Significant change in blood pressure",
          "Client says they feel \"wrong\" in a way they can't explain"
        ],
        script: {
          situation: "You notice a client developing hives during their infusion",
          say: "I'm going to pause this and get Ryan right now. You're going to be fine, but I want him to take a look before we continue.",
          why: "Stop the infusion first. Reassure without dismissing. Get clinical help immediately."
        }
      },
      {
        heading: "The only protocol we all rehearse",
        paragraphs: [
          "Reaction response is the one thing everyone who works here practices. Know where emergency supplies are. Know the chain of command. Know that your first job is to stop the infusion and your second job is to get help.",
          "This isn't fear-mongering — reactions are rare. But competence means being ready for the rare thing."
        ]
      },
      {
        heading: "Scope boundaries",
        paragraphs: [
          "You can start an IV under delegation. You can monitor a client. You can document what you observe. You cannot adjust volume or rate without Ryan's approval. You cannot decide to proceed despite a red flag. You cannot reassure away a symptom you're not qualified to evaluate.",
          "When in doubt, pause and ask. That's not weakness — it's professionalism."
        ]
      }
    ],
    keyTakeaways: [
      "Every IV happens under NP authority — delegation, not independence",
      "Screening questions happen every visit, not just the first",
      "Reaction response is the skill everyone rehearses",
      "When in doubt, pause and escalate — that's the right call"
    ],
    practiceScenario: {
      question: "A client arrives for a drip and mentions she has a low-grade fever but wants to proceed anyway.",
      bestAnswer: "A fever is something we need to check with Ryan before we start anything. It might be nothing, but it might change what we do today. Let me grab him real quick. Would you like some water while you wait?",
      why: "Doesn't proceed with a red flag. Doesn't make the clinical call yourself. Keeps the client comfortable while you escalate."
    }
  }
};
