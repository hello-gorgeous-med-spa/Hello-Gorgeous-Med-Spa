import type { PersonaId } from "@/lib/personas/types";

export type MascotVideoIntent =
  | "intro"
  | "education"
  | "reassurance"
  | "aesthetics"
  | "vision"
  | "oversight";

/** Mascot intro clips retired — static portraits + chat only. */
export const mascotVideos: Record<PersonaId, Record<string, string>> = {
  peppi: {},
  "beau-tox": {},
  "filla-grace": {},
  harmony: {},
  founder: {},
  ryan: {},
};

export const mascotImages: Record<PersonaId, { portrait: string; poster?: string }> = {
  peppi: {
    portrait: "/images/characters/peppi.png",
    poster: "/images/characters/peppi.png",
  },
  "beau-tox": {
    portrait: "/images/characters/beau.png",
    poster: "/images/characters/beau.png",
  },
  "filla-grace": {
    portrait: "/images/characters/filla-grace.png",
    poster: "/images/characters/filla-grace.png",
  },
  harmony: {
    portrait: "/images/characters/hello-gorgeous-mascot.png",
    poster: "/images/characters/hello-gorgeous-mascot.png",
  },
  founder: {
    portrait: "/images/characters/founder.png",
    poster: "/images/characters/founder.png",
  },
  ryan: {
    portrait: "/images/characters/ryan.png",
    poster: "/media/mascots/ryan-poster.jpg",
  },
};

export function getMascotVideoSrc(personaId: PersonaId, intent: MascotVideoIntent): string | null {
  const v = mascotVideos[personaId];
  return (v?.[intent] as string | undefined) ?? null;
}

export function pickMascotVideoIntentForContext({
  personaId,
  mode,
}: {
  personaId: PersonaId;
  mode:
    | "meet-team"
    | "home-spotlight"
    | "care-education"
    | "care-confidence"
    | "care-reassurance"
    | "care-safety";
}): MascotVideoIntent {
  if (personaId === "ryan") return "oversight";
  if (personaId === "founder") return "vision";
  if (personaId === "beau-tox") return mode === "care-education" ? "education" : "intro";
  if (personaId === "filla-grace") return mode === "care-education" ? "aesthetics" : "intro";
  if (personaId === "harmony") return mode === "care-education" ? "education" : "intro";
  if (personaId === "peppi") return mode === "care-reassurance" || mode === "care-confidence" ? "reassurance" : "intro";
  return "intro";
}
