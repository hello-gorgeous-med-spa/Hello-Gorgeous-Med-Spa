export type CatalogGoalId =
  | "Lose Weight"
  | "Recovery & Performance"
  | "Intimacy"
  | "Hormones"
  | "Skin & Hair"
  | "Energy & Longevity"
  | "Supplies";

export type CatalogVariant = {
  strength: string;
  cost: number;
  retail: number;
};

export type CatalogProduct = {
  id: string;
  name: string;
  form: string;
  category: string;
  drugKey: string;
  goal: CatalogGoalId | string;
  perUnit: boolean;
  fromRetail: number;
  variants: CatalogVariant[];
};

export type CatalogGoal = {
  id: string;
  tag: string;
  blurb: string;
};

export type Monograph = {
  name?: string;
  tagline?: string;
  what?: string;
  benefits?: string[];
  howUsed?: string;
  contra?: string[];
  side?: string[];
  note?: string;
};

export type DosingPhase = {
  label: string;
  dose: string;
  freq: string;
};

export type DosingProtocol = {
  route?: string;
  summary?: string;
  howTo?: string;
  phases?: DosingPhase[];
};

export type SupplyDays = 30 | 90;

export type CatalogBundlePick = string[];

export type CatalogBundle = {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  pick: CatalogBundlePick[];
};
