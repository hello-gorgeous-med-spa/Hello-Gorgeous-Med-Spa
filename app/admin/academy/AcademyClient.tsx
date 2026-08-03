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
              <span className="text-white/60 text-sm">Hello Gorgeous · Staff Training</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-sm">Team progress</span>
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
                  color: inCourse && courseId === id ? '#000' : 'rgba(255,255,255,0.7)',
                }}
              >
                {COURSES[id].label}
                <span className="ml-2 text-xs opacity-60">{COURSES[id].meta}</span>
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
                color: section === 'blog' ? '#000' : 'rgba(255,255,255,0.7)',
              }}
            >
              Journal<span className="ml-2 text-xs opacity-60">{ARTICLES.length}</span>
            </button>
            <button
              onClick={() => setSection('resources')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: section === 'resources' ? '#fff' : 'rgba(255,255,255,0.08)',
                color: section === 'resources' ? '#000' : 'rgba(255,255,255,0.7)',
              }}
            >
              Resources<span className="ml-2 text-xs opacity-60">{RESOURCES.reduce((n, g) => n + g.items.length, 0)}</span>
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
                    color: mode === m ? '#000' : 'rgba(0,0,0,0.5)',
                  }}
                >
                  {labels[m]}
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: mode === m ? '#FF2D8E' : 'rgba(0,0,0,0.07)',
                      color: mode === m ? '#fff' : 'rgba(0,0,0,0.5)',
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
              <h1 className="text-4xl font-black text-white mb-4">{course.headline}</h1>
              <p className="text-white/70 max-w-3xl mb-6">{course.intro}</p>
              <div className="flex gap-6">
                {course.stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-black text-[#FF2D8E]">{s.n}</div>
                    <div className="text-white/50 text-sm">{s.label}</div>
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
                      <div className="text-sm text-black/60">{g.body}</div>
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
                  <p className="text-black/50 text-sm">{isAll ? 'Pick a name to check modules off' : `${person?.role} · all ${ps.total} modules assigned`}</p>
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
                            <span className="text-xs text-black/50">{m.tag}</span>
                          </div>
                          <h3 className="font-bold text-lg" style={{ color: checked ? 'rgba(0,0,0,0.45)' : '#000' }}>{m.title}</h3>
                          <p className="text-sm text-black/60 mt-1">{m.blurb}</p>

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
                                <div className="text-black/60">{m.mapsWhy}</div>
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
                            <button onClick={() => setExpanded(isOpen ? null : m.id)} className="text-sm text-black/50 hover:underline">
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
              <p className="text-white/60 mb-4">{course.deck.length} flashcards · {knownCount} marked as known</p>

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
                      color: deckCat === c ? '#fff' : 'rgba(255,255,255,0.75)',
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
                    <div className="text-xs uppercase tracking-wider text-black/40 mb-2">{currentCard.cat}</div>
                    <h3 className="text-3xl font-black mb-2">{currentCard.name}</h3>
                    <div className="text-black/50">{currentCard.alias}</div>
                    <div className="mt-6 text-sm text-black/40">Click to flip</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-black/40 mb-1">What it is</div>
                      <p>{currentCard.what}</p>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-black/40 mb-1">What it&apos;s studied for</div>
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
                <div className="text-white/50 text-sm">Card {Math.min(ci + 1, dlist.length)} of {dlist.length}</div>
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
                  <span className="text-black/50">Question {qi + 1} of {qTotal}</span>
                  <span className="font-bold text-[#FF2D8E]">Score: {correctCount}</span>
                </div>
                <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] transition-all" style={{ width: `${Math.round((qi / qTotal) * 100)}%` }} />
                </div>

                {(() => {
                  const q = course.quiz[quizOrder[qi]];
                  return (
                    <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                      <div className="text-xs uppercase tracking-wider text-black/40 mb-2">{q.cat}</div>
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
                              textColor = 'rgba(0,0,0,0.5)';
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
                                    <div className="mt-2 text-sm" style={{ color: isCorrect ? '#16a34a' : isChosen ? '#dc2626' : 'rgba(0,0,0,0.35)' }}>
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
                <p className="text-black/60 mb-6">
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
                              <div className="text-sm text-black/60 mt-2">
                                <span className="text-red-600">You chose:</span> {q.options[a.chosen].t}
                              </div>
                              <div className="text-sm text-black/60">
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
                  <p className="text-black/50">Match each item on the left with its description</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-black/50">Solved: {solvedCount}/{course.pairs.length}</span>
                  <span className="text-black/50">Attempts: {tries}</span>
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
                  <p className="text-black/60 mb-6">
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
                  <span className="text-black/50">Situation {ti + 1} of {triTotal}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">Score: {triHits}/{ti + (triPick !== null ? 1 : 0)}</span>
                    <span className="text-black/50">Streak: {triStreak}</span>
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
                            <div className="text-sm text-black/50">Education, logistics, or policy</div>
                          </button>
                          <button
                            onClick={() => triAnswer(true)}
                            className="p-6 rounded-xl border-2 border-[#FF2D8E] hover:bg-[#FF2D8E] hover:text-white transition-all text-center"
                          >
                            <div className="text-3xl mb-2">🏥</div>
                            <div className="font-bold">Route to Ryan</div>
                            <div className="text-sm text-black/50">Clinical, safety, or suitability</div>
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
                            <p className="text-black/60">{item.why}</p>
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
                <p className="text-black/60 mb-6">
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
                    <div className="text-sm text-black/60">Why it works: {s.why}</div>
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
              <span className="text-black/50">{Object.keys(readSet).length} / {ARTICLES.length} read</span>
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
                  <p className="text-sm text-black/60 mb-3">{a.dek}</p>
                  <div className="text-xs text-black/40">{a.author} · {a.date} · {a.read} read</div>
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
              <p className="text-xl text-black/60 mb-4">{art.dek}</p>
              <div className="text-sm text-black/40 mb-8">{art.author} · {art.date} · {art.read} read</div>

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
              <div className="text-black/50">
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
                <p className="text-sm text-black/50 mb-6">{group.note}</p>

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
                        onClick={() => live && window.open(item.href, '_blank')}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold">{item.title}</h3>
                          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: bg, color: fg }}>{item.type}</span>
                        </div>
                        <p className="text-sm text-black/60 mb-2">{item.desc}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-black/40">{item.owner} · {live ? item.updated : 'Awaiting file'}</span>
                          <span style={{ color: live ? '#FF2D8E' : 'rgba(0,0,0,0.35)' }}>{live ? 'Open →' : 'Placeholder'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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
                    <h1 className="text-3xl font-black text-white mb-2">{lessonModule.title}</h1>
                    <p className="text-white/70">{lessonModule.blurb}</p>
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
                <p className="text-lg leading-relaxed text-black/80 mb-8 pb-8 border-b-2 border-black/10">{lessonContent.intro}</p>

                {/* Sections */}
                <div className="space-y-10">
                  {lessonContent.sections.map((section, sIdx) => (
                    <div key={sIdx}>
                      <h2 className="text-xl font-bold text-[#E6007E] mb-4">{section.heading}</h2>
                      
                      {/* Paragraphs */}
                      <div className="space-y-4 mb-4">
                        {section.paragraphs.map((p, pIdx) => (
                          <p key={pIdx} className="text-base leading-relaxed text-black/80">{p}</p>
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
                              <span className="text-base text-black/80">{b}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Script */}
                      {section.script && (
                        <div className="my-6 rounded-xl bg-gradient-to-br from-[#0a0a0a] to-[#1a0510] p-5 border-2 border-black">
                          <div className="text-xs uppercase tracking-wider text-[#FFB8DC] mb-2">When: {section.script.situation}</div>
                          <div className="text-white text-base italic mb-3">&ldquo;{section.script.say}&rdquo;</div>
                          <div className="text-sm text-[#FFB8DC]">Why it works: {section.script.why}</div>
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
                        <span className="text-sm text-black/80">{t}</span>
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
                      <p className="text-sm text-black/80">{lessonContent.practiceScenario.bestAnswer}</p>
                    </div>
                    <p className="text-xs text-black/60"><span className="font-bold">Why:</span> {lessonContent.practiceScenario.why}</p>
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
