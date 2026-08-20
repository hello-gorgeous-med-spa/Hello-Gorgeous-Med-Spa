/**
 * RE GEN Academy — Peptide Course Lessons
 * Full training content for foundation modules (p0a-p0g) and core modules (p1-p9)
 */

import type { Lesson } from '../types';

export const peptideLessons: Record<string, Lesson> = {
  // Foundation modules
  p0a: {
    intro: "Before you learn about specific peptides, you need to understand what a peptide actually is. This is the 15-minute foundation that makes every other conversation click. By the end of this module, you'll be able to explain peptides to a client in plain English — and that confidence shows.",
    sections: [
      {
        heading: "Amino acids: the building blocks",
        paragraphs: [
          "Your body uses 20 different amino acids to build proteins and peptides. Think of them like letters in an alphabet — each one is distinct, and the order they appear in determines what word you spell.",
          "When amino acids link together in a chain, the length of that chain determines what we call it. A few amino acids (2-50 or so) make a peptide. Longer chains become proteins. The distinction is size, not magic."
        ],
        bullets: [
          "20 standard amino acids exist in human biology",
          "Short chains (2-50 amino acids) = peptides",
          "Long chains (50+ amino acids) = proteins",
          "The sequence — which amino acids in which order — determines function"
        ]
      },
      {
        heading: "Peptides as chemical messengers",
        paragraphs: [
          "Here's the key insight: peptides aren't just building materials — they're signals. Your body uses peptides to send messages between cells, organs, and systems. Insulin tells cells to absorb glucose. Oxytocin signals bonding and trust. GLP-1 tells your brain you're full.",
          "When we talk about therapeutic peptides, we're talking about either mimicking these natural signals or providing signals that support specific biological processes. The body already speaks this language — we're just adding to the conversation."
        ],
        callout: "The simplest way to explain it to a client: \"Peptides are chemical messengers your body already makes. The ones we offer support specific processes — like recovery, metabolism, or hormonal balance — under medical supervision.\""
      },
      {
        heading: "Lock and key: receptor binding",
        paragraphs: [
          "Peptides work by binding to receptors on cell surfaces. The shape of the peptide has to match the shape of the receptor — like a key fitting a lock. When the fit is right, the receptor activates and the cell does something: releases a hormone, starts a repair process, changes its metabolism.",
          "This is why peptides are so specific. A peptide that fits GLP-1 receptors won't accidentally activate growth hormone receptors. The shape determines the function. It's also why we can't make claims about peptides doing things they weren't designed to do — the biology limits it."
        ],
        script: {
          situation: "Client asks: \"How does a peptide actually work in my body?\"",
          say: "It's like a key and a lock. The peptide has a specific shape that fits receptors on your cells. When it binds, it triggers a response — depending on which receptor it fits. That's why different peptides do different things, and why Ryan matches the right one to your goals.",
          why: "Simple, visual, accurate. Positions the consult as where the matching happens."
        }
      },
      {
        heading: "Why this matters for what you say",
        paragraphs: [
          "Understanding lock-and-key biology keeps you from overclaiming. A peptide studied for one receptor system isn't going to magically affect another system. If a client asks whether BPC-157 will help their mood, you can honestly say: \"It's studied for tissue repair pathways — mood is a different system. Ryan can look at what might actually address what you're experiencing.\"",
          "This knowledge makes you credible. You're not just repeating marketing copy — you understand why the claims we make are limited to what they are."
        ]
      }
    ],
    keyTakeaways: [
      "Peptides are short chains of amino acids (2-50 amino acids typically)",
      "They act as chemical messengers between cells and systems",
      "Lock-and-key receptor binding determines what each peptide does",
      "Specificity is built into the biology — that's why we don't overclaim"
    ],
    practiceScenario: {
      question: "A client asks: \"What even is a peptide? Is it like a steroid?\"",
      bestAnswer: "No — peptides are short chains of amino acids that act as messengers in your body. Steroids are a completely different class of molecule. Your body already makes peptides naturally — insulin is one, for example. The peptides we work with support specific processes like recovery or metabolism, and they're prescribed by Ryan after a full evaluation.",
      why: "Clear distinction from steroids (common confusion), uses a familiar example, routes to proper evaluation."
    }
  },

  p0b: {
    intro: "\"Why can't I just take a pill?\" is one of the most common questions we get. This module explains why most peptides require injection, why oral GLP-1 is the exception, and how topical peptides like GHK-Cu work differently. Understanding delivery routes makes you sound like an expert — because you are one.",
    sections: [
      {
        heading: "The digestive system problem",
        paragraphs: [
          "Your digestive system is designed to break down proteins and peptides into individual amino acids for absorption. That's how you get nutrition from food. But it's terrible news for therapeutic peptides — the stomach and intestines destroy the chain before it can do its job.",
          "This isn't a design flaw in the peptide; it's just biology. Enzymes called proteases chop up peptide bonds. Stomach acid denatures the structure. By the time an oral peptide reaches your bloodstream — if any survives — it's usually fragments, not the functional molecule."
        ],
        bullets: [
          "Stomach acid (pH ~2) denatures peptide structures",
          "Proteases in the stomach and small intestine break peptide bonds",
          "Most peptides have <1% oral bioavailability — almost nothing makes it through",
          "This is why injection bypasses the GI tract entirely"
        ]
      },
      {
        heading: "Why injection works",
        paragraphs: [
          "Subcutaneous injection — the shallow, under-the-skin injection we use — delivers the peptide directly into tissue where it can absorb into the bloodstream intact. No stomach acid. No digestive enzymes. The molecule stays whole.",
          "Clients sometimes worry about injection complexity or pain. The reality: these are tiny insulin-style needles, the injection is shallow, and most people barely notice after the first time. We can walk them through it."
        ],
        script: {
          situation: "Client asks: \"Why can't I just take a pill?\"",
          say: "Great question — your digestive system would break down the peptide before it could work. The injection goes just under the skin, skips the stomach entirely, and delivers the molecule intact. It's a tiny needle, same type diabetics use for insulin, and most people say they barely feel it after the first time.",
          why: "Explains the biology simply, normalizes injection, addresses the fear."
        }
      },
      {
        heading: "Oral GLP-1: the exception",
        paragraphs: [
          "Oral semaglutide (Rybelsus) exists — so how does that work? It uses a special absorption enhancer called SNAC that protects the peptide and helps it cross the stomach lining before enzymes destroy it. It's taken on an empty stomach with minimal water and you can't eat for 30 minutes.",
          "It's also less efficient than injectable — lower bioavailability, stricter dosing requirements. We offer injectable GLP-1 programs because the delivery is more reliable. But knowing oral exists helps you answer the question."
        ],
        callout: "The oral GLP-1 exception proves the rule: it requires special formulation, specific timing, and still has lower bioavailability. Injectable remains the standard for therapeutic peptides."
      },
      {
        heading: "Topical peptides: GHK-Cu and skincare",
        paragraphs: [
          "Topical peptides work differently. GHK-Cu (copper peptide) is small enough to penetrate skin and acts locally on the tissue where it's applied. It's studied for collagen support, skin remodeling, and wound healing.",
          "This connects our peptide menu to our skincare shelf. Post-procedure, after Morpheus8 or CO2 laser, topical peptides support recovery where it matters — at the skin surface. Different delivery, different purpose, different conversation."
        ],
        bullets: [
          "Topical peptides act locally, not systemically",
          "GHK-Cu is small enough (3 amino acids) to penetrate skin",
          "Used for collagen support, skin remodeling, wound healing",
          "Bridges our RX menu and our retail skincare"
        ]
      },
      {
        heading: "Matching route to purpose",
        paragraphs: [
          "The delivery route isn't arbitrary — it's matched to what the peptide needs to do. Systemic effects (metabolism, growth signaling, tissue repair throughout the body) need injection. Local effects (skin surface) can use topical. This is part of what Ryan evaluates.",
          "Understanding this helps you explain why our programs are structured the way they are — it's not just preference, it's science."
        ]
      }
    ],
    keyTakeaways: [
      "Digestive enzymes destroy most peptides — that's why oral doesn't work for most",
      "Subcutaneous injection bypasses the GI tract and delivers the molecule intact",
      "Oral GLP-1 uses special formulation but has lower bioavailability",
      "Topical peptides like GHK-Cu work locally on skin — different purpose"
    ],
    practiceScenario: {
      question: "A client says: \"I hate needles. Is there any other way?\"",
      bestAnswer: "I understand — a lot of people feel that way at first. The needles we use are really small, same type as insulin pens, and most people say they barely notice after the first one. For some peptides there are alternatives — like topical GHK-Cu for skin — but for systemic effects, injection is what works. Ryan can talk through the options and even show you how simple it is.",
      why: "Validates the concern, normalizes the fear, offers alternatives where they exist, routes to Ryan for demonstration."
    }
  },

  p0c: {
    intro: "The words \"FDA-approved,\" \"compounded,\" \"research-use-only,\" and \"my friend said\" all mean different things — and the difference shapes every sentence you write and every answer you give. This module makes you fluent in evidence tiers so you never accidentally overclaim.",
    sections: [
      {
        heading: "FDA-approved: the gold standard",
        paragraphs: [
          "FDA approval means the molecule went through clinical trials, demonstrated safety and efficacy for a specific indication, and has an approved label. Semaglutide is FDA-approved for type 2 diabetes and obesity. PT-141 (as Vyleesi) is FDA-approved for HSDD in premenopausal women.",
          "When something is FDA-approved, we can reference that approval. But approval is for specific conditions — using it for something else is \"off-label,\" which is legal for prescribers but changes how we talk about it."
        ],
        bullets: [
          "Clinical trials with human safety and efficacy data",
          "Approved label specifies what it's approved for",
          "Off-label use: legal for prescribers, but we don't market it for unapproved uses",
          "Examples: semaglutide, tirzepatide, PT-141/Vyleesi"
        ]
      },
      {
        heading: "Compounded from a licensed pharmacy",
        paragraphs: [
          "Compounded medications are prepared by licensed pharmacies (503A for patient-specific, 503B for larger batches) according to a prescription. They use pharmaceutical-grade ingredients, follow quality standards, and are dispensed legally.",
          "Many peptides we use are compounded — not because they're unregulated, but because they're not manufactured by big pharma for mass retail. Compounded is not the same as gray-market. Quality control exists. Oversight exists."
        ],
        callout: "Key distinction for clients: \"Compounded means it's made by a licensed pharmacy to Ryan's prescription, using pharmaceutical-grade ingredients. It's not the same as buying something off a website.\""
      },
      {
        heading: "Research-use-only (RUO)",
        paragraphs: [
          "RUO means the compound has not been FDA-approved for human therapeutic use. It's sold for research purposes. This applies to many peptides clients ask about — BPC-157, Semax, Selank, and others.",
          "Our role with RUO compounds is educational only. We can explain what something is and what it's studied for. We cannot recommend it for a condition, promise an outcome, or imply it treats anything. This is a compliance bright line."
        ],
        script: {
          situation: "Client asks: \"Is BPC-157 FDA-approved?\"",
          say: "No — it's what's called research-use-only, which means it hasn't gone through FDA approval for therapeutic use. I can tell you what it's studied for, but whether it's appropriate for you is a conversation for Ryan's consult.",
          why: "Honest about the status, educational about what that means, routes appropriately."
        }
      },
      {
        heading: "Anecdote is not evidence",
        paragraphs: [
          "\"My friend said...\" and \"I read on Reddit...\" are not evidence tiers. They're stories. Anecdotes can be true for that person without being generalizable, reliable, or safe for someone else.",
          "When clients bring anecdotes, don't dismiss them — redirect. \"That's interesting — everyone responds differently. Ryan can look at whether that approach makes sense for your situation.\" You validate without endorsing."
        ],
        bullets: [
          "Stories aren't studies — individual experience doesn't prove safety or efficacy",
          "People share successes more than failures (survivorship bias)",
          "What worked for someone else might not work or might not be safe for this client",
          "Redirect warmly: \"Ryan can evaluate whether that makes sense for you\""
        ]
      },
      {
        heading: "Language that matches evidence",
        paragraphs: [
          "Match your words to the evidence tier. FDA-approved: \"approved for\" the labeled indication. Compounded: \"prescribed by Ryan, prepared by a licensed pharmacy.\" RUO: \"studied for\" — never \"proven,\" \"treats,\" or \"cures.\" Anecdote: \"some people report\" — never \"it works.\"",
          "This precision isn't being picky — it's being professional. It's also what keeps us compliant with regulators who do read our content."
        ]
      }
    ],
    keyTakeaways: [
      "FDA-approved = clinical trials, labeled indication, legal to reference that approval",
      "Compounded = licensed pharmacy, prescription-based, quality-controlled",
      "RUO = not approved for treatment — educational discussion only",
      "\"Studied for\" is compliant; \"proven\" or \"cures\" is not"
    ],
    practiceScenario: {
      question: "A client asks: \"But my friend cured her gut issues with BPC-157 — why can't you just say it works?\"",
      bestAnswer: "I'm glad your friend had a good experience — that's genuinely great to hear. What I can tell you is that BPC-157 is studied for gut lining support, but it's not FDA-approved, so I can't make claims about what it treats or cures. Ryan can look at your specific situation and discuss whether it might be worth exploring for you.",
      why: "Validates the friend's experience, explains the constraint honestly, routes to proper evaluation."
    }
  },

  p0d: {
    intro: "Clients who've bought peptides online are not bad people — they're curious people who went looking for answers. This module teaches you to have that conversation without judgment, get the safety information Ryan needs, and redirect them to proper oversight.",
    sections: [
      {
        heading: "The gray-market reality",
        paragraphs: [
          "Peptides are available online from dozens of unregulated vendors. Some are research chemical suppliers, some are overseas pharmacies, some are straight-up counterfeits. Clients buy them because they're cheaper, more accessible, or because they don't know the difference.",
          "Our job isn't to shame them. It's to explain why sourcing matters and to route any concerns to Ryan. They came to us, which means they're open to doing this properly."
        ],
        callout: "Never make the client feel stupid for buying online. They were trying to solve a problem. Now they're here, which means they want to do it right. Meet them where they are."
      },
      {
        heading: "Quality control concerns",
        paragraphs: [
          "Unregulated peptides have real quality issues. No third-party testing. No sterility guarantee. Potential contamination. Dosing inconsistency — what's on the label may not match what's in the vial. Mislabeling — the vial may contain something else entirely.",
          "These aren't scare tactics; they're documented problems. Clients deserve to know why our sourcing from licensed 503B compounding pharmacies is different."
        ],
        bullets: [
          "No third-party purity testing on gray-market products",
          "Sterility not guaranteed — bacterial contamination is possible",
          "Dose inconsistency: actual content may differ from label",
          "Mislabeling: some vials contain different compounds entirely"
        ]
      },
      {
        heading: "How to have the conversation",
        paragraphs: [
          "When a client mentions they've been getting peptides elsewhere, stay neutral and curious. \"Tell me more about what you've been taking\" gets information. \"That's dangerous\" shuts them down.",
          "Your goal is to gather enough information for Ryan to evaluate safety and to open the door to doing this properly. Most clients switch once they understand the difference."
        ],
        script: {
          situation: "Client says: \"I've been getting BPC-157 from a website. Is that the same as what you have?\"",
          say: "I can't speak to what's in products from other sources — there's a lot of variability in quality out there. What we use comes from licensed compounding pharmacies with testing and sterility standards. Ryan can look at what you've been taking and help you transition to something with proper oversight if that makes sense.",
          why: "Doesn't disparage. Highlights the quality difference. Routes to Ryan for evaluation."
        }
      },
      {
        heading: "Escalation triggers",
        paragraphs: [
          "Some situations require immediate escalation to Ryan. If the client reports unexpected effects from something they're taking, that's clinical. If they're combining multiple substances from unknown sources, that's a safety concern. If they ask you to advise on dosing for their current product, that's outside your scope.",
          "The bright line: any safety concern, any unexpected symptom, any request for clinical guidance on gray-market products goes to Ryan immediately."
        ],
        escalate: [
          "Client reports unusual symptoms from gray-market peptides",
          "Client is stacking multiple compounds from unknown sources",
          "Client asks for dosing advice on products they purchased elsewhere",
          "Any sign of contamination or adverse reaction"
        ]
      },
      {
        heading: "The quality difference",
        paragraphs: [
          "Licensed 503B compounding pharmacies are inspected, follow cGMP standards, test for purity and potency, and guarantee sterility. That's not marketing — it's the regulatory reality.",
          "When clients understand what they're paying for with us, the price difference makes sense. They're not paying for the molecule — they're paying for the assurance that it is what it says, does what it should, and is safe to use."
        ]
      }
    ],
    keyTakeaways: [
      "Gray-market peptides have real quality control problems — this isn't fear-mongering",
      "Meet clients without judgment — they came to us because they want to do this right",
      "Gather information, don't lecture — Ryan needs to know what they've been taking",
      "Any safety concern, unexpected effect, or clinical question goes straight to Ryan"
    ],
    practiceScenario: {
      question: "A client says: \"I've been using peptides from overseas for six months. I feel fine. Why should I switch?\"",
      bestAnswer: "I'm glad you've felt okay — that's a good sign. The concern with unregulated sources isn't that something will definitely go wrong, it's that you can't verify what's actually in the vial — purity, dose, sterility. With us, you're getting tested, pharmaceutical-grade products with proper oversight. Ryan can look at what you've been doing and help you continue with better peace of mind.",
      why: "Validates their experience, explains the risk without catastrophizing, offers a clear value proposition."
    }
  },

  p0e: {
    intro: "When a client feels like peptides are foreign or intimidating, remind them: they already know peptides. Insulin, oxytocin, GLP-1 — these are household names. This module teaches you to use familiar examples as a bridge from curiosity to confidence.",
    sections: [
      {
        heading: "Insulin: the peptide everyone knows",
        paragraphs: [
          "Insulin is a 51-amino-acid peptide hormone made by the pancreas. It's been used therapeutically for over a century — one of the first peptides ever isolated and synthesized. When clients hear \"peptide,\" they often think of something new and experimental. Insulin reminds them this is established science.",
          "Diabetics use peptide therapy every day. That context normalizes what we do and removes the \"weird science\" stigma."
        ],
        script: {
          situation: "Client seems intimidated by the word \"peptide\"",
          say: "You know what? You already know peptides. Insulin is a peptide — it's been used for over 100 years. Peptides are just short chains of amino acids that signal your body to do things. The ones we work with target specific processes like metabolism or recovery.",
          why: "Makes the unfamiliar familiar. Removes intimidation. Builds trust."
        }
      },
      {
        heading: "Oxytocin: the bonding peptide",
        paragraphs: [
          "Oxytocin is a 9-amino-acid peptide released during bonding, intimacy, and childbirth. It's called the \"love hormone\" or \"bonding hormone\" in popular media. Clients have heard of it.",
          "Mentioning oxytocin helps clients understand that peptides aren't just for athletes or biohackers — they're fundamental to human connection and emotion. It also naturally connects to our sexual health offerings."
        ],
        bullets: [
          "9 amino acids — one of the smallest peptide hormones",
          "Released during bonding, touch, intimacy, childbirth, breastfeeding",
          "Widely known from popular media as the \"love hormone\"",
          "Compounded oxytocin is prescription — it's not just a supplement"
        ]
      },
      {
        heading: "GLP-1: from gut hormone to menu item",
        paragraphs: [
          "GLP-1 (glucagon-like peptide-1) is a natural hormone your gut releases after eating. It signals satiety, helps regulate insulin, and slows stomach emptying. Semaglutide and tirzepatide mimic this signal — they're GLP-1 receptor agonists.",
          "This is probably the most important bridge for our weight-loss clients. They're not taking something foreign — they're amplifying a signal their body already makes. That framing changes the conversation."
        ],
        callout: "\"Semaglutide mimics a hormone your gut already makes — GLP-1. It just sends that 'I'm satisfied' signal more strongly and for longer. That's why it changes hunger instead of fighting it.\""
      },
      {
        heading: "Using familiarity to build trust",
        paragraphs: [
          "When you connect what we offer to what clients already know, they feel smarter, not dumber. That's the goal. Nobody wants to feel like they're starting from zero. Showing them they already understand the basics builds confidence and trust.",
          "This also helps with social content. Instead of leading with technical terms, lead with recognition: \"You already know more about peptides than you think...\""
        ]
      },
      {
        heading: "The TikTok to menu bridge",
        paragraphs: [
          "Clients often arrive with fragments they've heard on TikTok or podcasts — half-understood, sometimes wrong. Your job isn't to correct them harshly; it's to bridge from what they've heard to what we actually know.",
          "\"You might have heard about [X] on TikTok — here's what that actually is...\" validates their curiosity while grounding it in accuracy."
        ]
      }
    ],
    keyTakeaways: [
      "Insulin is a peptide — over 100 years of therapeutic use",
      "Oxytocin is a peptide — familiar as the \"bonding hormone\"",
      "GLP-1 is a natural gut hormone — semaglutide mimics it",
      "Familiar examples remove intimidation and build trust"
    ],
    practiceScenario: {
      question: "A client says: \"I don't know anything about peptides. This all seems very experimental.\"",
      bestAnswer: "Actually, you know more than you think. Insulin is a peptide — it's been used for over a century. Oxytocin, the bonding hormone — that's a peptide too. Even the GLP-1 that semaglutide mimics is a hormone your gut makes naturally. Peptides aren't new or experimental — they're how your body already communicates. We're just supporting those signals under medical supervision.",
      why: "Reframes from experimental to familiar. Uses examples they know. Normalizes the category."
    }
  },

  p0f: {
    intro: "Clients sometimes wonder: \"How can you offer this?\" This module covers how compounding pharmacies work, what NP prescriptive authority means in Illinois, and why our model is both legal and rigorous. This knowledge strengthens everything in Module 8.",
    sections: [
      {
        heading: "Compounding pharmacies: 503A vs 503B",
        paragraphs: [
          "Compounding pharmacies prepare medications that aren't commercially available or need to be customized. There are two types under federal law: 503A pharmacies compound patient-specific prescriptions (one patient, one prescription). 503B pharmacies can prepare larger batches of sterile compounds without individual prescriptions, under stricter FDA oversight.",
          "Our peptide sourcing comes from licensed 503B pharmacies — facilities that follow cGMP (current Good Manufacturing Practice), undergo FDA inspections, and provide certificates of analysis for purity and potency."
        ],
        bullets: [
          "503A: patient-specific compounding, requires individual prescription",
          "503B: outsourcing facilities, can prepare batches, stricter FDA oversight",
          "cGMP compliance: quality systems, testing, sterility standards",
          "Certificates of analysis verify purity, potency, and sterility"
        ]
      },
      {
        heading: "Illinois NP prescriptive authority",
        paragraphs: [
          "In Illinois, nurse practitioners with full practice authority can prescribe independently — including controlled substances and compounded medications. This is the legal basis for Ryan's practice. He evaluates, prescribes, and monitors without requiring physician co-signature.",
          "This isn't a workaround; it's Illinois law. Full practice authority means NPs function as independent providers with the education, certification, and licensing to do so."
        ],
        callout: "When clients ask \"who prescribes this,\" the answer is simple: Ryan, our nurse practitioner. He has independent prescriptive authority under Illinois law, including for compounded medications."
      },
      {
        heading: "Ryan's oversight model",
        paragraphs: [
          "What makes us different from a website isn't just the sourcing — it's the oversight. Ryan screens every patient, reviews their history, evaluates contraindications, prescribes appropriately, and monitors response. There's a follow-up structure. There's accountability.",
          "This is what \"medically supervised\" actually means. It's not a marketing phrase — it's a practice model with real clinical responsibility."
        ],
        script: {
          situation: "Client asks: \"Can a nurse practitioner really prescribe this?\"",
          say: "Yes — in Illinois, nurse practitioners with full practice authority can prescribe independently, including compounded medications. Ryan does the full evaluation, writes the prescription, and monitors your progress. It's the same medical oversight you'd get from any prescriber.",
          why: "Clear, factual, builds confidence in the legal and clinical framework."
        }
      },
      {
        heading: "Compounded ≠ unregulated",
        paragraphs: [
          "A common misconception is that compounded means unregulated or lesser quality. The opposite is true for legitimate 503B compounding. These facilities are inspected, follow manufacturing standards, and test their products. The compound may not be FDA-approved for that specific use, but the production process is regulated.",
          "This distinction matters when clients ask about quality. Our sourcing is from facilities that meet federal standards — not from gray-market vendors."
        ]
      },
      {
        heading: "When to reference this",
        paragraphs: [
          "You don't need to recite regulatory details unprompted. But when clients ask about legality, safety, or \"how this is different,\" having these facts ready builds credibility. You know the structure. You can explain it.",
          "This module supplements Module 8 (Compliance) with the specific Illinois and compounding context that makes our model work."
        ]
      }
    ],
    keyTakeaways: [
      "503B compounding pharmacies follow FDA oversight and cGMP standards",
      "Illinois NPs have independent prescriptive authority — this is state law",
      "Ryan screens, prescribes, and monitors — that's what medically supervised means",
      "Compounded is not unregulated — quality standards absolutely apply"
    ],
    practiceScenario: {
      question: "A client asks: \"Is what you're doing even legal? My doctor said compounded peptides are sketchy.\"",
      bestAnswer: "I understand the concern — there's a lot of gray-market stuff out there that deserves skepticism. What we do is different: our peptides come from licensed 503B compounding pharmacies that are FDA-inspected and follow pharmaceutical manufacturing standards. Ryan is a nurse practitioner with full prescriptive authority under Illinois law. It's legal, it's regulated, and it's medically supervised. Happy to have Ryan explain the details in your consult.",
      why: "Acknowledges the concern, distinguishes from gray market, explains the legal basis, offers deeper conversation."
    }
  },

  p0g: {
    intro: "Clients lump a lot of things together under \"peptides\" that aren't peptides at all. NAD+, MK-677, creatine — knowing what's actually what makes you the expert in the room. This quick module clears up the common mix-ups.",
    sections: [
      {
        heading: "NAD+: a coenzyme, not a peptide",
        paragraphs: [
          "NAD+ (nicotinamide adenine dinucleotide) shows up constantly in longevity and wellness conversations. It's central to cellular energy production, DNA repair, and mitochondrial function. It's marketed alongside peptides. But it's not a peptide — it's a coenzyme, a completely different class of molecule.",
          "Why does this matter? Because knowing the difference makes you credible. When a client says \"I want the NAD+ peptide,\" you can gently correct: \"NAD+ is actually a coenzyme, not a peptide — but we do offer it in our IV services. Let me tell you about that.\""
        ],
        bullets: [
          "NAD+ is a coenzyme (nicotinamide adenine dinucleotide)",
          "Central to cellular energy, mitochondrial function, longevity pathways",
          "We offer NAD+ via IV — covered in the Vitamins & IV course",
          "Gets marketed with peptides but is structurally different"
        ]
      },
      {
        heading: "MK-677 (Ibutamoren): a non-peptide secretagogue",
        paragraphs: [
          "MK-677 is an oral, non-peptide growth hormone secretagogue. It mimics ghrelin and stimulates GH release — the same end goal as some peptides — but it's a small molecule, not a peptide chain. That's why it can be taken orally without getting destroyed by digestion.",
          "It gets lumped with peptides because of what it does, not what it is. Technically, it's research-use-only in most contexts. When clients ask, you can explain the distinction and route clinical questions to Ryan."
        ],
        script: {
          situation: "Client asks: \"Is MK-677 a peptide?\"",
          say: "Good question — it's actually not a peptide, even though it shows up in the same conversations. It's a non-peptide growth hormone secretagogue, which means it triggers GH release like some peptides do, but it's a small molecule you can take orally. If you're interested in GH support, Ryan can discuss what options might fit your goals.",
          why: "Accurate distinction, acknowledges the overlap in function, routes to appropriate conversation."
        }
      },
      {
        heading: "Creatine: an amino acid derivative",
        paragraphs: [
          "Creatine is one of the most studied supplements in sports nutrition. It's an amino acid derivative — made from arginine, glycine, and methionine — but it's not a peptide. It's not a chain of amino acids; it's a single small molecule.",
          "Clients sometimes mention creatine in peptide conversations because both are popular in fitness circles. The categories don't overlap. Creatine is a supplement available everywhere; peptides are a different conversation entirely."
        ],
        bullets: [
          "Creatine is an amino acid derivative, not a peptide",
          "Made from arginine, glycine, and methionine — but not a chain",
          "Widely available as a supplement — no prescription needed",
          "Different category from therapeutic peptides"
        ]
      },
      {
        heading: "Why precision matters",
        paragraphs: [
          "When you correctly identify what is and isn't a peptide, clients trust you more. You're not just repeating marketing — you understand the categories. That confidence shows.",
          "It also helps when clients have half-formed ideas from podcasts and TikTok. You can gently clarify without being condescending: \"That's actually a coenzyme, but here's what we offer that addresses the same goal...\""
        ]
      },
      {
        heading: "Quick reference",
        paragraphs: [
          "Peptide: a chain of amino acids (2-50+). Examples: BPC-157, semaglutide, PT-141, insulin, oxytocin.",
          "Coenzyme: a non-protein molecule that helps enzymes work. Example: NAD+.",
          "Small molecule secretagogue: a non-peptide compound that triggers hormone release. Example: MK-677.",
          "Amino acid derivative: a molecule made from amino acids but not a chain. Example: creatine."
        ]
      }
    ],
    keyTakeaways: [
      "NAD+ is a coenzyme, not a peptide — important for IV conversations",
      "MK-677 is a non-peptide secretagogue — oral because it's a small molecule",
      "Creatine is an amino acid derivative, not a chain — different category",
      "Precision makes you credible — know what's actually what"
    ],
    practiceScenario: {
      question: "A client asks: \"I want to add NAD+ to my peptide stack. How does that peptide work?\"",
      bestAnswer: "NAD+ is actually a coenzyme, not a peptide — though it's often marketed alongside them. It's central to cellular energy and mitochondrial function. We offer it via IV, which gets it into your system directly. If you want to add NAD+ to what you're doing, I can tell you about our IV options, and Ryan can discuss how it fits with your current program.",
      why: "Gently corrects the misunderstanding, shows expertise, offers a path forward."
    }
  },

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
          "Epitalon is studied for circadian rhythm and telomerase signaling — but the evidence is thin. MOTS-c is a mitochondrial-derived peptide studied for metabolic regulation. Hello Gorgeous does not offer compounded SS-31 / elamipretide.",
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
