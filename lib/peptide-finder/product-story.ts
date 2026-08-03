import { HELLO_GORGEOUS_RX_START_PATH } from "@/lib/flows";
import { FIND_YOUR_PEPTIDE_PATH } from "@/lib/rx-patient-journey";

/** Boots-style product copy for the peptide finder (client-facing). */
export const PEPTIDE_FINDER_PRODUCT = {
  eyebrow: "Hello Gorgeous RX™ · Peptide finder",
  headline: "Stop guessing which peptide.",
  headlineAccent: "Match your goal first.",
  subhead:
    "Pick the wellness area that matters most — see the protocols our NP team commonly discusses, then book a consult to confirm what's medically appropriate for you.",
  statusChip: "NP review required",
  ctaLabel: "Start the finder",
  ctaHref: `${FIND_YOUR_PEPTIDE_PATH}#finder`,
} as const;

export type PeptideFinderOutcomeRow = {
  id: string;
  outcome: string;
  outcomeDetail: string;
  alone: string;
  withNp: string;
  aloneFill: number;
  withFill: number;
};

/** Educational before → after framing (not outcome guarantees). */
export const PEPTIDE_FINDER_OUTCOMES: PeptideFinderOutcomeRow[] = [
  {
    id: "fit",
    outcome: "Protocol fit",
    outcomeDetail: "Goal matched to compounds we actually discuss",
    alone: "Research alone",
    withNp: "NP-guided plan",
    aloneFill: 35,
    withFill: 92,
  },
  {
    id: "safety",
    outcome: "Medical screening",
    outcomeDetail: "History, meds, and labs reviewed before Rx",
    alone: "Self-selected",
    withNp: "Clinically screened",
    aloneFill: 28,
    withFill: 95,
  },
  {
    id: "path",
    outcome: "Clear next step",
    outcomeDetail: "From education to consult to fulfillment",
    alone: "Unclear path",
    withNp: "One Hello Gorgeous RX™ flow",
    aloneFill: 40,
    withFill: 88,
  },
];

export const PEPTIDE_FINDER_PIPELINE = [
  {
    step: "1",
    label: "Find your fit",
    detail: "Match your primary goal to peptides",
    tag: "You are here",
    href: `${FIND_YOUR_PEPTIDE_PATH}#finder`,
  },
  {
    step: "2",
    label: "Explore protocols",
    detail: "Read profiles & RE GEN catalog",
    tag: "Learn",
    href: "/rx/peptides",
  },
  {
    step: "3",
    label: "Book consult",
    detail: "$49 NP-led peptide visit",
    tag: "Oswego",
    href: HELLO_GORGEOUS_RX_START_PATH,
  },
  {
    step: "4",
    label: "Start therapy",
    detail: "Personalized Rx after review",
    tag: "RX",
    href: "/rx/request",
  },
] as const;
