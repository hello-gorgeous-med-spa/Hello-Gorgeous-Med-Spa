/**
 * RE GEN Academy — Peptide Course Lessons
 * Full training content for modules p1-p9
 */

import type { Lesson } from '../types';

export const peptideLessons: Record<string, Lesson> = {
  p1: {
    intro: "Before we talk about any specific peptide, we need to talk about the body's readiness to respond. A protocol only works as well as the nervous system allows. This module builds the foundation for everything that follows.",
    sections: [
      {
        heading: "The nervous system decides outcomes",
        paragraphs: [
          "When a client is stuck in chronic stress — sympathetic overdrive — even a well-designed protocol can stall. The body prioritizes survival over repair. Digestion slows, sleep suffers, and the hormonal signals that drive recovery get suppressed.",
          "This isn't theory. It's the reason two clients on the same protocol get different results. One is sleeping, training smart, and managing stress. The other is grinding through a 60-hour work week on five hours of sleep. Same peptide, opposite outcomes."
        ],
        callout: "Your job is not to fix the nervous system. Your job is to recognize when it's blocking results — and to help the client understand why we address foundations before we add complexity."
      },
      {
        heading: "Parasympathetic repair mode",
        paragraphs: [
          "The parasympathetic state — rest and digest — is where healing actually happens. Growth hormone pulses during deep sleep. Gut repair happens during rest. Muscle protein synthesis requires recovery, not just stimulation.",
          "When we talk about peptide programs, we're really talking about amplifying signals the body is already trying to send. If the client's lifestyle is jamming those signals, no molecule is going to override that."
        ],
        bullets: [
          "Sleep quality is the single biggest predictor of protocol success",
          "Chronic stress suppresses growth hormone, testosterone, and tissue repair",
          "Recovery capacity is finite — more is not always better"
        ]
      },
      {
        heading: "How to talk about this with clients",
        paragraphs: [
          "Clients often want to skip to the molecule. They've heard about BPC-157 or semaglutide and they want to know if it works. The honest answer is: it depends on what else is happening in your body.",
          "This is where we set expectations. Peptide programs at Hello Gorgeous are not vials in isolation — they're part of a bigger conversation about sleep, stress, movement, and nutrition. Ryan screens for all of it."
        ],
        script: {
          situation: "Client asks why we don't just prescribe the peptide",
          say: "The peptide is one part of the picture. Ryan will look at your sleep, your stress, your training — because all of that determines whether the peptide actually does what it's supposed to do. That's what makes us different from a website.",
          why: "It positions the consult as valuable and differentiates us from gray-market sources."
        }
      },
      {
        heading: "When to escalate",
        paragraphs: [
          "If a client describes severe sleep dysfunction, unmanaged chronic stress, or symptoms that suggest deeper issues, that conversation goes to Ryan before any peptide discussion."
        ],
        escalate: [
          "Client reports sleeping less than 4 hours regularly",
          "Signs of disordered eating or extreme restriction",
          "Symptoms that suggest an undiagnosed medical condition",
          "Client is already on multiple protocols from other providers"
        ]
      }
    ],
    keyTakeaways: [
      "The nervous system determines whether a protocol works, stalls, or backfires",
      "Parasympathetic state — rest and digest — is where repair happens",
      "Our programs pair peptides with lifestyle because that's what actually works",
      "Never skip foundational screening to get to the molecule faster"
    ],
    practiceScenario: {
      question: "A client says: \"I don't have time to work on sleep. Can't you just give me the peptide and we'll fix everything else later?\"",
      bestAnswer: "I hear you — you're busy and you want results. The thing is, the peptide works with your body's repair systems, and those systems need sleep to function. Ryan will look at the whole picture in your consult and build a plan that actually works for your life.",
      why: "Acknowledges their reality without caving. Directs to Ryan. Doesn't promise or dismiss."
    }
  },

  p2: {
    intro: "Growth hormone is one of the most requested topics in peptide conversations. This module explains how growth hormone signaling actually works — not to make you a clinician, but to make you credible when a client asks.",
    sections: [
      {
        heading: "How growth hormone works",
        paragraphs: [
          "Growth hormone (GH) is released from the pituitary in pulses, mostly during deep sleep. It travels to the liver and signals the production of IGF-1 (insulin-like growth factor 1). IGF-1 is the molecule that actually drives most of the effects clients are looking for: recovery, muscle protein synthesis, fat metabolism.",
          "This is why sleep matters so much. Poor sleep means fewer GH pulses. Fewer pulses means less IGF-1. Less IGF-1 means slower recovery, harder fat loss, and all the things clients complain about."
        ],
        bullets: [
          "GH is released in pulses — not a steady drip",
          "Deep sleep is when the biggest pulses occur",
          "IGF-1 is the downstream effector doing most of the work"
        ]
      },
      {
        heading: "Secretagogues: GHRH vs GHRP",
        paragraphs: [
          "Peptides in this category don't replace growth hormone — they stimulate your body to release more of its own. That's the key distinction. Exogenous GH (the kind you inject directly) bypasses the body's feedback system. Secretagogues work with it.",
          "There are two main approaches: GHRH analogs (like sermorelin) tell the pituitary to release GH. GHRP-type compounds (like ipamorelin) amplify the hunger-hormone signal that also triggers GH release. Some protocols combine both for a stronger signal."
        ],
        callout: "When a client asks about GH peptides, the honest answer is: these support your body's own production. They're not the same as injecting growth hormone, and that difference matters for safety, legality, and results."
      },
      {
        heading: "What sermorelin is and isn't",
        paragraphs: [
          "Sermorelin is on our RX menu. It's a GHRH analog — it mimics the hormone that tells the pituitary to release GH. Clients often confuse it with direct GH replacement. It's not.",
          "The advantages: it works with the body's natural pulsatile rhythm. The limitations: it only works if the pituitary can respond. That's why Ryan screens — some clients need a different approach."
        ],
        script: {
          situation: "Client asks: \"Is sermorelin the same as HGH?\"",
          say: "No — sermorelin stimulates your own pituitary to release growth hormone. It's not a replacement; it's a signal. That distinction matters for how the body responds and for safety. Ryan can explain more in your consult.",
          why: "Accurate, educational, routes clinical depth to the right person."
        }
      },
      {
        heading: "Lifestyle factors that amplify or suppress GH",
        paragraphs: [
          "This is the context that makes you useful beyond reciting names. Sleep, fasting, exercise — all of these affect GH signaling. A client who understands this is more likely to get results.",
          "Conversely, chronic stress, poor sleep, and constant snacking all suppress GH release. The peptide can only do so much against that headwind."
        ],
        bullets: [
          "Deep sleep is the primary driver of natural GH release",
          "Training — especially resistance training — triggers acute GH pulses",
          "Fasting and low insulin states enhance GH signaling",
          "Chronic stress and sleep deprivation suppress it"
        ]
      }
    ],
    keyTakeaways: [
      "GH secretagogues stimulate your own production — they don't replace GH",
      "Sermorelin is a GHRH analog on our RX menu",
      "Sleep, training, and fasting all affect natural GH release",
      "Pairing decisions are clinical — that's Ryan's call"
    ],
    practiceScenario: {
      question: "A client asks: \"My friend is doing sermorelin and ipamorelin together. Should I do that too?\"",
      bestAnswer: "Pairing peptides is something Ryan evaluates for each person — what works for your friend might not be the right approach for you. Book a consult and Ryan will look at your goals and your labs.",
      why: "Doesn't validate copying someone else's protocol. Routes to the appropriate clinical decision-maker."
    }
  },

  p3: {
    intro: "This is our highest-volume RX offering. Everyone who answers a phone, writes a caption, or speaks to a client needs to understand GLP-1 science. This module gives you the vocabulary to be helpful without ever crossing into prescribing.",
    sections: [
      {
        heading: "What GLP-1 actually does",
        paragraphs: [
          "GLP-1 (glucagon-like peptide-1) is a hormone your gut releases after you eat. It signals satiety, slows stomach emptying, and helps regulate insulin. Semaglutide and tirzepatide are agonists — they mimic that signal, just stronger and longer-lasting than the natural version.",
          "This is not just appetite suppression. It resets hunger signaling, improves insulin sensitivity, and changes how the body handles glucose. The weight loss is the visible outcome; the metabolic shift underneath is the mechanism."
        ],
        callout: "When clients ask \"how does it work,\" the answer is: it mimics a natural gut hormone that tells your brain you're satisfied. That's why it changes hunger — not willpower, biology."
      },
      {
        heading: "Semaglutide vs tirzepatide",
        paragraphs: [
          "This is the question clients ask most. Semaglutide is a GLP-1 agonist. Tirzepatide is a dual agonist — it acts on both GLP-1 and GIP receptors. That's the headline difference.",
          "Is one better? That depends on the person. Some respond better to one than the other. Some have different side-effect profiles. This is exactly why we screen — and why Ryan, not Google, makes the recommendation."
        ],
        script: {
          situation: "Client asks: \"Which one should I take — semaglutide or tirzepatide?\"",
          say: "They work differently — semaglutide targets GLP-1, tirzepatide targets both GLP-1 and GIP. Which is right for you depends on your history, your goals, and how you respond. That's what the consult is for.",
          why: "Factual distinction without making the clinical call. Positions the consult as valuable."
        }
      },
      {
        heading: "The muscle preservation conversation",
        paragraphs: [
          "Weight loss includes muscle loss unless you do something about it. This is one of the most important things to communicate. Our programs pair GLP-1s with protein guidance, training recommendations, and monitoring — because losing 30 pounds of which 10 is muscle is not a win.",
          "Clients often don't know this. The providers who skip this conversation do their clients a disservice. We don't."
        ],
        bullets: [
          "Protein intake needs to increase during weight loss — most clients undereat",
          "Resistance training preserves lean mass",
          "Rapid loss without these supports costs muscle",
          "Ryan monitors body composition, not just scale weight"
        ]
      },
      {
        heading: "Compliance, legality, and language",
        paragraphs: [
          "GLP-1 agonists are prescription medications. They are not supplements. They are not gray-market peptides. They require full medical screening, ongoing monitoring, and a real provider relationship.",
          "Our marketing says \"medically supervised weight-loss programs\" — not miracle shots, not guaranteed results, not cure claims. Every word matters."
        ],
        escalate: [
          "Pregnancy, breastfeeding, or trying to conceive",
          "Thyroid cancer or MEN2 family history",
          "History of pancreatitis or gallbladder disease",
          "Already on a GLP-1 from another provider",
          "Diabetes or on insulin",
          "Prior bariatric surgery"
        ]
      },
      {
        heading: "Side effects and what you can say",
        paragraphs: [
          "Nausea, especially early on, is common. Constipation happens. These are known effects, and acknowledging them is honest — but managing them is clinical.",
          "If a client texts you about a side effect, the answer is always: \"Let me get you to Ryan.\" You can acknowledge they're experiencing something real. You cannot advise them to change dose, timing, or add anything to manage it."
        ]
      }
    ],
    keyTakeaways: [
      "GLP-1 agonists mimic a natural gut hormone that signals satiety",
      "Semaglutide = GLP-1 only; tirzepatide = dual GIP/GLP-1",
      "Muscle preservation requires protein and training — not optional",
      "Side effect management is clinical, not customer service"
    ],
    practiceScenario: {
      question: "A client messages: \"I'm feeling really nauseous on my second week. Should I lower my dose?\"",
      bestAnswer: "Nausea is something a lot of people experience early on — thanks for letting us know. I'm going to loop in Ryan so he can advise you on next steps. Don't change anything until you hear from him.",
      why: "Validates the experience, doesn't minimize it, doesn't advise. Gets clinical involvement immediately."
    }
  },

  p4: {
    intro: "The client who says \"I'm exhausted and I can't switch off\" is looking for something we can help with — but the conversation has to stay on the right side of the line. This module covers cognitive and stress-regulation peptides without ever implying we treat conditions.",
    sections: [
      {
        heading: "Understanding stress pathways",
        paragraphs: [
          "The HPA axis — hypothalamus, pituitary, adrenal — regulates the stress response. When it's chronically activated, everything downstream suffers: sleep, mood, focus, recovery. This is the context that matters for understanding why clients seek these peptides.",
          "We don't diagnose stress disorders or anxiety. We don't treat depression. But we can explain how the body's stress systems work, and we can route clients to Ryan for a proper evaluation."
        ],
        callout: "Never position anything as a treatment for anxiety, depression, or any diagnosed condition. Even well-intentioned language can cross the line. \"Studied for stress regulation\" is education. \"Will help your anxiety\" is a medical claim."
      },
      {
        heading: "Peptides in this space",
        paragraphs: [
          "Semax and Selank are the names clients bring in from their reading. Semax is derived from a fragment of ACTH and is studied for focus and cognitive support. Selank is an analog of the immune peptide tuftsin and is studied for stress regulation and emotional balance.",
          "Both are research-use-only in most contexts. We can explain what they are. We cannot recommend them for conditions or promise outcomes."
        ],
        bullets: [
          "Semax: ACTH fragment, studied for cognition and BDNF signaling",
          "Selank: Tuftsin analog, studied for stress regulation without sedation",
          "Dihexa: Preclinical only — almost no human data, say so if asked"
        ]
      },
      {
        heading: "The honest conversation about evidence",
        paragraphs: [
          "Clients interested in cognitive peptides have often done more reading than average. They'll ask about specific compounds. The professional response is to be honest about the evidence level.",
          "\"Semax has been studied for focus and neuroprotection — most of that research is from outside the US and it's not FDA-approved here. I can't speak to whether it's right for you, but Ryan can look at the full picture.\""
        ],
        script: {
          situation: "Client asks about selank for their anxiety",
          say: "I can't speak to treating anxiety — that's a medical conversation. What I can tell you is that selank is studied for stress regulation. If you want to explore whether it might be appropriate for you, Ryan is the person to have that conversation with.",
          why: "Doesn't deny the interest. Doesn't promise a treatment. Routes appropriately."
        }
      },
      {
        heading: "Sleep, recovery, and lifestyle",
        paragraphs: [
          "Most clients asking about cognitive peptides would benefit more from sleep optimization, stress management, and nervous system support than from any molecule. This is Module 1 all over again — the foundation determines the outcome.",
          "The peptide conversation often reveals a lifestyle that's working against the client. That's useful information for Ryan's consult."
        ]
      }
    ],
    keyTakeaways: [
      "Never position peptides as treatments for anxiety, depression, or diagnosed conditions",
      "Semax and selank are research-use-only — educational discussion only",
      "Be honest about evidence levels — clients respect that more than hype",
      "Lifestyle factors often matter more than any molecule"
    ],
    practiceScenario: {
      question: "A client says: \"I read that selank is better than my anxiety medication. Can you get it for me?\"",
      bestAnswer: "I can't compare anything to a medication you're on — that's a conversation for your prescriber or for Ryan. What I can do is book you a consult where Ryan can look at your full situation and discuss what options might make sense.",
      why: "Doesn't validate replacing medication. Doesn't dismiss the interest. Routes to the right conversation."
    }
  },

  p5: {
    intro: "BPC-157 is the most asked-about peptide at our front desk. This module gives you the knowledge to answer that question confidently — and the clear boundary of what you can and cannot say about it.",
    sections: [
      {
        heading: "What BPC-157 is",
        paragraphs: [
          "BPC-157 stands for Body Protection Compound. It's a synthetic 15-amino-acid chain derived from a protein found in gastric juice. That origin story is part of why clients find it interesting — it's based on something the body makes naturally.",
          "It's studied for tissue repair, gut lining integrity, tendon and ligament recovery. The research is primarily animal studies, with limited human data. That's the honest picture."
        ],
        callout: "You can explain what BPC-157 is and what it's studied for. You cannot say it heals anything, cures anything, or will fix a specific client's problem. Research-use-only language exists for a reason."
      },
      {
        heading: "Why clients ask about it",
        paragraphs: [
          "Clients hear about BPC-157 on podcasts and in wellness circles. They often come in with specific hopes — a nagging injury, gut issues, post-procedure recovery. The interest is genuine.",
          "Your job is to validate the interest, provide accurate information, and route them to Ryan for an evaluation. You're not here to sell them on it or to talk them out of it."
        ],
        script: {
          situation: "Client asks: \"Is BPC-157 safe for me?\"",
          say: "I can tell you what it's studied for, but whether it's right for you is Ryan's call after he looks at your history. Want me to get you a consult?",
          why: "Doesn't make a safety judgment. Acknowledges the question is valid. Routes appropriately."
        }
      },
      {
        heading: "TB-500 and the repair conversation",
        paragraphs: [
          "TB-500 (thymosin beta-4) is usually discussed alongside BPC-157. It's studied for cell migration, tissue repair, and flexibility. A common misconception: thymosin comes from the thymus, not the thyroid. Correct this gently if a client confuses them.",
          "Both are research-use-only. Both are in the educational discussion category. Neither is something we claim will heal a specific condition."
        ],
        bullets: [
          "BPC-157: gastric-derived, studied for gut and tissue repair",
          "TB-500: thymosin beta-4, studied for cell migration and flexibility",
          "Both require clinical evaluation before any recommendation"
        ]
      },
      {
        heading: "Post-procedure recovery context",
        paragraphs: [
          "This is where our med spa services connect to the peptide menu. Clients recovering from Morpheus8, CO2 laser, or other procedures sometimes ask about supporting their recovery. That interest is reasonable.",
          "Whether BPC-157 or anything else is appropriate for post-procedure support is a clinical decision. The conversation is: \"That's a great question for Ryan — he can look at what you had done and whether this makes sense for your recovery.\""
        ]
      },
      {
        heading: "Gray market and sourcing concerns",
        paragraphs: [
          "Clients sometimes mention they've been getting BPC-157 from a website. This is a safety conversation, not a judgment. Gray-market peptides have real quality control issues. Our sourcing is from licensed compounding pharmacies.",
          "If a client is using something from outside, Ryan needs to know. Route that conversation without making them feel bad for asking."
        ],
        escalate: [
          "Client is using BPC-157 or other peptides from unknown sources",
          "Client reports unexpected effects from something they're taking",
          "Questions about specific injury diagnosis or treatment"
        ]
      }
    ],
    keyTakeaways: [
      "BPC-157 is studied for tissue repair — never say it heals or cures",
      "TB-500 is often discussed alongside it — thymus, not thyroid",
      "Gray-market sourcing is a real safety concern — route those conversations to Ryan",
      "Post-procedure recovery questions are valid but clinical"
    ],
    practiceScenario: {
      question: "A client says: \"I've been getting BPC-157 online and it's been helping my knee. Is your stuff the same?\"",
      bestAnswer: "I can't speak to what you're getting online — there's a lot of variation in quality out there. What we use comes from licensed compounding pharmacies. If you want to explore doing this the right way with proper oversight, Ryan can evaluate whether it makes sense for you.",
      why: "Doesn't disparage what they're doing. Highlights our quality difference. Routes to clinical oversight."
    }
  },

  p6: {
    intro: "Longevity is a real conversation, not just marketing hype. This module covers how aging works at the cellular level and how peptides fit into that picture — with appropriate humility about what we actually know.",
    sections: [
      {
        heading: "Cellular aging basics",
        paragraphs: [
          "Aging happens at the cellular level through several interconnected mechanisms: mitochondrial dysfunction, cellular senescence (zombie cells that don't die), autophagy slowdown (the cleanup process), and telomere shortening. These aren't separate problems — they feed each other.",
          "Understanding this helps you have smarter conversations with longevity-focused clients. They're often well-read and will respect accuracy over enthusiasm."
        ],
        bullets: [
          "Mitochondrial function declines with age — affecting energy at the cellular level",
          "Senescent cells accumulate and release inflammatory signals",
          "Autophagy — cellular cleanup — slows down",
          "These processes interact — addressing one often affects others"
        ]
      },
      {
        heading: "Peptides in the longevity conversation",
        paragraphs: [
          "Epitalon is studied for circadian rhythm and telomerase signaling — but the evidence is thin. SS-31 (elamipretide) targets mitochondrial function and is in clinical trials for specific conditions. MOTS-c is a mitochondrial-derived peptide studied for metabolic regulation.",
          "The honest framing: these are research areas, not proven anti-aging treatments. Clients who want to explore them need proper medical context, which is what Ryan provides."
        ],
        callout: "\"Studied for\" is not the same as \"extends life\" or \"reverses aging.\" The longevity peptide space is full of marketing claims that outrun the evidence. We stay on the factual side."
      },
      {
        heading: "The cleanup-reset-regeneration framework",
        paragraphs: [
          "One way to think about longevity interventions is in phases: cleanup (clearing senescent cells, supporting autophagy), reset (restoring signaling and function), and regeneration (supporting tissue repair and renewal). Some clients resonate with this framework.",
          "It's a model for thinking, not a protocol we prescribe. How to sequence interventions — if at all — is clinical and individual."
        ]
      },
      {
        heading: "NAD+ and the IV connection",
        paragraphs: [
          "NAD+ comes up constantly in longevity conversations. It's a coenzyme, not a peptide — know the difference. It's covered in detail in the Vitamins & IV course, but you'll encounter it here because clients bundle it with peptides in their thinking.",
          "The connection: NAD+ is central to mitochondrial energy production, which connects to the cellular aging picture. That's why longevity-focused clients often want both IV NAD+ and peptides."
        ],
        script: {
          situation: "Client asks if peptides can reverse their aging",
          say: "Some peptides are studied for pathways related to cellular aging, but I wouldn't call anything a proven age-reversal treatment. If you want to explore what might make sense for you, Ryan can look at your goals and your labs and build something personalized.",
          why: "Doesn't oversell. Doesn't dismiss. Positions Ryan as the expert who can actually help."
        }
      },
      {
        heading: "Patterns we see",
        paragraphs: [
          "Longevity clients often present with specific patterns: persistent fatigue, poor recovery, feeling older than they should. These are valid concerns. Our job is to take them seriously and route them to evaluation, not to promise that peptides will fix everything.",
          "Sometimes the answer is foundational — sleep, stress, metabolic health — before any peptide makes sense."
        ]
      }
    ],
    keyTakeaways: [
      "Cellular aging involves mitochondria, senescence, autophagy, and telomeres",
      "Longevity peptides are research areas, not proven treatments",
      "NAD+ is a coenzyme (not a peptide) central to cellular energy",
      "Evidence-based humility builds more trust than hype"
    ],
    practiceScenario: {
      question: "A client says: \"I want whatever extends life the most. What do you recommend?\"",
      bestAnswer: "I appreciate that you're thinking long-term. Honestly, there's no single molecule proven to extend human life. What we can do is look at your biomarkers, your lifestyle, and your goals, and build a program around what actually moves the needle. Ryan does that workup in his consults.",
      why: "Honest about limitations. Redirects to actionable value. Doesn't promise what we can't deliver."
    }
  },

  p7: {
    intro: "This is our most sensitive consult. Sexual health, desire, and intimacy are topics clients often struggle to discuss. This module prepares you to make that conversation comfortable without ever crossing into clinical territory.",
    sections: [
      {
        heading: "Where desire originates",
        paragraphs: [
          "Desire is not just hormones and blood flow — it starts in the brain. Dopamine signaling, the nervous system state, emotional safety, hormonal rhythm — all of these contribute. This is why clients who've tried everything else often haven't found answers.",
          "Understanding this helps you be genuinely useful: the client who says \"nothing works\" may be dealing with something upstream that no molecule will override."
        ],
        callout: "This is the one area where making someone feel comfortable is half the job. Many clients have never had anyone take this seriously. Lead with compassion and privacy."
      },
      {
        heading: "PT-141 and the melanocortin pathway",
        paragraphs: [
          "PT-141 (bremelanotide) is a melanocortin receptor agonist. Unlike medications that work on blood flow, it acts centrally in the brain. It's FDA-approved as Vyleesi for hypoactive sexual desire disorder in premenopausal women.",
          "Clients often don't understand this distinction. You can explain the mechanism — central action versus peripheral — without making a suitability judgment. That's Ryan's role."
        ],
        script: {
          situation: "Client asks about PT-141 hesitantly",
          say: "You're in the right place to ask about that. PT-141 works differently than you might expect — it acts in the brain, not on blood flow. Ryan does all the screening for this program and keeps everything private. Would you like me to book you a consult?",
          why: "Normalizes the question. Gives one interesting fact. Emphasizes privacy. Routes to Ryan."
        }
      },
      {
        heading: "The hormone connection",
        paragraphs: [
          "Sexual health conversations often reveal hormone questions underneath. Testosterone, estrogen, progesterone — all affect desire. The hormone course covers this in detail, but the key point here is: PT-141 is one option, and sometimes the root is hormonal.",
          "Ryan evaluates the whole picture. Your job is to make the client feel heard and get them to the consult without making them feel judged."
        ],
        bullets: [
          "Low testosterone (in men and women) affects libido",
          "Hormonal changes through perimenopause shift desire patterns",
          "Stress and nervous system state often matter more than hormones",
          "The full picture is what Ryan evaluates"
        ]
      },
      {
        heading: "Emotional safety and coaching",
        paragraphs: [
          "Some clients have physical readiness but emotional blocks. Trauma, relationship dynamics, body image — these are real factors. We don't do therapy, but we can acknowledge that this isn't purely mechanical.",
          "The script is simple: \"Ryan looks at the whole picture, including whether there are other things that might be worth addressing. Nothing surprises us here.\""
        ]
      },
      {
        heading: "Kisspeptin and research compounds",
        paragraphs: [
          "Kisspeptin is an upstream regulator of reproductive hormones — at the top of the cascade that leads to testosterone and estrogen. It's studied for reproductive signaling and attraction pathways. This is early research; frame it as biology, not as a product promise.",
          "Oxytocin — the bonding hormone — also comes up. Compounded forms are prescription. Clients know oxytocin by reputation; they may not know it requires medical oversight."
        ]
      }
    ],
    keyTakeaways: [
      "Desire originates in the brain — not just hormones or blood flow",
      "PT-141 is a central-acting melanocortin agonist (FDA-approved as Vyleesi)",
      "Privacy and comfort are essential — many clients have never discussed this",
      "Hormones, stress, and emotional factors all contribute"
    ],
    practiceScenario: {
      question: "A client says quietly: \"I just don't want it anymore. My partner thinks something is wrong with me.\"",
      bestAnswer: "I hear you, and I'm glad you're bringing it up. This is actually something a lot of people experience — it's biological, not a character flaw. Ryan specializes in this and he'll give you a real evaluation, not a brush-off. Can I get you scheduled?",
      why: "Validates. Removes shame. Offers concrete help. Doesn't diagnose or minimize."
    }
  },

  p8: {
    intro: "This is the module that keeps everything else legal. Understanding the RUO model, compliant language, and exactly where your scope ends is what protects the practice and the clients we serve.",
    sections: [
      {
        heading: "The RUO model explained",
        paragraphs: [
          "RUO stands for Research Use Only. It means a compound has not been FDA-approved for human therapeutic use. Many peptides we discuss fall into this category. This doesn't mean they're dangerous — it means they don't have the regulatory clearance for treatment claims.",
          "Our role is educational. We can explain what something is and what it's studied for. We cannot recommend it for a condition, promise outcomes, or imply it treats anything."
        ],
        callout: "Research Use Only is not a loophole for making medical claims. It's the opposite — it's why we have to be especially careful with our language."
      },
      {
        heading: "What you can and cannot say",
        paragraphs: [
          "You can describe what a peptide is. You can explain what it's studied for. You can share how our programs work. You can quote pricing and logistics.",
          "You cannot diagnose a condition. You cannot recommend a treatment. You cannot promise an outcome. You cannot adjust a dose. You cannot interpret labs. These are bright lines."
        ],
        bullets: [
          "✓ \"BPC-157 is studied for tissue repair.\"",
          "✗ \"BPC-157 will heal your tendon.\"",
          "✓ \"Ryan screens everyone before prescribing.\"",
          "✗ \"You'd be a good candidate for this.\""
        ]
      },
      {
        heading: "The disclaimers that matter",
        paragraphs: [
          "Every piece of content we put out needs to work if a regulator reads it. \"Results vary\" isn't enough. \"Medically supervised\" matters. \"Consult required\" protects everyone.",
          "When you're writing captions or answering DMs, imagine the FDA and the state board reading it. If you wouldn't want them to see it, rewrite it."
        ],
        script: {
          situation: "Someone DMs asking if a peptide will cure their gut issues",
          say: "I can't speak to a specific condition — that's a medical conversation. What I can tell you is that BPC-157 is studied for gut lining support. If you want to explore whether it might be appropriate for you, Ryan does a full evaluation in the consult. Want me to get you scheduled?",
          why: "Acknowledges the interest. Doesn't make a cure claim. Routes to medical evaluation."
        }
      },
      {
        heading: "Marketing that works and stays compliant",
        paragraphs: [
          "Compliant marketing isn't boring — it's just honest. Lead with the real differentiator: we screen like a medical practice because we are one. Emphasize the consult, the oversight, the individualized approach.",
          "The practices that get in trouble are the ones promising outcomes. The practices that build trust are the ones who tell the truth about what they can and can't do."
        ]
      },
      {
        heading: "When to say \"I don't know\"",
        paragraphs: [
          "\"I don't know, but I can find out\" is a perfectly good answer. \"I don't know, but Ryan will\" is even better. Guessing or overselling to seem knowledgeable is how mistakes happen.",
          "Clients respect honesty more than performance. They can tell the difference."
        ]
      }
    ],
    keyTakeaways: [
      "RUO = Research Use Only = no treatment claims",
      "Educate and inform; never diagnose, prescribe, or promise",
      "Marketing should be honest about what we do — that's the real differentiator",
      "\"I don't know, but Ryan can help\" is always a good answer"
    ],
    practiceScenario: {
      question: "You're writing a social caption about semaglutide. Which is compliant?",
      bestAnswer: "\"Medically supervised weight-loss programs — starts with a consult with our NP. Book yours.\" vs \"Melt 30 lbs in 90 days — guaranteed.\" — the first is compliant, the second is a violation waiting to happen.",
      why: "Specific outcomes and guarantees are claims. Process descriptions and medical supervision emphasis are truthful and defensible."
    }
  },

  p9: {
    intro: "This is where theory becomes practice. Building real-world protocols means reading the whole client, not just matching symptoms to molecules. This module covers how we think about program design.",
    sections: [
      {
        heading: "Reading the whole picture",
        paragraphs: [
          "A peptide protocol isn't a prescription — it's a program. It includes the molecule, but also the training, nutrition, recovery support, and follow-up that make it work. Ryan designs these; your job is to understand why they're designed the way they are.",
          "Clients often come in wanting one thing. The consult often reveals that they need something different or additional. That's not upselling — it's actually listening."
        ],
        bullets: [
          "What's the client's primary goal?",
          "What's their current lifestyle supporting or undermining?",
          "What have they tried before and why didn't it work?",
          "What's their capacity for compliance?"
        ]
      },
      {
        heading: "Phased program design",
        paragraphs: [
          "Complex goals often require phases. A client who wants body recomposition might start with metabolic support, then add growth signaling once the foundation is set. A client recovering from an injury might focus on repair before performance.",
          "This is why our programs have follow-ups. The starting point isn't necessarily the ending point."
        ],
        callout: "Your role is not to design protocols — that's Ryan. Your role is to understand the logic so you can explain why we do things differently than a website that just ships a vial."
      },
      {
        heading: "Stacking, rotating, and transitions",
        paragraphs: [
          "Some protocols combine peptides (stacking). Some cycle between them (rotating). Some have defined start and end points with transitions to maintenance. These decisions are clinical.",
          "When a client asks about combining things or changing timing, the answer is: \"Ryan adjusts protocols based on how you're responding. Let's get you a follow-up.\""
        ],
        script: {
          situation: "Client asks: \"Can I just keep taking this forever?\"",
          say: "Duration is something Ryan evaluates based on your goals and your response. Some protocols have defined courses, some have maintenance phases. He'll talk through the timeline in your follow-up.",
          why: "Doesn't answer the clinical question. Positions the follow-up as valuable."
        }
      },
      {
        heading: "Integrating peptides with services",
        paragraphs: [
          "Peptide programs connect to our other services. IV therapy for foundational support. Morpheus8 and CO2 with recovery support. Hormone therapy as part of a comprehensive plan. This is the vision of integrated care.",
          "When a client is on a peptide program, look for opportunities to connect them to other services that support their goals. That's not sales — it's comprehensive care."
        ]
      },
      {
        heading: "The 90-day program model",
        paragraphs: [
          "Most of our programs run in 90-day cycles with built-in check-ins. This isn't arbitrary — it's enough time to see meaningful change, with enough touchpoints to adjust as needed.",
          "Clients who understand this are more likely to commit. Explain it as: \"We're not here to start something and disappear. We follow your progress and adapt.\""
        ]
      }
    ],
    keyTakeaways: [
      "Protocols are programs, not prescriptions — they include lifestyle factors",
      "Phased approaches match the client's readiness and response",
      "Stacking, rotating, and duration decisions are clinical",
      "90-day programs with follow-ups are our standard model"
    ],
    practiceScenario: {
      question: "A client asks: \"My friend is doing BPC and sermorelin. Should I do the same?\"",
      bestAnswer: "What works for your friend might not be the right approach for you — everyone's different. Ryan looks at your goals, your health history, and what your body actually needs. That's how you get a program that works instead of just copying someone else.",
      why: "Doesn't validate copying. Positions individualization as valuable. Routes to proper evaluation."
    }
  }
};
