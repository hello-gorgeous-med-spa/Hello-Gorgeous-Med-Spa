/**
 * RE GEN Academy — Hormone Course Lessons
 * Full training content for modules h1-h6
 */

import type { Lesson } from '../types';

export const hormoneLessons: Record<string, Lesson> = {
  h1: {
    intro: "Hormones are a feedback system, not a set of dials. Understanding the three major axes — HPA, HPG, and HPT — gives you the mental model for everything else in this course.",
    sections: [
      {
        heading: "The three axes that explain everything",
        paragraphs: [
          "The body's hormone system is organized around three major communication loops between the brain and the glands. HPA (hypothalamus-pituitary-adrenal) controls the stress response. HPG (hypothalamus-pituitary-gonadal) controls reproductive hormones. HPT (hypothalamus-pituitary-thyroid) controls metabolism.",
          "Each axis has the same basic structure: the hypothalamus signals the pituitary, the pituitary signals the target gland, and the target gland's output feeds back to regulate the whole loop. When you understand this, you understand why treating one hormone in isolation rarely works."
        ],
        callout: "This isn't trivia. When a client asks why fixing one thing affects another, or why their friend's treatment doesn't work for them, axis thinking is the answer."
      },
      {
        heading: "Why feedback matters",
        paragraphs: [
          "Feedback is the body's thermostat. When hormone levels get high enough, the brain reduces the signal asking for more. When levels drop, the signal increases. This is why external hormones affect natural production — the feedback system adjusts.",
          "Clients often don't understand this. They think of hormones like vitamins — more is simply better. The reality is more nuanced, which is exactly why this requires medical oversight."
        ],
        bullets: [
          "HPA axis: hypothalamus → pituitary → adrenal (cortisol, DHEA)",
          "HPG axis: hypothalamus → pituitary → gonads (testosterone, estrogen)",
          "HPT axis: hypothalamus → pituitary → thyroid (T4, T3)",
          "Each axis includes negative feedback — high levels suppress signals"
        ]
      },
      {
        heading: "The vocabulary clients bring in",
        paragraphs: [
          "Clients have been reading. They come in with terms they've heard on podcasts or seen in wellness content: \"adrenal fatigue,\" \"estrogen dominance,\" \"reverse T3 ratio.\" Some of these are real clinical concepts. Some are marketing terms.",
          "Your job isn't to validate or dismiss — it's to translate. \"You're asking about the relationship between estrogen and progesterone — that's exactly what Ryan looks at in the panel.\" That's helpful without being clinical."
        ],
        script: {
          situation: "Client says she has \"estrogen dominance\"",
          say: "That's a term that gets used a lot. Ryan will look at your actual estrogen and progesterone levels and see what's really going on — sometimes what feels like too much estrogen is actually low progesterone. He'll give you the real picture.",
          why: "Validates the concern, translates to clinical terms, routes to proper evaluation."
        }
      },
      {
        heading: "Why treating in isolation doesn't work",
        paragraphs: [
          "The axes talk to each other. Stress affects reproductive hormones. Thyroid affects metabolism and mood. Reproductive hormones affect everything from sleep to body composition. A client who comes in with fatigue might have thyroid issues, adrenal issues, sex hormone issues — or all three.",
          "This is why we do comprehensive panels instead of guessing. And it's why Ryan looks at the whole picture."
        ]
      }
    ],
    keyTakeaways: [
      "Three axes: HPA (stress), HPG (reproductive), HPT (thyroid)",
      "Feedback systems mean hormones aren't just \"more is better\"",
      "Translate client vocabulary without validating or dismissing",
      "Comprehensive panels beat guessing — that's why we screen"
    ],
    practiceScenario: {
      question: "A client says: \"I just need my cortisol fixed. I don't want a bunch of tests.\"",
      bestAnswer: "I get it — you want to feel better, not collect paperwork. The thing is, cortisol doesn't exist in isolation. Stress hormones affect thyroid and reproductive hormones too. Ryan does a full panel so he can actually see what's happening, not guess. That's how we avoid chasing the wrong thing.",
      why: "Acknowledges the frustration. Explains why comprehensive testing matters. Positions it as saving time, not wasting it."
    }
  },

  h2: {
    intro: "This is where most hormone conversations start. A woman in her mid-forties, exhausted, not sleeping, cycle going strange. She's been dismissed before. How you listen in the first two minutes decides whether she stays.",
    sections: [
      {
        heading: "The estrogen trio",
        paragraphs: [
          "\"Estrogen\" isn't one hormone — it's three. Estradiol (E2) is the most biologically active, produced mainly by the ovaries before menopause. Estrone (E1) becomes dominant after menopause, produced mostly by fat tissue. Estriol (E3) is the pregnancy estrogen.",
          "When clients talk about \"their estrogen,\" they usually mean estradiol. When labs measure it, that's what they're testing. But knowing there are three helps you explain why menopause changes things."
        ],
        callout: "The single most important distinction in female hormone therapy: progesterone is bioidentical, progestin is synthetic. Clients conflate them constantly, often because of what they were told about birth control pills. Get this distinction locked in."
      },
      {
        heading: "Progesterone vs progestin",
        paragraphs: [
          "Progesterone is the hormone produced naturally after ovulation. It's structurally identical to what the body makes. Progestins are synthetic compounds designed to mimic some of progesterone's effects — but they're not the same molecule and they don't behave the same way.",
          "Many clients have bad associations with \"progesterone\" because they were on progestin-based birth control and felt terrible. Explaining this difference changes the conversation."
        ],
        script: {
          situation: "Client says she can't take progesterone because it made her feel awful on the pill",
          say: "What was in your pill was probably a progestin — a synthetic version. Bioidentical progesterone is structurally identical to what your body makes naturally, and most people tolerate it very differently. Ryan can explain the difference and help you understand your options.",
          why: "Corrects the misconception. Opens the door to reconsidering. Routes to clinical conversation."
        }
      },
      {
        heading: "The perimenopause timeline",
        paragraphs: [
          "Perimenopause isn't a single event — it's a transition that can last 4-10 years. Symptoms often start while cycles are still regular, which confuses both clients and providers who only look at FSH or whether periods have stopped.",
          "This is why so many women get told they're \"fine\" when they feel anything but. Their labs look normal because they're in early transition. The symptoms are real even when the numbers haven't caught up."
        ],
        bullets: [
          "Perimenopause can begin in the late 30s or early 40s",
          "Symptoms often precede lab changes",
          "\"Normal\" FSH doesn't mean symptoms aren't real",
          "The transition is not linear — good months and bad months"
        ]
      },
      {
        heading: "How to talk about symptoms without diagnosing",
        paragraphs: [
          "Clients want to tell you their symptoms. That's good — it's information. What you don't do is connect those symptoms to a diagnosis. \"Hot flashes, mood changes, and sleep trouble are all things that often come up in perimenopause\" is education. \"You're in perimenopause\" is diagnosis.",
          "The goal is to validate that what they're experiencing is real and worth investigating, then get them to Ryan."
        ],
        escalate: [
          "Postmenopausal bleeding (any bleeding after 12 months without periods)",
          "Severe symptoms affecting daily function",
          "History of breast cancer or blood clots",
          "Already on hormones from another provider"
        ]
      },
      {
        heading: "The first two minutes matter",
        paragraphs: [
          "Most of these clients have been dismissed somewhere else. A provider ran a panel, said it was normal, and told them to manage their stress. They're skeptical that anyone will actually help.",
          "What they need in the first two minutes is evidence that you're listening. Not answers — you don't have those and shouldn't offer them. Evidence that somebody is going to take the whole picture seriously."
        ]
      }
    ],
    keyTakeaways: [
      "Estrogen is three hormones — estradiol is the active one",
      "Progesterone (bioidentical) is not progestin (synthetic) — critical distinction",
      "Perimenopause symptoms often precede lab changes",
      "Listen first. Validate. Route to Ryan for the clinical conversation."
    ],
    practiceScenario: {
      question: "A client says: \"My doctor said my hormones are normal but I feel terrible. Can you help?\"",
      bestAnswer: "That's frustrating — and you're not alone. A lot of our clients have heard the same thing. \"Normal\" on a lab doesn't always mean optimal for you. Ryan looks at the full picture, including symptoms, not just whether you're in the reference range. Let's get you scheduled.",
      why: "Validates without disparaging the previous provider. Explains our approach. Offers a path forward."
    }
  },

  h3: {
    intro: "Men's hormone health is an underserved market. The clients who come in are often hesitant and under-informed. This module gives you the knowledge to take them seriously and serve them well.",
    sections: [
      {
        heading: "Total versus free testosterone",
        paragraphs: [
          "Total testosterone is what's circulating in the blood. Free testosterone is what's actually available for the body to use — unbound by proteins. The distinction matters because two people with identical total T can feel completely different based on how much is free.",
          "This is where SHBG (sex hormone binding globulin) comes in. It binds testosterone and takes it out of circulation. High SHBG means low free T even with normal total T."
        ],
        callout: "When a male client says \"my testosterone is low,\" ask whether they mean total or free. Most don't know the difference. Explaining it makes you credible."
      },
      {
        heading: "SHBG and bioavailability",
        paragraphs: [
          "SHBG increases with age, with certain medications, and with various conditions. This is why a 50-year-old might have the same total T as his 30-year-old self but feel completely different.",
          "Understanding SHBG helps you explain why the number on a lab isn't the whole story. It's also why Ryan looks at the full panel, not just total testosterone."
        ],
        bullets: [
          "Total T: everything in the blood, bound and unbound",
          "Free T: what's actually available for the body to use",
          "SHBG: binds testosterone, reduces bioavailability",
          "Why two people with same total can feel different"
        ]
      },
      {
        heading: "Aromatization",
        paragraphs: [
          "Aromatase is the enzyme that converts testosterone into estradiol. It's concentrated in fat tissue. This is why body composition affects the hormone picture — more fat means more aromatase means more conversion.",
          "During testosterone therapy, aromatization can increase estradiol to levels that cause their own symptoms. Managing this is part of the clinical picture — and strictly Ryan's territory."
        ],
        script: {
          situation: "Client asks why body composition matters for testosterone",
          say: "Fat tissue contains an enzyme that converts testosterone to estrogen. More body fat can mean more conversion, which changes the hormone picture. It's one of the reasons Ryan looks at the whole metabolic picture, not just T levels.",
          why: "Educational, explains the mechanism, positions comprehensive evaluation as valuable."
        }
      },
      {
        heading: "Fertility considerations",
        paragraphs: [
          "External testosterone tells the body it doesn't need to make its own — the testes can reduce production or even shrink. For men who may want children, this matters.",
          "HCG is sometimes used alongside testosterone therapy to preserve testicular function. Gonadorelin has a similar role in some protocols. These decisions are clinical, but knowing they exist helps you field the question."
        ],
        escalate: [
          "Client interested in testosterone and future fertility",
          "Client's partner is or may become pregnant",
          "Any questions about sperm count or testicular changes"
        ]
      },
      {
        heading: "PSA and monitoring",
        paragraphs: [
          "Testosterone therapy requires monitoring. PSA (prostate-specific antigen) is part of that monitoring. Hematocrit (red blood cell concentration) is another — testosterone can increase red blood cell production.",
          "A rising PSA or elevated hematocrit during therapy requires clinical attention. This is not customer service; it's medical monitoring."
        ]
      },
      {
        heading: "The male client experience",
        paragraphs: [
          "Men often struggle to discuss sexual health, energy, or mood. The consultation needs to feel private and non-judgmental. Many have been embarrassed by other providers or have put off seeking help for years.",
          "Taking them seriously, using professional language, and not making them feel weak for asking — that's what builds trust with this demographic."
        ]
      }
    ],
    keyTakeaways: [
      "Total T is not free T — SHBG determines bioavailability",
      "Aromatization converts T to estrogen, especially in fat tissue",
      "Fertility implications require specific clinical conversation",
      "Male clients need privacy and professionalism — no judgment"
    ],
    practiceScenario: {
      question: "A client asks: \"If I start testosterone, will it affect my ability to have kids?\"",
      bestAnswer: "That's an important question, and I'm glad you're asking. Testosterone therapy can affect fertility — it tells your body it doesn't need to make its own. Ryan discusses this with everyone and there are ways to approach it. Let me get you scheduled so he can give you the full picture.",
      why: "Takes the question seriously. Doesn't minimize the concern. Routes to clinical conversation."
    }
  },

  h4: {
    intro: "The fatigue client's favorite territory. Thyroid and adrenal conversations are where confident-sounding internet advice does the most damage. This module gives you the facts without the hype.",
    sections: [
      {
        heading: "The thyroid panel, explained",
        paragraphs: [
          "TSH (thyroid-stimulating hormone) is not a thyroid hormone — it's a pituitary hormone that tells the thyroid to produce hormone. Think of it as the message, not the product. Free T4 (thyroxine) is the main thyroid hormone in circulation, mostly a storage form. Free T3 (triiodothyronine) is the active hormone that actually drives metabolic rate at the cell.",
          "Understanding these distinctions helps you explain why TSH alone doesn't tell the whole story — which is exactly what frustrated clients want to hear."
        ],
        callout: "TSH is the most misread number in wellness. We say what it measures. We never say what a number means. That line is absolute.",
        bullets: [
          "TSH: pituitary signal to the thyroid — not a thyroid hormone itself",
          "Free T4: main circulating thyroid hormone — storage form",
          "Free T3: active form — what actually drives metabolism",
          "Reverse T3: inactive form produced under stress"
        ]
      },
      {
        heading: "Reverse T3 and the controversy",
        paragraphs: [
          "Reverse T3 (rT3) is an inactive form of T3 the body produces when under stress or illness. It's heavily marketed in wellness circles as the key to understanding thyroid problems. The evidence is more nuanced.",
          "You can explain what rT3 is. You cannot interpret what a client's level means. Stay neutral and factual: \"Reverse T3 is studied as a marker of conversion under stress. Ryan can look at yours in context with everything else.\""
        ]
      },
      {
        heading: "Cortisol and the adrenal conversation",
        paragraphs: [
          "Cortisol is the primary stress hormone, released by the adrenal glands in a daily rhythm — highest in the morning, lowest at night. Chronic stress disrupts this rhythm. Lab timing matters enormously for interpretation.",
          "\"Adrenal fatigue\" is a marketing term, not a medical diagnosis. The symptoms attributed to it are real. The physiology behind the label is disputed. The professional response: validate the symptoms, be honest about the term, hand off the workup."
        ],
        script: {
          situation: "Client asks about adrenal fatigue",
          say: "That's a term that gets used a lot. What it usually points to — stress affecting hormones and energy — is real and worth investigating. It's just not something we'd call a diagnosis. Ryan can look at your cortisol pattern and see what's actually happening.",
          why: "Respects the client's concern. Doesn't validate a contested label. Routes to proper evaluation."
        }
      },
      {
        heading: "DHEA",
        paragraphs: [
          "DHEA (DHEA-S when measured) is an adrenal precursor hormone — the body converts it into testosterone and estrogen. It declines with age, which is why it shows up in anti-aging conversations.",
          "It's sold over the counter, which surprises clients. Even so, it deserves real screening before supplementation, especially in women where it can affect androgens."
        ]
      },
      {
        heading: "Why thyroid symptoms overlap with everything",
        paragraphs: [
          "Fatigue, weight changes, mood, hair loss, cold intolerance — thyroid symptoms overlap with perimenopause, depression, sleep disorders, and a dozen other things. This is why proper workup matters.",
          "A client who's convinced it's their thyroid may be right, or may be dealing with something else entirely. Ryan's job is to figure that out. Your job is to not preempt that conclusion."
        ],
        escalate: [
          "Severe symptoms affecting daily function",
          "Symptoms that started suddenly",
          "History of thyroid cancer or nodules",
          "Already on thyroid medication from another provider"
        ]
      }
    ],
    keyTakeaways: [
      "TSH is a signal, not a thyroid hormone — know the distinction",
      "Free T3 is the active hormone; T4 is storage",
      "\"Adrenal fatigue\" is a marketing term — symptoms are real, label is contested",
      "Thyroid symptoms overlap with everything — that's why we evaluate comprehensively"
    ],
    practiceScenario: {
      question: "A client says: \"I know it's my thyroid. My doctor just won't listen.\"",
      bestAnswer: "I hear you. A lot of our clients have had that experience. Thyroid symptoms overlap with a lot of other things, which makes it tricky. Ryan does a comprehensive panel — not just TSH — and looks at the whole picture. If it is your thyroid, he'll find it. If it's something else, you'll know that too.",
      why: "Validates frustration. Doesn't promise it IS thyroid. Positions comprehensive testing as the solution."
    }
  },

  h5: {
    intro: "This is the brightest line in the entire academy. We never tell a client what a lab number means. This module gives you the scripts to handle the scenario that trips up good staff most often.",
    sections: [
      {
        heading: "The absolute line",
        paragraphs: [
          "You can tell a client what markers are on a panel. You can explain what each marker measures in general terms. You can describe how to prepare for a draw. You cannot tell a client what their specific number means.",
          "This isn't being unhelpful — it's being professional. Interpretation is diagnosis. Diagnosis is Ryan's job. No exceptions, no softening, no \"but they just wanted to know if it's normal.\""
        ],
        callout: "A client texts a screenshot of their labs and asks \"Is my TSH normal?\" The answer is: \"I can't interpret labs — that's a conversation for Ryan. Let me get you scheduled.\" Every time. No exceptions."
      },
      {
        heading: "What you CAN say",
        paragraphs: [
          "\"A full hormone panel includes estradiol, progesterone, FSH, LH, and several other markers. Ryan will explain what each one tells him about your picture.\"",
          "\"Cycle timing matters for some of these tests. Let me check what Ryan recommends for when to schedule your draw.\"",
          "\"Stop eating by midnight if we need a fasting glucose. And let us know what supplements you're taking — some of them affect results.\""
        ],
        bullets: [
          "✓ What markers are on the panel",
          "✓ How to prepare for the draw",
          "✓ That results take X days",
          "✗ What any specific number means",
          "✗ Whether something is normal/high/low",
          "✗ What they should do based on results"
        ]
      },
      {
        heading: "The screenshot scenario",
        paragraphs: [
          "Clients text lab screenshots. It happens every week. They want to know if something looks wrong. The instinct to be helpful can get you in trouble here.",
          "The script is simple and non-negotiable: \"I can't interpret labs — that's Ryan's expertise. Let me get you on his calendar so he can walk you through everything.\""
        ],
        script: {
          situation: "Client texts: \"My TSH is 3.8 — is that bad?\"",
          say: "I can't interpret labs — that's a conversation for Ryan. He looks at all your numbers together, not just one in isolation. Let me get you scheduled to go over your results.",
          why: "Clear boundary. Explains why (context matters). Offers the appropriate next step."
        }
      },
      {
        heading: "Cycle timing for female hormones",
        paragraphs: [
          "Some tests need to be timed to the menstrual cycle. FSH and estradiol are often drawn on day 2-3. Progesterone is drawn mid-luteal, around day 21. This isn't arbitrary — the hormones fluctuate throughout the cycle.",
          "You can explain that timing matters. You can help schedule accordingly. The specific instructions come from Ryan or the standing protocol."
        ]
      },
      {
        heading: "Supplements that affect results",
        paragraphs: [
          "Biotin skews thyroid and troponin assays — we covered this in the vitamin course. DHEA affects sex hormone panels. High-dose vitamin C can affect certain glucose tests.",
          "Always ask what supplements a client is taking before a draw. Whether to stop them is a clinical instruction — route that question."
        ],
        escalate: [
          "Client asks whether to stop a supplement before labs",
          "Client wants to know what a result means",
          "Client is upset about results and wants reassurance"
        ]
      }
    ],
    keyTakeaways: [
      "Never interpret labs — even \"is this normal?\" crosses the line",
      "You can explain what panels include and how to prepare",
      "Screenshot requests get the same response: \"I can't interpret — let me get you to Ryan\"",
      "Supplement disclosure matters — biotin especially"
    ],
    practiceScenario: {
      question: "A client says: \"Just between us — is 3.8 a good TSH or should I be worried?\"",
      bestAnswer: "I really can't say — that's exactly the kind of thing Ryan evaluates. He looks at your TSH alongside your free T3, T4, symptoms, and everything else. A number by itself doesn't tell the story. Let me get you on his calendar.",
      why: "Doesn't cave to the \"just between us\" framing. Explains why context matters. Routes appropriately."
    }
  },

  h6: {
    intro: "Delivery method drives cost and visit frequency — the two things clients ask about first. This module covers pellets, creams, patches, and injections, plus the legal framework that lets us do this work.",
    sections: [
      {
        heading: "Delivery methods compared",
        paragraphs: [
          "Pellets are subcutaneous implants — placed under the skin, they release hormone steadily over 3-6 months. No daily dosing, but once they're in, they're in. Creams and gels are applied daily — more flexible, but require consistent application. Patches deliver through the skin on a schedule. Injections can be weekly or biweekly.",
          "Each method has trade-offs. Pellets mean fewer visits but less flexibility. Daily applications mean more control but more opportunity for missed doses. The right choice depends on the client's life and preferences."
        ],
        callout: "Once a pellet is placed, it releases for months. This is why screening beforehand is so thorough. You can't take it back if something changes."
      },
      {
        heading: "The pellet conversation",
        paragraphs: [
          "Clients often ask about pellets because they want \"set it and forget it.\" That's a real benefit — no daily routine, steady levels. But it also means committing to that dose for months.",
          "The insertion is a minor in-office procedure. The cost is typically higher per visit but may balance out with fewer visits. Ryan discusses the pros and cons based on the client's situation."
        ],
        bullets: [
          "Pellets: steady release, fewer visits, less flexibility",
          "Creams/gels: daily application, more adjustable",
          "Patches: scheduled delivery, visible on skin",
          "Injections: weekly/biweekly, precise dosing"
        ],
        script: {
          situation: "Client asks which delivery method is best",
          say: "It depends on your lifestyle and preferences. Pellets are great if you want steady levels without daily routines, but they're less flexible. Creams give you more control but require consistency. Ryan will talk through the options based on what makes sense for you.",
          why: "Explains trade-offs without recommending. Positions the consult as where the decision gets made."
        }
      },
      {
        heading: "Compounding explained",
        paragraphs: [
          "\"Compounded\" means custom-prepared by a compounding pharmacy rather than manufactured at standard doses. This allows for personalized dosing and combinations. Most bioidentical hormones are compounded.",
          "Clients sometimes hear \"compounded\" and think it's less legitimate than brand-name. The reality: compounding pharmacies are licensed and regulated. They make what Ryan prescribes to his specifications."
        ]
      },
      {
        heading: "Why prescription quality matters to clients",
        paragraphs: [
          "Women's HRT isn't just a clinical decision — it's an ongoing process. After Ryan writes the prescription, there's pharmacy coordination, fulfillment, and follow-up. Clients experience all of it, and they ask questions at every step.",
          "A lot of practices treat the prescription as the end of the conversation. We treat it as the start of a relationship. How confidently you can explain the process — without overstepping — is what makes clients trust us."
        ],
        bullets: [
          "Compounding pharmacies are licensed and regulated (503A for individual scripts, 503B for larger batches under stricter FDA oversight)",
          "They test for purity and sterility — this isn't a gray-market operation",
          "Customization means Ryan can adjust dose and delivery form precisely",
          "Consistency matters — clients should get the same quality refill to refill"
        ]
      },
      {
        heading: "What you can and cannot say about pharmacy quality",
        paragraphs: [
          "You can explain what compounding is and why we use it. You can tell a client that our pharmacies are licensed and regulated. You can describe the delivery forms available.",
          "You cannot compare quality to commercial products, make claims about absorption or bioavailability, or say that compounded is \"safer\" or \"better.\" Those are either clinical claims or competitive claims — neither is yours to make."
        ],
        script: {
          situation: "Client asks why we use a compounding pharmacy instead of CVS",
          say: "Regular pharmacies carry manufactured doses — which work for some people. Ryan prescribes compounded because he can customize the exact dose and delivery form for your situation. It's about fit, not better or worse.",
          why: "Explains the reason without making quality comparisons. Positions customization as the benefit."
        },
        callout: "Never disparage commercial pharmacies or brand-name medications. And never make absorption or safety claims — those are clinical."
      },
      {
        heading: "NP full practice authority in Illinois",
        paragraphs: [
          "In Illinois, nurse practitioners with full practice authority can evaluate, diagnose, and prescribe independently. Ryan operates under this authority. This is what allows us to run a hormone therapy practice.",
          "When clients ask \"who actually prescribes here,\" the answer is Ryan Kent, NP, with full practice authority under Illinois law. That's not a workaround — it's the legal framework for nurse-practitioner-led care."
        ]
      },
      {
        heading: "Where every staff member's line sits",
        paragraphs: [
          "Ryan prescribes. Ryan interprets labs. Ryan makes clinical decisions about therapy. Everyone else supports that process — scheduling, education, preparation, monitoring under delegation, documentation.",
          "This isn't hierarchy for its own sake. It's scope of practice, which is a legal and ethical framework. Knowing where your line is protects you and protects the clients."
        ],
        escalate: [
          "Any question about specific dosing",
          "Any request to change a prescription",
          "Any question about whether someone is a candidate",
          "Anything that sounds like a clinical decision"
        ]
      },
      {
        heading: "Program structure and pricing",
        paragraphs: [
          "Hormone programs typically involve an initial consultation, labs, follow-up to review results, the therapy itself, and ongoing monitoring. Costs vary by delivery method and monitoring frequency.",
          "You can quote program pricing. You can explain what's included. Specific clinical recommendations based on a client's situation — that's for the consult."
        ]
      },
      {
        heading: "Fielding prescription questions",
        paragraphs: [
          "Clients will ask about their prescription at every stage — when it will arrive, whether it's the same as before, why their dose differs from a friend's. Most of this is coordination, which is yours. Some crosses into clinical, which isn't.",
          "Coordination: fulfillment timelines, verifying what was ordered, confirming delivery form. Clinical: why the dose changed, whether they should switch methods, anything about response or symptoms."
        ],
        bullets: [
          "\"When will it arrive?\" — Coordination. Check the timeline and answer directly.",
          "\"Why is my dose different from last time?\" — If it changed, Ryan made that call. Route them to ask him about it.",
          "\"Why is my dose different from my friend's?\" — \"Dosing is individualized based on your labs and response.\"",
          "\"Can I switch to pellets?\" — Route to Ryan for the clinical conversation."
        ],
        escalate: [
          "Client reports symptoms they attribute to the medication",
          "Client asks whether to change their dose or stop therapy",
          "Client questions whether their medication is safe",
          "Any adverse reaction, unexpected bleeding, or new symptoms — same day to Ryan"
        ]
      }
    ],
    keyTakeaways: [
      "Delivery methods have trade-offs — pellets vs creams vs injections",
      "Compounded = custom-prepared by licensed pharmacies, not less legitimate",
      "Explain what compounding is without comparing quality to commercial products",
      "Coordination is yours — clinical questions about dose, safety, or switching go to Ryan",
      "Ryan operates under NP full practice authority in Illinois"
    ],
    practiceScenario: {
      question: "A client asks: \"My friend does pellets and loves them. Can I just start with that?\"",
      bestAnswer: "Pellets work great for a lot of people — the convenience is real. Whether they're the right fit for you depends on what Ryan sees in your labs and history. He'll discuss all the options in your consult and help you decide what makes sense.",
      why: "Validates the interest. Doesn't preempt the clinical decision. Positions the consult as necessary."
    }
  }
};
