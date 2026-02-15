import type { PersonaId } from "@/lib/personas/types";

export type MascotVideoIntent =
  | "intro"
  | "education"
  | "reassurance"
  | "aesthetics"
  | "vision"
  | "oversight";

export const mascotVideos: Record<PersonaId, Record<string, string>> = {
  peppi: {
    intro: "/videos/mascots/peppi/peppi-intro.mp4",
    reassurance: "/videos/mascots/peppi/peppi-reassurance.mp4",
  },
  "beau-tox": {
    intro: "/videos/mascots/beau-tox/beau-tox.mp4",
    education: "/videos/mascots/beau-tox/beau-tox.mp4",
  },
  "filla-grace": {
    // TODO: add filla-grace-intro.mp4 and filla-grace-aesthetics.mp4 under public/videos/mascots/filla-grace/
    intro: "/videos/mascots/founder/founder-vision.mp4",
    aesthetics: "/videos/mascots/founder/founder-vision.mp4",
  },
  harmony: {
    intro: "/videos/mascots/harmony/harmony-intro.mp4",
    education: "/videos/mascots/harmony/harmony-intro.mp4",
  },
  founder: {
    vision: "/videos/mascots/founder/founder-vision.mp4",
  },
  ryan: {
    intro: "/videos/mascots/ryan/ryan-intro.mp4",
    oversight: "/videos/mascots/ryan/ryan-intro.mp4",
  },
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

