'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  COURSES,
  COURSE_IDS,
  PEOPLE,
  CAN_DO,
  CANNOT_DO,
  SCRIPTS,
  ARTICLES,
  RESOURCES,
  STORAGE_KEY,
  getLessonForModule,
  type AcademyMode,
  type AcademySection,
  type AcademyProgress,
  type AcademyKnown,
  type AcademyReadSet,
  type Course,
  type Module,
  type Lesson,
} from '@/lib/academy';
import { ReconstitutionCalculator } from '@/components/admin/academy/ReconstitutionCalculator';

type ViewId = 'all' | 'danielle' | 'ryan' | 'michelle' | 'laura';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function AcademyClient() {
  const [courseId, setCourseId] = useState<string>('peptides');
  const [mode, setMode] = useState<AcademyMode>('curriculum');
  const [section, setSection] = useState<AcademySection>('course');
  const [view, setView] = useState<ViewId>('all');
  const [progress, setProgress] = useState<AcademyProgress>({});
  const [known, setKnown] = useState<AcademyKnown>({});
  const [readSet, setReadSet] = useState<AcademyReadSet>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  // Flashcard state
  const [deckCat, setDeckCat] = useState('All');
  const [deckOrder, setDeckOrder] = useState<number[]>([]);
  const [ci, setCi] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Quiz state
  const [quizOrder, setQuizOrder] = useState<number[]>([]);
  const [qi, setQi] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ qIdx: number; chosen: number; right: boolean }[]>([]);

  // Match state
  const [matchLeft, setMatchLeft] = useState<number[]>([]);
  const [matchRight, setMatchRight] = useState<number[]>([]);
  const [selA, setSelA] = useState<number | null>(null);
  const [matched, setMatched] = useState<Record<number, boolean>>({});
  const [tries, setTries] = useState(0);
  const [wrong, setWrong] = useState<{ a: number; b: number } | null>(null);

  // Triage state
  const [triOrder, setTriOrder] = useState<number[]>([]);
  const [ti, setTi] = useState(0);
  const [triPick, setTriPick] = useState<boolean | null>(null);
  const [triHits, setTriHits] = useState(0);
  const [triStreak, setTriStreak] = useState(0);
  const [triBest, setTriBest] = useState(0);

  // Article state
  const [articleId, setArticleId] = useState<string | null>(null);
  const [blogCat, setBlogCat] = useState('All');
  const [resCat, setResCat] = useState('All');
  
  // Resource content viewer state
  const [resourceViewId, setResourceViewId] = useState<string | null>(null);

  // Lesson viewer state
  const [lessonModule, setLessonModule] = useState<Module | null>(null);
  const lessonContent = lessonModule ? getLessonForModule(lessonModule.id) : null;

  const course = COURSES[courseId];

  // Load persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.progress) setProgress(saved.progress);
        if (saved.known) setKnown(saved.known);
        if (saved.readSet) setReadSet(saved.readSet);
        if (saved.view) setView(saved.view);
      }
    } catch {}
  }, []);

  // Save state
  const persist = useCallback(
    (updates: Partial<{ progress: AcademyProgress; known: AcademyKnown; readSet: AcademyReadSet; view: ViewId }>) => {
      const next = {
        progress: updates.progress ?? progress,
        known: updates.known ?? known,
        readSet: updates.readSet ?? readSet,
        view: updates.view ?? view,
      };
      if (updates.progress) setProgress(updates.progress);
      if (updates.known) setKnown(updates.known);
      if (updates.readSet) setReadSet(updates.readSet);
      if (updates.view) setView(updates.view);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
    },
    [progress, known, readSet, view]
  );

  // Reset course state when course changes
  const resetCourseState = useCallback(
    (c: Course) => {
      setDeckCat('All');
      setDeckOrder(c.deck.map((_, i) => i));
      setCi(0);
      setFlipped(false);
      setExpanded(null);
      setQuizOrder(c.quiz.map((_, i) => i));
      setQi(0);
      setChosen(null);
      setAnswers([]);
      const n = c.pairs.length;
      setMatchLeft(shuffle([...Array(n).keys()]));
      setMatchRight(shuffle([...Array(n).keys()]));
      setSelA(null);
      setMatched({});
      setTries(0);
      setWrong(null);
      setTriOrder(shuffle([...Array(c.triage.length).keys()]));
      setTi(0);
      setTriPick(null);
      setTriHits(0);
      setTriStreak(0);
      setTriBest(0);
    },
    []
  );

  useEffect(() => {
    resetCourseState(course);
  }, [courseId, course, resetCourseState]);

  // Progress helpers
  const isDone = (personId: string, moduleId: string) => !!(progress[personId]?.[moduleId]);
  const statsFor = (personId: string, cid: string) => {
    const mods = COURSES[cid].modules;
    const done = mods.filter((m) => isDone(personId, m.id)).length;
    return { done, total: mods.length, pct: mods.length ? Math.round((done / mods.length) * 100) : 0 };
  };

  const toggleModule = (personId: string, moduleId: string) => {
    const next = { ...progress };
    const mine = { ...(next[personId] || {}) };
    if (mine[moduleId]) delete mine[moduleId];
    else mine[moduleId] = true;
    next[personId] = mine;
    persist({ progress: next });
  };

  // Overall stats
  let allDone = 0,
    allTotal = 0;
  PEOPLE.forEach((p) =>
    COURSE_IDS.forEach((cid) => {
      const s = statsFor(p.id, cid);
      allDone += s.done;
      allTotal += s.total;
    })
  );

  // Current course stats
  let cDone = 0,
    cTotal = 0;
  PEOPLE.forEach((p) => {
    const s = statsFor(p.id, courseId);
    cDone += s.done;
    cTotal += s.total;
  });

  // Flashcard helpers
  const deckList = () => {
    return deckOrder.filter((i) => deckCat === 'All' || course.deck[i].cat === deckCat);
  };
  const moveCard = (dir: number) => {
    const list = deckList();
    if (!list.length) return;
    setCi((ci + dir + list.length) % list.length);
    setFlipped(false);
  };

  // Quiz helpers
  const chooseAnswer = (i: number) => {
    if (chosen !== null || !course.quiz) return;
    const qIdx = quizOrder[qi];
    const q = course.quiz[qIdx];
    if (i >= q.options.length) return;
    setChosen(i);
    setAnswers([...answers, { qIdx, chosen: i, right: i === q.correct }]);
  };
  const nextQ = () => {
    setQi(qi + 1);
    setChosen(null);
  };
  const restartQuiz = (subset?: number[]) => {
    setQuizOrder(subset && subset.length ? subset : course.quiz.map((_, i) => i));
    setQi(0);
    setChosen(null);
    setAnswers([]);
  };

  // Match helpers
  const pickLeft = (pi: number) => {
    if (matched[pi]) return;
    setSelA(pi);
    setWrong(null);
  };
  const pickRight = (pi: number) => {
    if (matched[pi] || selA === null) return;
    if (selA === pi) {
      setMatched({ ...matched, [pi]: true });
      setSelA(null);
      setTries(tries + 1);
      setWrong(null);
    } else {
      setWrong({ a: selA, b: pi });
      setTries(tries + 1);
      setTimeout(() => {
        setWrong(null);
        setSelA(null);
      }, 650);
    }
  };

  // Triage helpers
  const triAnswer = (route: boolean) => {
    const item = course.triage[triOrder[ti]];
    const right = route === item.route;
    const streak = right ? triStreak + 1 : 0;
    setTriPick(route);
    setTriHits(triHits + (right ? 1 : 0));
    setTriStreak(streak);
    setTriBest(Math.max(triBest, streak));
  };
  const triNext = () => {
    setTi(ti + 1);
    setTriPick(null);
  };

  const inCourse = section === 'course';
  const cats = ['All', ...course.deck.map((d) => d.cat).filter((x, i, arr) => arr.indexOf(x) === i)];
  const dlist = deckList();
  const currentCard = dlist.length ? course.deck[dlist[Math.min(ci, dlist.length - 1)]] : course.deck[0];
  const knownCount = course.deck.filter((d) => known[courseId + '|' + d.name]).length;

  const qTotal = quizOrder.length;
  const quizFinished = qTotal > 0 && qi >= qTotal;
  const correctCount = answers.filter((a) => a.right).length;

  const solvedCount = Object.keys(matched).length;
  const matchWon = solvedCount === course.pairs.length && course.pairs.length > 0;

  const triTotal = triOrder.length;
  const triFinished = triTotal > 0 && ti >= triTotal;

  const isAll = view === 'all';
  const person = PEOPLE.find((p) => p.id === view);
  const ps = isAll ? { done: cDone, total: cTotal, pct: cTotal ? Math.round((cDone / cTotal) * 100) : 0 } : statsFor(view, courseId);

  // Article helpers
  const art = articleId ? ARTICLES.find((a) => a.id === articleId) : null;
  const artIdx = art ? ARTICLES.indexOf(art) : -1;

  // Resource content definitions for in-app views
  const RESOURCE_CONTENT: Record<string, { title: string; sections: { heading: string; content: string[]; callout?: string; list?: string[] }[] }> = {
    'handout-peptides': {
      title: "Peptides: what they are, what they're not",
      sections: [
        {
          heading: 'What is a peptide?',
          content: [
            'Peptides are short chains of amino acids — the same building blocks your body uses to make proteins. Think of them like words spelled with letters from a 20-letter alphabet.',
            'Your body already makes peptides naturally. Insulin is a peptide. Oxytocin is a peptide. GLP-1, the hormone that makes you feel satisfied after eating, is a peptide.',
          ],
        },
        {
          heading: 'How do they work?',
          content: [
            'Peptides work by binding to receptors on your cells — like a key fitting a lock. When the fit is right, the receptor activates and tells the cell to do something specific.',
            'Different peptides fit different receptors, which is why they have specific effects. A peptide that signals growth won\'t accidentally trigger something unrelated.',
          ],
        },
        {
          heading: 'What peptides are NOT',
          content: [
            'Peptides are not steroids. Steroids are a completely different class of molecule with different mechanisms and different considerations.',
            'Peptides are not magic bullets. They work best when the rest of your health picture — sleep, stress, nutrition — is also addressed.',
          ],
          callout: 'The peptides we offer are prescribed by our nurse practitioner after a full medical evaluation. This is not the same as buying something from a website.',
        },
        {
          heading: 'The research question',
          content: [
            'Some peptides are FDA-approved for specific uses. Others are "research-use-only" — meaning they\'ve been studied in labs and trials, but aren\'t approved to treat conditions.',
            'When we say something is "studied for" tissue repair or metabolism, that\'s accurate. When anyone says it "treats" or "cures" something, that\'s a claim we can\'t make.',
          ],
        },
      ],
    },
    'handout-glp1': {
      title: 'Your GLP-1 program: what to expect',
      sections: [
        {
          heading: 'How GLP-1 medications work',
          content: [
            'GLP-1 (glucagon-like peptide-1) is a hormone your gut naturally releases after eating. It signals satiety, helps regulate insulin, and slows stomach emptying.',
            'Semaglutide and tirzepatide mimic this signal — they\'re GLP-1 receptor agonists. They don\'t suppress appetite by willpower; they change the hunger signals themselves.',
          ],
        },
        {
          heading: 'The titration phase',
          content: [
            'Your program starts at a lower dose and gradually increases. This is called titration. It gives your body time to adjust and minimizes side effects.',
            'Don\'t be discouraged if the first few weeks feel subtle. The titration phase is about tolerance, not maximum effect.',
          ],
        },
        {
          heading: 'What to expect: side effects',
          content: [
            'Nausea is common, especially early on. It usually improves as your body adjusts. Eating smaller meals and avoiding very fatty foods helps.',
            'Constipation can happen. Stay hydrated and maintain fiber intake.',
          ],
          callout: 'If you experience persistent vomiting, severe abdominal pain, or any concerning symptoms, contact us immediately. Don\'t adjust your dose on your own.',
        },
        {
          heading: 'Protecting your muscle',
          content: [
            'Weight loss includes muscle loss unless you actively work to preserve it. This is critical.',
            'Protein intake needs to increase during weight loss. Resistance training (lifting, bands, bodyweight work) preserves lean mass.',
            'We monitor body composition, not just scale weight. Losing 30 pounds of which 10 is muscle is not the goal.',
          ],
          list: [
            'Aim for high protein at every meal',
            'Include resistance training 2-3x per week',
            'Don\'t skip meals — eat enough to fuel your training',
            'Follow up appointments matter for tracking composition',
          ],
        },
      ],
    },
    'handout-labs': {
      title: 'Preparing for your hormone lab draw',
      sections: [
        {
          heading: 'Timing matters',
          content: [
            'For most hormone panels, timing in your cycle matters. Day 3 estrogen and FSH tell us something different than day 21 progesterone.',
            'If you\'re not cycling regularly or are postmenopausal, timing is less critical — but fasting still applies for some markers.',
          ],
        },
        {
          heading: 'Fasting guidelines',
          content: [
            'For comprehensive metabolic panels that include glucose and lipids, fast for 8-12 hours before your draw. Water is fine.',
            'For hormone-only panels, fasting is usually not required — but confirm with us when you book.',
          ],
        },
        {
          heading: 'The biotin question',
          content: [
            'Biotin — found in nearly every hair, skin, and nail supplement — interferes with lab tests. It can make thyroid results look abnormal when they\'re not.',
            'We ask about biotin at every booking. If you\'re taking it, we need to know before we schedule your draw.',
          ],
          callout: 'Tell us about any supplements you\'re taking, especially hair/skin/nail formulas. What seems harmless can distort your results.',
        },
        {
          heading: 'Other considerations',
          content: [
            'Avoid intense exercise the morning of your draw — it can temporarily affect hormone levels.',
            'If you\'re on hormone therapy already, we may want to draw at a specific time relative to your last dose. Ask when booking.',
          ],
        },
      ],
    },
    'handout-recovery': {
      title: 'Post-procedure recovery and skincare',
      sections: [
        {
          heading: 'General principles',
          content: [
            'Your skin has just been treated. It\'s in repair mode. The goal now is to support that process, not pile on active ingredients.',
            'Keep it simple: gentle cleanser, hydration, sun protection. That\'s it for the first several days.',
          ],
        },
        {
          heading: 'What to avoid',
          content: [
            'No retinoids, acids (glycolic, salicylic, etc.), or exfoliants until cleared.',
            'No direct sun exposure. SPF is non-negotiable during recovery.',
            'Avoid makeup on treated areas for at least 24-48 hours.',
          ],
        },
        {
          heading: 'Where peptide skincare fits',
          content: [
            'GHK-Cu (copper peptide) is studied for collagen support and wound healing. It\'s a topical peptide that acts locally on the skin.',
            'Post-procedure, topical peptides can support the repair process. We\'ll tell you when to introduce them and which products to use.',
          ],
          callout: 'Don\'t start any new products without asking us first. Your skin is more sensitive during recovery and what\'s normally fine might cause irritation.',
        },
        {
          heading: 'Timeline expectations',
          content: [
            'Redness and sensitivity are normal for several days after most procedures.',
            'Full results take time — collagen remodeling continues for weeks to months after treatment.',
            'Patience is part of the protocol.',
          ],
        },
      ],
    },
    'sop-preinfusion': {
      title: 'Pre-infusion screening checklist',
      sections: [
        {
          heading: 'Run this every single visit',
          content: [
            'A client who was fine three weeks ago may have started a new medication. May have had a health event. May be pregnant now.',
            'The screen catches what\'s changed — and it\'s why we run it every visit, not just the first one.',
          ],
        },
        {
          heading: 'The checklist',
          content: [],
          list: [
            'Blood pressure and vitals check',
            'Full health history review (or update from last visit)',
            'Current medications — anything new or changed?',
            'Allergies and prior reactions review',
            'Pregnancy or breastfeeding status',
            'Kidney, heart, and liver considerations',
            'Hydration status and recent labs when relevant',
          ],
        },
        {
          heading: 'Automatic stops',
          content: [
            'If any of the following come up, stop and get Ryan before proceeding:',
          ],
          list: [
            'New cardiac symptoms (chest pain, shortness of breath, palpitations)',
            'New or worsening kidney/liver concerns',
            'Possible pregnancy',
            'New allergy to any ingredient in today\'s infusion',
            'Currently on blood thinners and didn\'t disclose last time',
          ],
          callout: 'When in doubt, pause and ask. No infusion is worth a safety miss.',
        },
      ],
    },
    'sop-reaction': {
      title: 'Infusion reaction response protocol',
      sections: [
        {
          heading: 'If a client reports symptoms during infusion',
          content: [
            'This is the sequence we all rehearse. It\'s not optional and it\'s not judgment-call territory.',
          ],
        },
        {
          heading: 'Step 1: Stop the infusion',
          content: [
            'Immediately pause or slow the drip. Don\'t wait to assess first — stop, then assess.',
          ],
        },
        {
          heading: 'Step 2: Assess the client',
          content: [
            'Ask what they\'re feeling. Common symptoms: chest tightness, flushing, nausea, cramping, difficulty breathing.',
            'Take vitals if trained to do so.',
          ],
        },
        {
          heading: 'Step 3: Notify Ryan',
          content: [
            'Get Ryan immediately. Not "in a few minutes" — now.',
            'Describe what the client reported and what you observed.',
          ],
        },
        {
          heading: 'Step 4: Document',
          content: [
            'Time of symptom onset, what was reported, what was observed, what actions were taken.',
            'Document in real time, not from memory later.',
          ],
          callout: 'Reporting a symptom is never something we smooth over. Every reaction gets documented and reviewed.',
        },
      ],
    },
    'sop-hormones': {
      title: 'Hormone panel ordering and timing',
      sections: [
        {
          heading: 'Standard female hormone panel',
          content: [
            'The core markers: Estradiol (E2), Progesterone, FSH, LH, Total and Free Testosterone, DHEA-S, TSH, Free T3, Free T4.',
            'Add-ons based on presentation: Cortisol AM, Prolactin, SHBG, Vitamin D.',
          ],
        },
        {
          heading: 'Cycle timing for premenopausal women',
          content: [
            'Day 3 (±1): Estradiol, FSH, LH — tells us about ovarian reserve and baseline',
            'Day 21 (or 7 days post-ovulation): Progesterone — confirms ovulation',
            'Testosterone, DHEA-S, thyroid: any day is fine',
          ],
          callout: 'If she\'s not cycling regularly, document where she is and note it on the order. Irregular cycles don\'t prevent testing — they just change interpretation.',
        },
        {
          heading: 'What distorts results',
          content: [],
          list: [
            'Biotin: affects thyroid immunoassays — ask about hair/skin/nail supplements',
            'Time of day: cortisol is highest in the morning',
            'Recent intense exercise: temporarily affects multiple hormones',
            'Oral contraceptives: dramatically change baseline hormones',
            'HRT timing: draw at consistent time relative to last dose',
          ],
        },
        {
          heading: 'Men\'s testosterone panel',
          content: [
            'Total Testosterone, Free Testosterone, SHBG, Estradiol, PSA, CBC, CMP.',
            'Draw in the morning (before 10am) when testosterone is highest.',
            'If already on TRT, draw at trough (before next dose) for monitoring.',
          ],
        },
      ],
    },
    'sop-redflags': {
      title: 'Red flag routing matrix',
      sections: [
        {
          heading: 'Universal stops — route to Ryan immediately',
          content: [
            'These apply across all programs. If any of these come up, the conversation stops and goes to Ryan before anything else happens.',
          ],
          list: [
            'Pregnancy or trying to conceive',
            'Breastfeeding',
            'Personal history of breast, uterine, or ovarian cancer',
            'Personal history of blood clots (DVT, PE)',
            'Active liver disease',
            'Uncontrolled hypertension',
            'Type 1 diabetes or uncontrolled Type 2',
            'Active eating disorder',
          ],
        },
        {
          heading: 'GLP-1 specific stops',
          content: [],
          list: [
            'Personal or family history of medullary thyroid carcinoma',
            'MEN2 syndrome',
            'History of pancreatitis',
            'Gallbladder disease or prior cholecystectomy',
            'Already on a GLP-1 from another provider',
            'Prior bariatric surgery',
          ],
        },
        {
          heading: 'Hormone therapy specific stops',
          content: [],
          list: [
            'Unexplained vaginal bleeding',
            'History of stroke',
            'Migraine with aura (for estrogen)',
            'Known thrombophilia',
          ],
        },
        {
          heading: 'IV therapy specific stops',
          content: [],
          list: [
            'Kidney disease or on dialysis',
            'Heart failure',
            'G6PD deficiency (for high-dose vitamin C)',
            'Known allergy to any ingredient',
          ],
          callout: 'When in doubt, route. It\'s never wrong to pause and ask Ryan.',
        },
      ],
    },
    'sop-sourcing': {
      title: 'Peptide sourcing and storage',
      sections: [
        {
          heading: 'Where our products come from',
          content: [
            'All compounded peptides come from licensed 503B compounding pharmacies. These facilities are FDA-inspected and follow cGMP (current Good Manufacturing Practice) standards.',
            'Each batch comes with a certificate of analysis verifying purity and potency.',
          ],
        },
        {
          heading: 'Why this matters',
          content: [
            'Gray-market peptides have real quality issues: no third-party testing, no sterility guarantee, potential contamination, dosing inconsistency.',
            'Our sourcing is the difference between "it might be what it says" and "it is what it says, tested and verified."',
          ],
        },
        {
          heading: 'Storage requirements',
          content: [],
          list: [
            'Refrigerated (2-8°C) upon receipt',
            'Protected from light',
            'Never frozen — freezing damages molecular structure',
            'Reconstituted products: refrigerated, use within labeled window',
          ],
        },
        {
          heading: 'Lot verification',
          content: [
            'Each lot is logged when received. The log includes: pharmacy source, lot number, expiration date, certificate of analysis reference, who received it.',
            'If a client ever asks where their product came from, we can trace it.',
          ],
          callout: 'Never use a product past its expiration or reconstituted stability window. When in doubt, discard and reorder.',
        },
      ],
    },
    'sop-delegation': {
      title: 'Standing orders and delegation',
      sections: [
        {
          heading: 'Illinois NP authority',
          content: [
            'In Illinois, nurse practitioners with full practice authority can prescribe independently — including controlled substances and compounded medications.',
            'Ryan holds this authority. He evaluates, prescribes, and monitors without requiring physician co-signature.',
          ],
        },
        {
          heading: 'What staff CAN do',
          content: [],
          list: [
            'Provide educational information about what peptides are and what they\'re studied for',
            'Quote pricing and explain program structure',
            'Book consultations and follow-ups',
            'Run pre-infusion screening checklists',
            'Administer IV infusions under standing orders (trained staff only)',
            'Document visit notes and observations',
          ],
        },
        {
          heading: 'What staff CANNOT do',
          content: [],
          list: [
            'Recommend a specific treatment or peptide for a client',
            'Interpret lab results',
            'Adjust doses or timing',
            'Advise on medication interactions',
            'Make suitability determinations',
            'Diagnose any condition',
          ],
          callout: 'The bright line: educate and route. Never diagnose, prescribe, or promise.',
        },
        {
          heading: 'When to escalate',
          content: [
            'Any clinical question. Any safety concern. Any symptom report. Any request for medical advice.',
            'If a client asks something you\'re not sure about, the answer is always: "Let me get Ryan to answer that."',
          ],
        },
      ],
    },
    'scripts-phone': {
      title: 'Front desk phone scripts',
      sections: [
        {
          heading: 'The four questions you route, not answer',
          content: [
            'Some questions sound simple but are actually clinical. These four always go to Ryan:',
          ],
          list: [
            '"Is this right for me?" — Suitability is a medical evaluation.',
            '"What dose should I take?" — Dosing is prescribing.',
            '"What do my labs mean?" — Lab interpretation is clinical.',
            '"Will this help my [condition]?" — Treatment claims are medical.',
          ],
        },
        {
          heading: 'Pricing questions',
          content: [
            'You CAN quote pricing. That\'s not clinical.',
          ],
          callout: '"Our GLP-1 programs start at $299/month for semaglutide, which includes the medication, Ryan\'s oversight, and follow-up. Tirzepatide starts at $375/month. The initial consult is $150 and applies to your first month if you move forward."',
        },
        {
          heading: 'Availability and booking',
          content: [
            'Standard booking script:',
          ],
          callout: '"I can get you scheduled for a consult with Ryan. He\'ll do a full evaluation and discuss what might make sense for your goals. Would [day/time] work for you?"',
        },
        {
          heading: 'When they push for more',
          content: [
            'If they want clinical answers before booking:',
          ],
          callout: '"I can tell you about how the program works and what it costs, but whether it\'s right for you specifically is what Ryan evaluates in the consult. That\'s the whole point of the visit — to get you a real answer, not a guess."',
        },
      ],
    },
    'scripts-dm': {
      title: 'DM and social reply library',
      sections: [
        {
          heading: '"How much does it cost?"',
          content: [
            'Pricing is fair game. Be specific.',
          ],
          callout: '"Great question! Our GLP-1 programs start at $299/mo (semaglutide) or $375/mo (tirzepatide), medication included. IV drips start at $150, vitamin shots are $25. DM us to book or call 630-636-6193!"',
        },
        {
          heading: '"Is this safe?"',
          content: [
            'Route to consult — but warmly.',
          ],
          callout: '"Safety depends on your individual health picture, which is why we do a full medical evaluation before any program. Ryan (our NP) screens everyone personally. Want me to help you book a consult?"',
        },
        {
          heading: '"My friend got great results..."',
          content: [
            'Validate without endorsing.',
          ],
          callout: '"Love to hear that! Everyone responds a bit differently, which is why we build programs around your specific goals and health history. Want to see what Ryan recommends for you?"',
        },
        {
          heading: '"Can you help me with [condition]?"',
          content: [
            'Never claim to treat conditions.',
          ],
          callout: '"I can\'t speak to treating specific conditions — that\'s a medical conversation. What I can tell you is that Ryan evaluates everyone individually and discusses what options might make sense. Worth a consult if you\'re curious!"',
        },
        {
          heading: '"Where do your peptides come from?"',
          content: [
            'Sourcing is a strength — explain it.',
          ],
          callout: '"All our compounded medications come from licensed 503B pharmacies — FDA-inspected facilities that follow pharmaceutical manufacturing standards. Ryan prescribes, they compound, we dispense. It\'s not the same as buying from a website."',
        },
      ],
    },
    'scripts-objections': {
      title: 'Objection and pushback responses',
      sections: [
        {
          heading: '"I can get it cheaper online"',
          content: [
            'Don\'t disparage what they\'ve found. Explain the difference.',
          ],
          callout: '"I hear you — there are definitely cheaper options out there. The difference with us is sourcing and oversight. Our products come from licensed compounding pharmacies with testing and sterility standards, and Ryan screens everyone medically before prescribing. You\'re not just paying for a molecule — you\'re paying for the assurance it\'s what it says and someone qualified is watching your response."',
        },
        {
          heading: '"My friend\'s doctor just prescribed it without all this"',
          content: [
            'Don\'t criticize other providers.',
          ],
          callout: '"Every provider has their own approach. Ours includes the full evaluation and ongoing monitoring because that\'s how we get the best outcomes — and honestly, it protects you. We\'re not here to be the fastest; we\'re here to do it right."',
        },
        {
          heading: '"I\'ve done my research and I know what I want"',
          content: [
            'Respect their knowledge. Still route to Ryan.',
          ],
          callout: '"That\'s great — an informed client is the best kind. Ryan will appreciate that you\'ve done your homework. The consult lets him look at your specific situation and confirm whether what you\'re thinking makes sense for you, or if there\'s something that might work even better."',
        },
        {
          heading: '"Can\'t you just tell me if it works?"',
          content: [
            'Be honest about why you can\'t.',
          ],
          callout: '"I can tell you what it\'s studied for and how our program works, but whether it\'ll work for you specifically — that\'s what Ryan evaluates. I wouldn\'t want to guess when he can give you a real answer."',
        },
      ],
    },
    'brand-compliance': {
      title: 'Compliant copy guidelines',
      sections: [
        {
          heading: 'The core rule',
          content: [
            'Every word we publish should work if a regulator reads it. "Studied for" is education. "Treats" or "cures" is a medical claim we can\'t make.',
          ],
        },
        {
          heading: 'Words to use',
          content: [],
          list: [
            '"Studied for" — accurate for research compounds',
            '"Supports" — general support language',
            '"Many clients report" — anecdotal framing',
            '"Under medical supervision" — positions oversight',
            '"May help with" — possibility, not promise',
          ],
        },
        {
          heading: 'Words to avoid',
          content: [],
          list: [
            '"Treats" / "cures" / "heals" — medical claims',
            '"Guaranteed results" — outcome promises',
            '"Safe" without context — safety is individual',
            '"Better than [competitor]" — comparative claims',
            '"Anti-aging" as a treatment claim',
          ],
        },
        {
          heading: 'Before-and-after rules',
          content: [
            'Only use images with signed photo releases.',
            'Include disclaimers about individual results.',
            'Never imply typical or guaranteed outcomes.',
          ],
          callout: 'When in doubt, run it by Laura before posting. A pulled post is better than a compliance letter.',
        },
      ],
    },
    'brand-kit': {
      title: 'Brand kit — logos, colors, fonts',
      sections: [
        {
          heading: 'Primary colors',
          content: [
            'Hot pink: #E6007E (primary accent)',
            'Hot pink gradient: from #FF2D8E to #E6007E',
            'Soft pink: #FFB8DC (text on dark)',
            'Rose wash: #FFF0F7 (backgrounds)',
            'Black: #000000 (borders, text)',
            'Dark hero gradient: from #0a0a0a via #1a0510 to #2d1020',
          ],
        },
        {
          heading: 'Logo usage',
          content: [
            'Primary: White badge logo on dark backgrounds',
            'Secondary: Black badge logo on light backgrounds',
            'Never stretch, rotate, or alter proportions',
            'Minimum clear space: height of the "H" on all sides',
          ],
        },
        {
          heading: 'Typography',
          content: [
            'Headlines: System font stack, font-black weight',
            'Body: System font stack, normal weight',
            'Accent text: Uppercase tracking-widest for labels',
          ],
        },
        {
          heading: 'The Hello Gorgeous stamp',
          content: [
            'Our signature visual: rounded-3xl cards with border-4 border-black and shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]',
            'This pink shadow "stamp" effect is brand-defining. Use it on feature cards and callouts.',
          ],
          callout: 'The bold black borders and hot pink accents define the HG look. Don\'t swap them for gray corporate minimal.',
        },
      ],
    },
    'ref-evidence': {
      title: 'Peptide evidence tiers',
      sections: [
        {
          heading: 'FDA-approved',
          content: [
            'Clinical trials with human safety and efficacy data.',
            'Approved label specifies what it\'s approved for.',
            'Examples: semaglutide (Ozempic/Wegovy), tirzepatide (Mounjaro/Zepbound), PT-141/bremelanotide (Vyleesi).',
          ],
          callout: 'We can reference FDA approval for the labeled indication. Off-label use is legal for prescribers but changes how we talk about it.',
        },
        {
          heading: 'Compounded from licensed pharmacy',
          content: [
            '503A: patient-specific compounding, requires individual prescription.',
            '503B: outsourcing facilities, can prepare batches, stricter FDA oversight.',
            'Both use pharmaceutical-grade ingredients and follow quality standards.',
          ],
        },
        {
          heading: 'Research-use-only (RUO)',
          content: [
            'Not FDA-approved for human therapeutic use.',
            'Studied in labs and trials, but no approved indication.',
            'Examples: BPC-157, TB-500, Semax, Selank.',
          ],
          callout: 'RUO = educational discussion only. "Studied for" is compliant. "Treats" or "cures" is not.',
        },
        {
          heading: 'Language that matches evidence',
          content: [
            'FDA-approved: "approved for" the labeled indication.',
            'Compounded: "prescribed by Ryan, prepared by a licensed pharmacy."',
            'RUO: "studied for" — never "proven," "treats," or "cures."',
          ],
        },
      ],
    },
    'ref-glp1-sides': {
      title: 'GLP-1 side effects and escalation',
      sections: [
        {
          heading: 'Common side effects',
          content: [],
          list: [
            'Nausea — especially early in titration, usually improves',
            'Constipation — encourage hydration and fiber',
            'Decreased appetite — expected effect, not a side effect',
            'Fatigue — can happen during adjustment',
            'Injection site reactions — mild redness, usually resolves',
          ],
        },
        {
          heading: 'When to route to Ryan immediately',
          content: [],
          list: [
            'Persistent or severe vomiting',
            'Severe abdominal pain',
            'Signs of pancreatitis (severe pain radiating to back)',
            'Signs of gallbladder issues (right upper quadrant pain)',
            'Hypoglycemia symptoms in diabetics',
            'Any symptom that concerns you',
          ],
        },
        {
          heading: 'The message template',
          content: [
            'When a client reports side effects:',
          ],
          callout: '"Thanks for letting us know — [acknowledge what they said]. I\'m going to loop in Ryan so he can advise you on next steps. Don\'t change anything until you hear from him. He\'ll get back to you [timeframe]."',
        },
        {
          heading: 'What you don\'t do',
          content: [],
          list: [
            'Don\'t advise them to lower their dose',
            'Don\'t tell them it\'s "normal" and they should push through',
            'Don\'t suggest OTC remedies for side effects',
            'Don\'t reassure them without Ryan\'s input',
          ],
        },
      ],
    },
    'ref-nad-prep': {
      title: 'NAD+ appointment prep call',
      sections: [
        {
          heading: 'Why this call matters',
          content: [
            'NAD+ is our longest and most uncomfortable appointment. Almost every complaint we\'ve ever gotten was about unmet expectations, not the product.',
            'A 4-minute prep call turns "nobody told me" into "I was ready for this."',
          ],
        },
        {
          heading: 'The script',
          content: [],
          callout: '"Two things before Thursday: block out the afternoon rather than an hour, and eat a real meal beforehand. Some people feel tightness or cramping while it runs — that\'s normal and it\'s about the speed, so tell us the second you feel it and Ryan will adjust. Bring headphones."',
        },
        {
          heading: 'Key points to hit',
          content: [],
          list: [
            'It takes longer than other drips — plan for it',
            'Eat beforehand — empty stomach makes everything worse',
            'Chest tightness, cramping, flushing are common',
            'Symptoms are usually about infusion speed',
            'Tell us immediately if you feel anything — we adjust',
            'Bring something to do',
          ],
        },
        {
          heading: 'After a previous reaction',
          content: [
            'If a client mentions they had symptoms at a previous appointment, that goes to Ryan before rebooking.',
            'Don\'t reassure them it was nothing. Don\'t book and hope for the best. Route to Ryan.',
          ],
        },
      ],
    },
    'ref-np-authority': {
      title: 'Illinois NP prescriptive authority',
      sections: [
        {
          heading: 'The legal basis',
          content: [
            'In Illinois, nurse practitioners with full practice authority can prescribe independently — including controlled substances and compounded medications.',
            'This is state law, not a workaround. Ryan holds this authority.',
          ],
        },
        {
          heading: 'What this means',
          content: [
            'Ryan can evaluate, prescribe, and monitor without requiring physician co-signature.',
            'He can prescribe compounded peptides from 503B pharmacies.',
            'He can prescribe controlled substances (with DEA registration).',
            'He functions as an independent medical provider.',
          ],
        },
        {
          heading: 'When clients ask',
          content: [],
          callout: '"Yes — in Illinois, nurse practitioners with full practice authority can prescribe independently, including compounded medications. Ryan does the full evaluation, writes the prescription, and monitors your progress. It\'s the same medical oversight you\'d get from any prescriber."',
        },
        {
          heading: 'The oversight model',
          content: [
            'What makes us different from a website isn\'t just sourcing — it\'s oversight.',
            'Ryan screens every patient, reviews history, evaluates contraindications, prescribes appropriately, and monitors response.',
            '"Medically supervised" isn\'t marketing — it\'s the practice model.',
          ],
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-gray-50">
      {/* Ambient wash */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,45,142,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(230,0,126,0.08),transparent)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-br from-[#0a0a0a] via-[#1a0510] to-[#2d1020] border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Image src="/academy/logo-full.png" alt="RE GEN Academy" width={160} height={40} className="h-10 w-auto" />
              <span className="text-white/90 text-sm">Hello Gorgeous · Staff Training</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/85 text-sm">Team progress</span>
              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] transition-all" style={{ width: `${allTotal ? Math.round((allDone / allTotal) * 100) : 0}%` }} />
              </div>
              <span className="text-white font-medium">{allTotal ? Math.round((allDone / allTotal) * 100) : 0}%</span>
            </div>
          </div>

          {/* Course tabs + Library tabs */}
          <div className="flex items-center gap-2">
            {COURSE_IDS.map((id) => (
              <button
                key={id}
                onClick={() => {
                  setCourseId(id);
                  setSection('course');
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: inCourse && courseId === id ? '#fff' : 'rgba(255,255,255,0.08)',
                  color: inCourse && courseId === id ? '#000' : 'rgba(255,255,255,0.92)',
                }}
              >
                {COURSES[id].label}
                <span className="ml-2 text-xs opacity-85">{COURSES[id].meta}</span>
              </button>
            ))}
            <div className="w-px h-6 bg-white/20 mx-2" />
            <button
              onClick={() => {
                setSection('blog');
                setArticleId(null);
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: section === 'blog' ? '#fff' : 'rgba(255,255,255,0.08)',
                color: section === 'blog' ? '#000' : 'rgba(255,255,255,0.92)',
              }}
            >
              Journal<span className="ml-2 text-xs opacity-85">{ARTICLES.length}</span>
            </button>
            <button
              onClick={() => setSection('resources')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: section === 'resources' ? '#fff' : 'rgba(255,255,255,0.08)',
                color: section === 'resources' ? '#000' : 'rgba(255,255,255,0.92)',
              }}
            >
              Resources<span className="ml-2 text-xs opacity-85">{RESOURCES.reduce((n, g) => n + g.items.length, 0)}</span>
            </button>
            <button
              onClick={() => setSection('tools')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: section === 'tools' ? '#fff' : 'rgba(255,255,255,0.08)',
                color: section === 'tools' ? '#000' : 'rgba(255,255,255,0.92)',
              }}
            >
              Tools<span className="ml-2 text-xs opacity-85">1</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mode tabs for courses */}
      {inCourse && (
        <nav className="bg-white/70 backdrop-blur border-b-2 border-black/10 sticky top-[108px] z-40">
          <div className="max-w-7xl mx-auto px-4 flex gap-1 py-2">
            {(['curriculum', 'cards', 'quiz', 'match', 'triage', 'guardrails'] as AcademyMode[]).map((m) => {
              const labels: Record<AcademyMode, string> = { curriculum: 'Curriculum', cards: 'Flashcards', quiz: 'Quiz', match: 'Match', triage: 'Triage', guardrails: 'Guardrails' };
              const counts: Record<AcademyMode, string> = {
                curriculum: String(course.modules.length),
                cards: String(course.deck.length),
                quiz: String(course.quiz?.length || 0),
                match: String(course.pairs.length),
                triage: String(course.triage.length),
                guardrails: '★',
              };
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all border-b-2"
                  style={{
                    borderColor: mode === m ? '#FF2D8E' : 'transparent',
                    color: mode === m ? '#000' : 'rgba(0,0,0,0.72)',
                  }}
                >
                  {labels[m]}
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: mode === m ? '#FF2D8E' : 'rgba(0,0,0,0.07)',
                      color: mode === m ? '#fff' : 'rgba(0,0,0,0.72)',
                    }}
                  >
                    {counts[m]}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Course content */}
        {inCourse && mode === 'curriculum' && (
          <div className="space-y-8">
            {/* Course hero */}
            <div className="rounded-3xl bg-gradient-to-br from-[#0a0a0a] via-[#1a0510] to-[#2d1020] p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <div className="text-[#FFB8DC] text-sm uppercase tracking-widest mb-2">{course.eyebrow}</div>
              <h1 className="text-4xl font-black text-white mb-4" style={{ color: '#fff' }}>{course.headline}</h1>
              <p className="text-white/95 max-w-3xl mb-6">{course.intro}</p>
              <div className="flex gap-6">
                {course.stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-black text-[#FF2D8E]">{s.n}</div>
                    <div className="text-white/85 text-sm">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <h2 className="text-2xl font-bold mb-6">{course.goalsHeading}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {course.goals.map((g) => (
                  <div key={g.num} className="flex gap-4 p-4 rounded-xl bg-rose-50 border-2 border-black/10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-white font-bold flex items-center justify-center">{g.num}</div>
                    <div>
                      <div className="font-bold">{g.title}</div>
                      <div className="text-sm text-black/85">{g.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Red flags */}
            <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <h2 className="text-xl font-bold text-[#E6007E] mb-4">{course.flagsHeading}</h2>
              <div className="grid md:grid-cols-2 gap-2">
                {course.flags.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-[#E6007E]">▸</span>
                    {f.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Team progress */}
            <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{isAll ? `All ${course.modules.length} modules` : person?.name}</h2>
                  <p className="text-black/80 text-sm">{isAll ? 'Pick a name to check modules off' : `${person?.role} · all ${ps.total} modules assigned`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-3 bg-black/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E]" style={{ width: `${ps.pct}%` }} />
                  </div>
                  <span className="font-bold">{ps.done}/{ps.total}</span>
                </div>
              </div>

              {/* View tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {(['all', ...PEOPLE.map((p) => p.id)] as ViewId[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => persist({ view: v })}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all border-2"
                    style={{
                      background: view === v ? '#000' : 'transparent',
                      color: view === v ? '#fff' : '#000',
                      borderColor: view === v ? '#000' : 'rgba(0,0,0,0.15)',
                    }}
                  >
                    {v === 'all' ? 'Whole team' : PEOPLE.find((p) => p.id === v)?.first}
                  </button>
                ))}
              </div>

              {/* Modules */}
              <div className="space-y-4">
                {course.modules.map((m) => {
                  const checked = !isAll && isDone(view, m.id);
                  const isOpen = expanded === m.id;
                  return (
                    <div
                      key={m.id}
                      className="rounded-2xl p-6 border-2 transition-all"
                      style={{
                        borderColor: checked ? '#FF2D8E' : '#000',
                        background: '#fff',
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => (isAll ? setExpanded(isOpen ? null : m.id) : toggleModule(view, m.id))}
                          className="w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all"
                          style={{
                            background: checked ? '#FF2D8E' : '#fff',
                            borderColor: checked ? '#FF2D8E' : '#000',
                            color: checked ? '#fff' : '#000',
                          }}
                        >
                          {checked && '✓'}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white">{m.num}</span>
                            <span className="text-xs text-black/80">{m.tag}</span>
                          </div>
                          <h3 className="font-bold text-lg" style={{ color: checked ? 'rgba(0,0,0,0.45)' : '#000' }}>{m.title}</h3>
                          <p className="text-sm text-black/85 mt-1">{m.blurb}</p>

                          {isOpen && (
                            <div className="mt-4 pt-4 border-t border-black/10">
                              <ul className="space-y-2 mb-4">
                                {m.bullets.map((b, i) => (
                                  <li key={i} className="flex gap-2 text-sm">
                                    <span className="text-[#E6007E]">•</span>
                                    {b}
                                  </li>
                                ))}
                              </ul>
                              <div className="bg-rose-50 rounded-xl p-4 text-sm">
                                <div className="font-bold text-[#E6007E] mb-1">Maps to: {m.mapsTo}</div>
                                <div className="text-black/85">{m.mapsWhy}</div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-4 mt-3">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setLessonModule(m);
                              }} 
                              className="text-sm font-bold text-[#E6007E] hover:underline"
                            >
                              Open lesson →
                            </button>
                            <button onClick={() => setExpanded(isOpen ? null : m.id)} className="text-sm text-black/80 hover:underline">
                              {isOpen ? 'Hide objectives −' : 'What you\'ll learn +'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Flashcards mode */}
        {inCourse && mode === 'cards' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-br from-[#0a0a0a] via-[#1a0510] to-[#2d1020] p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <h2 className="text-3xl font-black text-white mb-2">{course.deckHeadline}</h2>
              <p className="text-white/90 mb-4">{course.deck.length} flashcards · {knownCount} marked as known</p>

              {/* Category filter */}
              <div className="flex gap-2 flex-wrap mb-6">
                {cats.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setDeckCat(c);
                      setCi(0);
                      setFlipped(false);
                    }}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all border-2"
                    style={{
                      background: deckCat === c ? '#FF2D8E' : 'transparent',
                      color: deckCat === c ? '#fff' : 'rgba(255,255,255,0.92)',
                      borderColor: deckCat === c ? '#FF2D8E' : 'rgba(255,255,255,0.25)',
                    }}
                  >
                    {c === 'All' ? `All ${course.deck.length}` : c}
                  </button>
                ))}
              </div>

              {/* Card */}
              <div
                className="rounded-2xl p-8 min-h-[320px] cursor-pointer transition-all border-4"
                style={{
                  background: currentCard.caution ? '#FFFBEB' : '#fff',
                  borderColor: currentCard.caution ? '#FFD700' : '#FF2D8E',
                }}
                onClick={() => setFlipped(!flipped)}
              >
                {!flipped ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-xs uppercase tracking-wider text-black/70 mb-2">{currentCard.cat}</div>
                    <h3 className="text-3xl font-black mb-2">{currentCard.name}</h3>
                    <div className="text-black/80">{currentCard.alias}</div>
                    <div className="mt-6 text-sm text-black/70">Click to flip</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-black/70 mb-1">What it is</div>
                      <p>{currentCard.what}</p>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-black/70 mb-1">What it&apos;s studied for</div>
                      <p>{currentCard.studied}</p>
                    </div>
                    <div
                      className="rounded-xl p-4 border-2"
                      style={{
                        borderColor: currentCard.caution ? '#FFD700' : '#000',
                        background: currentCard.caution ? 'rgba(255,215,0,0.12)' : '#FFF5F9',
                      }}
                    >
                      <div className="text-xs uppercase tracking-wider mb-1" style={{ color: currentCard.caution ? '#9a7400' : '#E6007E' }}>
                        {currentCard.caution ? 'High caution — read this one twice' : 'How we talk about it'}
                      </div>
                      <p className="text-sm">{currentCard.note}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-white/85 text-sm">Card {Math.min(ci + 1, dlist.length)} of {dlist.length}</div>
                <div className="flex gap-2">
                  <button onClick={() => moveCard(-1)} className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">← Previous</button>
                  <button
                    onClick={() => {
                      const o = shuffle(course.deck.map((_, i) => i));
                      setDeckOrder(o);
                      setCi(0);
                      setFlipped(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    Shuffle
                  </button>
                  <button onClick={() => moveCard(1)} className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">Next →</button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const k = { ...known, [courseId + '|' + currentCard.name]: true };
                      persist({ known: k });
                      moveCard(1);
                    }}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all"
                  >
                    Know it ✓
                  </button>
                  <button
                    onClick={() => {
                      const k = { ...known };
                      delete k[courseId + '|' + currentCard.name];
                      persist({ known: k });
                      moveCard(1);
                    }}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    Review again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz mode */}
        {inCourse && mode === 'quiz' && (
          <div className="max-w-3xl mx-auto">
            {!quizFinished && qTotal > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-black/80">Question {qi + 1} of {qTotal}</span>
                  <span className="font-bold text-[#FF2D8E]">Score: {correctCount}</span>
                </div>
                <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] transition-all" style={{ width: `${Math.round((qi / qTotal) * 100)}%` }} />
                </div>

                {(() => {
                  const q = course.quiz[quizOrder[qi]];
                  return (
                    <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                      <div className="text-xs uppercase tracking-wider text-black/70 mb-2">{q.cat}</div>
                      <h3 className="text-xl font-bold mb-6">{q.q}</h3>

                      <div className="space-y-3">
                        {q.options.map((o, i) => {
                          const isCorrect = i === q.correct;
                          const isChosen = chosen === i;
                          const revealed = chosen !== null;

                          let bg = '#fff',
                            border = 'rgba(0,0,0,0.15)',
                            textColor = '#000';
                          if (revealed) {
                            if (isCorrect) {
                              bg = 'rgba(22,163,74,0.07)';
                              border = '#16a34a';
                            } else if (isChosen) {
                              bg = 'rgba(220,38,38,0.06)';
                              border = '#dc2626';
                            } else {
                              border = 'rgba(0,0,0,0.1)';
                              textColor = 'rgba(0,0,0,0.65)';
                            }
                          }

                          return (
                            <button
                              key={i}
                              onClick={() => chooseAnswer(i)}
                              disabled={revealed}
                              className="w-full text-left p-4 rounded-xl border-2 transition-all"
                              style={{ background: bg, borderColor: border, color: textColor, cursor: revealed ? 'default' : 'pointer' }}
                            >
                              <div className="flex items-start gap-3">
                                <span
                                  className="w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 font-bold text-sm"
                                  style={{
                                    background: revealed && isCorrect ? '#16a34a' : revealed && isChosen ? '#dc2626' : '#fff',
                                    color: revealed && (isCorrect || isChosen) ? '#fff' : '#000',
                                    borderColor: revealed && isCorrect ? '#16a34a' : revealed && isChosen ? '#dc2626' : '#000',
                                  }}
                                >
                                  {i + 1}
                                </span>
                                <div className="flex-1">
                                  <div style={{ fontWeight: isCorrect && revealed ? 600 : 400 }}>{o.t}</div>
                                  {revealed && (
                                    <div className="mt-2 text-sm" style={{ color: isCorrect ? '#16a34a' : isChosen ? '#dc2626' : 'rgba(0,0,0,0.55)' }}>
                                      <span className="font-bold">{isCorrect ? 'Correct' : 'Why not'}:</span> {o.w}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {chosen !== null && (
                        <div className="mt-6 flex justify-end">
                          <button onClick={nextQ} className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white font-bold hover:opacity-90 transition-all">
                            {qi + 1 >= qTotal ? 'See my results' : 'Next question'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : quizFinished ? (
              <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <h2 className="text-3xl font-black mb-2">Quiz complete</h2>
                <div className="text-6xl font-black text-[#FF2D8E] mb-4">{correctCount}/{answers.length}</div>
                <p className="text-black/85 mb-6">
                  {Math.round((correctCount / answers.length) * 100) >= 90
                    ? "Sharp. You could take one of these questions cold at the front desk today."
                    : Math.round((correctCount / answers.length) * 100) >= 70
                    ? "Solid grasp — the misses below are the ones that create real risk, so read them twice."
                    : "Worth another pass. Every miss below is a conversation that could happen this week."}
                </p>

                {answers.filter((a) => !a.right).length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-3">Questions to review:</h3>
                    <div className="space-y-3">
                      {answers
                        .filter((a) => !a.right)
                        .map((a) => {
                          const q = course.quiz[a.qIdx];
                          return (
                            <div key={a.qIdx} className="p-4 rounded-xl bg-red-50 border border-red-200">
                              <div className="text-xs text-red-600 mb-1">{q.cat}</div>
                              <div className="font-medium">{q.q}</div>
                              <div className="text-sm text-black/85 mt-2">
                                <span className="text-red-600">You chose:</span> {q.options[a.chosen].t}
                              </div>
                              <div className="text-sm text-black/85">
                                <span className="text-green-600">Correct:</span> {q.options[q.correct].t}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => restartQuiz()} className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white font-bold hover:opacity-90 transition-all">
                    Start over
                  </button>
                  {answers.filter((a) => !a.right).length > 0 && (
                    <button
                      onClick={() => restartQuiz(answers.filter((a) => !a.right).map((a) => a.qIdx))}
                      className="px-6 py-3 rounded-xl border-2 border-black font-bold hover:bg-black/5 transition-all"
                    >
                      Drill my {answers.filter((a) => !a.right).length} misses
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Match mode */}
        {inCourse && mode === 'match' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{course.matchHeadline}</h2>
                  <p className="text-black/80">Match each item on the left with its description</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-black/80">Solved: {solvedCount}/{course.pairs.length}</span>
                  <span className="text-black/80">Attempts: {tries}</span>
                </div>
              </div>

              {!matchWon ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    {matchLeft.map((pi) => {
                      const done = !!matched[pi];
                      const sel = selA === pi;
                      const isWrong = wrong && wrong.a === pi;
                      return (
                        <button
                          key={pi}
                          onClick={() => pickLeft(pi)}
                          className="w-full text-left p-4 rounded-xl border-2 transition-all"
                          style={{
                            borderColor: done ? '#FF2D8E' : isWrong ? '#dc2626' : sel ? '#000' : 'rgba(0,0,0,0.15)',
                            background: done ? '#FF2D8E' : sel ? '#000' : '#fff',
                            color: done || sel ? '#fff' : '#000',
                            opacity: done ? 0.55 : 1,
                            cursor: done ? 'default' : 'pointer',
                            animation: isWrong ? 'pulse 0.3s ease-in-out 2' : 'none',
                          }}
                        >
                          {course.pairs[pi].a}
                        </button>
                      );
                    })}
                  </div>
                  <div className="space-y-2">
                    {matchRight.map((pi) => {
                      const done = !!matched[pi];
                      const isWrong = wrong && wrong.b === pi;
                      return (
                        <button
                          key={pi}
                          onClick={() => pickRight(pi)}
                          className="w-full text-left p-4 rounded-xl border-2 transition-all"
                          style={{
                            borderColor: done ? '#FF2D8E' : isWrong ? '#dc2626' : 'rgba(0,0,0,0.15)',
                            background: done ? '#FF2D8E' : '#fff',
                            color: done ? '#fff' : '#000',
                            opacity: done ? 0.55 : 1,
                            cursor: done ? 'default' : 'pointer',
                            animation: isWrong ? 'pulse 0.3s ease-in-out 2' : 'none',
                          }}
                        >
                          {course.pairs[pi].b}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl font-black text-[#FF2D8E] mb-4">All matched!</div>
                  <p className="text-black/85 mb-6">
                    {tries === course.pairs.length
                      ? `Perfect round — ${tries} attempts, zero misses. That's mastery.`
                      : `All ${course.pairs.length} matched in ${tries} attempts. A clean round is ${course.pairs.length}.`}
                  </p>
                  <button onClick={() => resetCourseState(course)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white font-bold hover:opacity-90 transition-all">
                    Play again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Triage mode */}
        {inCourse && mode === 'triage' && (
          <div className="max-w-3xl mx-auto">
            {!triFinished && triTotal > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-black/80">Situation {ti + 1} of {triTotal}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">Score: {triHits}/{ti + (triPick !== null ? 1 : 0)}</span>
                    <span className="text-black/80">Streak: {triStreak}</span>
                  </div>
                </div>

                {(() => {
                  const item = course.triage[triOrder[ti]];
                  const right = triPick !== null && triPick === item.route;

                  return (
                    <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                      <p className="text-2xl font-medium mb-8">{item.text}</p>

                      {triPick === null ? (
                        <div className="grid md:grid-cols-2 gap-4">
                          <button
                            onClick={() => triAnswer(false)}
                            className="p-6 rounded-xl border-2 border-black hover:bg-black hover:text-white transition-all text-center"
                          >
                            <div className="text-3xl mb-2">💬</div>
                            <div className="font-bold">I can answer this</div>
                            <div className="text-sm text-black/80">Education, logistics, or policy</div>
                          </button>
                          <button
                            onClick={() => triAnswer(true)}
                            className="p-6 rounded-xl border-2 border-[#FF2D8E] hover:bg-[#FF2D8E] hover:text-white transition-all text-center"
                          >
                            <div className="text-3xl mb-2">🏥</div>
                            <div className="font-bold">Route to Ryan</div>
                            <div className="text-sm text-black/80">Clinical, safety, or suitability</div>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div
                            className="text-2xl font-bold text-center py-4 rounded-xl"
                            style={{ color: right ? '#16a34a' : '#FF2D8E', background: right ? 'rgba(22,163,74,0.1)' : 'rgba(255,45,142,0.1)' }}
                          >
                            {right ? 'Right call.' : 'Careful — other way.'}
                          </div>
                          <div className="p-4 rounded-xl bg-black/5">
                            <div className="font-bold mb-1">Correct answer: {item.route ? 'Route to Ryan' : "You've got this"}</div>
                            <p className="text-black/85">{item.why}</p>
                          </div>
                          <button onClick={triNext} className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white font-bold hover:opacity-90 transition-all">
                            {ti + 1 >= triTotal ? 'See my score' : 'Next situation'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : triFinished ? (
              <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] text-center">
                <h2 className="text-3xl font-black mb-2">Triage complete</h2>
                <div className="text-6xl font-black text-[#FF2D8E] mb-4">{triHits}/{triTotal}</div>
                <p className="text-black/85 mb-6">
                  {triHits === triTotal
                    ? `Flawless. Best streak ${triBest}. You can run the front desk on this alone.`
                    : triHits >= triTotal - 2
                    ? `Strong instincts. Best streak ${triBest} — the misses are the subtle ones, so revisit them.`
                    : `This is the drill worth repeating weekly. Best streak ${triBest}.`}
                </p>
                <button onClick={() => resetCourseState(course)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white font-bold hover:opacity-90 transition-all">
                  Try again
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Guardrails mode */}
        {inCourse && mode === 'guardrails' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <h2 className="text-2xl font-bold mb-6">What you can do</h2>
              <div className="space-y-2">
                {CAN_DO.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <h2 className="text-2xl font-bold mb-6">What you cannot do</h2>
              <div className="space-y-2">
                {CANNOT_DO.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-200">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <h2 className="text-2xl font-bold mb-6">Scripts that work</h2>
              <div className="space-y-4">
                {SCRIPTS.map((s, i) => (
                  <div key={i} className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                    <div className="text-sm font-bold text-[#E6007E] mb-2">When: {s.when}</div>
                    <blockquote className="text-lg italic mb-2">&ldquo;{s.say}&rdquo;</blockquote>
                    <div className="text-sm text-black/85">Why it works: {s.why}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <h2 className="text-xl font-bold text-[#E6007E] mb-4">{course.flagsHeading}</h2>
              <div className="grid md:grid-cols-2 gap-2">
                {course.flags.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-[#E6007E]">▸</span>
                    {f.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Journal/Blog section */}
        {section === 'blog' && !art && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black">Journal</h1>
              <span className="text-black/80">{Object.keys(readSet).length} / {ARTICLES.length} read</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              {['All', ...ARTICLES.map((a) => a.cat).filter((x, i, arr) => arr.indexOf(x) === i)].map((c) => (
                <button
                  key={c}
                  onClick={() => setBlogCat(c)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all border-2"
                  style={{
                    background: blogCat === c ? '#000' : 'transparent',
                    color: blogCat === c ? '#fff' : '#000',
                    borderColor: blogCat === c ? '#000' : 'rgba(0,0,0,0.15)',
                  }}
                >
                  {c === 'All' ? `All ${ARTICLES.length}` : c}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {ARTICLES.filter((a) => blogCat === 'All' || a.cat === blogCat).map((a) => (
                <button
                  key={a.id}
                  onClick={() => setArticleId(a.id)}
                  className="text-left p-6 rounded-2xl bg-white border-2 transition-all hover:shadow-lg"
                  style={{ borderColor: a.pinned ? '#FF2D8E' : '#000' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-black/10">{a.cat}</span>
                    {a.pinned && <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#FF2D8E] text-white">Pinned</span>}
                    {readSet[a.id] && <span className="text-xs text-green-600">✓ Read</span>}
                  </div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: readSet[a.id] ? 'rgba(0,0,0,0.5)' : '#000' }}>{a.title}</h3>
                  <p className="text-sm text-black/85 mb-3">{a.dek}</p>
                  <div className="text-xs text-black/70">{a.author} · {a.date} · {a.read} read</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Article view */}
        {section === 'blog' && art && (
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setArticleId(null)} className="text-[#E6007E] hover:underline mb-6">← Back to Journal</button>

            <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-black/10">{art.cat}</span>
                {art.pinned && <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#FF2D8E] text-white">Pinned</span>}
              </div>

              <h1 className="text-3xl font-black mb-2">{art.title}</h1>
              <p className="text-xl text-black/85 mb-4">{art.dek}</p>
              <div className="text-sm text-black/70 mb-8">{art.author} · {art.date} · {art.read} read</div>

              <div className="prose max-w-none">
                {art.body.map((block, i) => {
                  if ('h' in block) return <h2 key={i} className="text-xl font-bold mt-8 mb-4">{block.h}</h2>;
                  if ('p' in block) return <p key={i} className="mb-4">{block.p}</p>;
                  if ('quote' in block) return <blockquote key={i} className="border-l-4 border-[#FF2D8E] pl-4 italic my-4">{block.quote}</blockquote>;
                  if ('callout' in block) return <div key={i} className="p-4 rounded-xl bg-rose-50 border border-[#FF2D8E] my-4">{block.callout}</div>;
                  if ('list' in block) return (
                    <ul key={i} className="list-disc pl-6 space-y-2 my-4">
                      {block.list.map((item, j) => <li key={j}>{item.text}</li>)}
                    </ul>
                  );
                  return null;
                })}
              </div>

              <div className="mt-8 pt-8 border-t border-black/10 flex items-center justify-between">
                <button
                  onClick={() => {
                    const r = { ...readSet };
                    if (r[art.id]) delete r[art.id];
                    else r[art.id] = true;
                    persist({ readSet: r });
                  }}
                  className="px-4 py-2 rounded-lg border-2 font-medium transition-all"
                  style={{
                    background: readSet[art.id] ? '#FF2D8E' : 'transparent',
                    color: readSet[art.id] ? '#fff' : '#000',
                    borderColor: readSet[art.id] ? '#FF2D8E' : '#000',
                  }}
                >
                  {readSet[art.id] ? '✓ Marked as read' : 'Mark as read'}
                </button>

                <button
                  onClick={() => {
                    if (artIdx >= 0 && artIdx + 1 < ARTICLES.length) setArticleId(ARTICLES[artIdx + 1].id);
                    else setArticleId(null);
                  }}
                  className="text-[#E6007E] hover:underline"
                >
                  {artIdx >= 0 && artIdx + 1 < ARTICLES.length ? `Next: ${ARTICLES[artIdx + 1].title} →` : 'Back to all articles →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resources section */}
        {section === 'resources' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black">Resources</h1>
              <div className="text-black/80">
                {RESOURCES.reduce((n, g) => n + g.items.filter((i) => i.href).length, 0)} live ·{' '}
                {RESOURCES.reduce((n, g) => n + g.items.filter((i) => !i.href).length, 0)} pending
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {['All', ...RESOURCES.map((g) => g.name)].map((c) => (
                <button
                  key={c}
                  onClick={() => setResCat(c)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all border-2"
                  style={{
                    background: resCat === c ? '#000' : 'transparent',
                    color: resCat === c ? '#fff' : '#000',
                    borderColor: resCat === c ? '#000' : 'rgba(0,0,0,0.15)',
                  }}
                >
                  {c === 'All' ? 'Everything' : c}
                </button>
              ))}
            </div>

            {RESOURCES.filter((g) => resCat === 'All' || g.name === resCat).map((group) => (
              <div key={group.name} className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <h2 className="text-xl font-bold mb-1">{group.name}</h2>
                <p className="text-sm text-black/80 mb-6">{group.note}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  {group.items.map((item, i) => {
                    const live = !!item.href;
                    const typeColors: Record<string, [string, string]> = {
                      PDF: ['#000', '#fff'],
                      DOC: ['#FFC1E2', '#000'],
                      SHEET: ['#FFD86B', '#000'],
                      ZIP: ['rgba(0,0,0,0.08)', '#000'],
                      LINK: ['#FF2D8E', '#fff'],
                    };
                    const [bg, fg] = typeColors[item.type] || ['#000', '#fff'];

                    return (
                      <div
                        key={i}
                        className="p-4 rounded-xl border-2 transition-all"
                        style={{
                          borderColor: live ? '#000' : 'rgba(0,0,0,0.22)',
                          borderStyle: live ? 'solid' : 'dashed',
                          background: live ? '#fff' : 'rgba(255,255,255,0.55)',
                          cursor: live ? 'pointer' : 'default',
                        }}
                        onClick={() => {
                          if (!live) return;
                          if (item.href === '#tools') {
                            setSection('tools');
                          } else if (item.href.startsWith('#')) {
                            const contentId = item.href.slice(1);
                            if (RESOURCE_CONTENT[contentId]) {
                              setResourceViewId(contentId);
                            }
                          } else {
                            window.open(item.href, '_blank');
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold">{item.title}</h3>
                          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: bg, color: fg }}>{item.type}</span>
                        </div>
                        <p className="text-sm text-black/85 mb-2">{item.desc}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-black/70">{item.owner} · {live ? item.updated : 'Awaiting file'}</span>
                          <span style={{ color: live ? '#FF2D8E' : 'rgba(0,0,0,0.55)' }}>
                            {live ? (item.external ? 'Public site ↗' : 'Open →') : 'Placeholder'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tools section */}
        {section === 'tools' && (
          <ReconstitutionCalculator />
        )}
      </main>

      {/* Resource Content Viewer Modal */}
      {resourceViewId && RESOURCE_CONTENT[resourceViewId] && (
        <div className="fixed inset-0 z-[100] overflow-auto bg-black/60 backdrop-blur-sm">
          <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
              {/* Resource Header */}
              <div className="rounded-t-3xl bg-gradient-to-br from-[#0a0a0a] via-[#1a0510] to-[#2d1020] p-8 border-4 border-black border-b-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-[#FFB8DC] uppercase tracking-widest mb-2">Resource</div>
                    <h1 className="text-3xl font-black text-white" style={{ color: '#fff' }}>{RESOURCE_CONTENT[resourceViewId].title}</h1>
                  </div>
                  <button
                    onClick={() => setResourceViewId(null)}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Resource Content */}
              <div className="bg-white rounded-b-3xl border-4 border-black border-t-0 p-8">
                <div className="space-y-8">
                  {RESOURCE_CONTENT[resourceViewId].sections.map((section, sIdx) => (
                    <div key={sIdx}>
                      <h2 className="text-xl font-bold text-[#E6007E] mb-4">{section.heading}</h2>
                      
                      {section.content.map((p, pIdx) => (
                        <p key={pIdx} className="text-base leading-relaxed text-black/90 mb-4">{p}</p>
                      ))}

                      {section.list && section.list.length > 0 && (
                        <div className="my-4 space-y-2">
                          {section.list.map((item, iIdx) => (
                            <div key={iIdx} className="flex gap-3">
                              <span className="text-[#E6007E] mt-1">•</span>
                              <span className="text-base text-black/90">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.callout && (
                        <div className="my-6 p-4 rounded-xl bg-rose-50 border-2 border-[#E6007E]">
                          <p className="text-sm font-medium text-black/85">{section.callout}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-10 pt-6 border-t-2 border-black/10 flex items-center justify-end">
                  <button
                    onClick={() => setResourceViewId(null)}
                    className="px-6 py-3 rounded-xl border-2 border-black font-bold hover:bg-black hover:text-white transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Viewer Modal */}
      {lessonModule && lessonContent && (
        <div className="fixed inset-0 z-[100] overflow-auto bg-black/60 backdrop-blur-sm">
          <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
              {/* Lesson Header */}
              <div className="rounded-t-3xl bg-gradient-to-br from-[#0a0a0a] via-[#1a0510] to-[#2d1020] p-8 border-4 border-black border-b-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white">{lessonModule.num}</span>
                      <span className="text-sm text-[#FFB8DC]">{lessonModule.tag}</span>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2" style={{ color: '#fff' }}>{lessonModule.title}</h1>
                    <p className="text-white/95">{lessonModule.blurb}</p>
                  </div>
                  <button
                    onClick={() => setLessonModule(null)}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="bg-white rounded-b-3xl border-4 border-black border-t-0 p-8">
                {/* Intro */}
                <p className="text-lg leading-relaxed text-black/90 mb-8 pb-8 border-b-2 border-black/10">{lessonContent.intro}</p>

                {/* Sections */}
                <div className="space-y-10">
                  {lessonContent.sections.map((section, sIdx) => (
                    <div key={sIdx}>
                      <h2 className="text-xl font-bold text-[#E6007E] mb-4">{section.heading}</h2>
                      
                      {/* Paragraphs */}
                      <div className="space-y-4 mb-4">
                        {section.paragraphs.map((p, pIdx) => (
                          <p key={pIdx} className="text-base leading-relaxed text-black/90">{p}</p>
                        ))}
                      </div>

                      {/* Callout */}
                      {section.callout && (
                        <div className="my-6 p-4 rounded-xl bg-rose-50 border-2 border-[#E6007E]">
                          <p className="text-sm font-medium text-black/85">{section.callout}</p>
                        </div>
                      )}

                      {/* Bullets */}
                      {section.bullets && section.bullets.length > 0 && (
                        <div className="my-4 space-y-2">
                          {section.bullets.map((b, bIdx) => (
                            <div key={bIdx} className="flex gap-3">
                              <span className="text-[#E6007E] mt-1.5">•</span>
                              <span className="text-base text-black/90">{b}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Script */}
                      {section.script && (
                        <div className="my-6 rounded-xl bg-gradient-to-br from-[#0a0a0a] to-[#1a0510] p-5 border-2 border-black">
                          <div className="text-xs uppercase tracking-wider mb-2">
                            <span className="text-[#FFB8DC]">When:</span>{' '}
                            <span className="text-white/90">{section.script.situation}</span>
                          </div>
                          <div className="text-white text-base italic mb-3">&ldquo;{section.script.say}&rdquo;</div>
                          <div className="text-sm">
                            <span className="text-[#FFB8DC]">Why it works:</span>{' '}
                            <span className="text-white/95">{section.script.why}</span>
                          </div>
                        </div>
                      )}

                      {/* Escalate */}
                      {section.escalate && section.escalate.length > 0 && (
                        <div className="my-6 p-4 rounded-xl bg-amber-50 border-2 border-amber-400">
                          <div className="text-xs uppercase tracking-wider text-amber-700 font-bold mb-2">Route to Ryan immediately</div>
                          <div className="space-y-1">
                            {section.escalate.map((e, eIdx) => (
                              <div key={eIdx} className="flex gap-2 text-sm text-amber-900">
                                <span>▸</span>
                                <span>{e}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Key Takeaways */}
                <div className="mt-10 pt-8 border-t-2 border-black/10">
                  <h2 className="text-lg font-bold mb-4">Key Takeaways</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {lessonContent.keyTakeaways.map((t, tIdx) => (
                      <div key={tIdx} className="flex gap-3 p-3 rounded-lg bg-rose-50">
                        <span className="text-[#E6007E] font-bold">✓</span>
                        <span className="text-sm text-black/90">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practice Scenario */}
                {lessonContent.practiceScenario && (
                  <div className="mt-8 rounded-xl border-2 border-black p-6 bg-gradient-to-br from-white to-rose-50">
                    <div className="text-xs uppercase tracking-wider text-[#E6007E] font-bold mb-3">Practice Scenario</div>
                    <p className="text-base font-medium text-black mb-4">{lessonContent.practiceScenario.question}</p>
                    <div className="p-4 rounded-lg bg-white border border-black/10 mb-3">
                      <div className="text-xs uppercase tracking-wider text-green-600 font-bold mb-2">Best Answer</div>
                      <p className="text-sm text-black/90">{lessonContent.practiceScenario.bestAnswer}</p>
                    </div>
                    <p className="text-xs text-black/85"><span className="font-bold">Why:</span> {lessonContent.practiceScenario.why}</p>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="mt-10 pt-6 border-t-2 border-black/10 flex items-center justify-between gap-4 flex-wrap">
                  {!isAll && (
                    <button
                      onClick={() => {
                        toggleModule(view, lessonModule.id);
                      }}
                      className="px-6 py-3 rounded-xl font-bold transition-all"
                      style={{
                        background: isDone(view, lessonModule.id) ? '#FF2D8E' : '#000',
                        color: '#fff',
                      }}
                    >
                      {isDone(view, lessonModule.id) ? '✓ Completed' : 'Mark as Complete'}
                    </button>
                  )}
                  <button
                    onClick={() => setLessonModule(null)}
                    className="px-6 py-3 rounded-xl border-2 border-black font-bold hover:bg-black hover:text-white transition-all"
                  >
                    Close Lesson
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
