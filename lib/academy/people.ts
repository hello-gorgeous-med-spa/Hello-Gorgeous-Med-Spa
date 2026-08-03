import type { Person, CanDoItem, Script, DevField } from './types';

export const PEOPLE: Person[] = [
  { id: 'danielle', first: 'Danielle', name: 'Danielle Alcala', role: 'Owner', initials: 'DA' },
  { id: 'ryan', first: 'Ryan', name: 'Ryan Kent, NP', role: 'Nurse Practitioner · sole prescriber', initials: 'RK' },
  { id: 'michelle', first: 'Michelle', name: 'Michelle', role: 'Office Manager', initials: 'M' },
  { id: 'laura', first: 'Laura', name: 'Laura', role: 'Marketing Manager', initials: 'L' },
];

export const CAN_DO: CanDoItem[] = [
  { text: 'Explain in general terms what something is and how a category works' },
  { text: 'Describe the services we offer and what a program looks like' },
  { text: 'Share our approved educational materials, handouts and posts' },
  { text: 'Quote published pricing and program structure' },
  { text: 'Say what a client can expect at their medical consult' },
  { text: 'Book the consult — always the right next step for a specific question' },
  { text: 'Answer with "that\'s a great question for Ryan" and mean it' },
];

export const CANNOT_DO: CanDoItem[] = [
  { text: 'Diagnose anything, or suggest what a client "probably has"' },
  { text: 'Recommend, confirm or adjust a dose, frequency or duration' },
  { text: 'Say whether a treatment is safe or appropriate for a specific person' },
  { text: 'Interpret a lab result — even an obvious one' },
  { text: 'Promise a specific result, timeline or amount of weight lost' },
  { text: 'Say something treats, cures, heals or prevents a condition' },
  { text: 'Compare us to another clinic, or comment on their care' },
  { text: "Discuss any client's chart, labs or history outside the care team — that's PHI" },
];

export const SCRIPTS: Script[] = [
  {
    when: 'They want a safety verdict',
    say: '"I can tell you what it\'s studied for — whether it\'s right for you is exactly what Ryan looks at in your consult."',
    why: 'Splits education from evaluation without sounding evasive.',
  },
  {
    when: 'They quote something from TikTok',
    say: '"I\'ve seen that one too. Here\'s what the research actually looks at — and Ryan can tell you how it applies to you."',
    why: 'Meets them where they are, then hands off.',
  },
  {
    when: 'They ask about a condition',
    say: '"I can\'t speak to a diagnosis, but I can get you in front of someone who can. Do you have twenty minutes this week?"',
    why: 'Turns a compliance dead-end into a booked appointment.',
  },
];

export const DEV_FIELDS: DevField[] = [
  { key: 'title', desc: 'What staff see on the card. Keep it to how people actually refer to the document.' },
  { key: 'desc', desc: "One sentence on what it's for and when to reach for it." },
  { key: 'type', desc: 'Short label shown in the corner chip: PDF, DOC, SHEET, ZIP, LINK.' },
  { key: 'href', desc: 'The share link or file path. Leave as "" and the card stays a dashed placeholder.' },
  { key: 'owner', desc: 'Who keeps this document current — the person to chase when it\'s stale.' },
  { key: 'updated', desc: 'Last-reviewed date, e.g. "Aug 2026". Leave as "Awaiting file" until it\'s live.' },
];

export const PERSON_COLORS: Record<string, [string, string]> = {
  danielle: ['#FF2D8E', '#fff'],
  ryan: ['#000', '#fff'],
  michelle: ['#FFC1E2', '#000'],
  laura: ['#FFD86B', '#000'],
};
