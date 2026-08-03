/**
 * RE GEN Academy — Type Definitions
 * Staff training platform for Hello Gorgeous Med Spa
 */

export type Person = {
  id: string;
  first: string;
  name: string;
  role: string;
  initials: string;
};

export type LessonSection = {
  heading: string;
  paragraphs: string[];
  callout?: string;
  script?: { situation: string; say: string; why: string };
  bullets?: string[];
  escalate?: string[];
};

export type Lesson = {
  intro: string;
  sections: LessonSection[];
  keyTakeaways: string[];
  practiceScenario?: { question: string; bestAnswer: string; why: string };
};

export type Module = {
  id: string;
  num: string;
  tag: string;
  title: string;
  blurb: string;
  bullets: string[];
  mapsTo: string;
  mapsWhy: string;
  lesson?: Lesson;
};

export type Card = {
  name: string;
  alias: string;
  cat: string;
  what: string;
  studied: string;
  note: string;
  caution?: boolean;
};

export type QuizOption = {
  t: string;
  w: string;
};

export type Question = {
  cat: string;
  q: string;
  correct: number;
  options: QuizOption[];
};

export type Pair = {
  a: string;
  b: string;
};

export type TriageItem = {
  text: string;
  route: boolean;
  why: string;
};

export type CourseGoal = {
  num: string;
  title: string;
  body: string;
};

export type CourseStat = {
  n: string;
  label: string;
};

export type CourseFlag = {
  text: string;
};

export type Course = {
  id: string;
  label: string;
  meta: string;
  eyebrow: string;
  headline: string;
  intro: string;
  stats: CourseStat[];
  goalsHeading: string;
  goals: CourseGoal[];
  flagsHeading: string;
  flags: CourseFlag[];
  modules: Module[];
  deckHeadline: string;
  deck: Card[];
  quiz: Question[];
  matchHeadline: string;
  pairs: Pair[];
  triage: TriageItem[];
};

export type ArticleBlock =
  | { h: string }
  | { p: string }
  | { quote: string }
  | { callout: string }
  | { list: { text: string }[] };

export type Article = {
  id: string;
  cat: string;
  pinned?: boolean;
  title: string;
  dek: string;
  author: string;
  date: string;
  read: string;
  body: ArticleBlock[];
};

export type ResourceItem = {
  title: string;
  desc: string;
  type: 'PDF' | 'DOC' | 'SHEET' | 'ZIP' | 'LINK';
  owner: string;
  updated: string;
  href: string;
};

export type ResourceGroup = {
  name: string;
  note: string;
  items: ResourceItem[];
};

export type Script = {
  when: string;
  say: string;
  why: string;
};

export type CanDoItem = {
  text: string;
};

export type DevField = {
  key: string;
  desc: string;
};

export type AcademyMode = 'curriculum' | 'cards' | 'quiz' | 'match' | 'triage' | 'guardrails';
export type AcademySection = 'course' | 'blog' | 'resources';

export type AcademyProgress = Record<string, Record<string, boolean>>;
export type AcademyKnown = Record<string, boolean>;
export type AcademyReadSet = Record<string, boolean>;

export type AcademyState = {
  course: string;
  mode: AcademyMode;
  section: AcademySection;
  progress: AcademyProgress;
  known: AcademyKnown;
  readSet: AcademyReadSet;
  view: string;
};

export const STORAGE_KEY = 'hgRegen.v2';
