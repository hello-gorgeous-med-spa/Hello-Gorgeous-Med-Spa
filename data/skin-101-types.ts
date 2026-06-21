/** Shared types for Skin 101 Science Explainer pages */

export type ExplainerStat = { value: string; label: string };

export type ExplainerActiveCard = {
  category: string;
  title: string;
  bullets: string[];
  bestFor: string;
  frequency: string;
  accent?: "pink" | "teal" | "gold";
};

export type ExplainerPairRow = {
  name: string;
  pairsWell: string;
  avoid: string;
};

export type ExplainerStep = { step: number; title: string; bullets: string[] };

export type ExplainerTreatmentRow = {
  name: string;
  targets: string;
  bullets: string[];
  downtime: string;
  evidence?: "established" | "emerging";
};

export type ScienceExplainerContent = {
  slug: string;
  seriesLabel: string;
  heroAccent: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  intro: string;
  hashtags: string[];
  disclaimer: string;
  stats: ExplainerStat[];
  sections: ExplainerSection[];
  closingTitle: string;
  closingBody: string;
  pdfPath?: string;
};

export type ExplainerSection =
  | {
      id: string;
      navLabel: string;
      type: "prose";
      heading: string;
      body: string;
      stripe?: "white" | "rose";
    }
  | {
      id: string;
      navLabel: string;
      type: "actives";
      heading: string;
      subheading?: string;
      cards: ExplainerActiveCard[];
      stripe?: "white" | "rose";
    }
  | {
      id: string;
      navLabel: string;
      type: "callout";
      heading: string;
      body: string;
      variant: "info" | "warning" | "tip";
      stripe?: "white" | "rose";
    }
  | {
      id: string;
      navLabel: string;
      type: "pairing";
      heading: string;
      subheading?: string;
      rows: ExplainerPairRow[];
      stripe?: "white" | "rose";
    }
  | {
      id: string;
      navLabel: string;
      type: "steps";
      heading: string;
      steps: ExplainerStep[];
      stripe?: "white" | "rose";
    }
  | {
      id: string;
      navLabel: string;
      type: "bullets";
      heading: string;
      intro?: string;
      bullets: string[];
      stripe?: "white" | "rose";
    }
  | {
      id: string;
      navLabel: string;
      type: "treatments";
      heading: string;
      subheading?: string;
      rows: ExplainerTreatmentRow[];
      stripe?: "white" | "rose";
    };
