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
    // TODO: add harmony folder and harmony-intro.mp4 under public/videos/mascots/harmony/
    intro: "/videos/mascots/ryan/ryan-intro.mp4",
    education: "/videos/mascots/ryan/ryan-intro.mp4",
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
    portrait: "/media/mascots/peppi.png",
    poster: "/media/mascots/peppi-poster.jpg",
  },
  "beau-tox": {
    portrait: "/media/mascots/beau-tox.png",
    poster: "/media/mascots/beau-tox-poster.jpg",
  },
  "filla-grace": {
    portrait: "/media/mascots/filla-grace.png",
    poster: "/media/mascots/filla-grace-poster.jpg",
  },
  harmony: {
    portrait: "/media/mascots/harmony.png",
    poster: "/media/mascots/harmony-poster.jpg",
  },
  founder: {
    portrait: "/media/mascots/founder.png",
    poster: "/media/mascots/founder-poster.jpg",
  },
  ryan: {
    portrait: "/media/mascots/ryan.png",
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

